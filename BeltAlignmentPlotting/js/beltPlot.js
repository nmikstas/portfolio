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
        parentDiv
    )
    {
        this.parentDiv = parentDiv;

        //Height and width of the canvas.
        this.bodyWidth = 100;
        this.bodyHeight = 100;

        //Variables for line plotting.
        this.driverBubble = undefined;
        this.driverBubble = undefined;
        this.driverFeet   = undefined;
        this.drivenFeet   = undefined;
        
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

    updateValues(driverBubble, drivenBubble, driverFeet, drivenFeet)
    {

        //Range check the geven values.
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

        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 50) return;

        //Calculate the height/width of the grid squares.
        let dxy = this.bodyWidth / 110;
        let thisdxy = 0;

        //Draw the vertical grid lines.
        for(let i = 0; i < 111; i++)
        {
            this.ctxPlot.beginPath();
            this.ctxPlot.strokeStyle = "black";
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
            this.ctxPlot.strokeStyle = "black";
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
        let driverMALToStarrett = driverMALSlope * BeltPlot.STARRETT;
        let driverMALToDrivenFF = driverMALSlope * this.drivenFeet;
        let driverMALToDriverFF = driverMALSlope * this.driverFeet;
        let driverMALToEnd      = driverMALSlope * xBlocksScaling * 10;

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

        //Calculate the critical points on the graph, in absolute pixle locations.
        let drivenMALToStarrettX = xPixelPerInch * BeltPlot.STARRETT + rearFeetRef;
        let drivenMALToStarrettY = levelPixel - drivenMALToStarrett * yPixelPerMil;
        let drivenMALToDrivenFFX = xPixelPerInch * this.drivenFeet + rearFeetRef;
        let drivenMALToDrivenFFY = levelPixel - drivenMALToDrivenFF * yPixelPerMil;
        let drivenMALToDriverFFX = xPixelPerInch * this.driverFeet + rearFeetRef;
        let drivenMALToDriverFFY = levelPixel - drivenMALToDriverFF * yPixelPerMil;
        let drivenMALToEndY      = levelPixel - drivenMALToEnd * yPixelPerMil;
        let driverMALToStarrettX = xPixelPerInch * BeltPlot.STARRETT + rearFeetRef;
        let driverMALToStarrettY = levelPixel - driverMALToStarrett * yPixelPerMil;
        let driverMALToDrivenFFX = xPixelPerInch * this.drivenFeet + rearFeetRef;
        let driverMALToDrivenFFY = levelPixel - driverMALToDrivenFF * yPixelPerMil;
        let driverMALToDriverFFX = xPixelPerInch * this.driverFeet + rearFeetRef;
        let driverMALToDriverFFY = levelPixel - driverMALToDriverFF * yPixelPerMil;
        let driverMALToEndY      = levelPixel - driverMALToEnd * yPixelPerMil;
        


        console.log("*****");
        //console.log("yBlockScaling: " + yBlockScaling);
        //console.log("maxCritPoint: " + maxCritPoint);
        //console.log("minCritPoint: " + minCritPoint);
        //console.log("drivenMALToStarrett: " + drivenMALToStarrett);
        //console.log("drivemMALToDrivenFF: " + drivemMALToDrivenFF);
        //console.log("drivenMALToDriverFF: " + drivenMALToDriverFF);
        //console.log("driverMALToStarrett: " + driverMALToStarrett);
        //console.log("driverMALToDrivenFF: " + driverMALToDrivenFF);
        //console.log("driverMALToDriverFF: " + driverMALToDriverFF);










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
        this.ctxPlot.strokeStyle = "blue";
        this.ctxPlot.moveTo(0, levelPixel);
        this.ctxPlot.lineTo(this.bodyWidth, levelPixel);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();
        this.ctxPlot.setLineDash([]);

        //Draw the Starrett 98 reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "red";
        this.ctxPlot.moveTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef, 0);
        this.ctxPlot.lineTo(xPixelPerInch * BeltPlot.STARRETT + rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Draw the rear feet reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "red";
        this.ctxPlot.moveTo(rearFeetRef, 0);
        this.ctxPlot.lineTo(rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Draw the driven front feet reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "blue";
        this.ctxPlot.moveTo(xPixelPerInch * this.drivenFeet + rearFeetRef, 0);
        this.ctxPlot.lineTo(xPixelPerInch * this.drivenFeet + rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Draw the driver front feet reference line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#00ff00";
        this.ctxPlot.moveTo(xPixelPerInch * this.driverFeet + rearFeetRef, 0);
        this.ctxPlot.lineTo(xPixelPerInch * this.driverFeet + rearFeetRef, this.bodyHeight);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Driven MAL line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#0000ff";
        this.ctxPlot.moveTo(rearFeetRef, levelPixel);
        this.ctxPlot.lineTo(this.bodyWidth, drivenMALToEndY);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
        this.ctxPlot.stroke();

        //Driver MAL line.
        this.ctxPlot.beginPath();
        this.ctxPlot.strokeStyle = "#00ff00";
        this.ctxPlot.moveTo(rearFeetRef, levelPixel);
        this.ctxPlot.lineTo(this.bodyWidth, driverMALToEndY);
        this.ctxPlot.lineWidth = this.bodyWidth * .004;
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



        




        

        //Driven MAL Starret 98 critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000070";
        this.ctxPlot.moveTo(drivenMALToStarrettX, drivenMALToStarrettY);
        this.ctxPlot.arc(drivenMALToStarrettX, drivenMALToStarrettY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driven MAL driven FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000070";
        this.ctxPlot.moveTo(drivenMALToDrivenFFX, drivenMALToDrivenFFY);
        this.ctxPlot.arc(drivenMALToDrivenFFX, drivenMALToDrivenFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driven MAL driver FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000070";
        this.ctxPlot.moveTo(drivenMALToDriverFFX, drivenMALToDriverFFY);
        this.ctxPlot.arc(drivenMALToDriverFFX, drivenMALToDriverFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driver MAL Starret 98 critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000070";
        this.ctxPlot.moveTo(driverMALToStarrettX, driverMALToStarrettY);
        this.ctxPlot.arc(driverMALToStarrettX, driverMALToStarrettY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driver MAL driven FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000070";
        this.ctxPlot.moveTo(driverMALToDrivenFFX, driverMALToDrivenFFY);
        this.ctxPlot.arc(driverMALToDrivenFFX, driverMALToDrivenFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        //Driver MAL driver FF critical point.
        this.ctxPlot.beginPath();
        this.ctxPlot.lineWidth = this.bodyWidth * .005;
        this.ctxPlot.strokeStyle = "#00000070";
        this.ctxPlot.moveTo(driverMALToDriverFFX, driverMALToDriverFFY);
        this.ctxPlot.arc(driverMALToDriverFFX, driverMALToDriverFFY, this.bodyWidth * .002, 0, 2 * Math.PI);
        this.ctxPlot.stroke();

        

        

    }
}
