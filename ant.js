class Ant {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxForce = 0.3;
        this.max_speed = 2.5;
        this.target = null;
        this.vision = 80;
        this.size = 3;
        this.mode = "wander";
        this.name = "ant";
        this.timeStamp = frameCount;
        this.color = color(150, 70, 0);
        this.nutrition = 1000;
        this.dna = [];
        this.dna[0] = 5; // leaf mode wander
        this.dna[1] = -3; // other ant
        this.dna[2] = 5; // hill mode carrying
    }

    update() {
        //find direction and add force
        this.seek();

        //apply added force
        this.move();

        //lose some nutrition
        this.nutrition -= this.acc.mag() * 1.8;

        //vanish if dead
        if (this.nutrition <= 0) {
            this.vanish();
        }

        //ellipse on pos
        this.show();

        //set Marker
        this.mark();
    }

    move() {
        this.acc = this.target.copy().sub(this.pos);
        this.acc.add(p5.Vector.random2D().mult(10));

        //limit acceleration
        this.acc.setMag(this.maxForce);

        //accelerate and limit velocity
        this.vel.add(this.acc).limit(this.max_speed);

        //move to position
        if (onCanvas(this.pos.copy().add(this.vel))) {
            this.pos.add(this.vel);
        }
    }

    seek() {
        let leavesInVision;
        let hillsInVision;
        let PInVision;
        let AntsInVision = this.observe(0, this.vision);
        switch (this.mode) {
            case "wander":
                leavesInVision = this.observe(2, this.vision);
                PInVision = this.observe(3, this.vision);
                if (leavesInVision.length > 0) {
                    this.target = leavesInVision[0].pos.copy();
                    for (let leaf of leavesInVision) {
                        if (leaf.pos.dist(this.pos) < leaf.size / 4) {
                            this.mode = "carrying";
                            this.vel.mult(-1);
                            leaf.size -= 1;
                        }
                    }
                } else if (PInVision.length > 0) {
                    let target = this.pos.copy().add(p5.Vector.random2D().limit(0.1));
                    let c = 0;
                    for (let p of PInVision) {
                        if (p.tag === "carrying") {
                            target.add(p.pos.copy().sub(this.pos).mult(p.intensity));
                            c++;
                            if (c > 7) {
                                break;
                            }
                        }
                    }
                    this.target = target;
                } else {
                    this.target = this.pos.copy().add(p5.Vector.random2D());
                }
                break;
            case "carrying":
                hillsInVision = this.observe(1, this.vision * 2);
                PInVision = this.observe(3, this.vision);
                if (hillsInVision.length > 0) {
                    this.target = hillsInVision[0].pos.copy();
                    for (let hill of hillsInVision) {
                        let con = constrain(map(hill.size, 0, 200, 20, 60), 20, 60);
                        if (hill.pos.dist(this.pos) < con / 2) {
                            this.mode = "wander";
                            hill.size += 1;
                            this.nutrition += random(300, 600);
                            this.vel.mult(-1);
                        }
                    }
                } else if (PInVision.length > 0) {
                    let target = this.pos.copy().add(p5.Vector.random2D());
                    for (let p of PInVision) {
                        if (p.tag === "wander") {
                            target.add(p.pos.copy().sub(this.pos).mult(p.intensity));
                        }
                    }
                    this.target = target;
                } else {
                    this.target = this.pos.copy().add(p5.Vector.random2D());
                }
                break;
        }
    }

    observe(i, radius) {
        let range = new Boundary(this.pos.x, this.pos.y, radius, radius);
        return qtrees[i].query(range, this.vel);
    }

    show() {
        noFill();
        stroke(this.color);
        strokeWeight(0.01);
        //ellipse(this.pos.x, this.pos.y, this.vision);
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);

        if (this.mode === "carrying") {
            fill(0, 200, 0);
            ellipse(this.pos.x + this.vel.x, this.pos.y + this.vel.y, 5);
        }
    }

    port() {
        let x = this.pos.x + this.vel.x;
        let y = this.pos.y + this.vel.y;

        if (x <= 0) {
            this.pos.x = width - 1 + x;
        } else if (x >= width) {
            this.pos.x = 1 + x - width;
        }
        if (y <= 0) {
            this.pos.y = height - 1 + y;
        } else if (y >= height) {
            this.pos.y = 1 + y - height;
        }
    }

    mark() {
        if (round(this.timeStamp - frameCount) % 15 == 0 && pLength < 2300) {
            let p = new Pheromone(this.pos.x, this.pos.y, this.mode, 1);
            let index = 0;
            for (let i = 0; i < pheromones.length; i++) {
                if (pheromones[i] != null) {
                    index++;
                } else {
                    break;
                }
            }
            p.id = index;
            pheromones[index] = p;
        }
    }

    vanish() {
        this.home.size -= 1;
        this.home.ants -= 1;
        ants[this.id] = null;
    }
}
