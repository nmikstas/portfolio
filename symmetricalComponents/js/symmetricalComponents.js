"use strict";

//Get access to the page elements.
let header   = document.getElementById("header");
let footer   = document.getElementById("sticky-footer");
let instRow  = document.getElementById("inst-row");
let pageBody = document.getElementById("page-body");
let col1     = document.getElementById("col-1");
let col2     = document.getElementById("col-2");
let col3     = document.getElementById("col-3");
let col4     = document.getElementById("col-4");

let unbalancedCanv = document.getElementById("unbal");
let seq1Canv       = document.getElementById("seq-1");
let seq2Canv       = document.getElementById("seq-2");
let seq0Canv       = document.getElementById("seq-0");

let unbalanced = new Phasor(unbalancedCanv);


const resize = () =>
{
    //Undo any manual height changes.
    col1.style.height = "auto";
    col2.style.height = "auto";
    col3.style.height = "auto";
    col4.style.height = "auto";

    //Get container widths and heights to figure out the max height for the transformer image.
    let bodyRect   = pageBody.getBoundingClientRect();
    let instRect   = instRow.getBoundingClientRect();
    let col1Rect   = col1.getBoundingClientRect();
    let col2Rect   = col2.getBoundingClientRect();
    let col3Rect   = col3.getBoundingClientRect();
    let col4Rect   = col4.getBoundingClientRect();

    //All canvases should have the same dimensions so one calc is ok.
    let colHeight = bodyRect.height - instRect.height - col1Rect.height;
    let colWidth  = col1Rect.width;
    let phasorHW = Math.min(.9 * colHeight, .9 * colWidth);
    unbalancedCanv.width  = phasorHW;
    unbalancedCanv.height = phasorHW;

    //Size all the description spans the same height so all the graphs are even.
    let descHeight = Math.max(col1Rect.height, col2Rect.height, col3Rect.height, col4Rect.height);
    col1.style.height = descHeight + "px";
    col2.style.height = descHeight + "px";
    col3.style.height = descHeight + "px";
    col4.style.height = descHeight + "px";

    //Redraw all the graphs.
    unbalanced.bodyDraw();
}

window.addEventListener("resize", () => resize());

resize();