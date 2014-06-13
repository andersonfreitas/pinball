precision mediump float;

varying vec2 aVertexPosition;
sampler2D source;
float timer;
float luminanceThreshold;
float amplification;
vec3 aVertexColor;

float makeNoise(float u, float v, float timer) {
  float x = u * v * mod(timer * 1000.0, 100.0);
  x = mod(x, 13.0) * mod(x, 127.0);
  float dx = mod(x, 0.01);
  return clamp(0.1 + dx * 100.0, 0.0, 1.0);
}

void main(void) {
  vec3 noise = vec3(
    makeNoise(vTexCoord.x, vTexCoord.y, timer),
    makeNoise(vTexCoord.x, vTexCoord.y, timer * 200.0 + 1.0),
    makeNoise(vTexCoord.x, vTexCoord.y, timer * 100.0 + 3.0)
  );
  vec4 pixel = texture2D(source, vTexCoord + noise.xy * 0.0025);
  float luminance = dot(vec3(0.299, 0.587, 0.114), pixel.rgb);
  pixel.rgb *= step(luminanceThreshold, luminance) * amplification;
  vColor = vec4( (pixel.rgb + noise * 0.1) * nightVisionColor, pixel.a);
}
