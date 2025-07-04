import { Shapes } from "./geometry";
import { requestFile } from "./web";

main();

async function main() {
    return
}

function createCanvas(): HTMLCanvasElement {
    const container = document.getElementById('canvas-container');
    if (!container) throw Error('No element with id "canvas-container"');

    const canvas = document.createElement('canvas');
    canvas.id = 'app-canvas';
    canvas.width = 1280;
    canvas.height = 720;

    container.appendChild(canvas);
    return canvas;
}

function browserSupportsWebGL(): boolean {
    return false;
}