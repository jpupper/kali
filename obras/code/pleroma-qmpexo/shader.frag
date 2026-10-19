precision highp float;

uniform float iTime;
uniform float iteration;
uniform float rotation;
//uniform float mirror;
uniform float saturation;
uniform float inverted;
uniform float cant;
uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform float fxrand;
uniform float second;
uniform bool shapes;
uniform float shapesIntensity;
uniform float shapesDistortion;
uniform float shapesSize;

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
#define hash12 rnd(fxrand+.1127)
#define hash13 rnd(fxrand+.17)
#define hash14 rnd(fxrand+.7543)
#define hash15 rnd(fxrand+.2713)
#define hash16 rnd(fxrand+.3127)
#define hash17 rnd(fxrand+.4121)
#define hash18 rnd(fxrand+.5127)
#define hash19 rnd(fxrand+.6123)
#define hash20 rnd(fxrand+.5433)
#define hash21 rnd(fxrand+.2553)
#define hash22 rnd(fxrand+.1473)
#define hash23 rnd(fxrand+.3453)
#define hash24 rnd(fxrand+.4413)



float it=0.;
float sca;
float scala;


float rnd(float p)
{
    p*=1234.;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}

mat2 rot(float a) {
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

float hash(vec2 p)
{
    vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}
float de(vec3 p) {
    //p.x=abs(p.x)-hash12;
    vec3 p2=p;
    //p.yz*=rot(iTime*.1);
    p.xz*=rot(hash24*6.);
    float d=100.;
    p*=.2+hash10*.3;
    for (float i=0.; i<30.; i++) {
        //if (i>20.+hash11*30.) break;
        p.xy=sin(p.xy*2.);
        p.xy*=rot(.7);
        p.xz*=rot(1.5);
        float l=length(p.xy)-.0;
        if (i>2.) d=min(d,l);
        if (d==l) it=i;
    }
    return d*.3;
}

vec3 march(vec3 from, vec3 dir, vec2 uv) {
    float d, td=hash14*3.+hash(gl_FragCoord.xy+iTime)*.1;
    vec3 p, col=vec3(0.);
    for (int i=0; i<80; i++){
        p=from+dir*td;
        d=max(.01,abs(de(p)));
        td+=d;
        if (td>50.) break;
        vec3 c=vec3(.3,.5,1.);
        float vc=it*hash15+6.*hash16+length(dir.xy)*hash13*5.;
        c.rb*=rot(vc);
        c.gb*=rot(vc*step(.5,hash18));
        c.rg*=rot(vc*step(.5,hash19)*.5);
        //c=abs(c);
        c=normalize(1.+c);
        //c*=exp(-.05*td);
        //c*=exp(-1.*length(p));
        c*=smoothstep(.0,.05,d)*.03;
        c*=step(length(dir.xy)+it*5.+abs(atan(p.x,p.y)*5.)*0.,iTime*60.);
        col+=c;
    }
    col*=1.+exp(-4.*abs(dir.x));
    if (inverted>.5) col = vec3(1.)-col*(.3+shapesIntensity*.4);
    else col*=(.2+shapesIntensity*.0+.4), col*=col;
    col+=(hash(gl_FragCoord.xy)-.5)*.15;
    //col = min(vec3(.7,.6,.5),col);
    return col;
}



void main()
{
    vec2 uv = (gl_FragCoord.xy-iResolution.xy*.5)/iResolution.y;
    uv*=rot(radians(rotation));
    if (cant==0.) sca=.9+hash2*.3;
    //else sca=.9+hash2*.7;
    else sca=1.;
    uv*=sca;
    //uv.x*=sign(mirror-.5);
    if (cant==3.) {
        uv.x+=.1;
        if (iteration==1.) {
            uv.x+=.15;
            uv.y-=.1;
            uv*=1.5;
            uv*=rot(radians(45.));
        };
        if (iteration==2.) {
            uv.x-=.3;
            uv.y-=.2;
            uv*=1.8;
            uv*=rot(radians(-50.));
        };
        if (iteration==3.) {
            uv.x-=.25;
            uv.y+=.35;
            uv*=1.4;
            uv*=rot(radians(-20.));
        };
    } 
    if (cant==2.) {
        uv.y+=.2;
        uv.x+=.1;
        if (iteration==1.) {
            uv.x+=.15;
            uv.y-=.1;
            uv*=1.5;
            uv*=rot(radians(45.));
        };
        if (iteration==2.) {
            uv.x-=.3;
            uv.y-=.2;
            uv*=1.8;
            uv*=rot(radians(-45.));
        };
    } 
    if (iteration>cant) return;
    //uv.x*=1.+sin(iTime);

    //uv.y=-uv.y;
    //uv.x*=1.+step(0.,-uv.y+cos(uv.x*2.));
    //uv*=rot(radians(90.));
    vec3 from=vec3(0.,0.,-0.-cos(iTime*.5)*0.);
    vec3 dir=normalize(vec3(uv,1.2));
    float circ=step(length(uv+sin(uv.y*50.)*.0),.2+hash6*.4*shapesSize);
    float box=step(length(max(vec2(0),abs(uv+sin(uv.y*50.)*.0)-.2-hash6*.4*shapesSize)),.0);
    dir*=1.-sin(uv.x*(300.+500.*shapesDistortion))*.2*shapesSize;
    if (shapes) {    
        if (hash20>.5&&false) dir*=1.-box*.5*shapesDistortion;
        else dir*=1.-circ*.5*shapesDistortion;
    }
    vec3 col=march(from, dir, uv);
    col=mix(length(col)*vec3(.5),col,saturation*.6);
    if (shapes&&inverted<.5) {
        if (hash20>.5&&false) col*=1.+box*shapesIntensity;
        else col*=1.+circ*shapesIntensity;
    }
    if (shapes&&inverted>.5) {
        if (hash20>.5&&false) col*=1.-box*shapesIntensity*.3;
        else col*=1.-circ*shapesIntensity*.3;
    }

    col*=vec3(1.1,1.0,0.9);

    gl_FragColor = vec4(col, 1.);
}