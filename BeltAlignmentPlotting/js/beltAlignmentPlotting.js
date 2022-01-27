"use strict";

let driverFeetDistance = undefined;
let drivenFeetDistance = undefined;
let driverTicks        = undefined;
let drivenTicks        = undefined;
let driverToLevel      = undefined;
let drivenToLevel      = undefined;
let driverToDriven     = undefined;
let drivenToDriver     = undefined;
let driverBubbleHi     = true;
let drivenBubbleHi     = true;

let mode = 0; //0=basic mode, any other value is advanced mode.

//Create driver and driven level classes.
let drivenLevel = new Level(document.getElementById("driven-level"), {bubbleColor: "#3030ff"});
let driverLevel = new Level(document.getElementById("driver-level"));
let plot = new BeltPlot(document.getElementById("plot"), {backgroundImg: document.getElementById("blank")});

//Callback function for updating cost data.
let changeCostData = (costKwh, voltage, mult, period, title, comments) =>
{
    //Get references to cost data HTML elements.
    let txtCostKwh = document.getElementById("kwh");
    let txtVoltage = document.getElementById("volt");
    let txtMult    = document.getElementById("mult");
    let radWeek    = document.getElementById("weekly-radio");
    let radMonth   = document.getElementById("monthly-radio");
    let radYear    = document.getElementById("yearly-radio");
    
    //Add report title and comments.
    document.getElementById("report-title").value    = title;
    document.getElementById("report-comments").value = comments;

    //Update text on the screen.
    isNaN(costKwh) ? txtCostKwh.value = "" : txtCostKwh.value = costKwh;
    isNaN(voltage) ? txtVoltage.value = "" : txtVoltage.value = voltage;
    isNaN(mult)    ? txtMult.value    = "" : txtMult.value    = mult;

    //Update radio buttons.
    switch(period)
    {
        case Bam.WEEKLY:
            radWeek.checked = true;
        break;
        case Bam.YEARLY:
            radYear.checked = true;
        break;
        default:
            radMonth.checked = true;
        break;
    }
    
    //Update data in the belt alignment manager.
    bam.updateKwh(costKwh);
    bam.updateVolts(voltage);
    bam.updateMultiplier(mult);
    bam.updateTime(period);
}

//Create belt alignment manager.
let bam = new Bam(document.getElementById("multi"), changeCostData);

//Make sure everthing resets on a page refresh.
document.getElementById("driven-bubble-hi").checked = true;
document.getElementById("driver-bubble-hi").checked = true;
document.getElementById("basic").checked = true;
document.getElementById("driver-distance").value = "";
document.getElementById("driven-distance").value = "";
document.getElementById("driver-bubble").value = "";
document.getElementById("driven-bubble").value = "";

document.getElementById("monthly-radio").checked = true;
document.getElementById("kwh").value = "";
document.getElementById("volt").value = "";
document.getElementById("mult").value = "";
document.getElementById("report-title").value = "";
document.getElementById("report-comments").value = "";
document.getElementById("advanced-use").style.display = "none";
document.getElementById("options").innerHTML = "Option 2 (Option 3)";
bam.clearData();

//Change between basic and advanced mode.
let basicAdvanced = (obj) =>
{
    if(obj.id === "basic")
    {
        document.getElementById("advanced-use").style.display = "none";
        document.getElementById("basic-use").style.display = "block";
        mode = 0;
        drivenLevel.resize();
        driverLevel.resize();
        plot.resize();
    }
    else
    {
        document.getElementById("advanced-use").style.display = "block";
        document.getElementById("basic-use").style.display = "none";
        mode = 1;
        bam.redraw();
    }
}

//Change radio buttons.
let radioChange = (obj) =>
{
    updateLineText(obj.id);
}

//Update the line direction text.
let updateLineText = (id) =>
{
    switch(id)
    {
        case "driven-bubble-hi":
            drivenBubbleHi = true;
            if(drivenTicks === undefined)
            {
                document.getElementById("driven-line").innerHTML = "Line down ???";
                drivenLevel.bubbleDraw(undefined);
            }
            else
            {
                document.getElementById("driven-line").innerHTML = "Line down " + drivenTicks.toFixed(2);
                drivenLevel.bubbleDraw(drivenTicks);
            }
        break;
        case "driven-bubble-lo":
            drivenBubbleHi = false;
            if(drivenTicks === undefined)
            {
                document.getElementById("driven-line").innerHTML = "Line up ???";
                drivenLevel.bubbleDraw(undefined);
            }
            else
            {
                document.getElementById("driven-line").innerHTML = "Line up " + drivenTicks.toFixed(2);
                drivenLevel.bubbleDraw(-drivenTicks);
            }
        break;
        case "driver-bubble-hi":
            driverBubbleHi = true;
            if(driverTicks === undefined)
            {
                document.getElementById("driver-line").innerHTML = "Line down ???";
                driverLevel.bubbleDraw(undefined);
            }
            else
            {
                document.getElementById("driver-line").innerHTML = "Line down " + driverTicks.toFixed(2);
                driverLevel.bubbleDraw(driverTicks);
            }
        break;
        case "driver-bubble-lo":
            driverBubbleHi = false;
            if(driverTicks === undefined)
            {
                document.getElementById("driver-line").innerHTML = "Line up ???";
                driverLevel.bubbleDraw(undefined);
            }
            else
            {
                document.getElementById("driver-line").innerHTML = "Line up " + driverTicks.toFixed(2);
                driverLevel.bubbleDraw(-driverTicks);
            }
        break;
        default:
            console.log("Unrecognized ID");
        break;
    }

    checkCalc();
}

let isNumberKey = (obj, min, max, evt) =>
{
    //Look for special case when enter is hit.
    if(evt.which === 13)
    {
        validateNumber(obj, min, max);
    }

    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57)))
        return false;
    return true;
}

let validateNumber = (obj, min, max) =>
{
    let num = parseFloat(obj.value, 10);    
    
    if(!isNaN(num) && num >= min && num <= max)
    {
        obj.style.backgroundColor = "#ffffff";

        switch(obj.id)
        {
            case "driven-distance":
                drivenFeetDistance = num;
            break;
            case "driver-distance":
                driverFeetDistance = num;
            break;
            case "driven-bubble":
                drivenTicks = num;
                drivenBubbleHi ? updateLineText("driven-bubble-hi") : updateLineText("driven-bubble-lo");
            break;
            case "driver-bubble":
                driverTicks = num;
                driverBubbleHi ? updateLineText("driver-bubble-hi") : updateLineText("driver-bubble-lo");
            break;
            case "kwh":
                bam.updateKwh(num);
            break;
            case "volt":
                bam.updateVolts(num);
            break;
            case "mult":
                bam.updateMultiplier(num);
            break;
            default:
                console.log("Unrecognized ID");
            break;
        }
    }
    else
    {
        obj.value = "";
        obj.style.backgroundColor = "#ffc0c0";

        switch(obj.id)
        {
            case "driven-distance":
                drivenFeetDistance = undefined;
            break;
            case "driver-distance":
                driverFeetDistance = undefined;
            break;
            case "driven-bubble":
                drivenTicks = undefined;
                drivenBubbleHi ? updateLineText("driven-bubble-hi") : updateLineText("driven-bubble-lo");
            break;
            case "driver-bubble":
                driverTicks = undefined;
                driverBubbleHi ? updateLineText("driver-bubble-hi") : updateLineText("driver-bubble-lo");
            break;
            case "kwh":
                bam.updateKwh(undefined);
            break;
            case "volt":
                bam.updateVolts(undefined);
            break;
            case "mult":
                bam.updateMultiplier(undefined);
            break;
            default:
                console.log("Unrecognized ID");
            break;
        }
    }

    checkCalc();
}

//Clear all inputted data.
let clearData = () =>
{
    //Check for advanced mode. If in advanced mode, let the belt alignment manager handle the data clear.
    if(mode)
    {
        document.getElementById("monthly-radio").checked = true;
        document.getElementById("kwh").value = "";
        document.getElementById("volt").value = "";
        document.getElementById("mult").value = "";
        document.getElementById("report-title").value = "";
        document.getElementById("report-comments").value = "";
        document.getElementById("multi").innerHTML = "";
        bam.clearData();
        return;
    }

    driverFeetDistance = undefined;
    drivenFeetDistance = undefined;
    driverTicks        = undefined;
    drivenTicks        = undefined;
    driverBubbleHi     = true;
    drivenBubbleHi     = true;

    document.getElementById("driven-bubble-hi").checked = true;
    document.getElementById("driver-bubble-hi").checked = true;
    document.getElementById("driver-distance").value = "";
    document.getElementById("driven-distance").value = "";
    document.getElementById("driver-bubble").value = "";
    document.getElementById("driven-bubble").value = "";
    document.getElementById("driver-distance").style.backgroundColor = "#ffffff";
    document.getElementById("driven-distance").style.backgroundColor = "#ffffff";
    document.getElementById("driver-bubble").style.backgroundColor = "#ffffff";
    document.getElementById("driven-bubble").style.backgroundColor = "#ffffff";
    document.getElementById("driven-line").innerHTML = "Line down ???";
    document.getElementById("driver-line").innerHTML = "Line down ???";
    document.getElementById("options").innerHTML = "Option 2 (Option 3)";

    driverLevel.bubbleDraw(undefined);
    drivenLevel.bubbleDraw(undefined);
    clearCalc();
}

let clearCalc = () =>
{
    document.getElementById("driven-to-level").innerHTML = "???";
    document.getElementById("driver-to-level").innerHTML = "???";
    document.getElementById("optimal-moves").innerHTML   = "???";
    plot.doCalcs(undefined, undefined, undefined, undefined);
}

let checkCalc = () =>
{
    if(driverFeetDistance === undefined || drivenFeetDistance === undefined || driverTicks === undefined || drivenTicks === undefined)
    {
        clearCalc();
        return;
    }

    //Find the signed values of the level variables.
    let signedDriverBubble = driverBubbleHi ? driverTicks : -driverTicks;
    let signedDrivenBubble = drivenBubbleHi ? drivenTicks : -drivenTicks;

    //Pass everything on for calculation.
    let moves = plot.doCalcs(driverFeetDistance, drivenFeetDistance, signedDriverBubble, signedDrivenBubble);

    //Get the numeric results.
    [driverToLevel, drivenToLevel, driverToDriven, drivenToDriver] =
        [moves.level.dvrToLvl, moves.level.dvnToLvl, moves.optimal.dvrToDvn, moves.optimal.dvnToDvr];

    //If everything passes, display the results.
    if(driverToLevel !== undefined)
    {
        //Always give the two values to the level position.
        document.getElementById("driver-to-level").innerHTML = driverToLevel + " mils";
        document.getElementById("driven-to-level").innerHTML = drivenToLevel + " mils";
        
        //Display the optimal moves.
        let optimalCount = 0;
        document.getElementById("optimal-moves").innerHTML = "";

        if(driverToDriven !== undefined && drivenToDriver !== undefined)
        {
            document.getElementById("options").innerHTML = "Option 2 (Option 3)";
        }
        else
        {
            document.getElementById("options").innerHTML = "Option 2 (Option 3)";
        }

        if(driverToDriven !== undefined)
        {
            optimalCount++;
            document.getElementById("optimal-moves").innerHTML += "Driver to Driven: " + driverToDriven + " mils";
        }

        if(drivenToDriver !== undefined)
        {
            if(optimalCount > 0)document.getElementById("optimal-moves").innerHTML += "<br>(";
            document.getElementById("optimal-moves").innerHTML += "Driven to Driver: " + drivenToDriver + " mils";
            if(optimalCount > 0)document.getElementById("optimal-moves").innerHTML += ")";
        }  
    }
    else
    {
        clearCalc();
    }
}

let loadData       = (e) => 
{
    let kwh = document.getElementById("kwh");
    let volt = document.getElementById("volt");
    let mult = document.getElementById("mult");
    bam.loadData(e, kwh, volt, mult);
}

let updateTitle    = (obj) => bam.updateTitle(obj.value);
let updateComments = (obj) => bam.updateComments(obj.value);
let addAdjustment  = ()    => bam.addAdjustment();
let addMeasurement = ()    => bam.addMeasurement();
let saveData       = ()    => bam.saveData();
let print          = ()    => bam.print();
let updateTime     = (x)   => bam.updateTime(x);
