let cnv;
let sh;
let bl;
let save=false;
let acel = 0;
let rot = 0;
let fx;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
  bl = loadShader("base.vert", "post.frag");
  fx = fxrand();
}


function setup() {
  w=windowWidth;h=windowHeight;
//  w=833;h=833;
  cnv = createCanvas(w, h, WEBGL);
  gfx = createGraphics(w,h);
}

let i=0;
let c=0;

function draw() {
  if (mouseIsPressed) {
    acel += (pmouseX - mouseX) * 0.0005;
  }
  rot+=acel;
  acel*=.9;
  //rot*=.9;
  i++;
  //if(millis()/1000>10) window.location.reload();
  sh.setUniform("fxrand", fxrand);
  sh.setUniform("subframe", i);
  sh.setUniform("time", millis()/1000);
  sh.setUniform("resolution", [w,h]);
  sh.setUniform("fxrand", fx);
  sh.setUniform("rota", rot);
  shader(sh);
  rect(0,0,width,height);
  gfx.image(cnv,0,0);
  bl.setUniform("resolution", [w,h]);
  bl.setUniform("time", millis()/1000);
  bl.setUniform("tx", gfx);
  shader(bl);
  rect(0,0,width,height);
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
