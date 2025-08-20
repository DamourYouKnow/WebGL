export const Pi = Math.PI;

export function clamp(
    value: number,
    minimum: number,
    maximum: number
): number {
    if (value < minimum) return minimum;
    if (value > maximum) return maximum;
    return value;
}

export function scale(
    value: number,
    oldMin: number, oldMax: number,
    newMin: number=0, newMax: number=1
): number {
    const oldRange = oldMax - oldMin;
    const newRange = newMax - newMin;
    return (((value - oldMin) * newRange) / oldRange) + newMin;
}

function radiansToDegrees(radians: number): number {
    return radians * 180.0 / Pi;
}

function degreesToRadians(degrees: number): number {
    return degrees * Pi / 180.0;
}