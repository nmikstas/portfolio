"use strict";

let driverFeetDistance = 0;
let drivenFeetDistance = 0;
let driverTicks = -10;
let drivenTicks = -10;
let driverBubbleHi = true;
let drivenBubbleHi = true;

//Create driver and driven level classes.
let drivenLevel = new Level(document.getElementById("driven-level"), {bubbleColor: "#3030ff"});
let driverLevel = new Level(document.getElementById("driver-level"));

//Make sure everthing resets on a page refresh.
document.getElementById("driven-bubble-hi").checked = true;
document.getElementById("driver-bubble-hi").checked = true;
document.getElementById("driver-distance").value = "";
document.getElementById("driven-distance").value = "";
document.getElementById("driver-bubble").value = "";
document.getElementById("driven-bubble").value = "";

//Change radio buttons.
function radioChange(obj)
{
    updateLineText(obj.id);
}

//Update the line direction text.
function updateLineText(id)
{
    switch(id)
    {
        case "driven-bubble-hi":
            drivenBubbleHi = true;
            if(drivenTicks === -10)
            {
                document.getElementById("driven-line").innerHTML = "Line low ???";
                drivenLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driven-line").innerHTML = "Line low " + drivenTicks.toFixed(2);
                drivenLevel.bubbleDraw(drivenTicks);
            }
        break;
        case "driven-bubble-lo":
            drivenBubbleHi = false;
            if(drivenTicks === -10)
            {
                document.getElementById("driven-line").innerHTML = "Line high ???";
                drivenLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driven-line").innerHTML = "Line high " + drivenTicks.toFixed(2);
                drivenLevel.bubbleDraw(-drivenTicks);
            }
        break;
        case "driver-bubble-hi":
            driverBubbleHi = true;
            if(driverTicks === -10)
            {
                document.getElementById("driver-line").innerHTML = "Line low ???";
                driverLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driver-line").innerHTML = "Line low " + driverTicks.toFixed(2);
                driverLevel.bubbleDraw(driverTicks);
            }
        break;
        case "driver-bubble-lo":
            driverBubbleHi = false;
            if(driverTicks === -10)
            {
                document.getElementById("driver-line").innerHTML = "Line high ???";
                driverLevel.bubbleDraw(-10);
            }
            else
            {
                document.getElementById("driver-line").innerHTML = "Line high " + driverTicks.toFixed(2);
                driverLevel.bubbleDraw(-driverTicks);
            }
        break;
        default:
            console.log("Unrecognized ID");
        break;
    }
}

function isNumberKey(obj, min, max, evt)
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

function validateNumber(obj, min, max)
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
}
