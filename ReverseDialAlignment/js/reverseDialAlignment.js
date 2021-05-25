"use strict";

let dialDist  = undefined;
let mffToDial = undefined;
let mrfToDial = undefined;
let sffToDial = undefined;
let srfToDial = undefined;
let totalDist = undefined;
let mTIR      = undefined;
let sTIR      = undefined;
let validDist = false;

//Create the dials and plot.
let sDial = new Dial(document.getElementById("stationary-dial"), {numberColor: "#c0000070", needleColor: "#700000"});
let mDial = new Dial(document.getElementById("movable-dial"), {numberColor: "#0000c070", needleColor: "#000070"});
let plot  = new ShaftPlot(document.getElementById("plot"), {backgroundImg: document.getElementById("blank")});

//Make sure everthing resets on a page refresh.
document.getElementById("dial-dist").value       = "";
document.getElementById("mff-to-dial").value     = "";
document.getElementById("mrf-to-dial").value     = "";
document.getElementById("sff-to-dial").value     = "";
document.getElementById("srf-to-dial").value     = "";
document.getElementById("total-dist").innerHTML  = "??? inches";
document.getElementById("m-tir").value           = "";
document.getElementById("s-tir").value           = "";
document.getElementById("m-tir-1/2").value       = "???";
document.getElementById("s-tir-1/2").value       = "???";
document.getElementById("m-tir-pm").value        = "???";

//Clear all inputted data.
let clearData = () =>
{
    
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
    {
        return false;
    }
    return true;
}

let isSignedNumberKey = (obj, min, max, evt) =>
{
    //Look for special case when enter is hit.
    if(evt.which === 13)
    {
        validateNumber(obj, min, max);
    }

    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57)))
    {
        if(charCode === 43 || charCode === 45) //+ or -
        {
            return true;
        }
        return false;
    }
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
            case "dial-dist":
                dialDist = num;
                console.log("dialDist = " + dialDist);
            break;
            case "mff-to-dial":
                mffToDial = num;
                console.log("mffToDial = " + mffToDial);
            break;
            case "mrf-to-dial":
                mrfToDial = num;
                console.log("mrfToDial = " + mrfToDial);
            break;
            case "sff-to-dial":
                sffToDial = num;
                console.log("sffToDial = " + sffToDial);
            break;
            case "srf-to-dial":
                srfToDial = num;
                console.log("srfToDial = " + srfToDial);
            break;
            case "m-tir":
                mTIR = num;
                console.log("mTIR = " + mTIR);
                mDial.setDial(mTIR);
            break;
            case "s-tir":
                sTIR = num;
                console.log("sTIR = " + sTIR);
                sDial.setDial(sTIR);
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
            case "dial-dist":
                dialDist = undefined;
                console.log("dialDist = " + dialDist);
            break;
            case "mff-to-dial":
                mffToDial = undefined;
                console.log("mffToDial = " + mffToDial);
            break;
            case "mrf-to-dial":
                mrfToDial = undefined;
                console.log("mrfToDial = " + mrfToDial);
            break;
            case "sff-to-dial":
                sffToDial = undefined;
                console.log("sffToDial = " + sffToDial);
            break;
            case "srf-to-dial":
                srfToDial = undefined;
                console.log("srfToDial = " + srfToDial);
            break;
            case "m-tir":
                mTIR = undefined;
                console.log("mTIR = " + mTIR);
                document.getElementById("m-tir-1/2").innerHTML = "???";
                document.getElementById("m-tir-pm").innerHTML  = "???";
                mDial.setDial(mTIR);
            break;
            case "s-tir":
                sTIR = undefined;
                console.log("sTIR = " + sTIR);
                document.getElementById("s-tir-1/2").innerHTML = "???";
                sDial.setDial(sTIR);
            break;
            default:
                console.log("Unrecognized ID");
            break;
        }
    }

    //Verify all the distances given are valid.
    validDist = true;

    if(mffToDial != undefined && mffToDial <= dialDist)
    {
        document.getElementById("mff-to-dial").style.backgroundColor = "#ffff70";
        validDist = false;
    }
    else if(mrfToDial != undefined)
    {
        document.getElementById("mff-to-dial").style.backgroundColor = "#ffffff";
    }
    
    if(mrfToDial != undefined && (mrfToDial <= mffToDial || mrfToDial <= dialDist))
    {
        document.getElementById("mrf-to-dial").style.backgroundColor = "#ffff70";
        validDist = false;
    }
    else if(mrfToDial != undefined)
    {
        document.getElementById("mrf-to-dial").style.backgroundColor = "#ffffff";
    }

    if(srfToDial != undefined && srfToDial <= sffToDial)
    {
        document.getElementById("srf-to-dial").style.backgroundColor = "#ffff70";
        validDist = false;
    }
    else if(srfToDial != undefined)
    {
        document.getElementById("srf-to-dial").style.backgroundColor = "#ffffff";
    }

    //Calculate the total length if the distances are all valid.
    if(validDist && dialDist && mffToDial && mrfToDial && sffToDial && srfToDial)
    {
        totalDist = mrfToDial + srfToDial;
        document.getElementById("total-dist").innerHTML = totalDist.toFixed(2) + " inches";
    }
    else
    {
        totalDist = undefined;
        document.getElementById("total-dist").innerHTML = "??? inches";
    }

    //Verify and calculate dial values,
    if(sTIR !== undefined)
    {
        document.getElementById("s-tir-1/2").innerHTML = (sTIR / 2).toFixed(2);
    }

    if(mTIR !== undefined)
    {
        document.getElementById("m-tir-1/2").innerHTML = (mTIR / 2).toFixed(2);
        document.getElementById("m-tir-pm").innerHTML  = (-mTIR / 2).toFixed(2);
    }


}
