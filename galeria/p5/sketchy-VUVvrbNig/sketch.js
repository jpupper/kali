 let theShader;
 let drw,cnv,gfx;

 function preload(){
   theShader = loadShader('assets/texture.vert','assets/texture.frag');
   fxrand=random();
 }

 function setup() {
   cnv=createCanvas(windowWidth, windowHeight);
   gfx=createGraphics(windowWidth, windowHeight, WEBGL);
   drw=createGraphics(windowWidth, windowHeight);
 }

 function draw() {
   background(0);
   drw.stroke(255);
   drw.fill(23,154,234);
   drw.circle(500,500,300);
   theShader.setUniform("resolution", [windowWidth, windowHeight]);
   theShader.setUniform("time", millis() / 1000.0);
   theShader.setUniform("tx", drw);
   gfx.shader(theShader);
   gfx.rect(0, 0, windowWidth, windowHeight);
   image(gfx,0,0);
 }
