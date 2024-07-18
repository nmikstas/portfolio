//Make canvas images.
let bodyImg     = new Image();
bodyImg.src     = "./img/Body.png";
let in1Img      = new Image();
in1Img.src      = "./img/In1.png";
let in2Img      = new Image();
in2Img.src      = "./img/In2.png";
let in3Img      = new Image();
in3Img.src      = "./img/In3.png";
let in4Img      = new Image();
in4Img.src      = "./img/In4.png";
let in5Img      = new Image();
in5Img.src      = "./img/In5.png";
let in6Img      = new Image();
in6Img.src      = "./img/In6.png";
let inPhaseImg  = new Image();
inPhaseImg.src  = "./img/In-Phase.png";
let outPhaseImg = new Image();
outPhaseImg.src = "./img/Out-of-Phase.png";
let out1Img     = new Image();
out1Img.src     = "./img/Out1.png";
let out2Img     = new Image();
out2Img.src     = "./img/Out2.png";
let out3Img     = new Image();
out3Img.src     = "./img/Out3.png";
let out4Img     = new Image();
out4Img.src     = "./img/Out4.png";
let out5Img     = new Image();
out5Img.src     = "./img/Out5.png";
let out6Img     = new Image();
out6Img.src     = "./img/Out6.png";

//Get access to the page elements.
let header = document.getElementById("header");
let footer = document.getElementById("sticky-footer");

let img_container  = document.getElementById("img-container");
let img_body       = document.getElementById("img-body");
let in1            = document.getElementById("img-in1");
let in2            = document.getElementById("img-in2");
let in3            = document.getElementById("img-in3");
let in4            = document.getElementById("img-in4");
let in5            = document.getElementById("img-in5");
let in6            = document.getElementById("img-in6");
let img_inphase    = document.getElementById("img-inphase");
let img_outofphase = document.getElementById("img-outofphase");
let out1           = document.getElementById("img-out1");
let out2           = document.getElementById("img-out2");
let out3           = document.getElementById("img-out3");
let out4           = document.getElementById("img-out4");
let out5           = document.getElementById("img-out5");
let out6           = document.getElementById("img-out6");

let phs_container  = document.getElementById("phs-container");

let input_wiring  = document.getElementById("input-wiring");
let coil_phase    = document.getElementById("coil-phase");
let output_wiring = document.getElementById("output-wiring");
let user_inputs   = document.getElementById("user-inputs");
let main_body     = document.getElementById("main-body");

let left  = document.getElementById("left");
let right = document.getElementById("right");
let eq    = document.getElementById("eq");

let eq01 = document.getElementById("eq01");
let eq02 = document.getElementById("eq02");
let eq03 = document.getElementById("eq03");
let eq04 = document.getElementById("eq04");
let eq05 = document.getElementById("eq05");
let eq06 = document.getElementById("eq06");
let eq07 = document.getElementById("eq07");
let eq08 = document.getElementById("eq08");
let eq09 = document.getElementById("eq09");
let eq10 = document.getElementById("eq10");
let eq11 = document.getElementById("eq11");
let eq12 = document.getElementById("eq12");

let ch_vAB = document.getElementById("ch-vAB");
let ch_vBC = document.getElementById("ch-vBC");
let ch_vCA = document.getElementById("ch-vCA");
let ch_vab = document.getElementById("ch-vab");
let ch_vbc = document.getElementById("ch-vbc");
let ch_vca = document.getElementById("ch-vca");
let ch_vpA = document.getElementById("ch-vpA");
let ch_vpB = document.getElementById("ch-vpB");
let ch_vpC = document.getElementById("ch-vpC");
let ch_vpa = document.getElementById("ch-vpa");
let ch_vpb = document.getElementById("ch-vpb");
let ch_vpc = document.getElementById("ch-vpc");

let div1 = document.getElementById("div1");
let div2 = document.getElementById("div2");

//New phasor class.
let phasor = new Phasor(phs_container);

//Keep track of current configuration.
let inWires  = 1;
let txPhase  = 0;
let outWires = 1;

//Equations text.
let eq01Txt = "";
let eq02Txt = "";
let eq03Txt = "";
let eq04Txt = "";
let eq05Txt = "";
let eq06Txt = "";
let eq07Txt = "";
let eq08Txt = "";
let eq09Txt = "";
let eq10Txt = "";
let eq11Txt = "";
let eq12Txt = "";

//Equation variables, in polar form. Radians angle.
let VAB = {m: 480, a: 0};
let VBC = {m: 480, a: phasor.DtoR(-120)};
let VCA = {m: 480, a: phasor.DtoR(120)};
let VpA = {m: 480, a: 0};
let VpB = {m: 480, a: phasor.DtoR(-120)};
let VpC = {m: 480, a: phasor.DtoR(120)};
let Vpa = {m: 120, a: 0};
let Vpb = {m: 120, a: phasor.DtoR(-120)};
let Vpc = {m: 120, a: phasor.DtoR(120)};
let Vab = {m: 120, a: phasor.DtoR(30)};
let Vbc = {m: 120, a: phasor.DtoR(-90)};
let Vca = {m: 120, a: phasor.DtoR(150)};
let inv = {m: .25, a: phasor.DtoR(180)};
let one = {m: .25, a: 0};

//Input event listeners.
input_wiring.onchange  = () => updateImage();    
coil_phase.onchange    = () => updateImage();
output_wiring.onchange = () => updateImage();

ch_vAB.onclick = () => updateShow();
ch_vBC.onclick = () => updateShow();
ch_vCA.onclick = () => updateShow();
ch_vab.onclick = () => updateShow();
ch_vbc.onclick = () => updateShow();
ch_vca.onclick = () => updateShow();
ch_vpA.onclick = () => updateShow();
ch_vpB.onclick = () => updateShow();
ch_vpC.onclick = () => updateShow();
ch_vpa.onclick = () => updateShow();
ch_vpb.onclick = () => updateShow();
ch_vpc.onclick = () => updateShow();


const updateShow = () =>
{
    phasor.updateShow(ch_vAB.checked, ch_vBC.checked, ch_vCA.checked,
                      ch_vpA.checked, ch_vpB.checked, ch_vpC.checked,
                      ch_vpa.checked, ch_vpb.checked, ch_vpc.checked,
                      ch_vab.checked, ch_vbc.checked, ch_vca.checked);                    
}

const updateImage = () =>
{
    //Get canvas context.
    let ctx = img_container.getContext("2d");

    //Clear the canvas.
    ctx.beginPath();
    ctx.fillStyle = "#ffffffff";
    ctx.fillRect(0, 0, img_container.width, img_container.height);
    ctx.stroke();

    //Always draw the main body image.
    ctx.drawImage(bodyImg, 0, 0, img_container.clientWidth, img_container.clientHeight);

    //Draw the input wiring.
    switch(input_wiring.value)
    {
        case "input1":
            ctx.drawImage(in1Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            inWires = 1;
            VpA = phasor.phasorMult({m: 1, a: 0}, VAB);
            VpB = phasor.phasorMult({m: 1, a: 0}, VBC);
            VpC = phasor.phasorMult({m: 1, a: 0}, VCA);
            eq01Txt = "VθA = VAB = " + phasor.printPolarD(VpA);
            eq02Txt = "VθB = VBC = " + phasor.printPolarD(VpB);
            eq03Txt = "VθC = VCA = " + phasor.printPolarD(VpC);
            break;
        case "input2":
            ctx.drawImage(in2Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            inWires = 2;
            VpA = phasor.phasorMult({m: 1, a: 0}, VCA);
            VpB = phasor.phasorMult({m: 1, a: 0}, VAB);
            VpC = phasor.phasorMult({m: 1, a: 0}, VBC);
            eq01Txt = "VθA = VCA = " + phasor.printPolarD(VpA);
            eq02Txt = "VθB = VAB = " + phasor.printPolarD(VpB);
            eq03Txt = "VθC = VBC = " + phasor.printPolarD(VpC);
        break;
        case "input3":
            ctx.drawImage(in3Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            inWires = 3;
            VpA = phasor.phasorMult({m: 1, a: 0}, VBC);
            VpB = phasor.phasorMult({m: 1, a: 0}, VCA);
            VpC = phasor.phasorMult({m: 1, a: 0}, VAB);
            eq01Txt = "VθA = VBC = " + phasor.printPolarD(VpA);
            eq02Txt = "VθB = VCA = " + phasor.printPolarD(VpB);
            eq03Txt = "VθC = VAB = " + phasor.printPolarD(VpC);
        break;
        case "input4":
            ctx.drawImage(in4Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            inWires = 4;
            VpA = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VCA);
            VpB = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VBC);
            VpC = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VAB);
            eq01Txt = "VθA = VAC = " + phasor.printPolarD(VpA);
            eq02Txt = "VθB = VCB = " + phasor.printPolarD(VpB);
            eq03Txt = "VθC = VBA = " + phasor.printPolarD(VpC);
        break;
        case "input5":
            ctx.drawImage(in5Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            inWires = 5;
            VpA = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VBC);
            VpB = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VAB);
            VpC = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VCA);
            eq01Txt = "VθA = VCB = " + phasor.printPolarD(VpA);
            eq02Txt = "VθB = VBA = " + phasor.printPolarD(VpB);
            eq03Txt = "VθC = VAC = " + phasor.printPolarD(VpC);
        break;
        case "input6":
            ctx.drawImage(in6Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            inWires = 6;
            VpA = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VAB);
            VpB = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VCA);
            VpC = phasor.phasorMult({m: 1, a: phasor.DtoR(180)}, VBC);
            eq01Txt = "VθA = VBA = " + phasor.printPolarD(VpA);
            eq02Txt = "VθB = VAC = " + phasor.printPolarD(VpB);
            eq03Txt = "VθC = VCB = " + phasor.printPolarD(VpC);
        break;
        default:
        break;
    }
    
    //Draw the coil phasing.
    coil_phase.value === "0" ? ctx.drawImage(inPhaseImg,  0, 0, img_container.clientWidth, img_container.clientHeight) : 
                               ctx.drawImage(outPhaseImg, 0, 0, img_container.clientWidth, img_container.clientHeight);

    //Set coil phase variable.
    coil_phase.value === "0" ? txPhase  = 0 : txPhase  = 1;

    //Invert phasor.
    if(txPhase == 1)
    {
        Vpa = phasor.phasorMult(VpA, inv);
        Vpb = phasor.phasorMult(VpB, inv);
        Vpc = phasor.phasorMult(VpC, inv);
        eq04Txt = "Vθa = -1/4VθA = " + phasor.printPolarD(Vpa);
        eq05Txt = "Vθb = -1/4VθB = " + phasor.printPolarD(Vpb);
        eq06Txt = "Vθc = -1/4VθC = " + phasor.printPolarD(Vpc);
    }
    //Copy phasor and leave the same.
    else
    {
        Vpa = phasor.phasorMult(VpA, one);
        Vpb = phasor.phasorMult(VpB, one);
        Vpc = phasor.phasorMult(VpC, one);
        eq04Txt = "Vθa = 1/4VθA = " + phasor.printPolarD(Vpa);
        eq05Txt = "Vθb = 1/4VθB = " + phasor.printPolarD(Vpb);
        eq06Txt = "Vθc = 1/4VθC = " + phasor.printPolarD(Vpc);
    }

    //Draw the output wiring.
    switch(output_wiring.value)
    {
        case "output1":
            ctx.drawImage(out1Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            outWires = 1;
            Vab = phasor.phasorSub(Vpa, Vpb);
            Vbc = phasor.phasorSub(Vpb, Vpc);
            Vca = phasor.phasorSub(Vpc, Vpa);
            eq07Txt = "Vab = Vθa-Vθb = " + phasor.printPolarD(Vpa) + " - " + phasor.printPolarD(Vpb);
            eq08Txt = "Vbc = Vθb-Vθc = " + phasor.printPolarD(Vpb) + " - " + phasor.printPolarD(Vpc);
            eq09Txt = "Vca = Vθc-Vθa = " + phasor.printPolarD(Vpc) + " - " + phasor.printPolarD(Vpa);
            break;
        case "output2":
            ctx.drawImage(out2Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            outWires = 2;
            Vab = phasor.phasorSub(Vpc, Vpa);
            Vbc = phasor.phasorSub(Vpa, Vpb);
            Vca = phasor.phasorSub(Vpb, Vpc);
            eq07Txt = "Vab = Vθc-Vθa = " + phasor.printPolarD(Vpc) + " - " + phasor.printPolarD(Vpa);
            eq08Txt = "Vbc = Vθa-Vθb = " + phasor.printPolarD(Vpa) + " - " + phasor.printPolarD(Vpb);
            eq09Txt = "Vca = Vθb-Vθc = " + phasor.printPolarD(Vpb) + " - " + phasor.printPolarD(Vpc);
        break;
        case "output3":
            ctx.drawImage(out3Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            outWires = 3;
            Vab = phasor.phasorSub(Vpb, Vpc);
            Vbc = phasor.phasorSub(Vpc, Vpa);
            Vca = phasor.phasorSub(Vpa, Vpb);
            eq07Txt = "Vab = Vθb-Vθc = " + phasor.printPolarD(Vpb) + " - " + phasor.printPolarD(Vpc);
            eq08Txt = "Vbc = Vθc-Vθa = " + phasor.printPolarD(Vpc) + " - " + phasor.printPolarD(Vpa);
            eq09Txt = "Vca = Vθa-Vθb = " + phasor.printPolarD(Vpa) + " - " + phasor.printPolarD(Vpb);
        break;
        case "output4":
            ctx.drawImage(out4Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            outWires = 4;
            Vab = phasor.phasorSub(Vpa, Vpc);
            Vbc = phasor.phasorSub(Vpc, Vpb);
            Vca = phasor.phasorSub(Vpb, Vpa);
            eq07Txt = "Vab = Vθa-Vθc = " + phasor.printPolarD(Vpa) + " - " + phasor.printPolarD(Vpc);
            eq08Txt = "Vbc = Vθc-Vθb = " + phasor.printPolarD(Vpc) + " - " + phasor.printPolarD(Vpb);
            eq09Txt = "Vca = Vθb-Vθa = " + phasor.printPolarD(Vpb) + " - " + phasor.printPolarD(Vpa);
        break;
        case "output5":
            ctx.drawImage(out5Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            outWires = 5;
            Vab = phasor.phasorSub(Vpc, Vpb);
            Vbc = phasor.phasorSub(Vpb, Vpa);
            Vca = phasor.phasorSub(Vpa, Vpc);
            eq07Txt = "Vab = Vθc-Vθb = " + phasor.printPolarD(Vpc) + " - " + phasor.printPolarD(Vpb);
            eq08Txt = "Vbc = Vθb-Vθa = " + phasor.printPolarD(Vpb) + " - " + phasor.printPolarD(Vpa);
            eq09Txt = "Vca = Vθa-Vθc = " + phasor.printPolarD(Vpa) + " - " + phasor.printPolarD(Vpc);
        break;
        case "output6":
            ctx.drawImage(out6Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
            outWires = 6;
            Vab = phasor.phasorSub(Vpb, Vpa);
            Vbc = phasor.phasorSub(Vpa, Vpc);
            Vca = phasor.phasorSub(Vpc, Vpb);
            eq07Txt = "Vab = Vθb-Vθa = " + phasor.printPolarD(Vpb) + " - " + phasor.printPolarD(Vpa);
            eq08Txt = "Vbc = Vθa-Vθc = " + phasor.printPolarD(Vpa) + " - " + phasor.printPolarD(Vpc);
            eq09Txt = "Vca = Vθc-Vθb = " + phasor.printPolarD(Vpc) + " - " + phasor.printPolarD(Vpb);
        break;
        default:
        break;
    }

    eq10Txt = "Vab = " + phasor.printPolarD(Vab);
    eq11Txt = "Vbc = " + phasor.printPolarD(Vbc);
    eq12Txt = "Vca = " + phasor.printPolarD(Vca);

    //Update the displayed text.
    eq01.innerHTML = eq01Txt;
    eq02.innerHTML = eq02Txt;
    eq03.innerHTML = eq03Txt;
    eq04.innerHTML = eq04Txt;
    eq05.innerHTML = eq05Txt;
    eq06.innerHTML = eq06Txt;
    eq07.innerHTML = eq07Txt;
    eq08.innerHTML = eq08Txt;
    eq09.innerHTML = eq09Txt;
    eq10.innerHTML = "<b>" + eq10Txt + "</b>";
    eq11.innerHTML = "<b>" + eq11Txt + "</b>";
    eq12.innerHTML = "<b>" + eq12Txt + "</b>";

    //Update the phasor diagram.
    phasor.updateVectors(VAB, VBC, VCA, VpA, VpB, VpC, Vpa, Vpb, Vpc, Vab, Vbc, Vca);
}

const resizeImage = () =>
{
    //Get container widths and heights to figure out the max height for the transformer image.
    let leftRect   = left.getBoundingClientRect();
    let inputsRect = user_inputs.getBoundingClientRect();
    let footerRect = footer.getBoundingClientRect();
    let headerRect = header.getBoundingClientRect();
    let bodyRect   = main_body.getBoundingClientRect();
    let rightRect  = right.getBoundingClientRect();
    let chvRect    = ch_vAB.getBoundingClientRect();
    let chpRect    = ch_vpA.getBoundingClientRect();
    let div1Rect   = div1.getBoundingClientRect();
    let div2Rect   = div2.getBoundingClientRect();

    //Determine the dimensions on the left side.
    let leftColHeight = bodyRect.height - headerRect.height - footerRect.height - inputsRect.height;
    let maxImgRect = {width: .95 * leftRect.width, height: .7 * leftColHeight};

    //Get image original size so we can maintain the aspect ratio.
    let imageRect = {width: bodyImg.width, height: bodyImg.height};
    let dimRatio = {width: maxImgRect.width / imageRect.width, height: maxImgRect.height / imageRect.height};

    //Determine the largest image with the same aspect ratio.
    let ratio = Math.min(dimRatio.width, dimRatio.height);
    img_container.width = imageRect.width * ratio;
    img_container.height = imageRect.height * ratio;

    //Determine the dimensions on the right side.
    let rightColHeight = bodyRect.height - headerRect.height - footerRect.height - chvRect.height
                         - chpRect.height - div1Rect.height - div2Rect.height;
    let maxPhrRect = {width: rightRect.width, height: rightColHeight};

    let phasorHW = Math.min(.9 * maxPhrRect.width, .9 * maxPhrRect.height);
    phs_container.width = phasorHW;
    phs_container.height = phasorHW;
    
    updateImage();
    phasor.bodyDraw();
}

window.addEventListener("resize", () => 
{
    resizeImage();
});

//First time load.
bodyImg.onload    = () => resizeImage();
in1Img.onload     = () => resizeImage();
inPhaseImg.onload = () => resizeImage();
out1Img.onload    = () => resizeImage();
