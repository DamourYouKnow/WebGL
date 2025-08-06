export class Vector2 {
    public x: number;
    public y: number;

    public static readonly Zero = new Vector2(0.0, 0.0);
    public static readonly Unit = new Vector2(1.0, 1.0);
    public static readonly Right = new Vector2(1.0, 0.0);
    public static readonly Left = new Vector2(-1.0, 0.0);
    public static readonly Up = new Vector2(0.0, 1.0);
    public static readonly Down = new Vector2(0.0, -1.0);

    public constructor(x: number=0.0, y: number=0.0) {
        this.x = x;
        this.y = y;
    }

    public Equals(other: Vector2, tolerance: number=0.0): boolean {
        return [
            this.x - other.x, 
            this.y - other.y
        ].every((value) => {
            return Math.abs(value) <= tolerance;
        });
    }

    public static Add(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y);
    }
    
    public Add(other: Vector2): Vector2 {
        return Vector2.Add(this, other);
    }

    public static Subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    public Subtract(other: Vector2): Vector2 {
        return Vector2.Subtract(this, other);
    }

    public Scale(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public Inverse(): Vector2 {
        return new Vector2(this.x * -1.0, this.y * -1.0);
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

    public static DotProduct(a: Vector2, b: Vector2): number {
        return (a.x * b.x) + (a.y * b.y);
    }
    
    public DotProduct(other: Vector2): number {
        return Vector2.DotProduct(this, other);
    }

    public static CrossProduct(a: Vector2, b: Vector2): Vector2 {
        return new Vector2((a.x * b.y) - (a.y * b.x));
    }

    public CrossProduct(other: Vector2): Vector2 {
        return Vector2.CrossProduct(this, other);
    }
}

export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    public static readonly Zero = new Vector3(0.0, 0.0, 0.0);
    public static readonly Unit = new Vector3(1.0, 1.0, 1.0);
    public static readonly Right = new Vector3(1.0, 0.0, 0.0);
    public static readonly Left = new Vector3(-1.0, 0.0, 0.0);
    public static readonly Up = new Vector3(0.0, 1.0, 0.0);
    public static readonly Down = new Vector3(0.0, -1.0, 0.0);
    public static readonly Forward = new Vector3(0.0, 0.0, 1.0);
    public static readonly Backward = new Vector3(0.0, 0.0, -1.0);
    
    public constructor(x: number=0.0, y: number=0.0, z: number=0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public Equals(other: Vector3, tolerance: number=0.0): boolean {
        return [
            this.x - other.x, 
            this.y - other.y, 
            this.z - other.z
        ].every((value) => {
            return Math.abs(value) <= tolerance;
        });
    }

    public static Add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    
    public Add(other: Vector3): Vector3 {
        return Vector3.Add(this, other);
    }

    public static Subtract(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public Subtract(other: Vector3): Vector3 {
        return Vector3.Subtract(this, other);
    }

    public Scale(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public Inverse(): Vector3 {
        return new Vector3(this.x * -1.0, this.y * -1.0, this.z * -1.0);
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

    public static DotProduct(a: Vector3, b: Vector3): number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    public DotProduct(other: Vector3): number {
        return Vector3.DotProduct(this, other);
    }

    public static CrossProduct(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            (a.y * b.z) - (a.z * b.y),
            (a.z * b.x) - (a.x * b.z),
            (a.x * b.y) - (a.y * b.x)
        );
    }

    public CrossProduct(other: Vector3): Vector3 {
        return Vector3.CrossProduct(this, other);
    }

    public toString(): string {
        return `{x=${this.x}, y=${this.y}, z=${this.z}}`;
    }
}
