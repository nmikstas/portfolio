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
costDiv.classList.add("center-div", "pagebreak");
costDiv.innerHTML = 
"<span class='quarter'>" +
"<p><b>Cost per KWh</b><br/>" + baa[0].costKwh + "</p>" +
"</span>" +
"<span class='quarter'>" +
"<p><b>Motor Voltage</b><br/>" + baa[0].motorVoltage + "</p>" +
"</span>" +
"<span class='quarter'>" +
"<p><b>Usage Multiplier</b><br/>" + baa[0].usageMultiplier + "</p>" +
"</span>" +
"<span class='quarter'>" +
"<p><b>Time Period</b><br/>" + timePeriod + "</p>" +
"</span>";
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
    let pad1Div = document.createElement("span");
    pad1Div.classList.add("fifth");

    //Driven bubble.
    let drivenInfoDiv = document.createElement("span");
    drivenInfoDiv.classList.add("quarter", "belt-border", "center-div");
    drivenInfoDiv.innerHTML = "<p class='m-0 p-0'><b>Driven</b><p>" + "<p class='output m-0 p-0'><b>Foot Distance (A): </b>" +
        obj.drivenFeetDistance + " Inches<br/>" + bubble + obj.drivenTicks + " Ticks</p>";
    let drivenCanvasDiv = document.createElement("div");
    drivenCanvasDiv.classList.add("bubble-canvas");

    let pad2Div = document.createElement("span");
    pad2Div.classList.add("tenth");

    //Driver bubble.
    let driverInfoDiv = document.createElement("span");
    driverInfoDiv.classList.add("quarter", "belt-border", "center-div");
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

    let outputDiv = document.createElement("span");
    outputDiv.innerHTML =
    "<span class='half center-div my-2'>" + option1 + "</span>" +
    "<span class='quarter center-div my-2'>" + option2 + "</span>" +
    "<span class='quarter center-div my-2'>" + option3 + "</span>";

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
    //bearingsDiv.classList.add("row");
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
        "<p><b>Driver RPM</b></p>" +
        "<p>" + obj.rpmDriver + "</p>" +
        "<p><b>Driven RPM</b></p>" +
        "<p>" + obj.rpmDriven + "</p>" +
    "</span>" +
    "<span class='quarter'>" +
        "<p><b>Highest UE(dB)</b></p>" +
        "<p>" + obj.highestUe + "</p>" +
        "<p><b>Highest Sound(DB)</b></p>" +
        "<p>" + obj.highestSnd + "</p>" +
    "</span>" +
    "<span class='quarter'>" +
        "<p><b>Belt Temperature</b></p>" +
        "<p>" + obj.beltTemp + "</p>" +
    "</span>";

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
