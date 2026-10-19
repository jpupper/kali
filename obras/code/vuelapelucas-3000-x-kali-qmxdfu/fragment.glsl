precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float random;
uniform vec2 mouse;
uniform sampler2D prevframe;

varying vec2 vTexCoord;

#define ringstart 13.
#define ringend 22.
#define ringcaos .02
#define ringthickness .3
#define rotationspeed .7
#define bubbleradius 6.
#define bubblepulse 1. 
#define bubblespeed .3
#define rayslength 12. // a partir de 11 los rayos golpean la cámara y se logra otro efecto
#define rayswidth .1
#define lightoffset .3
#define colorintensity 1.
#define reflectionintensity .7
#define stripes true
#define scanlines true
#define noiselevel .15


#define fragCoord (floor(vTexCoord*resolution))
float shard, ssoft;


float t,as, cara;


// ↙
//  ↙
//   ↙
// https://youtu.be/dQw4w9WgXcQ

// compare algorithm performance, comment out line below to see previous performance:
//#define ANOTHER_ALGORITHM      // runs slower on ARM, so comment this out if mobile phone performance is priority

vec2 uv;

#define time (time+15.)

const vec2 ch_size  = vec2(1.0, 2.0) * 0.6;              // character size (X,Y)
const vec2 ch_space = ch_size + vec2(1.5, 1.0);    // character distance Vector(X,Y)
const vec2 ch_start = vec2 (ch_space.x * -5., 1.); // start position
      vec2 ch_pos   = vec2 (0.0, 0.0);             // character position(X,Y)
//      vec3 ch_color = vec3 (1.5, 0.75, 0.5);        // character color (R,G,B)
//const vec3 bg_color = vec3 (0.2, 0.2, 0.2);        // background color (R,G,B)

#define REPEAT_SIGN false // True/False; True=Multiple, False=Single

/* 16 segment display...Akin to LED Display.

Segment bit positions:
  __2__ __1__
 |\    |    /|
 | \   |   / |
 3  11 10 9  0
 |   \ | /   |
 |    \|/    |
  _12__ __8__
 |           |
 |    /|\    |
 4   / | \   7
 | 13 14  15 |
 | /   |   \ |
  __5__|__6__

15 12 11 8 7  4 3  0
 |  | |  | |  | |  |
 0000 0000 0000 0000

example: letter A

   12    8 7  4 3210
    |    | |  | ||||
 0001 0001 1001 1111

 binary to hex -> 0x119F
*/

// split 16 Bit int into two 8 Bit int for mobile phones with ridiculous 1-byte int
#define n0 ddigit(0x22,0xFF);
#define n1 ddigit(0x02,0x81);
#define n2 ddigit(0x11,0x77);
#define n3 ddigit(0x11,0xE7);
#define n4 ddigit(0x55,0x08);
#define n5 ddigit(0x11,0xEE);
#define n6 ddigit(0x11,0xFE);
#define n7 ddigit(0x22,0x06);
#define n8 ddigit(0x11,0xFF);
#define n9 ddigit(0x11,0xEF);

#define A ddigit(0x11,0x9F);
#define B ddigit(0x92,0x7E);
#define C ddigit(0x00,0x7E);
#define D ddigit(0x44,0xE7);
#define E ddigit(0x10,0x7E);
#define F ddigit(0x10,0x1E);
#define G ddigit(0x80,0x7E);
#define H ddigit(0x11,0x99);
#define I ddigit(0x44,0x66);
#define J ddigit(0x44,0x36);
#define K ddigit(0x92,0x18);
#define L ddigit(0x00,0x78);
#define M ddigit(0x0A,0x99);
#define N ddigit(0x88,0x99);
#define O ddigit(0x00,0xFF);
#define P ddigit(0x11,0x1F);
#define Q ddigit(0x80,0xFF);
#define R ddigit(0x91,0x1F);
#define S ddigit(0x88,0x66);
#define T ddigit(0x44,0x06);
#define U ddigit(0x00,0xF9);
#define u ddigit(0x00,0xF0);
#define V ddigit(0x22,0x18);
#define W ddigit(0xA0,0x99);
#define w ddigit(0xA0,0x90);
#define X ddigit(0xAA,0x00);
#define Y ddigit(0x4A,0x00);
#define Z ddigit(0x22,0x66);
#define _ ch_pos.x += ch_space.x;
#define s_dot     ddigit(0,0);
#define s_minus   ddigit(0x11,0x00);
#define s_plus    ddigit(0x55,0x00);
#define s_greater ddigit(0x28,0x00);
#define s_less    ddigit(0x82,0x00);
#define s_sqrt    ddigit(0x0C,0x02);
#define s_sw      ddigit(0x55,0xAA);
#define s_pow     ddigit(0x02,0x01);
#define upper_u   ddigit(0x11,0x09);
#define s_bra    ddigit(0x00,0x3C);
#define s_ket    ddigit(0x00,0xC3);
#define s_quotl    ddigit(0x04,0x01);
#define s_quotr    ddigit(0x04,0x08);
#define s_degrees    ddigit(0x05,0x03);
#define s_ast    ddigit(0xFF,0x00);
#define s_question ch_pos-=vec2(-.45,.4); ddigit(0,0); ch_pos+=vec2(-ch_space.x-.45,.4); ddigit(0x41,0x07);
#define s_exclam   ch_pos-=vec2(-.45,.4); ddigit(0,0); ch_pos+=vec2(-ch_space.x-.45,.4); ddigit(0x44,0x00);
#define s_comma   ch_pos-=vec2(.45); ddigit(0x20,0x00); ch_pos+=vec2(.45);
#define nl1 ch_pos = ch_start;  ch_pos.y -= 3.0;
#define nl2 ch_pos = ch_start;  ch_pos.y -= 6.0;
#define nl3 ch_pos = ch_start;	ch_pos.y -= 9.0;

#ifdef ANOTHER_ALGORITHM
float dseg1(vec2 p0, vec2 p1)
{
	vec2 cp = vec2(uv.x-(uv.y*.5-ch_pos.y*.5-p0.y), uv.y) - ch_pos - p0;
	return distance(cp, vec2(0., clamp(cp.y, 0., p1.y-p0.y)) );
}
float dseg2(vec2 p0, vec2 p1)
{
	vec2 cp = vec2(uv.x+(uv.y*.5-.9-ch_pos.y*.5-p0.y), uv.y) - ch_pos - p0;
	return distance(cp, vec2(0., clamp(cp.y, 0., p1.y-p0.y)) );
}
#else
float dseg(vec2 p0, vec2 p1)
{
	vec2 dir = normalize(p1 - p0);
	vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
	return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));
}
#endif
float dsegH(vec2 p0, vec2 p1) // avoiding matric ops
{
	vec2 cp = uv - ch_pos - p0;
	//return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));
	return distance(cp, vec2(clamp(cp.x, 0., p1.x-p0.x), 0.) );
}
float dsegV(vec2 p0, vec2 p1) // avoiding matrix ops
{
	vec2 cp = uv - ch_pos - p0;
	//return distance(cp, clamp(cp, vec2(0), vec2(0, distance(p0, p1))));
	return distance(cp, vec2(0., clamp(cp.y, 0., p1.y-p0.y)) );
}

bool bit(int n)
{
	return (n/2)*2 != n;
}

float d = 1e6;

#ifdef ANOTHER_ALGORITHM		// Intel skylake GPU seems to prefer this
void ddigit(int n, int nn)
{
	float v = 1e6;
	vec2 cp = uv - ch_pos;
	// better performance in this order, on Intel Iris 550 skylake  (WHY does order matter??)
	if (n == 0 && nn==0)     v = min(v, dsegH(vec2(-0.405, -1.000), vec2(-0.500, -1.000)));
	if (bit(nn/4)) v = min(v, dsegH(vec2( -0.438,  1.000), vec2(-0.063, 1.000)));
	if (bit(nn/2)) v = min(v, dsegH(vec2(0.063,  1.000), vec2(0.438,  1.000)));
	if (bit(nn/32)) v = min(v, dsegH(vec2(-0.438, -1.000), vec2(-0.063, -1.000)));
	if (bit(nn/64)) v = min(v, dsegH(vec2( 0.063, -1.000), vec2( 0.438, -1.000)));
	if (bit(n/1)) v = min(v, dsegH(vec2( 0.063,  0.000), vec2( 0.438, -0.000)));
	if (bit(n/16)) v = min(v, dsegH(vec2(-0.438,  0.000), vec2(-0.063, -0.000)));
	if (bit(nn/1)) v = min(v, dsegV(vec2( 0.500,  0.063), vec2( 0.500,  0.937)));
	if (bit(nn/128)) v = min(v, dsegV(vec2( 0.500, -0.938), vec2( 0.500, -0.063)));
	if (bit(n/4)) v = min(v, dsegV(vec2( 0.000,  0.063), vec2( 0.000,  0.937)));
	if (bit(n/64)) v = min(v, dsegV(vec2( 0.000, -0.938), vec2( 0.000, -0.063)));
	if (bit(nn/8)) v = min(v, dsegV(vec2(-0.500,  0.063), vec2(-0.500,  0.937)));
	if (bit(nn/16)) v = min(v, dsegV(vec2(-0.500, -0.938), vec2(-0.500, -0.063)));
	// matrix ops last
	if (bit(n/2)) v = min(v, dseg1(vec2( 0.063,  0.063), vec2( 0.063,  0.938)));
	if (bit(n/8)) v = min(v, dseg2(vec2(-0.963,  0.063), vec2(-1.338,  0.938)));
	if (bit(n/32)) v = min(v, dseg1(vec2(-0.963, -0.938), vec2(-0.963, -0.063)));
	if (bit(n/128)) v = min(v, dseg2(vec2( 0.063, -0.938), vec2( 0.063, -0.063)));
	ch_pos.x += ch_space.x;
	d = min(d, v);
}
#else		// some GPU's may run faster with this
void ddigit(int n, int nn)
{
	float v = 1e6;
    vec2 cp = uv - ch_pos;
    if (n == 0 && nn == 0)     v = min(v, dseg(vec2(-0.405, -1.000), vec2(-0.500, -1.000)));
	if (bit(nn/1)) v = min(v, dseg(vec2( 0.400,  0.063), vec2( 0.500,  0.937)));
	if (bit(nn/2)) v = min(v, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000)));
	if (bit(nn/4)) v = min(v, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000)));
	if (bit(nn/8)) v = min(v, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062)));
	if (bit(nn/16)) v = min(v, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938)));
	if (bit(nn/32)) v = min(v, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000)));
	if (bit(nn/64)) v = min(v, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000)));
	if (bit(nn/128)) v = min(v, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063)));
	if (bit(n/1)) v = min(v, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000)));
	if (bit(n/2)) v = min(v, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938)));
	if (bit(n/4)) v = min(v, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937)));
	if (bit(n/8)) v = min(v, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938)));
	if (bit(n/16)) v = min(v, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000)));
	if (bit(n/32)) v = min(v, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938)));
	if (bit(n/64)) v = min(v, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063)));
	if (bit(n/128)) v = min(v, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938)));
	ch_pos.x += ch_space.x;
	d = min(d, v);
}
#endif

mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing

	return c.z * mix( vec3(1.0), rgb, c.y);
}

vec4 text()
{

	vec2 aspect = resolution.xy / resolution.y;
	uv = ( fragCoord.xy / resolution.y ) - aspect / 2.0;
	float _d =  1.0-length(uv);
	uv *= 45.0 +  sin(time)*5.;
	uv -= vec2(-9., -10.);
    //uv *= rotate(time+uv.x*0.05);

	uv.x+=3. + tan(uv.y*.01+time)*.3;
	uv.x+=sin(uv.y*2.+time*5.)*.1;
	ch_pos = ch_start;

			nl2
	   		_ _ _ V U E L A P E L U C A S _ n3 n0 n0 n0
    float a = smoothstep(0.4,0.2,d);
    float b = smoothstep(.8,0.3,d);
  	vec3 ch_color = hsv2rgb_smooth(vec3(time*0.4+uv.x*.05,0.7,1.5));
    vec3 col=ch_color*a;
    return vec4(col, max(a,b));
}




float det=.001;
float maxdist=100.;
float coredist;
float it=0.;
vec3 pos;

float hash(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c,s,-s,c);
}

float aro(vec3 p, float inner, float outer, float thickness, float it) {
    p.xz*=rot(time*rotationspeed*(1.+it*.02));
    float inring=length(p)-inner;
    float outring=length(p)-outer;
    float d=max(outring,-inring);
    d=max(d,abs(p.z)-thickness);
    coredist=min(coredist,max(abs(p.z)-rayslength,length(p.xy)-rayswidth));
    return d;
}

float de(vec3 p) {
    p.xy*=rot(sin(time)*.3);
    coredist=1000.;
    vec3 p2=p;
    float d=1000.,m=d;
    float der=1.;
    for (float i=ringstart; i<ringend; i++) {
        p.xy*=rot(i*ringcaos);
        float ar=aro(p, i*.5, ringthickness+i*.5, i*ringthickness*.05,i);
        d=min(d,ar);
        if (d==ar) {
            it=i;
        }
    }
    float s=sin(time*5.*bubblespeed);
    coredist=min(coredist, length(p2*(1.-.2*smoothstep(-2.,5.,p.y)))-bubbleradius-s*s*s*bubblepulse-sin(atan(p2.x,p2.y)*3.+time*2.)*.3);
    cara=length(p2.xy*vec2(1.,3.)+vec2(0.,7.-(p.x+.5)*p.x*.5))-2.3;
    vec3 p3=p2;
    p3.x=abs(p3.x)-.3;
    p3.y+=.7;
    cara=min(cara,length(p3.xy*vec2(1.,1.5))-.2);
    p2.x=abs(p2.x)-1.5;
    p2.y-=.7;
    cara=min(cara,length(p2.xy*vec2(.8,1.5-.2*abs(p.x)))-.7);
    cara=max(cara,abs(coredist)-.1);
    cara=max(cara,p2.z);
    coredist=max(.005,abs(coredist));
    d=min(d,coredist);
    return d;
}

vec3 normal(vec3 p) {
    vec2 e=vec2(0.,det);
    return normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
}

vec4 march(vec3 from, vec3 dir, vec2 uv) {
    vec3 p=from, col=vec3(0.), pref=p;
    float d=0., td=0., g=0., ref=0., ttd=0.;
    float ca=0.;
    for (int i=0; i<100; i++) {
        p+=dir*d;
        d=de(p);
        if (cara<0.) ca=1.;
        if (d<det&&ref<1.) {
            pref=p;
            ref+=1.;
            p-=dir*.1;
            vec3 n=normal(p);
            dir=reflect(dir,n);
            d=.1;
            ttd=td;
        }
        if (d<det||td>maxdist) break;
        td+=d;
        if (ref<1.) g+=.1/(.1+coredist);
    }
    if (ref<1.) ttd=td;
    dir.xy*=rot(time*rotationspeed*.5);
    if (scanlines) col+=exp(-5.*length(dir.xy+lightoffset))*vec3(2.,1.,.5)*2.*mod(gl_FragCoord.y,3.)+.1;
    else col+=exp(-5.*length(dir.xy+lightoffset))*vec3(2.,1.,.5)*2.;
    col+=g*.04*hsv2rgb_smooth(vec3(time*.5,.5,.7));
    if (ref>0.) {
        vec3 n=normal(pref);
        vec3 ringcol=vec3(1.,0.,0.);
        ringcol.rb*=rot(it);
        ringcol.gb*=rot(it*.5);
        ringcol=abs(ringcol);
        col=mix(col*reflectionintensity,ringcol*colorintensity,.1);
    }
    dir.xy*=rot(-time*rotationspeed*.5*2.);
    col.rb*=rot(-abs(dir.x)*.7);
    if (ref<1.&&stripes) col-=abs(.5-fract(atan(dir.x,dir.y)*10.))*.1;
    col+=(hash(uv*500.+time)-.5)*noiselevel;
    if (ref<1.) col*=.3+step(ca,0.)*.7;
    return vec4(col,ttd);
}

void main()
{
     vec2 uv=fragCoord/resolution.xy;
     vec2 p=(fragCoord-resolution.xy*.5)/resolution.y;
     vec3 from=vec3(-mouse*7., -11.);
     vec3 dir=normalize(vec3(p,.4));
     vec4 col=march(from, dir, uv);
     vec4 t=text();
    if (col.a>6.) col.rgb=mix(col.rgb*1.3,t.rgb,t.a);
    gl_FragColor = vec4(col.rgb,1.0);
}