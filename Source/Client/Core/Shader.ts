import { requestFile } from "./Web";

type ShaderType = "Vertex" | "Fragment";

// TODO: Keep record of filepath for error reporting
// TODO: Preset types for common shader programs
export class Shader {
    private context: WebGLRenderingContext;
    private type: ShaderType;
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

// Common shaders, populated when App is created
export interface ShaderPresets {
    basic2D: ShaderProgram,
    basic3D: ShaderProgram,
    color2D: ShaderProgram,
    color3D: ShaderProgram,
    wireframe: ShaderProgram,
}

export let Shaders: ShaderPresets;

// TODO: Parallel load with Promise.all
// TODO: Integrate with resource manager
export async function loadShaderPresets(
    context: WebGLRenderingContext
): Promise<void> {
    Shaders = {
        basic2D: await ShaderProgram.Load(
            context,
            '2D/basic_vertex.glsl',
            'basic_fragment.glsl'
        ),
        basic3D: await ShaderProgram.Load(
            context,
            '3D/basic_vertex.glsl',
            'basic_fragment.glsl',
        ),
        color2D: await ShaderProgram.Load(
            context,
            '2D/color_vertex.glsl',
            'color_fragment.glsl'
        ),
        color3D: await ShaderProgram.Load(
            context,
            '3D/color_vertex.glsl',
            'color_fragment.glsl'
        ),
        wireframe: await ShaderProgram.Load(
            context,
            '3D/wireframe_vertex.glsl',
            '3D/wireframe_fragment.glsl'
        )
    };
}
