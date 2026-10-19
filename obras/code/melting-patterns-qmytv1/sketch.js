let sh;
let pos;
let cnv;
let w, h;
let gfx;
let rand;
let angle;
let derret;
let colrot;
let width;
let dnoise;
let dsin;
let deroffset;
let melt = 0;
let melting = false;

let formuparam;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
  pos = loadShader("base.vert", "bloom.frag");
  formuparam = [fxrand(), fxrand() * 1.5];  
  angle = fxrand() > 0.5? -1 : 1;
  derret = fxrand();
  colrot = 3.1416 * fxrand();
  width = fxrand();
  dsin = fxrand() > 0.5 ? 1 : 0;
  dnoise = fxrand() > 0.5 ? 1 : 0;
  deroffset = fxrand() * 0.3;
}

function setup() {
  pixelDensity(1);
  w = windowWidth;
  h = windowHeight;
  //w=1920;
  //h=1080;
  cnv = createCanvas(w, h, WEBGL);
  gfx = createGraphics(w, h, WEBGL);
  frameRate(30);

  //fps = new FPS();

}

function draw() {
  if (melting) melt++;
  //fps.update();
  sh.setUniform("resolution", [w, h]);
  sh.setUniform("time", millis() / 1000);
  sh.setUniform("formuparam", formuparam);
  sh.setUniform("angle", angle);
  sh.setUniform("derret", derret);
  sh.setUniform("colrot", colrot);
  sh.setUniform("width", width);
  sh.setUniform("dsin", dsin);
  sh.setUniform("dnoise", dnoise);
  sh.setUniform("deroffset", deroffset);
  sh.setUniform("melt", melt*.1);
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
    melting = true;
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
      saveBlob(blob, `melting-patterns-${canvas.width}x${canvas.height}.png`);
    });
  };
}



