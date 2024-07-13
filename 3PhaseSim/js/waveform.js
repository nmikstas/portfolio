class Waveform
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get SAMPLES_PER_CYCLE() {return 50}
    static get VOLTS_PEAK() {return .95}
    static get AMPS_PEAK() {return .85}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        parentDiv,
        VAtxt, VBtxt, VCtxt,
        IAtxt, IBtxt, ICtxt,
        VAphs, VBphs, VCphs,
        IAphs, IBphs, ICphs,
        {
            vaColor = "#ff0000",
            vbColor = "#00ff00",
            vcColor = "#0000ff",
            iaColor = "#770000",
            ibColor = "#007700",
            icColor = "#000077",
            cycles  = 1.5,
            showVA  = true,
            showVB  = true,
            showVC  = true,
            showIA  = true,
            showIB  = true,
            showIC  = true
        } = {}
    )
    {
        this.parentDiv = parentDiv;

        //Get references to the critical graph data.
        this.VAtxt = VAtxt;
        this.VBtxt = VBtxt;
        this.VCtxt = VCtxt;
        this.IAtxt = IAtxt;
        this.IBtxt = IBtxt;
        this.ICtxt = ICtxt;
        this.VAphs = VAphs;
        this.VBphs = VBphs;
        this.VCphs = VCphs;
        this.IAphs = IAphs;
        this.IBphs = IBphs;
        this.ICphs = ICphs;

        //Waveform colors.
        this.vaColor = vaColor;
        this.vbColor = vbColor;
        this.vcColor = vcColor;
        this.iaColor = iaColor;
        this.ibColor = ibColor;
        this.icColor = icColor;

        //Number of cycles to display.
        this.cycles = cycles;

        //Which waveforms to show.
        this.showVA = showVA;
        this.showVB = showVB;
        this.showVC = showVC;
        this.showIA = showIA;
        this.showIB = showIB;
        this.showIC = showIC;

        //Context of the canvas.
        this.ctxwf;

        //Height and width of the canvas.
        this.bodyWidth  = 400;
        this.bodyHeight = 100;
        this.yMiddle    = 50;

        //Drawing canvas.
        this.bodyCanvas = undefined;

        //Only create level if the parent exists.
        if(this.parentDiv)this.init();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    init()
    {
        //Create the component.
        this.bodyCanvas = document.createElement("canvas");

        //Get 2D contexts of the canvas.
        this.ctxwf = this.bodyCanvas.getContext("2d");

        //Clear anything out of the parent div.
        this.parentDiv.innerHTML = "";

        //Add all the components to the div.
        this.parentDiv.appendChild(this.bodyCanvas);
        
        //Add resize listener to the window.
        window.addEventListener("resize", () => this.resize());

        //Set initial size of the level.
        this.resize();
    }

    resize()
    {
        //Get the dimensions of the parent container.
        let parentRect = this.parentDiv.getBoundingClientRect();

        //Calculate the width and height of the canvas.
        this.bodyCanvas.width  = parentRect.width;
        this.bodyCanvas.height = parentRect.height;

        //Save a copy of the height and width of the canvas for future calculations.
        this.bodyWidth  = this.bodyCanvas.width;
        this.bodyHeight = this.bodyCanvas.height;

        //Calculate the Y center of the canvas.
        this.yMiddle = this.bodyHeight / 2;
        this.bodyDraw();
    }

    bodyDraw()
    {
        //Clear the canvas.
        this.ctxwf.beginPath();
        this.ctxwf.fillStyle = "#ffffff";
        this.ctxwf.fillRect(0, 0, this.bodyWidth, this.bodyWidth)
        this.ctxwf.stroke();
        
        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 5) return;

        //Draw the center line.
        this.ctxwf.beginPath();
        this.ctxwf.strokeStyle = "#00000010";
        this.ctxwf.moveTo(0, this.yMiddle);
        this.ctxwf.lineTo(this.bodyWidth, this.yMiddle);
        this.ctxwf.lineWidth = this.bodyHeight * .005;           
        this.ctxwf.stroke();

        //Get all the critical numbers for the graphing.
        let va = parseFloat(this.VAtxt.value);
        let vb = parseFloat(this.VBtxt.value);
        let vc = parseFloat(this.VCtxt.value);
        let ia = parseFloat(this.IAtxt.value);
        let ib = parseFloat(this.IBtxt.value);
        let ic = parseFloat(this.ICtxt.value);
        let vap = parseFloat(this.VAphs.value);
        let vbp = parseFloat(this.VBphs.value);
        let vcp = parseFloat(this.VCphs.value);
        let iap = parseFloat(this.IAphs.value);
        let ibp = parseFloat(this.IBphs.value);
        let icp = parseFloat(this.ICphs.value);

        //Calculate the peak values for the waveforms
        let maxV = 0;
        let maxI = 0;
        if(va > maxV && this.showVA) maxV = va;
        if(vb > maxV && this.showVB) maxV = vb;
        if(vc > maxV && this.showVC) maxV = vc;
        if(ia > maxI && this.showIA) maxI = ia;
        if(ib > maxI && this.showIB) maxI = ib;
        if(ic > maxI && this.showIC) maxI = ic;

        //Calculate the amplitudes of the waveforms.
        let vaAmplitude = this.yMiddle * Waveform.VOLTS_PEAK * va / maxV;
        let vbAmplitude = this.yMiddle * Waveform.VOLTS_PEAK * vb / maxV;
        let vcAmplitude = this.yMiddle * Waveform.VOLTS_PEAK * vc / maxV;
        let iaAmplitude = this.yMiddle * Waveform.AMPS_PEAK  * ia / maxI;
        let ibAmplitude = this.yMiddle * Waveform.AMPS_PEAK  * ib / maxI;
        let icAmplitude = this.yMiddle * Waveform.AMPS_PEAK  * ic / maxI;
        
        //Draw the waveforms.
        if(this.showVA)this.drawWaveform(vaAmplitude, vap, this.vaColor);
        if(this.showVB)this.drawWaveform(vbAmplitude, vbp, this.vbColor);
        if(this.showVC)this.drawWaveform(vcAmplitude, vcp, this.vcColor);
        if(this.showIA)this.drawWaveform(iaAmplitude, iap, this.iaColor);
        if(this.showIB)this.drawWaveform(ibAmplitude, ibp, this.ibColor);
        if(this.showIC)this.drawWaveform(icAmplitude, icp, this.icColor);
    }

    drawWaveform(amplitude, phase, color)
    {
        //Calculate the total number of samples per waveform.
        let numSamples = this.cycles * Waveform.SAMPLES_PER_CYCLE;

        //Calculate the change in X per sample.
        let dx = this.bodyWidth / numSamples;
        let thisx = 0;

        for(let x = 0; x < numSamples; x++)
        {
            //Calculate start Y position of line
            let thisy = -amplitude * Math.sin(2 * Math.PI * x * this.cycles / numSamples + this.DtoR(phase)) + this.yMiddle;
            this.ctxwf.beginPath();
            this.ctxwf.strokeStyle = color+"80";
            this.ctxwf.moveTo(thisx, thisy);
    
            //Update to next X position.
            thisx += dx;
    
            //Calculate end Y position of line.
            thisy = -amplitude * Math.sin(2 * Math.PI * (x + 1 ) * this.cycles / numSamples + this.DtoR(phase)) + this.yMiddle;
            this.ctxwf.lineTo(thisx, thisy);
            this.ctxwf.lineWidth = this.bodyHeight * .01;          
            this.ctxwf.stroke(); 
        }
    }

    //Convert degrees into radians.
    DtoR(degrees)
    {
        return degrees * Math.PI / 180;
    }

    //Update which waveforms should be drawn.
    updateShow(va = true, vb = true, vc = true, ia = true, ib = true, ic = true)
    {
        this.showVA = va;
        this.showVB = vb;
        this.showVC = vc;
        this.showIA = ia;
        this.showIB = ib;
        this.showIC = ic;
        this.resize();
    }

    //Update the number of cycles to show.
    updateCycles(cyc)
    {
        this.cycles = cyc;
        this.resize();
    }
}