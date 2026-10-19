precision mediump float ;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;

uniform sampler2D tx ;
varying vec2 vTexCoord;

const float max_rad=.015;
const float it=100.;

uniform float force ;

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

void main(){
	
	vec2 uv = vTexCoord;
	     uv.y = 1.-uv.y;
    vec2 uv2=floor(uv*50.)/50.;
	mat2 spin=rot(2.39996);
    vec2 p=vec2(0.,1.);
    vec3 res=vec3(0.);
    float rad_step=max_rad/it+hash(uv+time*0.)*.0003;
	float rad=0.;
    float ti=mod(time,10.);
    float vhs=step(.98,hash(uv.yy+ti))*(1.+sin(uv.y*5.+ti))*step(.5,hash(uv.xy+ti))*smoothstep(0.,1.,uv.y);
    //vec4 col=texture2D(tx,uv+.05*step(.98,hash(uv2.yy+floor(time*10.)))*step(.5,hash(uv2.xx+time))*.7);
    //uv.y+=vhs*.3;
    vec4 col=texture2D(tx,uv);
    for (float i=0.;i<it; i++) {
        rad+=rad_step;
        p*=spin;
        vec4 col=texture2D(tx,uv+p*rad);
        res+=smoothstep(.5,1.,max(col.r,max(col.g,col.b)))*col.rgb;
    };
    res/=it;
    //uv=floor(uv*200.)/200.;
    //col+=vhs*.3;
    //
    //col.rgb=pow(abs(col.rgb),vec3(.7));
    col.rgb=mix(length(col.rgb)*vec3(.7),col.rgb,.75)*.7;
    vec4 ff = vec4(col.rgb+res*1.2,1.0);//*mod(gl_FragCoord.y,2.)*.87; 
    ff-=hash(vTexCoord)*.1;
    //ff*=step(1.3-vTexCoord.y-length(col.rgb)*.3+.2-hash(vTexCoord.xx)*.1,time*.5);
    gl_FragColor = ff;
    //gl_FragColor = vec4(col.rgb,1.);
}