precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform float frame;
uniform float offsetX;
uniform float density;
uniform float colorScale;
uniform float colorOffset;
uniform float fogforce;
uniform bool  grayscale;
uniform float colorvariation;
uniform float fov;
uniform float colorPalette;
uniform float colorRot;
uniform vec3 colorSky;
uniform float roof;
uniform float camAngleX;
uniform float camAngleY;
uniform float buildscale;
uniform float mode;
uniform float brightness;
uniform float height;

float st=.1, maxdist=40.,m,mc;
vec3 ldir=vec3(-.5,-1.,-1.);
float td;
float z, ed, mo;
vec3 neoncolor;
vec3 sp;
float siroof = 0.;

#define aa 2

varying vec2 vTexCoord;

vec3 path(float t) {
	return vec3(sin(t*.2645)+cos(t*.1213)*2.+offsetX,7.,t);
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

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}


vec3 fractal(vec2 p3)
{
    vec3 fin=vec3(0.);
    for (int i=-aa; i<aa; i++) {
      for (int j=-aa; j<aa; j++) {
        vec2 p=p3+vec2(i,j)*.01;
        vec2 pp=p;
        p = abs(fract(p * .05) - .5);
        float ot1 = 1000., ot2 = ot1;
        for (float i = 0.; i < 6.; i++) {
            p = abs(p) / clamp(abs(p.x * p.y), 0.15, 5.) - vec2(1.5, 1);
            ot1 = min(ot1, abs(p.x) + 0.*step(fract(time * .7 + float(i) * .2), .5 * p.y));
            ot2 = min(ot2, length(p)*2.);
        }
        ot1 = smoothstep(.2, .1, ot1);
        vec3 col = true ? vec3(p, 0) * ot2 * ot1 * .3 + ot1 * .3 : vec3(p.x, -1, p.y * .5) * ot2 * ot1 * .3 + ot1 * .2; 
        if (colorRot==1.||colorRot==3.) col.rg*=rot(pp.y*.3);
        if (colorRot==2.||colorRot==3.) col.rb*=rot(pp.y*.3);
        col.g*=.5;
        col.r+=col.g;
        col.b+=col.g;
        fin+=col;
      }
    }    
    float a = float(aa)*2.;
    fin=fin/float(a*a);
 
    return abs(fin);
}


float obj;

float map(vec2 pp) {
    vec2 pr=pp-sp.xz;
    vec2 pb=floor(abs(pp-sp.xz)*buildscale);
    float clear=length(max(vec2(0.),pb-4.));
    siroof=0.;
    vec2 p=pp;
    float x=p.x;
    obj=0.;
    float s=0.;
    float y=0.;
    vec2 mcol=vec2(100.);
    vec2 p2 = floor(p*10.);
    float h=0.;
    p=abs(.5-fract(pp));
    vec2 pos=p;
    obj=    0.;
    vec2 ps=pp;
    pp*=buildscale;
    y+=(hash(floor(pp*2.))*30.)*(step(density,hash(floor(pp))));
    y+=(10.+pow(hash(floor(pp)),.5)*50.)*(step(.95,hash(floor(pp*.5))));
    y+=pow(noise(floor(pp.yy*3.)),1.)*50.*step(-y,-1.);
    if (hash(floor(pp+321.))>.7) siroof = 1.;
    if (y<.1) y+=hash(floor(pp*4.))*5.;
    y*=step(fract(pp.x*.5),.8);
    y*=step(fract(pp.y*.5),.8);
    y*=step(0.1,clear);
    y*=step(40.,pr.y+time*2.);
    return (y+s)*.05;
}


vec3 normal2(vec2 p) {
	vec2 eps=vec2(0.,.01);
    return normalize(vec3(map(p+eps.yx)-map(p-eps.yx),2.*eps.y,map(p+eps.xy)-map(p-eps.xy)));
}


float edge=0.;
vec3 normal(vec2 p) { 
	vec2 e = vec2(0.0,.01);
	float d1=map(p+e.yx),d2=map(p-e.yx);
	float d3=map(p+e.xy),d4=map(p-e.xy);
	float d=map(p);
	edge=abs(d-0.5*(d1+d2))+abs(d-0.5*(d4+d3));
	edge=min(1.,edge*10.);
	return normalize(vec3(d1-d2,2.*e.y,d3-d4));
}

vec2 hit(vec3 p) {
    float h=map(p.xz);
    return vec2(step(p.y,h),h);
}

float fog(vec3 p,float h) {
    p.y=p.y*2.-1.-h*1.5;
    p.x+=p.z*1.234+time*.5;
	p=abs(2.-mod(p,4.));
    for (int i=0; i<10; i++) {
    	p=abs(p)/dot(p,p)-.8;
    }
    return length(p);
}

vec3 bsearch(vec3 from, vec3 dir, float td) {
    vec3 p;
    st*=-.5;
    td+=st;
    float h2=1.;
    for (int i=0; i<20; i++) {
        p=from+td*dir;
        float h=hit(p).x;
        if (abs(h-h2)>.001) {
            st*=-.5;
	        h2=h;
        }
        td+=st;
    }
	return p;
}

vec3 shade(vec3 p, vec3 dir, float h) {
    float val = dot(sin(p*6. - cos(p.yzx*12.)*3.), vec3(.166)) + .5; 
    vec3 ember = pow(vec3(1.6, 1, 1)*val, vec3(1, 8, 34)); 
 	vec3 col = ember *m*obj*2.;
    ldir=normalize(ldir);
	vec3 n=normal(p.xz);
    float amb=pow(max(0.,dot(dir,n)),3.)*.0;
    float dif=abs(n.x)*.2;
    vec3 ref=reflect(dir,ldir);
    float spe=pow(max(0.,dot(ref,-n))*.5,3.)*4.;
    vec3 fr=fractal(p.xy*2.)*abs(n.z);
    fr+=fractal(p.yz*2.)*abs(n.x);
    fr+=fractal(p.xz*2.)*abs(n.y);
    fr*=.45;
    vec3 fin=col+amb+dif+edge*.7*siroof*step(h-.05, p.y)*neoncolor+fr;
    fin+=spe;
    p*=buildscale;
    if (p.y<.2) {
        fin*=step(fract(p.x*.5+.01),.8);
        fin*=step(fract(p.z*.5+.01),.8);
        fin+=step(.88,fract(p.x*.5))*step(fract(p.x*.5),.9)*step(hash(vec2(0.,floor(p.z*50.))),.1);
        fin+=step(.88,fract(p.z*.5))*step(fract(p.z*.5),.9)*step(hash(vec2(floor(p.x*50.),0.)),.1);
    } 
    return fin;
}


vec4 march(vec3 from, vec3 dir, vec2 fragCoord) {
    td=hash(dir.xy)*.1;
	vec3 p, col=vec3(0.);
    float g=0.,ref=0.,l=0.;
    vec2 h;
    for (int i=0; i<1500; i++) {
    	p=from+dir*td;
        vec3 pr=p-sp;
        h=hit(p);
        if (h.x > .5 || td>maxdist) break;
            vec3 p2=p;
            p2*=5.;
            vec2 id=floor(p2.xz);
            float hh=hash(id*100.);
            p2.xz=fract(p2.xz)-.5;
            p2.y-=hh*200.-187.;
            l=max(l,step(length(p2),.25)*step(.98,hh));


        td+=st;
    }
    float f=pow(max(0.,td/maxdist*1.1-.1),1.5);
    if (h.x > .5) {
        p=bsearch(from, dir, td);
    	col=shade(p,dir,h.y);
    } 
	neoncolor.rb*=rot(-p.y*.15);
    col=mix(col,neoncolor*.5+(hash(fragCoord)-.5)*.5,f);
    vec3 n=normal(p.xz);
    if (td>maxdist) n.y*=0.;
    col=pow(col,vec3(1.4));
    if (mode==0.) return vec4(col*1.3,n.y)+l*step(35.,td)*.6;
    else return vec4(col*.7,pow(max(0.,td/maxdist-.1),1.5))+l*step(35.,td)*.8;
}

mat3 lookat(vec3 dir, vec3 up) {
	dir=normalize(dir);vec3 rt=normalize(cross(dir,normalize(up)));
    return mat3(rt,cross(rt,dir),dir);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    neoncolor=colorSky;
    vec2 uv = (fragCoord-resolution.xy*.5)/resolution;
    uv.x*=resolution.x/resolution.y;
	float t=time*.5;
    t=frame;
    vec3 from=path(t);
    sp=from;
    vec3 dir=normalize(vec3(uv,1.5+fov*.7));
    vec3 adv=from-path(t-1.);
    dir=lookat(adv+vec3(0.,-.5,0.),vec3(adv.x*.0,1.,0.))*dir;
    dir.yz*=rot(-.07*camAngleY+.25);
    dir.xz*=rot(camAngleX);
    vec4 col=march(from, dir, fragCoord);
    fragColor = col;
}

void main() {
    vec4 col=vec4(0.);
    vec2 fCoord=vTexCoord*resolution;
    mainImage(col, fCoord);
    gl_FragColor = col;
}

