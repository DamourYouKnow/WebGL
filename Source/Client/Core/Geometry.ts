import { App } from './App'
import { ShaderProgram } from './Shader';

export class Mesh {
    private vertices: Float32Array;
    private indices?: Uint16Array;
    private shaderProgram: ShaderProgram;

    public constructor(
        vertices: Float32Array | number[], 
        indices?: Uint16Array | number[]
    ) {
        if (vertices instanceof Float32Array) {
            this.vertices = vertices;
        }
        else {
            this.vertices = new Float32Array(vertices);
        }

        if (indices) {
            if (indices instanceof Uint16Array) {
                this.indices = indices;
            }
            else {
                this.indices = new Uint16Array(indices);
            }
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

    // TODO: Abstraction for context
    public CreateVertexBuffer(context: WebGLRenderingContext): WebGLBuffer {
        const vertexBuffer = context.createBuffer();
        
        context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
        
        context.bufferData(
            context.ARRAY_BUFFER, 
            this.Vertices(), 
            context.STATIC_DRAW
        );

        const positionAttribute = context.getAttribLocation(
            this.shaderProgram.GetProgram(),
            "a_position"
        );

        context.vertexAttribPointer(
            positionAttribute, 
            2,
            context.FLOAT, 
            false, 
            0, 
            0
        );

        context.enableVertexAttribArray(positionAttribute);

        context.bindBuffer(context.ARRAY_BUFFER, null);

        return vertexBuffer;
    }

    // TODO: Abstraction for context
    public CreateIndexBuffer(context: WebGLRenderingContext): WebGLBuffer {
        const indexBuffer = context.createBuffer();
        
        context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        context.bufferData(
            context.ELEMENT_ARRAY_BUFFER, 
            this.Indices(), 
            context.STATIC_DRAW
        );

        //context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null);

        return indexBuffer;
    }

        public Render(context: WebGLRenderingContext) {
        if (this.indices) {
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
        return new Mesh(vertices, indices);
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

        return new Mesh(verticeArray, indexArray);
    }
};