export type ArrayUnion = 
    Float32Array | Float64Array |
    Int8Array | Int16Array | Int32Array | BigInt64Array |
    Uint8Array | Uint16Array | Uint32Array;

export function makeArray<TArray extends ArrayUnion>(
    creator: new(...args: unknown[]) => TArray,
    array: TArray | number[]
): TArray {
    if (Array.isArray(array)) {
        return new creator(array);
    }

    return array;
}