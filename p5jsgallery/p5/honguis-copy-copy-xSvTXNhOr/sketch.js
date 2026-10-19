let det = 0.01;
let maxdist = 75;
let ldir;
let colo;
let pm;
let hitm;
let pix = 0;
let w, h;
let listoo = false;
let distmush;
let gr;
let flowers = true;

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

/*
  Extiende la clase Color agregando el método para "rotar" un color
  RGB, tomándolo como si fuera un vector 3D y rota sus componentes
  para cada combinación: red-green, red-blue, green-blue
*/

p5.Color.prototype.rotate = function (angleRG, angleRB, angleGB) {
  let col = this;
  let vec;
  if (col.x == undefined) {
    vec = createVector(col._array[0], col._array[1], col._array[2]);
  } else {
    vec = createVector(col.x, col.y, col.z);
  }
  vec.rotateAxis(angleRG, angleRB, angleGB);
  col.x = vec.x;
  col.y = vec.y;
  col.z = vec.z;
  col.setRed(abs(col.x));
  col.setGreen(abs(col.y));
  col.setBlue(abs(col.z));
  return col;
};

let angles = [0, 0.7, 3, 4, 4];
let mushroom_rotation;
let mushroom_tilt;
let mushroom_head1;
let mushroom_head2;
let mushroom_tallo;
let mushroom_height;
let mushroom_pattern_size;
let mushroom_pattern_freq;
let mushroom_clone;
let image_color;
let light_angle;
let flowers_color;
let river;

function setup() {
  w = windowWidth;
  h = windowHeight;
  mushroom_rotation = angles[floor(random() * 5)];
//  mushroom_rotation = angles[4];
  mushroom_tilt = 0.015 + (random() - 0.5) * 0.015;
  mushroom_head1 = 0.5 + random() * 0.5;
  mushroom_head2 = random();
  mushroom_tallo = mushroom_head2 - 0.5;
  mushroom_height = (random() - 0.3) * 3;
  mushroom_pattern_size = 0.2 + random() * 0.25;
  mushroom_pattern_freq = 0.3 + random() * 0.5;
  mushroom_clone = random() > 0.5;
  image_color = floor(random() * 5) / 4;
  light_angle = floor(random() * 5) / 4 * 0.5;
  flowers_color = floor(random() * 4);
  river = random() > .5;
  river = true;
  //  flowers_color = 3;
  //mushroom_rotation = 0.7;
  createCanvas(w, h);
  colorMode(RGB, 1);
  background(0.5);
  ldir = createVector(3, -2, -2);
  ldir.normalize();
  ldir.rotateAxis(0, light_angle, 0);
  pm = createVector(0, 0, 0);
}



function draw() {
  if (listoo) return;
  noStroke();
  strokeWeight(1);
  translate(w / 2, h / 2);
  let aspect = w / h;
  for (let i = 0; i < 200; i++) {
    pix++;
    let r = createVector(random() - 0.5, random() - 0.5);
    //r.mult(0);
    let res = 4;
    if (pix > w / res * (h + 50) / res) listoo = true;
    let ww = w / res;
    let wh = h / res;
    let x = (pix % ww)+ r.x;
    let y = floor(pix / ww) + r.y;
    let uv = createVector(x / ww - 0.5, y / wh - 0.5);
    let from = createVector(0, -17, -30);
    let dir = createVector(uv.x * aspect, uv.y, 1);
    dir.y += 0.4;
    dir.x -= 0.1;
    dir.normalize();
    let mar = march(from, dir);
    mar.col.setAlpha(min(0.8, exp(-5 * mar.td)));
    fill(mar.col);
    noStroke();
    let dm = (1 - max(0, 1 - mar.distmush * 0.3));
    circle(uv.x * w, uv.y * h, 3 + mar.td * (mar.grass ? 20  - dm * 10 : 20));
    let xx = uv.x * w;
    let yy = uv.y * h;
    mar.col.setRed(mar.col._array[0] * 0.7);
    mar.col.setGreen(mar.col._array[1] * 0.7);
    mar.col.setBlue(mar.col._array[2] * 0.7);
    if (mar.grass) {
      let dd = pow(1 - mar.td, 3);
      let fcolor = flowers_color;
      if (flowers_color == 3) {
        fcolor = floor(random() * 3);
      }
      if (fcolor == 0) fill(0.5, 1, 1, dd * 2);
      if (fcolor == 1) fill(1, 1, 0.5, dd * 2);
      if (fcolor == 2) fill(1, 0.5, 1, dd * 2);
      if (noise(xx * 0.05, yy * 0.2) > 0.7 && flowers) circle(xx, yy, 2 + dd * 20 * dm);
      stroke(mar.col)
      noFill();
      triangle(xx, yy, xx + dd * 5 + 3, yy, 
               xx + (random() - 0.5) * dd * 100 * dm, yy - dd * 200 * random() * dm);
    }
  }
}

function hash(p2) {
  let p = p2.copy();
  let r = p5.Vector.dot(p, createVector(12.9898, 78.233));
  return fract(sin(r) * 43758.5453);
}

function mushroom(p2, size) {
  let p = p2.copy();
  let hdif = 0;
  if (mushroom_clone) {
    if (p.x > 0) hdif = 4;
    p.set(abs(p.x), p.y, p.z);
    p.sub(8, 0, 0);
    mushroom_tilt = abs(mushroom_tilt) * (hdif == 0 ? -1 : 1);
  }
  p.mult(size);
  let a = atan2(p.x, p.z);
  let l = createVector(p.x, p.z).mag();
  p.sub(0, l * 0.2 + sin(a * 7) * l * l * 0.005 + mushroom_height - hdif, 0);
  p.rotateAxis(p.y * mushroom_tilt, 0, 0);
  //  let pxy = createVector(p.x, p.y);
  //  pxy.rotate(p.y * 0.01);
  //  p.set(pxy.x, pxy.y, p.z);
  let dx = max(0, abs(p.x) - mushroom_tallo);
  let dy = max(0, abs(p.y) - 15);
  let dz = max(0, abs(p.z) - mushroom_tallo);
  let pb = createVector(dx, dy, dz);
  let d = pb.mag() - 1 - exp(-mushroom_head1 * abs(p.y + 13) * (1 + max(0, p.y + 13))) * (3 + mushroom_head2 * 2.5);
  return { d: d / size, p: p };
}

function de(p2) {
  let p = p2.copy();
  let pa = p2.copy();
  p.rotateAxis(0, mushroom_rotation, 0);
  p.add(0, -3, 0);
  let p3 = p.copy();
  let m1 = mushroom(p, 1);
  p3.set(-p3.x - 4, p3.y, p3.z + 2);
  let p3r = createVector(p3.x, p3.z);
  p3r.rotate(0.3);
  p3.set(p3r.x, p3.y, p3r.y);
  let m2 = mushroom(p3, 1.5);
  let d = min(m1.d, m2.d);
  //let d = 1000;
  if (d == m1.d) pm = m1.p;
  else pm = m2.p;
  let h = sin(p.x * 0.2) + cos(p.z * 0.3);
  gr = -p2.y + 3 + h + 0.5 * abs(fract(p2.z / 2) - 0.5);
  d = min(d, gr);
  if (d == gr) hit = true;
  else hit = false;
  //pm = p;
  distmush = min(distmush,min(m1.d, m2.d));
  pa.rotateAxis(0, -0.5, 0);
  if (river) d = max(d, -abs(pa.z - 20 + sin(p.z / 4) * 4) + 6 - p2.z * 0.15);
  if (river) d = min(d, gr+1.5);;
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
  for (let i = 0; i < 100; i++) {
    p.add(ldir.x * d, ldir.y * d, ldir.z * d);
    d = de(p);
    td += d;
    if (d < det) return 0.5;
    if (td > 20) break;
  }
  return 1;
}

function shade(p) {
  let n = nor(p);
  let amb = 0.3;
  let dif = max(0, p5.Vector.dot(ldir, n)) * 1.5;
  let sh = shadow(p);
  return max(amb, dif) * sh;
}

function march(from, dir) {
  distmush = 1000;
  let d;
  let td = 0;
  let p = from;
  let col = color(0, 0);
  let g = 0;
  let grass = false;
  for (let i = 0; i < 150; i++) {
    d = de(p);
    p.add(dir.x * d, dir.y * d, dir.z * d);
    if (d < det || td > maxdist) break;
    td += d;
    g++;
  }
  let dm = distmush;
  let pp = pm.copy();
  let gro = gr;
  if (d < 0.2) {
    let h = hit;
    let c = shade(p);
    let xz = createVector(pp.x, pp.z);
    let l = xz.mag();
    if (pp.y < -12) {
      xz.rotate(0.7);
      xz.set(
        fract(xz.x * mushroom_pattern_freq + floor(xz.y * mushroom_pattern_freq) * 0.5) - 0.5,
        fract(xz.y * mushroom_pattern_freq) -0.5
      );
      col = color(c, (dir.y - 0.1) * c * 1.5, 0);
      col.rotate(0, image_color * 0.7, 0);
      col = lerpColor(col, color(c), xz.mag() < mushroom_pattern_size ? 0.5 : 0);
    }
    if (pp.y > -12.5) col = color(c * 0.7);
    if (h) {
      let ao = 1 - exp(-0.5 * createVector(pp.x, pp.z).mag()) * 1.3;
      //ao=1;
      col = color(c * 0.3 * ao, c * 0.5 * ao, 0);
      col = distanciarColor(col, 0.3);
      col.rotate(0, image_color * 1.5, 0);
      grass = true;
      if (gro < 0 && river) {
        flowers = false;
        p.mult(0.2);
        nub = pow(noise(dir.x * 10 + 100, abs(dir.y) * 20 + 150), 2) * 2;
        col = lerpColor(color(0.4, 0.8, 1).rotate(0, image_color * 2, 0), color(1), nub);
        let depth = min(1, gro * gro) * 0.5 + 0.5;
        col = color(red(col) * 0.5 * depth, green(col) * 0.6 * depth, blue(col) * 0.7 * depth);
                //col = color(1);
      }
    }
  } else {
    p.mult(0.1);
    nub = pow(noise(dir.x * 10 + 100, dir.y * 20 + 150), 2) * 2;
    col = lerpColor(
      lerpColor(color(0.4, 0.8, 1).rotate(0, image_color * 2, 0), color(1), p.y + 0.8),
      color(1),
      nub
    );
    td = maxdist;
  }
  return { col: col, td: td / maxdist - 0.2, grass: grass, distmush: dm + max(0, pp.y) * 500};
}

function distanciarColor(col, dist) {
  let rnd1 = random();
  let rnd2 = random();
  let v1 = dist * rnd1;
  let v2 = dist * (1-rnd1);
  let v3 = (v1 + v2) * rnd2;
  v1 *= 1 - rnd2;
  v2 *= 1 - rnd2;
  //v1 -= dist / 2;
  //v2 -= dist / 2;
  //v3 -= dist / 2;
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  let a = alpha(col);
//  console.log(v1,v2,v3);
  return color(r + v1, g + v2, b + v3, a)  
}