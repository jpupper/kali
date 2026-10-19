#define brushSize 0.1


precision highp float;

uniform vec2 resolution ;
uniform float time ;
uniform vec4 iMouse ;
uniform int iFrame;
uniform sampler2D iChannel0;

varying vec2 vTexCoord;



void mainImage( out vec4 fragColor, vec2 fragCoord )
{
    fragCoord.y=resolution.y-fragCoord.y;
    vec4 buffer = texture2D(iChannel0, vec2(0));     

    if( fragCoord  == vec2(.5) ) fragColor = iMouse;                              
    else if(iFrame<1 ) fragColor = (fragCoord/resolution).xyxy;
    else {
        float circle = exp( -length(iMouse.xy-fragCoord )*brushSize );    
        if ( buffer.w*iMouse.w > 0. )                      
          fragCoord  -= circle * (iMouse-buffer).xy;
      
        fragColor = texture2D(iChannel0, fragCoord  / resolution );  
    }
}

void main(){
  vec4 fragColor=vec4(0);
  mainImage(fragColor, floor(vTexCoord*resolution));
  gl_FragColor = fragColor;
}