let camShader;
let cam;
let canvas;

function preload(){

  camShader = loadShader('effect.vert', 'effect.frag');
}

function setup() {
  createCanvas(500, 500, WEBGL);
  noStroke();
  cam = createCapture(VIDEO);
  cam.size(500, 500);
  cam.hide();

}

function draw() {  
  shader(camShader);
  camShader.setUniform('tex0', cam);
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}