/**************************************** GameTimer Class ****************************************/
class ATimer
{
    static get CLOCK_STYLE_0(){return 0}   //Grey background.
    static get CLOCK_STYLE_1(){return 1}   //Transparent background.
    static get ANIM_TIME()    {return 50}  //500ms between animations(2 frames per second).

    constructor(canvas, cnvsHeightWidth, timerSeconds, timerType, textColor, timeUpCallBack)
    {
        this.canvas = canvas;
        this.cnvsHeightWidth = cnvsHeightWidth;
        this.timerSeconds = timerSeconds;
        this.timerType = timerType;
        this.textColor = textColor;
        this.timeUpCallBack = timeUpCallBack;
        this.canvasMiddle = this.cnvsHeightWidth / 2;
        this.radius = this.canvasMiddle - 5;
        this.canvas.height = cnvsHeightWidth;
        this.canvas.width = cnvsHeightWidth;
        this.ctx = canvas.getContext("2d");
        this.startAng = -Math.PI/2;
        this.endAng = 0;
        this.intervalId;
        this.isRunning = false;
        this.timeRemaining = timerSeconds;
        this.timeString;

        //dTheta is the amount to update the angle every animation frame.
        this.dTheta = 2*Math.PI / (1000 / ATimer.ANIM_TIME * this.timerSeconds);
    }

    /******************************** GameTimer Class Functions **********************************/
    //This function draws a line in polar coordinates.
    drawLineAngle(angle, color, width)
    {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(this.canvasMiddle, this.canvasMiddle);
        this.ctx.lineTo(this.canvasMiddle + this.radius * Math.cos(angle), this.canvasMiddle + this.radius * Math.sin(angle));
        this.ctx.stroke();
    }

    //Draw an arc. Draws border around outside of circle.
    drawArc(startAngle, endAngle, color, width)
    {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.arc(this.canvasMiddle, this.canvasMiddle, this.radius, startAngle, endAngle);
        this.ctx.stroke();
    }

    //Draw a filled in partial circle.
    drawPieSlice(startAngle, endAngle, color)
    {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasMiddle, this.canvasMiddle);
        this.ctx.arc(this.canvasMiddle, this.canvasMiddle, this.radius, startAngle, endAngle);
        this.ctx.closePath();
        this.ctx.fill();
    }

    //Sets the timer time and recalculated dTheta.
    setTime(seconds)
    {
        this.timerSeconds = seconds;
        this.timeRemaining = this.timerSeconds;
        this.startAng = -Math.PI/2;
        this.endAng = 0;
        this.dTheta = 2*Math.PI / (1000 / ATimer.ANIM_TIME * this.timerSeconds);
    }

    //Convert seconds into minutes, seconds and tenths of a second.
    timeConverter()
    {
        var tenthsString = this.timeRemaining.toFixed(1).toString();
        var tenths = tenthsString[tenthsString.length - 1];
        var minutes = Math.floor(this.timeRemaining / 60);
        var seconds = Math.floor(this.timeRemaining - minutes * 60);
      
        if (seconds < 10)
        {
            seconds = "0" + seconds;
        }
      
        if (minutes === 0)
        {
            minutes = "00";
        }
      
        else if (minutes < 10)
        {
            minutes = "0" + minutes;
        }

        //return minutes + ":" + seconds + "." + tenths;
        return minutes + ":" + seconds;
    }

    //Prints the time string over the face of the timer.
    printTime()
    {
        var textSize = this.cnvsHeightWidth * .2;
        this.ctx.font = textSize + "px Arial";
        this.ctx.fillStyle = this.textColor;

        var y = this.canvasMiddle + textSize / 3;
        //var x = this.canvasMiddle * .33;
        var x = this.canvasMiddle * .5;

        if(this.timeRemaining >= 0)
        {
            this.ctx.fillText(this.timeConverter(), x, y);
        }
        else
        {
            //this.ctx.fillText("00:00.0", x, y);
            this.ctx.fillText("00:00", x, y);
        }
    }

    //Reset the timer and recalculate dTheta.
    resetTimer()
    {
        this.timeRemaining = this.timerSeconds;
        this.startAng = -Math.PI/2;
        this.endAng = 0;
        this.dTheta = 2*Math.PI / (1000 / ATimer.ANIM_TIME * this.timerSeconds);
    }

    //Start the timer.
    startTimer()
    {
        this.isRunning = true;
        clearInterval(this.intervalId);

        //This is necessary to use setInterval in the class scope.
        var self = this;
        this.intervalId = setInterval(function() { self.animateTime() }, ATimer.ANIM_TIME);
    }

    //Stop the timer.
    stopTimer()
    {
        this.isRunning = false;
        clearInterval(this.intervalId);
    }

    //Animates the timer.  This function is called every 50 milliseconds.
    animateTime()
    {
        var circleColorGreen;
        var circleColorRed;
    
        this.endAng += this.dTheta;

        //Calculate the proper color based on the current angle.
        if(this.endAng < Math.PI)
        {
            //Green to yellow.
            circleColorGreen = 0xff;
            circleColorRed = Math.round(255/Math.PI * this.endAng);
        }   
        else
        {
            //Yellow to red.
            circleColorGreen = Math.round(255/Math.PI * (2*Math.PI - this.endAng));
            circleColorRed = 0xff;
        }

        //Set the color of the face of the timer.
        var circleColor = "rgb(" + circleColorRed + ", " + circleColorGreen + ", 0)";

        //Update the time remaining.
        this.timeRemaining -= ATimer.ANIM_TIME / 1000;

        //Draw the timer graphics.
        if(this.timerType === ATimer.CLOCK_STYLE_0) //Circular with a Grey background.
        {
            this.ctx.clearRect(0, 0, this.cnvsHeightWidth, this.cnvsHeightWidth);
            this.drawPieSlice(0, 2*Math.PI, circleColor);
            this.drawPieSlice(this.startAng, this.startAng + this.endAng, '#7f7f7f');
            this.drawLineAngle(this.startAng + this.endAng, '#000000', 1);
            this.drawLineAngle(this.startAng, '#000000', 1);
            this.drawArc(0, 2*Math.PI, '#000000', 1);
            this.printTime();
        }
        else //Circular with a transparent background.
        {
            this.ctx.clearRect(0, 0, this.cnvsHeightWidth, this.cnvsHeightWidth);
            this.drawPieSlice(this.startAng - 2*Math.PI + this.endAng, this.startAng, circleColor);
            this.drawLineAngle(this.startAng, '#000000', 2);
            this.drawLineAngle(this.startAng - 2*Math.PI + this.endAng, '#000000', 2);
            this.drawArc(this.startAng - 2*Math.PI + this.endAng, this.startAng, '#000000', 2);
            this.printTime();
        }
    
        //Check if timer has expired. If so, do some housekeeping and call the time out callback function.
        if(this.endAng >= 2*Math.PI - this.dTheta)
        {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.timeUpCallBack();
        }
    }
}