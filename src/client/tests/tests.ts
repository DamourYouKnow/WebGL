import { Matrix, Matrix3, Matrix4 } from '../math/matrix';

const matrix = new Matrix4([
    1, 1, 1, -1,
    1, 1, -1, 1,
    1, -1, 1, 1,
    -1, 1, 1, 1
]);

const inverse = matrix.Inverse();

console.log(inverse.Values());

