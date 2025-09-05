import { Context } from "./Graphics";
import { requestTextFile } from "../Web";

type ShaderType = "Vertex" | "Fragment";

// TODO: Keep record of filepath for error reporting
// TODO: Preset types for common shader programs
export class Shader {
    public readonly Context: Context;

    private type: ShaderType;
    private source: string;
    private shader: WebGLShader;

    public constructor(
        context: Context,
        type: ShaderType, 
        source: string
    ) {
        this.Context = context;
        this.type = type;
        this.source = source;
    }

    public GetShader(): WebGLShader {
        return this.shader;
    }

    // TODO: Resource manager for shaders
    public static Load(
        context: Context,
        type: ShaderType,
        source: string
    ): Shader {
        if (!context) return;

        const shaderTypes = {
            "Vertex": context.WebGL.VERTEX_SHADER,
            "Fragment": context.WebGL.FRAGMENT_SHADER
        };

        if (!(type in shaderTypes)) return;

        const shader = context.WebGL.createShader(shaderTypes[type]);
        
        context.WebGL.shaderSource(shader, source);
        context.WebGL.compileShader(shader);
    
        const compileStatus = context.WebGL.getShaderParameter(
            shader, 
            context.WebGL.COMPILE_STATUS
        );

        if (!compileStatus) {
            const errMessage = 'Shader compilation error:\n'
                + context.WebGL.getShaderInfoLog(shader);
        
            context.WebGL.deleteShader(shader);

            throw Error(errMessage);
        }

        const shaderObj = new Shader(context, type, source);
        shaderObj.shader = shader;
        return shaderObj;
    }

}

// TODO: Resource manager for shader programs
export class ShaderProgram {
    public readonly Context: Context;

    private program: WebGLProgram;
    private shaders: Shader[];

    public constructor(context: Context, ...shaders: Shader[]) {
        this.Context = context;
        this.shaders = shaders;
    }

    public static async Load(
        context: Context,
        vertexPath: string,
        fragmentPath: string
    ): Promise<ShaderProgram> {
        if (!context) return;

        const vertexShaderSource = await requestTextFile(
            `shaders/${vertexPath}`
        );
        const fragmentShaderSource = await requestTextFile(
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

        const shaderProgram = context.WebGL.createProgram();
        
        context.WebGL.attachShader(shaderProgram, vertexShader.GetShader());
        context.WebGL.attachShader(shaderProgram, fragmentShader.GetShader());

        context.WebGL.linkProgram(shaderProgram);

        const linkStatus = context.WebGL.getProgramParameter(
            shaderProgram, 
            context.WebGL.LINK_STATUS
        );

        if (!linkStatus) {
            const errMessage = 'Shader program link error:\n'
                + context.WebGL.getProgramInfoLog(shaderProgram);

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
    context: Context
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
