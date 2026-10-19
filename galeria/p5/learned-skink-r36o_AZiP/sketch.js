function setup() {
  createCanvas(800, 800);
}

function draw() {
 stroke(0,0,0,0);
 translate(400,400);
 for (let p=0; p<1000; p++){
    //background(220);
    let xx=random()-.5;
    let yy=random()-.5;
    let x=xx;
    let y=yy;
    x*=1.;
    y*=1.;
    let s=800;
    let ml=1000;
    let l;
    for (let i=0; i<20; i++) {
      l=x*x+y*y;
      x=abs(x)/l-1.;
      y=abs(y)/l-1.;
      ml=min(ml,l);
    }
    x=abs(x);
    y=abs(y);
    fill(x*100.,50.,y*50.,50);
    circle(xx*s,yy*s,ml*50);
 }
}