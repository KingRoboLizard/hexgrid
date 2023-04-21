const canvas = document.querySelector(".drawgrid");
const ctx = canvas.getContext("2d");
const background = document.querySelector(".drawbg");
const bgctx = background.getContext("2d");
const hue = document.getElementById("hue");
const sat = document.getElementById("sat");
const lum = document.getElementById("lum");

var rainbow = new Rainbow();
let hsl2rgb = (h, s, l, a = s * Math.min(l, 1 - l), f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) => [f(0), f(8), f(4)];
let rgb2hex = (r, g, b) => "#" + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, 0)).join('');

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
background.width = document.body.clientWidth;
background.height = document.body.clientHeight;

let points = []
pointGrid();

points.forEach(h => {   //draw the pointgrid to bg
    h.show();
});

addEventListener("resize", () => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    background.width = document.body.clientWidth;
    background.height = document.body.clientHeight;
    pointGrid();
    bgctx.clearRect(0, 0, background.width, background.height)
    points.forEach(h => {
        h.show();
    });
});

var modal = document.getElementById("modal");
dragElement(modal);

var btn = document.getElementById("modalButton");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
}

span.onclick = function () {
    modal.style.display = "none";
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    hue.ontouchstart = () => document.ontouchmove = null;
    sat.ontouchstart = () => document.ontouchmove = null;
    lum.ontouchstart = () => document.ontouchmove = null;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        // if (/Android|iPhone/i.test(navigator.userAgent)) {
        //     elmnt.ontouchstart = () => { document.getElementById(elmnt.id + "contents").ontouchmove = temp(e) };
        // }
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        if (/Android|iPhone/i.test(navigator.userAgent)) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (mouseX == undefined) {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            }
        }
        else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        document.onmousemove = elementDrag, handleMouseMove;
        document.ontouchmove = elementDrag, handleMouseMove;
    }

    function elementDrag(e) {
        e = e || window.event;
        if (/Android|iPhone/i.test(navigator.userAgent)) {
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        }
        else {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.ontouchend = null;
        document.onmousemove = handleMouseMove;
        document.ontouchmove = handleMouseMove;
    }
}

let iter = 0;
let mouseX = 0;
let mouseY = 0;
document.onmousemove = handleMouseMove;
document.ontouchmove = handleMouseMove;
function handleMouseMove(event) {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (mouseX == undefined) {
            mouseX = event.touches[0].clientX;
            mouseY = event.touches[0].clientY;
        }
    }
    else {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
}

let isMouseHover = false
if (/Android|iPhone/i.test(navigator.userAgent)) {
    isMouseHover = true;
}

canvas.addEventListener("mouseleave", function (event) {
    isMouseHover = false
}, false);
canvas.addEventListener("mouseover", function (event) {
    isMouseHover = true
}, false);

function Undo() {
    if (lines.length > 1) {
        lines.pop();
    }
    while (lines[lines.length - 1].a != 1) {
        lines.pop();
    }
    stack.pop();
}

let mousedown = false;

if (/Android|iPhone/i.test(navigator.userAgent)) {
    document.addEventListener("touchstart", (e) => { handleMouseMove(e); if (isMouseHover) { mousedown = true; SetLoc(); } });
    document.addEventListener("touchend", () => { inputEnd(); });
}
else {
    document.addEventListener("mousedown", () => { if (isMouseHover) { mousedown = true; SetLoc(); } });
    document.addEventListener("mouseup", () => { inputEnd(); });
}

function inputEnd() {
    iter = 0;
    mousedown = false;
    pattern();
    if (stack[stack.length - 1] != "undo") {
        if (lines[lines.length - 1].a != 1) {
            lines.push(new Line(-100, 0, 0, 0, 1));
        }
    } else {
        stack.pop()
    }
}

addEventListener("keypress", (event) => {
    if (event.key == "z") {
        Undo();
    }
});

let col1;
const hex = document.getElementById("hex");
document.documentElement.style.setProperty('--col', hue.value);
document.documentElement.style.setProperty('--lum', lum.value + '%');
document.documentElement.style.setProperty('--sat', sat.value + '%');
hue.addEventListener("input", updateCol)
sat.addEventListener("input", updateCol)
lum.addEventListener("input", updateCol)

function updateCol() {
    document.documentElement.style.setProperty('--col', hue.value);
    document.documentElement.style.setProperty('--lum', lum.value + '%');
    document.documentElement.style.setProperty('--sat', sat.value + '%');
    hex.value = col1;
    let rgb = hsl2rgb(hue.value, sat.value / 100, lum.value / 100);
    document.getElementById("r").value = Math.round(rgb[0] * 255);
    document.getElementById("g").value = Math.round(rgb[1] * 255);
    document.getElementById("b").value = Math.round(rgb[2] * 255);
}

let patternList = "";
let patternOrders = [];
let patternNames = [];

fetch('patterns.txt')
    .then(response => response.text())
    .then(text => { patternList = text; console.log(text) }).then(() => {
        patternList = patternList.split("\n");
        for (let i = 0; i < patternList.length; i++) {
            let divided = patternList[i].split(":");
            patternOrders.push(divided[0]);
            patternNames.push(divided[1].trim());
        }
    })

let nearestPoint;
let lines = []
lines.push(new Line(-100, 0, 0, 0, 1));

let clickX = 0;
let clickY = 0;


function SetLoc() {
    points.forEach(h => {
        if (nearestPoint === undefined || h.distanceToMouse < nearestPoint.distanceToMouse) {
            nearestPoint = h;
        }
    });
    clickX = nearestPoint.x;
    clickY = nearestPoint.y;
}

function pointGrid() {
    for (let y = 0; y < canvas.height / 80 + 1; y++) {
        for (let i = 0; i < canvas.width / 40; i++) {
            let x2 = i * 40;
            points.push(new Point(x2, y * 34.641 * 2))
            points.push(new Point(x2 + 20, y * 34.641 * 2 + 34.641))
        }
    }
}

function drawLine(ctx, x1, y1, x2, y2, stroke = "white", width = 3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();
}

function rotateVector(vec, ang) {
    ang = ang * (Math.PI / 180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Array(Math.round(10000 * (vec[0] * cos - vec[1] * sin)) / 10000, Math.round(10000 * (vec[0] * sin + vec[1] * cos)) / 10000);
};

function NormalizeVec(vec, targetLength, angle) {
    let e = false;
    let origVec = vec;
    var length = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
    if (length > 25) {
        vec[0] = vec[0] / length * targetLength;
        vec[1] = vec[1] / length * targetLength;
        vec = rotateVector(vec, angle - GetClosestNumber(angle - 360, 60) + 30)
        if (Math.abs(lines[lines.length - 1].a + (GetClosestNumber(angle - 360, 60))) == 180) {
            clickX = clickX + vec[0];
            clickY = clickY + vec[1];
            lines.pop();
            iter -= 1;
            return origVec;
        }
        lines.forEach(line => {
            newLine = new Line(clickX, clickY, clickX + vec[0], clickY + vec[1], 0);
            let val = Math.abs(line.x - newLine.x + line.y - newLine.y + line.x2 - newLine.x2 + line.y2 - newLine.y2);
            if (val < 1) {
                e = true;
                return origVec;
            }
        });
        if (e == true) {
            return origVec;
        }
        lines.push(new Line(clickX, clickY, clickX + vec[0], clickY + vec[1], Math.abs(GetClosestNumber(angle - 360, 60)), iter));
        iter += 1;
        for (let i = lines.length - iter; i < lines.length; i++) {
            lines[i].l = iter;
        }
        clickX = clickX + vec[0];
        clickY = clickY + vec[1];
        // prevAngle = Math.abs(GetClosestNumber(angle - 360, 60));
        // points.splice(points.indexOf(nearestPoint),1)
    }
    return vec;
}

function GetClosestNumber(val, grid) {
    // Determing the numbers on either side of value
    var low = val - val % grid;
    var high = low + grid;

    // Return the closest one
    var result = val - low < high - val ? low : high;
    return result;
}

let stack = [];

window.requestAnimationFrame(loop);

var filterStrength = 60;
var frameTime = 0, lastLoop = new Date, thisLoop;
function loop() {
    // var thisFrameTime = (thisLoop = new Date) - lastLoop;
    // frameTime += (thisFrameTime - frameTime) / filterStrength;
    // lastLoop = thisLoop;

    col1 = rgb2hex(...hsl2rgb(hue.value, sat.value / 100, lum.value / 100))
    // rainbow.setSpectrum(document.getElementById("col1").value, document.getElementById("col2").value, document.getElementById("col3").value);
    rainbow.setSpectrum(col1, '#FFFFFF');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //display fps
    // ctx.fillStyle = "white";
    // ctx.font = "2rem monospace"
    // ctx.fillText((1000 / frameTime).toFixed(1), 100, 100)

    for (let i = 1; i < lines.length; i++) {
        let color = '#' + rainbow.colourAt(lines[i].c);;
        if (i + 1 < lines.length && lines[i + 1].a == 1) {
            let vec = [lines[i].x2 - lines[i].x, lines[i].y2 - lines[i].y]
            let length = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
            vec[0] = vec[0] / length * 20;
            vec[1] = vec[1] / length * 20;
            drawLine(ctx, lines[i].x, lines[i].y, lines[i].x2 - vec[0], lines[i].y2 - vec[1], color);
        }
        else {
            lines[i].show();
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        try {
            if (lines[i - 1].a == 1) {
                ctx.beginPath();
                ctx.save();
                ctx.translate(lines[i].x, lines[i].y);
                ctx.rotate((lines[i].a + 120) * Math.PI / 180);
                // ctx.strokeStyle = "white";
                ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                ctx.moveTo(10, -4)
                ctx.lineTo(20, 1)
                ctx.lineTo(10, 5)
                ctx.moveTo(20, -4)
                ctx.lineTo(28, 1)
                ctx.lineTo(20, 5)
                ctx.fillStyle = color;
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            if (lines[i + 1].a == 1 && lines[i].x + lines[i].y > 0) {
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.save();
                ctx.translate(lines[i].x, lines[i].y);
                ctx.rotate((lines[i].a + 120) * Math.PI / 180);
                ctx.moveTo(20, -4)
                ctx.lineTo(28, 1)
                ctx.lineTo(20, 5)
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }
        catch { };
        if (i % 2 == 0) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.save();
            ctx.translate(lines[i].x, lines[i].y);
            ctx.rotate((lines[i].a + 120) * Math.PI / 180);
            ctx.moveTo(20, -4)
            ctx.lineTo(28, 1)
            ctx.lineTo(20, 5)
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
    // for (let line of lines) {
    //     line.show()
    // }
    if (mousedown) {
        let angle = Math.atan2((mouseX - clickX), (mouseY - clickY)) * (180 / Math.PI);//might give radian
        // let newPos = rotateVector([mouseX - clickX, mouseY - clickY], angle - GetClosestNumber(angle - 360, 60) + 30);
        let newPos = NormalizeVec([mouseX - clickX, mouseY - clickY], 40, angle);
        drawLine(ctx, clickX, clickY, mouseX, mouseY, "gray", 4);
    }
    DrawStack();
    window.requestAnimationFrame(loop);
}

function dist(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;

    var c = Math.sqrt(a * a + b * b);
    return c;
}

function DrawStack() {
    for (let i = 0; i < stack.length; i++) {
        ctx.fillStyle = "white";
        ctx.font = "1rem monospace";
        ctx.fillText(stack[stack.length - i - 1], 0, 20 * (i + 1));
    }
}

function pattern() {
    if (lines[lines.length - 1].a == 1) {
        return;
    }
    let tempList = [...lines];
    let lastdir;
    let dir = "";
    while (tempList.length > 1 && tempList[tempList.length - 1].a != 1) {
        let a = tempList[tempList.length - 1].a;
        if (lastdir - a == 0) {
            dir += "w";
        }
        else if (lastdir - a == 60 || lastdir - a == -300) {
            dir += "e";
        }
        else if (lastdir - a == 120 || lastdir - a == -240) {
            dir += "d";
        }
        else if (lastdir - a == 240 || lastdir - a == -120) {
            dir += "a";
        }
        else if (lastdir - a == -60 || lastdir - a == 300) {
            dir += "q";
        }
        lastdir = a;
        tempList.pop();
    }
    dir = dir.split("").reverse().join("");
    for (let i = 0; i < patternOrders.length - 1; i++) {
        if (dir == patternOrders[i]) {
            console.log(patternNames[i]);
            stack.push(patternNames[i]);
            if (i != 167) {
                return;
            }
            else {
                break;
            }
        }
    }
    let num = 0;
    let tdir = dir;
    if (dir.startsWith("aqaa") || dir.startsWith("dedd")) {
        tdir = tdir.replace("aqaa", "");
        tdir = tdir.replace("dedd", "");
        let numpat = tdir.split("");
        numpat.forEach(e => {
            if (e == "w") {
                num++;
            }
            if (e == "q") {
                num += 5;
            }
            if (e == "e") {
                num += 10;
            }
            if (e == "a") {
                num *= 2;
            }
            if (e == "d") {
                num *= 0.5;
            }
        });
        if (dir.startsWith("dedd")) {
            num = -num;
        }
        console.log(num);
        stack.push(num);
    }
    else if (dir == "a") {
        Undo();
        Undo();
        stack.push("undo");
    }
    else {
        stack.push(" Undefined")
        console.log("invalid pattern")
    }
}