import { App } from '../Core/App';
import { Vector3 } from '../Core/Math/Vector';
import { Matrix4 } from '../Core/Math/Matrix';
import { Shaders, ShaderProgram } from '../Core/Graphics/Shader';
import { Key } from '../Core/InputManager';
import { Mesh3, Shapes } from '../Core/Graphics/Geometry';

export default class TestApp extends App {
    private sp: ShaderProgram;
    private shape: Mesh3;

    public async Initialize() {
        this.Input.OnKeyDown(Key.W, () => console.log('W key pressed'));
        this.Input.OnKeyUp(Key.W, () => console.log('W key released'));
    
        const shaderProgram = Shaders.color3D;
        this.sp = shaderProgram;

        const radius = 2;
        const shape = Shapes.sphere(shaderProgram, radius, 8);


        this.shape = shape;

        /*
        const positionLocation = this.Context.getAttribLocation(
            shaderProgram.GetProgram(), 
            "a_position"
        );
        */

        const projectionMatrixLocation = this.Context.WebGL.getUniformLocation(
            shaderProgram.GetProgram(),
            "u_projectionMatrix"
        );

        const modelViewMatrixLocation = this.Context.WebGL.getUniformLocation(
            shaderProgram.GetProgram(),
            "u_modelViewMatrix"
        );

        // Add some color for fun
        const vertices = Array.from(shape.Vertices());
        const colors = vertices.reduce((acc, cur, i) => {
            const value = (1 * Math.abs(cur)) / radius;
            if ((i + 1) % 3 == 0) {
                return [...acc, value, 1];
            }
            return [...acc, value];
        }, []);

        const colorLocation = this.Context.WebGL.getAttribLocation(
            shaderProgram.GetProgram(),
            "a_color"
        );

        const colorBuffer = this.Context.WebGL.createBuffer();
        this.Context.WebGL.bindBuffer(
            this.Context.WebGL.ARRAY_BUFFER,
            colorBuffer
        );
        this.Context.WebGL.bufferData(
            this.Context.WebGL.ARRAY_BUFFER,
            new Float32Array(colors),
            this.Context.WebGL.STATIC_DRAW
        );
        this.Context.WebGL.vertexAttribPointer(
            colorLocation,
            4,
            this.Context.WebGL.FLOAT,
            false,
            0,
            0
        );
        this.Context.WebGL.enableVertexAttribArray(colorLocation);
    

        this.Context.WebGL.useProgram(shaderProgram.GetProgram());

        this.Context.WebGL.viewport(
            0, 0, 
            this.Canvas.width, this.Canvas.height
        );

        this.Context.WebGL.clearColor(0.5, 0.5, 0.5, 0.9);
        this.Context.WebGL.clearDepth(1.0);
        this.Context.WebGL.enable(this.Context.WebGL.DEPTH_TEST);
        this.Context.WebGL.depthFunc(this.Context.WebGL.LEQUAL);

        const fieldOfView = 45;
        const aspect = this.Canvas.width / this.Canvas.height;
        const zNear = 0.1;
        const zFar = 100;

        const projectionMatrix = Matrix4.CreatePerspectiveHorizontalFOV(
            fieldOfView, 
            aspect,
            zNear, zFar
        );

        const viewMatrix = Matrix4.CreateView(
            new Vector3(0, 2, -8),
            Vector3.Up,
            Vector3.Zero
        );

        this.Context.WebGL.uniformMatrix4fv(
            projectionMatrixLocation,
            false,
            projectionMatrix.ValuesColumnMajor()
        );

        this.Context.WebGL.uniformMatrix4fv(
            modelViewMatrixLocation,
            false,
            viewMatrix.ValuesColumnMajor()
        );

        shape.Render(this.Context);
    }

    public Update(deltaTime: number) {
        //this.shape.Render(this.Context, false);
        //return;

        const runtime = this.GetRuntime();
        const speed = runtime * 2.5;

        const cameraPosition = new Vector3(
            Math.sin(speed),
            Math.sin(speed * 0.5), 
            Math.cos(speed)
        ).Normalize().Scale(8);

        const viewMatrix = Matrix4.CreateView(
            cameraPosition,
            Vector3.Up,
            Vector3.Zero
        );

        const modelViewMatrixLocation = this.Context.WebGL.getUniformLocation(
            this.sp.GetProgram(),
            "u_modelViewMatrix"
        );

        this.Context.WebGL.uniformMatrix4fv(
            modelViewMatrixLocation,
            false,
            viewMatrix.ValuesColumnMajor()
        );

        this.shape.Render(this.Context, false);
    }
}