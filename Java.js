let trashStore = [];
let tex_trashBag;

function preload() {
    tex_trashBag = loadImage('Assets/Images/trashBag.png'); //loads the image for trash bags
}

function setup() {
    createCanvas(windowWidth,windowHeight);
    clear(); //clears background of canvas to make it transparent, which occurs for every call
    //to the draw function and means you don't get a ghosted background when refreshing page. 
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); //when the window size changes, so does the canvas
}

function isElementEnteringViewport(elem) { //used for the sections fading in/out with scroll
    var rect = elem.getBoundingClientRect(); //see line 88+ for implementation

    return (
        (windowHeight - rect.top) >= 200
    );
}

class trash {
    constructor() {
        this.dt = createVector(0,0); //initial movement is stationary
        this.pos = createVector((random([1,2,3]) * width/4), - windowWidth/8); //sets random 
        //position in one of the quarter quadrants of screen so the trash bags drop out of 
        //trash shutes in those positions 
    }

    draw() {
        image(tex_trashBag, this.pos.x - windowWidth/16, this.pos.y, windowWidth/8, windowWidth/8); //draws image
        this.dt.y = this.dt.y + 1; //increases velocity as trash bag falls
        this.pos.add(this.dt); //modifies position based on velocity
    }
}

function draw () {
    clear(); //avoids ghosting from previous things drawn, and keeps transparent background
    ellipseMode(CENTER); //draws shapes to center position of themselves
    rectMode(CENTER);
    strokeWeight(0);
    fill(color(84,84,84)); 
    ellipse(windowWidth/4, windowHeight/6, windowWidth/6, windowHeight/10); //shute holes
    ellipse(windowWidth/4 * 2, windowHeight/6, windowWidth/6, windowHeight/10);
    ellipse(windowWidth/4 * 3, windowHeight/6, windowWidth/6, windowHeight/10);
    fill(100,100,100);

    trashStore.forEach(element => { //looping through trash bags and drawing them
        element.draw();
    });

    drawingContext.save(); //saving drawing context before clipping starts
    fill(color('rgb(4, 25, 25)'));
    let region = new Path2D(); //clipping region
    region.ellipse(windowWidth/4, windowHeight/6, windowWidth/12, windowHeight/20, 0, 0, 2*Math.PI); //creates areas to draw on for clipping
    region.ellipse(windowWidth/4 * 2, windowHeight/6, windowWidth/12, windowHeight/20, 0, 0, 2*Math.PI); //these are the points at bottom of shutes where the trash bags overlap
    region.ellipse(windowWidth/4 * 3, windowHeight/6, windowWidth/12, windowHeight/20, 0, 0, 2*Math.PI); 
    region.rect(0,0, windowWidth, windowHeight/6 +1); //this intercepts with ellipses (bottom of shutes) so the shute tubes (rectangular parts) aren't drawn over the ellipses
    drawingContext.clip(region, "evenodd"); //this evenodd rule dictates the clipping effect based on how many shapes overlap
    
    fill(color('rgb(100, 100, 100)'));
    rect(windowWidth/4, windowHeight/12, windowWidth/6, windowHeight/6); //shute tubes
    rect(windowWidth/4 * 2, windowHeight/12, windowWidth/6, windowHeight/6);
    rect(windowWidth/4 * 3, windowHeight/12, windowWidth/6, windowHeight/6);
    fill(color('rgb(0, 200, 200)'));
    drawingContext.restore(); //restoes drawing context after clipping so drawing can continue as normal

     if ((trashStore.length!= 0) && (trashStore[0].pos.y > height)) { //when trash bags drop below the window they are erased
         trashStore.shift();
    }
}

function keyPressed() {
    if (keyCode == 84) { //Press T for Trash
        trashStore.push(new trash());
        let guide_text = document.getElementsByClassName('guide_text'); //this is the css class for 'Press T for Trash'
        console.log(guide_text); //this is how I troubleshoot in the browser
        guide_text[0];
        guide_text[0].style.color = "rgb(100,100,100)"; //changes text color to match background shute tube after first press of T
        //this is a hacky way of making the text disappear (or lazy depending on how you look at it)
    }
}

function onScroll() { //function for elements to fade in/out as you scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (isElementEnteringViewport(section)) {

            section.style.transition = 'opacity 1s'; //fading transition effect
            section.style.opacity = 1;
        } else {

            section.style.transition = 'opacity 0.5s';
            section.style.opacity = 0;
        }
    });
}

window.addEventListener("scroll", onScroll); //when scrolling occurs, call function

function onHover(obj) {
    obj.target.style.background = "rgb(129,196,57)"; //section background turns green on mouse hover
}

var sections = document.getElementsByClassName("hover-section")
console.log(sections.length);
for (var i = 0; i < sections.length; i++) {
sections[i].addEventListener('mouseover', onHover); 
}




