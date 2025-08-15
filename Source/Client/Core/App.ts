import { InputManager } from "./InputManager";

export abstract class App {
    public static Instance: App;

    // TODO: Encapsulate, make private
    public readonly Context: WebGLRenderingContext = null;
    public readonly Canvas: HTMLCanvasElement;
    
    public readonly Input: InputManager;

    private previousTimestamp: number = 0.0;

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

    public Render() {
        throw Error("Not implemented");
    }

    private startUpdateLoop() {
        const updateLoop = (currentTimestamp: number) => {
            const deltaTimeMilliseconds = currentTimestamp 
                - this.previousTimestamp;

            this.previousTimestamp = currentTimestamp;

            const deltaTimeSeconds = deltaTimeMilliseconds * 0.001;
        
            this.Update(deltaTimeSeconds);

            requestAnimationFrame(updateLoop);
        };

        requestAnimationFrame(updateLoop);
    }
}
