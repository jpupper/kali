let w = 800;
let h = 800;
let sha;
let init=false;
let gfx;
let cnv;

let par0;

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
  sha.setUniform("r", r);
  sha.setUniform("g", g);
  sha.setUniform("b", b);
  sha.setUniform("p0", par0);
  shader(sha);
  rect(0,0,w,h);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w,h);
}