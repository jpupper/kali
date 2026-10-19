let det = 0.01;
let maxdist = 80;
let ldir;
let colo;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 1);
  background(0.5);
  ldir = createVector(2, -1.5, -1);
  ldir.normalize();
}

function draw() {
  //noFill();
  strokeWeight(2);
  stroke(0, 0.1);
  //noStroke();
  translate(windowWidth/2, windowHeight/2);
  let aspect = windowWidth / windowHeight;
  for (let i = 0; i < 300; i++) {
    let uv = createVector(random() - 0.5, random() - 0.5);
    let from = createVector(0, -20, -30);
    let dir = createVector(uv.x * aspect, uv.y, 1);
    dir.y += .4;
    dir.x -= .1;
    dir.normalize();
    let col = march(from, dir);
    fill(col);
    circle(uv.x * windowWidth, uv.y * windowHeight, 5);
    //a = createVector(uv.x * windowWidth, uv.y * windowHeight);
    //push();
    //translate(a.x, a.y);
    //rotate(i);
    //line(0,0,20, 20);
    //pop();
  }
}

function de3(p2) {
  let p = p2.copy();
  let pxz = createVector(p.x, p.z);
  pxz.rotate(millis()*.0001);
  p.set(abs(pxz.x), abs(p.y), abs(pxz.y));
  //p.sub(5,5,5);
  let d = p.mag() - 8;
  d -= createVector(sin(p.x), sin(p.y), sin(p.z)).mag() * 2;
  return d * .5;
}


function hash(p2) {
  let p = p2.copy();
  let r = p5.Vector.dot(p, createVector(12.9898, 78.233));
  return fract(sin(r) * 43758.5453);
}

function de(p2) {
  let p = p2.copy();
  let a = atan2(p.x, p.z);
  let l = createVector(p.x,p.z).mag();
  p.sub(0, l * 0.2 + sin(a * 7) * l*l * 0.005, 0);
  //p.add(sin(p.y), 0, 0);
  let pxy = createVector(p.x, p.y);
  pxy.rotate(p.y * 0.01);
  //p.set((pxz.x % 4) + 2, p.y, (pxz.y % 4) + 2);
  p.set(pxy.x, pxy.y, p.z);
  let dx = max(0, abs(p.x) - 0.);
  let dy = max(0, abs(p.y) - 15);
  let dz = max(0, abs(p.z) - 0.);
  let pb = createVector(dx, dy, dz);
  let d = pb.mag() - 1 - exp(-0.5 * abs(p.y + 13)) * 6;
  let h = sin(p.x * 0.2) + cos(p.z * 0.3);
  d = min(d, -p2.y + 3 + h + 0.2 * abs(fract(p2.z * 1) -0.5));
  return d * .7;
}

function nor(p) {
  let p1 = p.copy();
  p1.add(det, 0, 0);
  let p2 = p.copy();
  p2.add(0, det, 0);
  let p3 = p.copy();
  p3.add(0, 0, det);
  let n = createVector(de(p1), de(p2), de(p3));
  let d = de(p);
  n.sub(d, d, d);
  n.normalize();
  return n;
}

function shadow(p2) {
  let p = p2.copy();
  let td = 0;
  let d = 1.0;
  for (let i = 0; i < 50; i++) {
    p.add(ldir.x * d, ldir.y * d, ldir.z * d);
    d = de(p) * 1.2;
    td += d;
    if (d < det) {
      return 0.7;
    }
  }
  return 1;
}

function shade(p) {
  let n = nor(p);
  let amb = .3;
  let dif = max(0, p5.Vector.dot(ldir, n)) * 1.5;
  let sh = shadow(p);
  return max(amb, dif) * sh;
}

function march(from, dir) {
  let d;
  let td = 0;
  let p = from;
  let col = color(0,0);
  let g = 0;
  for (let i = 0; i < 80; i++) {
    d = de(p);
    p.add(dir.x * d, dir.y * d, dir.z * d);
    if (d < det || td > maxdist) break;
    td += d;
    g++;
  }
  if (d < 0.2) {
    let c = shade(p);
    let xz = createVector(p.x, p.z);
    let l = xz.mag();
    if (p.y < -10) {
      xz.rotate(.5);
      xz.set(fract(xz.x * 0.5) - 0.5, fract(xz.y * 0.5) - 0.5);
      col = color(c, dir.y * c * 1.5, 0, 1.5);
      col = lerpColor(col, color(1), xz.mag() < 0.3 ? 0.5 : 0);
      
    }
    if (p.y > -9  && l < 3.5) col = color(c * 0.8, 1.5);
    if (p.y > 0 && l > 1.2) col = color(0.2, c * 0.5, 0);
    //c = 0;
  }
  else {
    p.mult(0.1);
    nub = pow(noise(dir.x * 10 + 100, dir.y * 20),3) * 2;
    col = lerpColor(color(0.5, 0.7, 0.8), color(1), nub);
  }
  return col;
}


