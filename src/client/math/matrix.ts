import { Vector3 } from "./vector"

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

    public Values(): Float32Array {
        return this.values;
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

    public Determinant(): number {
        return (this.values[0] * this.values[3]) - (this.values[1] * this.values[2]);
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

    public Determinant(): number {
        const mat = this.values;

        const cofactor11 = mat[0] * (mat[4] * mat[8] - mat[7] * mat[5]);
        const cofactor12 = mat[1] * (mat[3] * mat[8] - mat[6] * mat[5]);
        const cofactor13 = mat[2] * (mat[3] * mat[7] - mat[6] * mat[4]);

        return cofactor11 - cofactor12 + cofactor13;
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

    public static CreateScale(scale: Vector3): Matrix4 {
        return new Matrix4([
            scale.x, 0, 0, 0,
            0, scale.y, 0, 0,
            0, 0, scale.z, 0,
            0, 0, 0, 1
        ]);
    }

    public static CreateSRT(
        scale: Vector3 | number,
        rotation: Vector3,
        translation: Vector3
    ): Matrix4 {
        scale = typeof scale === "number" ?
            new Vector3(scale, scale, scale) : scale;

        let matrix = Matrix4.CreateScale(scale);
        matrix = matrix.Rotate(rotation.z, Vector3.Forward);
        matrix = matrix.Rotate(rotation.x, Vector3.Right);
        matrix = matrix.Rotate(rotation.y, Vector3.Up);
        matrix = matrix.Translate(translation);

        return matrix;
    }

    public constructor(values: Matrix4Array) {
        super(values, 4);
    }

    public Scale(scalar: number): Matrix4 {
        const values = Array.from(this.values.map((value) => value * scalar));
        return new Matrix4(values as Matrix4Array);
    }

    public Rotate(angle: number, axis: Vector3): Matrix4 {
        const length = axis.Length();
        if (length <= 0) return this;

        const angleSin = Math.sin(angle);
        const angleCos = Math.cos(angle);

        const rotationMatrix = new Matrix4([
            ((1 - angleCos) * axis.x * axis.x) + (angleCos),
            ((1 - angleCos) * axis.x * axis.y) - (axis.z * angleSin),
            ((1 - angleCos) * axis.z * axis.x) + (axis.y * angleSin),
            0.0,

            ((1 - angleCos) * axis.x * axis.y) + (axis.z * angleSin),
            ((1 - angleCos) * axis.y * axis.y) + (angleCos),
            ((1 - angleCos) * axis.y * axis.z) - (axis.x * angleSin),
            0.0,

            ((1 - angleCos) * axis.z * axis.x) - (axis.y * angleSin),
            ((1 - angleCos) * axis.y * axis.z) + (axis.x * angleSin),
            ((1 - angleCos) * axis.z * axis.z) + (angleCos),
            0.0,

            0.0,
            0.0,
            0.0,
            1.0
        ]);

        // TODO: Use Multiply on Matrix4 class
        return Matrix4.Multiply(rotationMatrix, this) as Matrix4;
    }

    public Transpose(): Matrix4 {
        const mat = this.values;
        
        return new Matrix4([
            mat[0], mat[4], mat[8], mat[12],
            mat[1], mat[5], mat[9], mat[13],
            mat[2], mat[6], mat[10], mat[14],
            mat[3], mat[7], mat[11], mat[15]
        ]);
    }

    public Determinant(): number {
        const mat = this.values;

        let cofactor22 = mat[5] * (mat[10] * mat[15] - mat[14] * mat[11]);
        let cofactor23 =  mat[6] * (mat[9] * mat[15] - mat[13] * mat[11]);
        let cofactor24 =  mat[7] * (mat[9] * mat[14] - mat[13] * mat[10]);
        const cofactor11 = mat[0] * (cofactor22 - cofactor23 + cofactor24);

        let cofactor21 =  mat[4] * (mat[10] * mat[15] - mat[14] * mat[11]);
        cofactor23 =  mat[6] * (mat[8] * mat[15] - mat[12] * mat[11]);
        cofactor24 =  mat[7] * (mat[8] * mat[14] - mat[12] * mat[10]);
        const cofactor12 = mat[1] * (cofactor21 - cofactor23 + cofactor24);

        cofactor21 =  mat[4] * (mat[9] * mat[15] - mat[13] * mat[11]);
        cofactor22 =  mat[5] * (mat[8] * mat[15] - mat[12] * mat[11]);
        cofactor24 =  mat[7] * (mat[8] * mat[13] - mat[12] * mat[9]);
        const cofactor13 = mat[2] * (cofactor21 - cofactor22 + cofactor24);

        cofactor21 =  mat[4] * (mat[9] * mat[14] - mat[13] * mat[10]);
        cofactor22 =  mat[5] * (mat[8] * mat[14] - mat[12] * mat[10]);
        cofactor23 =  mat[6] * (mat[8] * mat[13] - mat[12] * mat[9]);
        const cofactor14 = mat[3] * (cofactor21 - cofactor22 + cofactor23);
    
        return cofactor11 - cofactor12 + cofactor13 - cofactor14;
    }

    public Adjugate(): Matrix4 {
        return this.Cofactor().Transpose();
    }

    public Inverse(): Matrix4 | null {
        const determinant = this.Determinant();
        if (determinant === 0) return null;

        return this.Adjugate().Scale(1.0 / determinant);
    }

    public Translate(translation: Vector3): Matrix4 {
        const mat = this.values;
        
        return new Matrix4([
            mat[0], 
            mat[1],
            mat[2],
            mat[3],

            mat[4],
            mat[5],
            mat[6],
            mat[7],

            mat[8],
            mat[9], 
            mat[10], 
            mat[11],
            
            mat[12] + translation.x, 
            mat[13] + translation.y, 
            mat[14] + translation.z, 
            mat[15]
        ]);
    }

    public Perspective(): Matrix4 {
        throw Error("Not implemented");
    }

    public Orthographic(): Matrix4 {
        throw Error("Not implemented");
    }

    public Minor(row: number, column: number): Matrix3 {
        const values: number[] = [];

        for (let i = 0; i < this.values.length; i++) {
            const currentRow = Math.floor(i / 4);
            const currentColumn = i % 4;

            if (currentRow != row && currentColumn != column) {
                values.push(this.values[i]);
            }
        }

        return new Matrix3(values as Matrix3Array);
    }

    public Cofactor(): Matrix4 {
        const values: number[] = [];

        for (let i = 0; i < this.values.length; i++) {
            const currentRow = Math.floor(i / 4);
            const currentColumn = i % 4;

            const minor = this.Minor(currentRow, currentColumn);

            const cofactor = Math.pow(-1, currentRow + 1 + currentColumn + 1)
                * minor.Determinant();

            values.push(cofactor);
        }

        return new Matrix4(values as Matrix4Array);
    }
}
