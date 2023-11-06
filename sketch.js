let skyColorsFrom = [];
let skyColorsTo = [];
let skyColorsLerpA = [];
let skyColorsLerpB = [];
let skyColorsLerpC = [];
let skyColorsLerpD = [];

let skyEllipse = [];
let skyLerpEllipseA = [];
let skyLerpEllipseB = [];
let skyLerpEllipseC = [];
let skyLerpEllipseD = [];

let brushWidth;
let brushAmount;

let inc = 0.1;
let scl; //segmet size
let cols, rows;

let waterColorsFrom = [];
let waterColorsTo = [];
let waterColorsLerpA = [];
let waterColorsLerpB = [];
let waterColorsLerpC = [];
let waterColorsLerpD = [];

let unitX;
let unitY;
let w;
let h;

let polyShadow;
let polyBlurry1; //the transition part between building and distant building
let polyBlurry2; //the distant building

let song;
let button;

function preload() {
  song = loadSound("audio/drums.mp3"); // Preload the audio file
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  button = createButton("Play"); // Create a play button
  button.mousePressed(toggleSong); // Add mouse press event to the button
  button.size(70);

  fft = new p5.FFT(0.3, 32); // Create a new FFT analysis object

  // Define the color arrays for lerpColor().
  // The colors are: [0]navy blue, [1]sea green, [2]bright yellow, [3]orange red, [4]dark red
  skyColorsFrom.push(
    color(62, 84, 143),
    color(125, 155, 147),
    color(255, 214, 101),
    color(193, 113, 67),
    color(205, 74, 74)
  );

  // The colors are: [0]sea green, [1]bright yellow, [2]orange red, [3]dark red
  skyColorsTo.push(
    color(125, 155, 147),
    color(255, 214, 101),
    color(193, 113, 67),
    color(205, 74, 74)
  );

  // The colors are: [0]orange red, [1]bright yellow, [2]sea green, [3]navy blue
  waterColorsFrom.push(
    color(193, 113, 67),
    color(255, 214, 101),
    color(125, 155, 147),
    color(62, 84, 143)
  );

  // The colors are: [0]dark red, [1]orange red, [2]bright yellow, [3]sea green
  waterColorsTo.push(
    color(205, 74, 74),
    color(193, 113, 67),
    color(255, 214, 101),
    color(125, 155, 147)
  );

  // The brushWidth of the ellipse is 1/64 of the height of canvas.
  brushWidth = height / 64;

  // The amount of brush is the window's width divides the brush's width.
  brushAmount = width / brushWidth;

  scl = windowHeight / 140; //size of segment

  cols = windowWidth / scl;
  rows = windowHeight / scl;

  w = windowWidth;
  h = windowHeight;
  unitX = w / 32; // unit coordinate for x
  unitY = h / 32; // unit coordinate for y

  button.position(unitX, unitY);

  // Generate four sets of sky colors
  generateColor(1, skyColorsLerpA, 0, 8);
  generateColor(1, skyColorsLerpB, 1, 8);
  generateColor(1, skyColorsLerpC, 2, 8);
  generateColor(1, skyColorsLerpD, 3, 8);

  // Generate four sets of water surface colors
  generateColor(2, waterColorsLerpA, 0, 9);
  generateColor(2, waterColorsLerpB, 1, 9);
  generateColor(2, waterColorsLerpC, 2, 9);
  generateColor(2, waterColorsLerpD, 3, 9);

  shadow(); // the shadow of the building on the water
  blurryBg1(); // transition
  blurryBg2(); // distant building
}

function draw() {
  // Request fresh data from the FFT analysis
  let spectrum = fft.analyze();

  let k = map(spectrum.length, 0, 255, 5, 10);

  // Pass values of the spectrum to the function that needs to be animated
  for (let i = 0; i < k; i++) {
    drawSkyEllipse(spectrum[i]);
    waterSurface(spectrum[i]);
    building(spectrum[i]);
    waterColor(polyShadow, 71, 41, 50, round(spectrum[i] / 30), spectrum[i]);
    waterColor(polyBlurry1, 20, 70, 10, round(spectrum[i] / 30), spectrum[i]);
    waterColor(polyBlurry2, 40, 90, 30, round(spectrum[i] / 30), spectrum[i]);
  }
}

// Draw the building
function building(spectrum) {
  strokeWeight(2);
  stroke(43, 49, 45);
  let amplitude = map(spectrum, 0, 255, 0, -100);
  let unitH = unitY + amplitude / 8;
  let r = map(spectrum, 0, 255, 0, 71);
  let c1 = color(r, 41, 50);
  let c2 = color(43, r, r);
  let col = lerpColor(c1, c2, random(10));
  fill(col);

  // Use vertexes to connect the closed building
  beginShape();
  vertex(0, 16 * unitY);
  vertex(0, 13.8 * unitH);
  vertex(unitX, 13.8 * unitH);
  vertex(2 * unitX, 11 * unitH);
  vertex(3 * unitX, 11 * unitH);
  vertex(3.4 * unitX, 9 * unitH);
  vertex(4 * unitX, 11 * unitH);
  vertex(4.7 * unitX, 10.5 * unitH);
  vertex(4.7 * unitX, 4 * unitH);
  vertex(4.9 * unitX, 4 * unitH);
  vertex(5.15 * unitX, 0.5 * unitH);
  vertex(5.35 * unitX, 0.5 * unitH);
  vertex(5.75 * unitX, 3 * unitH);
  vertex(6 * unitX, 4 * unitH);
  vertex(6 * unitX, 11 * unitH);
  vertex(6.25 * unitX, 9 * unitH);
  vertex(7 * unitX, 8 * unitH);
  vertex(7.5 * unitX, 7 * unitH);
  vertex(8 * unitX, 8 * unitH);
  vertex(8.7 * unitX, 9 * unitH);
  vertex(8.7 * unitX, 10 * unitH);
  vertex(10 * unitX, 10 * unitH);
  vertex(10.5 * unitX, 11 * unitH);
  vertex(11.2 * unitX, 10 * unitH);
  vertex(11.5 * unitX, 11 * unitH);
  vertex(12 * unitX, 12 * unitH);
  vertex(13 * unitX, 13.8 * unitH);
  vertex(15 * unitX, 13.8 * unitH);
  vertex(16 * unitX, 16 * unitY);
  endShape(CLOSE);
}

// Draw the water surface
function waterSurface(spectrum) {
  push(); // Save the current graphics state
  randomSeed(45); // Set the seed for random number generation to ensure consistent random sequences on each run
  translate(0, windowHeight / 2);
  let yoff = 0; // Initialize the Y-axis noise offset
  for (let y = 0; y < rows / 2; y++) {
    let xoff = 0; // Initialize the X-axis noise offset
    for (let x = 0; x < cols; x++) {
      // Generate an angle using the noise function to create the ripple effect on the water surface
      let angle = noise(xoff, yoff) * TWO_PI;
      // Create a vector based on the angle for drawing lines in the water surface
      let v = p5.Vector.fromAngle(angle * -0.2);
      xoff = spectrum * inc; // Adjust the X-axis noise offset based on the spectrum value for a dynamic effect
      noStroke();
      push();
      translate(x * scl, y * scl); // Translate to the current position
      rotate(v.heading()); // Rotate according to the direction of the vector
      rect(0, 0, 23, 4); // Draw a rectangle representing a line in the water surface
      pop();
    }

    // Choose colors based on the range of Y values to simulate different depths and wave effects
    if (y < 14) {
      fill(waterColorsLerpA[y % 8]);
    } else if (y >= 14 && y < 27) {
      fill(waterColorsLerpB[y % 8]);
    } else if (y >= 27 && y <= 50) {
      fill(waterColorsLerpC[y % 8]);
    } else {
      fill(waterColorsLerpD[y % 8]);
    }
    yoff += spectrum * inc; // Adjust the Y-axis noise offset based on the spectrum value for a dynamic effect
  }

  pop(); // Restore the previous graphics state
}

// Draw the shadow of the building on the water
function shadow() {
  const v = [];
  v.push(createVector(0, 15.5 * unitY));
  v.push(createVector(unitX, 15.5 * unitY));
  v.push(createVector(3 * unitX, 15 * unitY));
  v.push(createVector(4.9 * unitX, 15 * unitY));
  v.push(createVector(4.9 * unitX, h));
  v.push(createVector(6.5 * unitX, h));
  v.push(createVector(6.5 * unitX, 14.5 * unitY));
  v.push(createVector(8 * unitX, 15 * unitY));
  v.push(createVector(10 * unitX, 14.8 * unitY));
  v.push(createVector(11.2 * unitX, 15.2 * unitY));
  v.push(createVector(12 * unitX, 15.3 * unitY));
  v.push(createVector(15 * unitX, 14.3 * unitY));
  v.push(createVector(15.5 * unitX, 15.5 * unitY));
  polyShadow = new Poly(v);
}

// Draw the transition part between building and distant building
function blurryBg1() {
  const v = [];
  v.push(createVector(16 * unitX, 16 * unitY));
  for (let i = 0; i < random(5); i++) {
    let xScale = random(16, 24);
    let yScale = random(15, 16);
    v.push(createVector(xScale * unitX, yScale * unitY));
  }
  v.push(createVector(24 * unitX, 16 * unitY));
  polyBlurry1 = new Poly(v);
}

// Draw the distant building on the right side
function blurryBg2() {
  const v = [];
  v.push(createVector(24 * unitX, 16 * unitY));
  for (let i = 0; i < random(10); i++) {
    let xScale = constrain((random(24, 32) * i) / 2, 24, 32);
    let yScale = random(5, 16);
    v.push(createVector(xScale * unitX, yScale * unitY));
  }
  v.push(createVector(32 * unitX, 16 * unitY));
  polyBlurry2 = new Poly(v);
}

// Defined is a class named Poly, which is used to create and manipulate polygons
// including functions for grow(), dup(), and draw()
class Poly {
  constructor(vertices, modifiers) {
    this.vertices = vertices; // Initialize the Poly object's vertices property with the given vertex array
    if (!modifiers) {
      modifiers = [];
      // If no modifier array is provided, randomly generate modifiers and initialize them in the modifiers array
      for (let i = 0; i < vertices.length; i++) {
        modifiers.push(random(0.01, 0.5));
      }
    }
    this.modifiers = modifiers; // Initialize the Poly object's modifiers property with the given modifier array
  }

  grow() {
    const grownVerts = []; // Store the grown vertices array
    const grownMods = []; // Store the grown modifiers array
    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length; // Index of the next vertex
      const v1 = this.vertices[i]; // Current vertex
      const v2 = this.vertices[j]; // Next vertex

      const mod = this.modifiers[i]; // Current modifier
      const chmod = (m) => {
        return m + (rand() - 0.5) * 0.1; // Modify the modifier, introducing some randomness
      };

      grownVerts.push(v1); // Add the current vertex to the grown vertices array
      grownMods.push(chmod(mod)); // Add the modified modifier to the grown modifiers array

      const segment = p5.Vector.sub(v2, v1); // Calculate the vector between two vertices
      const len = segment.mag(); // Vector length
      segment.mult(rand()); // Randomly scale the vector length

      const v = p5.Vector.add(segment, v1); // Create a new vertex

      segment.rotate(-PI / 2 + ((rand() - 0.5) * PI) / 4); // Randomly rotate the vector
      segment.setMag(((rand() * len) / 2) * mod); // Randomly adjust the vector length
      v.add(segment); // Add the adjusted vector to the new vertex

      grownVerts.push(v); // Add the new vertex to the grown vertices array
      grownMods.push(chmod(mod)); // Add the modified modifier to the grown modifiers array
    }
    return new Poly(grownVerts, grownMods); // Return a new Poly object
  }

  dup() {
    return new Poly(Array.from(this.vertices), Array.from(this.modifiers)); // Duplicate the current Poly object and return it
  }

  draw() {
    beginShape(); // Start drawing the polygon
    for (let v of this.vertices) {
      vertex(v.x, v.y); // Add each vertex of the polygon
    }
    endShape(CLOSE); // End drawing the polygon
  }
}

// Apply grow() and draw() to create a watercolor texture
function waterColor(poly, r, g, b, numLayer, spectrum) {
  let numLayers = numLayer || 5; // Number of layers for the watercolor texture
  fill(r, g, b, (spectrum || 100) - 50);
  noStroke();
  poly = poly.grow().grow();
  for (let i = 0; i < numLayers; i++) {
    if (i == int(numLayers / 3) || i == int((2 * numLayers) / 3)) {
      poly = poly.grow().grow();
    }
    poly.grow().draw();
  }
}

// Generate a random value using the distribute function
function rand() {
  return distribute(random(1));
}

// Modify the distribution of values
function distribute(x) {
  return pow((x - 0.5) * 1.58740105, 3) + 0.5;
}

// Update variables that depend on the size of the window
function updateDimensions() {
  w = width;
  h = height;
  unitX = w / 32;
  unitY = h / 32;

  shadow();
  blurryBg1();
  blurryBg2();
}

// Update variables of waterSurface() function that depend on the size of the window
function updateWater() {
  scl = windowHeight / 140;
  cols = windowWidth / scl;
  rows = windowHeight / scl;
  yoff = 0;
}

// Response window size changes
function windowResized() {
  clear();
  brushWidth = height / 64;
  brushAmount = width / brushWidth;
  button.position(unitX, unitY);
  drawSkyEllipse();
  updateDimensions();
  updateWater();
  resizeCanvas(windowWidth, windowHeight);
}

// Draw the first line of ellipses using lerpColor() and color arrays.
function drawSkyEllipse(spectrum = 0) {
  const temp = spectrum ? spectrum / 50 : 0;
  const brushWidthNew = brushWidth + temp;
  for (let i = 0; i < skyColorsFrom.length; i++) {
    for (let j = 0; j < brushAmount; j++) {
      noStroke();
      fill(skyColorsFrom[i]);
      skyEllipse.push(
        ellipse(
          brushWidthNew / 2 + brushWidthNew * j + temp * 2,
          brushWidthNew / 2 + (height / 8) * i + temp * 2,
          brushWidthNew + temp
        )
      );
    }
  }
  drawEllipse(skyLerpEllipseA, skyColorsLerpA, 1, temp);
  drawEllipse(skyLerpEllipseB, skyColorsLerpB, 9, temp);
  drawEllipse(skyLerpEllipseC, skyColorsLerpC, 17, temp);
  drawEllipse(skyLerpEllipseD, skyColorsLerpD, 25, temp);
}

// generate colors
// type: 1=sky;2=water
// colorLerp: array for colors
// num: number of each array
// r: row
function generateColor(type, colorLerp, num, r) {
  if (type == 1) {
    for (let i = 1; i < r; i++) {
      colorLerp.push(
        lerpColor(skyColorsFrom[num], skyColorsTo[num], i * 0.125)
      );
    }
  } else if (type == 2) {
    for (let i = 1; i < r; i++) {
      colorLerp.push(
        lerpColor(waterColorsFrom[num], waterColorsTo[num], i * 0.125)
      );
    }
  }
}

// draw ellipses between each two basic color lines
// lerpEllipse: An array for ellipses of the sky
// colorArray: each array for sky color
// r: rows
// spectrum: the value of the frequency spectrum
function drawEllipse(lerpEllipse, colorArray, r, spectrum) {
  const brushWidthNew = brushWidth + spectrum * 2;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < brushAmount; j++) {
      fill(colorArray[i]);
      lerpEllipse.push(
        ellipse(
          brushWidthNew / 2 + brushWidthNew * j + spectrum * 2,
          brushWidthNew / 2 + brushWidthNew * (i + r) + spectrum * 2,
          brushWidthNew + spectrum
        )
      );
    }
  }
}

// A function to switch the playing state of the audio
function toggleSong() {
  if (song.isPlaying()) {
    song.pause(); // Pause the audio if it is playing
    button.html("Play"); // Update button text
  } else {
    song.play(); // Play the audio if it is not playing
    button.html("Pause"); // Update button text
  }
}
