precision mediump float;
//vec3 verdejpupper(){return vec3(0.0,1.0,0.8);}

// we need the sketch resolution to perform some calculations
uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


#define iTime (time+0.)
#define iResolution resolution



uniform float fxrand ;

uniform float subdiv ;
uniform float width ;
uniform float height ;
uniform float huecos ;
uniform float modo ;

#define hash1 rnd(fxrand)
#define hash2 rnd(fxrand+.11)
#define hash3 rnd(fxrand+.22)
#define hash4 rnd(fxrand+.33)
#define hash5 rnd(fxrand+.44)
#define hash6 rnd(fxrand+.55)
#define hash7 rnd(fxrand+.66)
#define hash8 rnd(fxrand+.77)
#define hash9 .3//rnd(fxrand+.88)
#define hash10 rnd(fxrand+.99)

varying vec2 vTexCoord ;




mat3 lookat(vec3 dir,vec3 up) {
	dir=normalize(dir);vec3 rt=normalize(cross(dir,normalize(up)));
    return mat3(rt,cross(rt,dir),dir);
}


float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
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
float ll;
vec3 pal;
float mat=0.;
float eye=0., pupi=0.;
float abre=10.;


vec3 path(float t) {
	vec3 p = vec3(sin(t*.5+cos(t*.2))+sin(t*.1),smoothstep(-.5,.5,sin(t*.5))*2.,t);
    return p;
}



vec3 fractal2(vec2 p) {
    vec2 pos=p;
    float d, ml=100.;
    vec2 mc=vec2(100.);
    p=abs(fract(p*.1)-.5);
    vec2 c=p;
    for(int i=0;i<6;i++) {
        p*=rot(1.6);
        d=dot(p,p);
        p=abs(p+.5)-abs(p-.5)-p;
    	p=p*-1.5/clamp(d,.5,1.)-c;
        mc=min(mc,abs(p));
        ml=min(ml,abs(p.y-.0));
    }
    mc=max(vec2(0.),1.-mc);
    mc=normalize(mc)*.8;
    ml=smoothstep(.2,.0,ml);
    vec3 cc = vec3(1.,.7,.5)*ml;
    //cc.xz*=rot(mc.x*10.);
//    cc=fract(pos.y*5.)*vec3(.5);
return cc;
}

float hash(vec2 p)
{
    p*=130.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float rnd(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 48.5453);
}

float hash( float p ) 
{
    p*=1020.876554;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}

float noise( in float p )
{
    float i = floor(p);
    float f = fract(p);
	float u = f*f*(3.0-2.0*f);

    float g0 = hash(i+0.)*2.0-1.0;
    float g1 = hash(i+1.)*2.0-1.0;
    return mix( g0*(f-0.0), g1*(f-1.0), u)-.5;
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    float no= mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
    return pow(no,.5);
}

float lit;

float fractal(vec2 p) 
{
   	//p=vec2(p.x/p.y,1./p.y);
	//p.y+=iTime*sign(p.y);
    p=abs(fract(p*.05)-.5);
    float ot1=1000., ot2=ot1, it=0.;
	for (float i=0.; i<6.; i++) {
    	p=abs(p);
        p=p/clamp(p.x*p.y,0.15,5.)-vec2(1.5,1.);
        float m=abs(p.x);
        if (m<ot1) {
        	ot1=m+step(fract(iTime*.7+float(i)*.2),.5*abs(p.y));
            it=i;
        }
        ot2=min(ot2,length(p));
    }
    ot1=smoothstep(.1,.05,ot1);
    ot2=exp(-5.*ot2);
    return ot1;
}

float round(float x)
{
    if (fract(x)>.5) return floor(x)+1.;
    else return floor(x);
}

//*********** MAP **************

float map(vec2 p) {
    float f=2.;
    //p*=rot(.5);
    vec3 pa=path(p.y);
    p.x-=pa.x;
    float d=floor(p.y*f)/f-carpos.z;
    //p.x*=1.+d*.5;
    p.x*=1.+smoothstep(0.,2.,d)*2.;
    col=fractal(p)*vec3(1.);
    p=floor(p*f)/f;
    float h=0.;
    p.x+=.0;
    p=floor(p*f)/f;
    h+=hash(p)*3.;
    h*=smoothstep(0.5,5.-d,abs(p.x));
    //h+=sin(abs(p.x)+d);
    //h+=abs(p.x*.2);
    p+=pa.x;
    //h=smoothstep(1.,3.,distance(carpos.xz,p))*2.;
    h+=pa.y-.5;
    return h;
}
//******************************


float box(vec3 p, vec3 c) {
    return length(max(vec3(0.),abs(p)-c));
}


//********* DE ****************

float de(vec3 p) {
    p-=carpos;
    p=lookat(vec3(cardir.x,0.,cardir.z),vec3(0.,1.,0.))*p;
    p.yz*=rot(t-carpos.y);
    float t=iTime*.2;
    float d=100.;
    d=length(p)-.5;
    mat=step(.5,fract(p.y*10.));
    mat=step(fract(p.y*8.),.5);
    mat=step(1.2,length(sin(p*20.)));
    mat=smoothstep(1.3,.5,length(sin(p*20.)));
    mat=exp(-.8*length(sin(p*12.)));
    return d*.8;
}
//*************************

vec3 normal(vec2 p) {
	vec2 eps=vec2(0.,.001);
    return normalize(vec3(map(p+eps.yx)-map(p-eps.yx),2.*eps.y,map(p+eps.xy)-map(p-eps.xy)));
}

vec3 normal3(vec3 p) {
    vec2 e=vec2(0.,.001);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}
vec4 hit(vec3 p) {
    float h=map(p.xz);
    float d=de(p);
    return vec4(step(p.y,h),step(d,det*2.),h,d);
}

vec3 bsearch(vec3 p,vec3 dir) {
    //vec3 p;
    float ste=st;
    ste*=-.5;
    //td+=ste;
    float h2=1.;
    for (int i=0;i<20;i++) {
        p+=dir*ste;
        vec4 hi=hit(p);
        float h=max(hi.x,hi.y);
        if (abs(h-h2)>.001) {
            ste*=-.5;
	        h2=h;
        }
        //td+=ste;
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
    float dif=max(cam*.3,dot(ldir,n));
    vec3 ref=reflect(ldir,n);
    float spe=pow(max(0.,dot(dir,-ref)),20.);
    vec3 lig=lit*vec3(3.,.7,.2)*.8;
    return max(dif*.8,-n.y*.5)*pal+col;
}
float ddd;

vec3 march(vec3 from,vec3 dir) {
	vec3 p, col=vec3(0.), pr=p;
    float td=0.+hash(dir.xy+iTime)*.3, k=0.,g=0.,d=0.,eg=0.;
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
            vec3 n=normal3(p);
   			dir=reflect(dir,n);
            p+=hash(dir.xy+iTime)*.1*dir;
            //dir.yz*=rot(-2.);
        }
        float dd=abs(h.z-p.y);
        g=max(g,max(0.,.2-h.w)/.2)*(mat);
        eg+=.01/(.1+h.w*h.w*10.)*mat;
        //eg+=.01/(.01+h.w*h.w)*(1.-ref)*.01;
        //ey+=.01/(.01+eye*eye)*.1;
        if (h.x>.5||td>maxdist||(h.y>.5&&mat>.4)) break;
        td+=st;
    }
    vec3 back=pal*ref*.3+smoothstep(7.,0.,length(p.xz))*.13;
    if (h.x>.9) {
        p-=dir*det;
        p=bsearch(p,dir);
    	col=shade(p,dir,h.y,td);
        float dl=distance(p.xz,lightpos.xz);
        col*=min(.8,exp(-.15*dl*dl));
        //col=mix(back,col,exp(-.1*smoothstep(0.,5.,td*td)));
         mat=0.;
    } else {
        col=back;
    } 
    if (h.y<.5) mat=0.;
    col=mix(col,ref*vec3(1.),.2*ref)+mat*mat*mat*0.;
    //col+=step(.3,pupi)*step(eye,det);
    ddd=0.;
    //vec3 n=normal(p.xz);
    //g*=step(0.05,dot(normalize(p),n));
    mat=0.;
    return max(col+g+eg*.7,vec3(0.));
}

void main(void)
{   

    pal=vec3(0.,.9,1.); ll=1.;
    //pal=vec3(1.,.5,.5),ll=.75;
    //pal=vec3(.6,1.,.5)*.75,ll=.85;


    //pal=vec3(.8);
    //vec2 uv = (gl_FragCoord.xy-resolution.xy*.5)/resolution.y;
    vec2 uv = vTexCoord-.5;
    uv.x*=resolution.x/resolution.y;
   // vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
    t=time*4.;
    vec3 from=path(t-5.)+vec3(0.,5.,0.);
    //from.z=floor(from.z*.05+1.)/.05;
    carpos=path(t);
    carpos=path(t-carpos.y*.2);
    //carpos.y=mix(carpos.y,10.,abs(fract(t*.1)-.5));
    cardir=normalize(path(t+1.)-carpos);

    vec3 adv=normalize(carpos-from);
    lightpos=carpos+vec3(0.,2.,0.);
    //from.yz*=rot(.5);
    //from.yz*=rot(-.24);
    vec3 dir=normalize(vec3(uv,1.));
    dir=lookat(adv,vec3(0.,1.,0.))*dir;
    //dir.xz*=rot(hash1*3.);
    //dir=lookat(adv+vec3(0.,-.2-(1.+sin(t*2.)),0.),vec3(adv.x*.1,1.,0.))*dir;
    vec3 col=march(from, dir);
    //gl_FragColor = vec4(col,ddd)*step(abs(uv.x),1.5);//*mod(gl_FragCoord.y,4.)*.4;

    //col.rb*=rot(-.5);

    gl_FragColor = vec4(col,mat)*step(abs(uv.x),1.5);//*mod(gl_FragCoord.y,4.)*.4;

	//gl_FragColor = vec4(uv.x,uv.y,.0,1.0);


   
}

