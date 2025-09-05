import { ShaderProgram } from "./Shader";

enum ElementType {
    Float32,
    Float64,
    Int8,
    Int16,
    Int32,
    BigInt64,
    Uint8,
    Uint16,
    Uint32
}

// TODO: Support Float16Array
type ArrayUnion = 
    Float32Array | Float64Array |
    Int8Array | Int16Array | Int32Array | BigInt64Array |
    Uint8Array | Uint16Array | Uint32Array;

type Location = number;

// TODO: Create "contextable" resource abstract base class

export class Context {
    public static Instance: Context;

    public readonly WebGL: WebGLRenderingContext;

    public readonly Types: { [key in ElementType] : number };

    public constructor(webGL: WebGLRenderingContext) {
        this.WebGL = webGL;
        Context.Instance = this;

        this.Types = {
            [ElementType.Float32]: this.WebGL.FLOAT,
            [ElementType.Float64]: this.WebGL.HIGH_FLOAT,
            [ElementType.Int8]: this.WebGL.BYTE,
            [ElementType.Int16]: this.WebGL.SHORT,
            [ElementType.Int32]: this.WebGL.INT,
            [ElementType.BigInt64]: this.WebGL.HIGH_INT,
            [ElementType.Uint8]: this.WebGL.UNSIGNED_BYTE,
            [ElementType.Uint16]: this.WebGL.UNSIGNED_SHORT,
            [ElementType.Uint32]: this.WebGL.UNSIGNED_INT
        };
    }
}

export abstract class Attribute {
    public readonly Name: string;
    public readonly Data: unknown;
    public readonly Type: ElementType;
    public readonly Size: number;
    
    private shaderProgram: ShaderProgram;
    private location: Location;

    // TODO: Support Float16
    public static readonly ElementTypes = {
        "Float32Array": ElementType.Float32,
        "Float64Array": ElementType.Float64,
        "Int8Array": ElementType.Int8,
        "Int16Array": ElementType.Int16,
        "Int32Array": ElementType.Int32,
        "BigInt64Array": ElementType.BigInt64,
        "Uint8Array": ElementType.Uint8,
        "Uint16Array": ElementType.Uint16,
        "Uint32Array": ElementType.Uint32
    };


    // abstract readonly Type: unknown;

    public constructor(
        shaderProgram: ShaderProgram,
        name: string,
        data: unknown,
        type: ElementType,
        size: number
    ) {
        this.shaderProgram = shaderProgram;
        this.Name = name;
        this.Data = data;
        this.Type = type;
        this.Size = size;

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
        const elementType = Attribute.ElementTypes[data.constructor.name];
        if (elementType == null) throw Error("Invalid attribute element type");

        super(shaderProgram, name, data, elementType, size);

        this.Buffer = Context.Instance.WebGL.createBuffer();

        Context.Instance.WebGL.bindBuffer(
            Context.Instance.WebGL.ARRAY_BUFFER,
            this.Buffer
        );

        Context.Instance.WebGL.bufferData(
            Context.Instance.WebGL.ARRAY_BUFFER,
            this.Data,
            Context.Instance.WebGL.STATIC_DRAW
        );

        const dataType = Context.Instance.Types[this.Type]; 

        Context.Instance.WebGL.vertexAttribPointer(
            this.Location,
            this.Size,
            dataType,
            false,
            0,
            0
        );

        Context.Instance.WebGL.enableVertexAttribArray(this.Location);

        Context.Instance.WebGL.bindBuffer(
            Context.Instance.WebGL.ARRAY_BUFFER,
            null
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

