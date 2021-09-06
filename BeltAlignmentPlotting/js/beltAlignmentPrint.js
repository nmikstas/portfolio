"use strict";

let baa = JSON.parse(sessionStorage.getItem("beltAlignmentArray"));
sessionStorage.removeItem("beltAlignmentArray");
sessionStorage.clear();

//Get main div.
let body = document.getElementById("report-body");

//Add title and comments to the report.
let reportTitleDiv = document.createElement("div");
reportTitleDiv.classList.add("title");
let reportTitleH = document.createElement("h4");
reportTitleH.innerHTML = baa[0].title;
let reportCommentsP = document.createElement("p");
reportCommentsP.innerHTML = baa[0].comments;
reportTitleDiv.appendChild(reportTitleH);
body.appendChild(reportTitleDiv);
body.appendChild(reportCommentsP);

//Add cost data to the report.
let costTitleDiv = document.createElement("div");
costTitleDiv.classList.add("title");
let costTitleH = document.createElement("h4");
costTitleH.innerHTML = "Cost Data";

let timePeriod;
switch(baa[0].timePeriod)
{
    case Bam.WEEKLY:
        timePeriod = "Weekly";
    break;
    case Bam.YEARLY:
        timePeriod = "Yearly";
    break;
    default:
        timePeriod = "Monthly";
    break;
}

costTitleDiv.appendChild(costTitleH);
body.appendChild(costTitleDiv);
let costDiv = document.createElement("div");
costDiv.classList.add("row", "center-div", "pagebreak");
costDiv.innerHTML = 
"<div class='col-md-3'>" +
"<p><b>Cost per KWh</b><br/>" + baa[0].costKwh + "</p>" +
"</div>" +
"<div class='col-md-3'>" +
"<p><b>Motor Voltage</b><br/>" + baa[0].motorVoltage + "</p>" +
"</div>" +
"<div class='col-md-3'>" +
"<p><b>Usage Multiplier</b><br/>" + baa[0].usageMultiplier + "</p>" +
"</div>" +
"<div class='col-md-3'>" +
"<p><b>Time Period</b><br/>" + timePeriod + "</p>" +
"</div>";
body.appendChild(costDiv);

//Add adjustment block to page.
let addAdjustment = (obj, num) =>
{
    //Bubble up or down variable.
    let bubble = obj.drivenBubbleHi ? "<b>Bubble Up: </b>" : "<b>Bubble Down: </b>";

    let adjBlock = document.createElement("div");
    if(num !== 1)adjBlock.classList.add("pagebreak");
    adjBlock.innerHTML =
    "<div class='title'>" +
        "<h4>" + obj.title + "</h4>" +
    "</div>" +
    "<p>" + obj.comments + "</p>";

    let bubbleDiv = document.createElement("div");
    bubbleDiv.classList.add("row");
    let pad1Div = document.createElement("div");
    pad1Div.classList.add("col-md-1");

    //Driven bubble.
    let drivenInfoDiv = document.createElement("div");
    drivenInfoDiv.classList.add("col-md-4", "belt-border", "center-div");
    drivenInfoDiv.innerHTML = "<p class='m-0 p-0'><b>Driven</b><p>" + "<p class='output m-0 p-0'><b>Foot Distance (A): </b>" +
        obj.drivenFeetDistance + " Inches<br/>" + bubble + obj.drivenTicks + " Ticks</p>";
    let drivenCanvasDiv = document.createElement("div");
    drivenCanvasDiv.classList.add("bubble-canvas");

    //Padding between driven and driver.
    let pad2Div = document.createElement("div");
    pad2Div.classList.add("col-md-2");

    //Driver bubble.
    let driverInfoDiv = document.createElement("div");
    driverInfoDiv.classList.add("col-md-4", "belt-border", "center-div");
    driverInfoDiv.innerHTML = "<p class='m-0 p-0'><b>Driver</b><p>" + "<p class='output m-0 p-0'><b>Foot Distance (B): </b>" +
        obj.driverFeetDistance + " Inches<br/>" + bubble + obj.driverTicks + " Ticks</p>";
    let driverCanvasDiv = document.createElement("div");
    driverCanvasDiv.classList.add("bubble-canvas");
  
    //Add driver and driven bubbles to page.
    body.appendChild(adjBlock);
    adjBlock.appendChild(bubbleDiv);
    bubbleDiv.appendChild(pad1Div);
    bubbleDiv.appendChild(drivenInfoDiv);
    drivenInfoDiv.appendChild(drivenCanvasDiv);
    bubbleDiv.appendChild(pad2Div);
    bubbleDiv.appendChild(driverInfoDiv);
    driverInfoDiv.appendChild(driverCanvasDiv);

    let signedDrivenBubble = obj.drivenBubbleHi ? obj.drivenTicks : -obj.drivenTicks;
    let signedDriverBubble = obj.driverBubbleHi ? obj.driverTicks : -obj.driverTicks;

    let drivenLevel = new Level(drivenCanvasDiv, {bubbleColor: "#3030ff"});
    drivenLevel.bubbleDraw(signedDrivenBubble);
    let driverLevel = new Level(driverCanvasDiv);
    driverLevel.bubbleDraw(signedDriverBubble);

    let option1 = "<p>???</p>";
    let option2 = "<p>???</p>";
    let option3 = "<p>???</p>";

    //Form the strings for the varous output options.
    if(obj.drivenToLevel !== undefined)
    {
        option1 = "<p><b>Option1</b></p> <div class='divider'></div>" +
        "<p class='output'>Driven to Level: " + obj.drivenToLevel + 
        " mils <b>AND</b> Driver to Level: " + obj.driverToLevel + " mils</p>"; 
    }
    
    if(obj.driverToDriven !== undefined && obj.drivenToDriver !== undefined)
    {
        option2 = "<p><b>Option2</b></p> <div class='divider'></div>" +
        "<p class='output'>Driver to Driven: " + obj.driverToDriven + " mils</p>";

        option3 = "<p><b>Option3</b></p> <div class='divider'></div>" +
        "<p class='output'>Driven to Driver: " + obj.drivenToDriver + " mils</p>";
    }

    if(obj.driverToDriven !== undefined && obj.drivenToDriver === undefined)
    {
        option2 = "<p><b>Option2</b></p> <div class='divider'></div>" +
        "<p class='output'>Driver to Driven: " + obj.driverToDriven + " mils</p>";
        
        option3 = "<p><b>Option3</b></p> <div class='divider'></div>" +
        "<p class='output'>N/A</p>";
    }

    if(obj.driverToDriven === undefined && obj.drivenToDriver !== undefined)
    {
        option2 = "<p><b>Option2</b></p> <div class='divider'></div>" +
        "<p class='output'>Driven to Driver: " + obj.drivenToDriver + " mils</p>";

        option3 = "<p><b>Option3</b></p> <div class='divider'></div>" +
        "<p class='output'>N/A</p>";
    }

    if(obj.driverToDriven === undefined && obj.drivenToDriver === undefined)
    {
        option1 = "<p><b>Option1</b></p> <div class='divider'></div>" +
        "<p class='output'>???</p>";

        option2 = "<p><b>Option2</b></p> <div class='divider'></div>" +
        "<p class='output'>???</p>";

        option3 = "<p><b>Option3</b></p> <div class='divider'></div>" +
        "<p class='output'>???</p>";
    }

    //Create output calculations section.
    let outputDiv = document.createElement("div");
    outputDiv.classList.add("row");
    outputDiv.innerHTML =
    "<div class='col-md-6 center-div my-2'>" + option1 + "</div>" +
    "<div class='col-md-3 center-div my-2'>" + option2 + "</div>" +
    "<div class='col-md-3 center-div my-2'>" + option3 + "</div>";

    adjBlock.appendChild(outputDiv);

    //Add plot to page.
    let plotDiv = document.createElement("div");
    adjBlock.appendChild(plotDiv);
    
    let plot = new BeltPlot(plotDiv);
    plot.doCalcs(obj.driverFeetDistance, obj.drivenFeetDistance, signedDriverBubble, signedDrivenBubble);
}

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
    bearingsDiv.classList.add("row");
    bearingsDiv.innerHTML =
    "<div class='col-md-3'>" +
        "<h4 class='child-center'>Position 1</h4>" +
        "<div class='belt-border row px-1'>"+
            "<div class='col-md-12'><p class='px-1'><b>Horizontal</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p1hVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p1hGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Vertical</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p1vVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p1vGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Axial</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p1aVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p1aGe + "</p></div>" +
            "<div class='col-md-12 divider mx-0'></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='col-md-12'><p class='px-1'>" + obj.p1Temp + "</p></div>" +
        "</div>" +
    "</div>" +
    
    "<div class='col-md-3'>" +
        "<h4 class='child-center'>Position 2</h4>" +
        "<div class='belt-border row px-1'>"+
            "<div class='col-md-12'><p class='px-1'><b>Horizontal</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p2hVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p2hGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Vertical</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p2vVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p2vGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Axial</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p2aVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p2aGe + "</p></div>" +
            "<div class='col-md-12 divider mx-0'></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='col-md-12'><p class='px-1'>" + obj.p2Temp + "</p></div>" +
        "</div>" +
    "</div>" +

    "<div class='col-md-3'>" +
        "<h4 class='child-center'>Position 3</h4>" +
        "<div class='belt-border row px-1'>"+
            "<div class='col-md-12'><p class='px-1'><b>Horizontal</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p3hVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p3hGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Vertical</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p3vVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p3vGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Axial</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p3aVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p3aGe + "</p></div>" +
            "<div class='col-md-12 divider mx-0'></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='col-md-12'><p class='px-1'>" + obj.p3Temp + "</p></div>" +
        "</div>" +
    "</div>" +
    
    "<div class='col-md-3'>" +
        "<h4 class='child-center'>Position 4</h4>" +
        "<div class='belt-border row px-1'>"+
            "<div class='col-md-12'><p class='px-1'><b>Horizontal</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p4hVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p4hGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Vertical</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p4vVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p4vGe + "</p></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Axial</b></p></div>" +
            "<div class='col-md-6'><p class='px-1'>Vel: " + obj.p4aVel + "</p></div><div class='col-md-6'><p>gE: " + obj.p4aGe + "</p></div>" +
            "<div class='col-md-12 divider mx-0'></div>" +
            "<div class='col-md-12'><p class='px-1'><b>Temperature</b></p></div>" +
            "<div class='col-md-12'><p class='px-1'>" + obj.p4Temp + "</p></div>" +
        "</div>" +
    "</div>";

    let time;

    


    let readingsDiv = document.createElement("div");
    readingsDiv.classList.add("row", "belt-border");
    readingsDiv.innerHTML =
    "<div class='col-md-3'>" +
        "<p><b>Amp Draw(A)</b></p>" +
        "<p>" + obj.ampDraw + "</p>" +
        "<p><b>Cost</b></p>" +
        "<p class='cost-result'>" + obj.costString + "</p>" +
    "</div>" +
    "<div class='col-md-3'>" +
        "<p><b>Driver RPM</b></p>" +
        "<p>" + obj.rpmDriver + "</p>" +
        "<p><b>Driven RPM</b></p>" +
        "<p>" + obj.rpmDriven + "</p>" +
    "</div>" +
    "<div class='col-md-3'>" +
        "<p><b>Highest UE(dB)</b></p>" +
        "<p>" + obj.highestUe + "</p>" +
        "<p><b>Highest Sound(DB)</b></p>" +
        "<p>" + obj.highestSnd + "</p>" +
    "</div>" +
    "<div class='col-md-3'>" +
        "<p><b>Belt Temperature</b></p>" +
        "<p>" + obj.beltTemp + "</p>" +
    "</div>";
    
    /*
    ampDraw:    this.history[i].ampDraw,
    cost:       this.history[i].cost,
    rpmDriver:  this.history[i].rpmDriver,
    rpmDriven:  this.history[i].rpmDriven,
    beltTemp:   this.history[i].beltTemp,
    highestUe:  this.history[i].highestUe,
    highestSnd: this.history[i].highestSnd,
    */

    body.appendChild(measBlock);
    measBlock.appendChild(bearingsDiv);
    measBlock.appendChild(readingsDiv);
}

//Add the adjustment and measurement data.
for(let i = baa.length - 1; i > 0; i--)
{
    switch(baa[i].type)
    {
        case Bam.ADJ:
            addAdjustment(baa[i], i);
        break;
        case Bam.MEAS:
            addMeasurement(baa[i], i);
        break;
        default:
            console.log("Unrecognized Type");
        break;
    }
}

window.print();
console.log(baa);
