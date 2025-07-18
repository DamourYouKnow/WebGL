export class Vector2 {
    public x: number;
    public y: number;

    public constructor(x: number=0.0, y: number=0.0) {
        this.x = x;
        this.y = y;
    }

    public static Add(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
    
    public Add(other: Vector2): Vector2 {
        return Vector2.Add(this, other);
    }

    public Scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public LengthSquared(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    public Length(): number {
        return Math.sqrt(this.LengthSquared());
    }

    public Normalize(): Vector2 {
        return this.Scale(1.0 / this.Length());
    }
}


export class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    
    public constructor(x: number=0.0, y: number=0.0, z: number=0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static Add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    
    public Add(other: Vector3): Vector3 {
        return Vector3.Add(this, other);
    }

    public Scale(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public LengthSquared(): number {
        return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
    }

    public Length(): number {
        return Math.sqrt(this.LengthSquared());
    }

    public Normalize(): Vector3 {
        return this.Scale(1.0 / this.Length());
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

    public static CreateFrustrum(
        left: number, 
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number
    ): Matrix4 {
        const deltaX = right - left;
        const deltaY = top - bottom;
        const deltaZ = far - near;

        if (deltaX <= 0) throw Error("deltaX <= 0");
        if (deltaY <= 0) throw Error("deltaY <= 0");
        if (deltaZ <= 0) throw Error("deltaZ <= 0");
        if (near <= 0) throw Error("near <= 0");
        if (far <= 0) throw Error("far <= 0"); 
        
        return new Matrix4([
            2.0 * near / deltaX, 
            0.0, 
            0.0, 
            0.0, 

            0.0, 
            2.0 * near / deltaY, 
            0.0, 
            0.0, 

            (right + left) / deltaX,
            (top + bottom) / deltaY,
            -(near + far) / deltaZ,
            -1.0,

            0.0,
            0.0,
            -2.0 * near * far * deltaZ,
            0.0
        ]);
    }

    public static CreatePerspectiveVerticalFieldOfView(
        verticalFieldOfViewDegrees: number,
        aspect: number,
        near: number,
        far: number
    ): Matrix4 {
        const frustrumTop = Math.tan(
            (verticalFieldOfViewDegrees / 2) * (Math.PI / 180)
        );

        const frustrumRight = frustrumTop * aspect;

        return Matrix4.CreateFrustrum(
            -frustrumRight, frustrumRight,
            -frustrumTop, frustrumTop,
            near, far
        );
    }

    public static CreatePerspectiveHorizontalFieldOfView(
        horizontalFieldOfViewDegrees: number,
        aspect: number,
        near: number,
        far: number
    ): Matrix4 {
        const frustrumRight = Math.tan(
            (horizontalFieldOfViewDegrees / 2) * (Math.PI / 180)
        );

        const frustrumTop = frustrumRight / aspect;

        return Matrix4.CreateFrustrum(
            -frustrumRight, frustrumRight,
            -frustrumTop, frustrumTop,
            near, far
        );
    }

    public static CreateOrthograhic(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number
    ): Matrix4 {
        const deltaX = right - left;
        const deltaY = top - bottom;
        const deltaZ = far - near;

        if (deltaX == 0) throw Error("deltaX == 0");
        if (deltaY == 0) throw Error("deltaY == 0");
        if (deltaZ == 0) throw Error("deltaZ == 0");

        return new Matrix4([
            2.0 / deltaX,
            0.0,
            0.0,
            0.0,

            0.0,
            2.0 / deltaY,
            0.0,
            0.0,

            0.0,
            0.0,
            -2.0 / deltaZ,
            0.0,

            -(right + left) / deltaX,
            -(top + bottom) / deltaY,
            -(far + near) / deltaZ,
            1.0
        ]);
    }

    public static CreateSRT(
        scale: number,
        rotation: Vector3,
        translation: Vector3
    ): Matrix4 {
        throw Error("Not implemented");
    }

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