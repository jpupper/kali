let det = 0.01;
let maxdist = 75;
let ldir;
let colo;
let pm;
let hitm;
let pix = 0;


p5.Vector.prototype.rotateAxis = function (angleXY, angleXZ, angleYZ) {
  let vec2D;
  let vec3D = this;
  vec2D = createVector(vec3D.x, vec3D.y);
  vec2D.rotate(angleXY);
  vec3D.set(vec2D.x, vec2D.y, vec3D.z);
  vec2D = createVector(vec3D.x, vec3D.z);
  vec2D.rotate(angleXZ);
  vec3D.set(vec2D.x, vec3D.y, vec2D.y);
  vec2D = createVector(vec3D.y, vec3D.z);
  vec2D.rotate(angleYZ);
  vec3D.set(vec3D.x, vec2D.x, vec2D.y);
  return vec3D;
};

let angles = [0, 0.7, 3, 4]
let mushroom_rotation;


function setup() {
  mushroom_rotation = angles[floor(random()*5)];
  //mushroom_rotation = 0.7;
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 1);
  background(0.5);
  ldir = createVector(3, -2, -2);
  ldir.normalize();
  pm = createVector(0, 0, 0);
}

function draw() {
  noStroke();
  translate(windowWidth/2, windowHeight/2);
  let aspect = windowWidth / windowHeight;
  for (let i = 0; i < 150; i++) {
    pix++;
    let r = createVector(random() - 0.5, random() - 0.5);
    let res = 8;
    let ww = windowWidth / res;
    let wh = windowHeight / res;
    let x = pix % ww + r.x;
    let y = floor(pix / ww) + r.y;
    let uv = createVector(x / ww - 0.5, y / wh - 0.5);
    let from = createVector(0, -17, -30);
    let dir = createVector(uv.x * aspect, uv.y, 1);
    dir.y += .4;
    dir.x -= .1;
    dir.normalize();
    let mar = march(from, dir);
    mar.col.setAlpha(exp(-5 * mar.td));
    fill(mar.col);
    circle(uv.x * windowWidth, uv.y * windowHeight, 8 + mar.td * 20);
  }
}

function hash(p2) {
  let p = p2.copy();
  let r = p5.Vector.dot(p, createVector(12.9898, 78.233));
  return fract(sin(r) * 43758.5453);
}

function mushroom(p2, size) 
{
  let p = p2.copy();
  p.mult(size);
  let a = atan2(p.x, p.z);
  let l = createVector(p.x,p.z).mag();
  p.sub(0, l * 0.2 + sin(a * 7) * l*l * 0.005, 0);
  let pxy = createVector(p.x, p.y);
  pxy.rotate(p.y * 0.01);
  p.set(pxy.x, pxy.y, p.z);
  let dx = max(0, abs(p.x));
  let dy = max(0, abs(p.y) - 15);
  let dz = max(0, abs(p.z));
  let pb = createVector(dx, dy, dz);
  let d = pb.mag() - 1 - exp(-0.5 * abs(p.y + 13)) * 6;
  return {d: d / size, p: p}
}

function de(p2) {
  let p = p2.copy();
  p.rotateAxis(0,mushroom_rotation,0);
  p.add(0, -3, 0);
  let p3 = p.copy();
  let m1 = mushroom(p, 1);
  p3.set(-p3.x - 3, p3.y, p3.z + 2);
  let p3r = createVector(p3.x, p3.z);
  p3r.rotate(0.3);
  p3.set(p3r.x, p3.y, p3r.y);
  let m2 = mushroom(p3, 1.5);
  let d = min(m1.d, m2.d);
  if (d == m1.d) pm = m1.p; else pm = m2.p;
  let h = sin(p.x * 0.2) + cos(p.z * 0.3);
  let gr = -p2.y + 3 + h + 0.3 * abs(fract(p2.z / 2) -0.5);
  d = min(d, gr);
  if (d == gr) hit = true; else hit = false;
  return d * 0.5;
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
      return 0.5;
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
    let pp = pm.copy();
    let h = hit;
    let c = shade(p);
    let xz = createVector(pp.x, pp.z);
    let l = xz.mag();
    if (pp.y < -12) {
      xz.rotate(0.7);
      xz.set(fract(xz.x * 0.5 + floor(xz.y * 0.5) * 0.5) - 0.5, fract(xz.y * 0.5) - 0.5);
      col = color(c, (dir.y - 0.1) * c * 1.5, 0);
      col = lerpColor(col, color(c), xz.mag() < 0.3 ? 0.5 : 0);
    }
    if (pp.y > -12) col = color(c * 0.7);
    if (h) {
      let ao = 1 - exp(-0.5 * createVector(pp.x,pp.z).mag()) * 1.3;
      col = color(c * 0.3 * ao, c * 0.5 * ao, 0);
    }
  }
  else {
    p.mult(0.1);
    nub = pow(noise(dir.x * 10 + 100, dir.y * 20 + 150),2) * 2;
    col = lerpColor(lerpColor(color(0.4, 0.8, 1), color(1), p.y + 0.8), color(1), nub);
    td = maxdist;
    
  }
  return {col: col, td: td / maxdist - 0.2};
}


