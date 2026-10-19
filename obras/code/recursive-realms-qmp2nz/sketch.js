let cnv,res,gfx;
let sh;
let bl;
let save=false;
let acelx = 0;
let acely = 0;
let rotx = 0;
let roty = 0;
let fx;
let w, h;
let anima=false;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
  fx = fxrand();
}


function setup() {
  pixelDensity(1);
  w=windowWidth;h=windowHeight;
  //w=833;h=833;
  cnv = createCanvas(w, h, WEBGL);
  res = createGraphics(w, h, WEBGL);
  fxrand = fxrand();
}

let i=0;
let c=0;

function draw() {
  stroke(0,0);
  if (anima) i++;
  else i+=.01;
  shader(sh);
  sh.setUniform("fxrand", fxrand);
  sh.setUniform("iTime", i/30);
  sh.setUniform("iResolution", [w,h]);
  sh.setUniform("iChannel0", cnv);
  rect(0,0,w,h);

//  noLoop();
}

function windowResized() {
  w=windowWidth;h=windowHeight;
  resizeCanvas(w,h);
}


function keyPressed() {
  if (key.toLowerCase() == "a") {
    anima = !anima;
    i=0.;
  };
}


function drawShader() {
  gfx.loadPixels(); 
  gfx.noFill();
  gfx.strokeWeight(1);
  gfx.stroke(255,20);
  let res = 30;
  let tot = (w  / res) * (h  / res);
  for (let i = 0; i < tot; i++) {
    let x = i % (w / res);
    let y = floor(i / (w / res));
    let p = x * res + y * res * w;
    let nx = gfx.pixels[p * 4] - 128;
    let ny = gfx.pixels[p * 4 + 1] - 128;
    let l = gfx.pixels[p * 4 + 2] - 128;
    let d = gfx.pixels[p * 4 + 3];
    d = d / 255;    
    let n = createVector(nx, ny);
    n.normalize();
    let s = res * 0.5;
    n.rotate(radians(90));
    x *= res; y *= res;
    y = h - y;
    //x += random(res);
    //y += random(res);
    gfx.line(x - n.x * s, y + n.y * s, x + n.x * s, y - n.y * s);      
    //if (l>0) gfxDraw.circle(x, y, res);      
  }
}