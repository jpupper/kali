// ejemplo simple de dibujo generativo
// cada vez que presiones ctrl-enter genera un dibujo distinto

function fxrand() { // la función de número aleatorio que te da fxhash se llama así
  return random();  // y hay que reemplazar los llamados a random() por fxrand()
}                   // lo mas práctico es hacer esto para no tener que reemplazar después

// defino las variables del dibujo
let cantCirculos;
let radioCirculos;
let distanciaCirculos;
let tonoBaseCirculos;
let cantCuadrados;
let radioCuadrados;
let distanciaCuadrados;
let tonoBaseCuadrados;

function setup() {
  // dimensiono el canvas para que ocupe toda la ventana actual
  createCanvas(windowWidth, windowHeight);
  
  // el modo para establecer los colores en las funciones de color
  // el HSB son tres valores: tono, saturación y brillo
  // el 1 es la escala que voy a usar, sería de 0 a 1 para cada valor
  // por ejemplo fill(0.5, 0.5, 1) para definir el color del interior de las figuras, 
  // sería usar el tono en 0,5 con una saturación de color de 0,5 y el brillo en 1 (máximo)
  colorMode(HSB, 1);

  // asigno las variables del dibujo
  
  // la cantidad de círculos a dibujar
  // como fxrand() devuelve entre 0 y 1, si hago 4 + fxrand() * 6, va a variar entre 4 y 10
  // pero uso floor() que es para redondear para abajo porque quiero números enteros
  cantCirculos = 4 + floor(fxrand() * 6);
  
  // el tamaño de los circulos, va a oscilar entre 50 y 150
  radioCirculos = 50 + fxrand() * 100;
  
  // la distancia desde el centro de los círculos, va a oscilar entre 50 y 150
  distanciaCirculos = 50 + fxrand() * 100;
  
  // el tono de color en el que arrancan los circulos como es entre 0 y 1 va simplemente
  // fxrand(), después va a variar un poco el tono a medida que los dibujo
  tonoBaseCirculos = fxrand();
  
  // lo mismo pero para los cuadrados
  cantCuadrados = 4 + floor(fxrand() * 6);
  radioCuadrados = 100 + fxrand() * 100;
  distanciaCuadrados = 150 + fxrand() * 100;
  tonoBaseCuadrados = fxrand();

}

function draw() {
  // asigno el color blanco al fondo (cero saturacion de color, maximo brillo)
  background(0, 0, 1);
  
  // defino el color del trazo exterior de las figuras como transparente
  // el ultimo 0 define la transparencia, por lo tanto el trazo no se ve
  stroke(0,0,0,0);
  
  // traslado las coordenadas al centro del canvas, haciendo que las coordenadas 0,0
  // sean el centro justo de la ventana, y que las rotaciones tengan ese punto como eje
  translate(windowWidth/2, windowHeight/2);
  
  // bucle para dibujar los circulos
  for (let i=0; i<cantCirculos; i++) {
    // rotacion en cada iteración, haciendo 360 divido la cantidad, obtengo el ángulo
    // para cada paso. Hay que pasarlo a radianes, por eso la función radians()
    // lo hice en grados para que se entienda mejor
    rotate(radians(360/cantCirculos));
    
    // establezco el color de los círculos de la siguiente forma:
    // el tono base al azar + un incremento según la variable i del for,
    // después le puse 0.5 de saturación de color (la mitad)
    // y 0.8 de brillo
    fill((tonoBaseCirculos + i * 0.2) % 1, 0.5, 0.8);
    
    // dibujo el círculo, como las coordenadas están actualmente ubicadas en 0,0
    // indico que dibuje a una distancia en el eje Y igual a la distancia desde el centro
    // que definí anteriormente, con un radio o tamaño también definido al azar.
    circle(0,distanciaCirculos,radioCirculos);
  }
  
  // esto es lo mismo pero para los cuadrados
  for (let i=0; i<cantCuadrados; i++) {
    rotate(radians(360/cantCuadrados));
    fill((tonoBaseCuadrados + i * 0.2) % 1, 0.5, 0.8);
    square(0,distanciaCuadrados,radioCuadrados);
  }

}
