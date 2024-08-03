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
        canvasDiv, callback, zoomCallback,
        {
            vec =
            [
                //Unbalanced system.
                {m: 1, a: 0,                color: "#ff0000", isVisible: true},
                {m: 1, a: -2 * Math.PI / 3, color: "#00ff00", isVisible: true},
                {m: 1, a: 2 * Math.PI / 3,  color: "#0000ff", isVisible: true},

                //Positive sequence.
                {m: 1, a: 0,                color: "#800000", isVisible: false},
                {m: 1, a: -2 * Math.PI / 3, color: "#008000", isVisible: false},
                {m: 1, a: 2 * Math.PI / 3,  color: "#000080", isVisible: false},

                //Negative sequence.
                {m: 0, a: 0, color: "#800080", isVisible: false},
                {m: 0, a: 0, color: "#608000", isVisible: false},
                {m: 0, a: 0, color: "#008080", isVisible: false},

                //Zero sequence.
                {m: 0, a: 0, color: "#404040", isVisible: false}
            ],

            showComp = false
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
        this.isGrabbed = false;

        //Drawing canvas.
        this.bodyCanvas = canvasDiv;

        //Callback function for vector updates.
        this.callback = callback;
        this.zoomCallback = zoomCallback;

        //Show component vectors.
        this.showComp = showComp;

        //Mouse events.
        this.bodyCanvas.onmousemove  = (e) => this.mouseMove(e);
        this.bodyCanvas.ondblclick   = ()  => this.doubleClick();
        this.bodyCanvas.onwheel      = (e) => this.mouseWheel(e);
        this.bodyCanvas.onmouseleave = ()  => this.mouseLeave();
        this.bodyCanvas.onmousedown  = (e) => this.mouseDown(e);
        this.bodyCanvas.onmouseup    = (e) => this.mouseUp(e);

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

        //Draw primary vectors.
        for(let i = 0; i < 3; i++)
        {
            let mag = this.vec[i].m;
            let angle = this.RtoD(this.vec[i].a);
            let magText = mag.toFixed(0);

            //Adjusrt the precision based on how big or small the magnitude is.
            if(mag < 10) magText = mag.toFixed(1);
            if(mag < 1)  magText = mag.toFixed(2);
            if(mag < .1) magText = mag.toFixed(3);

            //Remove any leading zeroes.
            if(magText.charAt(0) === '0') magText = magText.slice(1);

            let text = magText + "∠" + angle.toFixed(1) + "°";
            let isBold = false;

            if(this.vec[i].isVisible)
            {
                //Check if current vector is being hovered over by the mouse.
                if(this.isMoveable && this.moveableIndex === i) isBold = true;
                else isBold = false;

                //Determine is phasor values need to be shown.
                if(this.vec[i].m / this.maxMag < .50) text ="";

                //Draw the phasor.
                this.drawVector(this.vec[i].a, this.vec[i].color, this.vec[i].m / this.unitMag, text, isBold);
            }
        }

        if(this.showComp)
        {
            this.drawPhaseComps(3);
            this.drawPhaseComps(4);
            this.drawPhaseComps(5);
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

        //Clear an area for the legend.
        this.ctxp.beginPath();
        this.ctxp.fillStyle = "#ffffff";
        this.ctxp.fillRect(this.bodyWidth * .8, this.bodyWidth * .92, this.bodyWidth * .19, this.bodyWidth * .1)
        this.ctxp.stroke();

        //Setup the text size and color.
        let textSize = this.bodyWidth * .08;
        this.ctxp.font = "bold " + textSize + "px Arial";
        this.ctxp.fillStyle = this.vec[0].color;
        this.ctxp.fillText("A", this.bodyWidth - this.bodyWidth * .195, this.bodyWidth - this.bodyWidth * .01);
        this.ctxp.fillStyle = this.vec[1].color;
        this.ctxp.fillText("B", this.bodyWidth - this.bodyWidth * .135, this.bodyWidth - this.bodyWidth * .01);
        this.ctxp.fillStyle = this.vec[2].color;
        this.ctxp.fillText("C", this.bodyWidth - this.bodyWidth * .075, this.bodyWidth - this.bodyWidth * .01);
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

    drawVector(angle, color, mag, text, isBold = false)
    {
        //Set line width.
        let lineWidth = isBold ? .015 : .010;

        //Draw the main portion of the vector.
        this.drawLineAngle(angle, angle, color + "80", this.bodyWidth * lineWidth, 0, mag);
        this.drawTextAngle(angle, mag, text, color, 0.1, .94);     

        //Draw the head of the vector.
        this.drawLineAngle(angle, angle - this.DtoR(5), color + "80", this.bodyWidth * lineWidth, mag, mag - this.bodyWidth * .020);
        this.drawLineAngle(angle, angle + this.DtoR(5), color + "80", this.bodyWidth * lineWidth, mag, mag - this.bodyWidth * .020);
    }

    drawComp(angle, color, mag, offsetX, offsetY)
    {
        this.drawLineAngle(angle, angle, color + "80", this.bodyWidth * .007, 0, mag, offsetX, offsetY);
    }

    //Draw lines in polar coordinates.
    drawLineAngle(angle1, angle2, color, width, rStart, rEnd, offsetX = 0, offsetY = 0)
    {
        this.ctxp.beginPath();
        this.ctxp.lineWidth = width;
        this.ctxp.strokeStyle = color;
        this.ctxp.moveTo(this.xMiddle + offsetX + rStart * Math.cos(angle1), this.yMiddle - offsetY - rStart * Math.sin(angle1));
        this.ctxp.lineTo(this.xMiddle + offsetX  + rEnd * Math.cos(angle2), this.yMiddle - offsetY - rEnd * Math.sin(angle2));
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
        let ang = Math.atan2(this.mouseY, this.mouseX);
        
        //Determine if we should show the mouse position in polar coordinates.
        this.drawCoords = (mag <= this.maxMag) ? true : false;
        if(this.isGrabbed && mag > this.maxMag)this.isGrabbed = false;

        //Check if the cursor is near a vector. Only the first 3 vectors.
        if(!this.isGrabbed)
        {
            for(let i = 0; i < 3; i++)
            {
                let vecMag = this.vec[i].m;
                let vecAng = this.vec[i].a;
        
                let difAng = Math.abs(ang - vecAng);
                if(mag <= vecMag && this.RtoD(difAng) <= 3 && this.vec[i].isVisible)
                {
                    this.isMoveable = true;
                    this.moveableIndex = i;
                    this.bodyCanvas.style.cursor = "grab";
                    break;
                }
                else
                {
                    this.isMoveable = false;
                    this.moveableIndex = -1;
                    this.bodyCanvas.style.cursor = "";
                }
            }
        }
        
        //Update the vector if it is being dragged.
        if(this.isGrabbed)
        {
            //console.log(this.moveableIndex)
            this.vec[this.moveableIndex].a = ang;
            this.vec[this.moveableIndex].m = mag;
            this.callback(this.moveableIndex);
        }

        this.bodyDraw();
    }

    doubleClick()
    {
        this.autoZoom();
        this.bodyDraw();
        this.zoomCallback(this.maxMag);
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
        this.zoomCallback(this.maxMag);
    }

    mouseLeave()
    {
        this.drawCoords = false;
        this.isGrabbed = false;
        this.bodyDraw();
    }

    mouseDown(e)
    {
        if(e.buttons !== 1)  return;
        if(!this.isMoveable) return;
        
        this.bodyCanvas.style.cursor = "grabbing";
        this.isGrabbed = true;

        //Get coordinates of mouse with respect to graph middle.
        let rect = e.target.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left - this.xMiddle;
        this.mouseY = -(e.clientY - rect.top - this.yMiddle);
        
        //Convert cartesian coordinates to polar coordinates.
        let mag = this.unitMag * Math.sqrt(this.mouseX**2 + this.mouseY**2);
        let ang = Math.atan2(this.mouseY, this.mouseX);

        this.vec[this.moveableIndex].a = ang;
        this.vec[this.moveableIndex].m = mag;
        this.callback(this.moveableIndex);

        this.bodyDraw();
    }

    mouseUp(e)
    {
        if(this.bodyCanvas.style.cursor === "grabbing")this.bodyCanvas.style.cursor = "grab";
        this.isGrabbed = false;
    }

///////////////////////////////////////////////////////////////////////////////////////////////
//                                      Update Functions                                     //
///////////////////////////////////////////////////////////////////////////////////////////////

    //Automatically calculate the correct zoom level.
    autoZoom()
    {
        let maxV = Phasor.MIN_ZOOM;

        //Find largest primary vector.
        for(let i = 0; i < this.vec.length; i++)
        {
            if(this.vec[i].m > maxV && this.vec[i].isVisible) maxV = this.vec[i].m;
        }

        //magnitude of positive and negative sequences added together can be geater than any single vector.
        if(this.showComp)
        {
            for(let i = 3; i < 6; i++)
            {
                let offset = this.phasorAdd(this.vec[i], this.vec[i+3]).m;
                if(offset > maxV) maxV = offset;
            }
        }

        //Limit the zoom size.
        if(maxV > Phasor.MAX_ZOOM) maxV = Phasor.MAX_ZOOM;
        this.maxMag = maxV;
        this.bodyDraw();
    }

    //Draw the component vectors.
    drawPhaseComps(index)
    {
        let offsetX = 0;
        let offsetY = 0;
        this.drawComp(this.vec[index].a, this.vec[index].color, this.vec[index].m / this.unitMag, offsetX, offsetY);
        offsetX = this.vec[index].m / this.unitMag * Math.cos(this.vec[index].a);
        offsetY = this.vec[index].m / this.unitMag * Math.sin(this.vec[index].a);
        this.drawComp(this.vec[index+3].a, this.vec[index+3].color, this.vec[index+3].m / this.unitMag, offsetX, offsetY);
        offsetX += this.vec[index+3].m / this.unitMag * Math.cos(this.vec[index+3].a);
        offsetY += this.vec[index+3].m / this.unitMag * Math.sin(this.vec[index+3].a);
        this.drawComp(this.vec[9].a, this.vec[9].color, this.vec[9].m / this.unitMag, offsetX, offsetY);
    }

    //Hide/show component vectors.
    setShowComp(isShown)
    {
        if(isShown)
        {
            this.showComp = true;
            for(let i = 3; i < this.vec.length; i++)
            {
                this.vec[i].isVisible = true;
            }
        }
        else
        {
            this.showComp = false;
            for(let i = 3; i < this.vec.length; i++)
            {
                this.vec[i].isVisible = false;
            }
        }
    }
}
