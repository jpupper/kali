precision highp float;
float g = 0.;
vec3 objcol=vec3(0.);
float box;

uniform float fxrand;
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

uniform vec2 resolution;
uniform float time;
uniform float rota;


varying vec2 vTexCoord;

float hash(vec2 p)
{
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
    float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}

vec2 uv;

float de(vec3 p)
{
    p.xy*=rot(hash8*5.);
    //p.xz=abs(p.xz)-10.;
    //p.xy=abs(p.xy)-30.;
    p.xz=abs(p.xz)-15.-20.*hash15;
    float m=100., it=0.;
    //p.xz*=rot(hash4*3.);
    //p.xy*=rot(hash4*3.);
    p.xy*=rot(p.z*.05);
    for (int i=0; i<5; i++)
    {
        p=abs(p*(1.1+hash14*.15))-2.;
        p.xy*=rot(1.5+hash2);
        p.yz*=rot(-1.5-hash3);
        float d=abs(p.x+p.y)-2.;//*max(1.,-iTime*4.+p.x*.3-0.);
        //if (time*5.-length(p)*.2<0.) d=1000.;
        if (d<m){
            m=d;
            it=float(i);
        }
    }
    m=max(m,p.x-time*15.+10.);
    vec3 col=vec3(0.,1.,1.)*.8+m*7.;
    col.rb*=1.-rot(it*.5+hash7*5.+length(vTexCoord-.5)*hash12*8.);
    col.r*=1.3;
    col.g*=.5+hash8;
    //col=abs(col);
    //else col.rg*=rot(it*.22-.7);
    objcol+=.1/(.1+m*m*1.3)*col*.01;
    return m*.5;
}


vec3 march(vec3 from, vec3 dir)
{
    vec3 p, col=vec3(0.);
    float d, td=30.+hash(vTexCoord*resolution)*.5;
    for (int i=0; i<100; i++)
    {
        //if (float(i)*.02>time) break;
        p=from+td*dir;
        float d=max(.05,abs(de(p)));
        td+=d;
        if (td>100.) break;
    }
    p=dir;
    //p.xy*=rot(length(p.xy)*5.+iTime);
    p.xy=vTexCoord*vec2(resolution.x/resolution.y,1.);
    p=abs(fract(p*3.)-.5);
    for (int i=0; i<6; i++)
    {
        p=abs(p)/dot(p,p)-.75-hash8*.05;
    }
    col=objcol;
    //return max(vec3(0.2),.8-abs(col)*2.);
    float l=smoothstep(.7,.5,length((vTexCoord-.5)*vec2(resolution.x/resolution.y,1.)));
    return col*.9+(max(0.,(1.-length(vTexCoord-.5)*2.5))*.51*smoothstep(78.,80.,td)+min(.9,length(p*p)*.015*l))*min(1.,time*0.3);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    uv = fragCoord/resolution.xy-.5;
    //uv+=(vec2(hash15,hash16)-.5)*.5;
    uv.x*=resolution.x/resolution.y;
    vec2 p=uv;
    float pir=length(max(vec2(0.),abs(p)-.45));
    box=step(pir,.0);
    //box+=step(.0,uv.x)*3.;
    //box=step(uv.x+uv.y,1.-box);
    vec3 from=vec3(0.,10.,-70.);
    vec3 dir=normalize(vec3(uv,.2+hash9*.3));
    from.xz*=rot(hash4*6.+sin(time*.2)*.0);
    dir.xz*=rot(hash4*6.+sin(time*.2)*.0);
    //from.xz*=rot(hash4*6.+rota);
    //dir.xz*=rot(hash4*6.+rota);
    from.yz*=rot(hash10*6.);
    dir.yz*=rot(hash10*6.);
    vec3 col=march(from, dir);//*max(.3,(smoothstep(-.15,.2,pir)+step(pir,.03)));
    //col=mix(length(col)*vec3(.5,.4,.35),col,box);
    fragColor = vec4(col,1.0);
}

void main() {
    vec2 fragCoord = vTexCoord*resolution;
    vec4 col = vec4(0.);
    mainImage(col, fragCoord);
    gl_FragColor = col;
}