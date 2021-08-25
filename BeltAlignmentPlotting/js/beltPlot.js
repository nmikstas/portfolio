"use strict";

class BeltPlot
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get HEIGHT_MULT() {return .72727272}
    static get MIN_BUBBLE()  {return -8.0}
    static get MAX_BUBBLE()  {return 8.0}
    static get MIN_FEET()    {return .1}
    static get MAX_FEET()    {return 100}
    static get STARRETT()    {return 12}
    static get LEFT()        {return -1}
    static get RIGHT()       {return 1}
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        parentDiv,
        {
            backgroundImg = null
        } = {}
    )
    {
        this.parentDiv = parentDiv;

        //Height and width of the canvas.
        this.bodyWidth  = 100;
        this.bodyHeight = 100;

        //Background image of the plot.
        this.backgroundImg = backgroundImg;

        //Graphing variables.
        this.pixelsPerSquare;
        this.milsPerBlock;
        this.milsPerSquare;
        this.inchesPerBlock;
        this.inchesPerSquare;
        this.milsPerPixel;
        this.inchesPerPixel;
        this.pixelsPerInch;
        this.pixelsPerMil;
        this.pixelLevel;
        this.lineWidth;
        this.starretX;
        this.rearFeetRef;

        //Boolean to tell wether a complete set of valid data is present or not.
        this.isValid = false;

        //Variables for line plotting.
        this.driverBubble = undefined;
        this.driverBubble = undefined;
        this.driverFeet   = undefined;
        this.drivenFeet   = undefined;

        //Numerical variables for move distances.
        this.driverToLevel  = undefined;
        this.drivenToLevel  = undefined;
        this.driverToDriven = undefined;
        this.drivenToDriver = undefined;

        //Text variables for move distances.
        this.dvrToLvl = undefined;
        this.dvnToLvl = undefined;
        this.dvrToDvn = undefined;
        this.dvnToDvr = undefined;
        
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
       this.bodyCanvas.height = this.bodyCanvas.width * BeltPlot.HEIGHT_MULT;

       //Save a copy of the height and width of the canvas for future calculations.
       this.bodyWidth  = this.bodyCanvas.width;
       this.bodyHeight = this.bodyCanvas.height;

       this.bodyDraw();
    }

    doCalcs(driverDist, drivenDist, driverBubble, drivenBubble)
    {
        this.isValid = true;

        let driverDist1   = parseFloat(driverDist);
        let drivenDist1   = parseFloat(drivenDist);
        let driverBubble1 = parseFloat(driverBubble);
        let drivenBubble1 = parseFloat(drivenBubble);
        
        //Make sure all entries are valid.
        if(isNaN(driverDist1) || isNaN(drivenDist1) || isNaN(driverBubble1) || isNaN(drivenBubble1))
        {
            this.isValid = false;
        }

        //Make sure all entries are within the min and max ranges.
        if(this.isValid && (
            driverDist1   < BeltPlot.MIN_FEET   || driverDist1   > BeltPlot.MAX_FEET   ||
            drivenDist1   < BeltPlot.MIN_FEET   || drivenDist1   > BeltPlot.MAX_FEET   ||
            driverBubble1 < BeltPlot.MIN_BUBBLE || driverBubble1 > BeltPlot.MAX_BUBBLE || 
            drivenBubble1 < BeltPlot.MIN_BUBBLE || drivenBubble1 > BeltPlot.MAX_BUBBLE))
         {
             this.isValid = false;
         }

        //Save the values if they are valid.
        if(!this.isValid)
        {
            this.driverFeet   = undefined;
            this.drivenFeet   = undefined;
            this.driverBubble = undefined;
            this.drivenBubble = undefined;

            this.driverToLevel  = undefined;
            this.drivenToLevel  = undefined;
            this.driverToDriven = undefined;
            this.drivenToDriver = undefined;

            this.dvrToLvl = undefined;
            this.dvnToLvl = undefined;
            this.dvrToDvn = undefined;
            this.dvnToDvr = undefined;
        }
        else
        {
            this.driverFeet   = driverDist1;
            this.drivenFeet   = drivenDist1;
            this.driverBubble = driverBubble1;
            this.drivenBubble = drivenBubble1;
        }

        //Do the calculations.
        if(this.isValid)
        {
            this.driverToLevel  = this.driverFeet * this.driverBubble * 5 / 12;
            this.drivenToLevel  = this.drivenFeet * this.drivenBubble * 5 / 12;
            this.driverToDriven = this.driverFeet * (this.driverBubble - this.drivenBubble) * 5 / 12;
            this.drivenToDriver = this.drivenFeet * (this.drivenBubble - this.driverBubble) * 5 / 12;

            this.dvrToLvl = ((Math.sign(this.driverToLevel) >= 0) ? "+" : "") + this.driverToLevel.toFixed(2);
            this.dvnToLvl = ((Math.sign(this.drivenToLevel) >= 0) ? "+" : "") + this.drivenToLevel.toFixed(2);

            //Determine if there are 1 or 2 optimal moves.
            let numOptimalMoves = 0;
            let dvrToLvl1 = Math.sign(this.driverToLevel);
            let dvnToLvl1 = Math.sign(this.drivenToLevel);

            //Include zero as a positive number.
            if(dvrToLvl1 === 0) dvrToLvl1 = 1;
            if(dvnToLvl1 === 0) dvnToLvl1 = 1;
            numOptimalMoves = (dvrToLvl1 === dvnToLvl1) ? 1 : 2;

            //Find the absolute slope value of the driver and driven.
            let driverSlope = Math.abs(this.driverBubble);
            let drivenSlope = Math.abs(this.drivenBubble);

            //Calculate if a plus symbol is needed in the movement.
            let dvrToDvnSign = (Math.sign(this.driverToDriven) >= 0) ? "+" : "";
            let dvnToDvrSign = (Math.sign(this.drivenToDriver) >= 0) ? "+" : "";
     
            this.dvrToDvn = undefined;
            this.dvnToDvr = undefined;

            //Calculate the optimal moves.
            if(numOptimalMoves === 2)
            {
                this.dvrToDvn = dvrToDvnSign + this.driverToDriven.toFixed(2);
                this.dvnToDvr = dvnToDvrSign + this.drivenToDriver.toFixed(2);
            }
            else
            {
                //Determine which is the optimal move.
                if(drivenSlope >= driverSlope)
                {
                    this.dvnToDvr = dvnToDvrSign + this.drivenToDriver.toFixed(2);
                }
                else
                {
                    this.dvrToDvn = dvrToDvnSign + this.driverToDriven.toFixed(2);
                }
            }
        }

        this.bodyDraw();

        let level =
        {
            dvrToLvl: this.dvrToLvl,
            dvnToLvl: this.dvnToLvl
        }

        let optimal =
        {
            dvrToDvn: this.dvrToDvn,
            dvnToDvr: this.dvnToDvr
        }

        return {level, optimal};
    }

    bodyDraw()
    {
        //Clear any existing drawings.
        this.ctxPlot.clearRect(0, 0, this.bodyWidth, this.bodyHeight);

        //Ensure the backgroung is not transparent.
        if(this.backgroundImg)
        {
            //Add background image, if applicable.
            this.ctxPlot.drawImage(this.backgroundImg, 0, 0, this.bodyWidth, this.bodyHeight);
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

    plotDraw()
    {
        //Don't draw the graph if the data is invalid.
        if(this.drivenBubble === undefined || this.driverBubble === undefined || 
           this.drivenFeet   === undefined || this.driverFeet   === undefined) return;

        //Calculate the height/width of the grid squares in pixels.
        this.pixelsPerSquare = this.bodyWidth / 110;

        //Calculate the x scaling of the graph.
        let maxX = Math.max(BeltPlot.STARRETT, this.driverFeet, this.drivenFeet);
        
        this.inchesPerBlock  = Math.ceil(maxX / 9); //Calculate inches per block (10 squares).
        this.inchesPerSquare = this.inchesPerBlock / 10; //Calculate inches per square.
        this.inchesPerPixel  = this.inchesPerSquare / this.pixelsPerSquare; //Calculate inches per pixel.
        this.pixelsPerInch   = 1 / this.inchesPerPixel; //Calculate pixels per inch.
        this.rearFeetRef     = this.pixelsPerSquare * 10; //Calculate the rear feet reference offset.

        //Calculate the slope of the driver and driven misadjustment lines.
        let driverMALSlope = -this.driverBubble * 5 / BeltPlot.STARRETT;
        let drivenMALSlope = -this.drivenBubble * 5 / BeltPlot.STARRETT;

        //Calculate the critical y points on the graph referenced to the level line.
        let drivenMALToStarrett = drivenMALSlope * BeltPlot.STARRETT;
        let drivenMALToDrivenFF = drivenMALSlope * this.drivenFeet;
        let drivenMALToDriverFF = drivenMALSlope * this.driverFeet;
        let drivenMALToEnd      = drivenMALSlope * this.inchesPerBlock * 10;
        let drivenMAL9          = drivenMALSlope * this.inchesPerBlock * 9;
        let driverMALToStarrett = driverMALSlope * BeltPlot.STARRETT;
        let driverMALToDrivenFF = driverMALSlope * this.drivenFeet;
        let driverMALToDriverFF = driverMALSlope * this.driverFeet;
        let driverMALToEnd      = driverMALSlope * this.inchesPerBlock * 10;
        let driverMAL9          = driverMALSlope * this.inchesPerBlock * 9;

        //Find the maximum and minimum of the critical points.
        let maxCritPoint = Math.max(drivenMALToStarrett, drivenMALToDrivenFF, drivenMALToDriverFF, driverMALToStarrett, driverMALToDrivenFF, driverMALToDriverFF);
        let minCritPoint = Math.min(drivenMALToStarrett, drivenMALToDrivenFF, drivenMALToDriverFF, driverMALToStarrett, driverMALToDrivenFF, driverMALToDriverFF);

        this.lineWidth = this.bodyWidth * .004; //Set the width of the lines.

        //Determine if both are positive or negative or if they are different signs.
        if(maxCritPoint >= 0 && minCritPoint >= 0)
        {
            this.levelPixel   = this.bodyHeight - this.pixelsPerSquare * 10;
            this.milsPerBlock = Math.ceil(maxCritPoint / 6 / 5) * 5;
        }
        else if(maxCritPoint < 0 && minCritPoint < 0)
        {
            this.levelPixel   = this.pixelsPerSquare * 10;
            this.milsPerBlock = Math.abs(Math.floor(minCritPoint / 6 / 5) * 5);
        }
        else
        {
            this.levelPixel   = this.bodyHeight / 2;
            this.milsPerBlock = maxCritPoint >= Math.abs(minCritPoint) ? Math.ceil(maxCritPoint / 3 / 5) * 5 : Math.abs(Math.floor(minCritPoint / 3 / 5) * 5);
        }

        this.milsPerSquare = this.milsPerBlock / 10;
        this.milsPerPixel  = this.milsPerSquare / this.pixelsPerSquare;
        this.pixelsPerMil  = 1 / this.milsPerPixel;

        let drivenMALToDrivenFFX = this.pixelsPerInch * this.drivenFeet + this.rearFeetRef;
        let drivenMALToDrivenFFY = this.levelPixel - drivenMALToDrivenFF * this.pixelsPerMil;
        let drivenMALToDriverFFX = this.pixelsPerInch * this.driverFeet + this.rearFeetRef;
        let drivenMALToDriverFFY = this.levelPixel - drivenMALToDriverFF * this.pixelsPerMil;
        let drivenToLevelX       = this.pixelsPerInch * this.drivenFeet + this.rearFeetRef;;
        let drivenToLevelY       = this.levelPixel;

        let driverMALToDrivenFFX = this.pixelsPerInch * this.drivenFeet + this.rearFeetRef;
        let driverMALToDrivenFFY = this.levelPixel - driverMALToDrivenFF * this.pixelsPerMil;
        let driverMALToDriverFFX = this.pixelsPerInch * this.driverFeet + this.rearFeetRef;
        let driverMALToDriverFFY = this.levelPixel - driverMALToDriverFF * this.pixelsPerMil;
        let driverToLevelX       = this.pixelsPerInch * this.driverFeet + this.rearFeetRef;
        let driverToLevelY       = this.levelPixel;
        
        //Used for plotting MAL lines and text.
        let drivenMALToEndY = this.levelPixel - drivenMALToEnd * this.pixelsPerMil;
        let drivenMALY      = this.levelPixel - drivenMAL9 * this.pixelsPerMil;
        let driverMALToEndY = this.levelPixel - driverMALToEnd * this.pixelsPerMil;
        let driverMALY      = this.levelPixel - driverMAL9 * this.pixelsPerMil;

        //Make sure text for the driver and driven MAL stay on the graph.
        if(drivenMALY > this.levelPixel)
        {
            drivenMALY -= 2 * this.pixelsPerSquare;
        }

        if(drivenMALY < 0)
        {
            drivenMALY = 0;
        }
        else if(drivenMALY > (this.bodyHeight * .98))
        {
            drivenMALY = this.bodyHeight * .98;   
        }

        if(driverMALY > this.levelPixel)
        {
            driverMALY -= 2 * this.pixelsPerSquare;
        }

        if(driverMALY < 0)
        {
            driverMALY = 0;
        }
        else if(driverMALY > (this.bodyHeight * .98))
        {
            driverMALY = this.bodyHeight * .98;   
        }

        //Draw the Y-axis arrow.
        this.drawVertScaling(0, 5);

        //Draw the X-axis arrow.
        this.drawHorzScaling(0, 6);
        
        //Draw level line.
        this.drawDashedLine(0, this.levelPixel, this.bodyWidth, this.levelPixel, this.lineWidth, "#0000ff40");

        //Draw the Starrett 98 reference line.
        this.starretX = this.pixelsPerInch * BeltPlot.STARRETT + this.rearFeetRef;
        this.drawSolidLine(this.starretX, 0, this.starretX, this.bodyHeight, this.lineWidth, "#ff000070");
       
        //Draw the rear feet reference line.
        this.drawSolidLine(this.rearFeetRef, 0, this.rearFeetRef, this.bodyHeight, this.lineWidth, "#ff000070");
       
        //Draw the driven front feet reference line.
        let rearFeetX = this.pixelsPerInch * this.drivenFeet + this.rearFeetRef;
        this.drawSolidLine(rearFeetX, 0, rearFeetX, this.bodyHeight, this.lineWidth, "#0000ff70");
        
        //Draw the driver front feet reference line.
        let frontFeetX = this.pixelsPerInch * this.driverFeet + this.rearFeetRef;
        this.drawSolidLine(frontFeetX, 0, frontFeetX, this.bodyHeight, this.lineWidth, "#00a00070");
        
        //Driven MAL line.
        this.drawSolidLine(this.rearFeetRef, this.levelPixel, this.bodyWidth, drivenMALToEndY, this.lineWidth, "#0000ff70");
       
        //Driver MAL line.
        this.drawSolidLine(this.rearFeetRef, this.levelPixel, this.bodyWidth, driverMALToEndY, this.lineWidth, "#00a00070");
       
        //Draw the rear feet reference text.
        let textSize  = this.bodyWidth * .015;
        let textArray = [{text:"Ref Driver", x:this.bodyWidth * .005, y:this.bodyHeight * .005}, 
                         {text:"and Driven", x:this.bodyWidth * .005, y:this.bodyHeight * .025},
                         {text:"Rear Feet",  x:this.bodyWidth * .005, y:this.bodyHeight * .045}];
        this.DrawText(textArray, textSize, "#ff000070", "top");

        //DrivenM MAL text.
        textArray = [{text:"Driven MAL", x:this.bodyWidth * .915, y:drivenMALY}];
        this.DrawText(textArray, textSize, "#0000ff70", "top");

        //Driver MAL text.
        textArray = [{text:"Driver MAL", x:this.bodyWidth * .915, y:driverMALY}];
        this.DrawText(textArray, textSize, "#00700070", "top");
        
        //Draw level text.
        textArray = [{text:"Level", x:this.bodyWidth * .005, y:this.levelPixel + this.bodyHeight * .005}];
        this.DrawText(textArray, textSize, "#0000ff70", "top");
        
        //Draw the Starrett 98 reference text.
        let textX = this.starretX - this.bodyWidth * .08;
        textArray = [{text:"Starrett 98", x:textX, y:this.bodyHeight * .005}, {text:"12\" Ref", x:textX, y:this.bodyHeight * .025}];
        this.DrawText(textArray, textSize, "#ff000070", "top");
        
        //Draw the driver front feet reference text.
        textX = this.pixelsPerInch * this.driverFeet + this.rearFeetRef - this.bodyWidth * .08;
        textArray = [{text:"Driver", x:textX, y:this.bodyHeight * .085}, {text:"Front Feet", x:textX, y:this.bodyHeight * .105}];
        this.DrawText(textArray, textSize, "#00700070", "top");

        //Draw the driven front feet reference text.
        textX = this.pixelsPerInch * this.drivenFeet + this.rearFeetRef - this.bodyWidth * .08;
        textArray = [{text:"Driven", x:textX, y:this.bodyHeight * .045}, {text:"Front Feet", x:textX, y:this.bodyHeight * .065}];
        this.DrawText(textArray, textSize, "#0000ff70", "top");
        
        //Draw the Starrett graduations.
        this.drawGraduations();

        //Driver to level spline and ending point.
        this.drawDashedArc(driverToLevelX, driverToLevelY, driverMALToDriverFFX, driverMALToDriverFFY, "#007000", this.dvrToLvl, BeltPlot.RIGHT);
        this.drawPoint(driverToLevelX, this.levelPixel, "#007000");
        
        //Driven to level spline and ending point.
        this.drawDashedArc(drivenToLevelX, drivenToLevelY, drivenMALToDrivenFFX, drivenMALToDrivenFFY, "#0000b0", this.dvnToLvl, BeltPlot.RIGHT);
        this.drawPoint(drivenToLevelX, this.levelPixel, "#0000b0");
        
        //Driven to driver spline and ending point.
        if(this.dvnToDvr !== undefined)
        {          
            this.drawDashedArc(drivenMALToDrivenFFX, drivenMALToDrivenFFY, driverMALToDrivenFFX, driverMALToDrivenFFY, "#700000", this.dvnToDvr, BeltPlot.LEFT);
            this.drawPoint(driverMALToDrivenFFX, driverMALToDrivenFFY, "#700000");
        }

        //Driver to driven spline and ending point.
        if(this.dvrToDvn !== undefined)
        {
            this.drawDashedArc(driverMALToDriverFFX, driverMALToDriverFFY, drivenMALToDriverFFX, drivenMALToDriverFFY, "#700000", this.dvrToDvn, BeltPlot.LEFT);
            this.drawPoint(drivenMALToDriverFFX, drivenMALToDriverFFY, "#700000");
        }
    }

    //Draw the bezier splines.
    drawDashedArc(x1, y1, x2, y2, color, value, side)
    {
        let text = value;
        this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);
        this.ctxPlot.lineWidth    = this.bodyWidth * .0025;
        this.ctxPlot.strokeStyle  = color;
        this.ctxPlot.fillStyle    = color;
        this.ctxPlot.font         = "bold " + (this.bodyWidth * .015) + "px Arial";
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
        if(side === BeltPlot.LEFT) xOffset = textWidth;
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(text, cX - xOffset, cY);
        this.ctxPlot.stroke();
    }

    //Draw the graduations on the Starrett line.
    drawGraduations()
    {
        let yPixelPer5Mil = this.pixelsPerMil * 5;
        
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle  = "#00000040";
        this.ctxPlot.fillStyle    = "#00000040";
        this.ctxPlot.lineWidth    = this.lineWidth;
        this.ctxPlot.font         = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "middle";

        for(let i = 0; i < 9; i++)
        {
            this.ctxPlot.moveTo(this.starretX - this.bodyWidth *.005, this.levelPixel - i * yPixelPer5Mil);
            this.ctxPlot.lineTo(this.starretX + this.bodyWidth *.005, this.levelPixel - i * yPixelPer5Mil);
            this.ctxPlot.fillText(i, this.starretX + this.bodyWidth *.005, this.levelPixel - i * yPixelPer5Mil);
        }

        for(let i = 1; i < 9; i++)
        {
            this.ctxPlot.moveTo(this.starretX - this.bodyWidth *.005, this.levelPixel + i * yPixelPer5Mil);
            this.ctxPlot.lineTo(this.starretX + this.bodyWidth *.005, this.levelPixel + i * yPixelPer5Mil);
            this.ctxPlot.fillText(i, this.starretX + this.bodyWidth *.005, this.levelPixel + i * yPixelPer5Mil);
        }

        this.ctxPlot.stroke();
    }

    //Draw horizontal scaling arrows.
    drawHorzScaling(blockX, blockY)
    {
        let pixelsPerSquare = this.pixelsPerSquare;
        let xStart = (blockX * 10 + 0.2) * pixelsPerSquare;
        let yStart = (blockY * 10 + 8) * pixelsPerSquare;
        this.ctxPlot.strokeStyle = "black";
        this.ctxPlot.lineWidth = this.lineWidth;

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

    //Draw vertical scaling arrows.
    drawVertScaling(blockX, blockY)
    {
        let pixelsPerSquare = this.pixelsPerSquare;
        let xStart = (blockX * 10 + 2) * pixelsPerSquare;
        let yStart = (blockY * 10 + .2) * pixelsPerSquare;
        this.ctxPlot.strokeStyle = "black";
        this.ctxPlot.lineWidth = this.lineWidth;

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

    //Draw a point on the graph.
    drawPoint(x, y, color)
    {
        this.ctxPlot.beginPath();
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.moveTo(x, y);
        this.ctxPlot.arc(x, y, this.lineWidth, 0, 2 * Math.PI);
        this.ctxPlot.fill();
    }

    //Draw solid lines on the graph.
    drawSolidLine(startX, startY, endX, endY, width, color)
    {
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = color;
        this.ctxPlot.lineWidth = width;
        this.ctxPlot.moveTo(startX, startY);
        this.ctxPlot.lineTo(endX, endY);
        this.ctxPlot.stroke();
    }

    //Draw dashed lines on the graph.
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

    //Draw 1 or more lines of text.
    DrawText(textArray, size, color, baseline)
    {
        this.ctxPlot.beginPath();
        this.ctxPlot.fillStyle = color;
        this.ctxPlot.font = "bold " + size + "px Arial";
        this.ctxPlot.textBaseline = baseline;

        //Each object in the text array should have text, x position and y position, in pixels.
        for(let i = 0; i < textArray.length; i++)
        {
            this.ctxPlot.fillText(textArray[i].text, textArray[i].x, textArray[i].y);
        }

        this.ctxPlot.stroke();
    }
}
