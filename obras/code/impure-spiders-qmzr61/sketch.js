let w, h;
let shData;
let shDraw;
let shPost;
let shPost2;
let gfxMain;
let gfxData;
let gfxDraw;
let gfxTemp;
let cnv;
let le;

let eyespos;
let eyescol;
let bodycol;
let brightness;
let pattern;
let fractpattern;
let fractparam;
let headwidth;
let legwidth;
let leglength;
let asssize;
let camheight;
let neon;
let sketch;
let glitch;

let acel = 0;
let rot = 2.8;
let mX = false;
let mousepressed = false;
let start = 0.;
let init = false;

//setInterval(function(){features();}, 3000);

function features() {
  if (init) return;
  init = true;
  eyespos=Math.floor(fxrand()*2.9);
  eyescol=Math.floor(fxrand()*5.9);
  bodycol=Math.floor(fxrand()*7.9);
  //brightness=floor(fxrand()*1.9)*.7+1.;
  brightness=fxrand()>.5?.9:1.4;
  pattern=Math.floor(fxrand()*3.9);
  fractpattern=Math.floor(fxrand()*1.9);
  headwidth=Math.floor(fxrand()*2.9);
  legwidth=fxrand()>.5?1:0.5;
  leglength=Math.floor(fxrand()*2.9);
  asssize=Math.floor(fxrand()*2.99);
  camheight=Math.floor(fxrand()*2.9);
  fractpattern=Math.floor(fxrand()*1.9);
  neon=fxrand()>0.95?1:0;
  sketch=fxrand()>0.9?1:0;
  glitch=fxrand()>0.80?1:0;
  // leglength=1;
  // legwidth=1;
  // asssize=0;
  // brightness=1.4;
  // fractpattern=1;
  // eyescol=1;
  // bodycol=0;
  // headwidth=2;
  // pattern=0;
  // glitch=1;
  // sketch=1;
  // neon=1;
  
  let _eyespos;
  if (eyespos == 0) _eyespos = ".oo.";
  if (eyespos == 1) _eyespos = "'oo'";
  if (eyespos == 2) _eyespos = "o''o";

  let _eyescol;
  if (eyescol == 0) _eyescol = "yellow";
  if (eyescol == 1) _eyescol = "purple";
  if (eyescol == 2) _eyescol = "red";
  if (eyescol == 3) _eyescol = "cyan";
  if (eyescol == 4) _eyescol = "white";
  if (eyescol == 5) _eyescol = "green";

  let _color;
  if (bodycol == 0) _color = "red";
  if (bodycol == 1) _color = "brown";
  if (bodycol == 2) _color = "yellow";
  if (bodycol == 3) _color = "green";
  if (bodycol == 4) _color = "blue";
  if (bodycol == 5) _color = "purple";
  if (bodycol == 6) _color = "black";
  if (bodycol == 7) _color = "gray";
  let _pattern; 
  if (pattern == 0) _pattern = "horizontal stripes";
  if (pattern == 1) _pattern = "sinewave";
  if (pattern == 2) _pattern = "vertical stripes";
  if (pattern == 3) _pattern = "dots";
  if (pattern == 4) _pattern = "gradient";
  let _headsize;
  if (headwidth == 0) _headsize = "large";
  if (headwidth == 1) _headsize = "medium";
  if (headwidth == 2) _headsize = "small";
  let _leglength;
  if (leglength == 0) _leglength = "short";
  if (leglength == 1) _leglength = "medium";
  if (leglength == 2) _leglength = "long";
  let _asssize;
  if (asssize == 2) _asssize = "large";
  if (asssize == 1) _asssize = "medium";
  if (asssize == 0) _asssize = "small";
  let _camheight;
  if (camheight == 2) _camheight = "high";
  if (camheight == 1) _camheight = "medium";
  if (camheight == 0) _camheight = "low";


  window.$fxhashFeatures = {
    "head size": _headsize,
    "ass size": _asssize,
    "leg thickness": legwidth < 1 ? "thin" : "thick",
    "leg length": _leglength,
    "body color": _color,
    "color tone": brightness > 1 ? "light" : "dark",
    "pattern": _pattern,
    "fractalize pattern": fractpattern ? "yes" : "no",
    "eyes pos": _eyespos,
    "eyes color": _eyescol,
    "cam height": _camheight,
    "neon": neon ? _eyescol : "no",
    "sketch": sketch ? "yes" : "no",
    "glitch": glitch ? "yes" : "no",
  };
  if (neon) {
    window.$fxhashFeatures["body color"] = "N/A";
    window.$fxhashFeatures["color tone"] = "N/A";
    window.$fxhashFeatures["pattern"] = "dots";
    window.$fxhashFeatures["fractalize pattern"] = "yes";
  }
  if (sketch) {
    window.$fxhashFeatures["eyes color"] = "N/A";
    window.$fxhashFeatures["body color"] = "N/A";
    window.$fxhashFeatures["color tone"] = "N/A";
  }
  console.log(window.$fxhashFeatures);
}


function preload() {
  features();
  shData = loadShader("base.vert", "shader.frag");
  shDraw = loadShader("base.vert", "shader.frag");
  shPost = loadShader("base.vert", "bloom.frag");
  shPost2 = loadShader("base.vert", "glass.frag");
  //neon=1.;
  //camheight=5;
}

window.onload = features;

function setup() {
  pixelDensity(1);
  w = 800; h = 800;
  cnv = createCanvas(w, h, WEBGL);
  gfxMain = createGraphics(w,h);
  gfxData = createGraphics(w, h, WEBGL);
  gfxDraw = createGraphics(w, h, WEBGL);
  gfxLabel = createGraphics(w, h);
  frameRate(30);
  le = 6 + Math.floor(fxrand() * 4.9);
}

function draw() {

  let t = (millis() - start) / 1000;
  t=max(1.5,t);

  if (mouseIsPressed) {
    acel += (pmouseX - mouseX) * 0.001;
  }
  if (t > 1.5) rot+=acel-.01;
  acel*=.9;

  //t=10;
  gfxMain.background(0);
  randomSeed(10);
  shData.setUniform("resolution", [w, h]);
  shData.setUniform("time", t);
  shData.setUniform("mode", 0);
  shData.setUniform("eyespos", eyespos);
  shData.setUniform("eyescol", eyescol);
  shData.setUniform("bodycol", bodycol);
  shData.setUniform("brightness", brightness);
  shData.setUniform("pattern", pattern);
  shData.setUniform("fractpattern", fractpattern);
  shData.setUniform("headwidth", headwidth);
  shData.setUniform("legwidth", legwidth);
  shData.setUniform("leglength", leglength);
  shData.setUniform("asssize", asssize);
  shData.setUniform("rota", rot);
  shData.setUniform("camheight", camheight);
  shData.setUniform("neon", neon);
  shData.setUniform("sketch", sketch);
  gfxData.shader(shData);
  gfxData.rect(0, 0, w, h);
  gfxData.loadPixels();
  shDraw.setUniform("resolution", [w, h]);
  shDraw.setUniform("time", t);
  shDraw.setUniform("mode", 1);
  shDraw.setUniform("eyespos", eyespos);
  shDraw.setUniform("eyescol", eyescol);
  shDraw.setUniform("bodycol", bodycol);
  shDraw.setUniform("brightness", brightness);
  shDraw.setUniform("pattern", pattern);
  shDraw.setUniform("fractpattern", fractpattern);
  shDraw.setUniform("headwidth", headwidth);
  shDraw.setUniform("legwidth", legwidth);
  shDraw.setUniform("leglength", leglength);
  shDraw.setUniform("asssize", asssize);
  shDraw.setUniform("rota", rot);
  shDraw.setUniform("camheight", camheight);
  shDraw.setUniform("neon", neon);
  shDraw.setUniform("sketch", sketch);
  gfxDraw.shader(shDraw);
  gfxDraw.rect(0, 0, w, h);
  gfxMain.image(gfxDraw, 0, 0);
  gfxMain.noFill();
  gfxMain.stroke(0.3*256);
  gfxMain.rect(35, 35, w - 70, h - 70);
  gfxMain.strokeWeight(1);
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
      gfxMain.stroke(b,50);
      let nx = (r - 128) / 256 * 30;
      let ny = (g - 128) / 256 * 30;
      //let n = createVector(nx, ny);
      //n.rotate(radians(0));
      let xx = x * res + random(res);
      let yy = y * res + random(res);
      if (random() > 0.9) {
        nx *= 1.5;
        ny *= 1.5;
      }
      gfxMain.line (xx, yy, xx + nx, yy + ny);
    }
  }
  label();
  gfxMain.image(gfxLabel, 0, 0);
  shPost.setUniform("tx", gfxMain);
  shPost.setUniform("resolution", [w, h]);
  shPost.setUniform("time", t);
  shPost.setUniform('sketch', sketch);
  shPost.setUniform('glitch', glitch);
  shader(shPost);
  fill(255);
  rect(0,0,w,h);
  shPost2.setUniform('resolution', [w, h]);
  shPost2.setUniform('time', min(100000,millis()));
  shPost2.setUniform('tx', cnv);
  shPost2.setUniform('glitch', glitch);
  shPost2.setUniform('sketch', sketch);
  shader(shPost2);
  rect(0, 0, w, h);
  if (!start) {
    start = millis();
    document.getElementById("loader").style.display = "none";
  }
}


let a = 0;
let ll = 0;
let preview = false;

function label() {
  if (ll>le) {
    if (!preview) fxpreview();
    preview = true;
    return;
  }
  gfxLabel.push();
  //  gfxLabel.translate(-w / 2, -h / 2);
  //gfxLabel.rect(0,0,w,h);
  let pos = 0;
  view_angle = 2 / 8 * 360;
  { pos = 1; gfxLabel.translate(w - 70, 25); }
  
  let col = color(150);
  ll += 0.5;
  for (let l = 0; l < min(le, ll); l++)
  {
    gfxLabel.stroke(0);
    gfxLabel.strokeWeight(4);
    gfxLabel.line(0,8,0,20);
    gfxLabel.line(20,0,20,20);
    gfxLabel.line(0,20,10,20);
    gfxLabel.line(0,0,10,0);
    gfxLabel.line(10,0,20,20);
    gfxLabel.line(0,20,10,10);
    gfxLabel.strokeWeight(3);
    gfxLabel.stroke(col);
    if (fxrand() > 0.3) gfxLabel.line(0,8,0,20);
    if (fxrand() > 0.3) gfxLabel.line(20,0,20,20);
    if (fxrand() > 0.4) gfxLabel.line(0,20,10,20);
    if (fxrand() > 0.4) gfxLabel.line(0,0,10,0);
    if (fxrand() > 0.5) gfxLabel.line(10,0,20,20);
    if (fxrand() > 0.5) gfxLabel.line(0,20,10,10);
    gfxLabel.stroke(0.2*256, 0.2*256);
    gfxLabel.line(10, 30, 10, 40);
    gfxLabel.line(10, -20, 10, -10);
    gfxLabel.translate(pos ? -30 : 30, 0);
  }
  gfxLabel.pop();
}
