import { TestModule } from './tests';
import { Matrix4 } from '../core/math/matrix';

const matrixTests = new TestModule("Matrices");

const matrixA = new Matrix4([
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
]);

const matrixB = new Matrix4([
    16, 15, 14, 13,
    12, 11, 10, 9,
    8, 7, 6, 5,
    4, 3, 2, 1
]);

const invertibleMatrix = new Matrix4([
    1, 1, 1, -1,
    1, 1, -1, 1,
    1, -1, 1, 1,
    -1, 1, 1, 1
]);



matrixTests.Test(
    "Calculate determinant",
    () => invertibleMatrix.Determinant(),
    -16
);

matrixTests.Test(
    "Calculate inverse",
    () => {
        const expected = new Matrix4([
            0.25, 0.25, 0.25, -0.25,
            0.25, 0.25, -0.25, 0.25,
            0.25, -0.25, 0.25, 0.25,
            -0.25, 0.25, 0.25, 0.25
        ]);

        return invertibleMatrix.Inverse().Equals(expected, 0.01);
    },
    true
);

matrixTests.Test(
    "Calculate product",
    () => {
        const expected = new Matrix4([
            80, 70, 60, 50,
            240, 214, 188, 162,
            400, 358, 316, 274,
            560, 502, 444, 386
        ]);

        return matrixA.Multiply(matrixB).Equals(expected);
    },
    true
);



