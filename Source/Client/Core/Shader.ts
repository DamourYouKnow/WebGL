import { requestFile } from "./Web";

type ShaderType = "Vertex" | "Fragment";

export class Shader {
    private context: WebGLRenderingContext;
    private type: ShaderType
    private source: string;
    private shader: WebGLShader;

    public constructor(
        context: WebGLRenderingContext,
        type: ShaderType, 
        source: string
    ) {
        this.context = context;
        this.type = type;
        this.source = source;
    }

    public GetShader(): WebGLShader {
        return this.shader;
    }

    // TODO: Resource manager for shaders
    public static Load(
        context: WebGLRenderingContext,
        type: ShaderType,
        source: string
    ): Shader {
        if (!context) return;

        const shaderTypes = {
            "Vertex": context.VERTEX_SHADER,
            "Fragment": context.FRAGMENT_SHADER
        };

        if (!(type in shaderTypes)) return;

        const shader = context.createShader(shaderTypes[type]);
        
        context.shaderSource(shader, source);
        context.compileShader(shader);
    
        const compileStatus = context.getShaderParameter(
            shader, 
            context.COMPILE_STATUS
        );

        if (!compileStatus) {
            const errMessage = 'Shader compilation error:\n'
                + context.getShaderInfoLog(shader);
        
            context.deleteShader(shader);

            throw Error(errMessage);
        }

        const shaderObj = new Shader(context, type, source);
        shaderObj.shader = shader;
        return shaderObj;
    }

}

// TODO: Resource manager for shader programs
export class ShaderProgram {
    private context: WebGLRenderingContext;
    private program: WebGLProgram;
    private shaders: Shader[];

    public constructor(context: WebGLRenderingContext, ...shaders: Shader[]) {
        this.context = context;
        this.shaders = shaders;
    }

    public static async Load(
        context: WebGLRenderingContext,
        vertexPath: string,
        fragmentPath: string
    ): Promise<ShaderProgram> {
        if (!context) return;

        const vertexShaderSource = await requestFile(
            `shaders/${vertexPath}`
        );
        const fragmentShaderSource = await requestFile(
            `shaders/${fragmentPath}`
        );

        const vertexShader = Shader.Load(
            context, 
            "Vertex", 
            vertexShaderSource
        );
        const fragmentShader = Shader.Load(
            context,
            "Fragment",
            fragmentShaderSource
        );

        const shaderProgram = context.createProgram();
        
        context.attachShader(shaderProgram, vertexShader.GetShader());
        context.attachShader(shaderProgram, fragmentShader.GetShader());

        context.linkProgram(shaderProgram);

        const linkStatus = context.getProgramParameter(
            shaderProgram, 
            context.LINK_STATUS
        );

        if (!linkStatus) {
            const errMessage = 'Shader program link error:\n'
                + context.getProgramInfoLog(shaderProgram);

            throw Error(errMessage);
        }

        const shaderProgramObj = new ShaderProgram(context);
        shaderProgramObj.program = shaderProgram;
        return shaderProgramObj;
    }

    public GetProgram(): WebGLProgram {
        return this.program;
    }
}
