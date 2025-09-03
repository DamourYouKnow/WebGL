export class Context {
    public readonly WebGL: WebGLRenderingContext;

    public constructor(webGL: WebGLRenderingContext) {
        this.WebGL = webGL;
    }
}

type ArrayUnion = 
    Float32Array | Float64Array |
    Int8Array | Int16Array | Int32Array | BigInt64Array |
    Uint8Array | Uint16Array | Uint32Array | BigUint64Array; 

export abstract class Attribute {
    public readonly Name: string;
    public readonly Data: unknown;
    public readonly Location: number;
    // abstract readonly Type: unknown;

    public constructor(name: string, data: unknown) {
        this.Name = name;
        this.Data = data;
    }
}

export class ArrayAttribute<TArray extends ArrayUnion> extends Attribute {
    public declare readonly Data: TArray;
    public readonly Buffer: WebGLBuffer;
    public readonly Size: number;

    public constructor(name: string, data: TArray) {
        super(name, data);
    }
}

export class Vector2ArrayAttribute extends ArrayAttribute<Float32Array> {
    public constructor(name: string, data: Float32Array) {
        super(name, data);
    }
}

export class Vector3ArrayAttribute extends ArrayAttribute<Float32Array> {
    public constructor(name: string, data: Float32Array) {
        super(name, data);
    }
}

export class Vector4ArrayAttribute extends ArrayAttribute<Float32Array> {
    public constructor(name: string, data: Float32Array) {
        super(name, data);
    }
}

