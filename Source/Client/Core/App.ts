import { Context } from "./Graphics/Graphics";
import { InputManager } from "./InputManager";
import { Shaders, loadShaderPresets } from "./Graphics/Shader";
import Scene from "./Scene";

export abstract class App {
    public static Instance: App;

    // TODO: Encapsulate, make private
    // TODO: Context management to avoid passing this property everywhere
    public readonly Context: Context = null;

    // TODO: Move canvas to Scene to allow multi-context apps
    public readonly Canvas: HTMLCanvasElement;

    private scenes: Scene[];
    private activeScene: Scene;

    public WireframeMode: boolean = false;
    
    public readonly Input: InputManager;

    private previousTimestamp: number = 0.0;
    private runtime: number = 0.0;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.Context = new Context(canvas.getContext("webgl"));

        App.Instance = this;

        this.Input = new InputManager(canvas);
        
        loadShaderPresets(this.Context).then(() => {
            return this.Initialize();
        }).then(() => {
            this.startUpdateLoop();
        }).catch((err) => {
            console.error(err);
        });
    }

    public abstract Initialize(): Promise<void>;
    public abstract Update(deltaTime: number);

    public CreateUniform(): WebGLUniformLocation {
        throw Error("Not implemented");
    }

    public SetUniform() {
        throw Error("Not implemented");
    }

    public GetRuntime(): number {
        return this.runtime;
    }

    private renderStart() {
        this.Context.WebGL.clear(
            this.Context.WebGL.COLOR_BUFFER_BIT |
                 this.Context.WebGL.DEPTH_BUFFER_BIT
        );
    }

    private renderEnd() {
        return;
    }

    private startUpdateLoop() {
        const updateLoop = (currentTimestamp: number) => {
            const deltaTimeMilliseconds = currentTimestamp 
                - this.previousTimestamp;

            this.previousTimestamp = currentTimestamp;

            const deltaTimeSeconds = deltaTimeMilliseconds * 0.001;
            this.runtime += deltaTimeSeconds;

            this.renderStart();
            this.Update(deltaTimeSeconds);
            this.renderEnd();

            requestAnimationFrame(updateLoop);
        };

        requestAnimationFrame(updateLoop);
    }
}
