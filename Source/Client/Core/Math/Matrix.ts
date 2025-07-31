import { Vector3 } from "./Vector"

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

    public Equals(other: Matrix, tolerance: number=0.0): boolean {
        return this.values.every((value, i) => {
            return Math.abs(value - other.values[i]) <= tolerance;
        });
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

    public ValuesRowMajor(): Float32Array {
        return this.values;
    }

    public ValuesColumnMajor(): Float32Array {
        return new Float32Array([
            this.values[0], this.values[2],
            this.values[1], this.values[3]
        ]);
    }

    public Row(i: number): Float32Array {
        throw Error("Not implemented");
    }

    public Column(j: number): Float32Array {
        throw Error("Not implemented");
    }

    public static Multiply(matrixA: Matrix2, matrixB: Matrix2): Matrix2 {
        const a = matrixA.values;
        const b = matrixB.values;
        
        return new Matrix2([
            (a[0] * b[0]) + (a[1] * b[2]), (a[0] * b[1]) + (a[1] * b[3]),
            (a[2] * b[0]) + (a[3] * b[2]), (a[2] * b[1]) + (a[3] * b[3])  
        ]);
    }

    public Multiply(other: Matrix2): Matrix {
        return Matrix2.Multiply(this, other);
    }

    public Transpose(): Matrix2 {
        const mat = this.values;

        return new Matrix2([
            mat[0], mat[2],
            mat[1], mat[3]
        ]);
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

    public ValuesRowMajor(): Float32Array {
        return this.values;
    }

    public ValuesColumnMajor(): Float32Array {
        const mat = this.values;

        return new Float32Array([
            mat[0], mat[3], mat[6],
            mat[1], mat[4], mat[7],
            mat[2], mat[5], mat[8] 
        ]);
    }

    public Row(i: number): Float32Array {
        throw Error("Not implemented");
    }

    public Column(j: number): Float32Array {
        throw Error("Not implemented");
    }

    public static Multiply(matrixA: Matrix3, matrixB: Matrix3): Matrix3 {
        const a = matrixA.values;
        const b = matrixB.values;

        return new Matrix3([
            (a[0] * b[0]) + (a[1] * b[3]) + (a[2] * b[6]),
            (a[0] * b[1]) + (a[1] * b[4]) + (a[2] * b[7]),
            (a[0] * b[2]) + (a[1] * b[5]) + (a[2] * b[8]),

            (a[3] * b[0]) + (a[4] * b[3]) + (a[5] * b[6]),
            (a[3] * b[1]) + (a[4] * b[4]) + (a[5] * b[7]),
            (a[3] * b[2]) + (a[4] * b[5]) + (a[5] * b[8]),

            (a[6] * b[0]) + (a[7] * b[3]) + (a[8] * b[6]),
            (a[6] * b[1]) + (a[7] * b[4]) + (a[8] * b[7]),
            (a[6] * b[2]) + (a[7] * b[5]) + (a[8] * b[8])
        ]);
    }

    public Multiply(other: Matrix3): Matrix3 {
        return Matrix3.Multiply(this, other);
    }

    public Transpose(): Matrix3 {
        const mat = this.values;

        return new Matrix3([
            mat[0], mat[3], mat[6],
            mat[1], mat[4], mat[7],
            mat[2], mat[5], mat[8]
        ]);
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
            (right + left) / deltaX, 
            0.0, 

            0.0, 
            2.0 * near / deltaY, 
            (top + bottom) / deltaY, 
            0.0, 

            0.0,
            0.0,
            -(near + far) / deltaZ,
            -2.0 * near * far / deltaZ,

            0.0,
            0.0,
            -1.0,
            0.0
        ]);
    }

    public static CreatePerspectiveVerticalFOV(
        verticalFieldOfViewDegrees: number,
        aspect: number,
        near: number,
        far: number
    ): Matrix4 {
        const frustrumTop = Math.tan(
            (verticalFieldOfViewDegrees / 2) * (Math.PI / 180)
        ) * near;

        const frustrumRight = frustrumTop * aspect;

        return Matrix4.CreateFrustrum(
            -frustrumRight, frustrumRight,
            -frustrumTop, frustrumTop,
            near, far
        );
    }

    public static CreatePerspectiveHorizontalFOV(
        horizontalFieldOfViewDegrees: number,
        aspect: number,
        near: number,
        far: number
    ): Matrix4 {
        const frustrumRight = Math.tan(
            (horizontalFieldOfViewDegrees / 2) * (Math.PI / 180)
        ) * near;

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

    // TODO: Create world view if lookAtPosition is undefined
    public static CreateView(
        eyePosition: Vector3,
        up: Vector3,
        lookAtPosition: Vector3
    ): Matrix4 {
        const zAxis = eyePosition.Subtract(lookAtPosition).Normalize();
        const xAxis = up.CrossProduct(zAxis).Normalize();
        const yAxis = zAxis.CrossProduct(xAxis);

        const position = new Vector3(
            xAxis.Inverse().DotProduct(eyePosition),
            yAxis.Inverse().DotProduct(eyePosition),
            zAxis.Inverse().DotProduct(eyePosition)
        );

        return new Matrix4([
            xAxis.x, xAxis.y, xAxis.z, position.x,
            yAxis.x, yAxis.y, yAxis.z, position.y,
            zAxis.x, zAxis.y, zAxis.z, position.z,
            0, 0, 0, 1
        ]);
    }

    public constructor(values: Matrix4Array) {
        super(values, 4);
    }

    public ValuesRowMajor(): Float32Array {
        return this.values;
    }

    public ValuesColumnMajor(): Float32Array {
        return new Float32Array([
            this.values[0], this.values[4], this.values[8], this.values[12],
            this.values[1], this.values[5], this.values[9], this.values[13],
            this.values[2], this.values[6], this.values[10], this.values[14],
            this.values[3], this.values[7], this.values[11], this.values[15]
        ]);
    }

    public Row(i: number): Float32Array {
        throw Error("Not implemented");
    }

    public Column(j: number): Float32Array {
        throw Error("Not implemented");
    }

    public static Multiply(matrixA: Matrix4, matrixB: Matrix4): Matrix4 {
        const a = matrixA.Values();
        const b = matrixB.Values();

        return new Matrix4([
            (a[0] * b[0]) + (a[1] * b[4]) + (a[2] * b[8]) + (a[3] * b[12]),
            (a[0] * b[1]) + (a[1] * b[5]) + (a[2] * b[9]) + (a[3] * b[13]),
            (a[0] * b[2]) + (a[1] * b[6]) + (a[2] * b[10]) + (a[3] * b[14]),
            (a[0] * b[3]) + (a[1] * b[7]) + (a[2] * b[11]) + (a[3] * b[15]),
            
            (a[4] * b[0]) + (a[5] * b[4]) + (a[6] * b[8]) + (a[7] * b[12]),
            (a[4] * b[1]) + (a[5] * b[5]) + (a[6] * b[9]) + (a[7] * b[13]),
            (a[4] * b[2]) + (a[5] * b[6]) + (a[6] * b[10]) + (a[7] * b[14]),
            (a[4] * b[3]) + (a[5] * b[7]) + (a[6] * b[11]) + (a[7] * b[15]),

            (a[8] * b[0]) + (a[9] * b[4]) + (a[10] * b[8]) + (a[11] * b[12]),
            (a[8] * b[1]) + (a[9] * b[5]) + (a[10] * b[9]) + (a[11] * b[13]),
            (a[8] * b[2]) + (a[9] * b[6]) + (a[10] * b[10]) + (a[11] * b[14]),
            (a[8] * b[3]) + (a[9] * b[7]) + (a[10] * b[11]) + (a[11] * b[15]),

            (a[12] * b[0]) + (a[13] * b[4]) + (a[14] * b[8]) + (a[15] * b[12]),
            (a[12] * b[1]) + (a[13] * b[5]) + (a[14] * b[9]) + (a[15] * b[13]),
            (a[12] * b[2]) + (a[13] * b[6]) + (a[14] * b[10]) + (a[15] * b[14]),
            (a[12] * b[3]) + (a[13] * b[7]) + (a[14] * b[11]) + (a[15] * b[15])
        ]);
    }

    public Multiply(other: Matrix4): Matrix4 {
        return Matrix4.Multiply(this, other);
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
        ]).Transpose(); // TODO: Row order instead of transpose

        return Matrix4.Multiply(this, rotationMatrix) as Matrix4;
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
            mat[3] + translation.x,

            mat[4],
            mat[5],
            mat[6],
            mat[7] + translation.y,

            mat[8],
            mat[9], 
            mat[10], 
            mat[11] + translation.z,
            
            mat[12], 
            mat[13], 
            mat[14], 
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

    public toString(): string {
        const mat = this.values;
        
        return `
            | ${mat[0]} ${mat[1]} ${mat[2]} ${mat[3]} |
            | ${mat[4]} ${mat[5]} ${mat[6]} ${mat[7]} |
            | ${mat[8]} ${mat[9]} ${mat[10]} ${mat[11]} |
            | ${mat[12]} ${mat[13]} ${mat[14]} ${mat[15]} |
        `
    }
}
