precision highp float;
uniform float time;
uniform vec2 resolution;
uniform float mode;

const float det=.01;
const float maxdist=50.;

mat2 rot(float a) {
  float s=sin(a);
  float c=cos(a);
  return mat2(c,s,-s,c);
}

float de(vec3 p) {
  p.xz*=rot(time);
  p.yz*=rot(time);
  return length(p)-2.-length(sin(p*2.))*.5;
}

vec3 normal(vec3 p) {
  vec2 d=vec2(0.,det);
  return normalize(vec3(de(p+d.yxx),de(p+d.xyx),de(p+d.xxy))-de(p));
}


vec3 march(vec3 from, vec3 dir) {
  vec3 p, col=vec3(0.), n=col;
  float d, td=0.;
  for (int i=0; i<80; i++) {
    p=from+dir*td;
    d=de(p);
    if (d<det || td>maxdist) break; 
    td+=d;
  }
  if (d<det) {
    p-=det*dir*2.;
    col=vec3(1);
    n=normal(p);
  }
  return (.5+n*.5)*col;
}

void main() {
  vec2 uv=(gl_FragCoord.xy-resolution.xy*.5)/resolution.y;
  vec3 from=vec3(0.,0.,-10.);
  vec3 dir=normalize(vec3(uv,1.));
  vec3 col=march(from, dir);
  gl_FragColor=vec4(col,1.);
}