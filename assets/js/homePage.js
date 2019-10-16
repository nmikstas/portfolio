/*************************************** Slide Timer Class ***************************************/
class STimer
{
    static get ANIM_TIME(){return 50} //50ms between animations(20 frames per second).

    constructor(canvas, canDiv, time, color, width, radLen, parentFrac)
    {
        this.canvas = canvas;         //Canvas to draw timer on.
        this.canDiv = canDiv;         //Parent container of the canvas.
        this.time = time;             //The timer length in seconds.
        this.color = color;           //The color of the timer graphic.
        this.width = width;           //The width of the graphic as a fraction of the radius.
        this.radLen = radLen;         //The fraction of the canvas radius to use.
        this.parentFrac = parentFrac; //Fraction of parent size to use for timer size.

        this.ctx = canvas.getContext("2d");
        this.intervalId;
        this.canvasWidth;
        this.canvasHeight;
        this.canvasMiddleX;
        this.canvasMiddleY;
        this.radius;

        this.startAng = -Math.PI / 2;
        this.endAng = this.startAng + 2 * Math.PI;
        
        //dTheta is the amount to update the angle every animation frame.
        this.dTheta = 2 * Math.PI / (1000 / STimer.ANIM_TIME * this.time);

        //Calculate the total number of animations needed.
        this.numAnimations = 2 * Math.PI / this.dTheta;
    }

    /******************************** GameTimer Class Functions **********************************/
    //Animates the timer.  This function is called every ANIM_TIME milliseconds.
    draw()
    {
        this.canvasWidth = this.canDiv.clientWidth * this.parentFrac;
        this.canvasHeight = this.canDiv.clientHeight * this.parentFrac;

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
                
        //Calculate the center of the canvas.
        this.canvasMiddleX = this.canvasWidth / 2;
        this.canvasMiddleY = this.canvasHeight / 2;

        //Calculate the drawing radius.
        this.radius = (this.canvasWidth > this.canvasHeight) ? 
                       this.canvasMiddleY : this.canvasMiddleX;
        this.radius *= this.radLen;

        //Clear the canvas.
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        //Draw the timer arc.
        this.drawArc(this.endAng, this.startAng, this.color, this.width);

        //Update the angles.
        this.endAng += this.dTheta;

        //Decrement the number of animations left
        this.numAnimations--;

        //Check if timer has expired. If so, shut down the timer.
        if(this.numAnimations <= 0)
        {
            clearInterval(this.intervalId);
        }
    }

    //Draw an arc. Draws border around outside of circle.
    drawArc(startAngle, endAngle, color, width)
    {
        this.ctx.beginPath();
        this.ctx.lineWidth = width * this.radius;
        this.ctx.strokeStyle = color;
        this.ctx.arc(this.canvasMiddleX, this.canvasMiddleY, this.radius, startAngle, endAngle);
        this.ctx.stroke();
    }

    //Sets the timer time and recalculated dTheta.
    setTime(seconds)
    {
        this.timerSeconds = seconds;
        this.timeRemaining = this.timerSeconds;
        this.startAng = -Math.PI/2;
        this.endAng = this.startAng + 2 * Math.PI;
        this.dTheta = 2*Math.PI / (1000 / STimer.ANIM_TIME * this.time);
        this.numAnimations = 2 * Math.PI / this.dTheta;
    }

    //Reset the timer and recalculate dTheta.
    resetTimer()
    {
        this.startAng = -Math.PI/2;
        this.endAng = this.startAng + 2 * Math.PI;
        this.dTheta = 2*Math.PI / (1000 / STimer.ANIM_TIME * this.time);
        this.numAnimations = 2 * Math.PI / this.dTheta;
    }

    //Start the timer.
    startTimer()
    {
        this.isRunning = true;
        clearInterval(this.intervalId);

        //This is necessary to use setInterval in the class scope.
        var self = this;
        this.intervalId = setInterval(function() { self.draw() }, STimer.ANIM_TIME);
    }

    //Stop the timer.
    stopTimer()
    {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }
}

/******************************************* Top Level *******************************************/
$(document).ready(function()
{
    $("#portfolio-carousel").mouseleave(leaveCarousel);
    $("#portfolio-carousel").mouseenter(enterCarousel);
    $('#portfolio-carousel').on('slide.bs.carousel', carouselSlide);
});

//Get references to the timer canvas and its parent container.
var thisCanvas = document.getElementById("carousel-overlay");
var thisCanDiv = document.getElementById("carousel-div");

//Keep track of last enter/leave.
var lastStatus = "none";

//Create a timer object and get it started.
var timer = new STimer(thisCanvas, thisCanDiv, 10, "#ffffff", .30, .70, .10);
timer.draw();
timer.startTimer();

//Called when mouse pointer leaves the carousel div.
function leaveCarousel()
{
    timer.startTimer();
    lastStatus = "leave";
}

//Called when mouse pointer enters the carousel div.
function enterCarousel()
{
    timer.stopTimer();
    timer.resetTimer();
    timer.draw();
    lastStatus = "enter";
}

//Called when carousel begins a slide.
function carouselSlide()
{
    //Make sure it was a time out slide and not a button click slide.
    if(lastStatus !== "enter")
    {
        timer.resetTimer();
        timer.draw();
        timer.startTimer();
    } 
}
