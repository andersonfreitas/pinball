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

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uPMatrix, uMVMatrix, normalMat;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec4 vColor;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vec4 vertPos4 = uMVMatrix * vec4(aVertexPosition, 1.0);
  vertPos = vec3(vertPos4) / vertPos4.w;
  normalInterp = vec3(normalMat * vec4(aVertexNormal, 0.0));
}
