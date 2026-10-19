let w, h;
let sh;
let gfxNormals;

function preload() {
  shNorm = loadShader("base.vert", "shader.frag");
  shDraw = loadShader("base.vert", "shader.frag");
}

function setup() {
  w = windowWidth; h = windowHeight;
  w = 800; h = 800;
  createCanvas(w,h);
  gfx1 = createGraphics(w, h, WEBGL);
  
}

function draw() {
  background(100);
  randomSeed(10);
  gfx1.shader(shNorm);
  shNorm.setUniform("resolution", [w, h]);
  shNorm.setUniform("time", millis()/1000);
  gfx1.rect(0, 0, w, h);
  gfx1.loadPixels();
  tint(255,50);
  //image(gfx1, 0, 0);
  strokeWeight(3);
  stroke(0,50);
  let res = 8;
  let total = w * h / res;
  for (let i = 0; i < total; i++) {
    let x = i % (w / res);
    let y = floor(i / (w / res));
    let p = x * res + y * res * w;
    let r = gfx1.pixels[p * 4];
    let g = gfx1.pixels[p * 4 + 1];
    let b = gfx1.pixels[p * 4 + 2];
    //fill(r, g, b);
    if (r+g+b > 0) {
//      circle(x * res, y * res, res);
    }
    if (r+g+b > 0) {
      let nx = (r - 128) / 256 * 50;
      let ny = (g - 128) / 256 * 50;
      let n = createVector(nx, ny);
      n.rotate(radians(60));
      let xx = x * res + random(5);
      let yy = y * res + random(5);
      line (xx, yy, xx + n.x, yy + n.y);
    }
  }
}