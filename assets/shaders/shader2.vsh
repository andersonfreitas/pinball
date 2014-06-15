float PI = 3.14159265358979323846264;

// attribute vec3 aVertexPosition;
// attribute vec4 aVertexColor;
// attribute vec3 aVertexNormal;

// uniform bool enableLight;

// uniform mat4 uMVMatrix;
// uniform mat4 uPMatrix;
// uniform vec3 u_DiffuseLight;
// uniform vec3 u_LightDirection;
// uniform vec3 u_AmbientLight;
// varying vec4 vColor;

// void main() {
//   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

//   if (enableLight) {
//     float nDotL = max(dot(u_LightDirection, aVertexNormal), 0.0);
//     vec3 diffuse = u_DiffuseLight * aVertexColor.rgb * nDotL;
//     vec3 ambient = u_AmbientLight * aVertexColor.rgb;
//     vColor = vec4(diffuse + ambient, aVertexColor.a);
//   } else {
//     vColor = aVertexColor;
//   }
// }

attribute vec4 aVertexPosition;
attribute vec4 aVertexNormal;

uniform mat4 uMVMatrix;
uniform vec4 LightPosition;
uniform mat4 uPMatrix;

varying vec3 N;
varying vec3 L;
varying vec3 E;

void main() {
  gl_Position = uPMatrix * uMVMatrix * aVertexPosition;

  N = aVertexNormal.xyz;

  L = LightPosition.xyz - aVertexPosition.xyz;
  if (LightPosition.w == 0.0)
    L = LightPosition.xyz;

  E = aVertexPosition.xyz;
}
