function setup() {
    createCanvas(windowWidth, windowHeight);

    rectMode(CENTER);
}

function draw() {
    background(200, 200, 180, 255);
    let t = millis() * .0001;

    push();
    //translate(-width/2,-height/2);
    //rotate(millis()*0.001);
    //translate(width/2,height/2);
    var cnt2 = 75;
    for (let i = 0; i < cnt2; i++) {
        let l = fract(i / cnt2 + t) * 600;
        let x = width / 2 + sin(i + t) * l;
        let y = height / 2 + cos(i + t) * l;
        stroke(0, 10);
        strokeWeight(1);
        let c1 = color(100 + l * .3, l * .3, (i % 3) * 200, map(i, 0, cnt2 - 1, 100, 200));
        c1.setAlpha(250);
        fill(c1);
        let cnt1 = 5;
        for (let k = 0; k < cnt1; k++) {
            let s = map(k, 0, cnt1 - 1, 30 + l * .3, 0);
            let kc = map(i, 0, cnt2, 0, 1);
            let c1_1 = color(40);
            let c1_2 = color(255);
            let c3 = color(lerpColor(c1_1, c1_2, sin(kc * millis() * 0.005)));
            let cf = lerpColor(c3, c1, map(k * k * k, 0, cnt1, 0, 1));
            //cf.setAlpha(500);
            fill(cf);

            let x2 = x + sin(millis() * 0.001) * 100;
            let y2 = y + cos(millis() * 0.001) * 100;
            let xf = map(k, 0, cnt1 - 1, x, x2);
            let yf = map(k, 0, cnt1 - 1, y, y2);
            noStroke();
            push();
            translate(x2, y2);
            rotate(millis() * 0.001 + l * .025);
            rect(0, 0, s, s);
            pop();
        }
    }
    pop();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}