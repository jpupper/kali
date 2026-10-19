
let partis = [];
let maxpartis = 2000;
let col;
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
let img;
let pic = (Math.floor(fxrand()*4.99)+1);
//pic=4;
let biasforce = .1;
let biasvec;
let rota = 80+fxrand()*20;
//rota=90; //poner para kali1 ... anda a dormir ahora
let mirror = fxrand()>.7;
let colpal = Math.floor(fxrand()*5.99);
//colpal=5;
//mirror=true;
let ro;
let pmode=false;

function keyTyped() {
  if (key === 's' || key === 'S') {
    saveCanvas("Kali_Self_Portrait","jpg");
  }
  if (key === 'p' || key === 'P') {
    pospart();
    t=0;
    pmode = !pmode;
    setBack();
  }

  // uncomment to prevent any default behavior
  // return false;
}

function preload() {
  biasx = fxrand()-.5;
  biasy = fxrand()-.5;
  // biasvec = createVector(0,fxrand()*0-.5);
  // biasvec = biasvec.normalize();
  // biasvec.rotate(radians(-30+fxrand()*60));
  biasvec = createVector(0,1);
  ro = radians(360*fxrand());
//  if (pic==4) ro = radians(140+fxrand()*80);
  biasvec.rotate(ro);
  //img = loadImage("kali"+(floor(fxrand()*3)+1)+".jpg");
  img = loadImage("kali"+pic+".jpg");
}

function pospart() {
  aspect = w/h;
  maxpartis*=aspect;
  partis = [];
  for (let i=0; i<maxpartis; i++) {
    let px=fxrand()-.5;
    let py=fxrand()-.5;
    px*=.5;
    py*=.5;
    px*=aspect;
    let p = createVector(px, py);
    let d = createVector(fxrand()-.5, fxrand()-.5);
    d = createVector(0, 0);
    let par = {pos: p, dir: d, speed: 0};
    partis.push(par);
  }
}

function setBack() {
  background(0);
  let rr=fxrand()>.5?1:0;
  let gg=fxrand()>.5?1:0;
  let bb=fxrand()>.5?1:0;
  background(130+rr*100,130+gg*100,130+bb*100,25);
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  //w = img.width;
  //h = img.height;
  w = h;
  pospart();
  createCanvas(w, h);
//  background(120,140,170);
  translate(0,0);
  //image(img,0,0);
  img.loadPixels();
  translate(w/2,h/2);
  setBack();
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
  //translate(w/2,h/2);
  let pix = floor((p.x + .5) * img.width);
  if (mirror) pix = img.width-pix;
  let piy = floor((p.y + .5) * img.height);
  let index = (pix + piy * img.width) * 4;
  let min = 30;
  let re = min+.8*img.pixels[index]/256*(256-min);
  let gr = min+.8*img.pixels[index + 1]/256*(256-min);;
  let bl = min+.8*img.pixels[index + 2]/256*(256-min);;
  //stroke(re,re,bl);
  //point(pix-w/2,piy-h/2)
  let bri=(re+gr+bl)/3;
  if (colpal==2) {re*=1.2;gr*=.9;bl*=.7;}
  if (colpal==3) {re*=.9;gr*=1.2;bl*=.7;}
  if (colpal==4) {re*=.8;gr*=.8;bl*=1.3;}
  if (colpal==5) {re=bri;gr=bri;bl=bri;}
  col = color(re*1.5,gr*1.5,bl*1.5);
  
  //col = color(re*1.5,gr*1.5,bl*1.5);
  return pow(bri/256,1.);


  let nroit = 8;
  let pp = p.copy();
  pp.mult(.5);
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
  //m=exp(-1.*m);
  color=exp(-10.*m);
  return m;
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

function draw() {
  t++;
  if (t>400&&!pmode) return;
  //if (t>120&&!pmode&&pic==2) return;
  if (pmode) {
    background(0,0,0,30);
  }
  translate(w*.5,h*.5);
  //scatteredPoints();return;
  let freq = 100;
  let v = abs(.5-(t%freq)/freq)*1.5+.5;
  v=0;
  stroke(v*255,v*255,v*255,50);
  strokeWeight(pmode?2:1);


  // blendMode(MULTIPLY);
  // blendMode(BLEND);
  // blendMode(ADD);
//  blendMode(DARKEST);
  //blendMode(LIGHTEST);
  // blendMode(DIFFERENCE);
  //blendMode(EXCLUSION);
  //blendMode(MULTIPLY);
  //blendMode(SCREEN);
  //blendMode(SUBTRACT);
  //blendMode(OVERLAY);
  //blendMode(HARD_LIGHT);
  //blendMode(SOFT_LIGHT);
  //blendMode(DODGE);
  //blendMode(BURN); 


  for (let i = 0; i<maxpartis; i++) {
    let pos = partis[i].pos;
    let dir = partis[i].dir;
    //pos.add((random()-.5)*.01,(random()-.5)*.01);
    //pos.add(.001,0);
    let prevpos = pos.copy();
    let xx = pos.x, yy = pos.y;
    let dx = dir.x, dy = dir.y;
    let a=.5*aspect;
    let lin = true;
    if (pos.x>a) {
      xx=-a;
      //dx*=-1.;
      lin = false;
    }
    if (pos.y>.5) {
      yy=-.5;
      //dy*=-1.;
      lin = false;
    }
    if (pos.x<-a) {
      xx=a;
      //dx*=-1.;
      lin = false;
    }
    if (pos.y<-.5) {
      yy=.499;
      //dy*=-1.;
      lin = false;
    }
    let r=sign(i%2-.5);
    //if (pic==2) r=1;
    //r=1;
    pos.set(xx,yy);
    let speed = partis[i].speed;
    let d = de(pos);
    //pos.add(.001);
    let n = norma(pos);
    n.rotate(radians(rota));
    //n.mult(sign(d));
    dir.lerp(n, .2);//poner .4 para kali 1
    dir.lerp(biasvec, biasforce);//.3 a .5
    //dir.add(-.01);
    //if (pic==1) dir.rotate(.05);
    //pos.rotate(.01);
    //dir.mult(sign(d));
    speed = -0.0125*r+.005*fxrand();
    let adv = dir.copy();
    adv.mult(speed);
    pos.add(adv);
    partis[i].pos = pos;
    partis[i].dir = dir;
    partis[i].speed = speed;
    //if (color == 0) stroke(50,100,80,50);
    //if (color == 1) stroke(50,80,100,50);
    //if (color == 2) stroke(100,50,50,50);
    if (!pmode) col.setAlpha(20);
    stroke(col);
    //circle(pos.x*h,pos.y*w,10.);
    //stroke(0,0,0,100);
    if (lin) line(pos.x*w, pos.y*h, prevpos.x*w, prevpos.y*h);
    else point(pos.x*h, pos.y*h);
  }
}

function scatteredPoints() {
  //if (t>100) return;
  stroke(0,0,0,0);
  for (let i = 0; i< 500*aspect; i++) {
    let x = random() -.5;
    let y = random() -.5;
    let p = createVector(x*aspect,y);
    let n = norma(p);
    let d = de(p);
    //color = pow(color,5);
    color=color*70;
    //fill(color+0,color+0,color+50,15);
    fill(color+10*r,color+10*g,color+10*b,30);
    //square(x*w,y*h,5);
  }
}
