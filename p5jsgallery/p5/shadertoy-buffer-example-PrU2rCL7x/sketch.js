
 let fxrand;
 let sh1;
 let sh2;
 let gfx1;
 let gfx2;
 let cnv;


 function preload(){
   sh1 = loadShader('assets/texture.vert','assets/shader1.frag');
   sh2 = loadShader('assets/texture.vert','assets/shader2.frag');
   img = loadImage('assets/image.png');
 }

 function setup() {
   cnv = createCanvas(windowWidth, windowHeight);
   gfx1 = createGraphics(width, height, WEBGL);
   gfx2 = createGraphics(width, height, WEBGL);
 }

 let f=-1;

 function draw() {
   f++;
   gfx1.shader(sh1);
   sh1.setUniform("iChannel0", gfx2);
   sh1.setUniform("resolution", [width, height]);
   sh1.setUniform("iFrame", f);
   sh1.setUniform("iMouse", [mouseX, mouseY, mouseIsPressed?mouseX:0, mouseIsPressed?mouseY:0]);
   gfx1.rect(0, 0, width, height);
   gfx2.shader(sh2);
   sh2.setUniform("iChannel0", gfx1);
   sh2.setUniform("iChannel1", img);
   sh2.setUniform("resolution", [width, height]);
   sh2.setUniform("iFrame", f);
   gfx2.rect(0, 0, width, height);
   image(gfx2,0,0);
 }
