class Phasor
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get VEC_RATIO() {return .95}
    static get MAX_ZOOM()  {return 100}
    static get MIN_ZOOM()  {return 0.01}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        canvasDiv,
        {
            vec =
            [
                //Unbalanced system.
                {m: 1, a: 0,                color: "#ff0000", showText: true, isVisible: true},
                {m: 1, a: 2 * Math.PI / 3,  color: "#00ff00", showText: true, isVisible: true},
                {m: 1, a: -2 * Math.PI / 3, color: "#0000ff", showText: true, isVisible: true},

                //Positive sequence.
                {m: 1, a: 0,                color: "#800000", showText: false, isVisible: false},
                {m: 1, a: 2 * Math.PI / 3,  color: "#008000", showText: false, isVisible: false},
                {m: 1, a: -2 * Math.PI / 3, color: "#000080", showText: false, isVisible: false},

                //Negative sequence.
                {m: 1, a: 0, color: "#800080", showText: false, isVisible: false},
                {m: 1, a: 0, color: "#808000", showText: false, isVisible: false},
                {m: 1, a: 0, color: "#008080", showText: false, isVisible: false},

                //Zero sequence.
                {m: 1, a: 0, color: "808080", showText: false, isVisible: false}
            ]
        } = {}
    )
    {
        //Vector values.
        this.vec = vec;

        //Context of the canvas.
        this.ctxp;

        //Height and width of the canvas.
        this.bodyWidth  = 400;
        this.bodyHeight = 400;
        this.yMiddle    = 200;
        this.xMiddle    = 200;

        //Zoom variablles.
        this.maxMag = 1.0;
        this.drawCoords = false;
        this.unitMag = this.maxMag / (this.bodyWidth * Phasor.VEC_RATIO / 2);
        this.mouseX;
        this.mouseY;

        //Vector moving variables.
        this.isMoveable = false;
        this.moveableIndex = -1;

        //Drawing canvas.
        this.bodyCanvas = canvasDiv;

        //Mouse events.
        canvasDiv.onmousemove  = (e) => this.mouseMove(e);
        canvasDiv.ondblclick   = ()  => this.doubleClick();
        canvasDiv.onwheel      = (e) => this.mouseWheel(e);
        canvasDiv.onmouseleave = ()  => this.mouseLeave();

        //Only create drawing if the canvas exists.
        if(this.bodyCanvas)this.init();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    init()
    {
        this.autoZoom();
        this.bodyDraw();
    }

    bodyDraw()
    {
        this.bodyWidth  = this.bodyCanvas.getBoundingClientRect().width;
        this.bodyHeight = this.bodyCanvas.getBoundingClientRect().height;
        this.yMiddle    = this.bodyHeight / 2;
        this.xMiddle    = this.bodyWidth  / 2;

        //Calculate the unit magnitude.
        this.unitMag = this.maxMag / (this.bodyWidth * Phasor.VEC_RATIO / 2);

        //Get 2D contexts of the canvas.
        this.ctxp = this.bodyCanvas.getContext("2d");

        //Clear the canvas.
        this.ctxp.beginPath();
        this.ctxp.fillStyle = "#ffffff00";
        this.ctxp.clearRect(0, 0, this.bodyWidth, this.bodyWidth)
        this.ctxp.stroke();
        
        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 5) return;

        //Draw the outer rings of the phasor.
        this.drawArc(0, 2 * Math.PI, this.yMiddle, "#ffffffff", this.bodyWidth * .005, true);
        this.drawArc(0, 2 * Math.PI, this.yMiddle * Phasor.VEC_RATIO, "#00000010", this.bodyWidth * .005);

        //Draw lines representing standard angles.
        let thisAngle = 0;
        for(let x = 0; x < 12; x++)
        {
            this.drawLineAngle(thisAngle, thisAngle, "#00000010", this.bodyWidth * .005, 0, this.yMiddle);
            thisAngle += Math.PI / 6;
        }

        //Clip anything outside the phasor graph.
        this.ctxp.save();
        this.ctxp.beginPath();
        this.ctxp.arc(this.xMiddle, this.yMiddle, this.bodyWidth / 2, 0, Math.PI * 2);
        this.ctxp.clip();

        //Draw vectors.
        for(let i = 0; i < this.vec.length; i++)
        {
            let mag = this.vec[i].m;
            let angle = this.RtoD(this.vec[i].a);
            let text = mag.toFixed(1) + "∠" + angle.toFixed(1) + "°";

            //drawVector(angle, color, mag, text)
            if(this.vec[i].isVisible)
            {
                //Determine is phasor values need to be shown.
                if(this.vec[i].m / this.maxMag < .5 || !this.vec[i].showText) text ="";

                //Draw the phasor.
                this.drawVector(this.vec[i].a, this.vec[i].color, this.vec[i].m / this.unitMag, text);
            }
        }

        //Remove clipping.
        this.ctxp.restore();

        //Draw phasor coordinates of mouse cursor, if necessary.
        if(this.drawCoords)
        {
            //Convert cartesian coordinates to polar coordinates.
            let mag = this.unitMag * Math.sqrt(this.mouseX**2 + this.mouseY**2);
            let angle = this.RtoD(Math.atan2(this.mouseY, this.mouseX));
            let text = mag.toFixed(2) + "∠" + angle.toFixed(1) + "°";
                
            this.ctxp.fillStyle = "#808080";
            this.ctxp.font = "bold " + (this.yMiddle * .1) + "px Arial";
            this.ctxp.fillText(text, 0, this.bodyHeight);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Utility Functions                                     //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //Convert degrees into radians.
    DtoR(degrees)
    {
        return degrees * Math.PI / 180;
    }

    //Convert radians to degrees.
    RtoD(radians)
    {
        return radians * 180 / Math.PI;
    }

    //Print a polar numberin degrees.
    printPolarD(num)
    {
        return num.m.toFixed(0) + "∠" + this.RtoD(num.a).toFixed(0) + "°";
    }

    //Print a polar number in radians.
    printPolarR(num)
    {
        return num.m.toFixed(0) + "∠" + num.a.toFixed(0);
    }

    //Print a complex number.
    printComplex(num)
    {
        let sign = (num.i < 0) ? "-j" : "+j";
        console.log(num.r + sign + Math.abs(num.i));
    }

    //Convert number in complex form to polar form in radians.
    CtoP(num)
    {
        let result = {m: 0, a: 0};
        result.m = Math.sqrt(num.r**2 + num.i**2);
        result.a = Math.atan2(num.i, num.r);
        return result;
    }

    //Convert number in polar form to complex form.
    PtoC(num)
    {
        let result = {r: 0, i: 0};
        result.r = num.m * Math.cos(num.a);
        result.i = num.m * Math.sin(num.a);
        return result;
    }

    //Return the negative value of a phasor. Angles must be in radians.
    phasorNeg(num)
    {
        return this.phasorMult(num, {m: 1, a: Math.PI});
    }

    //Add 2 phasors. Angles must be in radians.
    phasorAdd(num1, num2)
    {
        return(this.CtoP(this.complexAdd(this.PtoC(num1), this.PtoC(num2))));
    }

    //Subtract 2 phasors. Angles must be in radians.
    phasorSub(num1, num2)
    {
        return(this.CtoP(this.complexSub(this.PtoC(num1), this.PtoC(num2))));
    }

    //Multiply 2 phasors. Angles must be in radians.
    phasorMult(num1, num2)
    {
        return(this.CtoP(this.complexMult(this.PtoC(num1), this.PtoC(num2))));
    }

    //Add 2 complex numbers.
    complexAdd(cnum1, cnum2)
    {
        let result = {r: 0, i: 0};
        result.r = cnum1.r + cnum2.r;
        result.i = cnum1.i + cnum2.i;
        return result;
    }

    //subtract 2 complex numbers.
    complexSub(cnum1, cnum2)
    {
        let result = {r: 0, i: 0};
        result.r = cnum1.r - cnum2.r;
        result.i = cnum1.i - cnum2.i;
        return result;
    }

    //Multiply 2 complex numbers.
    complexMult(cnum1, cnum2)
    {
        let result = {r: 0, i: 0};
        result.r = cnum1.r * cnum2.r - cnum1.i * cnum2.i;
        result.i = cnum1.r * cnum2.i + cnum1.i * cnum2.r;
        return result;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Graphing Functions                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    drawVector(angle, color, mag, text)
    {
        //Draw the main portion of the vector.
        this.drawLineAngle(angle, angle, color + "80", this.bodyWidth * .010, 0, mag);
        this.drawTextAngle(angle, mag, text, color, 0.1, .94);     

        //Draw the head of the vector.
        this.drawLineAngle(angle, angle - this.DtoR(5), color, this.bodyWidth * .010, mag, mag - this.bodyWidth * .020);
        this.drawLineAngle(angle, angle + this.DtoR(5), color, this.bodyWidth * .010, mag, mag - this.bodyWidth * .020);
    }

    //Draw lines in polar coordinates.
    drawLineAngle(angle1, angle2, color, width, rStart, rEnd)
    {
        this.ctxp.beginPath();
        this.ctxp.lineWidth = width;
        this.ctxp.strokeStyle = color;
        this.ctxp.moveTo(this.xMiddle + rStart * Math.cos(angle1), this.yMiddle - rStart * Math.sin(angle1));
        this.ctxp.lineTo(this.xMiddle + rEnd   * Math.cos(angle2), this.yMiddle - rEnd   * Math.sin(angle2));
        this.ctxp.stroke();
    }

    //Draw arcs in polar coordinates.
    drawArc(startAngle, endAngle, radius, color, width, isFill = false)
    {
        this.ctxp.beginPath();
        this.ctxp.lineWidth = width;
        this.ctxp.strokeStyle = color;
        this.ctxp.fillStyle = color;
        this.ctxp.arc(this.xMiddle, this.yMiddle, radius, startAngle, endAngle);
        isFill ? this.ctxp.fill() : this.ctxp.stroke();
    }

    //Draw text in polar coordinates.
    drawTextAngle(angle, mag, text, color, ratio, textRadius)
    {
        //Setup the text size and color.
        let textSize = this.yMiddle * ratio;
        this.ctxp.font = "bold " + textSize + "px Arial";
        this.ctxp.fillStyle = color;

        //Save original orientation.
        this.ctxp.save();
 
        //Move to the center fo the canvas.
        this.ctxp.translate(this.xMiddle, this.yMiddle);
        
        //Calculate the X and Y components of the vector.
        let x = mag * Math.cos(angle);
        let y = mag * Math.sin(angle);

        //Calculatethe X and Y components of the magnitude of the text.
        let textX = this.ctxp.measureText(text).width * Math.cos(angle);
        let textY = this.ctxp.measureText(text).width * Math.sin(angle);

        //Only take account text length in 1st and 3rd quadrants.
        if(angle > Math.PI/2 || angle < -Math.PI/2)
        {
            textX = 0;
            textY = 0;
        }

        //Offset text by text length, if necessary.
        this.ctxp.translate(x * textRadius - textX, -y * textRadius + textY);

        //Rotate canvas to align with the vector angle.
        this.ctxp.rotate(-angle);

        if(angle > Math.PI/2)this.ctxp.rotate(Math.PI);
        if(angle < -Math.PI/2)this.ctxp.rotate(-Math.PI);

        //Add the text to the canvas.
        this.ctxp.fillText(text, 0, 0);

        //Restore the original orientation before exiting.
        this.ctxp.restore(); 
    }

///////////////////////////////////////////////////////////////////////////////////////////////
//                                       Event Listeners                                     //
///////////////////////////////////////////////////////////////////////////////////////////////
    mouseMove(e)
    {
        //Get coordinates of mouse with respect to graph middle.
        let rect = e.target.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left - this.xMiddle;
        this.mouseY = -(e.clientY - rect.top - this.yMiddle);
        
        //Convert cartesian coordinates to polar coordinates.
        let mag = this.unitMag * Math.sqrt(this.mouseX**2 + this.mouseY**2);
        
        //Determine if we should show the mouse position in polar coordinates.
        this.drawCoords = (mag <= this.maxMag) ? true : false;
        this.bodyDraw();
    }

    doubleClick()
    {
        this.autoZoom();
        this.bodyDraw();
    }

    mouseWheel(e)
    {
        //Keep window from scrolling.
        e.preventDefault();

        //Zoom in/out.
        if(e.deltaY > 0) this.maxMag = this.maxMag * 1.1;
        if(e.deltaY < 0) this.maxMag = this.maxMag * 0.9;

        //Set min/max zoom.
        if(this.maxMag > Phasor.MAX_ZOOM) this.maxMag = Phasor.MAX_ZOOM;
        if(this.maxMag < Phasor.MIN_ZOOM) this.maxMag = Phasor.MIN_ZOOM;
        this.bodyDraw();
    }

    mouseLeave()
    {
        this.drawCoords = false;
        this.bodyDraw();
    }

///////////////////////////////////////////////////////////////////////////////////////////////
//                                      Update Functions                                     //
///////////////////////////////////////////////////////////////////////////////////////////////

    //Automatically calculate the correct zoom level.
    autoZoom()
    {
        let maxV = Phasor.MIN_ZOOM;

        //Find largest vector.
        for(let i = 0; i < this.vec.length; i++)
        {
            if(this.vec[i].m > maxV && this.vec[i].isVisible) maxV = this.vec[i].m;
        }

        //Limit the zoom size.
        if(maxV > Phasor.MAX_ZOOM) maxV = Phasor.MAX_ZOOM;
        this.maxMag = maxV;
        this.bodyDraw();
    }

    //Update which waveforms should be drawn.
    updateShow()
    {
    
     this.bodyDraw();
    }

    updateVectors()
    {
    
     this.bodyDraw();
    }

    updateZoom()
    {
    
    }
}
