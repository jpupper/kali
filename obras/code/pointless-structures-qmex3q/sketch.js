let sh;
let pos;
let cnv;
let w, h;
let frame;
let offsetX;
let fScale;
let colorOffset;
let colorOffset2;
let camrot;
let grayscale;
let lights = 0;
let vel = 0;
let adv = 0;
let gfx;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
  pos = loadShader("base.vert", "bloom.frag");
  frame = fxrand() * 500;
  offsetX = fxrand();
  fScale = fxrand() * 0.3 + 1.6;
  colorOffset = fxrand() - 0.5;
  colorOffset2 = fxrand() - 0.5;
  camrot = fxrand() * 120 - 60;
  grayscale = fxrand() > 0.85;
  colorvariation = fxrand() > 0.7 ? 0.5 : 0.;
}

function setup() {
  pixelDensity(1);
  w = windowWidth;
  h = windowHeight;
  cnv = createCanvas(w, h, WEBGL);
  gfx = createGraphics(w, h, WEBGL);
  frameRate(30);
}

function draw() {
  adv += vel;
  sh.setUniform("resolution", [w, h]);
  sh.setUniform("time", millis() / 1000);
  sh.setUniform("frame", frame);
  sh.setUniform("offsetX", offsetX);
  sh.setUniform("fScale", fScale);
  sh.setUniform("colorOffset", colorOffset);
  sh.setUniform("colorOffset2", colorOffset2);
  sh.setUniform("camrot", camrot);
  sh.setUniform("grayscale", grayscale);
  sh.setUniform("colorvariation", colorvariation);
  sh.setUniform("adv", adv);
  sh.setUniform("lights", lights);
  gfx.shader(sh);
  gfx.rect(0, 0, w, h);
  pos.setUniform("resolution", [w, h]);
  pos.setUniform("time", millis() / 1000);
  pos.setUniform("tx", gfx);
  shader(pos);
  rect(0, 0, w, h);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  gfx.resizeCanvas(w, h);
}

function keyPressed() {
  if (key.toLowerCase() == "m") {
    if (vel < 0.009) vel += 0.003; else vel = 0;
  }
  if (key.toLowerCase() == "l") {
    if (lights) lights = 0; else lights = 1;
  }
  if (key.toLowerCase() == "s") {
    const elem = document.getElementById('defaultCanvas0');
    const saveBlob = (function() {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      return function saveData(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        w = windowWidth; h = windowHeight;
        resizeCanvas(w, h);
        gfx.resizeCanvas(w, h);
        elem.style.visibility = "visible";
        };
    }());
    elem.style.visibility = "hidden";
    w = 1920 * 2; h = 1080 * 2;
    resizeCanvas(w, h);
    gfx.resizeCanvas(w, h);
    draw();
    canvas.toBlob((blob) => {
      saveBlob(blob, `pointless-structure-${canvas.width}x${canvas.height}.png`);
    });
  };
}



