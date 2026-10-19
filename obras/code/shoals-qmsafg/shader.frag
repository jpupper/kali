precision highp float;

#define PI 3.1416

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
#define hash17 rnd(fxrand+17.3264)
#define hash18 rnd(fxrand+18.8264)
#define hash19 rnd(fxrand+19.2824)
#define hash20 rnd(fxrand+20.4814)
#define hash21 rnd(fxrand+21.1444)
#define hash22 rnd(fxrand+22.3414)
#define hash23 rnd(fxrand+23.4424)
#define hash24 rnd(fxrand+24.1444)
#define hash25 rnd(fxrand+25.1234)
#define hash26 rnd(fxrand+26.8764)
#define hash27 rnd(fxrand+27.7142)
#define hash28 rnd(fxrand+28.1231)

uniform vec2 resolution;
uniform float time;
uniform float rotax;
uniform float rotay;


varying vec2 vTexCoord;


#define iTime (time*.1)
#define iResolution resolution


float det=.0003;
vec3 pos;


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

mat2 rot(float a){
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}


float fractal(vec3 p) {
  p += cos(p.z * 3. + time * 4.) * .02;
  float depth = smoothstep(0., 6., -p.z + 5.);
  p *= .3;
  p = abs(2. - mod(p + vec3(0.4, 0.7, time * .07), 4.));
  float ls = 0.;
  float c = 0.;
  for (int i = 0; i < 8; i++) {
    p = abs(p) / min(dot(p, p), 1.) - .8;
    float l = length(p);
    c += abs(l - ls);
    ls = l;
  }
  return smoothstep(0., 50., c) * depth * 5.;
}



float shoal(vec3 p) {
    p.xz*=rot(rotax+.5);
    //p.yz*=rot(rotay+.5);
    //p.xy*=rot(rotay);
    p*=1.2-length(sin(p*(.3+hash24)+iTime))*(.2+hash4*.1);
    p.xz*=rot(iTime+p.y*(.3+hash2*.5));
    p.yz*=rot(iTime+p.x*.5*hash3);
    pos=p;
    float d=length(p)-3.;
    d=max(d,-length(p)+2.5+hash23*.2);
    vec3 s=sin(p*(1.5+hash1*5.));
    d+=length(s*s)*(.27+hash21*.0);
    //d=min(d,length(p)-hash4*.5-.8-length(sin(p*4.)*.5*hash7));
    return d*.3;
}

float de(vec3 p) {
    float d=shoal(p);
    //p.xy*=rot(time*.5);
    d=min(d,shoal(p*1.5)/1.5);
    return d;
}

vec3 normal(vec3 p) {
    vec2 e=vec2(0.,det*2.);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}

vec3 ldir;

vec3 color(vec3 p) {
    float a=.5+hash8*1.;
    float b=.5+hash9*1.;
    vec3 col=abs(mix(sin(p*a),cos(p*b),clamp(p.x,-1.5,1.5)));
//    vec3 col=abs(sin(p*hash8*1.))*2.;
    col.rb*=rot(hash10*5.);
    col.rg*=rot(hash11*5.);
    col.gb*=rot(hash12*5.);
    col=abs(col);
    //col=vec3(1.5,0.,0.);
    return col;
}

vec3 shade(vec3 p, vec3 dir, vec3 n) {
    float amb=.3;
    float dif=max(0.,dot(ldir,n))*.8;
    vec3 col=color(pos);
//    vec3 col=abs(mix(sin(pos*hash8*2.),cos(pos*hash9*2.),clamp(pos.x,-1.5,1.5)));
    //col=mix(vec3(length(col)*.5),col,.5+hash23);
    return (amb+dif)*col;
    
}

vec3 march(vec3 from, vec3 dir) {
    vec3 colwater=vec3(.3, .7, 1.);
    if (hash5>.2) colwater=vec3(.5, .5, 1.);
    if (hash5>.4) colwater=vec3(.5, 1., .9);
    if (hash5>.6) colwater=vec3(1., .9, .5);
    if (hash5>.8) colwater=vec3(.6,.65,.7);
    ldir=normalize(vec3(hash19-.5,hash20-.5,-.5));
    ldir=normalize(vec3(0.,hash20-.5,-.5));
    float td=0.,d=0.,ref=0.,maxdist=45.;
    vec3 col=vec3(0.),colref=col,p=from,g=col;
    float fg = fractal(p + dir*4.) * .55;
    for(int i=0; i<200; i++){
        p+=d*dir;
        d=de(p);
        if (d<det&&ref>0.||td>maxdist) break;
        if (d<det&&ref<1.) {
            ref=1.;
            vec3 n=normal(p);
            colref+=shade(p,dir,n);
            dir=reflect(dir,n);
            p+=dir*.1;
        }
        g+=.1/(.1+d);
        td+=d;
    }
    vec3 n=normal(p);
    if (d>det) {
        if (ref>.5) maxdist*=.5;
        td=maxdist;
        p=dir*maxdist;
    } else {
        col=shade(p,dir,n);
    }
    //vec3 back=vec3(.5,0.,0.);
//    back.rb*=rot(hash10*5.);
//    back.rg*=rot(hash11*5.);
//    back.gb*=rot(hash12*5.);
    p.xy*=rot(hash16*3.);
    vec3 di=dir;
    di.xz*=rot(.5);
    di.xy*=rot(.5);
    vec3 back=color(di);
    if (hash6>.5&&false) {
        back+=smoothstep(.15,.0,abs(fract(p.y*.15)-.5))*step(hash17,.5)*back*.5;
        back+=smoothstep(.15,.0,abs(fract(p.x*.15)-.5))*step(hash18,.5)*back*.5;
        back+=smoothstep(.15,.0,max(abs(fract(p.x*.15)-.5),abs(fract(p.y*.15)-.5)))*step(hash19,.5)*back;
        back=mix(vec3(length(back)*.5),back,.5);
        back=abs(back)*.5;
    } else {
        back=mix(vec3(length(back)*.5),back,.5);
        back=abs(back)*.5;
        //back+=fractal(p*.1)*back;
    }
    back+=pow(max(0.,dot(dir,ldir)),10.+hash28*30.);
    float r=.3+hash13*.6;
    col=mix(col*.5,colref,ref*r);
    col=mix(col,back,1.-ref*.8*r);
 //   if (ref<.5) col+=g*.01*back;
    //col+=fg*back;
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
    vec2 uv2 = fragCoord/iResolution.xy-.5;

    vec3 from=vec3(.0,.0,-4.5-3.5*hash15);
    vec3 dir=normalize(vec3(uv,.7));
    from.xz*=rot(iTime+2.+rotax*1.5);
    dir.xz*=rot(iTime+2.+rotax*1.5);
    from.yz*=rot(rotay*.5);
    dir.yz*=rot(rotay*.5);
    
    vec3 col = march(from,dir);
    col=min(vec3(1.),col);
 //   col*=smoothstep(.5,.4,abs(uv2.x));
//    col*=smoothstep(.5,.4,abs(uv2.y));
    fragColor = vec4(col,1.0);
}
void main() {
    vec2 fragCoord = vTexCoord*resolution;
    vec4 col = vec4(0.);
    mainImage(col, fragCoord);
    gl_FragColor = col;
}