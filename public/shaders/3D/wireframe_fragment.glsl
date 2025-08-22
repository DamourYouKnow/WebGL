precision mediump float;

varying vec3 v_barycentric;

bool isEdge(vec3);

void main() {
    if (isEdge(v_barycentric)) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else {
        gl_FragColor = vec4(0.25, 0.25, 0.25, 0.5);
    }
}

bool isEdge(vec3 barycentric) {
    float tolerance = 0.05;
    
    if (barycentric.x < tolerance) return true;
    if (barycentric.y < tolerance) return true;
    if (barycentric.z < tolerance) return true;

    return false;
}