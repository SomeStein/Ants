class Leaf {
    constructor(x, y, size) {
        this.pos = createVector(x, y);
        this.size = size;
        this.name = "leaf"
    }

    update() {

        //green ellipse at position
        this.show();

        //vanishing
        if (this.size <= 0) {
            this.vanish();
        }
    }

    show() {
        noStroke();
        fill(0, 200, 0);
        ellipse(this.pos.x, this.pos.y, this.size / 2);
    }

    vanish() {
        leaves[this.id] = null;
    }
}
