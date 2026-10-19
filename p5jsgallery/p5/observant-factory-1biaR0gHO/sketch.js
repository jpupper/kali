let cnv;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  background(255);
}

let i=0;

function draw() {
  i++;
  stroke(0);
  fill(0, 0);
  let x = floor(random(width));
  let y = floor(random(height));
  if (i<100) circle(x, y, random(windowWidth, windowWidth * 2));
  else floodfill(x, y, color(255), color(random(255),random(255),random(255)), 100);
  //noLoop();
}

function floodfill(x, y, targetColor, replaceColor, tolerance) {
  let rr = red(replaceColor);
  let rg = green(replaceColor);
  let rb = blue(replaceColor);
  let tr = red(targetColor);
  let tg = green(targetColor);
  let tb = blue(targetColor);
  let q = [];
  q.push({x: x, y: y});
  loadPixels();
  let it=0;
  do  {
    it++;
    let p = q[0];
    q.shift();
    if (p.x>=width || p.x<0) continue;
    if (p.y>=height || p.y<0) continue;
    let pos = getPos(p.x, p.y);
    let r = pixels[pos];
    let g = pixels[pos+1];
    let b = pixels[pos+2];
    if (abs(r-tr) <= tolerance && abs(g-tg) <= tolerance && abs(b-tb) <= tolerance) {
      pixels[pos] = rr;
      pixels[pos+1] = rg;
      pixels[pos+2] = rb;
      q.push({x: p.x+1, y: p.y});
      q.push({x: p.x-1, y: p.y});
      q.push({x: p.x, y: p.y+1});
      q.push({x: p.x, y: p.y-1});
    }
  } while (q.length)
  updatePixels();
}

function getPos(x, y) {
      return (x + y * width) * 4;
}