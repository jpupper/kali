precision mediump float;
varying vec2 vTexCoord;
uniform vec2 resolution;

float det=.001;

float map(vec2 p) {
  return sin(p.x);
}

vec3 normal(vec2 p) { 
	vec2 e = vec2(0.0,.1);
	float d1=map(p+e.yx),d2=map(p-e.yx);
	float d3=map(p+e.xy),d4=map(p-e.xy);
	float d=map(p);
	return normalize(vec3(d2-d1,e.y*10.,d4-d3));
}

vec3 march(vec3 from, vec3 dir) {
  float td=0., st=.01, h=0.;
  vec3 p, col=vec3(0.);
  for (int i=0; i<300; i++) {
    p=from+dir*td;
    h=map(p.xz);
    if (h>p.y) break;
    td+=st;
  }
  vec3 n=normal(p.xz);
  if (h>p.y) {
    col=vec3(n.y);
  }
  return col;
}

mat3 lookat(vec3 dir) {
	dir=normalize(dir);vec3 rt=normalize(cross(dir,vec3(0.,1.,0.)));
    return mat3(rt,cross(rt,dir),dir);
}

void main() {
  vec2 uv=vTexCoord-.5;
  uv.x*=resolution.x/resolution.y;
  vec3 from=vec3(0.,-1.,-10.);
  vec3 dir=normalize(vec3(uv, 1.));
  dir=lookat(-from)*dir;
  vec3 col=march(from, dir);
  gl_FragColor = vec4(col, 1.);
}