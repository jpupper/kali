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
  fx = fxrand();
}


function setup() {
  w=windowWidth;h=windowHeight;
//  w=833;h=833;
  cnv = createCanvas(w, h);
  res = createGraphics(w, h, WEBGL);
  gfx = createGraphics(w,h);
}

let i=0;
let c=0;

function draw() {
  if (mouseIsPressed) {
    acelx += (pmouseX - mouseX) * 0.0005;
    acely += (pmouseY - mouseY) * 0.0005;
  }
  rotx+=acelx;
  roty+=acely;
  acelx*=.9;
  acely*=.9;
  //rot*=.9;
  i++;
  //if(millis()/1000>10) window.location.reload();
  sh.setUniform("fxrand", fxrand);
  sh.setUniform("subframe", i);
  sh.setUniform("time", millis()/1000);
  sh.setUniform("resolution", [w,h]);
  sh.setUniform("fxrand", fx);
  sh.setUniform("rotax", rotx);
  sh.setUniform("rotay", roty);
  res.shader(sh);
  res.rect(0,0,width,height);
  //gfx.tint(255,70);
  gfx.image(res,0,0);
  //drawShader();


  bl.setUniform("resolution", [w,h]);
  bl.setUniform("time", millis()/1000);
  bl.setUniform("tx", gfx);
  res.shader(bl);
  res.rect(0,0,width,height);
  image(res,0,0);

  if (save) {
    saveCanvas(`Light_Matter_${width}x${height}.png`);
    w = windowWidth;
    h = windowHeight;
    resizeCanvas(w, h);
    gfx.resizeCanvas(w, h);
    save = false;
  }
//  noLoop();
}

function windowResized() {
  w=windowWidth;h=windowHeight;
  resizeCanvas(w,h);
  res.resizeCanvas(w,h);
  gfx.resizeCanvas(w, h);
}


function keyPressed() {
  if (key.toLowerCase() == "s") {
    w = 1920 * 2;
    h = 1080 * 2;
    resizeCanvas(w, h);
    gfx.resizeCanvas(w, h);
    save=true;
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