class Phasor
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get VOLTS_PPEAK() {return .95}
    static get VOLTS_SPEAK() {return .80}
    static get V_VECTOR() {return 0}
    static get I_VECTOR() {return 1}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        canvasDiv,
        {
            vABColor  = "#ff0000",
            vBCColor  = "#00ff00",
            vCAColor  = "#0000ff",
            vpAColor  = "#800000",
            vpBColor  = "#008000",
            vpCColor  = "#000080",
            vpaColor  = "#800080",
            vpbColor  = "#808000",
            vpcColor  = "#008080",
            vabColor  = "#ff00ff",
            vbcColor  = "#dcdc00",
            vcaColor  = "#00dcdc",

            showvAB = true,
            showvBC = true,
            showvCA = true,
            showvpA = false,
            showvpB = false,
            showvpC = false,
            showvpa = false,
            showvpb = false,
            showvpc = false,
            showvab = true,
            showvbc = true,
            showvca = true
        } = {}
    )
    {
        //Waveform colors.
        this.vABColor = vABColor;
        this.vBCColor = vBCColor;
        this.vCAColor = vCAColor;
        this.vpAColor = vpAColor;
        this.vpBColor = vpBColor;
        this.vpCColor = vpCColor;
        this.vpaColor = vpaColor;
        this.vpbColor = vpbColor;
        this.vpcColor = vpcColor;
        this.vabColor = vabColor;
        this.vbcColor = vbcColor;
        this.vcaColor = vcaColor;
        
        //Which waveforms to show.
        this.showvAB = showvAB;
        this.showvBC = showvBC;
        this.showvCA = showvCA;
        this.showvpA = showvpA;
        this.showvpB = showvpB;
        this.showvpC = showvpC;
        this.showvpa = showvpa;
        this.showvpb = showvpb;
        this.showvpc = showvpc;
        this.showvab = showvab;
        this.showvbc = showvbc;
        this.showvca = showvca;

        //Context of the canvas.
        this.ctxp;

        //Height and width of the canvas.
        this.bodyWidth  = 400;
        this.bodyHeight = 400;
        this.yMiddle    = 200;
        this.xMiddle    = 200;

        //Drawing canvas.
        this.bodyCanvas = canvasDiv;

        //Storage space for vectors.
        this.vAB = {m: 480, a: this.DtoR(0)};
        this.vBC = {m: 480, a: this.DtoR(-120)};
        this.vCA = {m: 480, a: this.DtoR(120)};
        this.vpA = {m: 480, a: this.DtoR(0)};
        this.vpB = {m: 480, a: this.DtoR(-120)};
        this.vpC = {m: 480, a: this.DtoR(120)};
        this.vpa = {m: 120, a: this.DtoR(0)};
        this.vpb = {m: 120, a: this.DtoR(-120)};
        this.vpc = {m: 120, a: this.DtoR(120)};
        this.vab = {m: 208, a: this.DtoR(30)};
        this.vbc = {m: 208, a: this.DtoR(-90)};
        this.vca = {m: 208, a: this.DtoR(150)};

        //Only create level if the parent exists.
        if(this.parentDiv)this.bodyDraw();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    bodyDraw()
    {
        this.bodyWidth = this.bodyCanvas.getBoundingClientRect().width;
        this.bodyHeight = this.bodyCanvas.getBoundingClientRect().height;
        this.yMiddle = this.bodyHeight / 2;
        this. xMiddle = this.bodyWidth / 2;

        //Get 2D contexts of the canvas.
        this.ctxp = this.bodyCanvas.getContext("2d");

        //Clear the canvas.
        this.ctxp.beginPath();
        this.ctxp.fillStyle = "#ffffff00";
        this.ctxp.fillRect(0, 0, this.bodyWidth, this.bodyWidth)
        this.ctxp.stroke();
        
        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 5) return;

        //Draw the outer ring of the phasor.
        this.drawArc(0, 2 * Math.PI, this.yMiddle, "#ffffffff", this.bodyWidth * .005, true);
        this.drawArc(0, 2 * Math.PI, this.yMiddle * Phasor.VOLTS_PPEAK, "#00000010", this.bodyWidth * .005);
        this.drawArc(0, 2 * Math.PI, this.yMiddle * Phasor.VOLTS_SPEAK, "#00000010", this.bodyWidth * .005);

        //Draw lines representing standard angles.
        let thisAngle = 0;
        for(let x = 0; x < 12; x++)
        {
            this.drawLineAngle(thisAngle, thisAngle, "#00000010", this.bodyWidth * .005, 0, this.yMiddle);
            thisAngle += Math.PI / 6;
        }

        //Find the max magnitude of the displayable vectors.
        let pmax = 0;
        let smax = 0;
        if(this.showvAB && this.vAB.m > pmax) pmax = this.vAB.m
        if(this.showvBC && this.vBC.m > pmax) pmax = this.vBC.m
        if(this.showvCA && this.vCA.m > pmax) pmax = this.vCA.m
        if(this.showvpA && this.vpA.m > pmax) pmax = this.vpA.m
        if(this.showvpB && this.vpB.m > pmax) pmax = this.vpB.m
        if(this.showvpC && this.vpC.m > pmax) pmax = this.vpC.m
        
        if(this.showvpa && this.vpa.m > smax) smax = this.vpa.m
        if(this.showvpb && this.vpb.m > smax) smax = this.vpb.m
        if(this.showvpc && this.vpc.m > smax) smax = this.vpc.m
        if(this.showvab && this.vab.m > smax) smax = this.vab.m
        if(this.showvbc && this.vbc.m > smax) smax = this.vbc.m
        if(this.showvca && this.vca.m > smax) smax = this.vca.m

        //Calculate the amplitudes of the voltages.
        let vABAmp  = this.yMiddle * this.vAB.m  * Phasor.VOLTS_PPEAK / pmax;
        let vBCAmp  = this.yMiddle * this.vBC.m  * Phasor.VOLTS_PPEAK / pmax;
        let vCAAmp  = this.yMiddle * this.vCA.m  * Phasor.VOLTS_PPEAK / pmax;
        let vpAAmp  = this.yMiddle * this.vpA.m  * Phasor.VOLTS_PPEAK / pmax;
        let vpBAmp  = this.yMiddle * this.vpB.m  * Phasor.VOLTS_PPEAK / pmax;
        let vpCAmp  = this.yMiddle * this.vpC.m  * Phasor.VOLTS_PPEAK / pmax;
        
        let vpaAmp  = this.yMiddle * this.vpa.m  * Phasor.VOLTS_SPEAK / smax;
        let vpbAmp  = this.yMiddle * this.vpb.m  * Phasor.VOLTS_SPEAK / smax;
        let vpcAmp  = this.yMiddle * this.vpc.m  * Phasor.VOLTS_SPEAK / smax;
        let vabAmp  = this.yMiddle * this.vab.m  * Phasor.VOLTS_SPEAK / smax;
        let vbcAmp  = this.yMiddle * this.vbc.m  * Phasor.VOLTS_SPEAK / smax;
        let vcaAmp  = this.yMiddle * this.vca.m  * Phasor.VOLTS_SPEAK / smax;

        //Draw the voltage vectors.
        if(this.showvAB)this.drawVector(this.vAB.a, this.vABColor, vABAmp, Phasor.V_VECTOR, "VAB");
        if(this.showvBC)this.drawVector(this.vBC.a, this.vBCColor, vBCAmp, Phasor.V_VECTOR, "VBC");
        if(this.showvCA)this.drawVector(this.vCA.a, this.vCAColor, vCAAmp, Phasor.V_VECTOR, "VCA");
        if(this.showvpA)this.drawVector(this.vpA.a, this.vpAColor, vpAAmp, Phasor.V_VECTOR, "VθA");
        if(this.showvpB)this.drawVector(this.vpB.a, this.vpBColor, vpBAmp, Phasor.V_VECTOR, "VθB");
        if(this.showvpC)this.drawVector(this.vpC.a, this.vpCColor, vpCAmp, Phasor.V_VECTOR, "VθC");
        
        if(this.showvpa)this.drawVector(this.vpa.a, this.vpaColor, vpaAmp, Phasor.V_VECTOR, "Vθa");
        if(this.showvpb)this.drawVector(this.vpb.a, this.vpbColor, vpbAmp, Phasor.V_VECTOR, "Vθb");
        if(this.showvpc)this.drawVector(this.vpc.a, this.vpcColor, vpcAmp, Phasor.V_VECTOR, "Vθc");
        if(this.showvab)this.drawVector(this.vab.a, this.vabColor, vabAmp, Phasor.V_VECTOR, "Vab");
        if(this.showvbc)this.drawVector(this.vbc.a, this.vbcColor, vbcAmp, Phasor.V_VECTOR, "Vbc");
        if(this.showvca)this.drawVector(this.vca.a, this.vcaColor, vcaAmp, Phasor.V_VECTOR, "Vca");
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

    //Update which waveforms should be drawn.
    updateShow(showvAB, showvBC, showvCA, showvpA, showvpB, showvpC,
               showvpa, showvpb, showvpc, showvab, showvbc, showvca)
    {
        this.showvAB = showvAB;
        this.showvBC = showvBC;
        this.showvCA = showvCA;
        this.showvpA = showvpA;
        this.showvpB = showvpB;
        this.showvpC = showvpC;
        this.showvpa = showvpa;
        this.showvpb = showvpb;
        this.showvpc = showvpc;
        this.showvab = showvab;
        this.showvbc = showvbc;
        this.showvca = showvca;
        this.bodyDraw();
    }

    updateVectors(vAB, vBC, vCA, vpA, vpB, vpC, vpa, vpb, vpc, vab, vbc, vca)
    {
        this.vAB = vAB;
        this.vBC = vBC;
        this.vCA = vCA;
        this.vpA = vpA;
        this.vpB = vpB;
        this.vpC = vpC;
        this.vpa = vpa;
        this.vpb = vpb;
        this.vpc = vpc;
        this.vab = vab;
        this.vbc = vbc;
        this.vca = vca;
        this.bodyDraw();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Graphing Functions                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    drawVector(angle, color, mag, type, text)
    {
        //Draw the main portion of the vector.
        this.drawLineAngle(angle, angle, color+"80", this.bodyWidth * .010, 0, mag);
        this.drawTextAngle(angle, mag, text, color, 0.12, text.charAt(0) === "V" ? .80 : 0.90);     

        //Draw the head of the vector.
        if(type === Phasor.I_VECTOR)
        {
            
            this.ctxp.beginPath();
            this.ctxp.fillStyle = color;
            this.ctxp.moveTo(this.xMiddle + mag * Math.cos(angle), this.yMiddle - mag * Math.sin(angle));
            this.ctxp.lineTo(this.xMiddle + (mag - this.bodyWidth * .020) * Math.cos(angle + this.DtoR(-7)), 
                             this.yMiddle - (mag - this.bodyWidth * .020) * Math.sin(angle + this.DtoR(-7)));
            this.ctxp.lineTo(this.xMiddle + (mag - this.bodyWidth * .020) * Math.cos(angle + this.DtoR(7)), 
                             this.yMiddle - (mag - this.bodyWidth * .020) * Math.sin(angle + this.DtoR(7)));                 
            this.ctxp.fill();
        }
        else
        {
            this.drawLineAngle(angle, angle - this.DtoR(5), color, this.bodyWidth * .010, mag, mag - this.bodyWidth * .020);
            this.drawLineAngle(angle, angle + this.DtoR(5), color, this.bodyWidth * .010, mag, mag - this.bodyWidth * .020);
        }
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
        var textSize = this.yMiddle * ratio;
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
}