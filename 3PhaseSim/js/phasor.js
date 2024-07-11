class Phasor
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get VOLTS_PEAK() {return .95}
    static get AMPS_PEAK() {return .75}
    static get V_VECTOR() {return 0}
    static get I_VECTOR() {return 1}

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
        INeut,
        {
            vaColor  = "#ff0000",
            vbColor  = "#00ff00",
            vcColor  = "#0000ff",
            iaColor  = "#770000",
            ibColor  = "#007700",
            icColor  = "#000077",
            vabColor = "#aa00aa",
            vbcColor = "#aaaa00",
            vcaColor = "#00aaaa",
            inColor  = "#8b8b8b",
            showVA   = true,
            showVB   = true,
            showVC   = true,
            showIA   = true,
            showIB   = true,
            showIC   = true,
            showVAB  = true,
            showVBC  = true,
            showVCA  = true,
            showIN   = true,
            type     = "wye"
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
        this.INeut = INeut;
        this.type  = type;

        //Waveform colors.
        this.vaColor  = vaColor;
        this.vbColor  = vbColor;
        this.vcColor  = vcColor;
        this.iaColor  = iaColor;
        this.ibColor  = ibColor;
        this.icColor  = icColor;
        this.vabColor = vabColor;
        this.vbcColor = vbcColor;
        this.vcaColor = vcaColor;
        this.inColor  = inColor;

        //Which waveforms to show.
        this.showVA  = showVA;
        this.showVB  = showVB;
        this.showVC  = showVC;
        this.showIA  = showIA;
        this.showIB  = showIB;
        this.showIC  = showIC;
        this.showVAB = showVAB;
        this.showVBC = showVBC;
        this.showVCA = showVCA;
        this.showIN  = showIN;

        //Context of the canvas.
        this.ctxp;

        //Height and width of the canvas.
        this.bodyWidth  = 400;
        this.bodyHeight = 400;
        this.yMiddle    = 200;
        this.xMiddle    = 200;

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
        this.ctxp = this.bodyCanvas.getContext("2d");

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

        //Calculate the center of the canvas.
        this.yMiddle = this.bodyHeight / 2;
        this.xMiddle = this.bodyWidth / 2;
        this.radius  = this.bodyWidth * .48;
        this.bodyDraw();
    }

    bodyDraw()
    {
        //Clear the canvas.
        this.ctxp.beginPath();
        this.ctxp.fillStyle = "#ffffff00";
        this.ctxp.fillRect(0, 0, this.bodyWidth, this.bodyWidth)
        this.ctxp.stroke();
        
        //Make sure the calculations can't go negative.
        if(this.bodyWidth < 5) return;

        //Draw the outer ring of the phasor.
        this.drawArc(0, 2 * Math.PI, this.radius * 1.025, "#ffffffff", this.bodyWidth * .005, true);
        this.drawArc(0, 2 * Math.PI, this.radius * Phasor.AMPS_PEAK, "#00000010", this.bodyWidth * .005);
        this.drawArc(0, 2 * Math.PI, this.radius, "#00000010", this.bodyWidth * .005);

        //Draw lines representing standard angles.
        let thisAngle = 0;
        for(let x = 0; x < 12; x++)
        {
            this.drawLineAngle(thisAngle, thisAngle, "#00000010", this.bodyWidth * .005, 0, this.radius);
            thisAngle += Math.PI / 6;
        }

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
        
        //Wye calculations.
        if(this.type === "wye")
        {
            //Calculate the neutral/ground current.
            let iax = ia * Math.cos(this.DtoR(iap));
            let iay = ia * Math.sin(this.DtoR(iap));
            let ibx = ib * Math.cos(this.DtoR(ibp));
            let iby = ib * Math.sin(this.DtoR(ibp));
            let icx = ic * Math.cos(this.DtoR(icp));
            let icy = ic * Math.sin(this.DtoR(icp));

            let ineutx = iax + ibx + icx;
            let ineuty = iay + iby + icy;
            let ineut  = Math.sqrt(ineutx**2 + ineuty**2).toFixed(2);
            let inp    = Math.atan2(ineuty, -ineutx);

            //Calculate the phase to phase voltage vectors.
            let vax = (va * Math.cos(this.DtoR(vap)));
            let vay = (va * Math.sin(this.DtoR(vap)));
            let vbx = (vb * Math.cos(this.DtoR(vbp)));
            let vby = (vb * Math.sin(this.DtoR(vbp)));
            let vcx = (vc * Math.cos(this.DtoR(vcp)));
            let vcy = (vc * Math.sin(this.DtoR(vcp)));

            //Translate the vectors to the origin.
            let vabx = vax - vbx;
            let vaby = vay - vby;
            let vbcx = vbx - vcx;
            let vbcy = vby - vcy;
            let vcax = vcx - vax;
            let vcay = vcy - vay;

            //Calculate the vector magnitudes.
            let vab = Math.sqrt(vabx**2 + vaby**2);
            let vbc = Math.sqrt(vbcx**2 + vbcy**2);
            let vca = Math.sqrt(vcax**2 + vcay**2);

            //Calculate the vector angles.
            let pab = -Math.atan2(vaby, vabx);
            let pbc = -Math.atan2(vbcy, vbcx);
            let pca = -Math.atan2(vcay, vcax);

            //Convert line voltage and current angles to radians.
            vap = -this.DtoR(vap);
            vbp = -this.DtoR(vbp);
            vcp = -this.DtoR(vcp);
            iap = -this.DtoR(iap);
            ibp = -this.DtoR(ibp);
            icp = -this.DtoR(icp);

            //Find the maximum enabled voltage and current.
            let maxV = 0;
            let maxI = 0;
            if(va    > maxV && this.showVA)  maxV = va;
            if(vb    > maxV && this.showVB)  maxV = vb;
            if(vc    > maxV && this.showVC)  maxV = vc;
            if(vab   > maxV && this.showVAB) maxV = vab;
            if(vbc   > maxV && this.showVBC) maxV = vbc;
            if(vca   > maxV && this.showVCA) maxV = vca;
            if(ia    > maxI && this.showIA)  maxI = ia;
            if(ib    > maxI && this.showIB)  maxI = ib;
            if(ic    > maxI && this.showIC)  maxI = ic;
            if(ineut > maxI && this.showIN)  maxI = ineut;

            //Calculate the amplitudes of the waveforms.
            let vaAmplitude  = this.yMiddle * va    * Phasor.VOLTS_PEAK / maxV;
            let vbAmplitude  = this.yMiddle * vb    * Phasor.VOLTS_PEAK / maxV;
            let vcAmplitude  = this.yMiddle * vc    * Phasor.VOLTS_PEAK / maxV;
            let vabAmplitude = this.yMiddle * vab   * Phasor.VOLTS_PEAK / maxV;
            let vbcAmplitude = this.yMiddle * vbc   * Phasor.VOLTS_PEAK / maxV;
            let vcaAmplitude = this.yMiddle * vca   * Phasor.VOLTS_PEAK / maxV;
            let iaAmplitude  = this.yMiddle * ia    * Phasor.AMPS_PEAK  / maxI;
            let ibAmplitude  = this.yMiddle * ib    * Phasor.AMPS_PEAK  / maxI;
            let icAmplitude  = this.yMiddle * ic    * Phasor.AMPS_PEAK  / maxI;
            let inAmplitude  = this.yMiddle * ineut * Phasor.AMPS_PEAK  / maxI;

            //Draw the vectors.
            if(this.showVAB)this.drawVector(pab, this.vabColor, vabAmplitude, Phasor.V_VECTOR, "VAB", 10, vabAmplitude / this.yMiddle);
            if(this.showVBC)this.drawVector(pbc, this.vbcColor, vbcAmplitude, Phasor.V_VECTOR, "VBC", 10, vbcAmplitude / this.yMiddle);
            if(this.showVCA)this.drawVector(pca, this.vcaColor, vcaAmplitude, Phasor.V_VECTOR, "VCA", 10, vcaAmplitude / this.yMiddle);
            if(this.showVA)this.drawVector(vap, this.vaColor, vaAmplitude, Phasor.V_VECTOR, "VA", 10, vaAmplitude / this.yMiddle);
            if(this.showVB)this.drawVector(vbp, this.vbColor, vbAmplitude, Phasor.V_VECTOR, "VB", 10, vbAmplitude / this.yMiddle);
            if(this.showVC)this.drawVector(vcp, this.vcColor, vcAmplitude, Phasor.V_VECTOR, "VC", 10, vcAmplitude / this.yMiddle);
            if(this.showIA)this.drawVector(iap, this.iaColor, iaAmplitude, Phasor.I_VECTOR, "IA", -10, iaAmplitude / this.yMiddle);
            if(this.showIB)this.drawVector(ibp, this.ibColor, ibAmplitude, Phasor.I_VECTOR, "IB", -10, ibAmplitude / this.yMiddle);
            if(this.showIC)this.drawVector(icp, this.icColor, icAmplitude, Phasor.I_VECTOR, "IC", -10, icAmplitude / this.yMiddle);
            if(this.showIN)this.drawVector(inp, this.inColor, inAmplitude, Phasor.I_VECTOR, "IN", -10, inAmplitude / this.yMiddle);
        }

        //Delta calculations.
        else
        {
            //We need to calculate the phase voltages from the line voltages. The technique of symmetrical
            //components will be used. The theory and implementation will be shown here. Mostly from Wikipedia.
            //
            //The method of symmetrical components simplifies analysis of unbalanced three-phase power systems.
            //The basic idea is that an asymmetrical set of N phasors can be expressed as a linear combination
            //of N symmetrical sets of phasors by means of a complex linear transformation.
            //The analysis is broken down into the positive sequence, negative sequence, and zero sequence.
            //
            //A vector for three phase voltages can be expressed as follows:
            //           | Va |
            //    Vacb = | Vb |
            //           | Vc |
            //
            //Decomposing the vector into three symmetrical components gives:
            //    | Va |   | Va0 |   | Va1 |   | Va2 |
            //    | Vb | = | Vb0 | + | Vb1 | + | Vb2 |
            //    | Vc |   | Vc0 |   | Vc1 |   | Vc2 |
            //where the subscripts 0, 1, and 2 refer respectively to the zero, positive, and negative sequence
            //components. The sequence components differ only by their phase angles, which are symmetrical and
            //so are 2/3π radians or 120°.
            //
            //A phasor rotation operator will be defined and represented as α, which rotates a phasor vector
            //counterclockwise by 120 degrees when multiplied by it:
            //    α = e^(2/3π)i
            //
            //Phasor properties of α:
            //    α = 1∠120°, α^2 = 1∠240° or 1∠-120°, α^3 = 1∠0°
            //
            //The voltage vectors have the following sequence components for a clockwise system:
            //    Van = V0 + V1 + V2
            //    Vbn = V0 + α^2V1 + αV2
            //    Vcn = V0 + αV1 + α^2V2
            //    Vab = Va - Vb = V0 + V1 + V2 -(V0 + α^2V1 + αV2)
            //    Vbc = Vb - Vc = V0 + α^2V1 + αV2 -(V0 + αV1 + α^2V2)
            //    Vca = Vc - Va = V0 + αV1 + α^2V2 -(V0 + V1 + V2)
            //
            //The line voltage equations reduce as follows. Note V0 cancels out of the equations:
            //    Vab = V1(1 - α^2) + V2(1 - α)
            //    Vbc = V1(α^2 - α) + V2(α - α^2)
            //    Vca = V1(α - 1) + V2(α^2 - 1)
            //
            //We need to reduce the equations down to 2 equations so we can have a square matrix to
            //solve for V1 and V2 as follows:
            //    Vab - Vbc = V1(1 - α^2) + V2(1 - α) -[V1(α^2 - α) + V2(α - α^2)]
            //    Vbc - Vca = V1(α^2 - α) + V2(α - α^2) -[V1(α - 1) + V2(α^2 - 1)]
            //
            //Reducing the equations gives the following:
            //    Vab - Vbc = V1(1 - 2α^2 + α) + V2(1 - 2α + α^2)
            //    Vbc - Vca = V1(α^2 - 2α + 1) + V2(α - 2α^2 + 1)
            //
            //The previous equations can be converted to the following matrix form:
            //    | 1-2α^2+α  1-2α+α^2 | | V1 | = | Vab-Vbc |
            //    | α^2-2α+1  α-2α^2+1 | | V2 |   | Vbc-Vca |
            //
            //The left matrix can be rewritten in polar form:
            //    A = | 1∠0°-2∠-120°+1∠120°  1∠0°-2∠120°+1∠-120° |
            //        | 1∠-120°-2∠120°+1∠0°  1∠120°-2∠-120°+1∠0° |
            //
            //Reducing the matrix gives us the following polar and complex forms:
            //    A = | 3∠60°   3∠-60° | = | 3(.5+j.8660)  3(.5-j.8660) |
            //        | 3∠-60°  3∠60°  |   | 3(.5-j.8660)  3(.5+j.8660) |
            //
            //The inverse of the matrix gives us the following polar and complex forms:
            //    A^-1 = | .19246∠-30°  .19246∠30°  | = | .16667-j.09623  .16667+j.09623 |
            //           | .19246∠30°   .19246∠-30° |   | .16667+j.09623  .16667-j.09623 |
            //
            //We can now finally solve for V1 and V2 with the following equation:
            //    | .16667-j.09623  .16667+j.09623 | | Vab - Vbc | = | V1 |
            //    | .16667+j.09623  .16667-j.09623 | | Vbc - Vac | = | V2 |
            //

            

        }   
    }

    //Convert degrees into radians.
    DtoR(degrees)
    {
        return degrees * Math.PI / 180;
    }

    //Add 2 complex numbers.
    complexAdd(cnum1, cnum2)
    {
        let result = {r: 0, i: 0};
        result.r = cnum1.r + cnum2.r;
        result.i = cnum1.i + cnum2.i;
        return result;
    }

    //Multiply 2 complex numbers.
    complexMult({re, im})
    {

    }

    //Update which waveforms should be drawn.
    updateShow(va = true, vb = true, vc = true, ia = true, ib = true, ic = true,
               vab = true, vbc = true, vca = true, ineut = true, type = "wye")
    {
        this.showVA  = va;
        this.showVB  = vb;
        this.showVC  = vc;
        this.showIA  = ia;
        this.showIB  = ib;
        this.showIC  = ic;
        this.showVAB = vab;
        this.showVBC = vbc;
        this.showVCA = vca;
        this.showIN  = ineut;
        this.type    = type;
        this.resize();
    }

    drawVector(angle, color, mag, type, text, textDegrees, ratio)
    {
        //Draw the main portion of the vector.
        this.drawLineAngle(angle, angle, color, this.bodyWidth * .010, 0, mag);
        this.drawTextAngle(angle - this.DtoR(textDegrees), text, color, 0.10, ratio * .95);     

        //Draw the head of the vector.
        if(type === Phasor.I_VECTOR)
        {
            
            this.ctxp.beginPath();
            this.ctxp.fillStyle = color;
            this.ctxp.moveTo(this.xMiddle + mag * Math.cos(angle), this.yMiddle + mag * Math.sin(angle));
            this.ctxp.lineTo(this.xMiddle + (mag - this.bodyWidth * .020) * Math.cos(angle + this.DtoR(-7)), 
                             this.yMiddle + (mag - this.bodyWidth * .020) * Math.sin(angle + this.DtoR(-7)));
            this.ctxp.lineTo(this.xMiddle + (mag - this.bodyWidth * .020) * Math.cos(angle + this.DtoR(7)), 
                             this.yMiddle + (mag - this.bodyWidth * .020) * Math.sin(angle + this.DtoR(7)));                 
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
        this.ctxp.moveTo(this.xMiddle + rStart * Math.cos(angle1), this.yMiddle + rStart * Math.sin(angle1));
        this.ctxp.lineTo(this.xMiddle + rEnd   * Math.cos(angle2), this.yMiddle + rEnd   * Math.sin(angle2));
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
    drawTextAngle(angle, text, color, ratio, textRadius)
    {
        var textSize = this.radius * ratio;
        this.ctxp.font = textSize + "px Arial";
        this.ctxp.fillStyle = color;
        this.ctxp.fillText(text, this.yMiddle - (textSize * .8) + 
                                this.radius * textRadius * Math.cos(angle) + this.bodyWidth * .02, 
                                this.yMiddle + (textSize * .2) +
                                this.radius * textRadius * Math.sin(angle) + this.bodyWidth * .015);   
    }
}