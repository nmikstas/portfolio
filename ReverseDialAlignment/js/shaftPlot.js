class ShaftPlot
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get HEIGHT_MULT() {return .72727272}
    static get DIM_MIN() {return .1}
    static get DIM_MAX() {return 100}
    static get TIR_MIN() {return -99}
    static get TIR_MAX() {return 99}
    
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

        //Background image of the plot.
        this.backgroundImg = backgroundImg;

        //Initial values used to calculate critical points.
        this.dimA = undefined;
        this.dimB = undefined;
        this.dimC = undefined;
        this.dimD = undefined;
        this.dimE = undefined;
        this.dimF = undefined;
        this.sTIR = undefined;
        this.mTIR = undefined;

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

    }

    //Calculate all the critical points for the graph. Units are in feet and mils.
    doCalcs(dimA, dimB, dimC, dimD, dimE, sTIR, mTIR)
    {
        let isValid = true;
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
            isValid = false;
        }

        //Make sure all entries are within the min and max ranges.
        if(isValid && (
           dimA1 < ShaftPlot.DIM_MIN || dimA1 > ShaftPlot.DIM_MAX || dimB1 < ShaftPlot.DIM_MIN || dimB1 > ShaftPlot.DIM_MAX ||
           dimC1 < ShaftPlot.DIM_MIN || dimC1 > ShaftPlot.DIM_MAX || dimD1 < ShaftPlot.DIM_MIN || dimD1 > ShaftPlot.DIM_MAX ||
           dimE1 < ShaftPlot.DIM_MIN || dimE1 > ShaftPlot.DIM_MAX || sTIR1 < ShaftPlot.TIR_MIN || sTIR1 > ShaftPlot.TIR_MAX ||
           mTIR1 < ShaftPlot.TIR_MIN || mTIR1 > ShaftPlot.TIR_MAX))
        {
            isValid = false;
        }

        //Make sure certain values are not less than other values.
        if(isValid && (dimB1 <= dimA1 || dimC1 <= dimB1 || dimC1 <= dimA1 || dimE1 <= dimD1))
        {
            isValid = false;
        }

        //Save the values if they are valid.
        if(!isValid)
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
        if(isValid)
        {          
            //Movable calcs, movable inboard.
            let m1 = (this.mTIR - this.sTIR) / this.dimA;
            let b1 = this.mTIR;
            let x1 = this.dimB - this.dimA;
            this.movable.mi = -(m1 * x1 + b1);

            //Movable calcs, movable outboard.
            x1 = dimC - dimA;
            this.movable.mo = -(m1 * x1 + b1);

            //Inboard calcs, stationary inboard.
            let m2 = -this.movable.mo / this.dimF;
            let x2 = this.dimE - this.dimD;
            this.inboard.si = m2 * x2;

            //Inboard calcs, movable inboard.
            x2 = this.dimE + this.dimB;
            let b2 = this.movable.mi;
            this.inboard.mi = m2 * x2 + b2;
        }
        
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
}