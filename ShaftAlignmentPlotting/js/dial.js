class Dial
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get RADS_PER_TICK() {return 2 * Math.PI / 100}
    static get MAX_WIDTH() {return 250}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        parentDiv,
        {
            numberColor = "#000000",
            needleColor = "#000000"
        } = {}
    )
    {
        this.parentDiv = parentDiv;

        this.numberColor = numberColor;
        this.needleColor = needleColor;

        //Context of the canvas.
        this.ctxDial;

        //Range of the dial. -99 to +99.
        this.dialValue = undefined;

        //Height and width of the canvas.
        this.bodyWidth  = 100;
        this.bodyHeight = 100;
        this.bodyMiddle = 50;

        //HTML stuff.
        this.paddingDiv = undefined;
        this.bodyCanvas = undefined;

        //Only create level if the parent exists.
        if(this.parentDiv)this.init();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    init()
    {
        //Create the components necessary for the level.
        this.paddingDiv = document.createElement("div");
        this.bodyCanvas = document.createElement("canvas");

        //Get 2D contexts of the canvas.
        this.ctxDial = this.bodyCanvas.getContext("2d");

        //Clear anything out of the parent div.
        this.parentDiv.innerHTML = "";

        //Add all the components to the div.
        this.paddingDiv.appendChild(this.bodyCanvas);
        this.parentDiv.appendChild(this.paddingDiv);
        
        //Add resize listener to the window.
        window.addEventListener("resize", () => this.resize());

        //Set initial size of the level.
        this.resize();
    }

    resize()
    {
        //Get the dimensions of the parent container.
        let padRect    = this.paddingDiv.getBoundingClientRect();
        let parentRect = this.parentDiv.getBoundingClientRect();

        //Calculate the width and height of the canvas.
        this.bodyCanvas.width  = (padRect.width > Dial.MAX_WIDTH) ? Dial.MAX_WIDTH : padRect.width;
        this.bodyCanvas.height = this.bodyCanvas.width;

        //Save a copy of the height and width of the canvas for future calculations.
        this.bodyWidth  = this.bodyCanvas.width;
        this.bodyHeight = this.bodyCanvas.height;

        //Calculate the center of the canvas.
        this.bodyMiddle = this.bodyWidth / 2;
        this.radius     = this.bodyWidth * .45;

        //Center the canvas in the padding div.
        let topPad  = (parentRect.height - this.bodyCanvas.height) / 2;
        let leftPad = (padRect.width - this.bodyCanvas.width) / 2;
        this.paddingDiv.style.paddingTop = topPad + "px";
        this.paddingDiv.style.paddingLeft = leftPad + "px";

        this.bodyDraw();
    }

    bodyDraw()
    {
        //Clear the canvas.
        this.ctxDial.clearRect(0, 0, this.bodyWidth, this.bodyHeight);

        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 5) return;

        //Make sure the background of the dial is white.
        this.ctxDial.beginPath();
        this.ctxDial.fillStyle = "#ffffff";
        this.ctxDial.arc(this.bodyMiddle, this.bodyMiddle, this.radius, 0, 2 * Math.PI);
        this.ctxDial.fill();

        //Draw the outer ring of the dial.
        this.drawArc(0, 2 * Math.PI, this.radius, "#000000", this.bodyWidth * .010);
        
        //Draw the minor ticks.
        let thisTheta = -Math.PI / 2;
        for(let i = 0; i < 100; i++)
        {
            this.drawLineAngle(thisTheta, "#707070", this.bodyWidth * .005, this.radius, this.bodyWidth * .40);
            thisTheta += Dial.RADS_PER_TICK;
        }

        //Draw the major ticks.
        thisTheta = -Math.PI / 2;
        for(let i = 0; i < 10; i++)
        {
            this.drawLineAngle(thisTheta, "#707070", this.bodyWidth * .01, this.radius, this.bodyWidth * .35);
            thisTheta += Dial.RADS_PER_TICK * 10;
        }

        //Draw the numbers.
        thisTheta = -Math.PI / 2;
        for(let i = 0; i < 10; i++)
        {
            let iText = "" + i * 10;
            if(i === 0)
            {
                iText = " " + iText;
            }
            this.drawTextAngle(thisTheta, iText, this.numberColor, .2, .65);
            thisTheta += Dial.RADS_PER_TICK * 10;
        }

        //Draw the needle if the value is valid.
        if(this.dialValue <= 99 && this.dialValue >= -99)
        {
            let angle = -Math.PI / 2 + Dial.RADS_PER_TICK * this.dialValue;;

            //Draw the needle on the dial.
            this.drawTriangle(angle, this.needleColor, .1, .90);
        }

        //Draw the inner circle the needle attaches to.
        this.drawArc(0, 2 * Math.PI, this.radius * .1, this.needleColor, this.radius * .01, true);
    }

    //Sets the dial value.
    setDial(value)
    {
        let num = parseFloat(value, 10); 

        if(!isNaN(num) && num >= -99 && num <= 99)
        {
            this.dialValue = num;
        }
        else
        {
            this.dialValue = undefined;
        }

        this.bodyDraw();
    }

    //Draw the needle on the dial.
    drawTriangle(angle, color, base, height)
    {
        this.ctxDial.beginPath();
        this.ctxDial.fillStyle = color;
        this.ctxDial.moveTo(this.bodyMiddle + this.radius * height * Math.cos(angle), 
                            this.bodyMiddle + this.radius * height * Math.sin(angle));
        this.ctxDial.lineTo(this.bodyMiddle + this.radius * base / 2 * Math.cos(angle + Math.PI/2),
                            this.bodyMiddle + this.radius * base / 2 * Math.sin(angle + Math.PI/2));
        this.ctxDial.lineTo(this.bodyMiddle + this.radius * base / 2 * Math.cos(angle - Math.PI/2), 
                            this.bodyMiddle + this.radius * base / 2 * Math.sin(angle - Math.PI/2));
        this.ctxDial.fill();
    }

    //Draw text in polar coordinates.
    drawTextAngle(angle, text, color, ratio, textRadius)
    {
        var textSize = this.radius * ratio;
        this.ctxDial.font = textSize + "px Arial";
        this.ctxDial.fillStyle = color;
        this.ctxDial.fillText(text, this.bodyMiddle - (textSize * .8) + 
                                this.radius * textRadius * Math.cos(angle) + this.bodyWidth * .02, 
                                this.bodyMiddle + (textSize * .2) +
                                this.radius * textRadius * Math.sin(angle) + this.bodyWidth * .015);   
    }

    //Draw lines in polar coordinates.
    drawLineAngle(angle, color, width, rStart, rEnd)
    {
        this.ctxDial.beginPath();
        this.ctxDial.lineWidth = width;
        this.ctxDial.strokeStyle = color;
        this.ctxDial.moveTo(this.bodyMiddle + rStart * Math.cos(angle), this.bodyMiddle + rStart * Math.sin(angle));
        this.ctxDial.lineTo(this.bodyMiddle + rEnd   * Math.cos(angle), this.bodyMiddle + rEnd   * Math.sin(angle));
        this.ctxDial.stroke();
    }

    //Draw arcs in polar coordinates.
    drawArc(startAngle, endAngle, radius, color, width, isFill = false)
    {
        this.ctxDial.beginPath();
        this.ctxDial.lineWidth = width;
        this.ctxDial.strokeStyle = color;
        this.ctxDial.fillStyle = color;
        this.ctxDial.arc(this.bodyMiddle, this.bodyMiddle, radius, startAngle, endAngle);
        isFill ? this.ctxDial.fill() : this.ctxDial.stroke();
    }
}