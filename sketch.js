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
let unitH;
let unitH1;

function preload() {
  song = loadSound("audio/drums.mp3"); // Preload the audio file
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  button = createButton("Play"); // Create a play button
  button.mousePressed(toggleSong); // Add mouse press event to the button
  button.position(100, 100);
  fft = new p5.FFT(0.3, 32); // Create a new FFT analysis object

  //Define the color arrays for lerpColor().
  //The colors are: [0]navy blue, [1]sea green, [2]bright yellow, [3]orange red, [4]dark red
  skyColorsFrom.push(
    color(62, 84, 143),
    color(125, 155, 147),
    color(255, 214, 101),
    color(193, 113, 67),
    color(205, 74, 74)
  );

  //The colors are: [0]sea green, [1]bright yellow, [2]orange red, [3]dark red
  skyColorsTo.push(
    color(125, 155, 147),
    color(255, 214, 101),
    color(193, 113, 67),
    color(205, 74, 74)
  );

  waterColorsFrom.push(
    color(193, 113, 67),
    color(255, 214, 101),
    color(125, 155, 147),
    color(62, 84, 143)
  );

  waterColorsTo.push(
    color(205, 74, 74),
    color(193, 113, 67),
    color(255, 214, 101),
    color(125, 155, 147)
  );

  //The brushWidth of the ellipse is 1/64 of the height of canvas.
  brushWidth = height / 64;

  //The amount of brush is the window's width divides the brush's width.
  brushAmount = width / brushWidth;

  scl = windowHeight / 140; //size of segment

  cols = windowWidth / scl;
  rows = windowHeight / scl;

  //Build four arrays: skyColorLerp A/B/C/D to contain the lerpColor() results between the
  //skyColorsFrom[] and skyColorsTo[]
  generateColor(1, skyColorsLerpA, 0, 8);
  generateColor(1, skyColorsLerpB, 1, 8);
  generateColor(1, skyColorsLerpC, 2, 8);
  generateColor(1, skyColorsLerpD, 3, 8);

  generateColor(2, waterColorsLerpA, 0, 9);
  generateColor(2, waterColorsLerpB, 1, 9);
  generateColor(2, waterColorsLerpC, 2, 9);
  generateColor(2, waterColorsLerpD, 3, 9);

  w = windowWidth;
  h = windowHeight;
  unitX = w / 32; //unit coordinate for x
  unitY = h / 32; //unit coordinate for y
  unitH = 0;
  unitH1 = 0;

  shadow();
  blurryBg1(); //transition
  blurryBg2(); //distant building
}

function draw() {
  // Request fresh data from the FFT analysis
  let spectrum = fft.analyze();

  // Draw the spectrum to show energy
  for (let i = 0; i < 6; i++) {
    drawSkyEllipse(spectrum[i]);
    waterSurface(spectrum[i]);
    building(spectrum[i]);

    waterColor(polyShadow, 71, 41, 50, round(spectrum[i] / 30), spectrum[i]);
    waterColor(polyBlurry1, 20, 70, 10, round(spectrum[i] / 30), spectrum[i]); //transition
    waterColor(polyBlurry2, 40, 90, 30, round(spectrum[i] / 30), spectrum[i]); //distant building
  }
}

function building(tt) {
  //color of building
  fill(71, 41, 50);
  strokeWeight(2);
  stroke(43, 49, 45);
  const unitH1 = map(tt, 0, 255, 0, -100);
  const unitH = unitY + unitH1 / 8;
  let r = map(tt, 0, 255, 0, 71);
  let c1 = color(r, 41, 50);
  let c2 = color(43, r, r);
  let col = lerpColor(c1, c2, random(10));

  fill(col);

  //the building
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

function waterSurface(spectrum) {
  push();
  randomSeed(45);
  translate(0, windowHeight / 2);
  let yoff = 0;
  for (let y = 0; y < rows / 2; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let angle = noise(xoff, yoff) * TWO_PI;
      let v = p5.Vector.fromAngle(angle * -0.2);
      xoff = spectrum * inc;
      noStroke();
      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      rect(0, 0, 23, 4);
      pop();
    }

    if (y < 14) {
      fill(waterColorsLerpA[y % 8]);
    } else if (y >= 14 && y < 27) {
      fill(waterColorsLerpB[y % 8]);
    } else if (y >= 27 && y <= 50) {
      fill(waterColorsLerpC[y % 8]);
    } else {
      fill(waterColorsLerpD[y % 8]);
    }
    yoff += inc;
  }

  pop();
}

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

class Poly {
  constructor(vertices, modifiers) {
    this.vertices = vertices;
    if (!modifiers) {
      modifiers = [];
      for (let i = 0; i < vertices.length; i++) {
        modifiers.push(random(0.01, 0.5));
      }
    }
    this.modifiers = modifiers;
  }

  grow() {
    const grownVerts = [];
    const grownMods = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length;
      const v1 = this.vertices[i];
      const v2 = this.vertices[j];

      const mod = this.modifiers[i];
      const chmod = (m) => {
        return m + (rand() - 0.5) * 0.1;
      };

      grownVerts.push(v1);
      grownMods.push(chmod(mod));

      const segment = p5.Vector.sub(v2, v1);
      const len = segment.mag();
      segment.mult(rand());

      const v = p5.Vector.add(segment, v1);

      segment.rotate(-PI / 2 + ((rand() - 0.5) * PI) / 4);
      segment.setMag(((rand() * len) / 2) * mod);
      v.add(segment);

      grownVerts.push(v);
      grownMods.push(chmod(mod));
    }
    return new Poly(grownVerts, grownMods);
  }

  dup() {
    return new Poly(Array.from(this.vertices), Array.from(this.modifiers));
  }

  draw() {
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}

function waterColor(poly, r, g, b, numLayer, spectrum) {
  let numLayers = numLayer || 5;
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

function rand() {
  return distribute(random(1));
}

function distribute(x) {
  return pow((x - 0.5) * 1.58740105, 3) + 0.5;
}

// 更新尺寸相关的变量
function updateDimensions() {
  w = width;
  h = height;
  unitX = w / 32;
  unitY = h / 32;

  shadow();
  blurryBg1();
  blurryBg2();
}

function updateWater() {
  scl = windowHeight / 140;
  cols = windowWidth / scl;
  rows = windowHeight / scl;
  yoff = 0;
}

// 响应窗口大小变化
function windowResized() {
  clear();
  brushWidth = height / 64;
  brushAmount = width / brushWidth;
  drawSkyEllipse();
  updateDimensions();
  updateWater();
  resizeCanvas(windowWidth, windowHeight);
}

//Draw the first line of ellipses using lerpColor() and color arrays.
function drawSkyEllipse(spectrum = 0) {
  const temp = spectrum ? spectrum / 50 : 0;
  const aa = brushWidth + temp;
  for (let i = 0; i < skyColorsFrom.length; i++) {
    for (let j = 0; j < brushAmount; j++) {
      noStroke();
      fill(skyColorsFrom[i]);
      skyEllipse.push(
        ellipse(
          aa / 2 + aa * j + temp * 2,
          aa / 2 + (height / 8) * i + temp * 2,
          aa + temp
        )
      );
    }
  }
  drawEllipse(skyLerpEllipseA, skyColorsLerpA, 1, temp);
  drawEllipse(skyLerpEllipseB, skyColorsLerpB, 9, temp);
  drawEllipse(skyLerpEllipseC, skyColorsLerpC, 17, temp);
  drawEllipse(skyLerpEllipseD, skyColorsLerpD, 25, temp);
}

//type: 1=sky;2=water
//colorLerp: array for colors
//num: number of each array
//r: row
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

//draw ellipses between each two basic color lines
//r: rows
//colorArray: each array for sky
function drawEllipse(lerpEllipse, colorArray, r, spectrum) {
  const aa = brushWidth + spectrum * 2;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < brushAmount; j++) {
      fill(colorArray[i]);
      lerpEllipse.push(
        ellipse(
          aa / 2 + aa * j + spectrum * 2,
          aa / 2 + aa * (i + r) + spectrum * 2,
          aa + spectrum
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
