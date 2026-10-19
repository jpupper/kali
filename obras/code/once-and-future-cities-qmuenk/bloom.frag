precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

uniform sampler2D tx ;
varying vec2 vTexCoord;

const float max_rad=.03;
const float it=100.;

uniform float force ;
uniform float invert;
uniform float bw;

#define iTime time;

#define iChannel0 tx;

mat2 rot(float a){
	float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
}

float hash(vec2 p)
{
    p*=1342.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}



 
float mapr(float _value,float _low2,float _high2) {
	float val = _low2 + (_high2 - _low2) * (_value - 0.) / (1.0 - 0.);
    //float val = 0.1;
	return val;
}

vec4 texture2D2(sampler2D tx, vec2 uv) {
    vec2 pix=1./resolution;
    vec4 col=vec4(0.);
    col+=texture2D(tx, uv);
    col+=texture2D(tx, uv+vec2(pix.x,0.));
    col+=texture2D(tx, uv+vec2(0.,pix.y));
    col+=texture2D(tx, uv+pix);
    col/=4.;
    return col;
}


vec4 blur()
{
   vec2 uv=gl_FragCoord.xy/resolution;
   float a=resolution.y/1080.;
   uv.y= 1.-uv.y;
   vec4 i=texture2D(tx,uv);
   float d=.5-pow(texture2D(tx,uv).w,.7)*.5;
   for(float r=.0;r<6.3;r+=.1)i+=texture2D(tx,clamp(uv+(vec2(cos(r),sin(r))*(.4/resolution)*(clamp((1./.4-1./(d))*.2,-1.,1.)*16.))*a,.001,.999));
   return i/=63.;
}

void main(){
	
	vec2 uv = vTexCoord;
	     uv.y = 1.-uv.y;
    vec2 uv2=floor(uv*50.)/50.;
	mat2 spin=rot(2.39996);
    vec2 p=vec2(0.,1.);
    vec3 res=vec3(0.);
    float rad_step=max_rad/it+hash(uv+time)*.0005;
	float rad=0.;
    float ti=mod(time,10.);
    //float vhs=step(.98,hash(uv.yy+ti))*(1.+sin(uv.y*5.+ti))*step(.5,hash(uv.xy+ti))*smoothstep(0.,1.,uv.y);
    //vec4 col=texture2D(tx,uv+.05*step(.98,hash(uv2.yy+floor(time*10.)))*step(.5,hash(uv2.xx+time))*.7);
    //uv.y+=vhs*.3;
    vec4 col=texture2D2(tx,uv);
    col = blur();
    for (float i=0.;i<it; i++) {
        rad+=rad_step;
        p*=spin;
        vec4 col=texture2D2(tx,uv+p*rad);
        res+=smoothstep(0.,1.,length(col.rgb))*col.rgb*5.3;
    };
    res/=it;
    //uv=floor(uv*200.)/200.;
    //col+=vhs*.3;
    //
    //col+=hash(uv+time)*.05;
    if (invert==1.) col.rgb=.9-col.rgb*3.;
    else col.rgb=col.rgb+res;
    col.rgb=mix(length(col.rgb)*vec3(.4), col.rgb, .5);
    if (bw==1.) col.rgb=col.rgg;
 //   col.rgb=pow(abs(col.rgb),vec3(1.5));
    //col.rgb=res;
    gl_FragColor = vec4(col.rgb,1.0);//*mod(gl_FragCoord.y,2.)*.87; 
    //gl_FragColor = vec4(col.rgb,1.);
}

