let cnv, sh, mX, mY, fx;

function preload() {
  sh = loadShader("base.vert", "fragment.glsl");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  mX = 0;
  mY = 0;
  fx = random();
}

function draw() {
  noStroke(),
  shader(sh);
  sh.setUniform("resolution", [width, height]);
  sh.setUniform("time", millis()/1000);
  sh.setUniform("mouse", [mX, -mY]);
  sh.setUniform("random", fx);
  sh.setUniform("prevframe", cnv)
  if (mouseIsPressed) { mX = mouseX/width-.5; mY = mouseY/height-.5; }
  rect(0,0,width,height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}