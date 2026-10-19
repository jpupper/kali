precision highp float;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


#define iTime (time+0.)

uniform float fxrand ;

#define hash1 rnd(fxrand)
#define hash2 rnd(fxrand+.11)
#define hash3 rnd(fxrand+.22)
#define hash4 rnd(fxrand+.33)
#define hash5 rnd(fxrand+.44)
#define hash6 rnd(fxrand+.55)
#define hash7 rnd(fxrand+.66)
#define hash8 rnd(fxrand+.77)
#define hash9 rnd(fxrand+.88)
#define hash10 rnd(fxrand+.99)
#define hash11 rnd(fxrand+.929)

varying vec2 vTexCoord ;

mat3 lookat(vec3 dir,vec3 up) {
	dir=normalize(dir);vec3 rt=normalize(cross(dir,normalize(up)));
    return mat3(rt,cross(rt,dir),dir);
}

mat2 rot(float a)
{
    float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
}

float rnd(float p)
{
    p*=123.5678;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}


float st=.07, maxdist=20., det=.01, t;
vec3 ldir=vec3(0.,-1.,-1.),col=vec3(0.),lightpos, carpos, cardir;
vec3 pal;
float mat=0.;


vec3 path(float t) {
	vec3 p = vec3(sin(t*.5+cos(t*.2))*2.,sin(t*.5)*2.+cos(t*.3),t);
    p.x*=hash1;
    p.y*=hash2;
    return p;
}

float hash(vec2 p)
{
    p*=130.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float fractal(vec2 p) 
{
    p=abs(fract(p*.1)-.5);
    float ot1=1000.;
	for (float i=0.; i<6.; i++) {
    	p=abs(p);
        p=p/clamp(p.x*p.y,0.15,1.+hash5*4.)-vec2(1.,2.);
        float m=abs(p.x);
        ot1=min(ot1,abs(p.x)+0.*step(fract(iTime*.7+float(i)*.2),.5*abs(p.y)));
    }
    ot1=smoothstep(.1,.05,ot1);
    return ot1;
}


//*********** MAP **************

float map(vec2 p) {
    float f=1.+floor(hash3*4.);
    vec3 pa=path(p.y);
    p.x-=pa.x;
    float d=floor(p.y*f)/f-carpos.z+.5;
    p.x*=1.+smoothstep(0.,2.,d)*3.;
    col=fractal(p)*vec3(1.5)+smoothstep(.1,0.,abs(p.x))*step(.2,fract(p.y*.5))*0.;
    float h=0.;
    vec2 pf=fract(p*f)-.5;
    p=floor(p*f)/f;
    h+=(.5-hash(p))*hash5*1.5+1.+hash10*1.5;
    h*=smoothstep(0.,5.-d,abs(p.x));
    h-=pow(abs(pf.x),3.)*.3+pow(abs(pf.y),3.)*.3;
    p+=pa.x;
    h+=pa.y-.5;
    return h;
}
//******************************


//********* DE ****************

float de(vec3 p) {
    p-=carpos;
    p=lookat(vec3(cardir.x,0.,cardir.z),vec3(0.,1.,0.))*p;
    p.yz*=rot(t*1.5);
    float t=iTime*.2;
    float d=100.;
    d=length(p)-.5;
    p.xz*=rot(.2);
    mat=exp(-.8*length(sin(p*(6.+hash6*8.))));
    return d*.8;
}
//*************************

vec3 normal(vec2 p) {
	vec2 eps=vec2(0.,.001);
    return normalize(vec3(map(p+eps.yx)-map(p-eps.yx),2.*eps.y,map(p+eps.xy)-map(p-eps.xy)));
}

vec4 hit(vec3 p) {
    float h=map(p.xz);
    float d=de(p);
    return vec4(step(p.y,h),step(d,det*2.),h,d);
}

vec3 bsearch(vec3 p,vec3 dir) {
    float ste=st;
    ste*=-.5;
    float h2=1.;
    for (int i=0;i<20;i++) {
        p+=dir*ste;
        vec4 hi=hit(p);
        float h=max(hi.x,hi.y);
        if (abs(h-h2)>.001) {
            ste*=-.5;
	        h2=h;
        }
    }
	return p;
}

vec3 desearch(vec3 p,vec3 dir) {
    p-=.2*dir;
    for (int i=0;i<20;i++) {
        float d=de(p);
        p+=d*dir;
        if (d<det) break;
    }
	return p;
}


vec3 shade(vec3 p,vec3 dir,float h,float td) {
    ldir=normalize(p-lightpos);
	col=vec3(0.);
    vec3 n=normal(p.xz);
    n.y*=-1.;
    float cam=max(.2,dot(dir,n));
    float dif=max(cam*.4,dot(ldir,n));
    vec3 ref=reflect(ldir,n);
    float spe=pow(max(0.,dot(dir,-ref)),10.);
    return max(dif*.8,-n.y*.0)*(pal+col)+spe*.5;
}
float ddd;

vec3 march(vec3 from,vec3 dir) {
	vec3 p, col=vec3(0.), pr=p;
    float td=0.+hash(dir.xy+iTime)*.3, k=0.,d=0.,eg=0.;
    p=from+td*dir;
    vec4 h;
    float ref=0.;
    float refindex=.9;
    float ey=0.;
    for (int i=0;i<300;i++) {
    	p+=dir*st;
        h=hit(p);
        if (h.y>.5 && ref==0.) {
            pr=p;
            ref=1.;
            p=desearch(p, dir);
            vec3 n=normalize(p-carpos);
   			dir=reflect(dir,n);
            p+=hash(dir.xy+iTime)*.1*dir;
        }
        float dd=abs(h.z-p.y);
        eg+=.011/(.1+h.w*h.w*50.)*step(.35,mat);
        if (h.x>.5||td>maxdist||(h.y>.5&&mat>.4)) break;
        td+=st;
    }
    vec3 back=pal*ref*.3+smoothstep(7.,0.,length(p.xz))*.13;
    float dl=distance(p.xz,lightpos.xz);
    if (h.x>.9) {
        p-=dir*det;
        p=bsearch(p,dir);
    	col=shade(p,dir,h.y,td);
        col*=min(.8,exp(-.3*dl*dl));
         //mat=0.;
    } else {
        col=back;
    } 
    col=mix(col,ref*vec3(1.),.2*ref);
    col+=mat*step(.5,h.y)*.5;
    vec3 icol=vec3(h.y+ref*smoothstep(3.,1.,iTime));
    col+=eg;
    col+=exp(-5.*dl*dl)*col*.5;
    col=mix(icol,col,smoothstep(3.,5.,iTime));
    return col;
}

void main(void)
{   
    float cc=floor(hash7*4.);
    if (cc==0.) pal=vec3(0.,.9,1.);
    if (cc==1.) pal=vec3(1.,.4,.4);
    if (cc==2.) pal=vec3(.6,1.,.5);
    if (cc==3.) pal=vec3(.8);

    vec2 uv = vTexCoord-.5;
    uv.x*=resolution.x/resolution.y;
    t=max(6.,iTime)*4.;
    vec3 from=path(t-3.-hash10*3.)+vec3(0.,1.+hash8*4.,0.);
    if(mod(t-24.,60.)>35.) from=path(t+5.)+vec3(2.,5.,0.);
    carpos=path(t-carpos.y*.2);
    cardir=normalize(path(t+1.)-carpos);
    vec3 adv=normalize(path(t+.5*smoothstep(0.,10.,iTime))-from);
    lightpos=carpos+vec3(0.,2.,0.);
    vec3 dir=normalize(vec3(uv,1.5));
    dir=lookat(adv,vec3(0.,1.,0.))*dir;
    vec3 col=march(from, dir)+(hash(uv+iTime)-.5)*.25;
    gl_FragColor = vec4(col,1.);//*mod(gl_FragCoord.y,4.)*.4;
}

