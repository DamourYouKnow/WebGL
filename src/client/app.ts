import { Shapes } from "./geometry";
import { Matrix4 } from "./math/matrix";
import { Vector3 } from "./math/vector";
import { requestFile } from "./web";

let webgl: WebGLRenderingContext = null;

class App {
    // TODO: Encapsulate, make private
    public Context: WebGLRenderingContext = null;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.Context = canvas.getContext("webgl");
        webgl = this.Context;
    }

    // TODO: Return none if error?
    public async LoadShaderProgram(
        vertexPath: string, 
        framentPath: string
    ): Promise<WebGLProgram> {
        if (!this.Context) return;

        const vertexShaderSource = await requestFile(`shaders/${vertexPath}`);
        const fragmentShaderSource = await requestFile(`shaders/${framentPath}`);

        const vertexShader = this.LoadShader(vertexShaderSource, "Vertex");
        const fragmentShader = this.LoadShader(fragmentShaderSource, "Fragment");

        const shaderProgram = this.Context.createProgram();
        
        this.Context.attachShader(shaderProgram, vertexShader);
        this.Context.attachShader(shaderProgram, fragmentShader);

        this.Context.linkProgram(shaderProgram);

        const linkStatus = this.Context.getProgramParameter(
            shaderProgram, 
            this.Context.LINK_STATUS
        );

        if (!linkStatus) {
            const errMessage = 'Shader program link error:\n'
                + this.Context.getProgramInfoLog(shaderProgram);

            throw Error(errMessage);
        }

        return shaderProgram;
    }

    public LoadShader(
        source: string,
        type: "Vertex" | "Fragment"
    ): WebGLShader {
        if (!this.Context) return;

        const shaderTypes = {
            "Vertex": this.Context.VERTEX_SHADER,
            "Fragment": this.Context.FRAGMENT_SHADER
        };

        if (!(type in shaderTypes)) return;

        const shader = this.Context.createShader(shaderTypes[type]);
        
        this.Context.shaderSource(shader, source);
        this.Context.compileShader(shader);
    
        const compileStatus = this.Context.getShaderParameter(
            shader, 
            this.Context.COMPILE_STATUS
        );

        if (!compileStatus) {
            const errMessage = 'Shader compilation error:\n'
                + this.Context.getShaderInfoLog(shader);
        
            this.Context.deleteShader(shader);

            throw Error(errMessage);
        }

        return shader;
    }

    public Render() {
        throw Error("Not implemented");
    }
}

matrixTest();

async function colorTest() {
    const canvas = createCanvas();
    if (!canvas) return;
    
    const shape = Shapes.circle(0.5, 32);

    const app = new App(canvas);

    const vertexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, shape.Vertices(), webgl.STATIC_DRAW);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, null);

    const indexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, shape.Indices(), webgl.STATIC_DRAW);
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, null);

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

    const shaderProgram = await app.LoadShaderProgram(
        'color_vertex.glsl', 
        'color_fragment.glsl'
    );

    const positionLocation = webgl.getAttribLocation(
        shaderProgram, 
        "a_position"
    );
    const colorLocation = webgl.getAttribLocation(
        shaderProgram,
        "a_color"
    );

    webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0); 
    webgl.enableVertexAttribArray(positionLocation);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
    webgl.vertexAttribPointer(colorLocation, 4, webgl.FLOAT, false, 0, 0); 
    webgl.enableVertexAttribArray(colorLocation);
   
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    webgl.useProgram(shaderProgram);

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
    
    const shape = Shapes.rectangle(0.5, 0.5);

    const app = new App(canvas);

    const vertexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, shape.Vertices(), webgl.STATIC_DRAW);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, null);

    const indexBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, shape.Indices(), webgl.STATIC_DRAW);
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, null);

    const shaderProgram = await app.LoadShaderProgram(
        'basic_vertex.glsl', 
        'basic_fragment.glsl'
    );

    const positionLocation = webgl.getAttribLocation(
        shaderProgram, 
        "a_position"
    );

    const projectionMatrixLocation = webgl.getUniformLocation(
        shaderProgram,
        "u_projectionMatrix"
    );

    const modelViewMatrixLocation = webgl.getUniformLocation(
        shaderProgram,
        "u_modelViewMatrix"
    );

    webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0); 
    webgl.enableVertexAttribArray(positionLocation);
   
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    webgl.useProgram(shaderProgram);

    webgl.viewport(0, 0, canvas.width, canvas.height);

    webgl.clearColor(0.5, 0.5, 0.5, 0.9);
    webgl.clearDepth(1.0);
    webgl.enable(webgl.DEPTH_TEST);
    webgl.depthFunc(webgl.LEQUAL);

    webgl.clear(
        webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT
    );

    const fieldOfView = (45.0 * Math.PI) / 180.0;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 100;

    const projectionMatrix = Matrix4.CreatePerspectiveHorizontalFOV(
        fieldOfView, 
        aspect,
        zNear, zFar
    );

    const viewMatrix = Matrix4.CreateView(
        new Vector3(0, 0, -10),
        Vector3.Up,
        Vector3.Zero
    );

    webgl.uniformMatrix4fv(
        projectionMatrixLocation,
        false,
        projectionMatrix.Values()
    );

    webgl.uniformMatrix4fv(
        modelViewMatrixLocation,
        false,
        viewMatrix.Values()
    );

    webgl.drawElements(
        webgl.TRIANGLES, 
        shape.IndexCount(),
        webgl.UNSIGNED_SHORT,
        0
    );
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