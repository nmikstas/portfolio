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
        this.bodyWidth = 100;
        this.bodyHeight = 100;

        //Background image of the plot.
        this.backgroundImg = backgroundImg;

        //Variables for line plotting.
        this.driverBubble = undefined;
        this.driverBubble = undefined;
        this.driverFeet   = undefined;
        this.drivenFeet   = undefined;

        //Variables for move distances.
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

    updateMoves(driverToLevel, drivenToLevel, driverToDriven, DrivenToDriver)
    {
        this.dvrToLvl = driverToLevel;
        this.dvnToLvl = drivenToLevel;
        this.dvrToDvn = driverToDriven;
        this.dvnToDvr = DrivenToDriver;
    }

    updateValues(driverBubble, drivenBubble, driverFeet, drivenFeet)
    {

        //Range check the given values.
        if(driverBubble > BeltPlot.MAX_BUBBLE || driverBubble < BeltPlot.MIN_BUBBLE)
        {
            this.driverBubble = undefined;
        }
        else
        {
            this.driverBubble = driverBubble;
        }

        if(drivenBubble > BeltPlot.MAX_BUBBLE || drivenBubble < BeltPlot.MIN_BUBBLE)
        {
            this.drivenBubble = undefined;
        }
        else
        {
            this.drivenBubble = drivenBubble;
        }

        if(driverFeet > BeltPlot.MAX_FEET || driverFeet < BeltPlot.MIN_FEET)
        {
            this.driverFeet = undefined;
        }
        else
        {
            this.driverFeet = driverFeet;
        }

        if(drivenFeetDistance > BeltPlot.MAX_FEET || drivenFeet < BeltPlot.MIN_FEET)
        {
            this.drivenFeet = undefined;
        }
        else
        {
            this.drivenFeet = drivenFeet;
        }

        this.bodyDraw();
    }

    bodyDraw()
    {
        //Clear any existing drawings.
        this.ctxPlot.clearRect(0, 0, this.bodyWidth, this.bodyHeight);

        //Ensure the backgroung is not transparent.
        if(this.backgroundImg)
        {
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
        //Don't draw the graph is the data is invalid.
        if(this.drivenBubble === undefined || this.driverBubble === undefined || 
           this.drivenFeet   === undefined || this.driverFeet   === undefined) return;

        //Calculate the height/width of the grid squares in pixels.
        let dxy = this.bodyWidth / 110;

        //Calculate the x scaling of the graph.
        let maxX = Math.max(BeltPlot.STARRETT, this.driverFeet, this.drivenFeet);
        
        let xBlocksScaling = Math.ceil(maxX / 9);  //Calculate inches per block (10 squares).
        let xSquareScaling = xBlocksScaling / 10;  //Calculate inches per square.
        let xInchPerPixel  = xSquareScaling / dxy; //Calculate inches per pixel.
        let xPixelPerInch  = 1 / xInchPerPixel;    //Calculate pixels per inch.
        let rearFeetRef = dxy * 10;                //Calculate the rear feet reference offset.

        //Calculate the slope of the driver and driven misadjustment lines.
        let driverMALSlope = -this.driverBubble * 5 / BeltPlot.STARRETT;
        let drivenMALSlope = -this.drivenBubble * 5 / BeltPlot.STARRETT;

        //Calculate the critical y points on the graph referenced to the level line.
        let drivenMALToStarrett = drivenMALSlope * BeltPlot.STARRETT;
        let drivenMALToDrivenFF = drivenMALSlope * this.drivenFeet;
        let drivenMALToDriverFF = drivenMALSlope * this.driverFeet;
        let drivenMALToEnd      = drivenMALSlope * xBlocksScaling * 10;
        let drivenMAL9          = drivenMALSlope * xBlocksScaling * 9;
        let driverMALToStarrett = driverMALSlope * BeltPlot.STARRETT;
        let driverMALToDrivenFF = driverMALSlope * this.drivenFeet;
        let driverMALToDriverFF = driverMALSlope * this.driverFeet;
        let driverMALToEnd      = driverMALSlope * xBlocksScaling * 10;
        let driverMAL9          = driverMALSlope * xBlocksScaling * 9;

        //Find the maximum and minimum of the critical points.
        let maxCritPoint = Math.max(drivenMALToStarrett, drivenMALToDrivenFF, drivenMALToDriverFF, driverMALToStarrett, driverMALToDrivenFF, driverMALToDriverFF);
        let minCritPoint = Math.min(drivenMALToStarrett, drivenMALToDrivenFF, drivenMALToDriverFF, driverMALToStarrett, driverMALToDrivenFF, driverMALToDriverFF);

        let levelPixel     = 0;
        let yBlockScaling  = 0;
        let ySquareScaling = 0;
        let yMilsPerPixel  = 0;
        let yPixelPerMil   = 0;

        //Starting points for drawing the scale arrows.
        let xStart = 0;
        let yStart = 0;

        //Determine if both are positive or negative or if they are different signs.
        if(maxCritPoint >= 0 && minCritPoint >= 0)
        {
            levelPixel     = this.bodyHeight - dxy * 10;
            yBlockScaling  = Math.ceil(maxCritPoint / 6 / 5) * 5;
        }
        else if(maxCritPoint < 0 && minCritPoint < 0)
        {
            levelPixel     = dxy * 10;
            yBlockScaling  = Math.abs(Math.floor(minCritPoint / 6 / 5) * 5);
        }
        else
        {
            levelPixel     = this.bodyHeight / 2;
            yBlockScaling  = maxCritPoint >= Math.abs(minCritPoint) ? Math.ceil(maxCritPoint / 3 / 5) * 5 : Math.abs(Math.floor(minCritPoint / 3 / 5) * 5);
        }

        ySquareScaling = yBlockScaling / 10;
        yMilsPerPixel  = ySquareScaling / dxy;
        yPixelPerMil   = 1 / yMilsPerPixel;

        let drivenMALToDrivenFFX = xPixelPerInch * this.drivenFeet + rearFeetRef;
        let drivenMALToDrivenFFY = levelPixel - drivenMALToDrivenFF * yPixelPerMil;
        let drivenMALToDriverFFX = xPixelPerInch * this.driverFeet + rearFeetRef;
        let drivenMALToDriverFFY = levelPixel - drivenMALToDriverFF * yPixelPerMil;
        let drivenToLevelX       = xPixelPerInch * this.drivenFeet + rearFeetRef;;
        let drivenToLevelY       = levelPixel;

        let driverMALToDrivenFFX = xPixelPerInch * this.drivenFeet + rearFeetRef;
        let driverMALToDrivenFFY = levelPixel - driverMALToDrivenFF * yPixelPerMil;
        let driverMALToDriverFFX = xPixelPerInch * this.driverFeet + rearFeetRef;
        let driverMALToDriverFFY = levelPixel - driverMALToDriverFF * yPixelPerMil;
        let driverToLevelX       = xPixelPerInch * this.driverFeet + rearFeetRef;
        let driverToLevelY       = levelPixel;
        
        //Used for plotting MAL lines and text.
        let drivenMALToEndY = levelPixel - drivenMALToEnd * yPixelPerMil;
        let drivenMALY      = levelPixel - drivenMAL9 * yPixelPerMil;
        let driverMALToEndY = levelPixel - driverMALToEnd * yPixelPerMil;
        let driverMALY      = levelPixel - driverMAL9 * yPixelPerMil;


        //Make sure text for the driver and driven MAL stay on the graph.
        if(drivenMALY > levelPixel)
        {
            drivenMALY -= 2 * dxy;
        }

        if(drivenMALY < 0)
        {
            drivenMALY = 0;
        }
        else if(drivenMALY > (this.bodyHeight * .98))
        {
            drivenMALY = this.bodyHeight * .98;   
        }

        if(driverMALY > levelPixel)
        {
            driverMALY -= 2 * dxy;
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
        xStart = 2 * dxy;
        yStart = 50.2 * dxy;
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "black";
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo(1 * dxy, 51 * dxy);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo(3 * dxy, 51 * dxy);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo(2 * dxy, 59.7 * dxy);
        this.ctxPlot.lineTo(1 * dxy, 59 * dxy);
        this.ctxPlot.lineTo(2 * dxy, 59.7 * dxy);
        this.ctxPlot.lineTo(3 * dxy, 59 * dxy);
        this.ctxPlot.stroke();

        //Draw the X-axis arrow.
        xStart = 0.2 * dxy;
        yStart = 68 * dxy;
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "black";
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo(1 * dxy, 67 * dxy);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo(1 * dxy, 69 * dxy);
        this.ctxPlot.moveTo(xStart, yStart);
        this.ctxPlot.lineTo(9.7 * dxy, 68 * dxy);
        this.ctxPlot.lineTo(9 * dxy, 67 * dxy);
        this.ctxPlot.lineTo(9.7 * dxy, 68 * dxy);
        this.ctxPlot.lineTo(9 * dxy, 69 * dxy);
        this.ctxPlot.stroke();

        //Draw level line.
        this.ctxPlot.beginPath();
        this.ctxPlot.setLineDash([this.bodyWidth * .01, this.bodyWidth * .01]);
        this.ctxPlot.strokeStyle = "#0000ff40";
        this.ctxPlot.moveTo(0, levelPixel);
        this.ctxPlot.lineTo(this.bodyWidth, levelPixel);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();
        this.ctxPlot.setLineDash([]);

        //Draw the Starrett graduations.
        let yPixelPer5Mil = yPixelPerMil * 5;

        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#00000040";
        this.ctxPlot.fillStyle   = "#00000040";
        this.ctxPlot.lineWidth   = this.bodyWidth * .004;
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "middle";

        for(let i = 0; i < 9; i++)
        {
            this.ctxPlot.moveTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef - this.bodyWidth *.005, levelPixel - i * yPixelPer5Mil);
            this.ctxPlot.lineTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef + this.bodyWidth *.005, levelPixel - i * yPixelPer5Mil);
            this.ctxPlot.fillText(i, xPixelPerInch * BeltPlot.STARRETT + rearFeetRef + this.bodyWidth *.005, levelPixel - i * yPixelPer5Mil);
        }

        for(let i = 1; i < 9; i++)
        {
            this.ctxPlot.moveTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef - this.bodyWidth *.005, levelPixel + i * yPixelPer5Mil);
            this.ctxPlot.lineTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef + this.bodyWidth *.005, levelPixel + i * yPixelPer5Mil);
            this.ctxPlot.fillText(i, xPixelPerInch * BeltPlot.STARRETT + rearFeetRef + this.bodyWidth *.005, levelPixel + i * yPixelPer5Mil);
        }

        this.ctxPlot.stroke();

        //Draw the Starrett 98 reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#ff000070";
        this.ctxPlot.moveTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef, 0);
        this.ctxPlot.lineTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Draw the rear feet reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#ff000070";
        this.ctxPlot.moveTo(rearFeetRef, 0);
        this.ctxPlot.lineTo(rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Draw the driven front feet reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#0000ff70";
        this.ctxPlot.moveTo(xPixelPerInch * this.drivenFeet + rearFeetRef, 0);
        this.ctxPlot.lineTo(xPixelPerInch * this.drivenFeet + rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Draw the driver front feet reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#00a00070";
        this.ctxPlot.moveTo(xPixelPerInch * this.driverFeet + rearFeetRef, 0);
        this.ctxPlot.lineTo(xPixelPerInch * this.driverFeet + rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Driven MAL line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#0000ff70";
        this.ctxPlot.moveTo(rearFeetRef, levelPixel);
        this.ctxPlot.lineTo(this.bodyWidth, drivenMALToEndY);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Driver MAL line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#00a00070";
        this.ctxPlot.moveTo(rearFeetRef, levelPixel);
        this.ctxPlot.lineTo(this.bodyWidth, driverMALToEndY);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //DrivenM MAL text.
        this.ctxPlot.fillStyle = "#0000ff70";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Driven MAL", this.bodyWidth * .915, drivenMALY);
        this.ctxPlot.stroke();

        //Driver MAL text.
        this.ctxPlot.fillStyle = "#00700070";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Driver MAL", this.bodyWidth * .915, driverMALY);
        this.ctxPlot.stroke();

        //Draw horizontal scale text.
        this.ctxPlot.fillStyle = "#000000";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(xBlocksScaling + " inches", 1.5 * dxy, 65.5 * dxy);
        this.ctxPlot.stroke();

        //Draw vertical scale text.
        this.ctxPlot.fillStyle = "#000000";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(yBlockScaling + " mils", 3 * dxy, 54.5 * dxy);
        this.ctxPlot.stroke();

        //Draw level text.
        this.ctxPlot.fillStyle = "#0000ff70";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Level", this.bodyWidth * .005, levelPixel + this.bodyHeight * .005);
        this.ctxPlot.stroke();

        //Draw the rear feet reference text.
        this.ctxPlot.fillStyle = "#ff000070";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Ref Driver", this.bodyWidth * .005, this.bodyHeight * .005);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("and Driven", this.bodyWidth * .005, this.bodyHeight * .025);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Rear Feet", this.bodyWidth * .005, this.bodyHeight * .045);
        this.ctxPlot.stroke();

        //Draw the Starrett 98 reference text.
        this.ctxPlot.fillStyle = "#ff000070";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Starrett 98", xPixelPerInch * BeltPlot.STARRETT + rearFeetRef - this.bodyWidth * .08, this.bodyHeight * .005);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("12\" Ref", xPixelPerInch * BeltPlot.STARRETT + rearFeetRef - this.bodyWidth * .08, this.bodyHeight * .025);
        this.ctxPlot.stroke();

        //Draw the driver front feet reference text.
        this.ctxPlot.fillStyle = "#00700070";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Driver", xPixelPerInch * this.driverFeet + rearFeetRef - this.bodyWidth * .08, this.bodyHeight * .085);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Front Feet", xPixelPerInch * this.driverFeet + rearFeetRef - this.bodyWidth * .08, this.bodyHeight * .105);
        this.ctxPlot.stroke();

        //Draw the driven front feet reference text.
        this.ctxPlot.fillStyle = "#0000ff70";
        this.ctxPlot.font = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.textBaseline = "top";
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Driven", xPixelPerInch * this.drivenFeet + rearFeetRef - this.bodyWidth * .08, this.bodyHeight * .045);
        this.ctxPlot.stroke();
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText("Front Feet", xPixelPerInch * this.drivenFeet + rearFeetRef - this.bodyWidth * .08, this.bodyHeight * .065);
        this.ctxPlot.stroke();

        /*
        //Driven MAL driven FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000030";
        this.ctxPlot.moveTo(drivenMALToDrivenFFX, drivenMALToDrivenFFY);
        this.ctxPlot.arc(drivenMALToDrivenFFX, drivenMALToDrivenFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driven MAL driver FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000030";
        this.ctxPlot.moveTo(drivenMALToDriverFFX, drivenMALToDriverFFY);
        this.ctxPlot.arc(drivenMALToDriverFFX, drivenMALToDriverFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driver MAL driven FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000030";
        this.ctxPlot.moveTo(driverMALToDrivenFFX, driverMALToDrivenFFY);
        this.ctxPlot.arc(driverMALToDrivenFFX, driverMALToDrivenFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driver MAL driver FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000030";
        this.ctxPlot.moveTo(driverMALToDriverFFX, driverMALToDriverFFY);
        this.ctxPlot.arc(driverMALToDriverFFX, driverMALToDriverFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driven to level critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000030";
        this.ctxPlot.moveTo(drivenToLevelX, drivenToLevelY);
        this.ctxPlot.arc(drivenToLevelX, drivenToLevelY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driver to level critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000030";
        this.ctxPlot.moveTo(driverToLevelX, driverToLevelY);
        this.ctxPlot.arc(driverToLevelX, driverToLevelY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();
        */

        //Set up the bezier spline line values.
        this.ctxPlot.lineWidth    = this.bodyWidth * .0025;
        this.ctxPlot.textBaseline = "middle";
        this.ctxPlot.font         = "bold " + (this.bodyWidth * .015) + "px Arial";
        this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);

        //**********Bezier spline calculations, driver to level**********
        let driverToLevelLowestY = (driverToLevelY > driverMALToDriverFFY) ? driverMALToDriverFFY: driverToLevelY;
        let driverToLeveldy      = Math.abs(driverToLevelY - driverMALToDriverFFY);
        let driverToLevelCY      = driverToLevelLowestY + .50 * driverToLeveldy;
        let driverToLevelCX      = driverMALToDriverFFX + this.bodyWidth * .025;
        
        //Draw point.
        this.ctxPlot.beginPath();
        this.ctxPlot.setLineDash([]);
        this.ctxPlot.fillStyle = "#007000";
        this.ctxPlot.moveTo(driverToLevelX, levelPixel);
        this.ctxPlot.arc(driverToLevelX, levelPixel, this.bodyWidth * .004, 0, 2 * Math.PI);
        this.ctxPlot.fill();
        this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);

        //Draw movement arc.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#007000";
        this.ctxPlot.moveTo(driverToLevelX, driverToLevelY);
        this.ctxPlot.bezierCurveTo(driverToLevelCX, driverToLevelCY, driverToLevelCX, driverToLevelCY, driverMALToDriverFFX, driverMALToDriverFFY);
        this.ctxPlot.stroke();

        //add label.
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(this.dvrToLvl, driverToLevelCX, driverToLevelCY);
        this.ctxPlot.stroke();

        //**********Bezier spline calculations, driven to level**********
        let drivenToLevelLowestY = (drivenToLevelY > drivenMALToDrivenFFY) ? drivenMALToDrivenFFY: drivenToLevelY;
        let drivenToLeveldy      = Math.abs(drivenToLevelY - drivenMALToDrivenFFY);
        let drivenToLevelCY      = drivenToLevelLowestY + .50 * drivenToLeveldy;
        let drivenToLevelCX      = drivenMALToDrivenFFX + this.bodyWidth * .025;
        
        //Draw point.
        this.ctxPlot.beginPath();
        this.ctxPlot.setLineDash([]);
        this.ctxPlot.fillStyle = "#0000b0";
        this.ctxPlot.moveTo(drivenToLevelX, levelPixel);
        this.ctxPlot.arc(drivenToLevelX, levelPixel, this.bodyWidth * .004, 0, 2 * Math.PI);
        this.ctxPlot.fill();
        this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);

        //Draw movement arc.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle  = "#0000b0";
        this.ctxPlot.moveTo(drivenToLevelX, drivenToLevelY);
        this.ctxPlot.bezierCurveTo(drivenToLevelCX, drivenToLevelCY, drivenToLevelCX, drivenToLevelCY, drivenMALToDrivenFFX, drivenMALToDrivenFFY);
        this.ctxPlot.stroke();

        //Add label.
        this.ctxPlot.beginPath();
        this.ctxPlot.fillText(this.dvnToLvl, drivenToLevelCX, drivenToLevelCY);
        this.ctxPlot.stroke();
        
        //**********Bezier spline calculations, driven to driver**********
        if(this.dvnToDvr !== undefined)
        {
            let textWidth             = this.ctxPlot.measureText(this.dvnToDvr).width;
            let drivenToDriverLowestY = (driverMALToDrivenFFY > drivenMALToDrivenFFY) ? drivenMALToDrivenFFY: driverMALToDrivenFFY;
            let drivenToDriverdy      = Math.abs(driverMALToDrivenFFY - drivenMALToDrivenFFY);
            let drivenToDriverCY      = drivenToDriverLowestY + .50 * drivenToDriverdy;
            let drivenToDriverCX      = driverMALToDrivenFFX - this.bodyWidth * .025;
            
            //Draw point.
            this.ctxPlot.beginPath();
            this.ctxPlot.setLineDash([]);
            this.ctxPlot.fillStyle    = "#700000";
            this.ctxPlot.moveTo(driverMALToDrivenFFX, driverMALToDrivenFFY);
            this.ctxPlot.arc(driverMALToDrivenFFX, driverMALToDrivenFFY, this.bodyWidth * .004, 0, 2 * Math.PI);
            this.ctxPlot.fill();
            this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);

            //Draw movement arc.
            this.ctxPlot.beginPath();
            this.ctxPlot.strokeStyle  = "#700000";
            this.ctxPlot.moveTo(drivenMALToDrivenFFX, drivenMALToDrivenFFY);
            this.ctxPlot.bezierCurveTo(drivenToDriverCX, drivenToDriverCY, drivenToDriverCX, drivenToDriverCY, driverMALToDrivenFFX, driverMALToDrivenFFY);
            this.ctxPlot.stroke();

            //Add label.
            this.ctxPlot.beginPath();
            this.ctxPlot.fillText(this.dvnToDvr, drivenToDriverCX - textWidth, drivenToDriverCY);
            this.ctxPlot.stroke();
        }

        //**********Bezier spline calculations, driver to driven**********
        if(this.dvrToDvn !== undefined)
        {
            let textWidth             = this.ctxPlot.measureText(this.dvrToDvn).width;
            let driverToDrivenLowestY = (drivenMALToDriverFFY > driverMALToDriverFFY) ? driverMALToDriverFFY: drivenMALToDriverFFY;
            let driverToDrivendy      = Math.abs(drivenMALToDriverFFY - driverMALToDriverFFY);
            let driverToDrivenCY      = driverToDrivenLowestY + .50 * driverToDrivendy;
            let driverToDrivenCX      = drivenMALToDriverFFX - this.bodyWidth * .025;
            
            /*
            let arrowOffset           = 0;
            let xMirror               = 0;

            //Determine the direction of the arrow.
            if(drivenMALToDriverFFY > driverMALToDriverFFY)
            {
                arrowOffset = this.bodyHeight * -.01;
                xMirror = -1;
            }
            else
            {
                arrowOffset = this.bodyHeight * .01;
                xMirror = 1;
            }

            //Draw arrow.
            this.ctxPlot.beginPath();
            this.ctxPlot.setLineDash([]);
            this.ctxPlot.strokeStyle  = "#700000";
            this.ctxPlot.moveTo(drivenMALToDriverFFX, drivenMALToDriverFFY + arrowOffset);
            this.ctxPlot.lineTo(drivenMALToDriverFFX - arrowOffset * xMirror, drivenMALToDriverFFY + .5 * arrowOffset);
            this.ctxPlot.lineTo(drivenMALToDriverFFX, drivenMALToDriverFFY);
            this.ctxPlot.lineTo(drivenMALToDriverFFX + .25 * arrowOffset * xMirror, drivenMALToDriverFFY + 1.1 * arrowOffset);
            this.ctxPlot.lineTo(drivenMALToDriverFFX, drivenMALToDriverFFY + arrowOffset);
            this.ctxPlot.fill();
            this.ctxPlot.stroke();
            this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);
            */

            //Draw point.
            this.ctxPlot.beginPath();
            this.ctxPlot.setLineDash([]);
            this.ctxPlot.fillStyle    = "#700000";
            this.ctxPlot.moveTo(drivenMALToDriverFFX, drivenMALToDriverFFY);
            this.ctxPlot.arc(drivenMALToDriverFFX, drivenMALToDriverFFY, this.bodyWidth * .004, 0, 2 * Math.PI);
            this.ctxPlot.fill();
            this.ctxPlot.setLineDash([this.bodyWidth * .005, this.bodyWidth * .005]);

            //Draw movement arc.
            this.ctxPlot.beginPath();
            this.ctxPlot.strokeStyle  = "#700000";
            this.ctxPlot.moveTo(driverMALToDriverFFX, driverMALToDriverFFY);
            this.ctxPlot.bezierCurveTo(driverToDrivenCX, driverToDrivenCY, driverToDrivenCX, driverToDrivenCY, drivenMALToDriverFFX, drivenMALToDriverFFY);
            this.ctxPlot.stroke();
            
            //Add label.
            this.ctxPlot.beginPath();
            this.ctxPlot.fillText(this.dvrToDvn, driverToDrivenCX - textWidth, driverToDrivenCY);
            this.ctxPlot.stroke();
        }

        this.ctxPlot.setLineDash([]);
    }
}
