precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform float uTime;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
mat2 rot(float a) {
  float s=sin(a),c=cos(a);
  return mat2(c,s,-s,c);
}
void main() {
  vec2 uv = vTexCoord;
  
  // Generate noise
  float n = noise(uv * 5.0 + uTime * 2.1);
  
  // Use noise to displace texture coordinates
  vec2 displacedUV = uv + vec2(n * 0.02);
  
  // Sample the texture with displaced coordinates
  vec4 color = texture2D(uTexture, displacedUV);
  color-=random(uv+uTime*.01)*.2;
  color.rb*=rot(uv.y*1.5);
  color=abs(color);
  color=mix(length(color)*vec4(.5),color,.5);
  gl_FragColor = color;
}