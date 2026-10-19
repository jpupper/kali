precision mediump float;

uniform vec2 resolution;
uniform float time;
#define iResolution resolution
#define iTime time

uniform float adv;
uniform float frame;
uniform float offsetX;
uniform float fScale;
uniform float colorOffset;
uniform float colorOffset2;
uniform float camrot;
uniform bool  grayscale;
uniform float lights;

varying vec2 vTexCoord;

float det=.0001;
float maxdist=15.;
vec3 ldir=vec3(0.5,1.,1.);
vec3 pa;
float gcol;
float t, it, k;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rot(float a) {
    a=radians(a);
	float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}


float dot2( in vec3 v ) { return dot(v,v); }
float sdBoundingBox( vec3 p, vec3 b, float e)
{
       p = abs(p  )-b;
  vec3 q = abs(p+e)-e;

  return sqrt(min(min(dot2(max(vec3(p.x,q.y,q.z),0.0)),
                      dot2(max(vec3(q.x,p.y,q.z),0.0))),
                      dot2(max(vec3(q.x,q.y,p.z),0.0)))) 
         +min(0.0,min(min( max(p.x,max(q.y,q.z)),
                           max(p.y,max(q.z,q.x))),
                           max(p.z,max(q.x,q.y))));
}


float shape(vec3 p, float zl) {
    //p.xz*=rot(smoothstep(.28,.3,abs(.5-fract(iTime*.05+floor((z-frame)*4.)*.005)))*90.);
    float d=sdBoundingBox(p,vec3(1.,1.,1.+offsetX*2.),.07);
    return d;
}

vec3 path(float t) {
	return vec3(sin(t*.5),cos(t)*.5,t);
}

vec3 pathcam(float t) {
	vec3 p=path(t);
    //p.y+=sin(t);
    return p;
}



float de(vec3 pos) {
	float tu=length(pos.xy-pathcam(pos.z).xy)-.1;
    pos.y+=-1.;
    pos.x-=.4;
	pos.xy-=path(pos.z).xy;
    float z=pos.z;
    pos.xy=abs(2.-mod(pos.xy,4.))-2.;
    pos.z=abs(4.-mod(pos.z,8.))-4.;
    pa=pos;
	float sc=1.4, d=1000., der=1.;
    vec3 p=pos,m=vec3(100.);
    float o=1000.;
    for (int i=0; i<8; i++) {
        p.xy*=rot(90.);
        p.xz=abs(p.xz);
        p.y+=1.;
        sc=fScale/clamp(dot(p,p),0.05,1.0);
		p=p*sc-vec3(2.,1.,3.);
        p.y-=1.;
        der*=sc;
        float shp=shape(p,z)/der;
        if (shp<d && i>1) {
            d=shp;
            it=float(i);
        }
        o=min(o,length(p));
    }
    d=min(d,length(p.xy)/der-.005);
    gcol=step(fract(pos.z*.1+iTime*.1*lights*sign(p.x)+p.z*.005+it*.25),.02)*10.+1.5;
    d=max(d,-tu);
    return d*.7+max(0.,2.-time*2.+z-frame)*.03;
}

vec3 march(vec3 from, vec3 dir) {
	vec3 p, col=vec3(0.);
    float totdist=0.,d;
    float g=0.,gg=0.;
    for(int i=0; i<130; i++) {
		p=from+totdist*dir;
        d=de(p);
        det*=1.+totdist*.03;
        if (d<det || totdist>maxdist) break;
        totdist+=d*(1.+hash12(dir.xy*123.)*.3);
        g+=exp(-.03*totdist)*gcol;
    }
    if (d<.1) {
        //col=length(gcol)*vec3(.05);
    }
    col+=pow(g*.01,2.)*vec3(1.,.25,.0);
    col=mix(vec3(1.),col,exp(-.07*totdist));
    //col=pow(col,vec3(1.3))*1.5;
    return col;
}

mat3 lookat(vec3 dir, vec3 up) {
	dir=normalize(dir); vec3 r=normalize(cross(dir,up));
    return mat3(r,cross(dir,r),dir);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	t=frame+adv;
    //t=time+frame;
    vec2 uv = vTexCoord - .5;
    uv.x*=resolution.x/resolution.y;
    uv*=rot(t);
    vec3 from = pathcam(t);
    vec3 to = pathcam(t+2.);
    vec3 adv = normalize(to-from);
    vec3 dir = normalize(vec3(uv,.5));
    dir*=lookat(adv,vec3(0.,1.,0.));
//    dir.xy*=rot(45.);
    dir.xz*=rot(camrot);
    vec3 col = march(from, dir)*max(mod(fragCoord.x,3.),mod(fragCoord.y,3.))*.7;
    //col=min(vec3(1.),col);
    col.rb*=rot(180.*colorOffset);
    col.gb*=rot(180.*colorOffset2+dir.x*45.);
    col=abs(col);
    col.gb*=rot(20.);
    col=mix(length(col)*vec3(.5), col, .5);
    if (grayscale) col=col.ggg;
    fragColor = vec4(col,1.0);
}

void main() {
    vec4 col;
    mainImage(col, vTexCoord*resolution);
    gl_FragColor = col;
}

