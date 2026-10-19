let cnv,res,gfx;
let sh;
let bl;
let save=false;
let acelx = 0;
let acely = 0;
let rotx = 0;
let roty = 0;
let w, h;
let anima=false;
let fx;
let rotation;
let mirror;
let saturation;
let cant;
let back;
let inverted;
let frame;

function preload() {
  sh = loadShader("base.vert", "shader.frag");
}

let ww=0.;
let hh=0.;

// define parameters exposed to collectors
$fx.params([
  {
    id: "seed",
    name: "Seed",
    type: "number",
    options: {
      min: 0,
      max: 1,
      step: .0001
    }
  },
  // {
  //   id: "mode",
  //   name: "Format (1:full/2:portrait/3:landscape)",
  //   type: "number",
  //   options: {
  //     min: 1,
  //     max: 3,
  //     step: 1
  //   }
  // },
  {
    id: "mode",
    name: "Format",
    type: "select",
    default: "Full",
    options: {
      options: ["Full", "Portrait", "Landscape"],
    },
  },
  {
    id: "layers",
    name: "Layers",
    type: "number",
    options: {
      min: 1,
      max: 4,
      step: 1
    }
  },
  {
    id: "rotation",
    name: "Layers rotation (degrees)",
    type: "number",
    options: {
      min: 0,
      max: 360,
      step: 1
    }
  },
  // {
    //   id: "shapes",
    //   name: "Circles",
    //   type: "boolean",
    // },
  {
    id: "shapes_intensity",
    name: "Paint intensity",
    type: "number",
    options: {
      min: 0,
      max: 1,
      step: .1
    }
  },
  {
    id: "shapes_size",
    name: "Lines intensity",
    type: "number",
    options: {
      min: 0,
      max: 1,
      step: .1
    }
  },
  {
    id: "shapes_distortion",
    name: "Lines frequency",
    type: "number",
    options: {
      min: 0,
      max: 1,
      step: .1
    }
  },
  {
    id: "saturation",
    name: "Color saturation",
    type: "number",
    options: {
      min: 0,
      max: 1,
      step: .1
    }
  },
  {
    id: "inverted",
    name: "Inverted",
    type: "boolean",
  },
  // {
  //   id: "mirror",
  //   name: "Mirror",
  //   type: "boolean",
  // },
  {
    id: "framed",
    name: "Framed",
    type: "boolean",
  },
  // {
  //   id: "paper_color_red",
  //   name: "Paper Color (red shift)",
  //   type: "number",
  //   options: {
  //     min: 0,
  //     max: 1,
  //     step: .1
  //   }
  // },
  // {
  //   id: "paper_color_green",
  //   name: "Paper Color (green shift)",
  //   type: "number",
  //   options: {
  //     min: 0,
  //     max: 1,
  //     step: .1
  //   }
  // },
  // {
  //   id: "paper_color_blue",
  //   name: "Paper Color (blue shift)",
  //   type: "number",
  //   options: {
  //     min: 0,
  //     max: 1,
  //     step: .1
  //   }
  // },
])

// get the value of a parameter


function setup() {
  pixelDensity(1);
  
  let mode = $fx.getParam("mode");
  let portrait = false;
  let landscape = false;

  if (mode=="Portrait") {
    portrait = true;
  }
  if (mode=="Landscape") {
    landscape = true;
  }

  if (portrait>.5) {
    ww=.35;
  }
  if (landscape>.75) {
    ww=0.;
    hh=.35;
  }
  w=windowWidth-windowWidth*ww;h=windowHeight-windowHeight*hh;
  //w=833;h=833;
  cnv = createCanvas(w, h);
  gfx1 = createGraphics(w, h, WEBGL);
  fx = $fx.getParam("seed");
  rotation = $fx.getParam("rotation");
  //mirror = $fx.getParam("mirror");
  ca = $fx.getParam("layers");
  saturation = $fx.getParam("saturation");
  inverted = $fx.getParam("inverted");
  //inverted = true;
  frame = $fx.getParam("framed");
  //back=color(170+$fx.getParam("paper_color_red")*80., 170+$fx.getParam("paper_color_green")*80., 170+$fx.getParam("paper_color_blue")*80.);
  back=color(200);
  if (!inverted) blendMode(DARKEST); else blendMode(LIGHTEST);
  document.getElementById("defaultCanvas0").style.position = "fixed";
  document.getElementById("defaultCanvas0").style.left = (windowWidth*ww*.5) + "px";
  document.getElementById("defaultCanvas0").style.top = (windowHeight*hh*.5) + "px";
}

let i=1;
let t=0;
let c=0;
let second=0;

function draw() {
  if (!inverted) background(back);
  else background(0);
 //ca=1;
  stroke(0,0);
  gfx1.shader(sh);
  sh.setUniform("fxrand", fx+i);
  sh.setUniform("second", second);
  sh.setUniform("iTime", t);
  sh.setUniform("iteration", i);
  sh.setUniform("rotation", rotation);
//  sh.setUniform("mirror", mirror ? 1 : 0);
  sh.setUniform("saturation", saturation);
  sh.setUniform("inverted", inverted ? 0 : 1);
  sh.setUniform("cant", ca);
  sh.setUniform("shapes", false);
  // sh.setUniform("shapes", $fx.getParam("shapes"));
  sh.setUniform("shapesIntensity", $fx.getParam("shapes_intensity"));
  sh.setUniform("shapesDistortion", $fx.getParam("shapes_distortion"));
  sh.setUniform("shapesSize", $fx.getParam("shapes_size"));
  //sh.setUniform("cant", 1.);
  sh.setUniform("iResolution", [w,h]);
  sh.setUniform("iChannel0", cnv);
  gfx1.rect(0,0,w,h);
  //scale(0.4);
  image(gfx1,0,0);
//  noLoop();
  t +=.05;
  if (t > 1.4) {
    //rect(10, 10, w - 20, h - 20);
    t = 0;
    i++;
  }
  if (i>ca) {
    blendMode(BLEND);
    noFill();
    if ($fx.getParam("framed")) {
      if (inverted) stroke(255,50); else stroke(0,70);
    }
//    noStroke();
    strokeWeight(6);
    //rect(10, 10, w - 20, h - 20);
    rect(20, 20, w - 40, h - 40);
    //rect(0, 0, w, h);
    fxpreview();
    noLoop();
  }
  //if (i>ca) noLoop();
}

function windowResized() {
  w=windowWidth-windowWidth*ww;h=windowHeight-windowHeight*hh;
  resizeCanvas(w,h);
  gfx1.resizeCanvas(w,h);
  document.getElementById("defaultCanvas0").style.position = "fixed";
  document.getElementById("defaultCanvas0").style.left = (windowWidth*ww*.5) + "px";
  document.getElementById("defaultCanvas0").style.top = (windowHeight*hh*.5) + "px";
  i=1;
  t=0;
  c=0;
  second=0;
  if (!inverted) blendMode(DARKEST); else blendMode(LIGHTEST);
  loop();
}
