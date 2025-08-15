import { App } from '../Core/App';
import { Vector3 } from '../Core/Math/Vector';
import { Matrix4 } from '../Core/Math/Matrix';
import { ShaderProgram } from '../Core/Shader';
import { Key } from '../Core/InputManager';
import { Shapes } from '../Core/Geometry';

export default class TestApp extends App {
    public async Initialize() {
        this.Input.OnKeyDown(Key.W, () => console.log('W key pressed'));
        this.Input.OnKeyUp(Key.W, () => console.log('W key released'));
    
        const shape = Shapes.sphere(1, 32);

        const shaderProgram = await ShaderProgram.Load(
            this.Context,
            '3D/basic_vertex.glsl', 
            'basic_fragment.glsl'
        );

        shape.SetShaderProgram(shaderProgram);

        const positionLocation = this.Context.getAttribLocation(
            shaderProgram.GetProgram(), 
            "a_position"
        );

        const projectionMatrixLocation = this.Context.getUniformLocation(
            shaderProgram.GetProgram(),
            "u_projectionMatrix"
        );

        const modelViewMatrixLocation = this.Context.getUniformLocation(
            shaderProgram.GetProgram(),
            "u_modelViewMatrix"
        );

        this.Context.useProgram(shaderProgram.GetProgram());

        this.Context.viewport(0, 0, this.Canvas.width, this.Canvas.height);

        this.Context.clearColor(0.5, 0.5, 0.5, 0.9);
        this.Context.clearDepth(1.0);
        this.Context.enable(this.Context.DEPTH_TEST);
        this.Context.depthFunc(this.Context.LEQUAL);

        this.Context.clear(
            this.Context.COLOR_BUFFER_BIT | this.Context.DEPTH_BUFFER_BIT
        );

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
            new Vector3(0, 0, -4),
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
        
    }
}