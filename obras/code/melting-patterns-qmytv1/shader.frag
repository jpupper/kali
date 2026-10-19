precision mediump float;

uniform vec2 resolution;
uniform float time;

uniform vec2 formuparam;
uniform float angle;
uniform float derret;
uniform float colrot;
uniform float width;
uniform float dsin;
uniform float dnoise;
uniform float deroffset;
uniform float melt;

#define iResolution resolution
#define iTime time

varying vec2 vTexCoord;





mat2 rot(float a) {
	float s=sin(a), c=cos(a);
	return mat2(c,s,-s,c);
}


//NOISE

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

    float n = mix( mix( hash( i + vec2(0.0,0.0) ),
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ),
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
    return (n-.5)*2.;
}


vec3 pattern(vec2 uv) {
    float t=iTime*.1;
    vec2 p=uv+vec2(.0,-0.);
    float m=1000.;
    for (int i=0; i<14; i++) {
    	p=abs(p);
        p=p*1.5-1.5-formuparam*.5;
        p*=rot(radians(45.*angle));
        m=min(m,length(max(vec2(0.),abs(p)-.1)));
    }
    m=smoothstep(.3,.25,m);
    vec3 col=m*vec3(p.y,p.x,m)*.5;
    //vec3 col=m*vec3(1.);
    //col*=1.-step(.5,fract(uv.x*2.+floor(uv.y*5.)*.5))*.7;
    return col;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv=fragCoord/iResolution.xy-.5;
    vec2 uv2=uv;
	uv.x*=iResolution.x/iResolution.y;
    //uv*=rot(radians(90.));
    //uv2*=rot(radians(90.));
    //uv*=1.+uv.y*.7;
    //uv.y+=derret;
    float b=1.;
    if (melt>0.) uv.y+=melt*melt*.01;
    uv.y*=1.-smoothstep(deroffset,deroffset-.3,uv.y)*.8;
    uv*=1.-pow(smoothstep(-.1,-.5,uv2.y),2.)*.9;
    uv.x+=noise(vec2(uv*20.+derret*10.)+vec2(0.,melt*melt*.01))*smoothstep(-.1,-.5,uv2.y)*.2;
    uv.x+=sin(pow(smoothstep(-.1,-.5,uv2.y+melt*melt*.01),3.)*10.)*.1*-sign(uv.x)*dsin;
        // uv=vec2(atan(uv.x,uv.y)/3.1416, min(.2,length(uv)));
        // //uv*=1.-pow(smoothstep(.2,.5,length(uv2)),2.)*.9;
        // uv.x+=noise(vec2(uv*20.+derret*10.))*smoothstep(.2,.5,length(uv2))*.2;
        // uv.x+=sin(pow(smoothstep(.2,.5,length(uv2)),3.)*10.)*.1*dsin;
    b=step(smoothstep(.2+width*.2,.3+width*.2,abs(uv.x))+smoothstep(.4,.5,uv.y),.45);
    //b=min(b,step(uv.y,.45));
    vec3 col=vec3(0.);
    const float aa=4.;
    vec2 pix=1./iResolution.xy/aa;
    for (float x=-aa; x<aa; x++) {
        for (float y=-aa; y<aa; y++) {
            col+=pattern(uv+vec2(x,y)*pix);
        }
    }
    col/=(aa*2.)*(aa*2.);
    col*=b;
    col*=1.-pow(smoothstep(-.2,-.3,uv2.y),2.)*.3;
    col.rb*=rot(uv.x*2.);
    col.gb*=rot(colrot*3.1416*2.);
    col=abs(col);
    col*=step(.5,uv2.y+iTime-col.g*.5-0.5);
    // col+=step(.47,uv2.y)*.5;
    // col+=step(.47,abs(uv.x))*.5;
    fragColor=vec4(col,1.0);
}

void main() {
    vec4 col;
    mainImage(col, vTexCoord*resolution);
    gl_FragColor = col;
}

