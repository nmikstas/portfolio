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
    VAPhase, VBPhase, VCPhase, IAPhase, IBPhase, ICPhase
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
});

//Add event listeners to sliders.
VASlider.oninput = () => 
{
    VAPhase.value = VASlider.value;
    wf.resize();
    updatePower();
    phasor.resize();
}

VBSlider.oninput = () =>
{
    VBPhase.value = VBSlider.value;
    wf.resize();
    updatePower();
    phasor.resize();
}

VCSlider.oninput = () =>
{
    VCPhase.value = VCSlider.value;
    wf.resize();
    updatePower();
    phasor.resize();
}

IASlider.oninput = () =>
{
    IAPhase.value = IASlider.value;
    wf.resize();
    updatePower();
    phasor.resize();
}

IBSlider.oninput = () =>
{
    IBPhase.value = IBSlider.value;
    wf.resize();
    updatePower();
    phasor.resize();
}

ICSlider.oninput = () =>
{
    ICPhase.value = ICSlider.value;
    wf.resize();
    updatePower();
    phasor.resize();
}

//Add event listeners to voltage text boxes.
VAText.onkeydown  = (event) => 
{
    if(event.key === "Enter")
    {
        lastVAN = updateIV(VAText, lastVAN);
        wf.resize();
        phasor.resize();
    }
}

VAText.onfocusout = () => 
{
        lastVAN = updateIV(VAText, lastVAN);
        wf.resize();
        phasor.resize();
}

VBText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVBN = updateIV(VBText, lastVBN);
        wf.resize();
        phasor.resize();
    }
}

VBText.onfocusout = () =>
{
    lastVBN = updateIV(VBText, lastVBN);
    wf.resize();
    phasor.resize();
}

VCText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVCN = updateIV(VCText, lastVCN);
        wf.resize();
        phasor.resize();
    }
}

VCText.onfocusout = () =>
{
    lastVCN = updateIV(VCText, lastVCN);
    wf.resize();
    phasor.resize();
}

//Add event listeners to current text boxes.
IAText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIA = updateIV(IAText, lastIA);
        wf.resize();
        phasor.resize();
    }
}

IAText.onfocusout = () =>
{
    lastIA = updateIV(IAText, lastIA);
    wf.resize();
    phasor.resize();
}

IBText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIB = updateIV(IBText, lastIB);
        wf.resize();
        phasor.resize();
    }
}

IBText.onfocusout = () =>
{
    lastIB = updateIV(IBText, lastIB);
    wf.resize();
    phasor.resize();
}

ICText.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIC = updateIV(ICText, lastIC);
        wf.resize();
        phasor.resize();
    }
}

ICText.onfocusout = () =>
{
    lastIC = updateIV(ICText, lastIC);
    wf.resize();
    phasor.resize();
}

//Add event listeners to voltage phase text boxes.
VAPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVAPhase = updatePhase(VAPhase, lastVAPhase, VASlider);
        wf.resize();
        phasor.resize();
    }
}

VAPhase.onfocusout = () =>
{
    lastVAPhase = updatePhase(VAPhase, lastVAPhase, VASlider);
    wf.resize();
    phasor.resize();
}

VBPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVBPhase = updatePhase(VBPhase, lastVBPhase, VBSlider);
        wf.resize();
        phasor.resize();
    }
}

VBPhase.onfocusout = () =>
{
    lastVBPhase = updatePhase(VBPhase, lastVBPhase, VBSlider);
    wf.resize();
    phasor.resize();
}

VCPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastVCPhase = updatePhase(VCPhase, lastVCPhase, VCSlider);
        wf.resize();
        phasor.resize();
    }
}

VCPhase.onfocusout = () =>
{
    lastVCPhase = updatePhase(VCPhase, lastVCPhase, VCSlider);
    wf.resize();
    phasor.resize();
}

//Add event listeners to current phase text boxes.
IAPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIAPhase = updatePhase(IAPhase, lastIAPhase, IASlider);
        wf.resize();
        phasor.resize();
    }
}

IAPhase.onfocusout = () =>
{
    lastIAPhase = updatePhase(IAPhase, lastIAPhase, IASlider);
    wf.resize();
    phasor.resize();
}

IBPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastIBPhase = updatePhase(IBPhase, lastIBPhase, IBSlider);
        wf.resize();
        phasor.resize();
    }
}

IBPhase.onfocusout = () =>
{
    lastIBPhase = updatePhase(IBPhase, lastIBPhase, IBSlider);
    wf.resize();
    phasor.resize();
}

ICPhase.onkeydown  = (event) =>
{
    if(event.key === "Enter")
    {
        lastICPhase = updatePhase(ICPhase, lastICPhase, ICSlider);
        wf.resize();
        phasor.resize();
    }
}

ICPhase.onfocusout = () =>
{
    lastICPhase = updatePhase(ICPhase, lastICPhase, ICSlider);
    wf.resize();
    phasor.resize();
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

//Add event listeners to check boxes.
VAChk.onclick = () => 
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

VBChk.onclick = () =>
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

VCChk.onclick = () =>
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

IAChk.onclick = () =>
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

IBChk.onclick = () =>
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

ICChk.onclick = () =>
{
    wf.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked);
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

VABChk.onclick = () =>
{
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

VBCChk.onclick = () =>
{
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

VCAChk.onclick = () =>
{
    phasor.updateShow(VAChk.checked, VBChk.checked, VCChk.checked, IAChk.checked, IBChk.checked, ICChk.checked,
        VABChk.checked, VBCChk.checked, VCAChk.checked)
}

//Update voltage/current text boxes.
const updateIV = (e, last) =>
{
    let num = parseFloat(e.value);
    if(!isNaN(num) && num > 0)last = num;
    e.value = last;
    updatePower();
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
    updatePower();
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

//Update power calculations.
const updatePower = () =>
{
    //Get the power factors.
    let pfA = Math.cos(wf.DtoR(parseFloat(VAPhase.value) - parseFloat(IAPhase.value))).toFixed(3);
    let pfB = Math.cos(wf.DtoR(parseFloat(VBPhase.value) - parseFloat(IBPhase.value))).toFixed(3);
    let pfC = Math.cos(wf.DtoR(parseFloat(VCPhase.value) - parseFloat(ICPhase.value))).toFixed(3);

    //Calculate the absolute phase angles with respect to by rotating each voltage phase to 0 degrees.
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
    let kvaA = (parseFloat(VAText.value) * parseFloat(IAText.value) / 1000).toFixed(2);
    let kvaB = (parseFloat(VBText.value) * parseFloat(IBText.value) / 1000).toFixed(2);
    let kvaC = (parseFloat(VCText.value) * parseFloat(ICText.value) / 1000).toFixed(2);

    //Get KVA signs.
    kvaA = (pfA < 0) ? -kvaA : kvaA;
    kvaB = (pfB < 0) ? -kvaB : kvaB;
    kvaC = (pfC < 0) ? -kvaC : kvaC;

    //Calculate KW.
    let kwA = (parseFloat(VAText.value) * parseFloat(IAText.value) * pfA / 1000).toFixed(2);
    let kwB = (parseFloat(VBText.value) * parseFloat(IBText.value) * pfB / 1000).toFixed(2);
    let kwC = (parseFloat(VCText.value) * parseFloat(ICText.value) * pfC / 1000).toFixed(2);

    //Calculate KVAR.
    let kvarA = (-kvaA * Math.sin(Math.PI * iap / 180)).toFixed(2);
    let kvarB = (-kvaB * Math.sin(Math.PI * ibp / 180)).toFixed(2);
    let kvarC = (-kvaC * Math.sin(Math.PI * icp / 180)).toFixed(2);

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
    aPower.innerHTML = "PF: " + pfA + leadLagA + "<br>KW: " + kwA + "<br>KVAR: " + kvarA + "<br>KVA: " + kvaA + "<br>VAB: " + vab;
    bPower.innerHTML = "PF: " + pfB + leadLagB + "<br>KW: " + kwB + "<br>KVAR: " + kvarB + "<br>KVA: " + kvaB + "<br>VBC: " + vbc;
    cPower.innerHTML = "PF: " + pfC + leadLagC + "<br>KW: " + kwC + "<br>KVAR: " + kvarC + "<br>KVA: " + kvaC + "<br>VCA: " + vca;

    //Calculate total power.
    let kwTotal = (parseFloat(kwA) + parseFloat(kwB) + parseFloat(kwC)).toFixed(2);
    let kvarTotal = (parseFloat(kvarA) + parseFloat(kvarB) + parseFloat(kvarC)).toFixed(2);
    let kvaTotal = (parseFloat(kvaA) + parseFloat(kvaB) + parseFloat(kvaC)).toFixed(2);

    //Update total power calculations on the display.
    tPower.innerHTML = "KW: " + kwTotal + "\xa0\xa0\xa0 KVAR: " + kvarTotal + "\xa0\xa0\xa0 KVA: " + kvaTotal;
}

//Set initial heights of things.
let headerHeight = header.clientHeight;
let footerHeight = footer.clientHeight;
waveWindow.style.height = window.innerHeight - waveWindow.offsetTop - headerHeight - footerHeight - 10 + "px";
phasorWindow.style.height = window.innerHeight - phasor.offsetTop - headerHeight - footerHeight - 10 + "px";

wf.resize();
updatePower();

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

phasor.resize();
