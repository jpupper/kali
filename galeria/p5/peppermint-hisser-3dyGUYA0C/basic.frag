precision mediump float;
varying vec2 vTexCoord;
void main() {
  vec2 uv=gl_FragCoord.xy/500.-.5;
  vec4 redColor = vec4(1.0, 0.0, 0.0, .5);
  redColor*=smoothstep(.4,.39,length(uv));
  gl_FragColor = redColor;
}