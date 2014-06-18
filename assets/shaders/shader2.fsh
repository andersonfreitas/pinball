precision mediump float;

varying vec3 normalInterp;
varying vec3 vertPos;
varying vec2 vTextureCoord;

uniform bool enableLight;
uniform sampler2D uSampler;

const vec3 lightPos = vec3(1.0,1.0,1.0);
const vec3 ambientColor = vec3(0.1, 0.0, 0.0);
uniform vec3 u_DiffuseLight;

const vec3 specColor = vec3(1.0, 1.0, 1.0);

void main() {

  vec3 normal = normalize(normalInterp);
  vec3 lightDir = normalize(lightPos - vertPos);

  float lambertian = max(dot(lightDir,normal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-vertPos);

    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, 16.0);
  }

  vec3 vLightWeighting = ambientColor + lambertian * u_DiffuseLight + specular * specColor;

  vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));

  if (enableLight) {
    gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
  } else {
    gl_FragColor = vec4(textureColor.rgb, textureColor.a);
  }
}
