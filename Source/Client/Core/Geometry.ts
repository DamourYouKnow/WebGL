import { App } from './App'
import { ShaderProgram } from './Shader';

type Dimension = 2 | 3;

interface MeshData {
    vertices: Float32Array | number[],
    indices?: Uint16Array | number[],
    textureCoordinates?: Float32Array | number[]
}

export class Mesh {
    private dimension: Dimension;

    private vertices: Float32Array;
    private indices?: Uint16Array;
    private textureCoordinates: Float32Array;

    private vertexBuffer: WebGLBuffer;
    private indexBuffer?: WebGLBuffer;
    private textureBuffer?: WebGLBuffer;

    private shaderProgram: ShaderProgram;

    public constructor(
        dimension: Dimension, 
        meshData: MeshData,
    );

    public constructor(
        dimension: Dimension, 
        meshData: MeshData,
    ) {
        this.dimension = dimension;

        // Create vertex buffer
        this.vertices = meshData.vertices instanceof Float32Array ?
            meshData.vertices : new Float32Array(meshData.vertices);

        this.vertexBuffer = this.createVertexBuffer(App.Instance.Context);

        // Create index buffer if applicable
        if (meshData.indices) {
            this.indices = meshData.indices instanceof Uint16Array ?
                meshData.indices : new Uint16Array(meshData.indices);

            this.indexBuffer = this.createIndexBuffer(App.Instance.Context);
        }

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
                App.Instance.Context
            );
        }
    }
    
    public Vertices(): Float32Array {
        return this.vertices;
    }

    public Indices(): Uint16Array | null {
        if (!this.indices) return null;
        return this.indices;
    }

    public VertexSize(): number {
        return this.vertices.byteLength;
    }

    public IndexSize(): number {
        if (!this.indices) return 0;
        return this.indices.byteLength;
    }

    public VertexCount(): number {
        return this.vertices.length / 2; // TODO: Valid for 2D vertices
    }

    public IndexCount(): number {
        if (!this.indices) return 0;
        return this.indices.length;
    }

    public GetVertexBuffer(): WebGLBuffer {
        return this.vertexBuffer;
    }

    public GetIndexBuffer(): WebGLBuffer | null {
        return this.indexBuffer ? this.indexBuffer : null;
    }

    // TODO: Abstraction for context
    private createVertexBuffer(context: WebGLRenderingContext): WebGLBuffer {
        const vertexBuffer = context.createBuffer();
        
        context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
        
        context.bufferData(
            context.ARRAY_BUFFER, 
            this.Vertices(), 
            context.STATIC_DRAW
        );

        context.bindBuffer(context.ARRAY_BUFFER, null);

        return vertexBuffer;
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

    private createTextureBuffer(contenxt: WebGLRenderingContext): WebGLBuffer {
        throw Error("Not implemented");
    }

    public Render(context: WebGLRenderingContext) {
        context.bindBuffer(context.ARRAY_BUFFER, this.vertexBuffer);

        const positionAttribute = context.getAttribLocation(
            this.shaderProgram.GetProgram(),
            "a_position"
        );

        context.vertexAttribPointer(
            positionAttribute, 
            this.dimension,
            context.FLOAT, 
            false, 
            0, 
            0
        );

        context.enableVertexAttribArray(positionAttribute);


        if (this.indices) {
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            context.drawElements(
                context.TRIANGLES,
                this.IndexCount(),
                context.UNSIGNED_SHORT,
                0
            );
        }
        else {
            context.drawArrays(
                context.TRIANGLES,
                0,
                this.VertexCount()
            )
        }
    }

    public SetShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }
}

export class Mesh2 extends Mesh {
    public constructor(meshData: MeshData) {
        super(2, meshData);
    }
}

export class Mesh3 extends Mesh {
    public constructor(meshData) {
        super(3, meshData);
    }
}

export const Shapes = {
    triangle: function() {
        throw Error('Not implemented');
    },
    rectangle: function(width: number=0.5, height: number=0.5) {
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
        return new Mesh2({
            vertices: vertices,
            indices: indices
        });
    },
    circle: function(radius: number=0.5, vertices: number=64) {
        // TODO: Assert vertices >= 3

        const verticeArray = new Float32Array((vertices + 1) * 2);
        const indexArray = new Uint16Array(vertices * 3);
        const angleStep = (2.0 * Math.PI) / vertices;
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

        return new Mesh2({
            vertices: verticeArray,
            indices: indexArray
        });
    },
    box: function(xLength: number=0.5, yLength: number=0.5, zLength: number=0.5) {
        const halfX = xLength / 2;
        const halfY = yLength / 2;
        const halfZ = zLength / 2;

        const vertices = new Float32Array([
            -halfX, -halfY, -halfZ, // Bottom-Left-Front
            halfX, -halfY, -halfZ, // Bottom-Right-Front
            -halfX, -halfY, halfZ, // Bottom-Left-Back
            halfX, -halfY, halfZ, // Bottom-Right-Back
            -halfX, halfY, -halfZ, // Top-Left-Front
            halfX, halfY, -halfZ, // Top-Right-Front
            -halfX, halfY, halfZ, // Top-Left-Back
            halfX, halfY, halfZ // Top-Right-Back 
        ]);

        const indices = new Uint16Array([
            0, 2, 1, 1, 2, 3, // Bottom (clockwise)
            0, 1, 4, 1, 5, 4, // Front (counter-clockwise)
            2, 6, 3, 3, 6, 7, // Back (clockwise)
            0, 4, 2, 2, 4, 6, // Left (clockwise)
            1, 3, 5, 3, 7, 5, // Right (counter-clockwise)
            4, 5, 6, 5, 7, 6 // Top (counter-clockwise)
        ]);

        return new Mesh3({
            vertices: vertices,
            indices: indices
        });
    }
};