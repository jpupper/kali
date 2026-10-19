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

float st=.015, maxdist=8.,m,mc;
vec3 ldir=vec3(-.5,-1.,-1.);
float td;
float z, ed, mo;


varying vec2 vTexCoord;

vec3 path(float t) {
	return vec3(sin(t*.2645)+cos(t*.1213)*2.+offsetX,2.5,t);
}



mat2 rot(float a) {
	float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

float hash(vec2 p)
{
    //p*=134.123;
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

float obj;

float map(vec2 pp) {
    //pp.x-=path(pp.y).x;
    vec2 p=pp;
    obj=0.;
    float s=0.;
    m=mc=100.;
    float l2;
    mo=(sin(p.x+cos(p.y*2.)+2.724)+cos(p.y))*8.;
    float y=mo;
    vec2 mcol=vec2(100.);
    vec2 p2 = floor(p*10.);
    vec2 j=abs(.5-fract(p2/10.))*2.;
    y-=max(j.x,j.y)*10.;
    float n=noise(p);
    n=max(n,step(0.,z-3.)*step(abs(pp.x-path(pp.y).x),.3));
    float h=hash(p2+123.654);
    ed=n>density&&z>2.?(h*15.+n*15.):0.;
    y+=ed;
    p=abs(.5-fract(p*.03));
    y+=smoothstep(.5,.4,length(p.xy))*10.;
    vec2 pos=p;
    for (int i=0; i<6; i++) {
    	p=abs(p+1.)-abs(p-1.)-p;
        float l=dot(p,p);
        p=p*2./clamp(l,.25,1.)-pos;
        s+=exp(-.3*abs(l-l2));
        l2=l;
        if (i>3 && i<5) m=min(min(abs(p.y),abs(p.x)),m);
        mc=min(mc,l);
    }
    m=pow(max(0.,1.-m),6.);
    if (ed<mo+8.) obj=1.;
    y+=smoothstep(2.,1.,abs(pp.x));
    y+=hash(floor(pp*50.)+2.546)>.995?10.:0.;
    y*=min(1., time*.3);
    return (y+s)*.05-m*.15;
}


vec3 normal(vec2 p) {
	vec2 eps=vec2(0.,.01);
    return normalize(vec3(map(p+eps.yx)-map(p-eps.yx),2.*eps.y,map(p+eps.xy)-map(p-eps.xy)));
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
    float val = dot(sin(p*6. - cos(p.yzx*12.)*3.), vec3(.166)) + .5; // Or noise, etc.
    vec3 ember = pow(vec3(1.6, 1, 1)*val, vec3(1, 8, 34)); // Poor man's fire palette. 
 	vec3 col = ember *m*obj*2.;
    col+=step(p.y, ed-.2)*hash(floor(p.xy*80.))>.98?.4*step(3.,time-p.y):0.;
    ldir=normalize(ldir);
	vec3 n=normal(p.xz);
    float amb=max(0.,dot(dir,n))*.1;
    vec3 ref=reflect(dir,ldir);
    float spe=pow(max(0.,dot(ref,-n))*.5,3.)*4.;
    return col+spe+amb;
}


vec3 march(vec3 from, vec3 dir) {
	vec3 p, col=vec3(0.);
    td=2.;
    float k=0.;
    vec2 h;
    for (int i=0; i<350; i++) {
    	p=from+dir*td;
        z=p.z-from.z;
        h=hit(p);
        k+=fog(p,h.y)*pow(max(0.,1.-abs(p.y-h.y)*.25),2.);
        if (h.x > .5 || td>maxdist) break;
        td+=st;
    }
    float f=pow(td/maxdist,5.);
    if (h.x > .5) {
        p=bsearch(from, dir, td);
    	col=shade(p,dir,h.y);
    } 
	col=mix(col,vec3(.2*(1.-p.y*.2)),f)*min(1.,time*.5);
    return col+k*fogforce;
}

mat3 lookat(vec3 dir, vec3 up) {
	dir=normalize(dir);vec3 rt=normalize(cross(dir,normalize(up)));
    return mat3(rt,cross(rt,dir),dir);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-resolution.xy*.5)/resolution.y;
    //uv=floor(uv*200.)/200.;
	float t=time;
    t=frame;
    vec3 from=path(t);
    vec3 dir=normalize(vec3(uv,fov));
    vec3 adv=from-path(t-1.);
    dir=lookat(adv+vec3(0.,-.5,0.),vec3(adv.x*.0,1.,0.))*dir;
    vec3 col=march(from, dir);
    //col=abs(col);
    col*=mod(fragCoord.y, 4.)*.5;
    col=pow(abs(col),vec3(1.5));
    col.rb*=rot(uv.y*colorScale-colorOffset);
    col.bg*=rot(-colorvariation);
    col*=vec3(1.,.7,1.);
    col*=min(1.,time*.5);
    //col=pow(abs(col),vec3(1.5));
    if (grayscale) col=max(col.rrr,col.ggg)*.8;
    fragColor = vec4(col,1.);
}

void main() {
    vec4 col;
    mainImage(col, vTexCoord*resolution);
    gl_FragColor = col;
}

