let rnd1, rnd2;

function setup() {
  createCanvas(windowWidth, windowHeight);
}
let listo=false;
function draw() {
  stroke(0,0);
  fill(255,100);
  if (listo) return;
  listo=true;
  translate(windowWidth/2,windowHeight/2);
  background(120);
  let prim = new Primitive();
  prim.draw(createVector(0,0), .7, 1, 1., -150, 1, 10);
}

class Primitive 
{
  constructor() {
  } 
  draw(p, scalar, sc, angle, offset, iteration, maxiterations) {
    rnd1=random();
    rnd2=random();
    angle*=.9+rnd1*.2;
    if (iteration>maxiterations) return;
    circle(p.x,p.y,offset*sc);
    p.add(0,offset);
    p.rotate(angle);
    let clone1 = new Primitive()
    clone1.draw(p.copy().mult(scalar), scalar, sc*scalar, angle, offset, iteration + 1, maxiterations);
    angle*=.9+rnd2*.2;
    p.rotate(-angle*2);
    let clone2 = new Primitive()
    clone2.draw(p.copy().mult(scalar), scalar, sc*scalar, angle, offset, iteration + 1, maxiterations);
  }
}