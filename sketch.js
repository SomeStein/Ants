var ants = [];
var hills = [];
var leaves = [];
var pheromones = [];
var qtrees = [];
let canvas;
let antsLength = 0;
let pLength = 0;
const hillSize = 1000;
const cap = 5;
let FR;

function setup() {
    canvas = createCanvas(displayWidth, displayHeight);
    //canvas = createCanvas(600, 600);

    let x = width / 2;
    let y = height / 2;

    canvasBoundary = new Boundary(x, y, x, y);

    let hill = new Hill(
        random(width),
        random(height),
        hillSize
    );

    hills.push(hill);
}

function draw() {
    background(255);

    if (false) { //!fullscreen()){
        fill(28);
        rect(720, 0, width - 720, height);
        rect(0, 450, width, height - 450);
        scale(720 / width, 450 / height);
    }

    canvas.doubleClicked(adjust);

    qtrees[0] = new QuadTree(canvasBoundary, cap, 0);
    qtrees[1] = new QuadTree(canvasBoundary, cap, 0);
    qtrees[2] = new QuadTree(canvasBoundary, cap, 0);
    qtrees[3] = new QuadTree(canvasBoundary, cap, 0);

    qtrees[0].insertList(ants);
    qtrees[1].insertList(hills);
    qtrees[2].insertList(leaves);
    qtrees[3].insertList(pheromones);


    for (let hill of hills) {
        if (hill) {
            hill.update();
        }
    }

    for (let leaf of leaves) {
        if (leaf) {
            leaf.update();
        }
    }

    for (let ant of ants) {
        if (ant) {
            ant.update();
        }
    }

    for (let p of pheromones) {
        if (p) {
            p.update();

        }
    }

    qtrees[3].show();

    if (floor(antsLength / hills.length) > 400) {
        let hill = new Hill(random(width), random(height), 0);
        hills.push(hill);
    }

    if (frameCount % 50 == 0) {
        leaf = new Leaf(random(width), random(height), 200);
        let index = 0;
        for (let i = 0; i < leaves.length; i++) {
            if (leaves[i] != null) {
                index++;
            } else {
                break;
            }
        }
        leaf.id = index;
        leaves[index] = leaf;
        if (leaves.length > 7) {
            leaves.pop();
        }
        FR = round(frameRate())
    }

    stroke(0);
    fill(0);
    antsLength = 0;
    for (let ant of ants) {
        if (ant != null) {
            antsLength++;
        }
    }
    pLength = 0;
    for (let p of pheromones) {
        if (p != null) {
            pLength++;
        }
    }

    noStroke();
    text("Anzahl Pheromone: " + pLength + "  " + pheromones.length, 25, 30)
    text("Anzahl Ameisen: " + antsLength + "  " + ants.length, 25, 50);
    text("Framerate: " + FR, 25, 70);



}

function onCanvas(v) {
    return v.x < width && v.x >= 0 && v.y < height && v.y >= 0;
}

function adjust() {
    let fs = fullscreen();
    if (fs) {
        cursor();
        fill(28);
        rect(720, 0, width - 720, height);
        rect(0, 450, width, height - 450);
        scale(720 / width, 450 / height);
    } else {
        noCursor();
    }
    fullscreen(!fs);
}
