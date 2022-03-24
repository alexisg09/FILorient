///////////////////////////////////////////////////////////
// Variable definitions ///////////////////////////////////
///////////////////////////////////////////////////////////

// import 'jquery'


var windAngle = 0;
var minX;
var maxX;
var minY;
var maxY;
var blinkUpdate;
var lastSeed;
var leaveImage;
var curContext; // Javascript drawing context (pour aller plus vite)
var width;
var height;
var buffer;
var date = new Date();
var treeScale;
var growthTime;


///////////////////////////////////////////////////////////
// Class that handles the branches ////////////////////////
///////////////////////////////////////////////////////////
class Branch {

  ///////////////////////////////////////////////////////////
  // Constructor ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  constructor(parent, x, y, angleOffset, length) {
    this.growth = 0;
    this.windForce = 0;
    this.blastForce = 0;
    this.parent = parent;
    this.x = x;
    this.y = y;
    if (this.parent != null) {
      this.angle = this.parent.angle + angleOffset;
      this.angleOffset = angleOffset;
    } else {
      this.angle = angleOffset;
      this.angleOffset = -0.2 + random(0.4);
    }

    this.length = length;
    let xB = x + sin(this.angle) * length;
    let yB = y + cos(this.angle) * length;
    if (length > 10) {
      if (length + random(length * 10) > 75) {
        this.branchA = new Branch(this, xB, yB, -0.1 - random(1) + ((this.angle % TWO_PI) > PI ? -1.0 / length : +1.0 / length), length * (0.6 + random(0.3)));
      }
      if (length + random(length * 10) > 75) {
        this.branchB = new Branch(this, xB, yB, 0.1 + random(1) + ((this.angle % TWO_PI) > PI ? -1.0 / length : +1.0 / length), length * (0.6 + random(0.3)));
      }
      if (this.branchB != null && this.branchA == null) {
        this.branchA = this.branchB;
        this.branchB = null;
      }
    }
    minX = min(xB, minX);
    maxX = max(xB, maxX);
    minY = min(yB, minY);
    maxY = max(yB, maxY);
  }


  ///////////////////////////////////////////////////////////
  // Set scale //////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  setScale(treeScale) {
    this.length *= treeScale;
    if (this.branchA != null) {
      this.branchA.setScale(treeScale);
      if (this.branchB != null)
        this.branchB.setScale(treeScale);
    }
  }


  ///////////////////////////////////////////////////////////
  // Update /////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  update() {
    if (this.parent != null) {
      this.x = this.parent.x + sin(this.parent.angle) * this.parent.length * this.parent.growth;
      this.y = this.parent.y + cos(this.parent.angle) * this.parent.length * this.parent.growth;
      this.windForce = this.parent.windForce * (1.0 + 5.0 / this.length) + this.blastForce;
      this.blastForce = (this.blastForce + sin(this.x / 2 + windAngle) * 0.005 / this.length) * 0.98;
      this.angle = this.parent.angle + this.angleOffset + this.windForce + this.blastForce;
    }
    if (this.branchA != null) {
      this.branchA.update();
      if (this.branchB != null)
        this.branchB.update();
    }
  }

  ///////////////////////////////////////////////////////////
  // growUp /////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  growUp() {
    if (this.parent != null) {
      this.growth = min(this.growth + 0.1 * this.parent.growth, 1);
    } else
      this.growth = min(this.growth + 0.1, 1);
    if (this.branchA != null) {
      this.branchA.growUp();
      if (this.branchB != null)
        this.branchB.growUp();
    }
  }


  ///////////////////////////////////////////////////////////
  // Render /////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  render() {
    if (this.branchA != null) {
      let xB = this.x;
      let yB = this.y;
      if (this.parent != null) {
        xB += (this.x - this.parent.x) * 0.4;
        yB += (this.y - this.parent.y) * 0.4;
      } else {
        xB += sin(this.angle + this.angleOffset) * this.length * 0.3;
        yB += cos(this.angle + this.angleOffset) * this.length * 0.3;
      }
      curContext.beginPath();
      curContext.moveTo(this.x, this.y);
      curContext.bezierCurveTo(xB, yB, xB, yB, this.branchA.x, this.branchA.y);

      let branchColor = floor(1100 / this.length);
      // pas toucher aux autres paramètres sinon tronc pas vert
      curContext.strokeStyle = "rgb(" + branchColor + "," + branchColor * 1.7 + "," + branchColor + ")"; // * 2.3 si plus clair mais couleur sympa quand meme
      curContext.lineWidth = this.length / 5;
      curContext.stroke();
      this.branchA.render();

      if (this.branchB != null)
        this.branchB.render();
    } else {
      push();
      translate(this.x, this.y);
      rotate(-1 * this.angle);
      image(leaveImage, -leaveImage.width / 2, 0);
      pop();

    }
  }

}


var tree;


function preload() {
  bg = loadImage('img/bgedited.png');
  bgSmall = loadImage('img/smallbg.png');
}

///////////////////////////////////////////////////////////
// Init ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function setup() {

  let c = createCanvas(windowWidth, windowHeight, P2D); // Set screen size & renderer
  c.parent('myTree')
  width = windowWidth;
  height = windowHeight;
  back = createGraphics(width, height, P2D);

  createNewTree(str(2022 * 365 + 3 * 30 + 17));
  // utiliser un truc du genre dans str pour avoir un arbre différent chaque jour year() * 365 + month() * 30 + day()

  leaveImage = createLeaveImage();
  curContext = drawingContext; // Get javascript drawing context

  growthTime = 0;
}


///////////////////////////////////////////////////////////
// Create leave image /////////////////////////////////////
///////////////////////////////////////////////////////////
function createLeaveImage() {
  let scale2 = treeScale * 2;
  buffer = createGraphics(12 * scale2, 18 * scale2, P2D);
  // buffer.beginDraw();
  buffer.background(color(255, 0, 0, 0));
  buffer.stroke("#196401");
  buffer.line(6 * scale2, 0 * scale2, 6 * scale2, 6 * scale2);
  buffer.noStroke();
  buffer.fill("#4b9d31");
  buffer.beginShape();

  buffer.vertex(6 * scale2, 6 * scale2);
  buffer.bezierVertex(0 * scale2, 12 * scale2, 0 * scale2, 12 * scale2, 6 * scale2, 18 * scale2);
  buffer.bezierVertex(12 * scale2, 12 * scale2, 12 * scale2, 12 * scale2, 6 * scale2, 6 * scale2);
  buffer.endShape();
  buffer.fill("#2fb202");
  buffer.beginShape();

  buffer.vertex(6 * scale2, 9 * scale2);
  buffer.bezierVertex(0 * scale2, 13 * scale2, 0 * scale2, 13 * scale2, 6 * scale2, 18 * scale2);
  buffer.bezierVertex(12 * scale2, 13 * scale2, 12 * scale2, 13 * scale2, 6 * scale2, 9 * scale2);
  buffer.endShape();
  buffer.stroke("#9f3d00");
  buffer.noFill();
  buffer.bezier(6 * scale2, 9 * scale2, 5 * scale2, 11 * scale2, 5 * scale2, 12 * scale2, 6 * scale2, 15 * scale2);


  // buffer.endDraw();
  return buffer;
}


///////////////////////////////////////////////////////////
// Create new tree ////////////////////////////////////////
///////////////////////////////////////////////////////////
function createNewTree(seed) {
  lastSeed = seed;
  randomSeed(seed);
  minX = width / 2;
  maxX = width / 2;
  minY = height;
  maxY = height;
  tree = new Branch(null, width / 2, height, PI, 110);
  let xSize = width;
  let ySize = height;
  treeScale = 0.5;
  if (xSize < ySize) {
    if (xSize > 300)
      treeScale = xSize / 600;
  } else {
    if (ySize > 300)
      treeScale = ySize / 600;
  }
  tree.setScale(treeScale);
  tree.x = width / 2;
  tree.y = height;
  blinkUpdate = -1; // Set/reset variables
}


function mousePressed() {
  if (windowWidth > 768) {
    let d1 = dist(mouseX, mouseY, windowWidth / 3, windowHeight / 1.75)
    let d2 = dist(mouseX, mouseY, windowWidth / 2, windowHeight / 4)
    let d3 = dist(mouseX, mouseY, windowWidth / 1.40, windowHeight / 2)
    let d4 = dist(mouseX, mouseY, windowWidth / 1.5, windowHeight / 1.25)

    //si la distance entre le centre de la zone et le X du curseur est inférieure à la demie largeur de la zone
    // ET
    //si la distance entre le centre de la zone et le Y du curseur est inférieure à la demie hauteur de la zone
    // on trigger le click
    if (d1 < windowWidth / 5 / 2 && d1 < windowHeight / 3 / 2) {
      console.log('trigger zone 1')
      callFirst()
    }

    if (d2 < windowWidth / 3 / 2 && d2 < windowHeight / 5 / 2) {
      console.log('trigger zone 2')
      callSecond()
    }

    if (d3 < windowWidth / 5 / 2 && d3 < windowHeight / 3 / 2) {
      console.log('trigger zone 3')
      callThird()

    }

    if (d4 < windowWidth / 5 / 2 && d4 < windowHeight / 3 / 2) {
      console.log('trigger zone 4')
      callFourth()
    }
  } else if (windowWidth < 768) {
    let d1 = dist(mouseX, mouseY, windowWidth / 4.5, windowHeight / 1.5)
    let d2 = dist(mouseX, mouseY, windowWidth / 2, windowHeight / 2)
    let d3 = dist(mouseX, mouseY, windowWidth / 1.25, windowHeight / 1.5)
    let d4 = dist(mouseX, mouseY, windowWidth / 1.25, windowHeight / 1.1)

    if (d1 < 75 && d1 < 100) {
      console.log('small trigger zone 1')
      callFirst()
    }

    if (d2 < 100 && d2 < 75) {
      console.log('small trigger zone 2')
      callSecond()
    }

    if (d3 < 75 && d3 < 100) {
      console.log('small trigger zone 3')
      callThird()

    }

    if (d4 < 100 && d4 < 75) {
      console.log('small trigger zone 4')
      callFourth()
    }
  }


}




function draw() {
  if (windowWidth < 768) {
    background(bgSmall)
  } else {
    background(bg);
  }

  windAngle += 0.003;
  tree.windForce = sin(windAngle) * 0.02; // minimum 0.02 pour qqchose de réaliste
  tree.update();
  if (growthTime < hour() * 4) {
    tree.growUp();
    growthTime += 1;
  }
  tree.render();
}
