let simpleShader;
let gx;

function preload(){
  simpleShader = loadShader('basic.vert', 'basic.frag');
}

function setup() {
  createCanvas(500, 500);
  gx=createGraphics(500,500,WEBGL);
}

function draw() {  
  fill(0,100,100);
  rect(0,0,250,250);
  gx.shader(simpleShader);

  // rect gives us some geometry on the screen
  gx.rect(0,0,500, 500);
  image(gx,0,0);
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}