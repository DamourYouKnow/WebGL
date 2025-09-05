import { App } from '../App';

import { 
    Context, 
    Attribute, 
    ArrayAttribute,
    Vector3ArrayAttribute
} from './Graphics';

import { Vector3 } from '../Math/Vector';
import { Shader, ShaderProgram } from './Shader';
import { Pi } from '../Math/Math';

// TODO: Refactor into seperate files

type Dimension = 2 | 3;

interface MeshData {
    vertices: Float32Array | number[],
    indices?: Uint16Array | number[],
    textureCoordinates?: Float32Array | number[],
    normals?: Float32Array | number[]
}


export class Mesh {
    public readonly Dimension: Dimension;

    public readonly Attributes: { [key: string]: Attribute };

    private indices?: Uint16Array;
    private textureCoordinates?: Float32Array;
    private normals?: Float32Array;

    private barycentricCoordinates: Float32Array;

    private vertexAttributeArray: Vector3ArrayAttribute; 

    private indexBuffer?: WebGLBuffer;
    private textureBuffer?: WebGLBuffer;
    private normalBuffer?: WebGLBuffer;
    private barycentricBuffer: WebGLBuffer;

    private shaderProgram: ShaderProgram;

    public constructor(
        dimension: Dimension,
        shaderProgram: ShaderProgram, 
        meshData: MeshData
    ) {
        this.Dimension = dimension;

        this.SetShaderProgram(shaderProgram);

        // Create vertex buffer
        const verticesData = meshData.vertices instanceof Float32Array ?
            meshData.vertices : new Float32Array(meshData.vertices);

        this.vertexAttributeArray = new Vector3ArrayAttribute(
            shaderProgram,
            "a_position",
            verticesData,
        );

        const test = this.vertexAttributeArray.Data;

        /*
        this.barycentricBuffer = this.createBarycentricBuffer(
            App.Instance.Context
        );
        */

        // Create index buffer if applicable
        if (meshData.indices) {
            this.indices = meshData.indices instanceof Uint16Array ?
                meshData.indices : new Uint16Array(meshData.indices);

            this.indexBuffer = this.createIndexBuffer(
                App.Instance.Context.WebGL
            );
        }

        // Assign barycentric coordinates to vertices
        this.barycentricCoordinates = barycentricVertices(
            this.vertexAttributeArray.Data,
            this.indices
        );

        // Create texture buffer if applicable
        if (meshData.textureCoordinates) {
            if (meshData.textureCoordinates instanceof Float32Array) {
                this.textureCoordinates = meshData.textureCoordinates;
            }
            else {
                this.textureCoordinates = new Float32Array(
                    meshData.textureCoordinates
                );
            }

            this.textureBuffer = this.createTextureBuffer(
                App.Instance.Context.WebGL
            );
        }

        // Create normal buffer if applicable
        if (meshData.normals) {
            this.normals = meshData.normals instanceof Float32Array ?
                meshData.normals : new Float32Array(meshData.normals);

            this.normalBuffer = this.createNormalBuffer(
                App.Instance.Context.WebGL
            );
        }
    }
    
    public Vertices(): Float32Array {
        return this.vertexAttributeArray.Data;
    }

    public Indices(): Uint16Array | null {
        if (!this.indices) return null;
        return this.indices;
    }

    public TextureCoordinates(): Float32Array | null {
        if (!this.textureCoordinates) return null;
        return this.textureCoordinates;
    }

    public Normals(): Float32Array | null {
        if (!this.normals) return null;
        return this.normals;
    }

    public VertexSize(): number {
        return this.vertexAttributeArray.Data.byteLength;
    }

    public IndexSize(): number {
        if (!this.indices) return 0;
        return this.indices.byteLength;
    }

    public VertexCount(): number {
        // TODO: Valid for 2D vertices?
        return this.vertexAttributeArray.Data.length / 2;
    }

    public IndexCount(): number {
        if (!this.indices) return 0;
        return this.indices.length;
    }

    public SetAttribute(attribute: Attribute) {
        this.Attributes[attribute.Name] = attribute;
    }

    public GetIndexBuffer(): WebGLBuffer | null {
        return this.indexBuffer ? this.indexBuffer : null;
    }

    // TODO: Abstraction for context
    private createIndexBuffer(context: WebGLRenderingContext): WebGLBuffer {
        const indexBuffer = context.createBuffer();
        
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        context.bufferData(
            context.ELEMENT_ARRAY_BUFFER, 
            this.Indices(), 
            context.STATIC_DRAW
        );

        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);

        return indexBuffer;
    }

    private createTextureBuffer(context: WebGLRenderingContext): WebGLBuffer {
        // TODO
        throw Error("Not implemented");
    }

    private createNormalBuffer(context: WebGLRenderingContext): WebGLBuffer {
        const normalBuffer = context.createBuffer();
        
        context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);

        context.bufferData(
            context.ARRAY_BUFFER,
            this.Normals(),
            context.STATIC_DRAW
        );

        return normalBuffer;
    }

    // TODO: Only create when using wireframe shader program.
    // TODO: Use indices to create overlapping vertices.
    private createBarycentricBuffer(
        context: WebGLRenderingContext
    ): WebGLBuffer {
        const barycentricBuffer = context.createBuffer();
        
        context.bindBuffer(context.ARRAY_BUFFER, barycentricBuffer);

        context.bufferData(
            context.ARRAY_BUFFER,
            this.barycentricCoordinates,
            context.STATIC_DRAW
        );

        const barycentricAttribute = context.getAttribLocation(
            this.shaderProgram.GetProgram(),
            "a_barycentric"
        );

        context.vertexAttribPointer(
            barycentricAttribute,
            this.Dimension,
            context.FLOAT,
            false,
            0,
            0
        );

        context.enableVertexAttribArray(barycentricAttribute);

        context.bindBuffer(context.ARRAY_BUFFER, null);

        return barycentricBuffer;
    }

    // TODO: Create RenderOptions interface
    public Render(
        context: Context, 
        wireframe: boolean=false
    ) {
        if (wireframe) {
            // TODO
        }

        if (this.indices) {
            context.WebGL.bindBuffer(
                context.WebGL.ELEMENT_ARRAY_BUFFER, 
                this.indexBuffer
            );

            context.WebGL.drawElements(
                context.WebGL.TRIANGLES,
                this.IndexCount(),
                context.WebGL.UNSIGNED_SHORT,
                0
            );
        }
        else {
            context.WebGL.drawArrays(
                context.WebGL.TRIANGLES,
                0,
                this.VertexCount()
            );
        }
    }

    public SetShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }
}

export class Mesh2 extends Mesh {
    public constructor(shaderProgram: ShaderProgram, meshData: MeshData) {
        super(2, shaderProgram, meshData);
    }
}

export class Mesh3 extends Mesh {
    public constructor(shaderProgram: ShaderProgram, meshData) {
        super(3, shaderProgram, meshData);
    }
}

export const Shapes = {
    triangle: function() {
        throw Error('Not implemented');
    },
    rectangle: function(
        shaderProgram: ShaderProgram,
        width: number=0.5, height: number=0.5
    ) {
        const vertices = new Float32Array([
            -width, -height,
            width, -height,
            width, height,
            -width, height
        ]);

        const indices = new Uint16Array([
            0, 2, 3,
            0, 1, 2
        ]);

        // TODO: Use index buffer.
        return new Mesh2(shaderProgram, {
            vertices: vertices,
            indices: indices
        });
    },
    circle: function(
        shaderProgram: ShaderProgram,
        radius: number=0.5, vertices: number=64
    ) {
        // TODO: Assert vertices >= 3

        const verticeArray = new Float32Array((vertices + 1) * 2);
        const indexArray = new Uint16Array(vertices * 3);
        const angleStep = (2.0 * Pi) / vertices;
        let currentAngle = 0.0;
        let index = 0;
        
        verticeArray[0] = 0.0;
        verticeArray[1] = 0.0;
        for (let vertex = 1; vertex < vertices + 1; vertex++) {
            verticeArray[vertex * 2] = radius * Math.cos(currentAngle);
            verticeArray[(vertex * 2) + 1] = radius * Math.sin(currentAngle);
            
            indexArray[index++] = 0;
            indexArray[index++] = vertex;
            indexArray[index++] = vertex != vertices ? vertex + 1 : 1;

            currentAngle += angleStep;
        }

        return new Mesh2(shaderProgram, {
            vertices: verticeArray,
            indices: indexArray
        });
    },
    box: function(
        shaderProgram: ShaderProgram,
        xLength: number=0.5, 
        yLength: number=0.5, 
        zLength: number=0.5
    ) {
        const halfX = xLength / 2;
        const halfY = yLength / 2;
        const halfZ = zLength / 2;

        // TODO: Duplicate vertices so we can add normals per vertex
        const vertices = new Float32Array([
            // Left face
            -halfX, halfY, halfZ, // Top-Left-Back
            -halfX, halfY, -halfZ, // Top-Left-Front
            -halfX, -halfY, halfZ, // Bottom-Left-Back
            -halfX, -halfY, -halfZ, // Bottom-Left-Front

            // Front face
            -halfX, halfY, -halfZ, // Top-Left-Front
            halfX, halfY, -halfZ, // Top-Right-Front
            -halfX, -halfY, -halfZ, // Bottom-Left-Front
            halfX, -halfY, -halfZ, // Bottom-Right-Front

            // Right face
            halfX, halfY, -halfZ, // Top-Right-Front
            halfX, halfY, halfZ, // Top-Right-Back 
            halfX, -halfY, -halfZ, // Bottom-Right-Front
            halfX, -halfY, halfZ, // Bottom-Right-Back

            // Back face
            halfX, halfY, halfZ, // Top-Right-Back
            -halfX, halfY, halfZ, // Top-Left-Back
            halfX, -halfY, halfZ, // Bottom-Right-Back
            -halfX, -halfY, halfZ, // Bottom-Left-Back

            // Top face
            -halfX, halfY, halfZ, // Top-Left-Back
            halfX, halfY, halfZ, // Top-Right-Back
            -halfX, halfY, -halfZ, // Top-Left-Front
            halfX, halfY, -halfZ, // Top-Right-Front

            // Bottom face
            -halfX, -halfY, -halfZ, // Bottom-Left-Front
            halfX, -halfY, -halfZ, // Bottom-Right-Front
            -halfX, -halfY, halfZ, // Bottom-Left-Back
            halfX, -halfY, halfZ // Bottom-Right-Back
        ]);

        const indices = new Uint16Array([
            0, 2, 3, 0, 3, 1, // Left
            4, 6, 7, 4, 7, 5, // Front
            8, 10, 11, 8, 11, 9, // Right
            12, 14, 15, 12, 15, 13, // Back
            16, 18, 19, 16, 19, 17, // Top
            20, 22, 23, 20, 23, 21 // Bottom
        ]);

        const normals = new Float32Array([
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // Left
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, // Front
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // Right
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, // Back
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, // Top
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0 // Bottom
        ]);

        return new Mesh3(shaderProgram, {
            vertices: vertices,
            indices: indices,
            normals: normals
        });
    },
    sphere: function(
        shaderProgram: ShaderProgram,
        radius: number=0.5, slices: number=16
    ): Mesh3 {
        const vertexCount = 2 + (2 * slices * slices);
        
        const indexSize = (slices * 2 * 3 * 2) // Top and bottom triangles
            + ((slices - 1) * (2 * slices) * 3 * 2); // Middle quads
        
        const vertices = new Float32Array(vertexCount * 3);
        const indices = new Uint16Array(indexSize);
        const normals = new Float32Array(vertexCount * 3);

        const angleStep = Pi / slices;
        
        // Populate vertices
        // Top vertex
        vertices[0] = 0.0;
        vertices[1] = radius;
        vertices[2] = 0.0;
        
        // Middle vertices
        const azimuthSlices = slices;
        const azimuthIndices = (2 * slices);
        
        let currentVertexIndex = 3;
        let currentAzimuth = 0.0;
        let currentInclination = angleStep / 2;

        for (
            let azimuthSlice = 0;
            azimuthSlice < azimuthSlices;
            azimuthSlice++
        ) {
            for (
                let azimuthIndex = 0;
                azimuthIndex < azimuthIndices;
                azimuthIndex++
            ) {
                const vertexPosition = sphericalToCartesian(
                    radius, 
                    currentInclination, 
                    currentAzimuth
                );

                const normal = vertexPosition.Normalize();

                vertices[currentVertexIndex] = vertexPosition.x;
                normals[currentVertexIndex++] = normal.x;

                vertices[currentVertexIndex] = vertexPosition.y;
                normals[currentVertexIndex++] = normal.y;

                vertices[currentVertexIndex] = vertexPosition.z;
                normals[currentVertexIndex++] = normal.z;

                currentAzimuth += angleStep;
            }

            currentInclination += angleStep;
            
            // Should be 0 when inner loop terminates
            // Forcing back to 0 to ensure floating point precision
            currentAzimuth = 0.0; 
        }

        // Bottom vertex
        vertices[(vertexCount * 3) - 3] = 0.0;
        vertices[(vertexCount * 3) - 2] = -radius;
        vertices[(vertexCount * 3) - 1] = 0.0;

        // Populate indices
        // Helper function for calculating right-adjacent index
        const adjacentVertexIndex = (vertexIndex: number): number => {
            const row = Math.floor((vertexIndex - 1) / azimuthIndices);
            const column = (vertexIndex) % azimuthIndices;
            return (row * azimuthIndices) + column + 1;
        };

        // Top triangles
        let currentIndex = 0;

        for (
            let vertexIndex = 1;
            vertexIndex <= azimuthIndices;
            vertexIndex++
        ) {
            indices[currentIndex++] = 0;
            indices[currentIndex++] = vertexIndex;
            indices[currentIndex++] = adjacentVertexIndex(vertexIndex);
        }

        // Middle quads
        for (
            let vertexIndex = 1; 
            vertexIndex <= vertexCount - azimuthIndices - 2;
            vertexIndex++
        ) {
            indices[currentIndex++] = vertexIndex;
            indices[currentIndex++] = vertexIndex + azimuthIndices;
            indices[currentIndex++] = adjacentVertexIndex(
                vertexIndex + azimuthIndices
            );

            indices[currentIndex++] = vertexIndex;
            indices[currentIndex++] = adjacentVertexIndex(
                vertexIndex + azimuthIndices
            );
            indices[currentIndex++] = adjacentVertexIndex(vertexIndex);
        }


        // Bottom triangles
        for (
            let vertexIndex = vertexCount - azimuthIndices - 1;
            vertexIndex < vertexCount - 1;
            vertexIndex++
        ) {
            indices[currentIndex++] = vertexIndex;
            indices[currentIndex++] = vertexCount - 1;
            indices[currentIndex++] = adjacentVertexIndex(vertexIndex);
        }

        return new Mesh3(shaderProgram, {
            vertices: vertices,
            indices: indices,
            normals: normals
        });
    }
};

function sphericalToCartesian(
    radius: number, 
    inclinationRadians: number,
    azimuthRadians: number
): Vector3 {
    return new Vector3(
        radius * Math.sin(inclinationRadians) * Math.cos(azimuthRadians),
        radius * Math.cos(inclinationRadians),
        radius * Math.sin(inclinationRadians) * Math.sin(azimuthRadians)
    );
}

function barycentricVertices(
    vertices: Float32Array,
    indices?: Uint16Array,
): Float32Array {
    const coordinates: (number | null)[] = new Array(vertices.length);
    coordinates.fill(null);

    const barycentricTriangle = new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);
    
    // Use index array to determine the triangles each vertice belongs too
    if (indices) {
        for (let i = 0; i < indices.length; i++) {
            const vertexIndex = indices[i];
            const triangleIndex = i % barycentricTriangle.length;  
            
            if (coordinates[vertexIndex] != null) continue;

            coordinates[vertexIndex] = barycentricTriangle[triangleIndex];
        }
    }
    // Otherwise assume each 3-pair of vertices is a triangle
    else {
        for (let i = 0; i < vertices.length; i++) {
            const triangleIndex = i % barycentricTriangle.length;
            coordinates[i] = barycentricTriangle[triangleIndex];
        }
    }

    return new Float32Array(coordinates);
}