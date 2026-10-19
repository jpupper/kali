precision highp float;

uniform float time;
uniform vec2 resolution;
uniform float mode;

varying vec2 vTexCoord;
float det=.001;
float maxdist=150.;
float mat;
float hitball;

mat3 rotdir;

uniform vec2 onda1;
uniform vec2 onda2;
uniform float amplitude;
uniform float angle_xz;
uniform float r1;
uniform float r2;
uniform float r3;
uniform float r4;
uniform float pattern;
uniform float camheight;
uniform float shape;

float hash(vec2 p)
{
    p*=1234.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rot(float a) {
    float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
}

float he(vec3 p) {
    vec3 p1=p+vec3(onda1.x,0.,onda1.y);
    vec3 p2=p+vec3(onda2.x,0.,onda2.y);
    float h=sin(length(p1.xz*.25)-time*2.)*4.;
    h+=cos(length(p2.xz*.5)-time*2.)*2.;
    //h+=exp(-.2*length(p.xz))*50.;
//    h-=smoothstep(15.,0.,length(p.xz))*20.;
    return h*amplitude;
}


float de(vec3 p) {
    vec3 pp=p;
    vec3 pos1=vec3(0.,0.,10.);
    vec3 pos2=vec3(0.,0.,-10.);
    vec3 pos3=vec3(10.,0.,0.);
    vec3 pos4=vec3(-10.,0.,0.);
    pos1.xz*=rot(time);
    pos2.xz*=rot(time);
    pos3.xz*=rot(time);
    pos4.xz*=rot(time);
    pos1.x+=sin(time)*10.;
    pos2.x+=cos(time)*10.;
    //p.x+=sin(time+p.z*.2)*3.;
    //p.y+=sin(p.x);
    //p.y+=cos(p.z);
    //p.y-=abs(p.x)*.5;
    //p.y+=length(p2)*.5-2.;
    pos1.y=he(-pos1)-r1-.5;
    pos2.y=he(-pos2)-r2-.5;
    pos3.y=he(-pos3)-r3-.5;
    pos4.y=he(-pos4)-r4-.5;
    p.y+=he(p);
    //p.x+=sin(p.z*.1+time)*5.;
    //p.x+=sin(time*.5)*10.;
    //p.y-=exp(-.3*abs(p.x))*8.;
    //p.y-=sin((p.z+p.x)*.3+time*2.);
    float d=abs(p.y)-1.;
    //d=min(d,length(p2)-15.);
    float sph1=length(pp+pos1)-r1;
    float sph2=length(pp+pos2)-r2;
    float sph3=length(pp+pos3)-r3;
    float sph4=length(pp+pos4)-r4;
    d=min(d,sph1);
    d=min(d,sph2);
    d=min(d,sph3);
    d=min(d,sph4);
    if (pattern==0.) {
        mat=step(.5,fract(p.z*.05))*.5;
    }
    if (pattern==1.) {
        mat=step(.5,fract(p.z*.1))*.5;
    }
    if (pattern==2.) {
        mat=step(.5,fract(p.x*.05))*.5;
    }
    if (pattern==3.) {
        mat=step(.5,fract(p.x*.1))*.5;
    }
    if (pattern==4.) {
        mat=fract(-abs(p.z)*.05);
    }
    if (pattern==5.) {
        mat=fract(length(p)*.025)+.3;
    }
    if (pattern==6.) {
        mat=fract(-abs(p.x)*.025);
    }
    if (pattern==7.) {
        mat=fract(-abs(p.z)*.025);
    }
    //0.02
    //0.05
    //0.1
    //0.15
    if (d==sph1) mat=.6;
    if (d==sph2) mat=.7;
    if (d==sph3) mat=.8;
    if (d==sph4) mat=.9;
    
    //d=max(d,abs(p.x)-20.);
    if (shape==0.||true) d=max(d,abs(p.z)-15.);
    else d=max(d,length(p.xz*vec2(1.,1.5))-25.);
    return d*.4;
}

vec3 normal(vec3 p) 
{
    vec2 d=vec2(0.,det);
    return normalize(vec3(de(p+d.yxx),de(p+d.xyx),de(p+d.xxy))-de(p));
}

mat3 lookat(vec3 dir) {
	dir=normalize(dir);
    vec3 rt=normalize(cross(dir,vec3(0.,1.,0.)));
    return mat3(rt,cross(rt,dir),dir);
}

float ao(vec3 p, vec3 n) {
	float st=.5;
	float ao=0.;
    for(float i=0.; i<6.; i++ ) {
        float td=st*i;
        float d=de(p+n*td);
        ao+=max(0.,(td-d)/td);
    }
    return clamp(1.-ao*.2,0.,1.);
}

float shadow( in vec3 ro, in vec3 rd)
{
	float res = 1.0;
    float t = 0.1;
	float h;
	
    for (int i = 0; i <8; i++)
	{
		h = max(de( ro + rd*t )+.03, 0.0);
		res = min(3.*h / t, res);
		t += h+.1;
	}
    return max(res, .12);
}

vec4 march(vec3 from, vec3 dir) {
    float d, td=0.;
    vec3 p;
    vec4 col=vec4(0.);
    float hit=0.;
    for (int i=0; i<100; i++)
    {
        p=from+dir*td;
        d=de(p);
        if(d<det||td>maxdist) break;
        td+=d;
    }
    vec3 nor=normal(p);
    float light=0.;
    float matsave=mat;
    if (d<.1) {
        hit=1.;
        p-=det*dir;
        vec3 ldir=normalize(vec3(2.,-1.,0.));
        ldir.xz*=rot(angle_xz);
        float sh=shadow(p, -ldir);
        light=max(0.,dot(ldir,-nor))*sh*.8+.15;
        if (mat<.6) light*=.8;
        col=vec4(light);
    }
    vec3 rt=vec3(0.,0.,1.);
    rt.xz*=rot(angle_xz);
    nor*=lookat(rt);
    if (mode == 0.) col = vec4(nor.x*.5+.5, nor.y*.5+.5, light, matsave)*hit;
    return col;
}



void main() {
    vec2 uv = vTexCoord-.5;
    //uv.y=-uv.y;
    uv.x*=resolution.x/resolution.y;
    vec3 dir=normalize(vec3(uv,1.));
    vec3 from=vec3(0.,20.-3.*camheight,-15.-3.*camheight)*2.;
//    dir.yz*=rot(-1.);
    from.xz*=rot(angle_xz);
    rotdir=lookat(-from);
    dir=rotdir*dir;
    //dir.yz*=rot(-1.);
    vec4 col=march(from, dir);
    gl_FragColor=col;
}