const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("upload");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");

const worker = new Worker("worker.js", { type: "module" });

let imageData = null;
let originalPixels = null;

// Undo / Redo
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 20;

function saveState() {
    if (!imageData) return;
    undoStack.push(new Uint8ClampedArray(imageData.data));
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack.length = 0;
}

function undo() {
    if (!undoStack.length) return;
    redoStack.push(new Uint8ClampedArray(imageData.data));
    imageData.data.set(undoStack.pop());
    ctx.putImageData(imageData, 0, 0);
}

function redo() {
    if (!redoStack.length) return;
    undoStack.push(new Uint8ClampedArray(imageData.data));
    imageData.data.set(redoStack.pop());
    ctx.putImageData(imageData, 0, 0);
}

worker.onmessage = (e) => {
    const pixels = new Uint8ClampedArray(e.data);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
};

function process(op) {
    if (!imageData || !originalPixels) return;

    saveState();

    const pixelsCopy = new Uint8ClampedArray(originalPixels);

    worker.postMessage({
        pixels: pixelsCopy,
        width: canvas.width,
        height: canvas.height,
        brightness: +brightnessSlider.value,
        contrast: +contrastSlider.value,
        op
    }, [pixelsCopy.buffer]);
}

// Upload
upload.onchange = (e) => {
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(0, 0, img.width, img.height);
        originalPixels = new Uint8ClampedArray(imageData.data);
        undoStack.length = redoStack.length = 0;
    };
    img.src = URL.createObjectURL(e.target.files[0]);
};

// Sliders
brightnessSlider.oninput = () => process("adjust");
contrastSlider.oninput = () => process("adjust");

// Presets
document.getElementById("vintage").onclick = () => process("vintage");
document.getElementById("vivid").onclick = () => process("vivid");
document.getElementById("noir").onclick = () => process("noir");

// Filters
document.getElementById("blur").onclick = () => process("blur");
document.getElementById("sharpen").onclick = () => process("sharpen");

// Transform
document.getElementById("rotate").onclick = () => {
    saveState();
    const t = document.createElement("canvas");
    t.width = canvas.height;
    t.height = canvas.width;
    const tctx = t.getContext("2d");
    tctx.translate(t.width / 2, t.height / 2);
    tctx.rotate(Math.PI / 2);
    tctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    canvas.width = t.width;
    canvas.height = t.height;
    ctx.drawImage(t, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    originalPixels = new Uint8ClampedArray(imageData.data);
};

document.getElementById("resize").onclick = () => {
    saveState();
    const scale = 0.5;
    const t = document.createElement("canvas");
    t.width = canvas.width * scale;
    t.height = canvas.height * scale;
    t.getContext("2d").drawImage(canvas, 0, 0, t.width, t.height);
    canvas.width = t.width;
    canvas.height = t.height;
    ctx.drawImage(t, 0, 0);
    imageData = ctx.getImageData(0, 0, t.width, t.height);
    originalPixels = new Uint8ClampedArray(imageData.data);
};

// History buttons
document.getElementById("undo").onclick = undo;
document.getElementById("redo").onclick = redo;

// Reset
document.getElementById("reset").onclick = () => {
    if (!originalPixels) return;
    imageData.data.set(originalPixels);
    ctx.putImageData(imageData, 0, 0);
};

// Download
document.getElementById("download").onclick = () => {
    const a = document.createElement("a");
    a.download = "edited.png";
    a.href = canvas.toDataURL();
    a.click();
};
