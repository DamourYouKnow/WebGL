attribute vec2 a_position;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;


void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix 
        * vec4(a_position, 0.0, 1.0);
}