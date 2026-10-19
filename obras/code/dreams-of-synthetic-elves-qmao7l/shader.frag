precision mediump float;
uniform sampler2D tx;
uniform vec2 mouse;
uniform bool mousepressed;
uniform vec2 resolution;
uniform float time;

uniform bool polar;
uniform float r;
uniform float g;
uniform float b;
uniform float p0;
uniform float p1;
uniform float p2;
uniform float p3;
uniform float p4;
uniform float p5;
uniform float p6;
uniform float p7;
uniform float p8;
uniform float p9;

mat2 rot(float a) {
    float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
}

float hash(vec2 p)
{
    p*=100.;
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 fractal(vec2 p) {
    p*=.5+p3;
    p*=rot(time*.05);
    if (polar) p=vec2(fract(atan(p.x,p.y)*(.5-.4*p0))*(.5+p1),max(.1+p8*.1,.6-length(p))*(1.+p4*8.));
    float m1=1000.;
    float it;
    for (int i=0; i<7; i++) {
        if (float(i)>time*3.-1.) break;
        p=abs(p)/clamp(abs(p.x*p.y),p8*.3,2.)-1.-p9*.5;
        float m=abs(p.x)+step(.5,fract(sign(p.x)*p.y*.25+time*.3+float(i)*.2))*.1;
        m1=min(m1,m);
        if (m1==m) it=float(i);
    }
    float s = smoothstep(.1,.09,m1);
    m1=exp(-20.*m1);
    vec3 c=vec3(3.,0.,0.)*m1+s*.5;
    c.rb*=rot(p3*3.);
    c=abs(c);
    c.rb*=rot(it*p5*.4);
    c.rg*=rot(it*p6*.4);
    c.bg*=rot(it*p7*.4);
    c=abs(c*exp(-.2*it));
    c=mix(vec3(length(c))*.4,c,.7);
    return c*.9+vec3(r,g,b)*.15;
}


varying vec2 vTexCoord;

void main(){
    vec2 uv=vTexCoord-.5;
    uv.x*=resolution.x/resolution.y;
    vec2 uv2=uv;
    uv-=mouse;
    if (mousepressed) uv*=.3+.7*smoothstep(.15,.2,distance(mouse,uv2));
    uv+=mouse;
    uv.x*=1.-uv.y*uv.y*1.5;
    vec3 col=vec3(0.);
    for (float i=-2.; i<2.; i++) {
        for (float j=-2.; j<2.; j++) {
            vec2 d=vec2(i,j)/resolution/4.;
            col+=fractal(uv+d);//*mod(gl_FragCoord.y,3.)*.7;
        }        
    }
    col/=16.;
    gl_FragColor = vec4(col, 1.);
}
