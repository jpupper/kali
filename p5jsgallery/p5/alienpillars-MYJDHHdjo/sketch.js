let det = 0.01;
let maxdist = 1000;
let ldir;
let hitm;
let pix = 0;
let w, h;
let listoo = false;
let features;
let fxrand = Math.random;
let displacement=0;
let pm;
let hit = false;
let le;
let pg;
let tone;

let view_angle;
let hair1_length;
let hair2_length;
let tips;
let bodycolor;
let protocolor;
let frequency;
let curvature;
let head_size;
let head_shape;
let rotation;

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


function setup() {
  feat();
  w = windowWidth;
  h = windowHeight;
  w = 800;
  h = 800;
  createCanvas(w, h);
  colorMode(RGB, 1);
  ldir = createVector(4, -1, -2);
  ldir.normalize();
  ldir.rotateAxis(0, 0, 0);
  pm = createVector(0, 0, 0);
  background(0);
  
  view_angle = floor(fxrand() * 8.9) / 8 * 360;
  hair1_length = floor(fxrand() * 3.9) + 1;
  hair2_length = floor(fxrand() * 3.9) + 1;
//  hair2_length = 5;
  tips = fxrand() > 0.5;
  bodycolor = floor(fxrand() * 4.9) + 1;
  protocolor = floor(fxrand() * 4.9) + 1;
  frequency = floor(fxrand() * 2.9);
  curvature = floor(fxrand() * 2.9);
  head_size = floor(fxrand() * 2.9);
//  head_size = 2;
  head_shape = floor(fxrand() * 2.9);
  rotation = fxrand();
  tone = floor(fxrand() * 3) / 10;
  le = 5 + floor(fxrand() * 4.9);
  
  console.log("view_angle", view_angle);
  console.log("hair1_length", hair1_length);
  console.log("hair2_length", hair2_length);
  console.log("tips", tips);
  console.log("protocolor", protocolor);
  console.log("frequency", frequency);
  console.log("curvature", curvature);
  console.log("head_size", head_size);
  console.log("head_shape", head_shape);
  
}

window.onload = feat;

function feat() {

}

function draw() {
  if (listoo) {
    return;
  }
  noFill();
  stroke(0.3, 0.1);
  rect(0, 0, w, h);
  rect(10, 10, w - 20, h - 20);
  noStroke();
  translate(w / 2, h / 2);
  let aspect = w / h;
  for (let i = 0; i < 300; i++) {
    pix++;
    let r = createVector(random() - 0.5, random() - 0.5);
    r.mult(2);
    let res = 6;
    if (pix > w / res * (h + 50) / res) listoo = true;
    let ww = w / res;
    let wh = h / res;
    let x = (pix % ww)+ r.x;
    let y = Math.floor(pix / ww) + r.y;
    let uv = createVector(x / ww - 0.5, y / wh - 0.5);
    let from = createVector(0, 0, -60);
    let dir = createVector(uv.x * aspect, uv.y, 0.7);
    let angxy = view_angle / (PI * 2);
    from.rotateAxis(angxy, 0, 0);
    dir.rotateAxis(angxy, 0, 0);
    //ldir.rotateAxis(angxy, 0, 0);
    dir.y += 0.1;
    dir.x -= 0.17;
    dir.normalize();
    let xx = uv.x * w;
    let yy = uv.y * h;
    
    let mar = march(from, dir);
    mar.normal.rotateAxis(-angxy, 0, 0);
    strokeWeight(1);
    //stroke(abs(dir.y), 0.2);
    stroke(1, 0.15);
    point(uv.x * w, uv.y * h);
    
    noStroke();
    let alph = red(mar.col) * tone;
    //bodycolor=2;
    if (bodycolor == 1) fill(color(0.2, 0.5, 0, alph));
    if (bodycolor == 2) fill(color(0.6, 0.1, 0, alph));
    if (bodycolor == 3) fill(color(0.3, 0.2, 0.6, alph));
    if (bodycolor == 4) fill(0.5, 0.4, 0, alph);
    if (bodycolor == 5) fill(0, 0.4, 0.5, alph);
    if (mar.hit) circle(uv.x * w, uv.y * h, 20);
    
    mar.col.setAlpha(0.2);
    fill(mar.col);
    stroke(mar.col);
    strokeWeight(2);
    let l = 10 + hair1_length * 15;
    //protocolor=3;
    if (mar.hit && !mar.eye) line (xx, yy, xx + mar.normal.x * l, yy + mar.normal.y * l);
    if (protocolor == 1) mar.col = lerpColor(color(mar.c, 0, 0, 0.2), color(mar.c, 0.5*mar.c, 0, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 2) mar.col = lerpColor(color(0, 0.5*mar.c, 0, 0.2), color(0.8*mar.c, 1*mar.c, 0, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 3) mar.col = lerpColor(color(0, mar.c*0.3, mar.c, 0.2), color(mar.c*0.5, mar.c*0.5, mar.c, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 4) mar.col = lerpColor(color(mar.c, mar.c, 0, 0.2), color(mar.c, mar.c*0.3, 0, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 5) mar.col = lerpColor(color(0, 0.2), color(mar.c, 0.2), abs(cos(mar.disp*5.25)));

    
    fill(mar.col);
    l = 250 * hair2_length / 4;
    l *= max(0, 1 - abs(mar.p.x) * 0.007);
    if (mar.disp > 2.1 && mar.hit && !mar.eye) {
      noStroke();
      circle(xx, yy, 25);
      stroke(green(mar.col), 0.3);
      line (xx, yy, xx + mar.normal.x * l, yy + mar.normal.y * l);
    }
  
    noStroke();
    fill(green(mar.col), 0.3);
    if (mar.disp > 2 && mar.hit && !mar.eye) {
      if (tips) circle(xx + mar.normal.x * l, yy + mar.normal.y * l, 7);
    }
  }
  label();
}


function de(p3) {
  ey = 0;
  let p2 = p3.copy();
  p2.rotateAxis(sin(p3.x * 0.017) * (0.5 + curvature / 2 * 0.75) + 1, 0.2 + rotation * 0.5, 0);
  //p2.set(p2.x, p2.y * 1.3, p2.z);
  let p = p2.copy();
  p.mult(0.3 + frequency * 0.15);
  //head_size = 0;
  let d = createVector(p2.x * (0.8 + head_shape * 0.2), p2.y, p2.z).mag() - 10 - head_size * 3;
  //hit = false;
  let disp = createVector(sin(p.x), sin(p.y));
  d = min(d, max(p2.x, createVector(p2.y, p2.z).mag()) - 5 - head_size)
  displacement = disp.mag() * 1.7;
  d -= displacement;
  pm = p2;
  //d = min(d, p2.mag() - 10);;
  //d = max(d, -p2.z - 9);
  //d = max(d, -abs(p.x) + 2);
  //d = max(d, -abs(p.y) + 2);
  //p2.add(0, 0, 0);
  //d = min(d, p2.mag() - 6);
  //d = max(d, -createVector(p.x,p.y).mag() + 3);
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
  let d = 0.5;
  for (let i = 0; i < 80; i++) {
    p.add(ldir.x * d, ldir.y * d, ldir.z * d);
    d = de(p);
    td += d;
    if (d < det) return 0.5;
    if (td > 30) break;
  }
  return 1;
}

function shade(p) {
  let n = nor(p);
  let amb = 0.3;
  let dif = max(0, p5.Vector.dot(ldir, n)) * 1.6;
  //let sh = shadow(p);
  return max(amb, dif);
}

function march(from, dir) {
  let d;
  let td = 0;
  let p = from;
  let col = color(0, 0);
  let g = 0;
  for (let i = 0; i < 150; i++) {
    d = de(p);
    p.add(dir.x * d, dir.y * d, dir.z * d);
    if (d < det || td > maxdist) break;
    td += d;
    g++;
  }
  let n = nor(p);
  let disp = displacement;
  let hh = false;
  let pp = pm;
  let c = 0;
  let spec = 0;
  if (d < det) {
    hh = true;
    let h = hit;
    c = shade(p);
    c*=exp(-0.007 * td);
    col = color(c * 0.7);
  } 
  return { col: col, normal: n, disp: disp, hit: hh, p: pp, c: c};
}

function distanciarColor(col, dist) {
  let rnd1 = fxrand();
  let rnd2 = fxrand();
  let v1 = dist * rnd1;
  let v2 = dist * (1-rnd1);
  let v3 = (v1 + v2) * rnd2;
  v1 *= 1 - rnd2;
  v2 *= 1 - rnd2;
  let r = red(col);
  let g = green(col);
  let b = blue(col);
  let a = alpha(col);
//  console.log(v1,v2,v3);
  return color(r + v1, g + v2, b + v3, a)  
}

let a = 0;
let ll = 0;

function label() {
  translate(-w / 2, -h / 2);
  let pos = 0;
  //view_angle = 2 / 8 * 360;
  if (view_angle/360*8 == 0) { pos = 1; translate(w - 45, h - 45); }
  if (view_angle/360*8 == 1) { pos = 2; translate(w - 45, h - 45); }
  if (view_angle/360*8 == 2) { pos = 1; translate(w - 45, 25); }
  if (view_angle/360*8 == 3) { pos = 1; translate(w - 45, 25); }
  if (view_angle/360*8 == 4) { pos = 0; translate(25, 25); }
  if (view_angle/360*8 == 5) { pos = 0; translate(25, 25); }
  if (view_angle/360*8 == 6) { pos = 0; translate(25, h - 45); }
  if (view_angle/360*8 == 7) { pos = 0; translate(25, h - 45); }
  if (view_angle/360*8 == 8) { pos = 1; translate(w - 45, h - 45); }
  
  function letra(col) {
    stroke(0);
    strokeWeight(4);
    line(0,8,0,20);
    line(20,0,20,20);
    line(0,20,10,20);
    line(0,0,10,0);
    line(10,0,20,20);
    line(0,20,10,10);
    strokeWeight(3);
    stroke(col);
    if (fxrand() > 0.3) line(0,8,0,20);
    if (fxrand() > 0.3) line(20,0,20,20);
    if (fxrand() > 0.4) line(0,20,10,20);
    if (fxrand() > 0.4) line(0,0,10,0);
    if (fxrand() > 0.5) line(10,0,20,20);
    if (fxrand() > 0.5) line(0,20,10,10);
  }

  let col = color(0.7, a+=0.01);
  ll += 0.15;
  for (let l = 0; l < min(le, ll); l++)
  {
    letra(col);
    stroke(0.2, 0.2);
    line(10, 30, 10, 40);
    line(10, -20, 10, -10);
    translate(pos ? -30 : 30, 0);

  }
}

