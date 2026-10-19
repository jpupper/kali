
let partis = [];
let maxpartis = 1000;
let w = 800;
let h = 800;
let color;

function setup() {
  createCanvas(w, h);
  for (let i=0; i<maxpartis; i++) {
    let p = createVector(random()-.5, random()-.5);
    p.mult(2);
    let d = createVector(random()-.5, random()-.5);
    let par = {pos: p, dir: d, speed: .01};
    partis.push(par);
  }
}

function boxi(p, r) {
  let ax = abs(p.x)-r;
  let ay = abs(p.y)-r;
  let bx = max(0,ax);
  let by = max(0,ay);
  return createVector(bx,by).mag()+min(0,max(ax,ay));
}

function circ(p, r) {
  let d = p.mag() - r;
  return d;
}

function de(p) {
  let pp = p.copy();
  pp.add(.0,.1);
  let c1 = boxi(pp, .3);
  pp.add(-.2,-.2);
  let c2 = circ(pp, .25);
  let pc = p.copy();
  pc.add(.3,-.2);
  let c3 = circ(pc, .2);
  let d = min(c1, c2);
  if (d == c1) color = 1;
  if (d == c2) color = 2;
  d = max(d, -c3);
  if (d == c3) color = 0;
  return d;
}

function norma(p) {
  let e = .01;
  let p1 = p.copy();
  let p2 = p.copy();
  p1.add(e, 0);
  p2.add(0, e);
  let dx = de(p1);
  let dy = de(p2);
  let d = de(p);
  let n = createVector(dx, dy);
  n.sub(createVector(d, d));
  n.normalize();
  return n;
}

function sign(v) {
  return v>0?1:-1;
}
let t=0;
function draw() {
  t++;
  //background(255);
  translate(w*.5,h*.5);
  //scatteredPoints();return;
  stroke(0,0,0,100);
  strokeWeight(1);
  for (let i = 0; i<maxpartis; i++) {
    let pos = partis[i].pos;
    let prevpos = pos.copy();
    //pos.add((random()-.5)*.01,(random()-.5)*.01);
    //pos.add(.001);
    let dir = partis[i].dir;
    let speed = partis[i].speed;
    let d = de(pos);
    let n = norma(pos);
    n.mult(sign(d));
    dir.lerp(n, .1);
    dir.rotate(.1);
    if (d<.001) {
    //  n.mult(-1); 
    //  dir.reflect(n);
    }
    //dir.mult(sign(d));
    speed = -.05;
    let adv = dir.copy();
    adv.mult(speed);
    pos.add(adv);
    partis[i].pos = pos;
    partis[i].dir = dir;
    partis[i].speed = speed;
    if (color == 0) stroke(50,100,80,100);
    if (color == 1) stroke(50,80,100,100);
    if (color == 2) stroke(100,50,50,100);
    line(pos.x*w, pos.y*h, prevpos.x*w, prevpos.y*h);
    //point(pos.x*w, pos.y*h);
  }  
}

function scatteredPoints() {
  stroke(0,0,0,0);
  for (let i = 0; i< 1000; i++) {
    let x = random() -.5;
    let y = random() -.5;
    let p = createVector(x,y);
    //let n = norma(p);
    let d = de(p);
    fill(0,0,150,10-abs(d)*500);
    circle(x*w,y*h,5);
  }
}
