"use strict";

//Get access to the page elements.
let header   = document.getElementById("header");
let footer   = document.getElementById("sticky-footer");
let instRow  = document.getElementById("inst-row");
let btnRow   = document.getElementById("btn-row");
let pageBody = document.getElementById("page-body");
let col1     = document.getElementById("col-1");
let col2     = document.getElementById("col-2");
let col3     = document.getElementById("col-3");
let col4     = document.getElementById("col-4");

let unbalancedCanv = document.getElementById("unbal");
let seq1Canv       = document.getElementById("seq-1");
let seq2Canv       = document.getElementById("seq-2");
let seq0Canv       = document.getElementById("seq-0");

let btn1 = document.getElementById("btn-1");
let btn2 = document.getElementById("btn-2");
let btn3 = document.getElementById("btn-3");
let btn4 = document.getElementById("btn-4");
let btn5 = document.getElementById("btn-5");

//Component checkboxes.
let chkRow = document.getElementById("chk-row");

let chk = 
[
    document.getElementById("ch-ua"), document.getElementById("ch-ub"), document.getElementById("ch-uc"),
    document.getElementById("ch-pa"), document.getElementById("ch-pb"), document.getElementById("ch-pc"),
    document.getElementById("ch-na"), document.getElementById("ch-nb"), document.getElementById("ch-nc"),
    document.getElementById("ch-za"), document.getElementById("ch-zb"), document.getElementById("ch-zc")
];

for(let i = 0; i < chk.length; i++)
{
    chk[i].onclick = () => chClick();
}

btn1.onclick = () => btn1Click();
btn2.onclick = () => btn2Click();
btn3.onclick = () => btn3Click();
btn4.onclick = () => btn4Click();
btn5.onclick = () => btn5Click();

let unbalanced = new Phasor(unbalancedCanv, (index) => unbalCallback(index), (zoom) => zoomCallback(zoom));
let positive   = new Phasor(seq1Canv, (index) => posCallback(index), (zoom) => zoomCallback(zoom));
let negative   = new Phasor(seq2Canv, (index) => negCallback(index), (zoom) => zoomCallback(zoom));
let zero       = new Phasor(seq0Canv, (index) => zeroCallback(index), (zoom) => zoomCallback(zoom));

//Put vectors in a valid initial state and set vector colors.
positive.vec[0].color = "#ff0080";
positive.vec[1].color = "#00ffa0";
positive.vec[2].color = "#8000ff";
negative.vec[0].color = "#ff8000";
negative.vec[1].color = "#80a000";
negative.vec[2].color = "#0080ff";
zero.vec[0].color     = "#000000";
zero.vec[1].color     = "#000000";
zero.vec[2].color     = "#000000";
negative.vec[0].m = 0;
negative.vec[0].a = 0;
negative.vec[1].m = 0;
negative.vec[1].a = 0;
negative.vec[2].m = 0;
negative.vec[2].a = 0;
zero.vec[0].m = 0;
zero.vec[0].a = 0;
zero.vec[1].isVisible = false;
zero.vec[2].isVisible = false;

//Button state variables.
let isClockwise = true;
let zeroOffset = false;

const resize = () =>
{
    //Undo any manual height changes.
    col1.style.height = "auto";
    col2.style.height = "auto";
    col3.style.height = "auto";
    col4.style.height = "auto";

    //Get container widths and heights to figure out the max height for the transformer image.
    let bodyRect = pageBody.getBoundingClientRect();
    let instRect = instRow.getBoundingClientRect();
    let btnRect  = btnRow.getBoundingClientRect();
    let col1Rect = col1.getBoundingClientRect();
    let col2Rect = col2.getBoundingClientRect();
    let col3Rect = col3.getBoundingClientRect();
    let col4Rect = col4.getBoundingClientRect();

    //All canvases should have the same dimensions so one calc is ok.
    let colHeight = bodyRect.height - instRect.height - col1Rect.height - btnRect.height;
    let colWidth  = col1Rect.width;
    let phasorHW  = Math.min(colHeight, colWidth);
    unbalancedCanv.width  = phasorHW;
    unbalancedCanv.height = phasorHW;
    seq1Canv.width  = phasorHW;
    seq1Canv.height = phasorHW;
    seq2Canv.width  = phasorHW;
    seq2Canv.height = phasorHW;
    seq0Canv.width  = phasorHW;
    seq0Canv.height = phasorHW;

    //Size all the description spans the same height so all the graphs are even.
    let descHeight = Math.max(col1Rect.height, col2Rect.height, col3Rect.height, col4Rect.height);
    col1.style.height = descHeight + "px";
    col2.style.height = descHeight + "px";
    col3.style.height = descHeight + "px";
    col4.style.height = descHeight + "px";

    //Redraw all the graphs.
    unbalanced.bodyDraw();
    positive.bodyDraw();
    negative.bodyDraw();
    zero.bodyDraw();
}

//The formula for calculating Va, Vb and Vc is as follows:
//
//    |Va|   |1   1   1  ||V0|
//    |Vb| = |1   α^2 α  ||V1|
//    |Vc|   |1   α   α^2||V2|

//The formula for calculating V0, V1 and V2 is as follows:
//
//    |V0|      |1   1   1  ||Va|
//    |V1| = 1/3|1   α   α^2||Vb|
//    |V2|      |1   α^2 α  ||Vc|

//Callback functions for updating user changes across the various graphs.
const unbalCallback = (index) =>
{
    let va = unbalanced.vec[0];
    let vb = unbalanced.vec[1];
    let vc = unbalanced.vec[2];

    //First row components.
    let va0 = zero.phasorMult({m: 1/3, a: 0}, va);
    let vb0 = zero.phasorMult({m: 1/3, a: 0}, vb);
    let vc0 = zero.phasorMult({m: 1/3, a: 0}, vc);

    //Second row components.
    let va1 = zero.phasorMult({m: 1/3, a: 0}, va);
    let vb1 = zero.phasorMult({m: 1/3, a: zero.DtoR(120)}, vb);
    let vc1 = zero.phasorMult({m: 1/3, a: zero.DtoR(-120)}, vc);

    //Third row components.
    let va2 = zero.phasorMult({m: 1/3, a: 0}, va);
    let vb2 = zero.phasorMult({m: 1/3, a: zero.DtoR(-120)}, vb);
    let vc2 = zero.phasorMult({m: 1/3, a: zero.DtoR(120)}, vc);

    //Add row components together.
    let v0 = zero.phasorAdd(zero.phasorAdd(va0, vb0), vc0);
    let v1 = zero.phasorAdd(zero.phasorAdd(va1, vb1), vc1);
    let v2 = zero.phasorAdd(zero.phasorAdd(va2, vb2), vc2);

    //Update graphs.
    positive.vec[0].a = v1.a;
    positive.vec[0].m = v1.m;
    positive.vec[1].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, v1).a;
    positive.vec[1].m = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, v1).m;
    positive.vec[2].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, v1).a;
    positive.vec[2].m = zero.phasorMult({m: 1, a: zero.DtoR(120)}, v1).m;

    negative.vec[0].a = v2.a;
    negative.vec[0].m = v2.m;
    negative.vec[1].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, v2).a;
    negative.vec[1].m = zero.phasorMult({m: 1, a: zero.DtoR(120)}, v2).m;
    negative.vec[2].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, v2).a;
    negative.vec[2].m = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, v2).m;

    zero.vec[0].a = v0.a;
    zero.vec[0].m = v0.m;

    //Update component vectors.
    unbalanced.vec[3].a  = positive.vec[0].a;
    unbalanced.vec[3].m  = positive.vec[0].m;
    unbalanced.vec[4].a  = positive.vec[1].a;
    unbalanced.vec[4].m  = positive.vec[1].m;
    unbalanced.vec[5].a  = positive.vec[2].a;
    unbalanced.vec[5].m  = positive.vec[2].m;
    unbalanced.vec[6].a  = negative.vec[0].a;
    unbalanced.vec[6].m  = negative.vec[0].m;
    unbalanced.vec[7].a  = negative.vec[1].a;
    unbalanced.vec[7].m  = negative.vec[1].m;
    unbalanced.vec[8].a  = negative.vec[2].a;
    unbalanced.vec[8].m  = negative.vec[2].m;
    unbalanced.vec[9].a  = zero.vec[0].a;
    unbalanced.vec[9].m  = zero.vec[0].m;
    unbalanced.vec[10].a = zero.vec[0].a;
    unbalanced.vec[10].m = zero.vec[0].m;
    unbalanced.vec[11].a = zero.vec[0].a;
    unbalanced.vec[11].m = zero.vec[0].m;

    //Reset the zero offset button, if necessary.
    if(unbalanced.vec[9].m >= 0.01)
    {
        zeroOffset = true;
        btn4.innerHTML = "Remove Zero Seq Offset";
    }

    positive.bodyDraw();
    negative.bodyDraw();
    zero.bodyDraw();
}

const posCallback = (index) =>
{
    //Update other vectors on same graph.
    if(index === 0)
    {
        positive.vec[1].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, positive.vec[0]).a;
        positive.vec[1].m = positive.vec[0].m;
        positive.vec[2].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, positive.vec[0]).a;
        positive.vec[2].m = positive.vec[0].m;
    }
    if(index === 1)
    {
        positive.vec[0].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, positive.vec[1]).a;
        positive.vec[0].m = positive.vec[1].m;
        positive.vec[2].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, positive.vec[1]).a;
        positive.vec[2].m = positive.vec[1].m;
    }
    if(index === 2)
    {
        positive.vec[0].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, positive.vec[2]).a;
        positive.vec[0].m = positive.vec[2].m;
        positive.vec[1].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, positive.vec[2]).a;
        positive.vec[1].m = positive.vec[2].m;
    }

    //Redraw the graph.
    updateUnbalanced();
    positive.bodyDraw();
}

const negCallback = (index) =>
{
    //Update other vectors on same graph.
    if(index === 0)
    {
        negative.vec[1].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, negative.vec[0]).a;
        negative.vec[1].m = negative.vec[0].m;
        negative.vec[2].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, negative.vec[0]).a;
        negative.vec[2].m = negative.vec[0].m;
    }
    if(index === 1)
    {
        negative.vec[0].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, negative.vec[1]).a;
        negative.vec[0].m = negative.vec[1].m;
        negative.vec[2].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, negative.vec[1]).a;
        negative.vec[2].m = negative.vec[1].m;
    }
    if(index === 2)
    {
        negative.vec[0].a = zero.phasorMult({m: 1, a: zero.DtoR(120)}, negative.vec[2]).a;
        negative.vec[0].m = negative.vec[2].m;
        negative.vec[1].a = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, negative.vec[2]).a;
        negative.vec[1].m = negative.vec[2].m;
    }

    //Redraw the graph.
    updateUnbalanced();
    positive.bodyDraw();
}

const zeroCallback = (index) => updateUnbalanced();

const updateUnbalanced = () =>
{
    //Update unbalanced graph.
    let v0 = zero.vec[0];
    let v1 = positive.vec[0];
    let v2 = negative.vec[0];

    //First row components.
    let v00 = v0;
    let v10 = v1;
    let v20 = v2;

    //Second row components.
    let v01 = v0;
    let v11 = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, v1);
    let v21 = zero.phasorMult({m: 1, a: zero.DtoR(120)}, v2);

    //third row components.
    let v02 = v0;
    let v12 = zero.phasorMult({m: 1, a: zero.DtoR(120)}, v1);
    let v22 = zero.phasorMult({m: 1, a: zero.DtoR(-120)}, v2);

    let va = zero.phasorAdd(zero.phasorAdd(v00, v10), v20);
    let vb = zero.phasorAdd(zero.phasorAdd(v01, v11), v21);
    let vc = zero.phasorAdd(zero.phasorAdd(v02, v12), v22);

    unbalanced.vec[0].m = va.m;
    unbalanced.vec[0].a = va.a;
    unbalanced.vec[1].m = vb.m;
    unbalanced.vec[1].a = vb.a;
    unbalanced.vec[2].m = vc.m;
    unbalanced.vec[2].a = vc.a;

    unbalanced.vec[3].a  = positive.vec[0].a;
    unbalanced.vec[3].m  = positive.vec[0].m;
    unbalanced.vec[4].a  = positive.vec[1].a;
    unbalanced.vec[4].m  = positive.vec[1].m;
    unbalanced.vec[5].a  = positive.vec[2].a;
    unbalanced.vec[5].m  = positive.vec[2].m;
    unbalanced.vec[6].a  = negative.vec[0].a;
    unbalanced.vec[6].m  = negative.vec[0].m;
    unbalanced.vec[7].a  = negative.vec[1].a;
    unbalanced.vec[7].m  = negative.vec[1].m;
    unbalanced.vec[8].a  = negative.vec[2].a;
    unbalanced.vec[8].m  = negative.vec[2].m;
    unbalanced.vec[9].a  = zero.vec[0].a;
    unbalanced.vec[9].m  = zero.vec[0].m;
    unbalanced.vec[10].a = zero.vec[0].a;
    unbalanced.vec[10].m = zero.vec[0].m;
    unbalanced.vec[11].a = zero.vec[0].a;
    unbalanced.vec[11].m = zero.vec[0].m;

    //Redraw the graph.
    unbalanced.bodyDraw();

    //Reset the zero offset button, if necessary.
    if(unbalanced.vec[9].m >= 0.01)
    {
        zeroOffset = true;
        btn4.innerHTML = "Remove Zero Seq Offset";
    }
}

const zoomCallback = (zoom) =>
{
    //Zoom all graphs to the same value.
    unbalanced.maxMag = zoom;
    positive.maxMag = zoom;
    negative.maxMag = zoom;
    zero.maxMag = zoom;

    //Redraw all the graphs.
    unbalanced.bodyDraw();
    positive.bodyDraw();
    negative.bodyDraw();
    zero.bodyDraw();
}

//Show/hide components button.
const btn1Click = () =>
{
    unbalanced.showComp = !unbalanced.showComp;
    if(unbalanced.showComp)
    {
        unbalanced.setShowComp(true);
        btn1.innerHTML = "Hide Components";
        chkRow.style.visibility = "visible";
        for(let i = 0; i < chk.length; i++)
        {
            chk[i].checked = true;
        }
    }
    else
    {
        unbalanced.setShowComp(false);
        btn1.innerHTML = "Show Components";
        chkRow.style.visibility = "hidden";
    }
    
    unbalanced.bodyDraw();
}

//Reset button.
const btn2Click = () =>
{
    if(isClockwise)
    {
        unbalanced.vec[0] = {m: 1, a: 0,                color: "#ff0000", isVisible: true};
        unbalanced.vec[1] = {m: 1, a: -2 * Math.PI / 3, color: "#00ff00", isVisible: true};
        unbalanced.vec[2] = {m: 1, a: 2 * Math.PI / 3,  color: "#0000ff", isVisible: true};
    }
    else
    {
        unbalanced.vec[0] = {m: 1, a: 0,                color: "#ff0000", isVisible: true};
        unbalanced.vec[1] = {m: 1, a: 2 * Math.PI / 3,  color: "#00ff00", isVisible: true};
        unbalanced.vec[2] = {m: 1, a: -2 * Math.PI / 3, color: "#0000ff", isVisible: true};
    }

    zeroOffset = false;
    btn4.innerHTML = "Add Zero Seq Offset";

    unbalCallback(0);
    updateUnbalanced();
    unbalanced.doubleClick();
}

//Counterclockwise button.
const btn3Click = () =>
{
    isClockwise = !isClockwise;
    btn3.innerHTML = isClockwise ? "Counterclockwise" : "Clockwise";
    btn2Click();
}

const btn4Click = () =>
{
     zeroOffset = !zeroOffset;
     btn4.innerHTML = zeroOffset ? "Remove Zero Seq Offset" : "Add Zero Seq Offset";

     if(!zeroOffset)
     {
        zero.vec[0].m = 0;
        zero.vec[0].a = 0;
     }
     else
     {
        zero.vec[0].m = 0.5;
        zero.vec[0].a = 0;
     }

     zero.bodyDraw();
     updateUnbalanced();
     unbalanced.doubleClick();
}

const btn5Click = () =>
{
    unbalanced.vec[0].m = Math.random() * 4.5 + .5;
    unbalanced.vec[1].m = Math.random() * 4.5 + .5;
    unbalanced.vec[2].m = Math.random() * 4.5 + .5;
    unbalanced.vec[0].a = Math.random() * Math.PI * 2 - Math.PI;
    unbalanced.vec[1].a = Math.random() * Math.PI * 2 - Math.PI;
    unbalanced.vec[2].a = Math.random() * Math.PI * 2 - Math.PI;

    unbalCallback(0);
    unbalanced.doubleClick();
}

const chClick = () =>
{
    for(let i = 0; i < chk.length; i++)
    {
        if(chk[i].checked)
        {
            unbalanced.vec[i].isVisible = true;
        }
        else
        {
            unbalanced.vec[i].isVisible = false;
        }
    }

    unbalanced.bodyDraw();
} 

window.addEventListener("resize", () => resize());
resize();
