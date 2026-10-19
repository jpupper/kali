let det = 0.01;
let maxdist = 1000;
let ldir;
let hitm;
let pix = 0;
let w, h;
let listoo = false;
let features;
let displacement=0;
let pm;
let hit = false;
let le;
let pg;
let tone;
let set;
let shader_loaded = false;

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
let glitch;
let sketch;

let gloss_shader;
let cnv;
let gx1
let gx2;

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
  cnv = createCanvas(w, h);
  gx1 = createGraphics(w, h);
  gx2 = createGraphics(w, h, WEBGL);
  gloss_shader = loadShader("base.vert", "glass.frag", function() {
    shader_loaded = true;
  });
  colorMode(RGB, 1);
  gx1.colorMode(RGB, 1);
  gx2.colorMode(RGB, 1);
  ldir = createVector(4, -1, -2);
  ldir.normalize();
  ldir.rotateAxis(0, 0, 0);
  pm = createVector(0, 0, 0);
  gx1.background(0);
}

window.onload = feat;

function feat() {
  if (set) return;
  set = true;
  view_angle = Math.floor(fxrand() * 8.9) / 8 * 360;
  hair1_length = Math.floor(fxrand() * 3.9) + 1;
  hair2_length = Math.floor(fxrand() * 3.9) + 1;
  tips = fxrand() > 0.5;
  bodycolor = Math.floor(fxrand() * 4.9) + 1;
  protocolor = Math.floor(fxrand() * 4.9) + 1;
  frequency = Math.floor(fxrand() * 2.9);
  curvature = Math.floor(fxrand() * 2.9);
  head_size = Math.floor(fxrand() * 2.9);
  head_shape = Math.floor(fxrand() * 2.9);
  rotation = fxrand();
  let pretone = Math.floor(fxrand() * 2.9);
  glitch = fxrand() > 0.9 ? 1 : 0;
  //glitch = 1;
  sketch = fxrand() > 0.9 ? 1 : 0;
  //sketch = 1;
  sketch = glitch ? 0 : sketch;
  le = 5 + Math.floor(fxrand() * 4.9);

  let feat_hair1, feat_hair2;
  if (hair1_length == 1) feat_hair1 = "short";
  if (hair1_length == 2) feat_hair1 = "medium";
  if (hair1_length == 3) feat_hair1 = "long";
  if (hair1_length == 4) feat_hair1 = "very long";
  if (hair2_length == 1) feat_hair2 = "short";
  if (hair2_length == 2) feat_hair2 = "medium";
  if (hair2_length == 3) feat_hair2 = "long";
  if (hair2_length == 4) feat_hair2 = "very long";
  let feat_tips = tips ? "yes" : "no";
  let feat_bodycolor;
  if (bodycolor == 1) feat_bodycolor = "green";
  if (bodycolor == 2) feat_bodycolor = "red";
  if (bodycolor == 3) feat_bodycolor = "purple";
  if (bodycolor == 4) feat_bodycolor = "yellow";
  if (bodycolor == 5) feat_bodycolor = "blue";
  if (pretone == 0) feat_bodycolor = "black";
  let feat_lumpscolor;
  if (protocolor == 1) feat_lumpscolor = "orange";
  if (protocolor == 2) feat_lumpscolor = "green";
  if (protocolor == 3) feat_lumpscolor = "blue";
  if (protocolor == 4) feat_lumpscolor = "yellow";
  if (protocolor == 5) feat_lumpscolor = "white";
  let feat_tone;
  if (pretone == 0) { feat_tone = "dark"; tone = 0; }
  if (pretone == 1) { feat_tone = "dark"; tone = 0.06; }
  if (pretone == 2) { feat_tone = "light"; tone = 0.15; }
  let feat_headsize;
  if (head_size == 0) feat_headsize = "small";
  if (head_size == 1) feat_headsize = "medium";
  if (head_size == 2) feat_headsize = "large";
  let feat_headshape;
  if (head_shape == 0) feat_headshape = "long";
  if (head_shape == 1) feat_headshape = "spherical";
  if (head_shape == 2) feat_headshape = "wide";
  let feat_sketch = sketch ? "yes" : "no";
  let feat_glitch = glitch ? "yes" : "no";

  window.$fxhashFeatures = {
    "body color": sketch ? "N/A" : feat_bodycolor,
    "body tone": sketch ? "N/A" : feat_tone,
    "spots color": sketch ? "N/A" : feat_lumpscolor,
    "hair tips": feat_tips,
    "hair #1": feat_hair1,
    "hair #2": feat_hair2,
    "head size": feat_headsize,
    "head shape": feat_headshape,
    "glitchy": feat_glitch,
    "sketch": feat_sketch,
  }
  console.table(window.$fxhashFeatures);

}

function mousePressed() {
  window.location.reload();
}


function draw() {
  if (listoo) {
    updateShader();
//    noLoop();
    return;
  }
  gx1.push();
  gx1.noFill();
  gx1.stroke(0.3, 0.1);
  //rect(0, 0, w, h);
  gx1.rect(35, 35, w - 70, h - 70);
  //return;
  gx1.translate(w/2, h/2);
  gx1.noStroke();
  let aspect = w / h;
  for (let i = 0; i < 300; i++) {
    pix++;
    let r = createVector(random() - 0.5, random() - 0.5);
    r.mult(2);
    let res = 5.5;
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
    dir.y += 0.1;
    dir.x -= 0.17;
    dir.normalize();
    let xx = uv.x * w;
    let yy = uv.y * h;
    
    let mar = march(from, dir);
    mar.normal.rotateAxis(-angxy, 0, 0);
    gx1.strokeWeight(1);
    gx1.stroke(1, 0.1);
    if (!glitch) gx1.point(uv.x * w, uv.y * h);
    
    gx1.noStroke();
    let alph = red(mar.col) * tone;
    if (bodycolor == 1) gx1.fill(color(0.2, 0.5, 0, alph));
    if (bodycolor == 2) gx1.fill(color(0.6, 0.1, 0, alph));
    if (bodycolor == 3) gx1.fill(color(0.3, 0.2, 0.6, alph));
    if (bodycolor == 4) gx1.fill(0.5, 0.4, 0, alph);
    if (bodycolor == 5) gx1.fill(0, 0.2, 0.7, alph);
    if (mar.hit) gx1.circle(uv.x * w, uv.y * h, 20);
        
    mar.col.setAlpha(0.2);
    gx1.fill(mar.col);
    gx1.stroke(mar.col);
    gx1.strokeWeight(1.5);
    let l = 10 + hair1_length * 15;
    if (mar.hit && !mar.eye) gx1.line (xx, yy, xx + mar.normal.x * l, yy + mar.normal.y * l);
    if (protocolor == 1) mar.col = lerpColor(color(mar.c, 0, 0, 0.2), color(mar.c, 0.5*mar.c, 0, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 2) mar.col = lerpColor(color(0, 0.5*mar.c, 0, 0.2), color(0.8*mar.c, 1*mar.c, 0, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 3) mar.col = lerpColor(color(0, mar.c*0.3, mar.c, 0.2), color(mar.c*0.5, mar.c*0.5, mar.c, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 4) mar.col = lerpColor(color(mar.c, mar.c, 0, 0.2), color(mar.c, mar.c*0.3, 0, 0.2), abs(cos(mar.disp*5.25)));
    if (protocolor == 5) mar.col = lerpColor(color(0, 0.2), color(mar.c, 0.2), abs(cos(mar.disp*5.25)));

    gx1.fill(mar.col);
    l = 250 * hair2_length / 4;
    l *= max(0, 1 - abs(mar.p.x) * 0.007);
    if (mar.disp > 2.1 && mar.hit) {
      gx1.noStroke();
      gx1.circle(xx, yy, 25);
      gx1.stroke(green(mar.col), 0.3);
      gx1.line (xx, yy, xx + mar.normal.x * l, yy + mar.normal.y * l);
    }
  
    gx1.noStroke();
    gx1.fill(green(mar.col), 0.3);
    if (mar.disp > 2 && mar.hit) {
      if (tips) gx1.circle(xx + mar.normal.x * l, yy + mar.normal.y * l, 7);
    }
  }
  label();
  updateShader();
  gx1.pop();
}


function de(p3) {
  ey = 0;
  let p2 = p3.copy();
  p2.rotateAxis(sin(p3.x * 0.017) * (0.5 + curvature / 2 * 0.75) + 1, 0.2 + rotation * 0.5, 0);
  let p = p2.copy();
  p.mult(0.3 + frequency * 0.1);
  let d = createVector(p2.x * (0.8 + head_shape * 0.2), p2.y, p2.z).mag() - 10 - head_size * 3;
  let disp = createVector(sin(p.x), sin(p.y));
  d = min(d, max(p2.x, createVector(p2.y, p2.z).mag()) - 5 - head_size)
  displacement = disp.mag() * 1.7;
  d -= displacement;
  pm = p2;
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
  let d = 0.1;
  for (let i = 0; i < 80; i++) {
    p.add(ldir.x * d, ldir.y * d, ldir.z * d);
    d = de(p);
    td += d;
    if (d < det) return 0.4;
    if (td > 30) break;
  }
  return 1;
}

function shade(p) {
  let n = nor(p);
  let amb = 0.4;
  let dif = max(0, p5.Vector.dot(ldir, n)) * 2;
  //let sh = shadow(p);
  return sketch ? 1 : max(amb, dif);
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
  gx1.translate(-w / 2, -h / 2);
  let pos = 0;
  //view_angle = 2 / 8 * 360;
  if (view_angle/360*8 == 0) { pos = 1; gx1.translate(w - 70, h - 45); }
  if (view_angle/360*8 == 1) { pos = 2; gx1.translate(w - 70, h - 45); }
  if (view_angle/360*8 == 2) { pos = 1; gx1.translate(w - 70, 25); }
  if (view_angle/360*8 == 3) { pos = 1; gx1.translate(w - 70, 25); }
  if (view_angle/360*8 == 4) { pos = 0; gx1.translate(50, 25); }
  if (view_angle/360*8 == 5) { pos = 0; gx1.translate(50, 25); }
  if (view_angle/360*8 == 6) { pos = 0; gx1.translate(50, h - 45); }
  if (view_angle/360*8 == 7) { pos = 0; gx1.translate(50, h - 45); }
  if (view_angle/360*8 == 8) { pos = 1; gx1.translate(w - 70, h - 45); }
  
  let col = color(0.7, a+=0.01);
  ll += 0.15;
  for (let l = 0; l < min(le, ll); l++)
  {
    gx1.stroke(0);
    gx1.strokeWeight(4);
    gx1.line(0,8,0,20);
    gx1.line(20,0,20,20);
    gx1.line(0,20,10,20);
    gx1.line(0,0,10,0);
    gx1.line(10,0,20,20);
    gx1.line(0,20,10,10);
    gx1.strokeWeight(3);
    gx1.stroke(col);
    if (fxrand() > 0.3) gx1.line(0,8,0,20);
    if (fxrand() > 0.3) gx1.line(20,0,20,20);
    if (fxrand() > 0.4) gx1.line(0,20,10,20);
    if (fxrand() > 0.4) gx1.line(0,0,10,0);
    if (fxrand() > 0.5) gx1.line(10,0,20,20);
    if (fxrand() > 0.5) gx1.line(0,20,10,10);
    gx1.stroke(0.2, 0.2);
    gx1.line(10, 30, 10, 40);
    gx1.line(10, -20, 10, -10);
    gx1.translate(pos ? -30 : 30, 0);
  }
}

function updateShader() {
  if (!shader_loaded) return;
  //gx.translate(-w/2, -h/2);
  gx2.shader(gloss_shader);
  gloss_shader.setUniform('resolution', [w, h]);
  gloss_shader.setUniform('time', min(100000,millis()));
  gloss_shader.setUniform('tx', gx1);
  gloss_shader.setUniform('glitch', glitch);
  gloss_shader.setUniform('sketch', sketch);
  gx2.rect(0, 0, w, h);
  image(gx2, 0, 0);
}