let sh;
let w, h;
let frame;
let offsetX;
let density;
let colorScale;
let colorOffset;
let fog;
let grayscale;
let colorvariation;
let fov;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
  frame = fxrand() * 500;
  offsetX = fxrand() * 80 - 40;
  density = fxrand() * 0.4 + 0.5;
  colorScale = fxrand() * 4 - 2;
  colorOffset = fxrand() - 0.5;
  fog = fxrand() * 0.002 + 0.003;
  grayscale = fxrand() > 0.85;
  colorvariation = fxrand() > 0.7 ? 0.5 : 0.;
  fov = fxrand() * 0.5 + 0.7; 
  //fov = 0.7;
}

function setup() {
  w = windowWidth;
  h = windowHeight;
 // w=800;
 // h=800;
  createCanvas(w, h, WEBGL);
  frameRate(15);
}

function draw() {
  sh.setUniform("resolution", [w, h]);
  sh.setUniform("time", millis() / 1000);
  sh.setUniform("frame", frame);
  sh.setUniform("offsetX", offsetX);
  sh.setUniform("density", density);
  sh.setUniform("colorScale", colorScale);
  sh.setUniform("colorOffset", colorOffset);
  sh.setUniform("fogforce", fog);
  sh.setUniform("grayscale", grayscale);
  sh.setUniform("colorvariation", colorvariation);
  sh.setUniform("fov", fov);
  shader(sh);
  rect(0, 0, w, h);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
}