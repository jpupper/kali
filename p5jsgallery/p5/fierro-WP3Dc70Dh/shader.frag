precision highp float;
uniform float time;
uniform vec2 resolution;
uniform float rnd;
uniform sampler2D tx;

const float det=.01;
const float maxdist=50.;

mat2 rot(float a) {
  float s=sin(a);
  float c=cos(a);
  return mat2(c,s,-s,c);
}

void main() {
  vec2 uv=(gl_FragCoord.xy-resolution.xy*.5)/resolution.y;
  uv=abs(uv);
  uv*=rot(3.1416/4.*step(.5,rnd));
  uv+=.03;
  uv=floor(uv*20.);
  float f=fract(length(uv)*(12300.+rnd*10.));
  vec3 col=vec3(step(f,.5))*vec3(1,0,0)+.2;
  col=mix(vec3(.3,.15,.0),texture2D(tx,fract(uv/10.)).rgb,step(f,.3));
  float r=rnd+.1;
//  col.rb*=rot(uv.x*r*.5);
//  col.gb*=rot(uv.y*r*.5);
//  col=abs(col);
  if (mod(max(uv.x,uv.y),2.)<1.) col*=mod(gl_FragCoord.y,6.)*.5;
  else col*=mod(gl_FragCoord.x,6.)*.5;
  gl_FragColor=vec4(col*.4,1.);
}