import init, {
    brightness,
    contrast,
    grayscale,
    convolution
} from "./pkg/wasm_demo.js";

let ready = false;

const BLUR = new Float32Array([
    1, 2, 1,
    2, 4, 2,
    1, 2, 1
]);

const SHARPEN = new Float32Array([
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
]);

self.onmessage = async (e) => {
    if (!ready) {
        await init();
        ready = true;
    }

    const { pixels, width, height, brightness: b, contrast: c, op } = e.data;

    brightness(pixels, b);
    contrast(pixels, c);

    if (op === "vintage") {
        grayscale(pixels, true);
        contrast(pixels, -15);
    }

    if (op === "vivid") {
        brightness(pixels, 20);
        contrast(pixels, 30);
    }

    if (op === "noir") {
        grayscale(pixels, true);
        contrast(pixels, 40);
    }

    if (op === "blur") {
        convolution(pixels, width, height, BLUR, 1 / 16);
    }

    if (op === "sharpen") {
        convolution(pixels, width, height, SHARPEN, 1);
    }

    self.postMessage(pixels, [pixels.buffer]);
};
