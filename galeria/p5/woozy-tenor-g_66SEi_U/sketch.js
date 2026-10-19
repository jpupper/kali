function setup() {
  createCanvas(800, 800, WEBGL);
}
function draw() {
  let locX = mouseX - height / 2;
  let locY = mouseY - width / 2;
  ambientLight(60, 60, 60);
  pointLight(255, 255, 255, locX, locY, 100);
  background(0);
  noStroke();
  ambientLight(100);
  normalMaterial(130, 230, 0);
  sphere(200);
}