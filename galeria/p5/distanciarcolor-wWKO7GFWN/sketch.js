let rnd1, rnd2;
let col;

function setup() {
  createCanvas(800, 400);
  col = color(random(255), random(255), random(255));
}

function draw() {
  randomSeed(floor(millis()*.005));
  background(col);
  noStroke();
  for (let i= 0; i<40; i++) {
    let ncol = distanciarColor(col, 100);
    fill(ncol);
    rect(i*20, 0, 20, 300);
  }
}



function distanciarColor(col, dist) {
  let rnd1 = random();
  let rnd2 = random();
  let v1 = dist * rnd1;
  let v2 = dist * (1-rnd1);
  let v3 = (v1 + v2) * rnd2;
  v1 *= 1 - rnd2;
  v2 *= 1 - rnd2;
  v1 -= dist / 2;
  v2 -= dist / 2;
  v3 -= dist / 2;
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  let a = alpha(col);
//  console.log(v1,v2,v3);
  return color(r + v1, g + v2, b + v3, a)  
}