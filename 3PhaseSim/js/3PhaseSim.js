//Get access to the page elements.
let header   = document.getElementById("header");
let footer   = document.getElementById("sticky-footer");
let VAText   = document.getElementById("van-text");
let VBText   = document.getElementById("vbn-text");
let VCText   = document.getElementById("vcn-text");
let IAText   = document.getElementById("ia-text");
let IBText   = document.getElementById("ib-text");
let ICText   = document.getElementById("ic-text");
let VASlider = document.getElementById("van-slider");
let VBSlider = document.getElementById("vbn-slider");
let VCSlider = document.getElementById("vcn-slider");
let IASlider = document.getElementById("ia-slider");
let IBSlider = document.getElementById("ib-slider");
let ICSlider = document.getElementById("ic-slider");
let VAPhase  = document.getElementById("van-phase");
let VBPhase  = document.getElementById("vbn-phase");
let VCPhase  = document.getElementById("vcn-phase");
let IAPhase  = document.getElementById("ia-phase");
let IBPhase  = document.getElementById("ib-phase");
let ICPhase  = document.getElementById("ic-phase");
let VAChk    = document.getElementById("ch-va");
let VBChk    = document.getElementById("ch-vb");
let VCChk    = document.getElementById("ch-vc");
let IAChk    = document.getElementById("ch-ia");
let IBChk    = document.getElementById("ch-ib");
let ICChk    = document.getElementById("ch-ic");
let INChk    = document.getElementById("ch-in");
let CycText  = document.getElementById("cyc-text");
let aPower   = document.getElementById("a-power");
let bPower   = document.getElementById("b-power");
let cPower   = document.getElementById("c-power");
let tPower   = document.getElementById("total-power");
let VABChk   = document.getElementById("ch-vab");
let VBCChk   = document.getElementById("ch-vbc");
let VCAChk   = document.getElementById("ch-vca");
let rightCol = document.getElementById("right-column");
let mainBody = document.getElementById("main-body");
let derived  = document.getElementById("derived-values");
let delta    = document.getElementById("delta");
let wye      = document.getElementById("wye");

//Elements that change when changing between delta and wye calculation styles.
let voltDesc = document.getElementById("volt-desc");
let vaDesc   = document.getElementById("va-desc");
let vbDesc   = document.getElementById("vb-desc");
let vcDesc   = document.getElementById("vc-desc");
let achk     = document.getElementById("va-ch");
let bchk     = document.getElementById("vb-ch");
let cchk     = document.getElementById("vc-ch");
let achk2    = document.getElementById("va-ch2");
let bchk2    = document.getElementById("vb-ch2");
let cchk2    = document.getElementById("vc-ch2");
let nchk     = document.getElementById("in-ch");

//Hold checkboxes and text.
let holdText  = document.getElementById("hold-text");
let aHoldSpan = document.getElementById("ahold-span")
let bHoldSpan = document.getElementById("bhold-span");
let cHoldSpan = document.getElementById("chold-span");
let aHold     = document.getElementById("ahold");
let bHold     = document.getElementById("bhold");
let cHold     = document.getElementById("chold");

//Symmetrical components.
let compRow  = document.getElementById("comp-row");
let V0mag    = document.getElementById("v0mag-text");
let V0phs    = document.getElementById("v0phs-text");
let V1V2Txt  = document.getElementById("V1V2-text");
let advanced = document.getElementById("advanced");
let advSpan  = document.getElementById("adv-span");

//Variable for detecting if new calculation style is selected.
let DYStyle = "wye";

let waveWindow = document.getElementById("wave-window");
let wf = new Waveform
(
    waveWindow, VAText, VBText, VCText, IAText, IBText, ICText,
    VAPhase, VBPhase, VCPhase, IAPhase, IBPhase, ICPhase
);

let phasorWindow = document.getElementById("phasor-window");
let phasor = new Phasor
(
    phasorWindow, VAText, VBText, VCText, IAText, IBText, ICText,
    VAPhase, VBPhase, VCPhase, IAPhase, IBPhase, ICPhase, V0mag, V0phs
);

//Set last valid number for text box error checking.
let lastVAN     = 277;
let lastVBN     = 277;
let lastVCN     = 277;
let lastVAPhase = 0;
let lastVBPhase = -120;
let lastVCPhase = 120;
let lastIA      = 200;
let lastIB      = 200;
let lastIC      = 200;
let lastIAPhase = 0;
let lastIBPhase = -120;
let lastICPhase = 120;
let lastCycles  = 1.5;
let lastV0mag   = 0;
let lastV0phs   = 0;

//Recalculate the size of things after resize.
window.addEventListener("resize", () => 
{
    let headerHeight = header.clientHeight;
    let footerHeight = footer.clientHeight;
    waveWindow.style.height = window.innerHeight - waveWindow.offsetTop - headerHeight - footerHeight -10 + "px";

    let rightWidth   = rightCol.clientWidth;
    let computedStyle = getComputedStyle(rightCol);
    rightWidth -= (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight));
    let rightHeight = window.innerHeight - phasorWindow.offsetTop - headerHeight - footerHeight -10;

    if(mainBody.clientWidth < 769)
    {
        phasorWindow.style.height = Math.max(rightHeight, rightWidth) + "px";
        phasorWindow.style.width = Math.max(rightHeight, rightWidth)  + "px"; 
    }
    else
    {
        phasorWindow.style.height = Math.min(rightHeight, rightWidth) + "px";
        phasorWindow.style.width = Math.min(rightHeight, rightWidth)  + "px"; 
    }
    wf.resize();
    phasor.resize();
});

//Add listeners to radio buttons.
delta.onclick = () =>
{
    if(DYStyle === "delta")return;

    DYStyle = "delta";

    //Change all the text on the page.
    voltDesc.innerHTML = "Line-to-Line Voltage";
    vaDesc.innerHTML   = "VAB: ";
    vbDesc.innerHTML   = "VBC: ";
    vcDesc.innerHTML   = "VCA: ";
    VASlider.value     = 0;
    VAPhase.value      = 0;
    VBSlider.value     = -120;
    VBPhase.value      = -120;
    VCSlider.value     = 120;
    VCPhase.value      = 120;
    VAText.value       = 480;
    VBText.value       = 480;
    VCText.value       = 480;
    IASlider.value     = -30;
    IAPhase.value      = -30;
    IBSlider.value     = -150;
    IBPhase.value      = -150;
    ICSlider.value     = 90;
    ICPhase.value      = 90;
    IAText.value       = 200;
    IBText.value       = 200;
    ICText.value       = 200;
    CycText.value      = 1.5;
    achk.innerHTML     = " VAB";
    bchk.innerHTML     = " VBC";
    cchk.innerHTML     = " VCA";
    achk2.innerHTML    = " VAG";
    bchk2.innerHTML    = " VBG";
    cchk2.innerHTML    = " VCG";
    nchk.innerHTML     = " IG";
    VAChk.checked      = true;
    VBChk.checked      = true;
    VCChk.checked      = true;
    IAChk.checked      = true;
    IBChk.checked      = true;
    ICChk.checked      = true;
    VABChk.checked     = true;
    VBCChk.checked     = true;
    VCAChk.checked     = true;
    INChk.checked      = true;
    aHoldSpan.hidden   = false;
    bHoldSpan.hidden   = false;
    cHoldSpan.hidden   = false;
    holdText.hidden    = false;
    advSpan.hidden     = false;
    advanced.checked   = false;
    resizeCanvasParents();
    GFXUpdate();
    updatePower();
    wf.resize();
    phasor.resize();
}

wye.onclick = () =>
{
    if(DYStyle === "wye")return;

    DYStyle = "wye";

    //Change all the text on the page.
    voltDesc.innerHTML = "Line-to-Neutral Voltage";
    vaDesc.innerHTML   = "VAN: ";
    vbDesc.innerHTML   = "VBN: ";
    vcDesc.innerHTML   = "VCN: ";
    VASlider.value     = 0;
    VAPhase.value      = 0;
    VBSlider.value     = -120;
    VBPhase.value      = -120;
    VCSlider.value     = 120;
    VCPhase.value      = 120;
    VAText.value       = 277;
    VBText.value       = 277;
    VCText.value       = 277;
    IASlider.value     = 0;
    IAPhase.value      = 0;
    IBSlider.value     = -120;
    IBPhase.value      = -120;
    ICSlider.value     = 120;
    ICPhase.value      = 120;
    IAText.value       = 200;
    IBText.value       = 200;
    ICText.value       = 200;
    CycText.value      = 1.5;
    achk.innerHTML     = " VAN";
    bchk.innerHTML     = " VBN";
    cchk.innerHTML     = " VCN";
    achk2.innerHTML    = " VAB";
    bchk2.innerHTML    = " VBC";
    cchk2.innerHTML    = " VCA";
    nchk.innerHTML     = " IN";
    VAChk.checked      = true;
    VBChk.checked      = true;
    VCChk.checked      = true;
    IAChk.checked      = true;
    IBChk.checked      = true;
    ICChk.checked      = true;
    VABChk.checked     = true;
    VBCChk.checked     = true;
    VCAChk.checked     = true;
    INChk.checked      = true;
    aHoldSpan.hidden   = true;
    bHoldSpan.hidden   = true;
    cHoldSpan.hidden   = true;
    holdText.hidden    = true;
    aHold.checked      = false;
    bHold.checked      = false;
    cHold.checked      = false;
    compRow.hidden     = true;
    advSpan.hidden     = true;
    V0mag.value        = 0;
    V0phs.value        = 0;
    resizeCanvasParents();
    GFXUpdate();
    updatePower();
    wf.resize();
    phasor.resize();
}

//Advanced checkbox event listener.
advanced.onclick = () =>
{
    if(advanced.checked)
    {
        compRow.hidden = false;
        resizeCanvasParents();
        GFXUpdate();
        wf.resize();
        phasor.resize();
    }
    else
    {
        compRow.hidden = true;
        resizeCanvasParents();
        GFXUpdate();
        wf.resize();
        phasor.resize();
    }
}

//Add event listeners to sliders.
VASlider.oninput = () => 
{
    VAPhase.value = VASlider.value;
    deltaVUpdate("A");
    GFXUpdate();
    updatePower();
}

VBSlider.oninput = () =>
{
    VBPhase.value = VBSlider.value;
    deltaVUpdate("B");
    GFXUpdate();
    updatePower();
}

VCSlider.oninput = () =>
{
    VCPhase.value = VCSlider.value;
    deltaVUpdate("C");
    GFXUpdate();
    updatePower();
}

IASlider.oninput = () =>
{
    IAPhase.value = IASlider.value;
    GFXUpdate();
    updatePower();
}

IBSlider.oninput = () =>
{
    IBPhase.value = IBSlider.value;
    GFXUpdate();
    updatePower();
}

ICSlider.oninput = () =>
{
    ICPhase.value = ICSlider.value;
    GFXUpdate();
    updatePower();
}

//Add event listeners to voltage text boxes.
VAText.onkeydown  = (event) => 
{
    if(event.key === "Enter")
    {
        lastVAN = updateIV(VAText, lastVAN);
        deltaVUpdate("A");
        GFXUpdate();
        updatePower();
    }
}

VAText.onfocusout = () => 
{
        lastVAN = updateIV(VAText, lastVAN);
        deltaVUpdate("A");
        GFXUpdate();
        updatePower();
}

VBText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVBN = updateIV(VBText, lastVBN);
        deltaVUpdate("B");
        GFXUpdate();
        updatePower();
    }
}

VBText.onfocusout = () =>
{
    lastVBN = updateIV(VBText, lastVBN);
    deltaVUpdate("B");
    GFXUpdate();
    updatePower();
}

VCText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVCN = updateIV(VCText, lastVCN);
        deltaVUpdate("C");
        GFXUpdate();
        updatePower();
    }
}

VCText.onfocusout = () =>
{
    lastVCN = updateIV(VCText, lastVCN);
    deltaVUpdate("C");
    GFXUpdate();
    updatePower();
}

//Add event listeners to current text boxes.
IAText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIA = updateIV(IAText, lastIA);
        GFXUpdate();
        updatePower();
    }
}

IAText.onfocusout = () =>
{
    lastIA = updateIV(IAText, lastIA);
    GFXUpdate();
    updatePower();
}

IBText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIB = updateIV(IBText, lastIB);
        GFXUpdate();
        updatePower();
    }
}

IBText.onfocusout = () =>
{
    lastIB = updateIV(IBText, lastIB);
    GFXUpdate();
    updatePower();
}

ICText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIC = updateIV(ICText, lastIC);
        GFXUpdate();
        updatePower();
    }
}

ICText.onfocusout = () =>
{
    lastIC = updateIV(ICText, lastIC);
    GFXUpdate();
    updatePower();
}

//Add event listeners to voltage phase text boxes.
VAPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVAPhase = updatePhase(VAPhase, lastVAPhase, VASlider);
        deltaVUpdate("A");
        GFXUpdate();
        updatePower();
    }
}

VAPhase.onfocusout = () =>
{
    lastVAPhase = updatePhase(VAPhase, lastVAPhase, VASlider);
    deltaVUpdate("A");
    GFXUpdate();
    updatePower();
}

VBPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVBPhase = updatePhase(VBPhase, lastVBPhase, VBSlider);
        deltaVUpdate("B");
        GFXUpdate();
        updatePower();
    }
}

VBPhase.onfocusout = () =>
{
    lastVBPhase = updatePhase(VBPhase, lastVBPhase, VBSlider);
    deltaVUpdate("B");
    GFXUpdate();
    updatePower();
}

VCPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVCPhase = updatePhase(VCPhase, lastVCPhase, VCSlider);
        deltaVUpdate("C");
        GFXUpdate();
        updatePower();
    }
}

VCPhase.onfocusout = () =>
{
    lastVCPhase = updatePhase(VCPhase, lastVCPhase, VCSlider);
    deltaVUpdate("C");
    GFXUpdate();
    updatePower();
}

//Add event listeners to current phase text boxes.
IAPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIAPhase = updatePhase(IAPhase, lastIAPhase, IASlider);
        GFXUpdate();
        updatePower();
    }
}

IAPhase.onfocusout = () =>
{
    lastIAPhase = updatePhase(IAPhase, lastIAPhase, IASlider);
    GFXUpdate();
    updatePower();
}

IBPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIBPhase = updatePhase(IBPhase, lastIBPhase, IBSlider);
        GFXUpdate();
        updatePower();
    }
}

IBPhase.onfocusout = () =>
{
    lastIBPhase = updatePhase(IBPhase, lastIBPhase, IBSlider);
    GFXUpdate();
    updatePower();
}

ICPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastICPhase = updatePhase(ICPhase, lastICPhase, ICSlider);
        GFXUpdate();
        updatePower();
    }
}

ICPhase.onfocusout = () =>
{
    lastICPhase = updatePhase(ICPhase, lastICPhase, ICSlider);
    GFXUpdate();
    updatePower();
}

//Add listener to cycles text box.
CycText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastCycles = updateCycles(CycText, lastCycles);
        wf.updateCycles(lastCycles);
    }
}

CycText.onfocusout = () =>
{
    lastCycles = updateCycles(CycText, lastCycles);
    wf.updateCycles(lastCycles);
}

//Add listener to V0 text boxes.
V0mag.onkeydown = (event) =>
{
    if(event.key === "Enter")
    {
        lastV0mag = updateV0Mag(V0mag, lastV0mag);
        GFXUpdate();
        updatePower();
    }
}

V0mag.onfocusout = () =>
{
    lastV0mag = updateV0Mag(V0mag, lastV0mag);
    GFXUpdate();
    updatePower();
}

V0phs.onkeydown = (event) =>
{
    if(event.key === "Enter")
    {
        lastV0phs = updateV0Phs(V0phs, lastV0phs);
        GFXUpdate();
        updatePower();
    }
}
    
V0phs.onfocusout = () =>
{
    lastV0phs = updateV0Phs(V0phs, lastV0phs);
    GFXUpdate();
    updatePower();
}

//Add event listeners to check boxes.
VAChk.onclick  = () => GFXUpdate();
VBChk.onclick  = () => GFXUpdate();
VCChk.onclick  = () => GFXUpdate();
IAChk.onclick  = () => GFXUpdate();
IBChk.onclick  = () => GFXUpdate();
ICChk.onclick  = () => GFXUpdate();
VABChk.onclick = () => GFXUpdate();
VBCChk.onclick = () => GFXUpdate();
VCAChk.onclick = () => GFXUpdate();
INChk.onclick  = () => GFXUpdate();

const GFXUpdate = () =>
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    wf.updateCycles(parseFloat(CycText.value));
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked, INChk.checked, DYStyle);

    //Update V1V2 text.
    if(DYStyle === "delta" && advanced.checked === true)
    {
        V1V2Txt.innerHTML = "\xa0\xa0\xa0 V1: " + phasor.V1mag.toFixed(1) + "∠" + phasor.RtoD(phasor.V1phs).toFixed(1) + "°" +
                            "\xa0\xa0\xa0 V2: " + phasor.V2mag.toFixed(1) + "∠" + phasor.RtoD(phasor.V2phs).toFixed(1) + "°";
    }
}

//After a change is made to line voltage, the other line voltages need to be adjusted to keep
//the sytem valid. KVL states the line to line voltages must add to zero. Vab + Vbc + Vca = 0.
const deltaVUpdate = (lockedPhase) =>
{
    //Only correct a delta system.
    if(DYStyle != "delta")return;

    //Validate checkboxes. only one checkbox can be selected and it cannot be the one
    //for the phase the user is changing.
    if(lockedPhase === "A")
    {
        aHold.checked = false;

        if(bHold.checked && cHold.checked)
        {
            bHold.checked = false;
            cHold.checked = false;
        }
    }

    if(lockedPhase === "B")
    {
        bHold.checked = false;

        if(aHold.checked && cHold.checked)
        {
            aHold.checked = false;
            cHold.checked = false;
        }
    }

    if(lockedPhase === "C")
    {
        cHold.checked = false;

        if(aHold.checked && bHold.checked)
        {
            aHold.checked = false;
            bHold.checked = false;
        }
    }

    //Calculate the sum of the line voltages.
    let VABmag = parseFloat(VAText.value);
    let VBCmag = parseFloat(VBText.value);
    let VCAmag = parseFloat(VCText.value);
    let VABphs = phasor.DtoR(parseFloat(VAPhase.value));
    let VBCphs = phasor.DtoR(parseFloat(VBPhase.value));
    let VCAphs = phasor.DtoR(parseFloat(VCPhase.value));

    //Convert values into mathematically useful forms.
    let VABcmp = {r: VABmag * Math.cos(VABphs), i: VABmag * Math.sin(VABphs)};
    let VBCcmp = {r: VBCmag * Math.cos(VBCphs), i: VBCmag * Math.sin(VBCphs)};
    let VCAcmp = {r: VCAmag * Math.cos(VCAphs), i: VCAmag * Math.sin(VCAphs)}
    
    //Add the line voltage vectors together.
    let sum = phasor.complexAdd(phasor.complexAdd(VABcmp, VBCcmp), VCAcmp);

    //Calculate the amount to compensation values to add to the unchanged vectors.
    let comp = {r: -sum.r, i: -sum.i};             //Used if a vector isheld.
    let halfComp = {r: -sum.r / 2, i: -sum.i / 2}; //Used if no vectors held.

    //Adjust the vectors not set by the user.
    if(lockedPhase === "A")
    {
        //User doesn't want VBC changed. Only change VCA.
        if(bHold.checked)
        {
            VCAcmp = phasor.complexAdd(VCAcmp, comp);
        }

        //User doesn't want VCA changed. Only change VBC.
        if(cHold.checked)
        {
            VBCcmp = phasor.complexAdd(VBCcmp, comp);
        }

        //No constraints by user. Compensate evenly between VBC and VCA.
        if(!bHold.checked && !cHold.checked)
        {
            VBCcmp = phasor.complexAdd(VBCcmp, halfComp);
            VCAcmp = phasor.complexAdd(VCAcmp, halfComp);
        }
        
        VBText.value = Math.sqrt(VBCcmp.r**2 + VBCcmp.i**2).toFixed(1);
        VCText.value = Math.sqrt(VCAcmp.r**2 + VCAcmp.i**2).toFixed(1);
    }

    if(lockedPhase === "B")
    {
        //User doesn't want VAB changed. Only change VCA.
        if(aHold.checked)
        {
            VCAcmp = phasor.complexAdd(VCAcmp, comp);
        }

        //User doesn't want VCA changed. Only change VAC.
        if(cHold.checked)
        {
            VABcmp = phasor.complexAdd(VABcmp, comp);
        }

        //No constraints by user. Compensate evenly between VBC and VCA.
        if(!aHold.checked && !cHold.checked)
        {
            VABcmp = phasor.complexAdd(VABcmp, halfComp);
            VCAcmp = phasor.complexAdd(VCAcmp, halfComp);
        }

        VAText.value = Math.sqrt(VABcmp.r**2 + VABcmp.i**2).toFixed(1);
        VCText.value = Math.sqrt(VCAcmp.r**2 + VCAcmp.i**2).toFixed(1);
    }

    if(lockedPhase === "C")
    {
        //User doesn't want VAB changed. Only change VBC.
        if(aHold.checked)
        {
            VBCcmp = phasor.complexAdd(VBCcmp, comp);
        }

        //User doesn't want VBC changed. Only change VAB.
        if(bHold.checked)
        {
                VABcmp = phasor.complexAdd(VABcmp, comp);
        }

        //No constraints by user. Compensate evenly between VAB and VBC.
        if(!aHold.checked && !bHold.checked)
        {
            VABcmp = phasor.complexAdd(VABcmp, halfComp);
            VBCcmp = phasor.complexAdd(VBCcmp, halfComp);
        }
 
        VAText.value = Math.sqrt(VABcmp.r**2 + VABcmp.i**2).toFixed(1);
        VBText.value = Math.sqrt(VBCcmp.r**2 + VBCcmp.i**2).toFixed(1);
    }

    //Get the angles in degrees of all the line voltage vectors.
    VABphs = phasor.RtoD(Math.atan2(VABcmp.i, VABcmp.r));
    VBCphs = phasor.RtoD(Math.atan2(VBCcmp.i, VBCcmp.r));
    VCAphs = phasor.RtoD(Math.atan2(VCAcmp.i, VCAcmp.r));

    //Force a range between -180 and 180 degrees.
    if(VABphs >  180) VABphs -= 360;
    if(VABphs < -180) VABphs += 360;
    if(VBCphs >  180) VBCphs -= 360;
    if(VBCphs < -180) VBCphs += 360;
    if(VCAphs >  180) VCAphs -= 360;
    if(VCAphs < -180) VCAphs += 360;
    
    if(lockedPhase === "A")
    {
        VBPhase.value  = VBCphs.toFixed(1);
        VBSlider.value = VBCphs;
        VCPhase.value  = VCAphs.toFixed(1);
        VCSlider.value = VCAphs;
    }

    if(lockedPhase === "B")
    {
        VAPhase.value  = VABphs.toFixed(1);
        VASlider.value = VABphs;
        VCPhase.value  = VCAphs.toFixed(1);
        VCSlider.value = VCAphs;
    }

    if(lockedPhase === "C")
    {
        VAPhase.value  = VABphs.toFixed(1);
        VASlider.value = VABphs;
        VBPhase.value  = VBCphs.toFixed(1);
        VBSlider.value = VBCphs;
    }
}

//Update voltage/current text boxes.
const updateIV = (e, last) =>
{
    let num = parseFloat(e.value);
    if(!isNaN(num) && num >= 0)last = num;
    e.value = last;
    return last;
}

//Update sliders and associated text boxes.
const updatePhase = (e, last, slider) =>
{
    let num = parseFloat(e.value);
    if(!isNaN(num) && num >= -180 && num <= 180)
    {
        last = num;
        slider.value = num;
    }

    e.value = last;
    return last;
}

//Update number of cycles text box.
const updateCycles = (e, last) =>
{
    let num = parseFloat(e.value);
    if(!isNaN(num) && num >= 1 && num <= 10)last = num;
    e.value = last;
    return last;
}

//Update V0 magnitude text box.
const updateV0Mag = (e, last) =>
{
    let num = parseFloat(e.value);
    if(!isNaN(num) && num >= 0)last = num;
    e.value = last;
    return last;
}

//Update V0 angle text box.
const updateV0Phs = (e, last) =>
{
    let num = parseFloat(e.value);
    if(!isNaN(num) && num >= -180 && num <= 180)last = num;
         
    e.value = last;
    return last;
}

//Update power calculations.
const updatePower = () =>
{
    //Wye calculations.
    if(DYStyle === "wye")
    {
        //Get the power factors.
        let pfA = Math.cos(wf.DtoR(parseFloat(VAPhase.value) - parseFloat(IAPhase.value))).toFixed(2);
        let pfB = Math.cos(wf.DtoR(parseFloat(VBPhase.value) - parseFloat(IBPhase.value))).toFixed(2);
        let pfC = Math.cos(wf.DtoR(parseFloat(VCPhase.value) - parseFloat(ICPhase.value))).toFixed(2);
    
        //Calculate the phase angles between the current and their respective voltage phases.
        let iap = parseFloat(IAPhase.value) - parseFloat(VAPhase.value);
        let ibp = parseFloat(IBPhase.value) - parseFloat(VBPhase.value);
        let icp = parseFloat(ICPhase.value) - parseFloat(VCPhase.value);
    
        //Ensure results are between +/-180 degrees.
        if(iap >  180)iap -= 360;
        if(iap < -180)iap += 360;
        if(ibp >  180)ibp -= 360;
        if(ibp < -180)ibp += 360;
        if(icp >  180)icp -= 360;
        if(icp < -180)icp += 360;
    
        //Determine if power is leading or lagging.
        let leadLagA = "";
        let leadLagB = "";
        let leadLagC = "";
    
        if((iap > 0 && iap <  90) || (iap < -90 && iap > -180)) leadLagA += " Leading";
        if((iap < 0 && iap > -90) || (iap >  90 && iap <  180)) leadLagA += " Lagging";
        if((ibp > 0 && ibp <  90) || (ibp < -90 && ibp > -180)) leadLagB += " Leading";
        if((ibp < 0 && ibp > -90) || (ibp >  90 && ibp <  180)) leadLagB += " Lagging";
        if((icp > 0 && icp <  90) || (icp < -90 && icp > -180)) leadLagC += " Leading";
        if((icp < 0 && icp > -90) || (icp >  90 && icp <  180)) leadLagC += " Lagging";
    
        //Calculate KVA.
        let kvaA = (parseFloat(VAText.value) * parseFloat(IAText.value) / 1000).toFixed(1);
        let kvaB = (parseFloat(VBText.value) * parseFloat(IBText.value) / 1000).toFixed(1);
        let kvaC = (parseFloat(VCText.value) * parseFloat(ICText.value) / 1000).toFixed(1);
    
        //Get KVA signs.
        //kvaA = (pfA < 0) ? -kvaA : kvaA;
        //kvaB = (pfB < 0) ? -kvaB : kvaB;
        //kvaC = (pfC < 0) ? -kvaC : kvaC;
    
        //Calculate KW.
        let kwA = (parseFloat(VAText.value) * parseFloat(IAText.value) * pfA / 1000).toFixed(1);
        let kwB = (parseFloat(VBText.value) * parseFloat(IBText.value) * pfB / 1000).toFixed(1);
        let kwC = (parseFloat(VCText.value) * parseFloat(ICText.value) * pfC / 1000).toFixed(1);
    
        //Calculate KVAR.
        let kvarA = (-kvaA * Math.sin(Math.PI * iap / 180)).toFixed(1);
        let kvarB = (-kvaB * Math.sin(Math.PI * ibp / 180)).toFixed(1);
        let kvarC = (-kvaC * Math.sin(Math.PI * icp / 180)).toFixed(1);
    
        //Calculate the phase to phase voltage vectors.
        let vax = (parseFloat(VAText.value) * Math.cos(parseFloat(Math.PI * VAPhase.value / 180)));
        let vay = (parseFloat(VAText.value) * Math.sin(parseFloat(Math.PI * VAPhase.value / 180)));
        let vbx = (parseFloat(VBText.value) * Math.cos(parseFloat(Math.PI * VBPhase.value / 180)));
        let vby = (parseFloat(VBText.value) * Math.sin(parseFloat(Math.PI * VBPhase.value / 180)));
        let vcx = (parseFloat(VCText.value) * Math.cos(parseFloat(Math.PI * VCPhase.value / 180)));
        let vcy = (parseFloat(VCText.value) * Math.sin(parseFloat(Math.PI * VCPhase.value / 180)));

        let vabx = vax - vbx;
        let vaby = vay - vby;
        let vbcx = vbx - vcx;
        let vbcy = vby - vcy;
        let vcax = vcx - vax;
        let vcay = vcy - vay;
    
        let vab = Math.sqrt(vabx**2 + vaby**2).toFixed(1);
        let vbc = Math.sqrt(vbcx**2 + vbcy**2).toFixed(1);
        let vca = Math.sqrt(vcax**2 + vcay**2).toFixed(1);
    
        //Update power calculations on the display.
        aPower.innerHTML = "PF: " + pfA + leadLagA + "<br>KW: " + kwA + "<br>KVAR: " + kvarA + "<br>KVA: " + kvaA;
        bPower.innerHTML = "PF: " + pfB + leadLagB + "<br>KW: " + kwB + "<br>KVAR: " + kvarB + "<br>KVA: " + kvaB;
        cPower.innerHTML = "PF: " + pfC + leadLagC + "<br>KW: " + kwC + "<br>KVAR: " + kvarC + "<br>KVA: " + kvaC;
    
        //Calculate total power.
        let kwTotal = (parseFloat(kwA) + parseFloat(kwB) + parseFloat(kwC)).toFixed(1);
        let kvarTotal = (parseFloat(kvarA) + parseFloat(kvarB) + parseFloat(kvarC)).toFixed(1);
        let kvaTotal = (parseFloat(kvaA) + parseFloat(kvaB) + parseFloat(kvaC)).toFixed(1);
    
        //Calculate neutral current.
        let iax = parseFloat(IAText.value) * Math.cos(parseFloat(IAPhase.value) * Math.PI / 180);
        let iay = parseFloat(IAText.value) * Math.sin(parseFloat(IAPhase.value) * Math.PI / 180);
        let ibx = parseFloat(IBText.value) * Math.cos(parseFloat(IBPhase.value) * Math.PI / 180);
        let iby = parseFloat(IBText.value) * Math.sin(parseFloat(IBPhase.value) * Math.PI / 180);
        let icx = parseFloat(ICText.value) * Math.cos(parseFloat(ICPhase.value) * Math.PI / 180);
        let icy = parseFloat(ICText.value) * Math.sin(parseFloat(ICPhase.value) * Math.PI / 180);
    
        let ineutx = iax + ibx + icx;
        let ineuty = iay + iby + icy;
        let ineut = Math.sqrt(ineutx**2 + ineuty**2).toFixed(1);
    
        //Update total power calculations on the display.
        tPower.innerHTML = "KW: " + kwTotal + "\xa0\xa0\xa0 KVAR: " + kvarTotal + "\xa0\xa0\xa0 KVA: " + kvaTotal;
    
        //Update derived values on the display.
        let neutAngle = ineut === "0.0" ? "0.0" : phasor.RtoD(phasor.CtoP({r: ineutx, i: ineuty}).a).toFixed(1);
        derived.innerHTML= "VAB: " + vab + "∠" + phasor.RtoD(phasor.CtoP({r: vabx, i: vaby}).a).toFixed(1) + "°" +
              "\xa0\xa0\xa0 VBC: " + vbc + "∠" + phasor.RtoD(phasor.CtoP({r: vbcx, i: vbcy}).a).toFixed(1) + "°" +
              "\xa0\xa0\xa0 VCA: " + vca + "∠" + phasor.RtoD(phasor.CtoP({r: vcax, i: vcay}).a).toFixed(1) + "°" +
              "\xa0\xa0\xa0 IN: " + ineut + "∠" + neutAngle + "°";
    }

    //Delta calculations.
    else
    {
        //Get calculated values from the phasor and convert to polar form.
        let _va  = phasor.CtoP(phasor._va);
        let _vb  = phasor.CtoP(phasor._vb);
        let _vc  = phasor.CtoP(phasor._vc);
        let _ia  = phasor.CtoP(phasor._ia);
        let _ib  = phasor.CtoP(phasor._ib);
        let _ic  = phasor.CtoP(phasor._ic);
        let _ig  = phasor.CtoP(phasor._in);

        //Get the power factors.
        let pfA = Math.cos(_va.a - _ia.a).toFixed(2);
        let pfB = Math.cos(_vb.a - _ib.a).toFixed(2);
        let pfC = Math.cos(_vc.a - _ic.a).toFixed(2);

        //Calculate the phase angles between the current and their respective voltage phases.
        let iap = phasor.RtoD(_ia.a) - phasor.RtoD(_va.a);
        let ibp = phasor.RtoD(_ib.a) - phasor.RtoD(_vb.a);
        let icp = phasor.RtoD(_ic.a) - phasor.RtoD(_vc.a);

        //Ensure results are between +/-180 degrees.
        if(iap >  180)iap -= 360;
        if(iap < -180)iap += 360;
        if(ibp >  180)ibp -= 360;
        if(ibp < -180)ibp += 360;
        if(icp >  180)icp -= 360;
        if(icp < -180)icp += 360;

        //Determine if power is leading or lagging.
        let leadLagA = "";
        let leadLagB = "";
        let leadLagC = "";

        if((iap > 0 && iap <  90) || (iap < -90 && iap > -180)) leadLagA += " Leading";
        if((iap < 0 && iap > -90) || (iap >  90 && iap <  180)) leadLagA += " Lagging";
        if((ibp > 0 && ibp <  90) || (ibp < -90 && ibp > -180)) leadLagB += " Leading";
        if((ibp < 0 && ibp > -90) || (ibp >  90 && ibp <  180)) leadLagB += " Lagging";
        if((icp > 0 && icp <  90) || (icp < -90 && icp > -180)) leadLagC += " Leading";
        if((icp < 0 && icp > -90) || (icp >  90 && icp <  180)) leadLagC += " Lagging";

        //Clean up some corner cases.
        if(pfA === "-0.00") pfA = "0.00";
        if(pfA === "-1.00") pfA = "1.00";
        if(pfA === "0.00" || pfA === "1.00") leadLagA = "";
        if(pfB === "-0.00") pfB = "0.00";
        if(pfB === "-1.00") pfB = "1.00";
        if(pfB === "0.00" || pfB === "1.00") leadLagB = "";
        if(pfC === "-0.00") pfC = "0.00";
        if(pfC === "-1.00") pfC = "1.00";
        if(pfC === "0.00" || pfC === "1.00") leadLagC = "";

        //Calculate KVA.
        let kvaA = (_va.m * _ia.m / 1000).toFixed(1);
        let kvaB = (_vb.m * _ib.m / 1000).toFixed(1);
        let kvaC = (_vc.m * _ic.m / 1000).toFixed(1);

        //Clean up some corner cases.
        if(kvaA === "-0.0") kvaA = "0.0";
        if(kvaB === "-0.0") kvaB = "0.0";
        if(kvaC === "-0.0") kvaC = "0.0";

        //Get KVA signs.
        //kvaA = (pfA < 0) ? -kvaA : kvaA;
        //kvaB = (pfB < 0) ? -kvaB : kvaB;
        //kvaC = (pfC < 0) ? -kvaC : kvaC;

        //Calculate KW.
        let kwA = (_va.m * _ia.m * pfA / 1000).toFixed(1);
        let kwB = (_vb.m * _ib.m * pfB / 1000).toFixed(1);
        let kwC = (_vc.m * _ic.m * pfC / 1000).toFixed(1);

        //Clean up some corner cases.
        if(kwA === "-0.0") kwA = "0.0";
        if(kwB === "-0.0") kwB = "0.0";
        if(kwC === "-0.0") kwC = "0.0";

        //Calculate KVAR.
        let kvarA = (-kvaA * Math.sin(Math.PI * iap / 180)).toFixed(1);
        let kvarB = (-kvaB * Math.sin(Math.PI * ibp / 180)).toFixed(1);
        let kvarC = (-kvaC * Math.sin(Math.PI * icp / 180)).toFixed(1);

        //Clean up some corner cases.
        if(kvarA === "-0.0") kvarA = "0.0";
        if(kvarB === "-0.0") kvarB = "0.0";
        if(kvarC === "-0.0") kvarC = "0.0";

        //Update power calculations on the display.
        aPower.innerHTML = "PF: " + pfA + leadLagA + "<br>KW: " + kwA + "<br>KVAR: " + kvarA + "<br>KVA: " + kvaA;
        bPower.innerHTML = "PF: " + pfB + leadLagB + "<br>KW: " + kwB + "<br>KVAR: " + kvarB + "<br>KVA: " + kvaB;
        cPower.innerHTML = "PF: " + pfC + leadLagC + "<br>KW: " + kwC + "<br>KVAR: " + kvarC + "<br>KVA: " + kvaC;

        //Calculate total power.
        let kwTotal = (parseFloat(kwA) + parseFloat(kwB) + parseFloat(kwC)).toFixed(1);
        let kvarTotal = (parseFloat(kvarA) + parseFloat(kvarB) + parseFloat(kvarC)).toFixed(1);
        let kvaTotal = (parseFloat(kvaA) + parseFloat(kvaB) + parseFloat(kvaC)).toFixed(1);

        //Update total power calculations on the display.
        tPower.innerHTML = "KW: " + kwTotal + "\xa0\xa0\xa0 KVAR: " + kvarTotal + "\xa0\xa0\xa0 KVA: " + kvaTotal;

        //Update derived values on the display.
        let neutAngle = phasor.RtoD(_ig.m).toFixed(1) === "0.0" ? "0.0" : phasor.RtoD(_ig.a).toFixed(1);
        derived.innerHTML= "VAG: " + _va.m.toFixed(1) + "∠" + phasor.RtoD(_va.a).toFixed(1) + "°" +
              "\xa0\xa0\xa0 VBG: " + _vb.m.toFixed(1) + "∠" + phasor.RtoD(_vb.a).toFixed(1) + "°" +
              "\xa0\xa0\xa0 VCG: " + _vc.m.toFixed(1) + "∠" + phasor.RtoD(_vc.a).toFixed(1) + "°" +
              "\xa0\xa0\xa0 IG: " + _ig.m.toFixed(1) + "∠" + neutAngle + "°";
    }
}

const resizeCanvasParents = () =>
{
    let rightWidth   = rightCol.clientWidth;
    let computedStyle = getComputedStyle(rightCol);
    rightWidth -= (parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight));
    let rightHeight = window.innerHeight - phasorWindow.offsetTop - headerHeight - footerHeight -10;
    
    if(mainBody.clientWidth < 769)
    {
        phasorWindow.style.height = Math.max(rightHeight, rightWidth) + "px";
        phasorWindow.style.width = Math.max(rightHeight, rightWidth)  + "px"; 
    }
    else
    {
        phasorWindow.style.height = Math.min(rightHeight, rightWidth) + "px";
        phasorWindow.style.width = Math.min(rightHeight, rightWidth)  + "px"; 
    }
}

//Set initial heights of things.
let headerHeight = header.clientHeight;
let footerHeight = footer.clientHeight;
waveWindow.style.height = window.innerHeight - waveWindow.offsetTop - headerHeight - footerHeight - 10 + "px";
phasorWindow.style.height = window.innerHeight - phasor.offsetTop - headerHeight - footerHeight - 10 + "px";

wf.resize();
updatePower();
resizeCanvasParents();
phasor.resize();
