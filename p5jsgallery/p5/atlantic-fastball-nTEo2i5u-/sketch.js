let myShader;
let graphics;
let shapes = [];
let backgroundShapes = [];
let backgroundColor;

const colorPalettes = [
  {name: "Sunset", colors: ["#FFD700", "#FF6347", "#8B0000", "#4B0082"]},
  {name: "Ocean", colors: ["#00FFFF", "#1E90FF", "#000080", "#FFFFFF"]},
  {name: "Forest", colors: ["#006400", "#228B22", "#7CFC00", "#FFFFF0"]},
  {name: "Pastel", colors: ["#FFB6C1", "#FF69B4", "#87CEFA", "#00CED1"]},
  {name: "Autumn", colors: ["#FFD700", "#FF4500", "#8B4513", "#F0F8FF"]},
  {name: "Neon", colors: ["#00FFFF", "#FF00FF", "#00FF00", "#FF1493"]},
  {name: "Earthy", colors: ["#8B4513", "#556B2F", "#F4A460", "#FFFAF0"]},
  {name: "Berry", colors: ["#8B0000", "#FF0000", "#FF69B4", "#FFE4E1"]},
  {name: "Monochrome", colors: ["#000000", "#696969", "#D3D3D3", "#FFFFFF"]},
  {name: "Jewel", colors: ["#4B0082", "#8A2BE2", "#00FFFF", "#FFFAFA"]},
  // Nuevas paletas
  {name: "Tropical", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FDFFFC"]},
  {name: "Retro", colors: ["#EF476F", "#FFD166", "#06D6A0", "#073B4C"]},
  {name: "Cosmic", colors: ["#2E294E", "#541388", "#F1E9DA", "#FFD400"]},
  {name: "Candy", colors: ["#FF1493", "#00FF00", "#FF69B4", "#1E90FF"]},
  {name: "Desert", colors: ["#ED7B5A", "#F4A261", "#2A9D8F", "#264653"]},
  {name: "Arctic", colors: ["#E3F2FD", "#90CAF9", "#42A5F5", "#1565C0"]},
  {name: "Volcano", colors: ["#FF4500", "#FF8C00", "#FFD700", "#1A1A1A"]},
  {name: "Cyberpunk", colors: ["#FF00FF", "#00FFFF", "#FF1493", "#000000"]},
  {name: "Vintage", colors: ["#8D6B94", "#D3BCC0", "#A5668B", "#FDF0DD"]},
  {name: "Neon Nights", colors: ["#00FF00", "#FF00FF", "#00FFFF", "#101010"]}
];
function preload() {
  myShader = loadShader('vertex.vert', 'fragment.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  graphics = createGraphics(width, height);
  windowResized(); // Initial call to set up the artwork
}

function draw() {
  // Clear the graphics buffer
  graphics.clear();
  
  // Redraw the artwork with updated positions
  drawArtwork();
  
  // Apply the shader
  shader(myShader);
  
  // Set the shader uniforms
  myShader.setUniform('uTexture', graphics);
  myShader.setUniform('uTime', frameCount * 0.01);
  
  // Draw a plane to fill the canvas
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  graphics.resizeCanvas(width, height);
  shapes = []; // Clear existing shapes
  backgroundShapes = []; // Clear existing background shapes
  setupShapes(); // Re-setup shapes for new canvas size
}

function setupShapes() {
  let colors = selectRandomPalette();
  backgroundColor = color(random(20, 50)); // Dark background color
  
  // Setup background shapes (non-moving)
  setupBackgroundShapes(colors);
  
  // Setup shapes for the left half
  setupHalfShapes(0, 0, graphics.width/2, graphics.height, colors);
  
  // Setup shapes for the right half
  setupHalfShapes(graphics.width/2, 0, graphics.width/2, graphics.height, colors);
}

function setupBackgroundShapes(colors) {
  // Left background rectangle
  backgroundShapes.push(new Shape('rect', 0, 0, graphics.width/2, graphics.height, colors.background, false));
  
  // Right background rectangle
  backgroundShapes.push(new Shape('rect', graphics.width/2, 0, graphics.width/2, graphics.height, colors.background, false));
}

function setupHalfShapes(x, y, w, h, colors) {
  // Space-filling shapes
  setupSpaceFilling(x, y, w, h, colors.shapes, 5);
  
  // Concentric circles with variable quantity
  let numConcentricGroups = floor(random(3, 8)); // Variable number of concentric circle groups
  for (let i = 0; i < numConcentricGroups; i++) {
    let cx = random(x, x + w);
    let cy = random(y, y + h);
    let maxSize = random(min(w, h) * 0.05, min(w, h) * 0.5); // Variable max size
    setupConcentricCircles(cx, cy, maxSize, shuffleArray(colors.shapes));
  }
  
  // Additional shapes
  for (let i = 0; i < 5; i++) {
    if (random() > 0.5) {
      shapes.push(new Shape('triangle', 
        random(x, x + w), random(y, y + h),
        random(x, x + w), random(y, y + h),
        random(x, x + w), random(y, y + h),
        random(colors.shapes)
      ));
    } else {
      shapes.push(new Shape('quad',
        random(x, x + w), random(y, y + h),
        random(x, x + w), random(y, y + h),
        random(x, x + w), random(y, y + h),
        random(x, x + w), random(y, y + h),
        random(colors.shapes)
      ));
    }
  }
}

function setupSpaceFilling(x, y, w, h, colors, depth) {
  if (depth <= 0 || (w < 10 && h < 10)) {
    return;
  }
  
  if (random() < 0.5) {
    // Divide horizontally
    let splitY = y + random(0.3, 0.7) * h;
    setupSpaceFilling(x, y, w, splitY - y, colors, depth - 1);
    setupSpaceFilling(x, splitY, w, y + h - splitY, colors, depth - 1);
  } else {
    // Divide vertically
    let splitX = x + random(0.3, 0.7) * w;
    setupSpaceFilling(x, y, splitX - x, h, colors, depth - 1);
    setupSpaceFilling(splitX, y, x + w - splitX, h, colors, depth - 1);
  }
  
  // Add a shape in this section
  let shapeType = floor(random(4));
  switch(shapeType) {
    case 0: // Circle
      shapes.push(new Shape('circle', x + w/2, y + h/2, min(w, h) * 0.6, random(colors)));
      break;
    case 1: // Triangle
      shapes.push(new Shape('triangle', x, y + h, x + w/2, y, x + w, y + h, random(colors)));
      break;
    case 2: // Rectangle
      shapes.push(new Shape('rect', x + w*0.2, y + h*0.2, w*0.6, h*0.6, random(colors)));
      break;
    case 3: // Ellipse
      shapes.push(new Shape('ellipse', x + w/2, y + h/2, w*0.6, h*0.6, random(colors)));
      break;
  }
}

function setupConcentricCircles(x, y, maxSize, colors) {
  let size = maxSize;
  let numCircles = floor(random(2, 6)); // Variable number of concentric circles
  for (let i = 0; i < numCircles; i++) {
    shapes.push(new Shape('circle', x, y, size, colors[i % colors.length]));
    size -= random(size * 0.3, size * 0.5);
    if (size < 2) break;
  }
}

function drawArtwork() {
  graphics.background(backgroundColor);
  
  // Draw background shapes first (non-moving)
  for (let shape of backgroundShapes) {
    shape.draw();
  }
  
  // Then draw moving shapes
  for (let shape of shapes) {
    shape.draw();
  }
}

class Shape {
  constructor(type, ...args) {
    this.type = type;
    this.args = args;
    this.frequency = random(0.01, 0.05);
    this.amplitude = random(5, 10);
    this.phase = random(TWO_PI);
    this.moving = args[args.length - 1] !== false; // Check if the shape should move
    if (!this.moving) {
      this.args.pop(); // Remove the 'false' from the end of args
    }
  }
  
  draw() {
    graphics.push();
    if (this.moving) {
      let offset = sin(frameCount * this.frequency + this.phase) * this.amplitude;
      graphics.translate(offset, 0);
    }
    graphics.fill(this.args[this.args.length - 1]);
    graphics.noStroke();
    
    switch(this.type) {
      case 'rect':
        graphics.rect(...this.args.slice(0, -1));
        break;
      case 'circle':
        graphics.circle(...this.args.slice(0, -1));
        break;
      case 'triangle':
        graphics.triangle(...this.args.slice(0, -1));
        break;
      case 'quad':
        graphics.quad(...this.args.slice(0, -1));
        break;
      case 'ellipse':
        graphics.ellipse(...this.args.slice(0, -1));
        break;
    }
    
    graphics.pop();
  }
}

function selectRandomPalette() {
  let palette = random(colorPalettes);
  return {
    background: color(palette.colors[0]),
    shapes: palette.colors.map(c => color(c))
  };
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[i], array[j]];
  }
  return array;
}

function mousePressed() {
  shapes = [];
  backgroundShapes = [];
  setupShapes();
}