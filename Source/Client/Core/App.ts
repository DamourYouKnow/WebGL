import { InputManager, Key } from "./InputManager";

let webgl: WebGLRenderingContext = null;

export abstract class App {
    public static Instance: App;

    // TODO: Encapsulate, make private
    public readonly Context: WebGLRenderingContext = null;
    public readonly Canvas: HTMLCanvasElement;
    
    public readonly Input: InputManager;

    constructor(canvas: HTMLCanvasElement) {
        this.Canvas = canvas;
        this.Context = canvas.getContext("webgl");
        webgl = this.Context;

        App.Instance = this;

        this.Input = new InputManager(canvas);
        
        this.Initialize().then(() => {
            
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
}
