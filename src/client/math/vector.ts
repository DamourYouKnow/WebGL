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
