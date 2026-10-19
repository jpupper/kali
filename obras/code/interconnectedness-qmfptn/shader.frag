precision mediump float;
uniform vec2 resolution;
uniform float time;

uniform bool polar;
uniform float r;
uniform float g;
uniform float b;
uniform float fxrand;

#define hash1 rnd(fxrand)
#define hash2 rnd(fxrand+.112)
#define hash3 rnd(fxrand+.213)
#define hash4 rnd(fxrand+.314)
#define hash5 rnd(fxrand+.415)
#define hash6 rnd(fxrand+.516)
#define hash7 rnd(fxrand+.617)
#define hash8 rnd(fxrand+.7137)
#define hash9 rnd(fxrand+.9127)
#define hash10 rnd(fxrand+.18137)
#define hash11 rnd(fxrand+.28137)
#define hash12 rnd(fxrand+.38137)
#define hash13 rnd(fxrand+.48137)
#define hash14 rnd(fxrand+.58137)
#define hash15 rnd(fxrand+.68137)
#define hash16 rnd(fxrand+.78137)
#define hash17 rnd(fxrand+.6238137)
#define hash18 rnd(fxrand+.7812137)
#define hash19 rnd(fxrand+.478137)
#define hash20 rnd(fxrand+.134137)
#define hash21 rnd(fxrand+.4175237)
#define hash22 rnd(fxrand+.3137)
#define hash23 rnd(fxrand+.68131)
#define hash24 rnd(fxrand+.5535)
#define hash25 rnd(fxrand+.4447)
#define hash26 rnd(fxrand+.22177)

//orbit traps from julia version of fractal formula z=(z+1/z+c)*-scale;

#define zoom 5.
#define offset vec2(0.3,0.2)

#define iterations 27
#define scale -.4
#define julia vec2(2.2,0.75)

#define orbittraps vec3(.8,.5,-.01)
#define trapswidths vec3(.2,.2,.3)

#define trap1color vec3(1.00,0.30,0.10)
#define trap2color vec3(1.00,0.50,0.10)
#define trap3color vec3(0.10,0.20,1.00)

#define trapsbright vec3(1.,.8,.7)
#define trapscontrast vec3(5.,10.,5.)

#define trapsfreq vec3(5.,8.,20.)
#define trapsamp vec3(.03,.03,.01)
#define trapspeeds vec3(20.,20.,40.)

#define saturation .6
#define brightness .9
#define contrast 1.35
#define minbright .3

#define antialias 3. 

mat2 rot(float a)
{
    float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
}

float rnd(float p)
{
    p*=11134.5678;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}

float hash(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 rotate(vec2 p, float angle) {
return p*mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
}

void main()
{
    vec3 aacolor=vec3(0.);
    vec2 uv=gl_FragCoord.xy / resolution.xy - 0.5;
    float aspect=resolution.x/resolution.y;
    vec2 pos=uv;
    pos.x*=aspect;
    float t=time*.07;
    float zoo=.5+hash8*5.;
    pos*=rot(hash2*6.);
    pos+=vec2(hash3,hash4)*2.;
    //pos+=offset;
    pos*=zoo; 
    //pos=mod(pos,10.);
    vec2 pixsize=1./resolution.xy*zoo;
    pixsize.x*=aspect;
    float av=0.;
    vec3 its=vec3(0.);
    float ll=1000.;;
    vec2 z;
    for (float aa=0.; aa<16.; aa++) {
        vec3 otrap=vec3(1000.);
        if (aa<antialias*antialias) {
            vec2 aacoord=floor(vec2(aa/antialias,mod(aa,antialias)));
            z=pos+aacoord*pixsize/antialias;
            ll=1000.;
            for (int i=0; i<20; i++) {
                vec2 cz=vec2(z.x,-z.y);
                z=z+cz/dot(z,z)+julia;
                z=z*-.4;
                float l=length(z.y)-smoothstep(.05,.0,abs(z.y)-.02)*2.;
                ll=min(ll,abs(length(z)));
                if (i>2) {
                    vec3 ot=abs(vec3(l)-orbittraps);
                    if (ot.x<otrap.x&&i>5) {
                        otrap.x=ot.x+max(0.,1.-time+z.x+float(i)*.1);
                        its.x=float(25-i);  
                    }
                    if (ot.y<otrap.y&&i>5) {
                        otrap.y=ot.y+max(0.,1.-time+z.x+float(i)*.1)-.02;
                        its.y=float(25-i);  
                    }
                    if (ot.z<otrap.z&&i>5) {
                        otrap.z=ot.z-.1+max(0.,2.-time+z.x+float(i)*.1);
                        its.z=float(25-i);  
                    }
                }
            }
        }
        otrap=smoothstep(.001,.00,otrap);
        its=its/float(iterations);
        vec3 otcol2;
        vec3 otcol3;
        float ash6=hash6;
        vec3 back=-hash(gl_FragCoord.xy)*vec3(.07);
        if (ash6>=.5) {
            otcol2=otrap.y*vec3(.5,1.,.0)*its.y;
            otcol3=otrap.z*vec3(.5,.0,1.)*its.z;
        }
        if (ash6<.5) {
             otcol2=otrap.y*vec3(1.,.5,0.)*its.y;
             otcol3=otrap.z*vec3(.5,.0,1.)*its.z;
        }
        // else {
        //     otcol2=otrap.y*vec3(0.,.5,1.)*its.y*1.7;
        //     otcol3=otrap.z*vec3(.5);
        //     //back+=.02;
        // }
        back+=normalize(vec3(r,g,b))*.3;
        aacolor+=max(otcol2,otcol3)*.8+back-ll*.3;
    }
        aacolor.rg*=rot(hash11*6.);
        aacolor.rb*=rot(length(uv)*2.+hash10*6.);
        //ll=smoothstep(.01,.005,ll)*5.;
        aacolor=length(aacolor)*.2+abs(aacolor)*.8;
    aacolor=aacolor/(antialias*antialias);
    vec3 color=mix(vec3(length(aacolor)),aacolor,saturation)*brightness;
    color=pow(color,vec3(contrast))*min(1.,time-.5);        
    // color+=(1.-step(50.,gl_FragCoord.x))*.3;
    // color+=(1.-step(50.,resolution.x-gl_FragCoord.x))*.3;
    // color+=(1.-step(50.,gl_FragCoord.y))*.5;
    // color+=(1.-step(50.,resolution.y-gl_FragCoord.y))*.3;
    color*=smoothstep(.5,.43,abs(uv.x));
    color*=smoothstep(.5,.43,abs(uv.y));
    gl_FragColor = vec4(color,1.0);
}