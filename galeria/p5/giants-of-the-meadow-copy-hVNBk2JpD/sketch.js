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
let features;
let set = false;
let fxrand = Math.random;

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
let camera_orientation;


function setup() {
  feat();
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  colorMode(RGB, 1);
  //w = 800;
  //h = 800;
  ldir = createVector(3, -1, -2);
  ldir.normalize();
  //ldir.rotateAxis(0, light_angle, 0);
  pm = createVector(0, 0, 0);
  if (image_color == 5/4) {
    background(0.15);
    ldir = createVector(0.2, -0.5, 1);
  } else background(0.4);
}



window.onload = feat;

function feat() {
  if (set) return;
  set = true;
  mushroom_rotation = angles[Math.floor(fxrand() * 5)];
//  mushroom_rotation = angles[4];
  mushroom_tilt = 0.015 + (fxrand() - 0.5) * 0.015;
  let shape = Math.floor(fxrand() * 5) / 4;
  mushroom_head1 = 0.3 + shape * 0.7;
  let fat = Math.floor(fxrand() * 3.9) / 4;
  mushroom_head2 = Math.pow(fat, 2);
  mushroom_tallo = mushroom_head2 - 0.5;
  let he = Math.floor(fxrand() * 3);
  mushroom_height = (he / 3 - 0.3) * 10;
  mushroom_pattern_size = 0.2 + fxrand() * 0.25;
  mushroom_pattern_freq = 0.5 + fxrand() * 0.3;
  mushroom_clone = fxrand() > 0.5;
  image_color = 0;
  light_angle = 0;
  flowers_color = Math.floor(fxrand() * 4.99);
  river = fxrand() > .3;
  camera_orientation = fxrand() > 0.7 ? -1 : 1;

  let feature_mood;
  if (image_color == 0) feature_mood = "happy";
  if (image_color == 1/4) feature_mood = "happy";
  if (image_color == 2/4) feature_mood = "normal";
  if (image_color == 3/4) feature_mood = "melancholic";
  if (image_color == 4/4) feature_mood = "strange";
  if (image_color == 5/4) feature_mood = "sleepy";
  console.log("mood", feature_mood);

  let feature_mushroom_height;
  if (he == 2) feature_mushroom_height = "short";
  if (he == 1) feature_mushroom_height = "medium"
  if (he == 0) feature_mushroom_height = "tall"
  console.log("mushroom height", feature_mushroom_height);

  let feature_camera_angle = Math.floor(mushroom_rotation * 3.1416 * 2);
  console.log("camera angle", feature_camera_angle + " degrees");

  let feature_mushroom_shape = Math.floor(shape * 4.9) + 1;
  console.log("mushroom_shape", feature_mushroom_shape);

  let feature_mushroom_tilt = Math.floor(mushroom_tilt * 500) + " degrees";
  console.log("mushroom_tilt", feature_mushroom_tilt);

  let feature_mushroom_fatness;
  if (fat == 0/4) feature_mushroom_fatness = "S";
  if (fat == 1/4) feature_mushroom_fatness = "M";
  if (fat == 2/4) feature_mushroom_fatness = "L";
  if (fat == 3/4) feature_mushroom_fatness = "XL";
  console.log("mushroom_fatness", feature_mushroom_fatness);

  let feature_mushrooms;
  if (mushroom_clone) feature_mushrooms = "4";
  else feature_mushrooms = "2";
  console.log("mushrooms", feature_mushrooms);

  let feature_flowers_color;
  if (flowers_color == 0) feature_flowers_color = "cyan";
  if (flowers_color == 1) feature_flowers_color = "yellow";
  if (flowers_color == 2) feature_flowers_color = "pink";
  if (flowers_color == 3) feature_flowers_color = "multicolor";
  if (flowers_color == 4 || image_color == 5/4) feature_flowers_color = "white";
  console.log("flowers color", feature_flowers_color);

  let feature_river;
  if (river) feature_river = "yes";
  else feature_river = "no";
  console.log("river", feature_river);

  let feature_camera_orientation;
  if (camera_orientation == 1) feature_camera_orientation = "north";
  else feature_camera_orientation = "south";
  console.log("camera_orientation", feature_camera_orientation);
  features = {
      "mood" : feature_mood,
      "mushrooms" : feature_mushrooms,
      "mushroom height" : feature_mushroom_height,
      "mushroom fatness" : feature_mushroom_fatness,
      "mushroom shape" : feature_mushroom_shape,
      "mushroom tilt" : feature_mushroom_tilt,
      "flowers color" : feature_flowers_color,
      "river" : feature_river,
      "camera orientation" : feature_camera_orientation,
  }

  window.$fxhashFeatures = features;
  console.log(window.$fxhashFeatures);
}

function draw() {
  if (listoo) return;
  noStroke();
  strokeWeight(1);
  translate(w / 2, h / 2);
  let aspect = w / h;
  for (let i = 0; i < 300; i++) {
    pix++;
    let r = createVector(random() - 0.5, random() - 0.5);
    //r.mult(0);
    let res = 6;
    if (pix > w / res * (h + 50) / res) listoo = true;
    let ww = w / res;
    let wh = h / res;
    let x = (pix % ww)+ r.x;
    let y = Math.floor(pix / ww) + r.y;
    let uv = createVector(x / ww - 0.5, y / wh - 0.5);
    let from = createVector(0, 0, -30);
    let dir = createVector(uv.x * aspect, uv.y, 1);
    //dir.y += 0.4;
    //dir.x -= 0.05;
    dir.normalize();
    let mar = march(from, dir);
    mar.col.setAlpha(min(0.8, exp(-5 * mar.td)));
    fill(mar.col);
    noStroke();
    let dm = (1 - max(0, 1 - mar.distmush * 0.3));
    fill(0, 0.3);
    circle(uv.x * w, uv.y * h, 3);
    let xx = uv.x * w;
    let yy = uv.y * h;
    mar.col.setAlpha(0.3);
    stroke(mar.col);
    strokeWeight(3);
    let l = 20;
    mar.normal.rotateAxis(1.6, 0 ,0);
    if (mar.td < 0.9) line (xx, yy, xx + mar.normal.x * l, yy + mar.normal.y * l);
    mar.col.setRed(mar.col._array[0] * 0.7);
    mar.col.setGreen(mar.col._array[1] * 0.7);
    mar.col.setBlue(mar.col._array[2] * 0.7);
    if (mar.grass) {
      let dd = pow(1 - mar.td, 3);
      let fcolor = flowers_color;
      if (flowers_color == 3) {
        fcolor = Math.floor(random() * 3);
      }
      if (fcolor == 0) fill(0.5, 1, 1, 0.1 + dd * 2);
      if (fcolor == 1) fill(1, 1, 0.5, 0.1 + dd * 2);
      if (fcolor == 2) fill(1, 0.5, 1, 0.1 + dd * 2);
      if (fcolor == 4 || image_color == 5/4) fill(1, (image_color == 5/4 ? 0 : 0.1) + dd);
      if (noise(xx * 0.05, yy * 0.2) > 0.7 && mar.flowers) circle(xx, yy, 3 + dd * 25 * dm);
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
  let dx = max(0, abs(p.x) - mushroom_tallo);
  let dy = max(0, abs(p.y) - 15);
  let dz = max(0, abs(p.z) - mushroom_tallo);
  let pb = createVector(dx, dy, dz);
  let d = pb.mag() - 1 - exp(-mushroom_head1 * abs(p.y + 13) * (1 + max(0, p.y + 13))) * (3 + mushroom_head2 * 2.5);
  return { d: d / size * 0.5, p: p };
}

function de(p3) {
  let p2 = p3.copy();
  p2.rotateAxis(0.5, -0.3, -0.1);
  let p = p2.copy();
  p.mult(2);
  let d = abs(p2.mag() - 10);
  hit = false;
  let disp = createVector(sin(p.x), sin(p.y));
  d -= disp.mag() * 0.7;
  d = max(d, -p2.z - 9);
  d = max(d, -abs(p.x) + 2);
  d = max(d, -abs(p.y) + 2);
  p2.add(0, 0, 6);
  d = min(d, p2.mag() - 4);
  d = max(d, -createVector(p.x,p.y).mag() + 3);
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
  let dif = max(0, p5.Vector.dot(ldir, n)) * 1.5;
  let sh = shadow(p);
  return max(amb, dif)*sh;
}

function march(from, dir) {
  let flowers = true;
  distmush = 1000;
  let d;
  let td = 0;
  let p = from;
  let col = color(0, 0);
  let g = 0;
  let grass = false;
  for (let i = 0; i < 80; i++) {
    d = de(p);
    p.add(dir.x * d, dir.y * d, dir.z * d);
    if (d < det || td > maxdist) break;
    td += d;
    g++;
  }
  let dm = distmush;
  let pp = pm.copy();
  let gro = gr;
  let n = nor(p);
  if (d < det) {
    let h = hit;
    let c = shade(p);
    let xz = createVector(pp.x, pp.z);
    let l = xz.mag();
    if (pp.y < -12) {
      xz.rotate(0.7);
      xz.set(
        fract(xz.x * mushroom_pattern_freq + Math.floor(xz.y * mushroom_pattern_freq) * 0.5) - 0.5,
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
      col = color(c * 0.3 * ao, c * 0.5 * ao, (image_color == 5/4 ? 0.1 : 0));
      col.rotate(image_color, image_color * 2, 0);
      col = distanciarColor(col, 0.3);
      grass = true;
      if (gro < 0 && river) {
        flowers = false;
        grass = false;
        p.mult(0.2);
        nub = pow(noise(dir.x * 10 + 100, abs(dir.y) * 20 + 150), 2) * 2;
        col = lerpColor(color(0.4, 0.8, 1).rotate(0, image_color * 2, 0), color(1), nub);
        let depth = min(1, gro * gro) * 0.5 + 0.5;
        col = color(red(col) * 0.5 * depth, green(col) * 0.6 * depth, blue(col) * 0.7 * depth);
      }
    }
  } else {
    p.mult(0.1);
    nub = pow(noise(dir.x * 10 + 100, dir.y * 20 + 150), 2) * 2;
    col = lerpColor(
      lerpColor(color(0.4, 0.8, 1).rotate(0, image_color * 2, 0), color(1), p.y + 0.8), color(1), nub);
    let moon = max(0, 1 - (dir.x * dir.x + dir.y * dir.y) * 30) * max(0, camera_orientation);
    if (image_color == 5/4) col = color(0.2+moon+nub*.2,0.3+moon+nub*.3,0.5+moon);
    td = maxdist;
  }
  return { col: col, td: td / maxdist, grass: grass, flowers: flowers, distmush: dm + max(0, pp.y) * 500, normal: n};
}

function distanciarColor(col, dist) {
  let rnd1 = random();
  let rnd2 = random();
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