/************************************** Target Overlay Class *************************************/
const ANIM_ROTATE   = 0x00; //Do rotation animation.
const ANIM_ZOOM_IN  = 0x01; //Zoom in on target animation.
const ANIM_ZOOM_OUT = 0x02; //Zoout out from target animation.
const ANIM_STATIC   = 0x00; //The target is in the center of the tag.
const ANIM_MOVE     = 0x01; //The target follows the mouse.

class Target
{
    constructor(canvas, canDiv, radLen, style)
    {
        this.canvas = canvas; //Canvas to draw timer on.
        this.canDiv = canDiv; //Parent container of the canvas.
        this.radLen = radLen; //The fraction of the canvas radius to use.
        this.style  = style;  //Target is static or follows the mouse.
        
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

        //Tracks the x and y position of the mouse.
        this.xpos;
        this.ypos;

        var self = this;

        //This event listener tracks the coordinates of the mouse.
        function findObjectCoords(mouseEvent)
        {
            var obj = self.canvas;
            var obj_left = 0;
            var obj_top = 0;
           
            while (obj.offsetParent)
            {
                obj_left += obj.offsetLeft;
                obj_top += obj.offsetTop;
                obj = obj.offsetParent;
            }

            if (mouseEvent)
            {
                //FireFox
                self.xpos = mouseEvent.pageX;
                self.ypos = mouseEvent.pageY;
            }
            else
            {
                //IE
                self.xpos = window.event.x + document.body.scrollLeft - 2;
                self.ypos = window.event.y + document.body.scrollTop - 2;
            }

            self.xpos -= obj_left;
            self.ypos -= obj_top;
            self.ypos += document.body.scrollTop;
        }

        this.canvas.onmousemove = findObjectCoords;
    }

    /******************************** GameTimer Class Functions **********************************/
    //Animates the timer.  This function is called every ANIM_TIME milliseconds.
    draw()
    {
        this.canvasWidth = this.canDiv.clientWidth;
        this.canvasHeight = this.canDiv.clientHeight;

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
                
        if(this.style === ANIM_STATIC)
        {
            //Calculate the center of the canvas.
            this.canvasMiddleX = this.canvasWidth / 2;
            this.canvasMiddleY = this.canvasHeight / 2;

            //Calculate the drawing radius.
            this.radius = (this.canvasWidth > this.canvasHeight) ? 
                           this.canvasMiddleY : this.canvasMiddleX;
        }
        else
        {
            this.canvasMiddleX = this.xpos;
            this.canvasMiddleY = this.ypos;
            this.radius = this.canvas.width;
        }
          
        this.radius *= this.CurrentRadLen;

        //Clear the canvas.
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

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
                this.outerOffset + i * 2 * Math.PI / 3,
                this.TriColor, this.triTip, this.triBase
            );
        }

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
        if(this.style === ANIM_STATIC)
        {
            this.CurrentRadLen = 8 * this.radLen;
        }
        else
        {
            this.CurrentRadLen = this.radLen;
        }
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
        //Update the zoom variables
        if(this.style === ANIM_STATIC)
        {
            this.CurrentRadLen -= this.zoomStep * this.radLen;
        }
        else
        {
            this.CurrentRadLen = this.radLen;
        }
        
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
        //Update the zoom variables
        if(this.style === ANIM_STATIC)
        {
            this.CurrentRadLen += this.zoomStep * this.radLen;
        }
        else
        {
            this.CurrentRadLen = 8 * this.radLen;
        }
        
        //Check if zoom in is done.
        if(this.CurrentRadLen >= 8 * this.radLen)
        {
            this.stopAnimation();
        }
    }

    //Animate the rotating target.
    doRotate()
    {
        //Update the rotation variables
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

    //Draw an arc.
    drawArc(startAngle, endAngle, color, width, radius)
    {
        this.ctx.beginPath();
        this.ctx.lineWidth = width * this.radius;
        this.ctx.strokeStyle = color;
        this.ctx.arc(this.canvasMiddleX, this.canvasMiddleY, 
                     this.radius * radius, startAngle, endAngle);
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
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}

/******************************************* Top Level *******************************************/
$(document).ready(function()
{
    $("#farmer-a").mouseleave(farmerLeave);
    $("#farmer-a").mouseenter(farmerEnter);
    $("#farmer-a").on("click", farmerClick);
    $("#hangman-a").mouseleave(hangmanLeave);
    $("#hangman-a").mouseenter(hangmanEnter);
    $("#hangman-a").on("click", hangmanClick);
    $("#crystal-a").mouseleave(crystalLeave);
    $("#crystal-a").mouseenter(crystalEnter);
    $("#crystal-a").on("click", crystalClick);
    $("#quiz-a").mouseleave(quizLeave);
    $("#quiz-a").mouseenter(quizEnter);
    $("#quiz-a").on("click", quizClick);
    $("#train-a").mouseleave(trainLeave);
    $("#train-a").mouseenter(trainEnter);
    $("#train-a").on("click", trainClick);
    $("#weather-a").mouseleave(weatherLeave);
    $("#weather-a").mouseenter(weatherEnter);
    $("#weather-a").on("click", weatherClick);
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
var farmerTarget  = new Target(farmerCanv,  farmerA,  .20, ANIM_MOVE);
var hangmanTarget = new Target(hangmanCanv, hangmanA, .95, ANIM_STATIC);
var crystalTarget = new Target(crystalCanv, crystalA, .20, ANIM_MOVE);
var quizTarget    = new Target(quizCanv,    quizA,    .95, ANIM_STATIC);
var trainTarget   = new Target(trainCanv,   trainA,   .20, ANIM_MOVE);
var weatherTarget = new Target(weatherCanv, weatherA, .95, ANIM_STATIC);

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

function farmerClick()
{
    farmerTarget.resetAnimation();
    farmerTarget.stopAnimation();
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

function hangmanClick()
{
    hangmanTarget.resetAnimation();
    hangmanTarget.stopAnimation();
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

function crystalClick()
{
    crystalTarget.resetAnimation();
    crystalTarget.stopAnimation();
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

function quizClick()
{
    quizTarget.resetAnimation();
    quizTarget.stopAnimation();
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

function trainClick()
{
    trainTarget.resetAnimation();
    trainTarget.stopAnimation();
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

function weatherClick()
{
    weatherTarget.resetAnimation();
    weatherTarget.stopAnimation();
}
