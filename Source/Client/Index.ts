import TestApp from './Demos/TestApp';

main();

function main() {
    const canvas = createCanvas();
    if (!canvas) return;

    new TestApp(canvas);
}

function createCanvas(): HTMLCanvasElement {
    const container = document.getElementById('canvas-container');
    if (!container) throw Error('No element with id "canvas-container"');

    const canvas = document.createElement('canvas');
    canvas.id = 'app-canvas';
    canvas.width = 600;
    canvas.height = 400;

    container.appendChild(canvas);
    return canvas;
}
