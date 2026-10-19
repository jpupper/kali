function preload() {
  sh = loadShader("base.vert", "shader.frag");
  img = loadImage("martin1.jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  rnd = random();
}

function draw() {
  shader(sh);
  sh.setUniform("resolution", [width, height]);
  sh.setUniform("rnd", rnd);
  sh.setUniform("tx", img);
  rect(0,0,width,height);
}