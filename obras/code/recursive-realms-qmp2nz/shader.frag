precision highp float;

uniform float iTime;
uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform float fxrand;

varying vec2 vTexCoord;

//#define fxrand (iMouse.x/iResolution.x)
#define hash1 rnd(fxrand)
#define hash2 rnd(fxrand+.112)
#define hash3 rnd(fxrand+.213)
#define hash4 rnd(fxrand+.314)
#define hash5 rnd(fxrand+.415)
#define hash6 rnd(fxrand+.516)
#define hash7 rnd(fxrand+.617)
#define hash8 rnd(fxrand+.7137)
#define hash9 rnd(fxrand+.9127)
#define hash10 rnd(fxrand+.8137)
#define hash11 rnd(fxrand+.11127)
#define hash13 rnd(fxrand+.1217)


float rnd(float p)
{
    p*=1234.;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}


float det=.005;
float maxdist=5.;
vec3 ldir=vec3(1.,1.,-1.);
vec3 fcol;


float hash12(vec2 p)
{
    p*=1232.231;
    vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}


float segment(vec3 p, vec3 a, vec3 b) {
	float h = max(0.,min(1.,dot(p-a, b-a)/dot(b-a, b-a)));
    return length(p-a-h*(b-a));

}


mat2 rot(float a) {
	float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}


float de(vec3 pos) {
    pos.xz*=rot(.5+hash6*.2);
	float sc=1.3, d=1000., der=1.;
    vec3 p=pos,pa=vec3(0.),m=vec3(100.);
    float t=iTime*.3;
    p.x=abs(1.-mod(p.x,2.));
    for (int i=0; i<9; i++) {
        //p.yz*=rot(-.2);
        p.xz*=rot(-0.);
        p.xy*=rot(radians(110.));
        p=abs(p);
		p=p*sc-vec3(1.+hash2,-.5,1.3);
        der*=sc;
        d=min(d, segment(p,vec3(4.+hash3*8.,-1.,3.*hash4),pa)/der-(.5+hash5*.3)/der)+fract(p.x-iTime*.05)*.02;
        m=min(abs(p),m);
        pa=p;
    }
    fcol=normalize(m);
    return d;
}

float ao(vec3 p, vec3 n) {
	float st=.02;
	float ao=0.;
    for(float i=0.; i<6.; i++ ) {
        float td=st*i;
        float d=de(p+n*td);
        ao+=max(0.,(td-d)/td);
    }
    return clamp(1.-ao*.1,0.,1.);
}


vec3 normal(vec3 p) {
	vec3 e=vec3(0.,det,0.);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}

vec3 shade(vec3 p) {
    vec3 n=normal(p);
    ldir=normalize(ldir);
	float amb=.0;
    float dif=pow(max(0.,dot(ldir,-n)),7.)*2.;
	return fcol*(amb+dif);
}


vec3 march(vec3 from, vec3 dir) {
	vec3 p, col=vec3(0.);
    float totdist=hash12(dir.xy+iTime)*.1,d;
    vec3 g=vec3(0.);
    for(int i=0; i<150; i++) {
		p=from+totdist*dir;
        d=de(p);
        if (totdist>maxdist) break;
        totdist+=max(.0001,abs(d));
        g+=.01/(.01+d*d)*fcol*exp(-.7*totdist);
    }
    col=1.-g*.04;
    col=pow(col,vec3(2.));
    col+=shade(p);
    col=clamp(col,vec3(0.),vec3(1.));
    col.gb*=rot(hash10*6.);
    col.rb*=rot(hash9*6.);
    col=abs(col);
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    uv.y=1.-uv.y;
    vec3 feedback=texture2D(iChannel0, uv).rgb;
    col=mix(length(col)*vec3(.5),col,.2+hash11*.7);
    col=mix(col, feedback, .9);
    return col;
}

void main()
{
    vec2 uv = vTexCoord - .5;
    uv.x*=iResolution.x/iResolution.y;

    vec2 uv2=uv;
    uv*=rot(hash7*3.);
    vec3 from = vec3(.5,0.,-6.);
    vec3 dir = normalize(vec3(uv,1.));
    vec3 col = march(from, dir);
    gl_FragColor = vec4(col,1.0);
}