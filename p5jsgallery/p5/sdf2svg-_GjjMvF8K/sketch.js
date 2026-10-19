// SDF2SVG by Kali Shade
// Converts a 2D SDF to a SVG file by tracing it's borders
// It shows the SVG at the end and downloads it

// Could fail with some geometries but this parameters can be adjusted 
// if there are missing parts, duplicated traces or it gets stuck
// (I'll try to find a way to avoid the trace getting stuck)
let res=30; // scanning grid spacing, decrease it if there are missing parts
let minDist=0.001; // distance threshold to sdf border
let epsilon = 0.0001; // displacement for sdf gradient calculation
let stepSize = 0.2; // trace step amount, decrease if it gets stuck, increase to speed up
let alreadyTracedDist = 3; // search area for traced regions, increase if duplicated paths
let sdfSubstract = 1; // it substracts this from the SDF to avoid getting stuck in some corners
let lineWidth = 1;

// globals
let trazosCounter=0;
let k=0;
let l=0;
let kp=0;
let points = [];
let x, y;
let found=false;
let p, p0, p1, p2;

// SVG variables
let svg;
let path;
let pathData = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  stroke(0);
  strokeWeight(lineWidth);
  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  print("scanning...");
}


function draw() {
  translate(width/2, height/2);
  if (y>height) { // terminó de escanear
    noLoop();
    print("done");
    print(trazosCounter + " traces");
    print(points.length + " points");
    /*
    stroke(0,0,255);
    background(255);
    for (let i=0; i<points.length; i++) { // pinta los puntos del array
      let po=points[i];
      point(po.x, po.y);
    }
    */
    print("generating SVG...");
    document.getElementById("defaultCanvas0").remove();
    document.body.style.backgroundColor = "white";
    document.body.appendChild(svg);
    descargarSVG();
    print("done");
    noLoop();
    return;
  }
  for (let i=0; i<10 && !found; i++) { // iterate scanning grid points (10xframe)
    x = (k % (width/res)) * res; // get current point coordinates
    y = (floor(k / (width/res))) * res; // ^^
    k++; // next point
    //x = random(width); 
    //y = random(height);
    p = createVector(x - width / 2, y - height / 2); // origin vector

    for (let a=0; a<5; a++) { // "raymarching" to the border following gradient 
      let d=sdf(p);           // (some steps in case the sdf is not exact)
      if (d<minDist) break;
      p.sub(nor(p).mult(d)); 
    } 
    
    pf = createVector(round(p.x), round(p.y)); // get integer values to search for duplicates
    
    if (!alreadyTraced(pf)) { // if area is not already traced
      let d = sdf(p); // get sdf distance
      if (abs(d)<minDist) { // check if it's in the border
        trazosCounter++;
        print("path #" + trazosCounter + " started");
        p0 = p.copy();
        p1 = p.copy();
        found=true;
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none"); 
        path.setAttribute("stroke", "black"); 
        path.setAttribute("stroke-width", lineWidth.toString()); 
        pathData = "M "
        break;
      }
    }
  }  
  if (found) { // border found, trace
    for (let j=0; j<500; j++) { // do 500 trace iterations per frame
      l++;
      let n = nor(p); // get "normal", but I think is called gradient in 2D
      let nr = n.rotate(radians(90)); // vector parallel to the gradient
      let p2 = p.copy();
      p2.add(nr.mult(stepSize)); // advance trace in gradient direction
      for (let i=0; i<5; i++) { // readjust position, some steps in case sdf is not exact
        p2.sub(n.mult(sdf(p2))); 
      }
      p=p2.copy();
      if (l>10/stepSize && createVector(p0.x-p.x, p0.y-p.y).mag()<3)       { 
        // if trace advanced some length and it gets close to the starting point, close path
        l=0;
        found=false;
        pathData += (p0.x + width/2) + "," + (p0.y + height/2) + " Z ";
        path.setAttribute("d", pathData);
        svg.appendChild(path);
        print("path ended");
        print("scanning...");
        break;
      }
      // if trace advanced an integer amount (pixel), save new point and draw the line
      if (abs(round(p1.x)-round(p2.x))>=1||abs(round(p1.y)-round(p2.y))>=1) { 
        let pf=createVector(round(p2.x), round(p2.y));
        points.push(pf); 
        pathData += (p2.x + width/2) + "," + (p2.y + height/2) + " L ";
        line(p1.x, p1.y, p2.x, p2.y);
        p1=p2.copy(); // actual point is now the origin of next segment
      }
    }
  }
}

// fractal SDF
function sdf(p2) {
  let sc=2;
  let p = p2.copy();
  let d=1000;
  let s=1;
  let side=p.x;
  let top=p.y;
  for (let i=0; i<6; i++) {
    p.set(abs(p.x),abs(p.y));
    p.add(-200,-200);
    p.mult(sc);
    s*=sc;
    let box=createVector(max(0,abs(p.x)-200), max(0,abs(p.y)-200));
    if (side>0) d=min(d,(box.mag())/s); 
    else d=min(d,(p.mag()-180)/s); 
    if (top<0) sc=2.5;
  }
  return d-sdfSubstract; // always substract a bit because otherwise sometimes it fails lol
}

// fractal SDF (squares)
function sdf2(p2) {
  let sc=2;
  let p = p2.copy();
  let d=1000;
  let s=1;
  for (let i=0; i<5; i++) {
    p.set(abs(p.x),abs(p.y));
    p.add(-200,-200);
    p.mult(sc);
    s*=sc;
    let box=createVector(max(0,abs(p.x)-200), max(0,abs(p.y)-150));
    d=min(d,(box.mag())/s); 
  }
  return d-sdfSubstract;
}


// simple 2 circles sdf, rename to use this
function sdf3(p2) {
  let p0 = p2.copy();
  let d1 = p0.mag() - 100;
  p0.add(200,200);
  let d2 = p0.mag() - 50;
  return min(d1,d2);
}


// normal/gradient or whatever is called
function nor(p) {
  let p1 = p.copy();
  let p2 = p.copy();
  let p3 = p.copy();
  let p4 = p.copy();
  p1.add(epsilon, 0);
  p2.add(-epsilon, 0);
  p3.add(0, epsilon);
  p4.add(0, -epsilon);
  let d1 = sdf(p1);
  let d2 = sdf(p2);
  let d3 = sdf(p3);
  let d4 = sdf(p4);
  let dx = d1-d2;
  let dy = d3-d4;
  //let d = sdf(p);
  let n = createVector(dx, dy);
  //n.sub(createVector(d, d));
  n.normalize();
  return n;
}

// check around if zone is already traced
function alreadyTraced(po) { 
  for(let yy=-alreadyTracedDist; yy<alreadyTracedDist; yy++) {
    for(let xx=-alreadyTracedDist; xx<alreadyTracedDist; xx++) {
      if (points.some(pp => pp.x == po.x + xx && pp.y == po.y + yy)) {
        return true;
      }
    }  
  }
  return false;
}

// save SVG
function descargarSVG() {
  var svgElement = document.querySelector("svg");
  var svgString = new XMLSerializer().serializeToString(svgElement);
  var enlaceDescarga = document.createElement("a");
  enlaceDescarga.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString));
  enlaceDescarga.setAttribute("download", "archivo.svg");
  enlaceDescarga.click();
}