function setup() {
  createCanvas(800, 800);
}

function draw() {
  //translate(400,400);
  //background(220);
  fill(0);
  let s=1.3;
  let z=5000;
  for (let j=0; j<1000; j++) {
    let x=(random()-.5);
    let y=(random()-.5);
    let p=createVector(x,y);
    let mx=1000, my=1000;
    for (let i=0; i<10; i++){
      p.set(abs(p.x),abs(p.y)); 
      p.rotate(1.);
      p.mult(s);
      p.add(-.5,-.5);
      mx=min(abs(p.x),mx);
      my=min(abs(p.y),my);
    }
    point(mx*z,my*z);
  }
}