attribute vec3 a_position;
attribute vec3 a_barycentric;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

varying vec3 v_barycentric;

void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix 
        * vec4(a_position, 1.0);

    v_barycentric = a_barycentric;
}