let w = 800;
let h = 800;
let sha;
let gla;
let init=false;
let gfx;
let cnv;

let par0;
let rotaluz;

let r,g,b;

function preload() {
  if (init) return;
  polar=fxrand()>.1;
  par0=fxrand();
  r=fxrand();
  g=fxrand();
  b=fxrand();
  sha = loadShader("base.vert", "shader.frag");
  gla = loadShader("base.vert", "glass.frag");
  rotaluz = fxrand() * 120 - 60;
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
  sha.setUniform("fxrand", par0);
  gfx.shader(sha);
  gfx.rect(0,0,w,h);
  gla.setUniform("resolution", [w, h]);
  gla.setUniform("tx", gfx);
  gla.setUniform("rotaluz", rotaluz);
  shader(gla);
  rect(0,0,w,h);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  gfx.resizeCanvas(w,h);
  resizeCanvas(w,h);
}