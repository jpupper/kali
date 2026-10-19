let xpos = 1080;
let height = 60;

function setup() {
  colorMode(RGB);
  randomSeed(99999999);

  createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
  frameRate(25);
  background(10, 80, 100);
}

function draw() {
  if (mouseIsPressed) {
    rect(xpos, 50, 20, height);
    xpos = xpos - 1;
    height = height - 1;
    rect(xpos, 300, 200, height);
    xpos = xpos - 1;
    height = height - 1;
    rect(xpos, 10, 12, height);
    xpos = xpos - 1;
    height = height - 1;
    ellipse(xpos, 150, 400, height);
    xpos = xpos - 1;
    height = height + 5;

    let color1 = color(194, 252, 234);
    let color2 = color(mouseX, mouseY, 100);
    let interColor = lerpColor(color1, color2, 0.5);
    fill(interColor);
    ellipse(190, 200, 70, 40);

    fill(mouseX, mouseY, 100);
    rect(mouseX, mouseY, 95, 658);
  } else {
    fill(148, 45, 215);
    noStroke();
    fill(250, PI, mouseY, mouseX);

    stroke(148, 45, 215);
    fill(mouseY, mouseX, 100);
    ellipse(50, 40, 100, 100);

    ellipse(450, 400, 100, 100);
    ellipse(450, mouseY, mouseX, PI);
  }
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("myCanvas", "png");
  }
  if (key === "r" || key === "R") {
    background(10, 80, 100);
    xpos = 600;
    height = 60;
  }
  fxpreview;
}
