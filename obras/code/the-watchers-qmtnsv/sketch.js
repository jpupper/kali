
let partis = [];
let maxpartis = 1500;
let color;
let t=0;
let w;
let h;
let aspect;
let panx = fxrand();
let pany = fxrand();
let cx = fxrand();
let cy = fxrand();
let r = fxrand() > .5 ? 1 : 0;
let g = fxrand() > .5 ? 1 : 0;
let b = fxrand() > .5 ? 1 : 0;
let bw = fxrand() > .95 ? 1 : 0;
let bias = sign(fxrand()-.25);
features();


function features() {
  if (r && !g && !b) colo="SEPIA";
  if (!r && g && !b) colo="GREEN";
  if (!r && !g && b) colo="BLUE";
  if (r && g && !b) colo="YELLOW";
  if (!r && g && b) colo="CYAN";
  if (r && !g && b) colo="PURPLE";
  if (!r && !g && !b) colo="GRAYSCALE-DARK";
  if (r && g && b) colo="GRAYSCALE-LIGHT";
  if (bw) colo="BLACK AND WHITE";
  window.$fxhashFeatures = {
    "Color": colo,
    "Particle bias": bias > 0 ? "RIGHT" : "LEFT",
    "Fractal coords": "X: " + (.2+panx*.3).toString().substring(0,7) + ", Y: " + (.2+pany*.3).toString().substring(0,7),
    "Formula params": "X: " + (.5+cx*.5).toString().substring(0,7) + ", Y:" + (.5+cy*.5).toString().substring(0,7),
  }
}



function setup() {
  let colo;
  console.log(colo);
  console.log(window.$fxhashFeatures);
  w = windowWidth;
  h = windowHeight;
//  w = h;
  aspect = w/h;
  createCanvas(w, h);
  maxpartis*=aspect;
  for (let i=0; i<maxpartis; i++) {
    let px=random()-.5;
    let py=random()-.5;
    px*=aspect;
    let p = createVector(px, py);
    let d = createVector(random()-.5, random()-.5);
    let par = {pos: p, dir: d, speed: 0};
    partis.push(par);
  }
}

function boxi(p, r) {
  let ax = abs(p.x)-r;
  let ay = abs(p.y)-r;
  let bx = max(0,ax)+min(0,max(ax,ay));
  let by = max(0,ay)+min(0,max(ax,ay));
  return createVector(bx,by).mag();
}

function circ(p, r) {
  let d = p.mag() - r;
  return d;
}

function de(p) {
  let nroit = 8;
  let pp = p.copy();
  pp.mult(.3);
  pp.add(.2+panx*.3,.2+pany*.3);
//  pp.add(.5);
  let x=pp.x;
  let y=pp.y;
  let l;
  let m=1000;
  let it;
  for (let i=0; i<nroit; i++) {
    x=abs(x);
    y=abs(y);
    l=x*x+y*y;
    x/=l;
    y/=l;
    x-=.5+cx*.5;
    y-=.5+cy*.5;
    //x-=.7;
    //y-=.7;
    if (l<m) {
      m=l;
      it=i;
    }
  }
  m=exp(-1.*m);
  color=pow(m,10.);
  return m;
}


function norma(p) {
  let e = .001;
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

function draw() {
  t++;
  translate(w*.5,h*.5);
  scatteredPoints();//return;
  stroke(50,0,0,70);
  strokeWeight(2.);
//  blendMode(DARKEST);
  for (let i = 0; i<maxpartis; i++) {
    let pos = partis[i].pos;
    //pos.add((random()-.5)*.001,(random()-.5)*.001);
    let prevpos = pos.copy();
    let dir = partis[i].dir;
    let speed = partis[i].speed;
    let d = de(pos);
    pos.add(d*.0005*bias);
    let n = norma(pos);
    //n.mult(sign(d));
    dir.lerp(n, .03);//.3 a .5
    //dir.add(-.01);
    dir.rotate(.5*bias);
    //pos.rotate(-.005);
    //dir.mult(sign(d));
    speed = -0.01;
    let adv = dir.copy();
    adv.mult(speed);
    pos.add(adv);
    partis[i].pos = pos;
    partis[i].dir = dir;
    partis[i].speed = speed;
    //if (color == 0) stroke(50,100,80,50);
    //if (color == 1) stroke(50,80,100,50);
    //if (color == 2) stroke(100,50,50,50);
    //stroke(color,color*1.2,color*1.5);
    //line(pos.x*w, pos.y*h, prevpos.x*w, prevpos.y*h);
    point(pos.x*h, pos.y*h);
  }
}

function scatteredPoints() {
  if (t>350) return;
  stroke(0,0,0,0);
  for (let i = 0; i< 500*aspect; i++) {
    let x = random() -.5;
    let y = random() -.5;
    let p = createVector(x*aspect,y);
//    let n = norma(p);
    let d = de(p);
    color = pow(color,.7);
    color=120+color*90;
    //color=80+color*80;
    //fill(color+0,color+0,color+50,15);
    color+=255*bw;
    fill(color+50*r,color+50*g,color+50*b,15);
    square(x*w,y*h,15);
  }
}

