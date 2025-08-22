import { App } from '../Core/App';
import { Vector3 } from '../Core/Math/Vector';
import { Matrix4 } from '../Core/Math/Matrix';
import { ShaderProgram } from '../Core/Shader';
import { Key } from '../Core/InputManager';
import { Mesh3, Shapes } from '../Core/Geometry';

export default class TestApp extends App {
    private sp: ShaderProgram;
    private shape: Mesh3;

    public async Initialize() {
        this.Input.OnKeyDown(Key.W, () => console.log('W key pressed'));
        this.Input.OnKeyUp(Key.W, () => console.log('W key released'));
    
        const radius = 2;
        const shape = Shapes.sphere(radius, 32);

        const shaderProgram = await ShaderProgram.Load(
            this.Context,
            '3D/wireframe_vertex.glsl', 
            '3D/wireframe_fragment.glsl'
        );
        this.sp = shaderProgram;
        this.shape = shape;

        shape.SetShaderProgram(shaderProgram);

        /*
        const positionLocation = this.Context.getAttribLocation(
            shaderProgram.GetProgram(), 
            "a_position"
        );
        */

        const projectionMatrixLocation = this.Context.getUniformLocation(
            shaderProgram.GetProgram(),
            "u_projectionMatrix"
        );

        const modelViewMatrixLocation = this.Context.getUniformLocation(
            shaderProgram.GetProgram(),
            "u_modelViewMatrix"
        );

        // Add some color for fun
        /*
        const vertices = Array.from(shape.Vertices());
        const colors = vertices.reduce((acc, cur, i) => {
            const value = (1 * Math.abs(cur)) / radius;
            if ((i + 1) % 3 == 0) {
                return [...acc, value, 1];
            }
            return [...acc, value];
        }, []);

        const colorLocation = this.Context.getAttribLocation(
            shaderProgram.GetProgram(),
            "a_color"
        );

        const colorBuffer = this.Context.createBuffer();
        this.Context.bindBuffer(
            this.Context.ARRAY_BUFFER,
            colorBuffer
        );
        this.Context.bufferData(
            this.Context.ARRAY_BUFFER,
            new Float32Array(colors),
            this.Context.STATIC_DRAW
        );
        this.Context.vertexAttribPointer(
            colorLocation,
            4,
            this.Context.FLOAT,
            false,
            0,
            0
        );
        this.Context.enableVertexAttribArray(colorLocation);
        */

        this.Context.useProgram(shaderProgram.GetProgram());

        this.Context.viewport(0, 0, this.Canvas.width, this.Canvas.height);

        this.Context.clearColor(0.5, 0.5, 0.5, 0.9);
        this.Context.clearDepth(1.0);
        this.Context.enable(this.Context.DEPTH_TEST);
        this.Context.depthFunc(this.Context.LEQUAL);

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
            new Vector3(0, 0, -8),
            Vector3.Up,
            Vector3.Zero
        );

        this.Context.uniformMatrix4fv(
            projectionMatrixLocation,
            false,
            projectionMatrix.ValuesColumnMajor()
        );

        this.Context.uniformMatrix4fv(
            modelViewMatrixLocation,
            false,
            viewMatrix.ValuesColumnMajor()
        );

        shape.Render(this.Context);
    }

    public Update(deltaTime: number) {
        this.shape.Render(this.Context, true);
        return;

        const runtime = this.GetRuntime();
        const speed = runtime * 5;

        const cameraPosition = new Vector3(
            Math.sin(speed),
            0, 
            Math.cos(speed)
        ).Normalize().Scale(8);

        const viewMatrix = Matrix4.CreateView(
            cameraPosition,
            Vector3.Up,
            Vector3.Zero
        );

        const modelViewMatrixLocation = this.Context.getUniformLocation(
            this.sp.GetProgram(),
            "u_modelViewMatrix"
        );

        this.Context.uniformMatrix4fv(
            modelViewMatrixLocation,
            false,
            viewMatrix.ValuesColumnMajor()
        );

        this.shape.Render(this.Context, true);
    }
}