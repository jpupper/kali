let fxrand = ()=>{Math.random()};
let sh;
let loaded = false;

function setup(){
  createCanvas(windowWidth, windowHeight, WEBGL);
  sh = loadShader("base.vert", "shader.frag", ()=>{
    loaded = true;
    shader(sh);
  });
}


function draw() {
  if (!loaded) return;
  rect(0, 0, windowWidth, windowHeight);
}






