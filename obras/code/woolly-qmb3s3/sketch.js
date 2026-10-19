let w, h;
let shData;
let shDraw;
let gfxData;
let gfxDraw;
let o1x, o1y;
let o2x, o2y;
let color1;
let color2;
let amplitude;
let angle_xz;
let br,bg,bb;
let r1,r2,r3,r4;
let colball1;
let colball2;
let colball3;
let colball4;
let pattern;
let camheight;
let invert;
let shape;
let bw;

function preload() {
  shData = loadShader("base.vert", "shader.frag");
  shDraw = loadShader("base.vert", "bloom.frag");
}

function setup() {
  pixelDensity(1);
  w = windowWidth; h = windowHeight;
  w = 700; h = 700;
  cnv = createCanvas(w, h, WEBGL);
  gfxMain = createGraphics(w, h);
  gfxData = createGraphics(w, h, WEBGL);
  gfxDraw = createGraphics(w, h);
  frameRate(30);
  o1x= (fxrand() - .5) * 50;
  o1y= (fxrand() - .5) * 50;
  o2x= (fxrand() - .5) * 50;
  o2y= (fxrand() - .5) * 50;
  let r = fxrand() * 100;
  let g = fxrand() * 100;
  let b = fxrand() * 100;
  color1 = color(150+r,150+g,150+b);
  color2 = distanciarColor(color(30 + r, 30 + g / 2, 30 + b / 2), 50);
  amplitude = 0.5 + fxrand() * 0.8;
  angle_xz = fxrand() * 3.1416 * 2;
  br = fxrand() * 20 + 5;
  bg = fxrand() * 20 + 5;
  bb = fxrand() * 20 + 5;
  r1 = Math.floor(fxrand() * 3.9) + 1.5;
  r2 = Math.floor(fxrand() * 3.9) + 1.5;
  r3 = Math.floor(fxrand() * 3.9) + 1.5;
  r4 = Math.floor(fxrand() * 3.9) + 1.5;
  if (r1 == 1.5) r1 = 0;
  if (r2 == 1.5) r2 = 0;
  if (r3 == 1.5) r3 = 0;
  if (r4 == 1.5) r4 = 0;
  if (r1 + r2 + r3 + r4 == 0) r1 = 6.;
  colball1 = color(255, 50, 50);
  colball2 = color(50, 255, 50);
  colball3 = color(50, 50, 255);
  colball4 = color(170, 170, 50);
  colball1 = distanciarColor(colball1,150);
  colball2 = distanciarColor(colball2,150);
  colball3 = distanciarColor(colball3,150);
  colball4 = distanciarColor(colball4,150);
  pattern = Math.floor(fxrand() * 7.9);
  //pattern=4;
  camheight = Math.floor(fxrand() * 3.9);
  invert = fxrand() > 0.9 ? 1 : 0;
  shape = fxrand() > 0.85 ? 1 : 0;
  bw = fxrand() > 0.9 ? 1 : 0;
  bw=0;
  //invert=0;
}

let lt;
let fr = 0;
let df;
function draw() {
  fr++;
  //randomSeed(10);
  gfxDraw.background(br,bg,bb);
  let t = millis()/1000;
  let df = t - lt;
  lt = t;
  if (fr % 10 == 0) {
//    document.getElementById("fps").innerHTML = floor(1/df);
  }
  //shDraw.setUniform("resolution", [w, h]);
  //shDraw.setUniform("time", t);
  //shDraw.setUniform("mode", 1);
  //gfxDraw.shader(shDraw);
  //gfxDraw.rect(0, 0, w, h);
  shData.setUniform("resolution", [w, h]);
  shData.setUniform("time", t);
  shData.setUniform("mode", 0);
  shData.setUniform("onda1", [o1x, o1y]);
  shData.setUniform("onda2", [o2x, o2y]);
  shData.setUniform("amplitude", amplitude);
  shData.setUniform("angle_xz", angle_xz);
  shData.setUniform("r1", r1);
  shData.setUniform("r2", r2);
  shData.setUniform("r3", r3);
  shData.setUniform("r4", r4);
  shData.setUniform("pattern", pattern);
  shData.setUniform("camheight", camheight);
  shData.setUniform("shape", shape);
  gfxData.shader(shData);
  gfxData.rect(0, 0, w, h);
  gfxData.loadPixels();
  //tint(255,100);
  //image(gfxData, 0, 0);
  //background(0, 150);
  //stroke(255,100);
  gfxDraw.strokeWeight(1.);
  let res = 8;
  let tot = (w  / res) * (h  / res);
  for (let i = 0; i < tot; i++) {
    let x = i % (w / res);
    let y = floor(i / (w / res));
    let p = x * res + y * res * w;
    let nx = gfxData.pixels[p * 4] - 128;
    let ny = gfxData.pixels[p * 4 + 1] - 128;
    let l = gfxData.pixels[p * 4 + 2];
    let d = gfxData.pixels[p * 4 + 3];
    d = d / 255;    
    let col = color1;
    if (d > 0.45) col=color2;
    if (d > 0.55) col=colball1;
    if (d > 0.65) col=colball2;
    if (d > 0.75) col=colball3;
    if (d > 0.85) col=colball4;
    col.setAlpha(l);
    gfxDraw.stroke(col);
    gfxDraw.noFill();
    let n = createVector(nx, ny);
    n.normalize();
    let s = res * 2.;
    n.rotate(radians(90));
    x *= res; y *= res;
    y = h - y;
    x += random(res);
    y += random(res);
    if (l>0) gfxDraw.line(x - n.x * s, y + n.y * s, x + n.x * s, y - n.y * s);      
    //if (l>0) gfxDraw.circle(x, y, res);      
  }
  shDraw.setUniform("resolution", [w, h]);
  shDraw.setUniform("time", t);
  shDraw.setUniform("invert", invert);
  shDraw.setUniform("bw", bw);
  shDraw.setUniform("tx", gfxDraw);
  shader(shDraw);  
  rect(0,0,w,h);
}


function distanciarColor(col, dist) {
  let rnd1 = fxrand();
  let rnd2 = fxrand();
  let v1 = dist * rnd1;
  let v2 = dist * (1-rnd1);
  let v3 = (v1 + v2) * rnd2;
  v1 *= 1 - rnd2;
  v2 *= 1 - rnd2;
  //v1 -= dist / 2;
  //v2 -= dist / 2;
  //v3 -= dist / 2;
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  let a = alpha(col);
//  console.log(v1,v2,v3);
  return color(r + v1, g + v2, b + v3, a)  
}