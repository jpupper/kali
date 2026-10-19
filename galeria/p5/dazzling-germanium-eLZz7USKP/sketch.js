let sc = 40;
let rows = 20;
let cols = 20;

let points = [];

function setup() {
  createCanvas(800, 800);

  for (let x = 0; x < rows+10; x++)
  {
    points[x] = [];
    for (let y = 0; y < cols+10; y++) {
      let nx = x + (noise(x,y) - 0.5) * 0;
      let ny = y + (noise(x + 100,y + 200) - 0.5) * 0;
      points[x][y] = {x: nx, y: ny, used: false};
    }
  }
  background(50);
  strokeWeight(3);
}

function draw() {
  let sx = floor(random(cols));
  let sy = floor(random(rows));
  let px = sx;
  let py = sy;
  let u = 0;
  let us = 0;
  let used = [];
  beginShape();
  for (let i = 0; i < 20; i++) {
    //console.log(px,py);
    let p = points[px][py];
    vertex(p.x * sc, p.y * sc);
    if (p.used) u++;
    used[us] = {x: px, y: py};
    us++;
    let mx = random() > 0.5 ? 0 : (random() > 0.5 ? 1 : -1);
    let my = random() > 0.5 ? 0 : (random() > 0.5 ? 1 : -1);
    px += mx;
    py += my;
    if (px > cols) px = cols;
    if (py > rows) py = rows;
    if (px < 0) px = 0;
    if (py < 0) py = 0;
    //if (i>3 && (px == sx || py == sy)) break;
  }
//  endShape();
  if (u<20) {
    for (let i=0; i<us; i++) {
      points[used[i].x][used[i].y].used = true;
    }
    endShape();
  }
}