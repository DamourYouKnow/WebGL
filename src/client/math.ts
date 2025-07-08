export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number=0.0, y: number=0.0) {
        this.x = x;
        this.y = y;
    }
}

type Tuple<
    T,
    N extends number,
    R extends readonly T[] = []
> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;

type Matrix2Array = Tuple<number, 4>;
type Matrix3Array = Tuple<number, 9>;
type Matrix4Array = Tuple<number, 16>;

export class Matrix {
    protected values: Float32Array = new Float32Array();
    protected dimensions: number;

    public constructor(values: number[], dimensions?: number) {
        this.values = new Float32Array(values);
        this.dimensions = dimensions || Math.sqrt(values.length);
    }

    public static Multiply(
        matrixA: Matrix,
        matrixB: Matrix
    ) : Matrix {
        throw new Error("Not implemented");
    }


    public Transpose(): Matrix {
        const values = [];
 
        for (let row = 0; row < this.dimensions; row++) {
            for (let column = 0; column < this.dimensions; column++) {
                const x = row 

                values.push(this.values[(column * this.dimensions) + row]);
            }
        }

        return new Matrix(values, this.dimensions);
    }

}

export class Matrix2 extends Matrix {
    public static Zero = new Matrix2([
        0, 0,
        0, 0
    ]);
    
    public static Identity = new Matrix2([
        1, 0,
        0, 1
    ]);

    public constructor(values: Matrix2Array) {
        super(values, 2);
    }
}

export class Matrix3 extends Matrix {
    public static Zero = new Matrix3([
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ]);
    
    public static Identity = new Matrix3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);

    public static Orthographic = new Matrix3([
        1, 0, 0,
        0, 1, 0,
        0, 0, 0
    ]);

    public constructor(values: Matrix3Array) {
        super(values, 3);
    }
}

export class Matrix4 extends Matrix {
    public static Zero = new Matrix4([
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]);
    
    public static Identity = new Matrix4([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    public static Orthographic = new Matrix4([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1
    ]);

    public constructor(values: Matrix4Array) {
        super(values, 4);
    }

    public Values(): Float32Array {
        return this.values;
    }

    public Determinant(): Matrix4 {
        throw Error("Not implemented");
    }

    public Inverse(): Matrix4 {
        throw Error("Not implemented");
    }

    public Translate(): Matrix4 {
        throw Error("Not implemented");
    }

    public Perspective(): Matrix4 {
        throw Error("Not implemented");
    }

    public Orthographic(): Matrix4 {
        throw Error("Not implemented");
    }
}