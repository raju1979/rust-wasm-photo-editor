use wasm_bindgen::prelude::*;
use console_error_panic_hook;
use core::arch::wasm32::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn start() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn brightness(pixels: &mut [u8], value: i16) {
    for i in (0..pixels.len()).step_by(4) {
        for c in 0..3 {
            let v = pixels[i + c] as i16 + value;
            pixels[i + c] = v.clamp(0, 255) as u8;
        }
    }
}

#[wasm_bindgen]
pub fn contrast(pixels: &mut [u8], value: f32) {
    let factor = (259.0 * (value + 255.0)) / (255.0 * (259.0 - value));
    for i in (0..pixels.len()).step_by(4) {
        for c in 0..3 {
            let v = factor * (pixels[i + c] as f32 - 128.0) + 128.0;
            pixels[i + c] = v.clamp(0.0, 255.0) as u8;
        }
    }
}

#[wasm_bindgen]
pub fn grayscale(pixels: &mut [u8], enabled: bool) {
    if !enabled {
        return;
    }
    for i in (0..pixels.len()).step_by(4) {
        let gray = (0.299 * pixels[i] as f32
            + 0.587 * pixels[i + 1] as f32
            + 0.114 * pixels[i + 2] as f32) as u8;

        pixels[i] = gray;
        pixels[i + 1] = gray;
        pixels[i + 2] = gray;
    }
}

#[wasm_bindgen]
pub fn convolution(
    pixels: &mut [u8],
    width: usize,
    height: usize,
    kernel: &[f32],
    factor: f32,
) {
    let mut output = pixels.to_vec();

    for y in 1..height - 1 {
        for x in 1..width - 1 {
            let idx = (y * width + x) * 4;

            for c in 0..3 {
                let mut acc = 0.0;

                for ky in 0..3 {
                    for kx in 0..3 {
                        let px = x + kx - 1;
                        let py = y + ky - 1;
                        let pidx = (py * width + px) * 4 + c;

                        acc += pixels[pidx] as f32
                            * kernel[ky * 3 + kx];
                    }
                }

                output[idx + c] =
                    (acc * factor).clamp(0.0, 255.0) as u8;
            }
        }
    }

    pixels.copy_from_slice(&output);
}

#[wasm_bindgen]
pub fn brightness_simd(pixels: &mut [u8], value: i16) {
    let delta = i16x8_splat(value);

    let len = pixels.len();
    let mut i = 0;

    // Process 16 bytes (one v128) at a time
    while i + 16 <= len {
        unsafe {
            let ptr = pixels.as_mut_ptr().add(i);

            let v = v128_load(ptr as *const v128);

            let low = i16x8_extend_low_u8x16(v);
            let high = i16x8_extend_high_u8x16(v);

            let low = i16x8_add(low, delta);
            let high = i16x8_add(high, delta);

            let out = u8x16_narrow_i16x8(low, high);

            v128_store(ptr as *mut v128, out);
        }

        i += 16;
    }

    // Handle remaining pixels safely
    for j in i..len {
        let v = pixels[j] as i16 + value;
        pixels[j] = v.clamp(0, 255) as u8;
    }
}
