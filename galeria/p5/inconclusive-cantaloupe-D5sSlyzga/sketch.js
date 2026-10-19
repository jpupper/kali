let cnv;

function setup() {
  cnv = createCanvas(500, 500);
}

function draw() {
  background(255);
  color(0);
  circle(200, 200, 200);
  loadPixels();
  floodfill(200,200, color(255), color(0));
  noLoop();
}

function floodfill(x, y, targetColor, replaceColor) {
  q = [];
  q.push({x: x, y: y});
  let i=0;
  do  {
    i++;
    if (x>windowWidth || x<0) continue;
    if (y>windowHeight || y<0) continue;
    let p = q[0];
    q.shift();
    let pos = getPos(p.x, p.y);
    let r = pixels[pos];
    let g = pixels[pos+1];
    let b = pixels[pos+2];
    let tr = red(targetColor);
    let tg = green(targetColor);
    let tb = blue(targetColor);
    if (r == tr && g == tg && b == tb) {
      stroke(replaceColor);
      point(p.x, p.y);
      q.push({x: p.x+1, y: p.y});
      q.push({x: p.x-1, y: p.y});
      q.push({x: p.x, y: p.y+1});
      q.push({x: p.x, y: p.y-1});
    }
  } while (q.length && i<1000)
}

function getPos(x, y) {
      return (x + (y * windowWidth)) * 4;
}