"use strict";

class Level
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                       Enumerations                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Number of day squares on the calendar
    static get HEIGHT_MULT() {return 3.0}
    static get MAX_WIDTH() {return 150}
    static get GRAD_PERCENT() {return .0666666667}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        parentDiv,
        {
            bubbleColor = "#00ff00"
        } = {}
    )
    {
        this.parentDiv = parentDiv;
        this.bubbleColor = bubbleColor;

        //Context of the canvas.
        this.ctxLevel;

        //Offset of the bubble. Valid between -8.0 and 8.0;
        this.bubbleOffset = -10;

        //Height and width of the canvas.
        this.bodyWidth = 100;
        this.bodyHeight = 300;

        //Only create date/time picker if the parent exists.
        if(this.parentDiv)this.init();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    /************************************* Window Listeners **************************************/

    init()
    {
        //Create the components necessary for the level.
        this.paddingDiv = document.createElement("div");
        this.bodyCanvas = document.createElement("canvas");

        //Get 2D contexts of the canvas.
        this.ctxLevel = this.bodyCanvas.getContext("2d");

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
        this.bodyCanvas.width  = (padRect.width > Level.MAX_WIDTH) ? Level.MAX_WIDTH : padRect.width;
        this.bodyCanvas.height = this.bodyCanvas.width * Level.HEIGHT_MULT;

        //Save a copy of the height and width of the canvas for future calculations.
        this.bodyWidth  = this.bodyCanvas.width;
        this.bodyHeight = this.bodyCanvas.height;

        //Center the canvas in the padding div.
        let topPad  = (parentRect.height - this.bodyCanvas.height) / 2;
        let leftPad = (padRect.width - this.bodyCanvas.width) / 2;
        this.paddingDiv.style.paddingTop = topPad + "px";
        this.paddingDiv.style.paddingLeft = leftPad + "px";

        this.bodyDraw();
        this.bubbleDraw(this.bubbleOffset);
        
    }

    bodyDraw()
    {
        //Draw the top arc of the level.
        this.ctxLevel.beginPath();
        this.ctxLevel.lineWidth = this.bodyWidth * .05;
        this.ctxLevel.strokeStyle = "black";
        let topRadius = this.bodyWidth / 2 - this.ctxLevel.lineWidth / 2;
        this.ctxLevel.arc(this.bodyWidth / 2, this.bodyWidth /2, topRadius, -Math.PI, 0);
        this.ctxLevel.stroke();

        //Draw the bottom arc of the level.
        this.ctxLevel.beginPath();
        this.ctxLevel.lineWidth = this.bodyWidth * .05;
        this.ctxLevel.strokeStyle = "black";
        let bottomRadius = this.bodyWidth / 2 - this.ctxLevel.lineWidth / 2;
        this.ctxLevel.arc(this.bodyWidth / 2, this.bodyHeight - this.bodyWidth / 2, bottomRadius, 0, -Math.PI);
        this.ctxLevel.stroke();

        //Draw left and right edges of level.
        this.ctxLevel.beginPath();
        this.ctxLevel.lineWidth = this.bodyWidth * .05;
        this.ctxLevel.strokeStyle = "black";
        this.ctxLevel.moveTo(this.ctxLevel.lineWidth / 2, this.bodyWidth / 2);
        this.ctxLevel.lineTo(this.ctxLevel.lineWidth / 2, this.bodyHeight - this.bodyWidth / 2);
        this.ctxLevel.moveTo(this.bodyWidth - this.ctxLevel.lineWidth / 2, this.bodyWidth / 2);
        this.ctxLevel.lineTo(this.bodyWidth - this.ctxLevel.lineWidth / 2, this.bodyHeight - this.bodyWidth / 2);
        this.ctxLevel.stroke();

        //Draw graduations.
        this.ctxLevel.beginPath();
        this.ctxLevel.lineWidth = this.bodyWidth * .02;
        this.ctxLevel.strokeStyle = "#ff000070";

        let posY = this.bodyHeight * .10;
        let IncY = this.bodyHeight * Level.GRAD_PERCENT;
        let startX = this.bodyWidth * .2;
        let startWideX = this.bodyWidth *.10;
        let endX = this.bodyWidth - startX;
        let endWideX = this.bodyWidth - startWideX;

        for(let i = 0; i < 13; i++)
        {
            if(i === 2 || i === 10)
            {
                this.ctxLevel.moveTo(startWideX, posY);
                this.ctxLevel.lineTo(endWideX, posY);
            }
            else
            {
                this.ctxLevel.moveTo(startX, posY);
                this.ctxLevel.lineTo(endX, posY);
            }
            posY += IncY;
        }

        this.ctxLevel.stroke();

        //Draw the circles on the major graduations.
        this.ctxLevel.beginPath();
        this.ctxLevel.lineWidth = this.bodyWidth * .05;
        this.ctxLevel.strokeStyle = "#ff000070";

        posY = this.bodyHeight * .10;

        for(let i = 0; i < 13; i++)
        {
            if(i === 2 || i === 10)
            {
                this.ctxLevel.moveTo(startWideX, posY);
                this.ctxLevel.arc(startWideX, posY, this.bodyWidth * .02, 0, 2 * Math.PI);
                this.ctxLevel.moveTo(endWideX, posY);
                this.ctxLevel.arc(endWideX, posY, this.bodyWidth * .02, 0, 2 * Math.PI);
            }
            posY += IncY;
        }

        this.ctxLevel.stroke();

        //Draw a clipping rectangle.
        this.ctxLevel.beginPath();
        this.ctxLevel.lineWidth = .01;
        this.ctxLevel.arc(this.bodyWidth / 2, this.bodyWidth /2, topRadius * 1.07, -Math.PI, 0);
        this.ctxLevel.lineTo(this.bodyWidth, this.bodyHeight - this.bodyWidth / 2);
        this.ctxLevel.arc(this.bodyWidth / 2, this.bodyHeight - this.bodyWidth /2, bottomRadius * 1.07, 0, -Math.PI);

        
        this.ctxLevel.clip();
    }

    bubbleDraw(num)
    {
        this.bubbleOffset = num;

        this.ctxLevel.clearRect(0, 0, this.bodyWidth, this.bodyHeight);

        //Only draw the bubble if its in a valid range.
        if(this.bubbleOffset <= 8.0 && this.bubbleOffset >= -8.0)
        {
            //Calculate the bubble center.
            let gradPixels = Level.GRAD_PERCENT * this.bodyHeight; //Calculate pixels per graduation.
            let bubblePixels = gradPixels * num; //Calculate displacement of bubble center in pixels.
            let bubbleMiddle = this.bodyHeight / 2 - bubblePixels; //Calculate absolute bubble center in pixels.
            let bubbleBottom = bubbleMiddle + 4 * gradPixels; //Calculate bottom of bubble in pixels.
            let bubbleTop = bubbleMiddle - 4 * gradPixels; //Calculate top of bubble in pixels.

            this.ctxLevel.beginPath();
            this.ctxLevel.lineWidth = this.bodyWidth * .05;
            this.ctxLevel.fillStyle = this.bubbleColor;
            this.ctxLevel.strokeStyle = this.bubbleColor;
        
            let bottomY = bubbleBottom - this.bodyWidth / 2 + this.ctxLevel.lineWidth / 2;
            let topY = bubbleTop + this.bodyWidth / 2 - this.ctxLevel.lineWidth / 2;
            this.ctxLevel.arc(this.bodyWidth / 2, bottomY, this.bodyWidth / 2 - this.ctxLevel.lineWidth, 0, -Math.PI);
            this.ctxLevel.arc(this.bodyWidth / 2, topY, this.bodyWidth / 2 - this.ctxLevel.lineWidth, -Math.PI, 0);
            this.ctxLevel.lineTo(this.bodyWidth - this.ctxLevel.lineWidth, bottomY);
            this.ctxLevel.fill();
            this.ctxLevel.stroke();
        }

        this.bodyDraw();

        
    }

}
