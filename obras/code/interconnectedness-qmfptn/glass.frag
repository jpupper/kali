precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;


varying vec2 vTexCoord;

uniform sampler2D tx ;
uniform float rotaluz;

//PARAMETROS
float rotacionLuz = 180.+rotaluz; //en grados
float tamanioLuz = .9;  
float brilloLuz = 1.;

float tamanioMarco = .97;
float det=.001, maxd=30., g=0.;


float hash(vec2 p)
{
    p*=130.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rot(float a)
{
    float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}

float box(vec3 p, vec3 c) {
    vec3 b=abs(p)-c;
    return length(max(vec3(0.),b));
}

float de(vec3 p) {
    float x=tamanioMarco*5.4;
    float y=tamanioMarco*5.4;
    p.z-=pow(abs(p.x)/x,45.);
    p.z-=pow(abs(p.y)/y,45.);
    float d=box(p,vec3(x,y,1.));
    return min(d,d)*.5;
}

vec3 normal(vec3 p)
{
    vec2 e=vec2(0.,det);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}

vec3 march(vec3 from, vec3 dir)
{
    vec3 p, col=vec3(0.);
    float d, td=0.;
    for (int i=0; i<80; i++)
    {
        p=from+td*dir;
        d=de(p);
        if (d<det || td>maxd) break;
        td+=d;
        g++;
    }
    if (d<det)
    {
        p-=det*dir;
        vec3 n=normal(p);
        vec3 ldir=normalize(vec3(vec2(0.,-1.)*rot(radians(rotacionLuz)),-1.*tamanioLuz));
        vec3 ref=reflect(ldir,n);
        float spec=pow(max(0.,dot(dir,ref)),15.)*brilloLuz;
        col=vec3(spec);
    }
    //uv = vTexCoord ;
    vec3 img=texture2D(tx,vec2(vTexCoord.x,1.-vTexCoord.y)).rgb;
	col+=img*1.1;
    return col;
}

void main(){
	vec2 uv = vTexCoord - .5;
    vec2 uv2 = uv;
    //uv=abs(uv);
    vec3 from = vec3(0,0,-11.);
    vec3 dir = normalize(vec3(uv,1.));
    vec3 col = march(from, dir);
    //if (length(col)<.08||sketch>.5) col+=pow(abs(sin(uv2.y*100.)),100.)*.05*step(uv.x,.45)*sign(.5-sketch);
    //if (length(col)<.08||sketch>.5) col+=pow(abs(sin(uv2.x*100.)),100.)*.05*step(uv.x,.45)*sign(.5-sketch);
    //if (sketch<1.) col*=min(1.,time*.001);
    gl_FragColor = vec4(col,1.);
}