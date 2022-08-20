class Pheromone {

    constructor(x, y, tag) {
        this.pos = createVector(x, y);
        this.dir
        this.tag = tag;
        this.timeStamp = frameCount
    }

    update() {
        noStroke();
        if (this.tag === "wander") {
            fill(0, 0, 200, this.intensity)
        } else if (this.tag === "carrying") {
            fill(200, 0, 0, this.intensity)
        }
        ellipse(this.pos.x,this.pos.y,3)

        this.intensity = map(frameCount - this.timeStamp, 0, 110, 200, 0)

        if (this.intensity <= 0) {
            this.vanish()
        }
    }

    vanish() {
        pheromones[this.id] = null;
    }

}
