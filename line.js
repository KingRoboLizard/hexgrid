class Line {

    constructor(x1, y1, x2, y2, a, c = 50, length = 0) {
        this.x = x1
        this.y = y1
        this.x2 = x2
        this.y2 = y2
        this.c = c;
        this.a = a;
        this.l = length;
    }

    // color(H) {
    // 	this.H = H
    // }

    show() {
        // ctx.shadowBlur = 8;
        // ctx.shadowColor = 'hsl('+this.c+',100%,60%)';
        // 	stroke(this.H+this.c,360,360)		//color to bright (except purple tones)
        // 	drawingContext.shadowColor = color(this.H+this.c,360,360)
        // }
        // ctx.strokeStyle = 'hsl(' + this.c + ',100%,50%)';
        // ctx.fillStyle = 'hsl(' + this.c + ',100%,50%)';
        rainbow.setNumberRange(-1,this.l)
        rainbow.colorAt(this.c)
        var hex = '#' + rainbow.colourAt(this.c);
        drawLine(ctx, this.x, this.y, this.x2, this.y2, hex)
        // drawLine(ctx, this.x, this.y, this.x2, this.y2, 'hsl(' + this.c + ',100%,' + (50 + this.c / 1.8) + '%)')
        // drawLine(ctx, this.x, this.y, this.x2, this.y2, "rgba(255,255,255,150)",1)
        // ctx.shadowBlur = 0
        // colorMode(RGB, 255);
    }
}
