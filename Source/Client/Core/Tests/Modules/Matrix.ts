import { TestModule } from "../TestModule";
import { Matrix4 } from "../../Math/Matrix";

const matrixModule = new TestModule("Matrices");

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

matrixModule.CreateUnit("Determinant").Add(
    "Calculate determinant of invertible matrix",
    () => invertibleMatrix.Determinant(),
    (result: number) => result == -16
);

matrixModule.CreateUnit("Inverse").Add(
    "Calculate inverse of an invertible matrix",
    () => invertibleMatrix.Inverse(),
    (result: Matrix4 | null) => {
        return result.Equals(new Matrix4([
            0.25, 0.25, 0.25, -0.25,
            0.25, 0.25, -0.25, 0.25,
            0.25, -0.25, 0.25, 0.25,
            -0.25, 0.25, 0.25, 0.25
        ]));
    }
);


matrixModule.CreateUnit("Product").Add(
    "Calculate product of two 4x4 matrices",
    () => matrixA.Multiply(matrixB),
    (result: Matrix4) => {
        return result.Equals(new Matrix4([
            80, 70, 60, 50,
            240, 214, 188, 162,
            400, 358, 316, 274,
            560, 502, 444, 386
        ]));
    } 
);

export default matrixModule;
