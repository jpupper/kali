precision highp float;

uniform float iTime;
uniform vec2 iResolution;

#define la 1+2+4+8+16+32+256+512
#define lb 1+2+4+8+8192+32+256+512+128+64
#define lc 1+2+4+8+128+64
#define ld 1+2+4+524288+32+128+64
#define le 1+2+4+8+128+64+256
#define lf 1+2+4+8+256
#define lg 1+2+4+8+32+64+128+512
#define lh 1+2+16+32+256+512
#define li 1024+2048+4+8+64+128
#define lj 8+16+32+64+65536
#define lk 1+2+8192+32768+256
#define ll 1+2+64+128
#define lm 1+2+16+32+8192+16384
#define ln 1+2+16+32+16384+32768
#define lo 1+2+4+8+16+32+64+128
#define lp 1+2+4+8+16+256+512
#define lq 1+2+4+8+16+32+64+128+32768
#define lr 1+2+4+8+16+256+512+32768
#define ls 2+4+8+32+64+128+512+256
#define lt 4+8+1024+2048
#define lu 1+2+16+32+64+128
#define lv 131072+65536+2+16
#define lw 4096+32768+1+2+16+32
#define lx 4096+8192+16384+32768
#define ly 8192+16384+1024
#define lz 4+8+64+128+8192+4096
#define l0 1+2+4+128+1024+2048
#define l1 1024+2048+262144
#define l2 1+4+128+256+2048
#define l3 4+128+256+1024+2048
#define l4 1024+2048+256+2
#define l5 1024+256+2+4+128
#define l6 1+1024+256+2+4+128
#define l7 1024+2048+4
#define l8 1+2+4+128+256+1024+2048
#define l9 2+4+128+256+1024+2048

varying vec2 vTexCoord;

uniform float on;

// aca se define la frase l+(letra o numero)
int frase[21];

int AND(int n1, int n2){
    
    float v1 = float(n1);
    float v2 = float(n2);
    
    int byteVal = 1;
    int result = 0;
    
    for(int i = 0; i < 32; i++){
        bool keepGoing = v1>0.0 || v2 > 0.0;
        if(keepGoing){
            
            bool addOn = mod(v1, 2.0) > 0.0 && mod(v2, 2.0) > 0.0;
            
            if(addOn){
                result += byteVal;
            }
            
            v1 = floor(v1 / 2.0);
            v2 = floor(v2 / 2.0);
            byteVal *= 2;
        } else {
            return result;
        }
    }
    return result;
}

float linea(vec2 uv, vec4 vert){
    uv-=vert.xy;
    vec2 pos=vert.zw;
    return length(uv-pos*clamp(dot(uv,pos)/dot(pos,pos),-0.,1.));
}

float letra(vec2 uv, int letra, float width) {
    //uv*=1.-sin(uv.x*2.)*.2;
    vec4 d = vec4(0.5,-0.5,1.,0.);
	float s = 10.; 
    s = (AND(letra,1)) > 0 ? min(s,linea(uv, d.wwwx)) : s; // vertical -1, -1
	s = (AND(letra,2)) > 0 ? min(s,linea(uv, d.wxwx)) : s; // vertical -1,  1
	s = (AND(letra,4)) > 0 ? min(s,linea(uv, d.wzxw)) : s; // horizont -1,  1
	s = (AND(letra,8)) > 0 ? min(s,linea(uv, d.xzxw)) : s; // horizont  1,  1 
 	s = (AND(letra,16)) > 0 ? min(s,linea(uv, d.zxwx)) : s; // vertical  1,  1
 	s = (AND(letra,32)) > 0 ? min(s,linea(uv, d.zwwx)) : s; // vertical  1, -1
 	s = (AND(letra,64)) > 0 ? min(s,linea(uv, d.xwxw)) : s; // horizont  1, -1
 	s = (AND(letra,128)) > 0 ? min(s,linea(uv, d.wwxw)) : s; // horizont -1, -1
 	s = (AND(letra,256)) > 0 ? min(s,linea(uv, d.wxxw)) : s; // horizont -1,  0
 	s = (AND(letra,512)) > 0 ? min(s,linea(uv, d.xxxw)) : s; // horizont  1,  0
 	s = (AND(letra,1024)) > 0 ? min(s,linea(uv, d.xwwx)) : s; // vertical  0, -1
 	s = (AND(letra,2048)) > 0 ? min(s,linea(uv, d.xxwx)) : s; // vertical  0,  1
 	s = (AND(letra,4096)) > 0 ? min(s,linea(uv, d.wwxx)) : s; // diagonal -1, -1
 	s = (AND(letra,8192)) > 0 ? min(s,linea(uv, d.xxxx)) : s; // diagonal  1,  1
 	s = (AND(letra,16384)) > 0 ? min(s,linea(uv, d.wzxy)) : s; // diagonal -1,  1
 	s = (AND(letra,32768)) > 0 ? min(s,linea(uv, d.xxxy)) : s; // diagonal  1, -1
 	s = (AND(letra,65536)) > 0 ? min(s,linea(uv, d.wxxy)) : s; // diagona2 -1, -1
 	s = (AND(letra,131072)) > 0 ? min(s,linea(uv, d.xwxx)) : s; // diagona2  1, -1
 	s = (AND(letra,262144)) > 0 ? min(s,linea(uv, d.wxxx)) : s; // diagona2 -1,  1
 	s = (AND(letra,524288)) > 0 ? min(s,linea(uv, d.xzxy)) : s; // diagona2  1,  1
    return s-width;
}

mat2 rot2D(float a) {
	float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

vec3 scroller(vec2 uv) {
    vec2 p=uv;
	p.y-=.45;
    p.x-=.1;
    vec2 escala=vec2(18.,10.);
    p*=escala;
    vec2 sc=1./escala*escala;
    vec3 c=vec3(0.);
    vec3 ic=vec3(0.,0.,1.);
    for (int i=0; i<50; i++) {
    	int let = frase[i];
        if (let == 999) break;
        //ic.xz*=rot2D(.1);
        c+=exp((-15.-15.*on)*letra(p, let, .15))*(ic+.05);
        p.x-=sc.x+.8*sc.x;
    }
    c.xz*=rot2D(iTime*10.);
    return c*(2.-on);
}


float det=.001;
float fir;
vec3 objcol;
vec3 letcol;

mat2 rot(float a)
{
    float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}

vec3 crazysincos(float t) {
    vec3 p=vec3(0.);
    p.x+=sin(cos(t*1.1654)*3.546);
    p.y+=sin(sin(t*1.354)*2.546);
    p.z+=cos(cos(t*1.234)*3.546);
    return p;
}


float cyl(vec3 p, float rad, float hei)
{
    return max(length(p.xz)-rad,abs(p.y)-hei);
}


float torus(vec3 p, float rad, float wi)
{
  vec2 q = vec2(length(p.xz)-rad,p.y);
  return length(q)-wi;
}

float decor1(vec3 p)
{
    p.y=abs(p.y);
    p.y-=.9;
    float a=atan(p.x,p.z);
    p.y+=sin(a*50.)*.05;
    return torus(p,3.,.1);
}

float decor2(vec3 p)
{
    p.y-=1.;
    float a=atan(p.x,p.z);
    p.y+=smoothstep(1.,.0,sin(a*20.))*.1;
    p.xz*=1.-sin(a*5.)*.3;
    float d1 = torus(p,2.3+cos(a*25.)*.2,.11);
    float d2 = torus(p,1.2+cos(a*20.)*.2,.11);
    return min(d1,d2);
}


float cake(vec3 p) {
    vec3 p2 = p;
    float a=atan(p.x,p.z);
    p.xz*=1.-sin(a*5.)*.3;
    float d=cyl(p,3.,1.);
    float c=max(cyl(p2,5.,.6),-cyl(p2,4.7,2.));
    d=min(d,c);
    return d*.5;
}

float candle(vec3 p)
{
    p.y-=1.;
    float a=sin(atan(p.x,p.z)*5.+p.y*50.);
    p.xz*=1.+a*.2;
    float d=cyl(p, .1,1.);;
    return d*.5;
}

float fire(vec3 p)
{
    p.y-=2.4;
    p.xz*=2.-smoothstep(.2,-.1,p.y)*.5;
    p+=crazysincos(iTime*5.+p.y)*.1*smoothstep(-.5,.2,p.y);
    return (length(p)-.2)*.5;
}

float de(vec3 p)
{
    p.yz*=rot(-.6*smoothstep(1.,5.,iTime));
    vec3 p2=p;
    p.y-=1.+sin(iTime*2.)*.5-smoothstep(0.,3.,length(p.xz));
    p.xz*=rot(-iTime*.7+1.3);
    vec2 ap=vec2(mod(atan(p.z,p.x)+iTime*.5,3.14)*.7,p.y*.2+.5);
    letcol=scroller(ap);
    float tor=cake(p);
    float dec1=decor1(p);
    float dec2=decor2(p);
    float can=candle(p);
    float mec=cyl(p-vec3(0.,1.,0.),.01,1.3);
    float pla=p2.y+1.;
    fir=max(det,abs(fire(p)));
    fir=max(fir,-mec+.1);
    float d=min(tor,dec2);
    d=min(d,can);
    d=min(d,mec);
    d=min(d,fir);
    d=min(d,pla);
    if (d==tor) objcol=vec3(0.5,.0,1.) - smoothstep(.5,0.,length(p.xz)) * .5 + fract(p.y*5.) * vec3(2.,0.,0.);
    if (d==dec1) objcol=vec3(2.,.4,.2);
    if (d==dec2) objcol=vec3(1.,2.,.5);
    if (d==can) objcol=vec3(.5);
    if (d==mec) objcol=vec3(-1.);
    if (d==pla) {
        float m=1000.;
        vec3 pp=p2*.5;
        pp.xz*=rot2D(iTime*.5);
        pp/=dot(pp,pp);
        for(int i=0; i<6; i++)
        {
            pp=abs(pp)/clamp(abs(pp.x*pp.y),0.5,2.)-1.;
            m=min(m,abs(pp.x))+fract(pp.x*.5+iTime+float(i)*.2)*.2;
        }
        m=exp(-5.*m)*5.;
        objcol=normalize(pp)*1.5;
        objcol.xy*=rot(1.);
        objcol+=m;
        objcol*=.3+.7*smoothstep(3.,4.,length(p.xz));
    }
    return d;

}

vec3 normal(vec3 p)
{
    vec2 d=vec2(0.,det);
    return normalize(vec3(de(p+d.yxx),de(p+d.xyx),de(p+d.xxy))-de(p));
}



vec3 shade(vec3 p, vec3 dir) 
{
    vec3 col=objcol;
    vec3 ldir=normalize(vec3(1.,1.,-1.));
    vec3 lpos=vec3(0.,2.,0.);
    ldir=normalize(lpos-p);
    vec3 n=normal(p);
    float amb=max(0.5,dot(-dir,n))*exp(-.7*distance(p,lpos))*5.;
    float dif=max(0.,dot(ldir,n))*.7;
    return col*(dif+amb)*on+col*(1.-on)*.2;

}


vec3 march(vec3 from, vec3 dir)
{
    float d, td=0., fcol=0.;
    vec3 p, c=vec3(0.);
    for (int i=0; i<100; i++)
    {
        p=from+dir*td;
        d=de(p);
        td+=d;
        if(d<det || td>50.) break;
        fcol=max(fcol,max(0.,.1-fir)/.1)*on;
    }
    vec3 background = dir;
    if (d<det)
    {
        c=shade(p, dir)+letcol*step(4.4,length(p));
    } else
    {
      td=50.;
    }
    vec3 back=vec3(0.);
    p=dir;
    p.y+=.2;
    p.x+=.5;
    p.z+=iTime*.05;
    p=abs(.5-fract(p*.2));
    float m=1000.;
    for (int i=0; i<15; i++) {
        p=abs(p)/dot(p,p)-.9;
        m=min(m,length(p));
    }
    m=exp(-30.*m)*1.5;
    m+=exp(-10.*length(dir.xy))*smoothstep(0.,5.,iTime);
    //m=smoothstep(.2,.0,m);
    //back+=length(p)*0.05;
    back+=m*on;
    back=clamp(back,0.,1.);
    c=mix(back,c,exp(-.002*td*td));
    return max(c,mix(vec3(1.,.6,0.),vec3(2.,1.,0.),fcol*.5)*fcol);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = vTexCoord - .5;
    //uv=floor(uv*50.)/50.;
    vec3 from = vec3(0.,.0,-20.-smoothstep(5.,0.,iTime)*10.);
    vec3 dir = normalize(vec3(uv,1.5));
    vec3 col = march(from, dir);
    col+=sin(-col*10.-iTime*10.)*.5*vec3(1.,0.,0.)*on;
    fragColor = vec4(col*smoothstep(0.2,1.,iTime),1.);
}

void main() {
    //frase = (lf,le,ll,li,lz,0,lc,lu,lm,lp,ll,le,0,lf,lr,la,ln,999);
    frase[0 ] = lf;
    frase[1 ] = le;
    frase[2 ] = ll;
    frase[3 ] = li;
    frase[4 ] = lz;
    frase[5 ] = 0;
    frase[6 ] = lc;
    frase[7 ] = lu;
    frase[8 ] = lm;
    frase[9 ] = lp;
    frase[10] = ll;
    frase[11] = le;
    frase[12] = 0;
    frase[13] = lj;
    frase[14] = lp;
    frase[15] = lu;
    frase[16] = lp;
    frase[17] = lp;
    frase[18] = le;
    frase[19] = lr;
    frase[20] = 999;
    vec4 fragColor = vec4(0.);
    mainImage(fragColor, gl_FragCoord.xy);
    gl_FragColor = fragColor;
}