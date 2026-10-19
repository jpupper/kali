let sh;
let w;
let h;
let on = 1;
function preload() {
  sh=loadShader("base.vert", "shader.frag");
}

function setup() {
  w=windowWidth;
  h=windowHeight;
  createCanvas(w, h, WEBGL);
}

function draw() {
  shader(sh);
  sh.setUniform("iTime", millis()/1000);
  sh.setUniform("iResolution", [w,h]);
  sh.setUniform("on", on);
  rect(0,0,w,h);
}

function mousePressed() {
  if (on==0) on = 1;
  else on = 0;
}

function windowResized() {
  w=windowWidth;
  h=windowHeight;
  resizeCanvas(w,h);
}