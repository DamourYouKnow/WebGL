import { ShaderProgram } from "./Shader";

type Location = number;

// TODO: Create "contextable" resource abstract base class

export class Context {
    public static Instance: Context;

    public readonly WebGL: WebGLRenderingContext;

    public constructor(webGL: WebGLRenderingContext) {
        this.WebGL = webGL;
        Context.Instance = this;
    }
}

type ArrayUnion = 
    Float32Array | Float64Array |
    Int8Array | Int16Array | Int32Array | BigInt64Array |
    Uint8Array | Uint16Array | Uint32Array | BigUint64Array;

export abstract class Attribute {
    public readonly Name: string;
    public readonly Data: unknown;
    public readonly Size: number;
    public readonly Type: number; // TODO: Create stricter type
    
    private shaderProgram: ShaderProgram;
    private location: Location;

    // abstract readonly Type: unknown;

    public constructor(
        shaderProgram: ShaderProgram,
        name: string,
        data: unknown,
        size: number
    ) {
        this.shaderProgram = shaderProgram;
        this.Name = name;
        this.Data = data;

        this.location = shaderProgram.Context.WebGL.getAttribLocation(
            shaderProgram.GetProgram(),
            name
        );
    }

    public get Location(): Location {
        return this.location;
    }
}

export class ArrayAttribute<TArray extends ArrayUnion> extends Attribute {
    public declare readonly Data: TArray;
    public readonly Buffer: WebGLBuffer;

    public constructor(
        shaderProgram: ShaderProgram,
        name: string,
        data: TArray,
        size: number
    ) {
        super(shaderProgram, name, data, size);

        this.Buffer = Context.Instance.WebGL.createBuffer();

        Context.Instance.WebGL.bufferData(
            Context.Instance.WebGL.ARRAY_BUFFER,
            this.Data,
            Context.Instance.WebGL.STATIC_DRAW
        );

        Context.Instance.WebGL.vertexAttribPointer(
            this.Location,
            this.Size,
            Context.Instance.WebGL.FLOAT, // TODO: Support other types
            false,
            0,
            0
        );

    }
}

export class Vector2ArrayAttribute extends ArrayAttribute<Float32Array> {
    public constructor(
        shaderProgram: ShaderProgram,
        name: string, 
        data: Float32Array
    ) {
        super(shaderProgram, name, data, 2);
    }
}

export class Vector3ArrayAttribute extends ArrayAttribute<Float32Array> {
    public constructor(
        shaderProgram: ShaderProgram,
        name: string,
        data: Float32Array
    ) {
        super(shaderProgram, name, data, 3);
    }
}

export class Vector4ArrayAttribute extends ArrayAttribute<Float32Array> {
    public constructor(
        shaderProgram: ShaderProgram,
        name: string, 
        data: Float32Array
    ) {
        super(shaderProgram, name, data, 4);
    }
}

