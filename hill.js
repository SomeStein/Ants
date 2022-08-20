class Hill {
    constructor(x, y, size) {
        this.pos = createVector(x, y);
        this.size = size;
        this.ants = 0;
        this.name = "hill";
    }

    update() {
        //ellipse at hill position
        this.show();

        //if not enough ants create one more
        if (this.ants < this.size) {
            let ant = new Ant(this.pos.x, this.pos.y);
            let index = 0;
            for (let i = 0; i < ants.length; i++) {
                if (ants[i] != null) {
                    index++;
                } else {
                    break;
                }
            }
            ant.id = index;
            ant.home = this;
            this.ants++;
            ants[index] = ant;
        }
    }

    show() {
        strokeWeight(2)
        stroke(60, 20, 0);
        fill(120, 60, 0);
        let con = constrain(map(this.size, 0, 200, 20, 60), 20, 60)
        ellipse(this.pos.x, this.pos.y, con);
    }
}
