attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
// attribute vec4 aVertexColor;

uniform mat4 uPMatrix, uMVMatrix, normalMat;

varying vec3 normalInterp;
varying vec3 vertPos;
// varying vec4 vColor;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vec4 vertPos4 = uMVMatrix * vec4(aVertexPosition, 1.0);
  vertPos = vec3(vertPos4) / vertPos4.w;
  normalInterp = vec3(normalMat * vec4(aVertexNormal, 0.0));

  // vColor = aVertexColor;
}
