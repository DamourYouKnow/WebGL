import { Shapes } from "./Geometry";
import { Matrix4 } from "./Math/Matrix";
import { Vector3 } from "./Math/Vector";
import { ShaderProgram } from "./Shader";

let webgl: WebGLRenderingContext = null;

export class App {
    public static Instance: App;

    // TODO: Encapsulate, make private
    public Context: WebGLRenderingContext = null;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.Context = canvas.getContext("webgl");
        webgl = this.Context;

        App.Instance = this;
    }

    public Update(deltaTime: number) {

    }

    public CreateUniform(): WebGLUniformLocation {
        throw Error("Not implemented");
    }

    public SetUniform() {
        throw Error("Not implemented");
    }

    public Render() {
        throw Error("Not implemented");
    }
}

matrixTest();

async function colorTest() {
    const canvas = createCanvas();
    if (!canvas) return;
    

    const app = new App(canvas);

    const shape = Shapes.circle(0.5, 32);

    const shaderProgram = await ShaderProgram.Load(
        webgl,
        'color_vertex.glsl', 
        'color_fragment.glsl'
    );

    shape.SetShaderProgram(shaderProgram);

    const colorBuffer = webgl.createBuffer();

    const colorValues = shape.Vertices().reduce((acc, _, i) => {
        return (i + 1) % 2 == 0 ?  [
            ...acc, 
            Math.random(),
            Math.random(),
            Math.random(),
            1.0
        ] : acc;
    }, []);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(colorValues), webgl.STATIC_DRAW);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, null);

    const positionLocation = webgl.getAttribLocation(
        shaderProgram.GetProgram(), 
        "a_position"
    );
    const colorLocation = webgl.getAttribLocation(
        shaderProgram.GetProgram(),
        "a_color"
    );

    webgl.bindBuffer(webgl.ARRAY_BUFFER, shape.GetVertexBuffer());
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0); 
    webgl.enableVertexAttribArray(positionLocation);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
    webgl.vertexAttribPointer(colorLocation, 4, webgl.FLOAT, false, 0, 0); 
    webgl.enableVertexAttribArray(colorLocation);
   
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, shape.GetIndexBuffer());

    webgl.useProgram(shaderProgram.GetProgram());

    webgl.clearColor(0.5, 0.5, 0.5, 0.9);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.viewport(0, 0, canvas.width, canvas.height);

    webgl.drawElements(
        webgl.TRIANGLES, 
        shape.IndexCount(),
        webgl.UNSIGNED_SHORT,
        0
    );
}


async function matrixTest() {
    const canvas = createCanvas();
    if (!canvas) return;

    const app = new App(canvas);
    
    const shape = Shapes.rectangle(0.5, 0.5);

    const shaderProgram = await ShaderProgram.Load(
        webgl,
        'basic_vertex.glsl', 
        'basic_fragment.glsl'
    );

    shape.SetShaderProgram(shaderProgram);

    const positionLocation = webgl.getAttribLocation(
        shaderProgram.GetProgram(), 
        "a_position"
    );

    const projectionMatrixLocation = webgl.getUniformLocation(
        shaderProgram.GetProgram(),
        "u_projectionMatrix"
    );

    const modelViewMatrixLocation = webgl.getUniformLocation(
        shaderProgram.GetProgram(),
        "u_modelViewMatrix"
    );

    webgl.useProgram(shaderProgram.GetProgram());

    webgl.viewport(0, 0, canvas.width, canvas.height);

    webgl.clearColor(0.5, 0.5, 0.5, 0.9);
    webgl.clearDepth(1.0);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.depthFunc(webgl.LEQUAL);

    webgl.clear(
        webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT
    );

    const fieldOfView = 45;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 100;

    const projectionMatrix = Matrix4.CreatePerspectiveHorizontalFOV(
        fieldOfView, 
        aspect,
        zNear, zFar
    );

    const viewMatrix = Matrix4.CreateView(
        new Vector3(5, 0, -5),
        Vector3.Up,
        Vector3.Zero
    );

    webgl.uniformMatrix4fv(
        projectionMatrixLocation,
        false,
        projectionMatrix.ValuesColumnMajor()
    );

    webgl.uniformMatrix4fv(
        modelViewMatrixLocation,
        false,
        viewMatrix.ValuesColumnMajor()
    );

    shape.Render(webgl);
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

function browserSupportsWebGL(): boolean {
    return false;
}