precision mediump float;

uniform vec4 AmbientProduct, DiffuseProduct, SpecularProduct;
uniform mat4 uMVMatrix;
uniform vec4 LightPosition;
uniform float Shininess;

varying vec3 N;
varying vec3 L;
varying vec3 E;

void main() {
    vec3 NN = normalize(N);
    vec3 EE = normalize(E);
    vec3 LL = normalize(L);

    vec4 ambient, diffuse, specular;

    vec3 H = normalize(LL+EE);
    float Kd = max(dot(LL, NN), 0.0);
    Kd = dot(LL, NN);

    float Ks = pow(max(dot(NN, H), 0.0), Shininess);
    ambient = AmbientProduct;
    diffuse = Kd*DiffuseProduct;

    if (dot(LL, NN) < 0.0)
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    else specular = Ks*SpecularProduct;

    gl_FragColor = vec4((ambient + diffuse + specular).xyz, 1.0);
}
