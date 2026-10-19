precision mediump float;


const float effect_mix=1.;
const float effect_exp=0.4;
const float color_mix=1.;
const float sample_size=0.1;
const float brightness=1.;
const bool invert=true;

varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform float mouseX;


void main() {
  vec2 uv = vTexCoord;
  // uv *= -1.;
  
  //////////////////////////
  
  float size = 2. + sample_size * 10.;
  float it = floor(size*size);
  // const int it = floor(size*size);
  vec3 C = texture2D(tex0,1.-uv).rgb;
  vec3 R = vec3(0.);
  // TODO: CHANGE 2
  for(float i=0.; i<3.; i++) {
    vec2 p =  vec2(
      mod(i,size), floor(i/size)
    ) - floor (size * .5);
    vec3 aC = texture2D(
      tex0,
      (
        gl_FragCoord.xy+p)/vec2(500,500)
      ).rgb;
      R += pow(distance(C, aC), effect_exp * 3.);
  };
  R /= it;
  R = mix(R,C*R,color_mix);
  R *= 1. + brightness * 50.;
  if (invert) R = 1. -mix(C,R,effect_mix);
  else R = mix(C,R,effect_mix);
  
  // fragColor = vec4(R,1.);
  
  /////////////////////////

  gl_FragColor = vec4(R, 1.0);
}