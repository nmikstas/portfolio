"use strict";

let driverFeetDistance = 0;
let drivenFeetDistance = 0;
let driverTicks        = -10;
let drivenTicks        = -10;
let driverBubbleHi     = true;
let drivenBubbleHi     = true;
let driverToLevel      = 0;
let drivenToLevel      = 0;
let driverToDriven     = 0;
let drivenToDriver     = 0;

//Create driver and driven level classes.
let drivenLevel = new Level(document.getElementById("driven-level"), {bubbleColor: "#3030ff"});
let driverLevel = new Level(document.getElementById("driver-level"));
let plot = new BeltPlot(document.getElementById("plot"));

//Make sure everthing resets on a page refresh.
document.getElementById("driven-bubble-hi").checked = true;
document.getElementById("driver-bubble-hi").checked = true;
document.getElementById("driver-distance").value = "";
document.getElementById("driven-distance").value = "";
document.getElementById("driver-bubble").value = "";
document.getElementById("driven-bubble").value = "";

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
            if(drivenTicks === -10)
            {
                document.getElementById("driven-line").innerHTML = "Line down ???";
                drivenLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driven-line").innerHTML = "Line down " + drivenTicks.toFixed(2);
                drivenLevel.bubbleDraw(drivenTicks);
            }
        break;
        case "driven-bubble-lo":
            drivenBubbleHi = false;
            if(drivenTicks === -10)
            {
                document.getElementById("driven-line").innerHTML = "Line up ???";
                drivenLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driven-line").innerHTML = "Line up " + drivenTicks.toFixed(2);
                drivenLevel.bubbleDraw(-drivenTicks);
            }
        break;
        case "driver-bubble-hi":
            driverBubbleHi = true;
            if(driverTicks === -10)
            {
                document.getElementById("driver-line").innerHTML = "Line down ???";
                driverLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driver-line").innerHTML = "Line down " + driverTicks.toFixed(2);
                driverLevel.bubbleDraw(driverTicks);
            }
        break;
        case "driver-bubble-lo":
            driverBubbleHi = false;
            if(driverTicks === -10)
            {
                document.getElementById("driver-line").innerHTML = "Line up ???";
                driverLevel.bubbleDraw(-10);
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
                console.log("drivenFeetDistance = " + drivenFeetDistance);
            break;
            case "driver-distance":
                driverFeetDistance = num;
                console.log("driverFeetDistance = " + driverFeetDistance);
            break;
            case "driven-bubble":
                drivenTicks = num;
                console.log("drivenTicks = " + drivenTicks);
                drivenBubbleHi ? updateLineText("driven-bubble-hi") : updateLineText("driven-bubble-lo");
            break;
            case "driver-bubble":
                driverTicks = num;
                console.log("driverTicks = " + driverTicks);
                driverBubbleHi ? updateLineText("driver-bubble-hi") : updateLineText("driver-bubble-lo");
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
                drivenFeetDistance = 0;
                console.log("drivenFeetDistance = " + drivenFeetDistance);
            break;
            case "driver-distance":
                driverFeetDistance = 0;
                console.log("driverFeetDistance = " + driverFeetDistance);
            break;
            case "driven-bubble":
                drivenTicks = -10;
                console.log("drivenTicks = " + drivenTicks);
                drivenBubbleHi ? updateLineText("driven-bubble-hi") : updateLineText("driven-bubble-lo");
            break;
            case "driver-bubble":
                driverTicks = -10;
                console.log("driverTicks = " + driverTicks);
                driverBubbleHi ? updateLineText("driver-bubble-hi") : updateLineText("driver-bubble-lo");
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
    driverFeetDistance = 0;
    drivenFeetDistance = 0;
    driverTicks        = -10;
    drivenTicks        = -10;
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

    driverLevel.bubbleDraw(-10);
    drivenLevel.bubbleDraw(-10);

    plot.updateValues(undefined, undefined, undefined, undefined);

    checkCalc();
}

let checkCalc = () =>
{
    if(driverFeetDistance === 0 || drivenFeetDistance === 0 || driverTicks === -10 || drivenTicks === -10 )
    {
        clearCalc();
        return;
    }

    doCalc();
}

let clearCalc = () =>
{
    document.getElementById("driven-to-level").innerHTML = "???";
    document.getElementById("driver-to-level").innerHTML = "???";
    document.getElementById("optimal-moves").innerHTML   = "???";
}

let doCalc = () =>
{
    //Find the signed values of the level variables.
    let signedDriverBubble = driverBubbleHi ? driverTicks : -driverTicks;
    let signedDrivenBubble = drivenBubbleHi ? drivenTicks : -drivenTicks;

    driverToLevel  = driverFeetDistance * signedDriverBubble * 5 / 12;
    drivenToLevel  = drivenFeetDistance * signedDrivenBubble * 5 / 12;
    driverToDriven = driverFeetDistance * (signedDriverBubble - signedDrivenBubble) * 5 / 12;
    drivenToDriver = drivenFeetDistance * (signedDrivenBubble - signedDriverBubble) * 5 / 12;

    //Always give the two values to the level position.
    document.getElementById("driven-to-level").innerHTML = ((Math.sign(drivenToLevel) >= 0) ? "+" : "") + drivenToLevel.toFixed(2) + " mils";
    document.getElementById("driver-to-level").innerHTML = ((Math.sign(driverToLevel) >= 0) ? "+" : "") + driverToLevel.toFixed(2) + " mils";

    //Determine if there are 1 or 2 optimal moves.
    let numOptimalMoves = 0;
    let dvrToLvl = Math.sign(driverToLevel);
    let dvnToLvl = Math.sign(drivenToLevel);

    //Include zero as a positive number.
    if(dvrToLvl === 0) dvrToLvl = 1;
    if(dvnToLvl === 0) dvnToLvl = 1;
    numOptimalMoves = (dvrToLvl === dvnToLvl) ? 1 : 2;

    //Find the absolute slope value of the driver and driven.
    let driverSlope = Math.abs(driverTicks);
    let drivenSlope = Math.abs(drivenTicks);

    //Calculate if a plus symbol is needed in the movement.
    let dvrToDvnSign = (Math.sign(driverToDriven) >= 0) ? "+" : "";
    let dvnToDvrSign = (Math.sign(drivenToDriver) >= 0) ? "+" : "";

    let drToDn = undefined;
    let dnToDr = undefined;

    //Display the optimal moves.
    if(numOptimalMoves === 2)
    {
        document.getElementById("optimal-moves").innerHTML = "Driver to driven: " + dvrToDvnSign + driverToDriven.toFixed(2) + " mils <br>" +
                                                             "Driven to driver: " + dvnToDvrSign + drivenToDriver.toFixed(2) + " mils";
        drToDn = dvrToDvnSign + driverToDriven.toFixed(2);
        dnToDr = dvnToDvrSign + drivenToDriver.toFixed(2);
    }
    else
    {
        //Determine which is the optimal move.
        if(drivenSlope >= driverSlope)
        {
            document.getElementById("optimal-moves").innerHTML = "Driven to driver: " + dvnToDvrSign + drivenToDriver.toFixed(2) + " mils";
            dnToDr = dvnToDvrSign + drivenToDriver.toFixed(2);
        }
        else
        {
            document.getElementById("optimal-moves").innerHTML = "Driver to driven: " + dvrToDvnSign + driverToDriven.toFixed(2) + " mils";
            drToDn = dvrToDvnSign + driverToDriven.toFixed(2);
        }
    }

    //Update move values in plotter.
    let drToLv = ((Math.sign(driverToLevel) >= 0) ? "+" : "") + driverToLevel.toFixed(2);
    let dnToLv = ((Math.sign(drivenToLevel) >= 0) ? "+" : "") + drivenToLevel.toFixed(2);
    
    plot.updateMoves(drToLv, dnToLv, drToDn, dnToDr);

    //Plot the data.
    plot.updateValues(signedDriverBubble, signedDrivenBubble, driverFeetDistance, drivenFeetDistance);
}
