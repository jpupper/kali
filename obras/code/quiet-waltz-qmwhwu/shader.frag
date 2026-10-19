precision mediump float;
uniform vec2 resolution;
uniform float time;

uniform bool polar;
uniform float r;
uniform float g;
uniform float b;
uniform float p0;

#define fxrand p0
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



float rnd(float p)
{
    p*=1234.5678;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}


mat2 rot(float a) {
    float si = sin(a);
    float co = cos(a);
    return mat2(co,si,-si,co);
}



float 	inner_radius;
float 	outer_radius;
float 	fov; // not working in this version
float	zoom;

const float 	vol_steps = 8.;
float 	vol_rot;
float 	vol_fade;

float 	surf_scale;
const int 	surf_iterations = 10;
vec3	surf_param_1;
float	surf_param_2;
float	surf_param_3;
float 	surf_exp;
float	surf_base_value;
float	surf_intensity;
float	surf_brightness;
float	surf_contrast;
float 	surf_rotation_speed;
float 	surf_turbulence_speed;

float 	cor_size;
float 	cor_offset;
const int 	cor_iterations = 4;
float 	cor_iteration_fade;
float 	cor_param_1;
float 	cor_param_2;
float 	cor_exp_1;
float 	cor_exp_2;
float 	cor_brightness;
float 	cor_speed;
float 	cor_speed_vary;

float	glow_intensity;
float 	glow_size;


vec3	color_1;
vec3	color_2;
float	color_saturation;
float	color_contrast;
float	color_brightness;

float hit=0.;
float pcol;



//Corona effect based on https://www.shadertoy.com/view/4dXGR4



void param() {
 	inner_radius=.21;
 	outer_radius=.235;
 	fov=.69; // not working in this version
    zoom=1.5+hash8;

 	vol_rot=.68;
 	vol_fade=.3+hash1*.5;

 	surf_scale=1.+hash2;
	surf_param_1=vec3(.6,.45,.6);
	surf_param_2=1.2;
	surf_param_3=.35+hash3*.4;
 	surf_exp=2.;
	surf_base_value=.5;
	surf_intensity=1.13;
	surf_brightness=1.;
	surf_contrast=2.;
 	surf_rotation_speed=.15+hash4*.3;
 	surf_turbulence_speed=hash5*.15;

 	cor_size=.35+hash6*.1;
 	cor_offset=.3*hash7*.2;
 	cor_iteration_fade=.0;
 	cor_param_1=.2+hash9*.3;
 	cor_param_2=.3+hash10;
 	cor_exp_1=1.;
 	cor_exp_2=1.+hash11*.5;
 	cor_brightness=3.5;
 	cor_speed=.1;
 	cor_speed_vary=hash12;

	glow_intensity=7.;
 	glow_size=.05;


    color_1=vec3(.2,.15,.4);
    color_2=vec3(.35,.22,.15);
    color_2=vec3(.2,.15,.4);
	color_saturation=0.4+hash14*.2;
	color_contrast=1.2;
	color_brightness=0.4;

    color_1.rb*=rot(-1.5
+    hash13*3.);
    color_2.rb*=rot(-1.5+hash13*3.);


}



mat3 lookat(vec3 fw,vec3 up){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);
}

float sphere(vec3 p, vec3 rd, float r){
	float b = dot( -p, rd ), i = b*b - dot(p,p) + r*r;
	return i < 0. ?  -1. : b - sqrt(i);
}



float snoise(vec3 uv, float res) 
{
    const vec3 s = vec3(1e0, 1e2, 1e4);	
	uv *= res;	
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;	
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);	
	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);	
	vec4 r = fract(sin(v*1e-3)*1e5);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);	
	r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);	
	return mix(r0, r1, f.z)*2.-1.;
}

float kset(vec3 p) {
    p*=surf_scale*(1.+outer_radius);
    float m=1000.;
	for (int i=0; i<surf_iterations; i++) {
        float d=dot(p,p);
		p=abs(p)/d*surf_param_2-vec3(surf_param_1);
		m=min(m,abs(d-surf_param_3))*(1.+surf_param_3);
    }
    float c=pow(max(0.,1.-m)/1.,surf_exp);
	c=pow(c,surf_exp)*surf_exp*surf_intensity;
	return c; 
}



float cor(vec2 p) { 
	float ti=time*cor_speed*cor_param_1+200.;
    float d=length(p);
	float fad = (exp(-3.5*d)-outer_radius)/(outer_radius+cor_size)*(1.-step(.5,d));
    
    
    float v1 = fad;
	float v2 = fad;
	float angle = atan( p.x, p.y )/6.2832;
	float dist = length(p)*cor_param_1/fov;
	vec3 crd = vec3( angle, dist, ti * .1 );
    float ti2=ti+fad*cor_speed_vary*cor_param_1;
    float t1=abs(snoise(crd+vec3(0.,-ti2*1.,ti2*.1),15.));
	float t2=abs(snoise(crd+vec3(0.,-ti2*.5,ti2*.2),45.));	
    float it=float(cor_iterations);
    float s=1.;
	for( int i=1; i<=cor_iterations; i++ ){
		ti*=1.5;
        float pw = pow(1.5,float(i));
		v1+=snoise(crd+vec3(0.,-ti,ti*.02),(pw*50.*(t1+1.)))/it*s*.13;
		v2+=snoise(crd+vec3(0.,-ti,ti*.02),(pw*50.*(t2+1.)))/it*s*.13;
    }
	
	float co=pow(v1*fad,cor_exp_2)*cor_brightness;
	co+=pow(v2*fad,cor_exp_2)*cor_brightness;
	co*=1.-t1*cor_param_2*(1.-fad*.3);
    return co;
}


//messy code below
vec3 render(vec2 uv) {
    vec3 ro=vec3(0.,0.,1.);
//    ro.yz*=rot(mouse.y*3.);
    ro.xz*=rot(time*surf_rotation_speed);
    vec3 rd=normalize(vec3(uv,fov));
    rd.xy*=.8;
    rd=lookat(-ro,vec3(0.,1.,0.))*rd;
    float tot_dist=outer_radius-inner_radius;
	float st=tot_dist/vol_steps;
    float br=1./vol_steps;
    float tr=time*surf_rotation_speed;
	float tt=time*surf_turbulence_speed;
    float dist=0.;
    float c=0.;
    float dout=step(0.,sphere(ro, rd, outer_radius));
    float din=step(0.,sphere(ro, rd, inner_radius+.02));
    float d;
    for (float i=0.; i<vol_steps; i++) {
        d=sphere(ro, rd, inner_radius+i*st);
        dist+=st;
        vec3 p = ro+rd*d;
        float a=vol_rot*i+tt;
        p.yz*=rot(a);
        p.xy*=rot(a);
        c+=kset(p)*br*step(0.,d)*max(0.,1.-smoothstep(0.,tot_dist,dist)*vol_fade);
    }
	c+=surf_base_value;    
    vec3 col=1.*mix(color_1, color_2, vec3(c))*c;
    inner_radius*=fov;
    outer_radius*=fov;
    glow_size*=fov;
    cor_size*=fov;
    float cor=cor(uv);
    float r1=inner_radius;
    float r2=outer_radius;
    float l=smoothstep(r1-cor_offset,r2, length(uv));
    float rt=outer_radius+glow_size;
    float sw=1.-smoothstep(0.,rt,length(uv));
    col=min(vec3(5.),pow(col,vec3(surf_contrast))*surf_brightness*surf_contrast);
    col+=cor*color_1*l+sw*color_2*glow_intensity;
    col=mix(vec3(length(col)), col, color_saturation)*color_brightness;
    hit = dout-cor*l*.05;
    vec2 uu=uv;
    uv=abs(.5-fract(uv+vec2(.4,.3)));
    vec3 p=vec3((uv*.2)*10.,uu.x*.5+uu.y*.5+hash1);
    for (int i=0; i<9; i++)
    {
        p=abs(p)/dot(p,p)-.75;
    }
    col+=length(p)*.05*(1.-din);
    return pow(col,vec3(color_contrast));
}

float det=.01;


float planets(vec3 p2, float i) {
    float ti=time*3.;
    p2.yz*=rot(.2);
    vec3 p=p2;
    p.xz*=rot(time*.5);
    p.x+=3.;
    float pl1=length(p)-.1;
    vec3 pr=p;
    pr.xz*=rot(ti);
    float col1=snoise(pr*vec3(1.,3.,1.),10.);
    p=p2;
    p.xz*=rot(time *.25+2.);
    p.x+=5.;
    float pl2=length(p)-.2;
    pr=p;
    pr.xz*=rot(ti);
    float col2=snoise(pr*vec3(1.,3.,1.),10.);
    p=p2;
    p.xz*=rot(time *.1+4.);
    p.x+=7.;
    float pl3=length(p)-.3;
    pr=p;
    pr.xz*=rot(ti);
    float col3=snoise(pr*vec3(1.,3.,1.),10.);
    //if (hash15>.5) pl1=1000.;
    if (i==1.) {
        pl1+=step(.5,hash15)*1000.;
        pl2+=step(.5,hash16)*1000.;
        pl3+=step(.5,hash17)*1000.;
    }
    if (i==2.) {
        pl1+=step(.5,hash18)*1000.;
        pl2+=step(.5,hash19)*1000.;
        pl3+=step(.5,hash20)*1000.;
    }
    if (i==3.) {
        pl1+=step(.5,hash21)*1000.;
        pl2+=step(.5,hash22)*1000.;
        pl3+=step(.5,hash23)*1000.;
    }
    if (i==4.) {
        pl1+=step(.5,hash24)*1000.;
        pl2+=step(.5,hash25)*1000.;
        pl3+=step(.5,hash26)*1000.;
    }
    float d=min(min(pl1, pl2),pl3);
    if (d==pl1) pcol = col1;
    if (d==pl2) pcol = col2;
    if (d==pl3) pcol = col3;
    return d;
}

float de(vec3 p) {
    float d=planets(p,1.);
    float pc=pcol;
    p.xz*=rot(1.);
    p*=.95;
    float pla1=planets(p,2.);
    d=min(d,pla1);
    if (d==pla1) pc=pcol;
    p*=.95;
    p.xz*=rot(1.);
    float pla2=planets(p,3.);
    d=min(d,pla2);
    if (d==pla2) pc=pcol;
    p*=.95;
    p.xz*=rot(1.);
    float pla3=planets(p,4.);
    d=min(d,pla3);
    if (d==pla3) pc=pcol;

    pcol = pc;
    return d;
}

vec3 normal(vec3 p)
{
    vec2 e=vec2(0.,det);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}


vec4 march(vec3 from, vec3 dir)
{
    float d, td=0.,maxdist=50., alpha=0.;
    vec3 p, col = vec3(0.);
    for (int i=0; i<80; i++) {
        p=from+dir*td;
        d=de(p);
        if (d<det || td>maxdist) break;
        td+=d;
    }
    if (d<.1) {
        alpha=1.;
        vec3 n = normal(p);
        float dif=max(0.,dot(-normalize(p), n))*5.;
        color_2 = mix(length(color_2)*vec3(.5),color_2,.5);
        col = dif*color_2 * vec3(1.3,1.,1.) - pcol*.1;
    }
    return vec4(col,min(alpha,1.-hit)+smoothstep(0.,1.,-p.z));

}
varying vec2 vTexCoord;

void main()
{
    param();
    vec2 uv=vTexCoord-.5;
    uv.x*=resolution.x/resolution.y;
    uv*=1.7;
    uv.x+=cos(time*.178924387342)*.1;
    zoom*=1.+sin(time*.2)*.2;
	vec3 col = render(uv/zoom);
    col=pow(col,vec3(1.5))*vec3(1.1,1.,1.);
    vec3 from = vec3(0,0,-20);
    vec3 dir = normalize(vec3(uv,3.));
    vec4 plan=march(from, dir);
    col=mix(col,plan.rgb,plan.a);
    col=max(col,vec3(r,g,b)*.15);
    gl_FragColor = vec4(col,1.0);
}


