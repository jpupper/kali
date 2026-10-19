let w, h;
let shData;
let shDraw;
let shPost;
let gfxMain;
let gfxData;
let gfxDraw;
let gfxTemp;
let cnv;



function preload() {
  shData = loadShader("base.vert", "shader.frag");
  shDraw = loadShader("base.vert", "shader.frag");
  shPost = loadShader("base.vert", "bloom.frag");
}

function setup() {
  pixelDensity(1);
  w = windowWidth; h = windowHeight;
  w = 800; h = 800;
  cnv = createCanvas(w, h, WEBGL);
  gfxMain = createGraphics(w,h);
  gfxData = createGraphics(w, h, WEBGL);
  gfxDraw = createGraphics(w, h, WEBGL);
  frameRate(30);
}

function draw() {
  let t = millis() / 1000;
  //t=10;
  gfxMain.background(50);
  randomSeed(10);
  shData.setUniform("resolution", [w, h]);
  shData.setUniform("time", t);
  shData.setUniform("mode", 0);
  gfxData.shader(shData);
  gfxData.rect(0, 0, w, h);
  gfxData.loadPixels();
  shDraw.setUniform("resolution", [w, h]);
  shDraw.setUniform("time", t);
  shDraw.setUniform("mode", 1);
  gfxDraw.shader(shDraw);
  gfxDraw.rect(0, 0, w, h);
  gfxMain.image(gfxDraw, 0, 0);
  gfxMain.noFill();
  gfxMain.strokeWeight(2);
  gfxMain.stroke(0);
  let res = 4;
  let total = (w / res) * (h / res);
  for (let i = 0; i < total; i++) {
    let x = i % (w / res);
    let y = floor(i / (w / res));
    let p = x * res + y * res * w;
    let r = gfxData.pixels[p * 4];
    let g = gfxData.pixels[p * 4 + 1];
    let b = gfxData.pixels[p * 4 + 2];
    if (r+g > 0) {
      gfxMain.stroke(b,40);
      let nx = (r - 128) / 256 * 30;
      let ny = (g - 128) / 256 * 30;
      let n = createVector(nx, ny);
      n.rotate(radians(0));
      let xx = x * res + (random(res / 1) - res / 2);
      let yy = y * res + (random(res / 1) - res / 2);
      gfxMain.line (xx, yy, xx + n.x, yy + n.y);
      //gfxMain.rect(xx, yy, n.x, n.y);
    }
  }
  shader(shPost);
  shPost.setUniform("tx", gfxMain);
  shPost.setUniform("resolution", [w, h]);
  shPost.setUniform("time", t);
  fill(255);
  rect(0,0,w,h);
}