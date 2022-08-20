class Boundary {
    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (
            point.pos.x >= this.pos.x - this.w &&
            point.pos.x < this.pos.x + this.w &&
            point.pos.y >= this.pos.y - this.h &&
            point.pos.y < this.pos.y + this.h
        );
    }

    intersects(range) {
        return !(
            range.pos.x - range.w > this.pos.x + this.w ||
            range.pos.x + range.w < this.pos.x - this.w ||
            range.pos.y - range.h > this.pos.y + this.h ||
            range.pos.y + range.h < this.pos.y - this.h
        );
    }
}

class QuadTree {
    constructor(boundary, n, depth) {
        this.boundary = boundary;
        this.capacity = n;
        this.depth = depth;
        this.maxDepth = 60;
        this.points = [];
        this.divided = false;
    }

    update() {
        let temporaryPoints = this.points;
        this.points = [];
        this.father.insertList(temporaryPoints);
    }

    subdivide() {
        let x = this.boundary.pos.x;
        let y = this.boundary.pos.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let ne = new Boundary(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity, this.depth + 1);
        let nw = new Boundary(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity, this.depth + 1);
        let se = new Boundary(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity, this.depth + 1);
        let sw = new Boundary(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity, this.depth + 1);
        this.divided = true;
    }

    insertList(list) {
        for (let point of list) {
            if (point) {
                this.insert(point);
            }
        }
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else if (this.depth < this.maxDepth) {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    query(range, heading, found) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.pos.dist(p.pos) < range.w) {
                    let v = p.pos.copy().sub(range.pos);
                    if (heading.angleBetween(v) < PI / 3 && heading.angleBetween(v) > -PI / 3) {
                        //range.contains(p)
                        found.push(p);
                    }
                }
            }
            if (found.length > 10) {
                return found;
            }
            if (this.divided) {
                this.northwest.query(range, heading, found);
                this.northeast.query(range, heading, found);
                this.southwest.query(range, heading, found);
                this.southeast.query(range, heading, found);
            }
        }
        return found;
    }

    show() {
        stroke(0);
        noFill();
        strokeWeight(1);
        rectMode(CENTER);

        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        } else {
            rect(
                this.boundary.pos.x,
                this.boundary.pos.y,
                this.boundary.w * 2,
                this.boundary.h * 2
            );
        }
    }
}
