class Point {

    constructor(x1, y1) {
        this.x = x1
        this.y = y1
    }

    show() {
        // ctx.point(this.x, this.y)
        ctx.fillStyle = "black";
        ctx.fillRect(this.x-2, this.y-2, 4, 4);
    }

    get distanceToMouse() {
        return dist(mouseX, mouseY, this.x, this.y);
    }
}