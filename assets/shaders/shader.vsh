float PI = 3.14159265358979323846264;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;

uniform bool enableLight;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 u_DiffuseLight;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
varying vec4 vColor;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

  if (enableLight) {
    float nDotL = max(dot(u_LightDirection, aVertexNormal), 0.0);
    vec3 diffuse = u_DiffuseLight * aVertexColor.rgb * nDotL;
    vec3 ambient = u_AmbientLight * aVertexColor.rgb;
    vColor = vec4(diffuse + ambient, aVertexColor.a);
  } else {
    vColor = aVertexColor;
  }
}
