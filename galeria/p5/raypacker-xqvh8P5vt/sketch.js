let circles;
let maxRadius = 300;
let minRadius = 10;
let sh;
let heightmap;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  heightmap = createGraphics(width, height);
  heightmap.colorMode(RGB, 1);
  sh.setUniform("resolution", [width, height]);
  circles = new Circles();
  background(0);
}

function draw() {
  for (let i = 0; i < 1000; i++) {
    let ci = new Circle(random(width), random(height), random(10, 300));
    let col = circles.collides(ci);
    if (!col) {
      circles.add(ci);
      ci.draw(heightmap);
    }    
  }
  sh.setUniform("heightmap", heightmap);
  shader(sh);
  rect(0, 0, width, height);
  //image(heightmap, 0, 0);
}

class Circles {
  constructor() {
    this.circles = [];
  }
  add(c) {
    this.circles.push(c);
  }
  collides(ci) {
    let collide = false;
    for (let i = 0; i < this.circles.length; i++) {
      let c = this.circles[i];
      let dX = abs(ci.x - c.x);
      let dY = abs(ci.y - c.y);
      let d = sqrt(dX * dX + dY * dY);
      let dr = (ci.r + c.r) / 2;
      if (d < dr) {
        collide = true
      }
    }
    return collide;
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  draw(canvas) {
    canvas.noStroke();
    canvas.fill(this.r / maxRadius + 0.1);
    canvas.circle(this.x, this.y, this.r);
  }
}