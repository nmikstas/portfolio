class ShaftPlot
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get HEIGHT_MULT() {return .72727272}
    
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
}