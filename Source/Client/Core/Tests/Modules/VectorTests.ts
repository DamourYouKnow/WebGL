import { Vector2, Vector3 } from "../../Math/Vector";
import { TestGroup } from "../TestGroup";

const vectorGroup = new TestGroup("Vectors");

const vector2Group = vectorGroup.AddGroup("Vector 2D");

vector2Group.AddTest(
    "X and Y elements are initalized",
    () => new Vector2(1, 2),
    (vector: Vector2) => vector.x == 1 && vector.y == 2,
);

vector2Group.AddGroup("Add").AddTest(
    "Calculate sum of two vectors",
    () => new Vector2(1, 2).Add(new Vector2(3, 4)),
    (result: Vector2) => result.Equals(new Vector2(4, 6))
);

vector2Group.AddGroup("Subtract").AddTest(
    "Calculate difference between two vectors",
    () => new Vector2(3, 4).Subtract(new Vector2(1, 2)),
    (result: Vector2) => result.Equals(new Vector2(2, 2)) 
);

const vector3Group = vectorGroup.AddGroup("Vector 3D");

vector3Group.AddTest(
    "X, Y, and Z elements are initalized",
    () => new Vector3(1, 2, 3),
    (vector: Vector3) => vector.x == 1,
    (vector: Vector3) => vector.y == 2,
    (vector: Vector3) => vector.z == 3,
);

vector3Group.AddGroup("Add").AddTest(
    "Calculate sum of two vectors",
    () => new Vector3(1, 2, 3).Add(new Vector3(4, 5, 6)),
    (result: Vector3) => result.Equals(new Vector3(5, 7, 9))
);

vector3Group.AddGroup("Subtract").AddTest(
    "Calculate difference between two vectors",
    () => new Vector3(4, 5, 6).Subtract(new Vector3(1, 2, 3)),
    (result: Vector3) => result.Equals(new Vector3(3, 3, 3)) 
);

export default vectorGroup;