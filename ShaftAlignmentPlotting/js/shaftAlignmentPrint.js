"use strict";

let saa = JSON.parse(sessionStorage.getItem("shaftAlignmentArray"));
sessionStorage.removeItem("shaftAlignmentArray");
sessionStorage.clear();

//Graph watermarks.
let bkImg = document.getElementById("watermark");
let bkOp  = .05

//Get main div.
let body = document.getElementById("report-body");

//Add title and comments to the report.
let reportTitleDiv = document.createElement("div");
reportTitleDiv.classList.add("title");
let reportTitleH = document.createElement("h4");
reportTitleH.innerHTML = saa[0].title;
let reportCommentsP = document.createElement("p");
reportCommentsP.innerHTML = saa[0].comments;
reportTitleDiv.appendChild(reportTitleH);
body.appendChild(reportTitleDiv);
body.appendChild(reportCommentsP);

//Add cost data to the report.
let costTitleDiv = document.createElement("div");
costTitleDiv.classList.add("title");
let costTitleH = document.createElement("h4");
costTitleH.innerHTML = "Cost Data";

let timePeriod;
switch(saa[0].timePeriod)
{
    case Sam.WEEKLY:
        timePeriod = "Weekly";
    break;
    case Sam.YEARLY:
        timePeriod = "Yearly";
    break;
    default:
        timePeriod = "Monthly";
    break;
}

costTitleDiv.appendChild(costTitleH);
body.appendChild(costTitleDiv);
let costDiv = document.createElement("div");
costDiv.classList.add("center-div", "pagebreak");
costDiv.innerHTML = 
"<span class='quarter'>" +
"<p><b>Cost per KWh</b><br/>" + saa[0].costKwh + "</p>" +
"</span>" +
"<span class='quarter'>" +
"<p><b>Motor Voltage</b><br/>" + saa[0].motorVoltage + "</p>" +
"</span>" +
"<span class='quarter'>" +
"<p><b>Usage Multiplier</b><br/>" + saa[0].usageMultiplier + "</p>" +
"</span>" +
"<span class='quarter'>" +
"<p><b>Time Period</b><br/>" + timePeriod + "</p>" +
"</span>";
body.appendChild(costDiv);

//Add adjustment block to page.
let addAdjustment = (obj, num) =>
{
    let adjBlock = document.createElement("div");
    if(num !== 1)adjBlock.classList.add("pagebreak");
    adjBlock.innerHTML =
    "<div class='title'>" +
        "<h4>" + obj.title + "</h4>" +
    "</div>" +
    "<p>" + obj.comments + "</p>" +

    "<div class='belt-border'>" +
        "<span class='third'>" +
            "<p><b>Dimension A:</b> " + obj.dimA + " inches</p>" +
            "<p><b>Dimension D:</b> " + obj.dimD + " inches</p>" +
        "</span>" +
        "<span class='third'>" +
            "<p><b>Dimension B:</b> " + obj.dimB + " inches</p>" +
            "<p><b>Dimension E:</b> " + obj.dimE + " inches</p>" +
        "</span>" +
        "<span class='third'>" +
            "<p><b>Dimension C:</b> " + obj.dimC + " inches</p>" +
            "<p><b>Dimension F:</b> " + obj.dimFString + "</p>" +
        "</span>" +
    "</div>";

    let dialBlock = document.createElement("div");
    let leftSpan = document.createElement("span");
    leftSpan.classList.add("belt-border", "half");
    let rightSpan = document.createElement("span");
    rightSpan.classList.add("belt-border", "half");
    let staSpan = document.createElement("span");
    staSpan.classList.add("third");
    let movSpan = document.createElement("span");
    movSpan.classList.add("third");

    let staInfo = document.createElement("span");
    staInfo.classList.add("two-thirds", "child-center");
    staInfo.innerHTML =
    "<img class='img-fluid small-img' src='./images/stationary.png' alt='Stationary dial'>" +
    "<p class='my-0 py-0'><b>TIR: </b>" + obj.stationaryDial + "</p>" +
    "<p class='my-0 py-0'><b>1/2 TIR:</b> " + (obj.stationaryDial / 2) + "</p>"; 

    let movInfo = document.createElement("span");
    movInfo.classList.add("two-thirds", "child-center");
    movInfo.innerHTML =
    "<img class='img-fluid small-img' src='./images/movable.png' alt='Movable dial'>" +
    "<p class='my-0 py-0'><b>TIR: </b>" + obj.movableDial + "</p>" +
    "<p class='my-0 py-0'><b>-1/2 TIR:</b> " + (-obj.movableDial / 2) + "</p>"; 

    let outBlock = document.createElement("div");
    outBlock.innerHTML =
    "<span class='half belt-border center-div px-1'>" +
        "<h4>Option 1</h4>" +
        "<span class='half px-1'>" +
            "<img class='img-fluid small-img my-0 py-0' src='./images/mov.png' alt='Movable device inboard'>" +
            "<div class='divider'></div>" +
            "<p><b>Inboard: </b>" + obj.o1InboardString + "</p>" +
        "</span>" +
        "<span class='half px-1'>" +
            "<img class='img-fluid small-img' src='./images/mov.png' alt='Movable device outboard'>" +
            "<div class='divider'></div>" +
            "<p><b>Outboard: </b>" + obj.o1OutboardString + "</p>" +
        "</span>" +
    "</span>" +

    "<span class='half belt-border center-div px-1'>" +
        "<h4>Option 2</h4>" +
        "<span class='half px-1'>" +
            "<img class='img-fluid small-img' src='./images/sta.png' alt='Stationary device inboard'>" +
            "<div class='divider'></div>" +
            "<p><b>Inboard: </b>" + obj.o2Inboard1String + "</p>" +
        "</span>" +
        "<span class='half px-1'>" +
            "<img class='img-fluid small-img' src='./images/mov.png' alt='Movable device inboard'>" +
            "<div class='divider'></div>" +
            "<p><b>Inboard: </b>" + obj.o2Inboard2String + "</p>" +
        "</span>" +
    "</span>" +
    "<div class='my-2'></div>";

    body.appendChild(adjBlock);
    leftSpan.appendChild(staInfo);
    leftSpan.appendChild(staSpan);
    rightSpan.appendChild(movInfo);
    rightSpan.appendChild(movSpan);
    dialBlock.appendChild(leftSpan);
    dialBlock.appendChild(rightSpan);
    adjBlock.appendChild(dialBlock);
    adjBlock.appendChild(outBlock);

    //Add plot to page.
    let plotDiv = document.createElement("div");
    adjBlock.appendChild(plotDiv);
    
    //Instatiate dials and plot.
    let sDial = new Dial(staSpan, {numberColor: "#c0000070", needleColor: "#700000"});
    let mDial = new Dial(movSpan, {numberColor: "#0000c070", needleColor: "#000070"});
    let plot  = new ShaftPlot(plotDiv, {backgroundImg: bkImg, backgroundAlpha: bkOp});
    sDial.setDial(obj.stationaryDial);
    mDial.setDial(obj.movableDial);
    plot.doCalcs(obj.dimA, obj.dimB, obj.dimC, obj.dimD, obj.dimE, obj.stationaryDial / 2, -obj.movableDial / 2);
};

//Add measurement block to page.
let addMeasurement = (obj, num) =>
{
    let measBlock = document.createElement("div");
    if(num !== 1)measBlock.classList.add("pagebreak");
    measBlock.innerHTML =
    "<div class='title'>" +
    "<h4>" + obj.title + "</h4>" +
    "</div>" +
    "<p>" + obj.comments + "</p>";

    let bearingsDiv = document.createElement("div");
    bearingsDiv.innerHTML =
    "<span class='quarter'>" +
        "<h4 class='child-center'>Position 1</h4>" +
        "<div class='belt-border px-1'>"+
            "<div class='whole'><p class='px-1'><b>Horizontal (X)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p1hVel + "</p></span><span class='half'><p>gE: " + obj.p1hGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Vertical (Y)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p1vVel + "</p></span><span class='half'><p>gE: " + obj.p1vGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Axial (Z)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p1aVel + "</p></span><span class='half'><p>gE: " + obj.p1aGe + "</p></span>" +
            "<div class='whole divider mx-0'></div>" +
            "<div class='whole'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='whole'><p class='px-1'>" + obj.p1Temp + "</p></div>" +
        "</div>" +
    "</span>" +
    
    "<span class='quarter'>" +
        "<h4 class='child-center'>Position 2</h4>" +
        "<div class='belt-border px-1'>"+
            "<div class='whole'><p class='px-1'><b>Horizontal (X)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p2hVel + "</p></span><span class='half'><p>gE: " + obj.p2hGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Vertical (Y)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p2vVel + "</p></span><span class='half'><p>gE: " + obj.p2vGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Axial (Z)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p2aVel + "</p></span><span class='half'><p>gE: " + obj.p2aGe + "</p></span>" +
            "<div class='whole divider mx-0'></div>" +
            "<div class='whole'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='whole'><p class='px-1'>" + obj.p2Temp + "</p></div>" +
        "</div>" +
    "</span>" +

    "<span class='quarter'>" +
        "<h4 class='child-center'>Position 3</h4>" +
        "<div class='belt-border px-1'>"+
            "<div class='whole'><p class='px-1'><b>Horizontal (X)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p3hVel + "</p></span><span class='half'><p>gE: " + obj.p3hGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Vertical (Y)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p3vVel + "</p></span><span class='half'><p>gE: " + obj.p3vGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Axial (Z)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p3aVel + "</p></span><span class='half'><p>gE: " + obj.p3aGe + "</p></span>" +
            "<div class='whole divider mx-0'></div>" +
            "<div class='whole'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='whole'><p class='px-1'>" + obj.p3Temp + "</p></div>" +
        "</div>" +
    "</span>" +
    
    "<span class='quarter'>" +
        "<h4 class='child-center'>Position 4</h4>" +
        "<div class='belt-border px-1'>"+
            "<div class='whole'><p class='px-1'><b>Horizontal (X)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p4hVel + "</p></span><span class='half'><p>gE: " + obj.p4hGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Vertical (Y)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p4vVel + "</p></span><span class='half'><p>gE: " + obj.p4vGe + "</p></span>" +
            "<div class='whole'><p class='px-1'><b>Axial (Z)</b></p></div>" +
            "<span class='half'><p class='px-1'>Vel: " + obj.p4aVel + "</p></span><span class='half'><p>gE: " + obj.p4aGe + "</p></span>" +
            "<div class='whole divider mx-0'></div>" +
            "<div class='whole'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='whole'><p class='px-1'>" + obj.p4Temp + "</p></div>" +
        "</div>" +
    "</span>";

    let readingsDiv = document.createElement("div");
    readingsDiv.classList.add("belt-border");
    readingsDiv.innerHTML =
    "<span class='quarter'>" +
        "<p><b>Amp Draw(A)</b></p>" +
        "<p>" + obj.ampDraw + "</p>" +
        "<p><b>Cost</b></p>" +
        "<p class='cost-result'>" + obj.costString + "</p>" +
    "</span>" +
    "<span class='quarter'>" +
        "<p><b>Shaft RPM</b></p>" +
        "<p>" + obj.rpmShaft + "</p>" +
    "</span>" +
    "<span class='quarter'>" +
        "<p><b>Highest UE(dB)</b></p>" +
        "<p>" + obj.highestUe + "</p>" +
        "<p><b>Highest Sound(DB)</b></p>" +
        "<p>" + obj.highestSnd + "</p>" +
    "</span>" +
    "<span class='quarter'>" +
        "<p><b>Shaft Temperature</b></p>" +
        "<p>" + obj.shaftTemp + "</p>" +
    "</span>";

    body.appendChild(measBlock);
    measBlock.appendChild(bearingsDiv);
    measBlock.appendChild(readingsDiv);
};

//Add the adjustment and measurement data.
for(let i = saa.length - 1; i > 0; i--)
{
    switch(saa[i].type)
    {
        case Sam.ADJ:
            addAdjustment(saa[i], i);
        break;
        case Sam.MEAS:
            addMeasurement(saa[i], i);
        break;
        default:
            console.log("Unrecognized Type");
        break;
    }
}

window.print();
