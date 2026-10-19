/*
 * @name Shader as a Texture
 * @description Shaders can be applied to 2D/3D shapes as textures.
 * <br> To learn more about using shaders in p5.js: <a href="https://itp-xstory.github.io/p5js-shaders/">p5.js Shaders</a>
 */

 // this variable will hold our shader object
 let theShader;
 // this variable will hold our createGraphics layer
 let fxrand;

 function preload(){
   theShader = loadShader('assets/texture.vert','assets/texture.frag');
   fxrand=random();
 }

 function setup() {
   createCanvas(windowWidth, windowHeight, WEBGL);
 }

 function draw() {
   shader(theShader);
   theShader.setUniform("resolution", [windowWidth, windowHeight]);
   theShader.setUniform("time", millis() / 1000.0);
   theShader.setUniform("fxrand", fxrand);
   rect(0, 0, windowWidth, windowHeight);
 }
