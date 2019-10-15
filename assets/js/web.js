/************************************** Target Overlay Class *************************************/
const ANIM_ROTATE   = 0x00; //Do rotation animation.
const ANIM_ZOOM_IN  = 0x01; //Zoom in on target animation.
const ANIM_ZOOM_OUT = 0x02; //Zoout out from target animation.

class Target
{
    constructor(canvas, canDiv, radLen)
    {
        this.canvas = canvas; //Canvas to draw timer on.
        this.canDiv = canDiv; //Parent container of the canvas.
        this.radLen = radLen; //The fraction of the canvas radius to use.
        
        this.ctx = canvas.getContext("2d");
        this.intervalId;
        this.canvasWidth;
        this.canvasHeight;
        this.canvasMiddleX;
        this.canvasMiddleY;
        this.radius;

        //Drawing setpoints.
        this.outerRadius = .70;
        this.innerRadius = .20;
        this.outerColor  = "#ffffff";
        this.innerColor  = "#ffffff";
        this.TriColor    = "#ff7f7f";
        this.outerGap    = Math.PI / 20;
        this.innerGap    = Math.PI / 10;
        this.triBase     = Math.PI / 30;
        this.outerWidth  = .08;
        this.innerWidth  = .04;
        this.triTip      = .25;
        this.zoomStep    = .75;
        
        //50 milliseconds between animations(20 frames per second).
        this.ANIM_TIME = 50;

        //dTheta is the amount to update the angle every animation frame.
        this.dTheta = 2 * Math.PI / 200;

        //Rotation offset variables.
        this.outerOffset = 0;
        this.innerOffset = 0;

        this.animStyle = ANIM_ROTATE;

        //Used for zooming in and out.
        this.CurrentRadLen = this.radLen;
    }

    /******************************** GameTimer Class Functions **********************************/
    //Animates the timer.  This function is called every ANIM_TIME milliseconds.
    draw()
    {
        this.canvasWidth = this.canDiv.clientWidth;
        this.canvasHeight = this.canDiv.clientHeight;

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
                
        //Calculate the center of the canvas.
        this.canvasMiddleX = this.canvasWidth / 2;
        this.canvasMiddleY = this.canvasHeight / 2;

        //Calculate the drawing radius.
        this.radius = (this.canvasWidth > this.canvasHeight) ? 
                       this.canvasMiddleY : this.canvasMiddleX;
        this.radius *= this.CurrentRadLen;

        //Clear the canvas.
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        //Choose the animation to perform.
        if(this.animStyle === ANIM_ZOOM_IN)
        {
            this.doZoomIn();
        }
        else if(this.animStyle === ANIM_ZOOM_OUT)
        {
            this.doZoomOut();
        }
        else
        {
            this.doRotate();
        }
    }

    //Reset the variables to a zoomed out state.
    resetAnimation()
    {
        this.CurrentRadLen = 8 * this.radLen;
        this.animStyle = ANIM_ZOOM_IN;
    }

    //Initializes the zoomOut function.
    initZoomOut()
    {
        this.animStyle = ANIM_ZOOM_OUT;
    }

    //Zoom in on target.
    doZoomIn()
    {
        //Draw outer three arcs.
        for(let i = 0; i < 3; i++)
        {
            this.drawArc
            (
                this.outerOffset + i * 2 * Math.PI / 3 + this.outerGap, 
                this.outerOffset + ((i + 1) % 3) * 2 * Math.PI / 3 - this.outerGap,
                this.outerColor, this.outerWidth, this.outerRadius
            );
        }

        //Draw inner three arcs.
        for(let i = 0; i < 3; i++)
        {
            this.drawArc
            (
                this.innerOffset + i * 2 * Math.PI / 3 + this.innerGap, 
                this.innerOffset + ((i + 1) % 3) * 2 * Math.PI / 3 - this.innerGap,
                this.innerColor, this.innerWidth, this.innerRadius
            );
        }

        //Draw three triangles.
        for(let i = 0; i < 3; i++)
        {
            this.drawTriangle
            (
                this.outerOffset + i * 2 * Math.PI / 3, this.TriColor, this.triTip, this.triBase
            );
        }

        //------------------- Update the zoom variables -------------------
        this.CurrentRadLen -= this.zoomStep * this.radLen;

        //Check if zoom in is done.
        if(this.CurrentRadLen <= this.radLen)
        {
            this.CurrentRadLen = this.radLen;
            this.animStyle = ANIM_ROTATE;
        }
    }

    //Zoom out from target.
    doZoomOut()
    {
        //Draw outer three arcs.
        for(let i = 0; i < 3; i++)
        {
            this.drawArc
            (
                this.outerOffset + i * 2 * Math.PI / 3 + this.outerGap, 
                this.outerOffset + ((i + 1) % 3) * 2 * Math.PI / 3 - this.outerGap,
                this.outerColor, this.outerWidth, this.outerRadius
            );
        }

        //Draw inner three arcs.
        for(let i = 0; i < 3; i++)
        {
            this.drawArc
            (
                this.innerOffset + i * 2 * Math.PI / 3 + this.innerGap, 
                this.innerOffset + ((i + 1) % 3) * 2 * Math.PI / 3 - this.innerGap,
                this.innerColor, this.innerWidth, this.innerRadius
            );
        }

        //Draw three triangles.
        for(let i = 0; i < 3; i++)
        {
            this.drawTriangle
            (
                this.outerOffset + i * 2 * Math.PI / 3, this.TriColor, this.triTip, this.triBase
            );
        }

        //------------------- Update the zoom variables -------------------
        this.CurrentRadLen += this.zoomStep * this.radLen;

        //Check if zoom in is done.
        if(this.CurrentRadLen >= 8 * this.radLen)
        {
            this.stopAnimation();
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    //Animate the rotating target.
    doRotate()
    {
        //Draw outer three arcs.
        for(let i = 0; i < 3; i++)
        {
            this.drawArc
            (
                this.outerOffset + i * 2 * Math.PI / 3 + this.outerGap, 
                this.outerOffset + ((i + 1) % 3) * 2 * Math.PI / 3 - this.outerGap,
                this.outerColor, this.outerWidth, this.outerRadius
            );
        }

        //Draw inner three arcs.
        for(let i = 0; i < 3; i++)
        {
            this.drawArc
            (
                this.innerOffset + i * 2 * Math.PI / 3 + this.innerGap, 
                this.innerOffset + ((i + 1) % 3) * 2 * Math.PI / 3 - this.innerGap,
                this.innerColor, this.innerWidth, this.innerRadius
            );
        }

        //Draw three triangles.
        for(let i = 0; i < 3; i++)
        {
            this.drawTriangle
            (
                this.outerOffset + i * 2 * Math.PI / 3, this.TriColor, this.triTip, this.triBase
            );
        }

        //------------------- Update the rotation variables -------------------
        this.outerOffset += this.dTheta;

        //outerOffset is 2 * pi periodic.
        if(this.outerOffset >= 2 * Math.PI)
        {
            this.outerOffset -= 2 * Math.PI;
        }

        this.innerOffset -= 2 * this.dTheta;

        //innerOffset is 2 * pi periodic.
        if(this.innerOffset <= 0)
        {
            this.innerOffset += 2 * Math.PI;
        }
    }

    //Draw an arc. Draws border around outside of circle.
    drawArc(startAngle, endAngle, color, width, radius)
    {
        this.ctx.beginPath();
        this.ctx.lineWidth = width * this.radius;
        this.ctx.strokeStyle = color;
        this.ctx.arc(this.canvasMiddleX, this.canvasMiddleY, this.radius * radius, startAngle, endAngle);
        this.ctx.stroke();
    }

    //Draw triangles pointing inward.
    drawTriangle(angle, color, tip, baseAngle)
    {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.moveTo(this.canvasMiddleX + tip * this.radius * Math.cos(angle), 
                        this.canvasMiddleY + tip * this.radius * Math.sin(angle));
        this.ctx.lineTo(this.canvasMiddleX + this.radius * Math.cos(angle + baseAngle),
                        this.canvasMiddleY + this.radius * Math.sin(angle + baseAngle));
        this.ctx.lineTo(this.canvasMiddleX + this.radius * Math.cos(angle - baseAngle), 
                        this.canvasMiddleY + this.radius * Math.sin(angle - baseAngle));
        this.ctx.fill();
    }

    //Start the timer.
    startAnimation()
    {
        this.isRunning = true;
        clearInterval(this.intervalId);

        //This is necessary to use setInterval in the class scope.
        var self = this;
        this.intervalId = setInterval(function() { self.draw() }, this.ANIM_TIME);
    }

    //Stop the timer.
    stopAnimation()
    {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }
}

/******************************************* Top Level *******************************************/
$(document).ready(function()
{
    $("#farmer-a").mouseleave(farmerLeave);
    $("#farmer-a").mouseenter(farmerEnter);
    $("#hangman-a").mouseleave(hangmanLeave);
    $("#hangman-a").mouseenter(hangmanEnter);
    $("#crystal-a").mouseleave(crystalLeave);
    $("#crystal-a").mouseenter(crystalEnter);
    $("#quiz-a").mouseleave(quizLeave);
    $("#quiz-a").mouseenter(quizEnter);
    $("#train-a").mouseleave(trainLeave);
    $("#train-a").mouseenter(trainEnter);
    $("#weather-a").mouseleave(weatherLeave);
    $("#weather-a").mouseenter(weatherEnter);
});

//Get references to the timer canvas and its parent container.
var farmerCanv  = document.getElementById("farmer-canv");
var farmerA     = document.getElementById("farmer-a");
var hangmanCanv = document.getElementById("hangman-canv");
var hangmanA    = document.getElementById("hangman-a");
var crystalCanv = document.getElementById("crystal-canv");
var crystalA    = document.getElementById("crystal-a");
var quizCanv    = document.getElementById("quiz-canv");
var quizA       = document.getElementById("quiz-a");
var trainCanv   = document.getElementById("train-canv");
var trainA      = document.getElementById("train-a");
var weatherCanv = document.getElementById("weather-canv");
var weatherA    = document.getElementById("weather-a");

//Create object to paint target on a canvas.
var farmerTarget  = new Target(farmerCanv,  farmerA,  .95);
var hangmanTarget = new Target(hangmanCanv, hangmanA, .95);
var crystalTarget = new Target(crystalCanv, crystalA, .95);
var quizTarget    = new Target(quizCanv,    quizA,    .95);
var trainTarget   = new Target(trainCanv,   trainA,   .95);
var weatherTarget = new Target(weatherCanv, weatherA, .95);

//Enter/exit functions for controlling the target animations.
function farmerEnter()
{
    farmerTarget.resetAnimation();
    farmerTarget.startAnimation();
}

function farmerLeave()
{
    farmerTarget.initZoomOut();
}

function hangmanEnter()
{
    hangmanTarget.resetAnimation();
    hangmanTarget.startAnimation();
}

function hangmanLeave()
{
    hangmanTarget.initZoomOut();
}

function crystalEnter()
{
    crystalTarget.resetAnimation();
    crystalTarget.startAnimation();
}

function crystalLeave()
{
    crystalTarget.initZoomOut();
}

function quizEnter()
{
    quizTarget.resetAnimation();
    quizTarget.startAnimation();
}

function quizLeave()
{
    quizTarget.initZoomOut();
}

function trainEnter()
{
    trainTarget.resetAnimation();
    trainTarget.startAnimation();
}

function trainLeave()
{
    trainTarget.initZoomOut();
}

function weatherEnter()
{
    weatherTarget.resetAnimation();
    weatherTarget.startAnimation();
}

function weatherLeave()
{
    weatherTarget.initZoomOut();
}
