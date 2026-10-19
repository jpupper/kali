precision highp float;

#define PI 3.1416

float g = 0.;
vec3 objcol=vec3(0.);
vec3 from;
vec3 pobj;
float box;
float hit=0.;

#define hash1 rnd(fxrand+.6546)
#define hash2 rnd(fxrand+1.1123)
#define hash3 rnd(fxrand+2.2432)
#define hash4 rnd(fxrand+3.3543)
#define hash5 rnd(fxrand+4.4123)
#define hash6 rnd(fxrand+5.5765)
#define hash7 rnd(fxrand+6.7236)
#define hash8 rnd(fxrand+7.1376)
#define hash9 rnd(fxrand+8.9176)
#define hash10 rnd(fxrand+10.1076)
#define hash11 rnd(fxrand+11.1113)
#define hash12 rnd(fxrand+21.1196)
#define hash13 rnd(fxrand+41.1276)
#define hash14 rnd(fxrand+14.5676)
#define hash15 rnd(fxrand+15.8246)
#define hash16 rnd(fxrand+16.8264)
#define hash17 rnd(fxrand+17.3264)
#define hash18 rnd(fxrand+18.8264)
#define hash19 rnd(fxrand+19.2824)
#define hash20 rnd(fxrand+20.4814)
#define hash21 rnd(fxrand+21.1444)
#define hash22 rnd(fxrand+22.3414)
#define hash23 rnd(fxrand+23.4424)
#define hash24 rnd(fxrand+24.1444)
#define hash25 rnd(fxrand+25.1234)
#define hash26 rnd(fxrand+26.8764)
#define hash27 rnd(fxrand+27.7142)
#define hash28 rnd(fxrand+28.1231)
#define hash29 rnd(fxrand+24.3431)
#define hash30 rnd(fxrand+25.1231)
#define hash31 rnd(fxrand+31.1341)
#define hash32 rnd(fxrand+32.5431)
#define hash33 rnd(fxrand+33.1541)
#define hash34 rnd(fxrand+34.1344)
#define hash35 rnd(fxrand+35.1344)
#define hash36 rnd(fxrand+36.1344)

uniform vec2 resolution;
uniform float time;
uniform float rotax;
uniform float rotay;
uniform float fxrand;
//float fxrand = 1.;

varying vec2 vTexCoord;


#define iTime time*0.2
#define iResolution resolution

float det=.01,st=.1,sph;
vec3 pos;


float hash(vec2 p)
{
    p*=1342.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float rnd(float p)
{
    p*=1234.;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}

mat2 rot(float a)
{
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

float obj(vec3 p)
{
    hit=0.;
    vec3 p2=p;
    p.xy*=rot(sin(iTime*.5)*.5);
    p.xz*=rot((hash25-.5)*1.);
    p.yz*=rot((hash31-.5));
//    p.x=abs(p.x)-5.;
    float s=sin(iTime*3.);
    float si1=sign(hash6-.5);
    float si2=sign(hash7-.5);
    p.xy*=rot((hash15-.5)*2.);
    vec3 p3=p;
    p.xz*=rot(iTime*si1-p.y*(.15+hash2*.7));
    p.xy*=rot(iTime*si2-p.z*(.15+hash3*.7));
    sph=length(p)-1.5-length(sin(p*(2.+hash35*6.)))*.8-hash8*1.5;
    sph-=s*s*.3;
    pos=p;
    float d;
    d=length(p)-1.-hash5*2.;
    //if (hash21>.7) d=length(p.yz)-1.-hash5*2.;
    d=max(d,-length(p.xy)+2.5+hash12*.5);
    d=max(d,-length(p.xz)+2.5+hash12*.5);
    d=max(d,-length(p.yz)+2.5+hash12*.5);
    float desp=(hash21-.5)*15.;
    float rem=length(p.yz+vec2(desp,0.))*(.5+hash23*.5)+hash11*.9;
    sph=min(sph,length(p.xz-vec2(8.,0.))-.1+step(.7,hash34)*10.);
    d=min(d,rem);
    d-=length(sin(p*(hash20*2.+2.)));
    d=min(d,sph);
    pobj=p;    
    if (d==rem) hit=1.;
    //d=max(d,-p2.z+from.z+3.);
    return d*.2;
}

float de(vec3 p) {
    hit=0.;
    float d1=obj(p);
    float d2=p.y+0.5+sin(length(p)*10.)*.005+hash17*10.;
    float d=min(d1,d2);
    if (d==d2) hit=1.;
    return d1;
}

vec3 normal(vec3 p)
{
    vec2 e=vec2(0.,det);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}

vec3 march(vec3 from, vec3 dir) 
{
    float td=0.,d=3.,maxdist=30.,g=0.,ref=0.;
    vec3 p=from,col=vec3(.0);
    float h=hash(dir.xy+mod(iTime,10.))-.5;
    float hitio=0.;
    for (int i=0; i<150; i++)
    {
        p+=dir*d*(1.+h*.1);
        d=de(p);
        if (td>maxdist) break;
        if (d<det&&ref<1.) 
        {
            hitio=hit;
            ref++;
            vec3 n=normal(p);
            dir=reflect(dir,n);
            p+=det*dir;
            continue;
        }
        if (d<det) {
            hitio=hit;
            break;
        }
        //td+=st;
        td+=d;
        g=max(g,.155/(.1+sph));
        g+=.25/(.1+d*.5)*.004*step(.0,hash18);
    }
    vec3 gcol=vec3(1.,.4,.2)*.9;
      if (hash1>.17) gcol=vec3(1.,.3,.1);
      if (hash1>.34) gcol=vec3(.7);
      if (hash1>.51) gcol=vec3(.0,.5,1.5);
      if (hash1>.68) gcol=vec3(.2,.7,.3);
      if (hash1>.85) gcol=vec3(.5,.6,.6);
    if (d<.1) 
    {
        //vec3 ldir=normalize(vec3(2.,1.,-1.));
        vec3 ldir=normalize(-p);
        vec3 n=normal(p);
        float amb=.0;
        float dif=pow(max(0.,dot(ldir,n)),3.)*(1.+hash23*2.);
        vec3 ref=reflect(dir,n);
        float spe=pow(max(0.,dot(ldir,ref)),5.)*2.;
        col=normalize(.3+(fract(pos*.5)))*(amb+dif)*2.+spe*gcol+.1+hash11*.2+smoothstep(.5,0.,abs(length(pobj.xy)-7.))*gcol*hash29*1.2;
        if (hash33>.7) col*=-.2+step(.5,fract(pobj.x*.5))*2.;
        if (hash32>.7) col*=.0, col+=spe*.5;
        col*=mix(vec3(1.),gcol,.5+hash24*.5)*(.5+hash25);
    }
    else
    {
        p=maxdist*dir;
        float v1=1., v2=0.;
        if (hash27>.25) v1=0., v2=1.;
        if (hash27>.5) v1=1., v2=1.;
        vec3 p2=p;
        p.xy*=rot(time*.1);
        col+=(step(.9,fract(atan(p.x,p.y)*4.*(.5+hash26*.5)))*gcol*v1+step(.95,fract(length(p.xy)*(.5+hash25*.5)/2.-time/2.))*gcol*v2)*smoothstep(4.,6.,length(p.xy))*.5;
        p=p2;
        p.xy*=rot(iTime*.2);
        if (ref>0.) p=dir;
        p*=length(p.xy)*.0005;
        p+=vec3(.3,.2,.1);
        for (int i=0; i<10; i++)
        {
            p=abs(p)/dot(p,p)-.72-hash10*.05;
        }
        col+=dot(p,p)*.02*p*length(p.xy*.1)*hash30;
        p.xy*=rot(length(p.xy)*10.);
        col+=gcol*exp(-5.*length(p.xy))*hash21*.5;
        float e = exp(-1.*length(dir.xy));
        col*=e;
        col*=1.5;
        col+=normalize(gcol)*e*.6;
    }
    return (col+g*gcol)*vec3(1.5,1.,.5);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
    uv = vTexCoord-.5;
    uv.x*=resolution.x/resolution.y;
    vec3 dir=normalize(vec3(uv,.35+hash14*.4));
    float s=sin(iTime*.5);
    float c=cos(iTime*.5);
    //dir.xy*=rot(iTime*.2);
    from=vec3(c*c*c*2.,0.,-11.+s*s*3.-hash4*10.);
    vec3 col=march(from, dir);
    // Output to screen
    col=min(vec3(1.5),col);
    //if (hash28>.7) 
    col*=exp(-2.*length(uv));
    fragColor = vec4(col,1.0);
}

void main() {
    vec2 fragCoord = vTexCoord*resolution;
    vec4 col = vec4(0.);
    mainImage(col, fragCoord);
    gl_FragColor = col;
}