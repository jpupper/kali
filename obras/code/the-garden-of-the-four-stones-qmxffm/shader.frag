precision mediump float;
uniform sampler2D tx;
uniform vec2 mouse;
uniform float mousepressed;
uniform vec2 resolution;
uniform float time;
uniform vec2 offset;
uniform vec2 fractparam;
uniform float colorot;
uniform float invert;
uniform float border;
uniform float scale;
uniform float orbit;

mat2 rot(float a) {
    float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
}

float hash(vec2 p)
{
    p*=100.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

varying vec2 vTexCoord;

vec3 fractal(vec2 p) {
    p+=offset*2.;
    p=abs(fract(p*(.1+scale*.4))-.5);
    float m=100.;
    float it;
    vec2 pm=p;
    for(int i=0; i<12; i++) {
        if (float(i)>time*10.) break;
        p=abs(p)/dot(p,p)-.55-fractparam*.1;
        float o=orbit>.5?length(p.y):length(p.x);
        m=min(m,o);
        if (m==o) {
            it=float(i);
            pm=p;
        }
    }
    m=smoothstep(.3,.2,m)*it*.05;
    vec3 col=vec3(0,m,m);
    col.rb*=rot(it);
    col.rg*=rot(it*.5);
    col=abs(col);
    return col+pm.x*.5;
}


void main(){
    vec2 uv=vTexCoord-.5;
    uv.x*=resolution.x/resolution.y;
    vec2 uv2=uv;
    vec2 uv3=uv*rot(floor(orbit*4.9)-2.);
    uv3=abs(uv3)-.2+border*.05;
    vec3 col = fractal(uv);
    col.rg*=rot(uv.x*2.+uv.y);
    if (abs(uv2.x)>.5-border*.1-.05||abs(uv2.y)>.5-border*.1-.05||length(uv3*uv3)<.02) 
        col=.7-col;
    col.gb*=rot((colorot-.5)*2.);
    col=mix(length(col)*vec3(.7),col,.3)-hash(uv)*.2;
    if (invert>.5) col=.7-col;
    gl_FragColor = vec4(col, 1.);
}
