let w = 800;
let h = 800;
let sha;
let bloom;
let init=false;
let gfx;
let cnv;

let polar;
let par0;
let par1;
let par2;
let par3;
let par4;
let par5;
let par6;
let par7;
let par8;
let par9;

let r,g,b;

function preload() {
  if (init) return;
  polar=fxrand()>.1;
  par0=fxrand();
  par1=fxrand();
  par2=fxrand();
  par3=fxrand();
  par4=fxrand();
  par5=fxrand();
  par6=fxrand();
  par7=fxrand();
  par8=fxrand();
  par9=fxrand();
  r=fxrand();
  g=fxrand();
  b=fxrand();
  sha = loadShader("base.vert", "shader.frag");
  bloom = loadShader("base.vert", "bloom.frag");
}

function setup() {
  //setInterval(function(){window.location.reload()},1000);
  w = windowWidth;
  h = windowHeight;
  cnv = createCanvas(w, h, WEBGL);
  gfx = createGraphics(w, h, WEBGL);
}

window.onload = function() {
  preload();
  init=true;
}

function draw() {
  sha.setUniform("resolution", [w, h]);
  sha.setUniform("time", millis()/1000);
  sha.setUniform("mouse", [(mouseX/w-.5)*w/h,-mouseY/h+.5]);
  sha.setUniform("mousepressed", mouseIsPressed);
  sha.setUniform("polar", polar);
  sha.setUniform("r", r);
  sha.setUniform("g", g);
  sha.setUniform("b", b);
  sha.setUniform("p0", par0);
  sha.setUniform("p1", par1);
  sha.setUniform("p2", par2);
  sha.setUniform("p3", par3);
  sha.setUniform("p4", par4);
  sha.setUniform("p5", par5);
  sha.setUniform("p6", par6);
  sha.setUniform("p7", par7);
  sha.setUniform("p8", par8);
  sha.setUniform("p9", par9);
  shader(sha);
  rect(0,0,w,h);
  bloom.setUniform("resolution", [w, h]);
  bloom.setUniform("time", millis()/1000 % 100);
  bloom.setUniform("tx", cnv);
  shader(bloom);
  rect(0,0,w,h);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w,h);
}