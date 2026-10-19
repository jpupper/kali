let w, h;
let shData;
let shDraw;
let gfxData;
let o1x, o1y;
let o2x, o2y;
let color1;
let color2;
let amplitude;
let angle_xz;
let br,bg,bb;
let r1,r2,r3,r4;
let colball1;
let colball2;
let colball3;
let colball4;
let pattern;
let camheight;
let invert;
let shape;
let bw;

let offsetX;
let density;
let colorScale;
let colorOffset;
let fog;
let grayscale;
let colorvariation;
let fov;
let fps;
let cnv;
let gfx;
let colorRot;
let colorPalette;
let roof;
let camAngleX;
let camAngleY;
let buildscale;
let brightness;
let hei;

let mode;

let i=0;

let resize = false;
let loaded1 = false;
let loaded2 = false;
let savefile = false;
let elem;
let preview = false;

function preload() {
  shData = loadShader("base.vert", "shader.frag", function() {
    loaded1 = true;
  });
  shDraw = loadShader("base.vert", "bloom.frag", function() {
    loaded2 = true;
  });

  frame = fxrand() * 500;
  offsetX = fxrand() * 80 - 40;
  density = 0.85 + fxrand() * 0.07;
  colorScale = fxrand() * 4 - 2;
  colorOffset = fxrand() - 0.5;
  fog = fxrand() * 0.002 + 0.003;
  grayscale = fxrand() > 0.85;
  colorvariation = fxrand() > 0.7 ? 0.5 : 0;
  fov = fxrand(); 
  colorRot = floor(fxrand() * 4);
  colorPalette = fxrand() > 0.5 ? 0 : 1 ;
  colorSky = [fxrand() > 0.5 ? 0 : 1, fxrand() > 0.5 ? 0 : 1, fxrand() > 0.5 ? 0 : 1];
  //colorSky = [0,1,0];
  if (colorSky[0]==1&&colorSky[1]==1&&colorSky[2]==1) colorSky = [0.5,0,1];
  if (colorSky[0]==0&&colorSky[1]==0&&colorSky[2]==0) colorSky = [0.5,0.5,0.5];
  if (colorSky[0]==0&&colorSky[1]==1&&colorSky[2]==0) colorSky = [0.5,0,-1];
  if (colorSky[0]==0&&colorSky[1]==1&&colorSky[2]==1) colorSky = [0.5,0.7,-1];
  roof = fxrand() > 0.5 ? 0 : 1;
  camAngleX = fxrand() > 0.5 ? 0.5 : -0.5;
  camAngleY = floor(fxrand() * 3.9);
  //camAngleY = 3;
  fov = fxrand();
  bw = fxrand() > 0.85 ? 1 : 0;
  //bw = 1;
  buildscale = 0.7 + fxrand() * 0.5;
  mode = fxrand() > 0.5 ? 1 : 0;
  mode = 1;
  brightness = 0.6 + fxrand() * 0.2;
  hei = 6 + fxrand() * 2;
}

function setup() {
  document.getElementById("loader").style.display = "none";
  pixelDensity(1);
  w = windowWidth; h = windowHeight;
  //if (w==h) h*=0.8;
  //w = 833; h = 833;
//  w=min(w,800);
//  h=min(h,800);
  cnv = createCanvas(w, h, WEBGL);
  //cnv = createCanvas(w, h);
  gfxData = createGraphics(w, h, WEBGL);
  //frameRate(10);
  background(0);
  frameRate(10);
}

function draw() {
  i++;
  if (savefile) {
    document.getElementById("progress").innerHTML="GENERATING HIGH RES IMAGE... " + floor((i-20)/6*100) + "%";
  }
  shData.setUniform("time", i);
  shData.setUniform("resolution", [w, h]);
  shData.setUniform("frame", frame);
  shData.setUniform("offsetX", offsetX);
  shData.setUniform("density", density);
  shData.setUniform("colorScale", colorScale);
  shData.setUniform("colorOffset", colorOffset);
  shData.setUniform("fogforce", fog);
  shData.setUniform("grayscale", grayscale);
  shData.setUniform("colorvariation", colorvariation);
  shData.setUniform("fov", fov);
  shData.setUniform("colorPalette", colorPalette);
  shData.setUniform("colorRot", colorRot);
  shData.setUniform("colorSky", colorSky);
  shData.setUniform("roof", roof);
  shData.setUniform("camAngleX", camAngleX);
  shData.setUniform("camAngleY", camAngleY);
  shData.setUniform("buildscale", buildscale);
  shData.setUniform("mode", mode);
  shData.setUniform("brightness", brightness);
  shData.setUniform("height", hei);
  gfxData.shader(shData);
  gfxData.rect(0, 0, w, h);
  if (i>25) {
    if (!preview) {
      fxpreview();
      preview = true;
    }
  if (savefile) {
      savefile=false;
      canvas.toBlob((blob) => {
        saveBlob(blob, `once-and-future-cities-${canvas.width}x${canvas.height}.png`);
      });
    }
    noLoop();
  }
  shDraw.setUniform("resolution", [width, height]);
  //shDraw.setUniform("time", t);
  shDraw.setUniform("invert", invert);
  shDraw.setUniform("bw", bw);
  shDraw.setUniform("tx", gfxData);
  shader(shDraw);  
  rect(0,0,w,h);
  //image(gfxDraw,0,0);
  //noLoop();
}

function windowResized() {
  if (savefile) return;
  resize = true;
  w=windowWidth; h=windowHeight;
  cnv.resize(w, h);  
  gfxData.resizeCanvas(w,h);
  i=0;
  loop();
}

function keyPressed() {
  if (savefile) return;
  if (key.toLowerCase() == "s" || key.toLowerCase() == "w") {
    savefile=true;
    document.getElementById("loader").style.display = "flex";
    if (key.toLowerCase() == "s") h = 1080 * 2; else h = 1080;
    w = 1920 * 2;
    resize=true;
    cnv.resize(w, h);
    gfxData.resizeCanvas(w,h);
    i=20;
    loop();
  };
}

function saveBlob(blob, fileName) {
    document.getElementById("loader").style.display = "none";
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    a.click();
    w = windowWidth; h = windowHeight;
    resize=true;
    cnv.resize(w, h);
    gfxData.resizeCanvas(w,h);
    i=0;
    savefile=false;
    loop();
  };
