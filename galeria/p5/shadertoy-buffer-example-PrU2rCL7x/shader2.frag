precision highp float;

uniform vec2 resolution ;
uniform float time ;
uniform vec2 mouse ;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

varying vec2 vTexCoord;

void main()
{
    vec2 buffer0 = texture2D(iChannel0,vec2(vTexCoord.x,1.-vTexCoord.y)).xy;

    gl_FragColor = texture2D(iChannel1,buffer0);

    //fragColor = vec4(buffer0,0.,0.);
    
}
