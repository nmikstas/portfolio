class ShaftPlot
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get HEIGHT_MULT() {return .72727272}
    static get DIM_MIN()     {return .1}
    static get DIM_MAX()     {return 100}
    static get TIR_MIN()     {return -99}
    static get TIR_MAX()     {return 99}
    static get LEFT()        {return -1}
    static get RIGHT()       {return 1}
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        parentDiv,
        {
            backgroundImg   = null,
            backgroundAlpha = 1.0,
            debug           = false
        } = {}
    )
    {
        this.parentDiv = parentDiv;

        //Background image of the plot.
        this.backgroundImg = backgroundImg;
        this.backgroundAlpha = backgroundAlpha;

        //Graphing variables.
        this.paddingDiv;
        this.bodyCanvas;
        this.ctxPlot;
        this.pixelsPerSquare;
        this.inchesPerBlock;
        this.milsPerBlock;

        //Used for printing extra stuff while debugging.
        this.debug = debug;

        //Initial values used to calculate critical points.
        this.dimA = undefined;
        this.dimB = undefined;
        this.dimC = undefined;
        this.dimD = undefined;
        this.dimE = undefined;
        this.dimF = undefined;
        this.sTIR = undefined;
        this.mTIR = undefined;

        //Boolean to tell wether a complete set of valid data is present or not.
        this.isValid = false;

        //Calculated moves.
        this.movable =
        {
            mi: undefined, //Movable inboard feet.
            mo: undefined  //Movable outboard feet.
        }

        this.inboard =
        {
            si: undefined, //Stationary inboard feet.
            mi: undefined  //Movable inboard feet.
        }

        //Intermediate calculation values.
        this.m1 = undefined; //Slope of the green MAL.
        this.m2 = undefined; //Slope of the red MAL.

        //Only create plot if parent exists.
        if(this.parentDiv)this.init();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    init()
    {
        //Create the components necessary for the plot.
        this.paddingDiv = document.createElement("div");
        this.bodyCanvas = document.createElement("canvas");

        //Get 2D contexts of the canvas.
        this.ctxPlot = this.bodyCanvas.getContext("2d");

        //Clear anything out of the parent div.
        this.parentDiv.innerHTML = "";

        //Add all the components to the div.
        this.paddingDiv.appendChild(this.bodyCanvas);
        this.parentDiv.appendChild(this.paddingDiv);
        
        //Add resize listener to the window.
        window.addEventListener("resize", () => this.resize());

        //Set initial size of the plot.
        this.resize();
    }

    resize()
    {
        //Get the dimensions of the parent container.
       let padRect = this.paddingDiv.getBoundingClientRect();

       //Calculate the width and height of the canvas.
       this.bodyCanvas.width  = padRect.width;
       this.bodyCanvas.height = this.bodyCanvas.width * ShaftPlot.HEIGHT_MULT;

       //Save a copy of the height and width of the canvas for future calculations.
       this.bodyWidth  = this.bodyCanvas.width;
       this.bodyHeight = this.bodyCanvas.height;

       this.bodyDraw();
    }

    bodyDraw()
    {
        //Clear any existing drawings.
        this.ctxPlot.clearRect(0, 0, this.bodyWidth, this.bodyHeight);

        //Check for background image.
        if(this.backgroundImg)
        {
            //Get dimensions of image.
            let imgWidth  = this.backgroundImg.naturalWidth;
            let imgHeight = this.backgroundImg.naturalHeight;
            
            //Calculate the multiplier to stretch the image.
            let ratioX = imgWidth  / this.bodyWidth;
            let ratioY = imgHeight / this.bodyHeight;
            let imgMultiplier;
            imgMultiplier = (ratioX > ratioY) ? ratioX : ratioY;

            let offsetX = (this.bodyWidth  / 2) - (imgWidth  / imgMultiplier / 2);
            let offsetY = (this.bodyHeight / 2) - (imgHeight / imgMultiplier / 2);

            //Add background image.
            this.ctxPlot.save();
            this.ctxPlot.globalAlpha = this.backgroundAlpha;
            this.ctxPlot.translate(offsetX, offsetY);
            this.ctxPlot.drawImage(this.backgroundImg, 0, 0, imgWidth / imgMultiplier, imgHeight / imgMultiplier);
            this.ctxPlot.globalAlpha = 1;
            this.ctxPlot.restore();
        }
        else
        {
            this.ctxPlot.beginPath();
            this.ctxPlot.fillStyle = "#ffffff";
            this.ctxPlot.fillRect(0, 0, this.bodyWidth, this.bodyWidth)
            this.ctxPlot.stroke();
        }
        
        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 50) return;

        //Calculate the height/width of the grid squares.
        let dxy = this.bodyWidth / 110;
        let thisdxy = 0;

        //Draw the vertical grid lines.
        for(let i = 0; i < 111; i++)
        {
            this.ctxPlot.beginPath();
            this.ctxPlot.strokeStyle = "#00000070";
            this.ctxPlot.moveTo(thisdxy, 0);
            this.ctxPlot.lineTo(thisdxy, this.bodyHeight);
            this.ctxPlot.lineWidth = (i % 10) ? this.bodyWidth * .0005 : this.bodyWidth * .0015;           
            this.ctxPlot.stroke();

            //Move to next vertical line.
            thisdxy += dxy;
        }

        //Reset for horizontal marks.
        thisdxy = 0;

        //Draw the horizontal grid lines.
        for(let i = 0; i < 81; i++)
        {
            this.ctxPlot.beginPath();
            this.ctxPlot.strokeStyle = "#00000070";
            this.ctxPlot.moveTo(0, thisdxy);
            this.ctxPlot.lineTo(this.bodyWidth, thisdxy);
            this.ctxPlot.lineWidth = (i % 10) ? this.bodyWidth * .0005 : this.bodyWidth * .0015;           
            this.ctxPlot.stroke();

            //Move to next vertical line.
            thisdxy += dxy;
        }
        this.plotDraw();
    }

    //Calculate all the critical points for the graph. Units are in feet and mils.
    doCalcs(dimA, dimB, dimC, dimD, dimE, sTIR, mTIR)
    {
        this.isValid = true;

        let dimA1 = parseFloat(dimA);
        let dimB1 = parseFloat(dimB);
        let dimC1 = parseFloat(dimC);
        let dimD1 = parseFloat(dimD);
        let dimE1 = parseFloat(dimE);
        let sTIR1 = parseFloat(sTIR);
        let mTIR1 = parseFloat(mTIR);

        //Make sure all entries are valid.
        if(isNaN(dimA1) || isNaN(dimB1) || isNaN(dimC1) || isNaN(dimD1) ||
           isNaN(dimE1) || isNaN(sTIR1) || isNaN(mTIR1))
        {
            this.isValid = false;
        }

        //Make sure all entries are within the min and max ranges.
        if(this.isValid && (
           dimA1 < ShaftPlot.DIM_MIN || dimA1 > ShaftPlot.DIM_MAX || dimB1 < ShaftPlot.DIM_MIN || dimB1 > ShaftPlot.DIM_MAX ||
           dimC1 < ShaftPlot.DIM_MIN || dimC1 > ShaftPlot.DIM_MAX || dimD1 < ShaftPlot.DIM_MIN || dimD1 > ShaftPlot.DIM_MAX ||
           dimE1 < ShaftPlot.DIM_MIN || dimE1 > ShaftPlot.DIM_MAX || sTIR1 < ShaftPlot.TIR_MIN || sTIR1 > ShaftPlot.TIR_MAX ||
           mTIR1 < ShaftPlot.TIR_MIN || mTIR1 > ShaftPlot.TIR_MAX))
        {
            this.isValid = false;
        }

        //Make sure certain values are not less than other values.
        if(this.isValid && (dimB1 <= dimA1 || dimC1 <= dimB1 || dimC1 <= dimA1 || dimE1 <= dimD1))
        {
            this.isValid = false;
        }

        //Save the values if they are valid.
        if(!this.isValid)
        {
            this.dimA = undefined;
            this.dimB = undefined;
            this.dimC = undefined;
            this.dimD = undefined;
            this.dimE = undefined;
            this.sTIR = undefined;
            this.mTIR = undefined;

            this.movable.mi = NaN;
            this.movable.mo = NaN;
            this.inboard.si = NaN;
            this.inboard.mi = NaN;
        }
        else
        {
            this.dimA = dimA1;
            this.dimB = dimB1;
            this.dimC = dimC1;
            this.dimD = dimD1;
            this.dimE = dimE1;
            this.sTIR = sTIR1;
            this.mTIR = mTIR1;
            this.dimF = this.dimE + this.dimC;
        }

        //Do the calculations.
        if(this.isValid)
        {          
            //Movable calcs, movable inboard.
            let m1 = (this.mTIR - this.sTIR) / this.dimA;
            this.m1 = m1;
            let b1 = this.mTIR;
            let x1 = this.dimB - this.dimA;
            this.movable.mi = -(m1 * x1 + b1);
            
            //Movable calcs, movable outboard.
            x1 = dimC - dimA;
            this.movable.mo = -(m1 * x1 + b1);

            //Inboard calcs, stationary inboard.
            let m2 = -this.movable.mo / this.dimF;
            this.m2 = m2;
            let x2 = this.dimE - this.dimD;
            this.inboard.si = m2 * x2;

            //Inboard calcs, movable inboard.
            x2 = this.dimE + this.dimB;
            let b2 = this.movable.mi;
            this.inboard.mi = m2 * x2 + b2;
        }

        this.bodyDraw();
        
        let movable =
        {
            mi: this.movable.mi,
            mo: this.movable.mo
        }

        let inboard =
        {
            si: this.inboard.si,
            mi: this.inboard.mi
        }
        
        return {movable, inboard};
    }

    //This is where the plot is actually drawn.
    plotDraw()
    {
        //Exit if there is not a valid dataset to plot.
        if(!this.isValid) return;

        /************************************ Inches and Mils ************************************/

        let maxX            = this.dimF;           //Max X distance to fit onto graph.
        let inchesPerBlock  = Math.ceil(maxX / 9); //Calculate inches per block (10 squares).

        //try to stretch the graph as far as possible but don't let it go off screen.
        let inchesPerBlock1 = Math.round(inchesPerBlock / 2.5) * 2.5;
        let inchesPerBlock2 = Math.ceil(inchesPerBlock / 2.5) * 2.5;
        if(inchesPerBlock1 * 9.5 >= this.dimF)
        {
            inchesPerBlock = inchesPerBlock1;
        }
        else
        {
            inchesPerBlock = inchesPerBlock2;
        }

        if(this.dimF <= 9)inchesPerBlock = 1;

        this.inchesPerBlock = inchesPerBlock;      //Save a class copy of the variable.
        let inchesPerSquare = inchesPerBlock / 10; //Calculate inches per square.
        
        //Figure out the min/max value of y at stationary dial.
        let y1, y2;
        if((this.mTIR >= 0 && this.sTIR >= 0 && this.sTIR <= this.mTIR) || (this.mTIR < 0 && this.sTIR < 0 && this.sTIR >= this.mTIR))
        {
            y1 = 0;
        }
        else
        {
            y1 = this.sTIR;
        }

        y2 = -this.movable.mo;

        let maxY          = y2 - y1;                         //Max Y distance to fit into graph;
        let milsPerBlock  = Math.abs(Math.ceil(maxY / 6));   //Calculate mils per block (10 squares).
        milsPerBlock      = Math.ceil(milsPerBlock / 5) * 5; //Mils per block are divisions of 5.
        if(milsPerBlock === 0)milsPerBlock = 1;
        this.milsPerBlock = milsPerBlock;                    //Save a class copy of the variable.
        let milsPerSquare = milsPerBlock / 10;               //Calculate mils per square.

        //The calibration line should always be on a block boundary. Calculate that block number.
        //This value starts at 0 (top block) and goes to 8 (bottom block). Should be 1 to 7.
        let yCalBlock = 0;
        if(y1 === 0 && this.m1 >= 0)
        {
                yCalBlock = 7;
        }
        else if(y1 === 0 && this.m1 < 0)
        {
                yCalBlock = 1;
        }
        else
        {
            //Somewhere in between. figure out how many blocks above/below cal line y1 is.
            yCalBlock = y1 / milsPerBlock;

            if(yCalBlock >= 0)
            {
                yCalBlock = Math.ceil(yCalBlock);
            }
            else
            {
                yCalBlock = Math.floor(yCalBlock);
            }

            if(yCalBlock < 0)
            {
                yCalBlock = 7 + yCalBlock;
            }
            else
            {
                yCalBlock = 1 + yCalBlock;
            }
        }
        
        /**************************************** Pixels *****************************************/

        let pixelsPerBlock   = this.bodyWidth / 11;               //Pixels per block(10 squares).
        let pixelsPerSquare  = this.bodyWidth / 110;              //Pixels per square.
        this.pixelsPerSquare = pixelsPerSquare;                   //Save a class copy of the variable.
        let inchesPerPixel   = inchesPerSquare / pixelsPerSquare; //Inches per pixel(x axis).
        let pixelsPerInch    = 1 / inchesPerPixel;                //Pixels per inch.
        let milsPerPixel     = milsPerSquare / pixelsPerSquare;   //Mils per pixel(y axis).
        let pixelsPerMil     = 1 / milsPerPixel;                  //Pixels per mil.

        let yOrigin = pixelsPerBlock * yCalBlock; //Y pixel location of cal line(also the Y origin).
        let xOrigin = (this.dimE + this.dimA) * pixelsPerInch + pixelsPerBlock; //X pixel origin.

        let siX = pixelsPerBlock + (this.dimE - this.dimD) * pixelsPerInch; //Stationary object, inboard feet.
        let soX = pixelsPerBlock; //Stationary object, outboard feet.

        let miX = pixelsPerBlock + (this.dimE + this.dimB) * pixelsPerInch; //Movable object, inboard feet.
        let moX = pixelsPerBlock + (this.dimE + this.dimC) * pixelsPerInch; //Movable object, outboard feet.
        
        let sDialX = pixelsPerBlock + this.dimE * pixelsPerInch; //Stationary dial.
        let mDialX = pixelsPerBlock + (this.dimE + this.dimA) * pixelsPerInch; //Movable dial.

        //Green MAL line points.
        let greenMalX1 = sDialX;
        let greenMalX2 = moX;
        let greenMalY1 = yOrigin - this.sTIR * pixelsPerMil;
        let greenMalY2 = yOrigin + this.movable.mo * pixelsPerMil;

        //Red MAL line plot points.
        let redMalX1 = pixelsPerBlock;
        let redMalX2 = moX;
        let redMalY1 = yOrigin;
        let redMalY2 = yOrigin + this.movable.mo * pixelsPerMil;

        //Movements from green MAL.
        let greenMoveX1 = miX;
        let greenMoveY1 = yOrigin + this.movable.mi * pixelsPerMil;
        let greenMoveX2 = miX;
        let greenMoveY2 = yOrigin;
        let greenMoveX3 = moX;
        let greenMoveY3 = yOrigin + this.movable.mo * pixelsPerMil;
        let greenMoveX4 = moX;
        let greenMoveY4 = yOrigin;

        //Movement to red MAL line.
        let redMoveX1 = siX;
        let redMoveY1 = yOrigin;
        let redMoveX2 = siX;
        let redMoveY2 = yOrigin - this.inboard.si * pixelsPerMil;
        let redMoveX3 = miX;
        let redMoveY3 = greenMoveY1;
        let redMoveX4 = miX;
        let redMoveY4 = greenMoveY1 - this.inboard.mi * pixelsPerMil;

        /************************************* Plot Routines *************************************/

        //Draw the X and Y axis arrows.
        this.drawVertScaling(0, 6);
        this.drawHorzScaling(0, 6.7);
        
        //Draw the stationary object, inboard and outboard feet lines.
        this.drawSolidLine(soX, this.bodyHeight * .035, soX, this.bodyHeight - this.bodyHeight * .035, this.bodyWidth * .004, "#00000060");
        this.drawSolidLine(siX, this.bodyHeight * .035, siX, this.bodyHeight - this.bodyHeight * .035, this.bodyWidth * .004, "#00000060");

        //Draw the movable object, inboard and outboard feet lines.
        this.drawSolidLine(moX, this.bodyHeight * .035, moX, this.bodyHeight - this.bodyHeight * .035, this.bodyWidth * .004, "#00000060");
        this.drawSolidLine(miX, this.bodyHeight * .035, miX, this.bodyHeight - this.bodyHeight * .035, this.bodyWidth * .004, "#00000060");

        //Draw the stationary and movable dial lines.
        this.drawSolidLine(sDialX, this.bodyHeight * .05, sDialX, this.bodyHeight, this.bodyWidth * .004, "#ff000070");
        this.drawSolidLine(mDialX, this.bodyHeight * .05, mDialX, this.bodyHeight, this.bodyWidth * .004, "#0000ff70");

        //Draw the feet symbols.
        this.drawFoot(soX, this.bodyHeight * .02, "#00000070");
        this.drawFoot(siX, this.bodyHeight * .02, "#00000070");
        this.drawFoot(miX, this.bodyHeight * .02, "#00000070");
        this.drawFoot(moX, this.bodyHeight * .02, "#00000070");
        this.drawFoot(soX, this.bodyHeight - this.bodyHeight * .02, "#00000070");
        this.drawFoot(siX, this.bodyHeight - this.bodyHeight * .02, "#00000070");
        this.drawFoot(miX, this.bodyHeight - this.bodyHeight * .02, "#00000070");
        this.drawFoot(moX, this.bodyHeight - this.bodyHeight * .02, "#00000070");

        //Draw the stationary and movable dial symbols.
        this.drawSDial(sDialX, this.bodyHeight * .025, "#ff000070");
        this.drawMDial(mDialX, this.bodyHeight * .025, "#0000ff70");

        //Draw the green and red MAL lines.
        this.drawSolidLine(greenMalX1, greenMalY1, greenMalX2, greenMalY2, this.bodyWidth * .004, "#00a00070");
        this.drawDashedLine(redMalX1, redMalY1, redMalX2, redMalY2, this.bodyWidth * .004, "#ff000070");

        //Draw MAL text.
        this.drawMAL(moX, greenMalY2, "#00a00070");

        //Draw the solid and dashed portions of the cal line.
        this.drawSolidLine(pixelsPerBlock, yOrigin, xOrigin, yOrigin, this.bodyWidth * .004, "#0000ff40");
        this.drawDashedLine(xOrigin, yOrigin, moX, yOrigin, this.bodyWidth * .004, "#0000ff40");

        //Draw the movable cal symbol.
        this.drawMSym(moX, yOrigin, "#0000ff70");
        this.drawSSym(soX, yOrigin, "#0000ff70");
     
        //Draw the movement destination points.
        this.drawPoint(greenMoveX2, greenMoveY2, "#007000");
        this.drawPoint(greenMoveX4, greenMoveY4, "#007000");
        this.drawPoint(redMoveX2, redMoveY2, "#700000");
        this.drawPoint(redMoveX4, redMoveY4, "#700000");

        //Draw the movement arcs.
        this.drawDashedArc(greenMoveX1, greenMoveY1, greenMoveX2, greenMoveY2, "#007000", this.movable.mi, ShaftPlot.RIGHT);
        this.drawDashedArc(greenMoveX3, greenMoveY3, greenMoveX4, greenMoveY4, "#007000", this.movable.mo, ShaftPlot.LEFT);
        this.drawDashedArc(redMoveX1, redMoveY1, redMoveX2, redMoveY2, "#700000", this.inboard.si, ShaftPlot.RIGHT);
        this.drawDashedArc(redMoveX3, redMoveY3, redMoveX4, redMoveY4, "#700000", this.inboard.mi, ShaftPlot.LEFT);
    }

    drawDashedArc(x1, y1, x2, y2, color, value, side)
    {
        let text = (value >= 0) ? "+" + value.toFixed(2) : "" + value.toFixed(2);
        this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);
        this.ctxPlot.strokeStyle  = color;
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "middle";
        
        let textWidth = this.ctxPlot.measureText(text).width;
        let cX, cY;

        cX = x1 + this.bodyWidth * .025 * side;

        if(y1 < y2)
        {
            cY = y1 + .5 * (y2 - y1);
        }
        else
        {
            cY = y2 + .5 * (y1 - y2);
        }
        
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x1, y1);
        this.ctxPlot.bezierCurveTo(cX, cY, cX, cY, x2, y2);
        this.ctxPlot.stroke();
        this.ctxPlot.setLineDash([]);

        //Draw the text.
        let xOffset = 0;
        if(side === ShaftPlot.LEFT) xOffset = textWidth;
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(text, cX - xOffset, cY);
        this.ctxPlot.stroke();
    }

    drawPoint(x, y, color)
    {
        this.ctxPlot.beginPath();
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.moveTo(x, y);
        this.ctxPlot.arc(x, y, this.bodyWidth * .005, 0, 2 * Math.PI);
        this.ctxPlot.fill();
    }

    drawMAL(x, y, color)
    {
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "middle";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("MAL", x + this.bodyWidth * .007, y);
        this.ctxPlot.stroke();
    }

    drawMSym(x, y, color)
    {
        let x1 = x + this.bodyWidth * .02;
        let x2 = x + this.bodyWidth * .007;
        let y1 = y - this.bodyHeight * .02;
        let width = this.bodyHeight * .025;
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.lineWidth = this.bodyWidth * .002;

        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x1, y1, width * .65, 0, 2 * Math.PI);        
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x1, y1 - width * .4);
        this.ctxPlot.lineTo(x1, y1 + width * .4);
        this.ctxPlot.moveTo(x1 - width * .4, y1);
        this.ctxPlot.lineTo(x1 + width * .4, y1);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();

        //Draw the text.
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("CAL", x2, y);
        this.ctxPlot.stroke();
    }

    drawSSym(x, y, color)
    {
        let x1 = x - this.bodyWidth * .02;
        let x2 = x - this.bodyWidth * .037;
        let y1 = y - this.bodyHeight * .02;
        let width = this.bodyHeight * .025;
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.lineWidth = this.bodyWidth * .002;

        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x1, y1, width * .65, 0, 2 * Math.PI);        
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x1, y1, width * .40, 0, 2 * Math.PI);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x1, y1, width * .25, 0, 2 * Math.PI);
        this.ctxPlot.fill();

        //Draw the text.
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("CAL", x2, y);
        this.ctxPlot.stroke();
    }

    drawMDial(x, y, color)
    {
        let width = this.bodyHeight * .025;
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.lineWidth = this.bodyWidth * .002;

        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x, y, width * .65, 0, 2 * Math.PI);        
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x, y - width * .4);
        this.ctxPlot.lineTo(x, y + width * .4);
        this.ctxPlot.moveTo(x - width * .4, y);
        this.ctxPlot.lineTo(x + width * .4, y);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x - width * .8, y + width * .8);
        this.ctxPlot.lineTo(x - width / 2, y + width / 2);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x + width * .8, y - width * .8);
        this.ctxPlot.lineTo(x + width * .8, y - width  * .3);
        this.ctxPlot.lineTo(x + width * .3, y - width  * .8);
        this.ctxPlot.fill();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x + width * .55, y - width * .55);
        this.ctxPlot.lineTo(x + width / 2, y - width / 2);
        this.ctxPlot.stroke();
    }

    drawSDial(x, y, color)
    {
        let width = this.bodyHeight * .025;
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.lineWidth = this.bodyWidth * .002;

        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x, y, width * .65, 0, 2 * Math.PI);        
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x, y, width * .40, 0, 2 * Math.PI);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x, y, width * .25, 0, 2 * Math.PI);
        this.ctxPlot.fill();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x - width * .8, y + width * .8);
        this.ctxPlot.lineTo(x - width / 2, y + width / 2);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x + width * .8, y - width * .8);
        this.ctxPlot.lineTo(x + width * .8, y - width  * .3);
        this.ctxPlot.lineTo(x + width * .3, y - width  * .8);
        this.ctxPlot.fill();
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(x + width * .55, y - width * .55);
        this.ctxPlot.lineTo(x + width / 2, y - width / 2);
        this.ctxPlot.stroke();
    }

    drawFoot(x, y, color)
    {
        let width = this.bodyWidth * .02;

        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.lineWidth = this.bodyWidth * .002;
        this.ctxPlot.strokeRect(x - width / 2, y - width / 2, width, width);

        this.ctxPlot.beginPath();
        this.ctxPlot.arc(x, y, width * .3, 0, 2 * Math.PI);
        this.ctxPlot.stroke();
    }

    drawHorzScaling(blockX, blockY)
    {
        let pixelsPerSquare = this.pixelsPerSquare;
        let xStart = (blockX * 10 + 0.2) * pixelsPerSquare;
        let yStart = (blockY * 10 + 8) * pixelsPerSquare;
        this.ctxPlot.strokeStyle = "black";
        this.ctxPlot.lineWidth = this.bodyWidth * .004;

        //Draw the arrow.
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo((blockX * 10 + 1) * pixelsPerSquare, (blockY * 10 + 7) * pixelsPerSquare);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo((blockX * 10 + 1) * pixelsPerSquare, (blockY * 10 + 9) * pixelsPerSquare);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo((blockX * 10 + 9.7) * pixelsPerSquare, (blockY * 10 + 8) * pixelsPerSquare);
        this.ctxPlot.lineTo((blockX * 10 + 9) * pixelsPerSquare, (blockY * 10 + 7) * pixelsPerSquare);
        this.ctxPlot.lineTo((blockX * 10 + 9.7) * pixelsPerSquare, (blockY * 10 + 8) * pixelsPerSquare);
        this.ctxPlot.lineTo((blockX * 10 + 9) * pixelsPerSquare, (blockY * 10 + 9) * pixelsPerSquare);
        this.ctxPlot.stroke();

        //Draw the text.
        this.ctxPlot.fillStyle = "black";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(this.inchesPerBlock + " inches", (blockX * 10 + 1.5) * pixelsPerSquare, (blockY * 10 + 5.5) * pixelsPerSquare);
        this.ctxPlot.stroke();
    }

    drawVertScaling(blockX, blockY)
    {
        let pixelsPerSquare = this.pixelsPerSquare;
        let xStart = (blockX * 10 + 2) * pixelsPerSquare;
        let yStart = (blockY * 10 + .2) * pixelsPerSquare;
        this.ctxPlot.strokeStyle = "black";
        this.ctxPlot.lineWidth = this.bodyWidth * .004;

        //Draw the arrow.
        this.ctxPlot.beginPath();
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo((blockX * 10 + 1) * pixelsPerSquare, (blockY * 10 + 1) * pixelsPerSquare);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo((blockX * 10 + 3) * pixelsPerSquare, (blockY * 10 + 1) * pixelsPerSquare);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo((blockX * 10 + 2) * pixelsPerSquare, (blockY * 10 + 9.7) * pixelsPerSquare);
        this.ctxPlot.lineTo((blockX * 10 + 1) * pixelsPerSquare, (blockY * 10 + 9) * pixelsPerSquare);
        this.ctxPlot.lineTo((blockX * 10 + 2) * pixelsPerSquare, (blockY * 10 + 9.7) * pixelsPerSquare);
        this.ctxPlot.lineTo((blockX * 10 + 3) * pixelsPerSquare, (blockY * 10 + 9) * pixelsPerSquare);
        this.ctxPlot.stroke();

        //Draw the text.
        this.ctxPlot.fillStyle = "black";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(this.milsPerBlock + " mils", (blockX * 10 + 3) * pixelsPerSquare, (blockY * 10 + 4.5) * pixelsPerSquare);
        this.ctxPlot.stroke();
    }

    drawSolidLine(startX, startY, endX, endY, width, color)
    {
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.lineWidth = width;
        this.ctxPlot.moveTo(startX, startY);
        this.ctxPlot.lineTo(endX, endY);
        this.ctxPlot.stroke();
    }

    drawDashedLine(startX, startY, endX, endY, width, color)
    {
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.setLineDash([this.bodyWidth * .01, this.bodyWidth * .01]);
        this.ctxPlot.lineWidth = width;
        this.ctxPlot.moveTo(startX, startY);
        this.ctxPlot.lineTo(endX, endY);
        this.ctxPlot.stroke();
        this.ctxPlot.setLineDash([]);
    }
}