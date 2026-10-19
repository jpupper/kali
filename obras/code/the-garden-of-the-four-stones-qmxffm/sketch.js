let w = 800;
let h = 800;
let sha;
let init=false;
let x, y;
let fx, fy;
let colorot;
let invert;
let border;
let scale;
let orbit;

function preload() {
  if (init) return;
  sha = loadShader("base.vert", "shader.frag");
  x = fxrand();
  y = fxrand();
  fx = fxrand();
  fy = fxrand();
  colorot = fxrand();
  invert = fxrand();
  border = fxrand();
  scale = fxrand();
  orbit = fxrand();
}

function setup() {
  //setInterval(function(){window.location.reload()},1000);
  w = windowWidth;
  h = windowHeight;
  //w=800;
  //h=800;
  createCanvas(w, h, WEBGL);
}

window.onload = function() {
  init=true;
  preload();

  window.$fxhashFeatures = {
  };
  console.table(window.$fxhashFeatures);
}


function draw() {
  sha.setUniform("resolution", [w, h]);
  sha.setUniform("time", millis()/1000);
  sha.setUniform("offset", [x, y]);
  sha.setUniform("fractparam", [fx, fy]);
  sha.setUniform("colorot", colorot);
  sha.setUniform("invert", invert);
  sha.setUniform("border", border);
  sha.setUniform("scale", scale);
  sha.setUniform("orbit", orbit);
  shader(sha);
  rect(0,0,w,h);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w,h);
}