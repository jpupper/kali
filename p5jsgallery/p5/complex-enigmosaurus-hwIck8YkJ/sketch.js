let hash1;
let hash2;
let a=0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  hash1=random();
  hash2=random();
  hash3=random();
  hash4=random();
}

function rnd11(p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}


function draw() {
//  background(220);
  translate(windowWidth/2,windowHeight/2);
  let s=windowWidth;
  fill(0,0,0,0);
  for (let p=0; p<1000; p++){
    let xx=random()-.5;
    let yy=random()-.5;
    let x=xx*.5+.25+.25*hash3;
    let y=yy*.5+.5+.25*hash4;
    let l;
    let m=1000;
    let m2=1000;
    let m3=1000;
    for (let i=0; i<15; i++)
    {
      l=x*x+y*y;
      x=abs(x);
      y=abs(y);
      x/=l;
      y/=l;
      x-=.3+hash1*.7;
      y-=.3+hash2*.7;
      if (i>1) m=min(m,abs(min(x,y)));
      if (i>1) m2=min(m2,abs(x));
      if (i>1) m3=min(m3,abs(y));
      //m=min(m,abs(x));
    }
    m=exp(-100*m);
    xx*=s;
    yy*=s;
    //yy+=abs(xx)*.5;
    stroke(0,0,0,m*500);
    circle(xx,yy,5);
    //point(xx,yy);
    stroke(255,155,150,m2*1000);
    circle(xx,yy,10);
    stroke(155,150,255,m3*1000);
    circle(xx,yy,10);

    
  }

}

