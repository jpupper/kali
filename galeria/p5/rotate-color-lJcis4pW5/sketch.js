/*********************************************************************************

  COLOR ROTATE 
  
  Con ejemplo de uso 

**********************************************************************************/


/* 
  Extiende la clase Vector agregando el método para rotar 
  en cada eje, XY, XZ, YZ (en radianes)
*/

p5.Vector.prototype.rotateAxis = function (angleXY, angleXZ, angleYZ) {
  let vec2D;
  let vec3D = this;
  vec2D = createVector(vec3D.x, vec3D.y);
  vec2D.rotate(angleXY);
  vec3D.set(vec2D.x, vec2D.y, vec3D.z);
  vec2D = createVector(vec3D.x, vec3D.z);
  vec2D.rotate(angleXZ);
  vec3D.set(vec2D.x, vec3D.y, vec2D.y);
  vec2D = createVector(vec3D.y, vec3D.z);
  vec2D.rotate(angleYZ);
  vec3D.set(vec3D.x, vec2D.x, vec2D.y);
  return vec3D;
};


/*
  Extiende la clase Color agregando el método para "rotar" un color
  RGB, tomándolo como si fuera un vector 3D y rota sus componentes
  para cada combinación: red-green, red-blue, green-blue
*/

p5.Color.prototype.rotate = function (angleRG, angleRB, angleGB) {
  let col = this;
  let vec;
  if (col.x == undefined) {
    vec = createVector(col._array[0], col._array[1], col._array[2]);
  } else {
    vec = createVector(col.x, col.y, col.z);
  }
  vec.rotateAxis(angleRG, angleRB, angleGB);
  col.x = vec.x;
  col.y = vec.y;
  col.z = vec.z;
  col.setRed(abs(col.x));
  col.setGreen(abs(col.y));
  col.setBlue(abs(col.z));
  return col;
};

let time = 0;
let col;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);
  colorMode(RGB, 1);
  background(0);
  strokeWeight(2);
  
  // color base 
  col = color(1, 0.8, 0.5, 0.1);
}

function draw() {
  for (let i = 0; i < 10; i++) {
    time += 0.02;
    
    // rota el color para cada iteracion
    col.rotate(0.002, 0.004, 0.006);
    stroke(col);

    // muestra la paleta obtenida con las rotaciones
    line(time * 10, h - 50, time * 10, h); 

    // dibujo
    push();
    translate(w / 2, h / 2);
    rotate(time);
    translate(0, time * 4);
    rotate(-time * 1.7);
    line(0, 0, 200, 0);
    pop();
  }
}
