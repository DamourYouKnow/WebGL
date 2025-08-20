import { InputManager } from "./InputManager";
import Scene from "./Scene";

export abstract class App {
    public static Instance: App;

    // TODO: Encapsulate, make private
    public readonly Context: WebGLRenderingContext = null;
    public readonly Canvas: HTMLCanvasElement;

    private scenes: Scene[];
    private activeScene: Scene;
    
    public readonly Input: InputManager;

    private previousTimestamp: number = 0.0;
    private runtime: number = 0.0;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.Context = canvas.getContext("webgl");

        App.Instance = this;

        this.Input = new InputManager(canvas);
        
        this.Initialize().then(() => {
            this.startUpdateLoop();
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
        this.Context.clear(
            this.Context.COLOR_BUFFER_BIT | this.Context.DEPTH_BUFFER_BIT
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
