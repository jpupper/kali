let cnv,res,gfx;
let sh;
let bl;
let save=false;
let acelx = 0;
let acely = 0;
let rotx = 0;
let roty = 0;
let fx;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
  bl = loadShader("base.vert", "post.frag");
  fx = $fx.rand();
}


function setup() {
  w=windowWidth;h=windowHeight;
  cnv = createCanvas(w, h);
  res = createGraphics(w*1.5, h*1.5, WEBGL);
  gfx = createGraphics(w*1.5,h*1.5);
}

let i=0;
let c=0;

function draw() {
  i++;
  if (i>10 && $fx.context == "preview") {
    $fx.preview();
    noLoop();
  }
  sh.setUniform("subframe", i);
  sh.setUniform("time", i/60);
  sh.setUniform("resolution", [w*1.5,h*1.5]);
  sh.setUniform("fxrand", fx);
  res.shader(sh);
  res.rect(0,0,width,height);
  gfx.image(res,0,0);
  bl.setUniform("fxrand", fx);
  bl.setUniform("resolution", [w*1.5,h*1.5]);
  bl.setUniform("time", millis()/1000);
  bl.setUniform("tx", gfx);
  res.shader(bl);
  res.rect(0,0,width,height);
  scale(.75);
  image(res,0,0);
}

function windowResized() {
  w=windowWidth;h=windowHeight;
  resizeCanvas(w*1.5,h*1.5);
  res.resizeCanvas(w*1.5,h*1.5);
  gfx.resizeCanvas(w*1.5, h*1.5);
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
