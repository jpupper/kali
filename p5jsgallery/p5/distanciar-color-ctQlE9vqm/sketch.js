function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  let col = color(255,100,0);
  col=distanciarColor(col,100);
  fill(col);
  rect(random(0,width),random(0,height),random(0,width),random(0,height));
}


function distanciarColor(col, dist) {
  let rnd1 = fxrand();
  let rnd2 = fxrand();
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
  return color(r + v1, g + v2, b + v3, a)  
}