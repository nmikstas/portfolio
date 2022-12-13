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

//Graph watermark.
let bkImg = document.getElementById("watermark");
let bkOp  = .05;

let mode = 0; //0=basic mode, any other value is advanced mode.

//Create the dials and plot.
let sDial = new Dial(document.getElementById("stationary-dial"), {numberColor: "#c0000070", needleColor: "#700000"});
let mDial = new Dial(document.getElementById("movable-dial"), {numberColor: "#0000c070", needleColor: "#000070"});
let plot  = new ShaftPlot(document.getElementById("plot"), {backgroundImg: bkImg, backgroundAlpha: bkOp});

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
        case Sam.WEEKLY:
            radWeek.checked = true;
        break;
        case Sam.YEARLY:
            radYear.checked = true;
        break;
        default:
            radMonth.checked = true;
        break;
    }

    //Update data in the shaft alignment manager.
    sam.updateKwh(costKwh);
    sam.updateVolts(voltage);
    sam.updateMultiplier(mult);
    sam.updateTime(period);
}

//Create belt alignment manager.
let sam = new Sam
(
    document.getElementById("multi"),
    changeCostData,
    {
        backgroundImg:       bkImg,
        backgroundAlpha:     bkOp,
        movableObjectImg:    "./images/mov.png",
        stationaryObjectImg: "./images/sta.png",
        movableDialImg:      "./images/movable.png",
        stationaryDialImg:   "./images/stationary.png"
    }
);

//Make sure everthing resets on a page refresh.
document.getElementById("basic").checked              = true;
document.getElementById("monthly-radio").checked      = true;
document.getElementById("kwh").value                  = "";
document.getElementById("volt").value                 = "";
document.getElementById("mult").value                 = "";
document.getElementById("report-title").value         = "";
document.getElementById("report-comments").value      = "";
document.getElementById("advanced-use").style.display = "none";
sam.clearData();

//Change between basic and advanced mode.
let basicAdvanced = (obj) =>
{
    if(obj.id === "basic")
    {
        document.getElementById("advanced-use").style.display = "none";
        document.getElementById("basic-use").style.display = "block";
        mode = 0;
        sDial.resize();
        mDial.resize();
        plot.resize();
    }
    else
    {
        document.getElementById("advanced-use").style.display = "block";
        document.getElementById("basic-use").style.display = "none";
        mode = 1;
        sam.redraw();
    }
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
            case "kwh":
                sam.updateKwh(num);
            break;
            case "volt":
                sam.updateVolts(num);
            break;
            case "mult":
                sam.updateMultiplier(num);
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
            case "kwh":
                sam.updateKwh(undefined);
            break;
            case "volt":
                sam.updateVolts(undefined);
            break;
            case "mult":
                sam.updateMultiplier(undefined);
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

    //Pass everything on for calculation.
    let moves = plot.doCalcs(dialDist, mffToDial, mrfToDial, sffToDial, srfToDial, sTIR / 2, -mTIR / 2);

    //If everything passes, display the results.
    if(!isNaN(moves.movable.mi))
    {
        document.getElementById("mov-in1").innerHTML  = ((moves.movable.mi >= 0) ? "+" : "") + moves.movable.mi.toFixed(2) + " mils";
        document.getElementById("mov-out1").innerHTML = ((moves.movable.mo >= 0) ? "+" : "") + moves.movable.mo.toFixed(2) + " mils";
        document.getElementById("sta-in1").innerHTML  = ((moves.inboard.si >= 0) ? "+" : "") + moves.inboard.si.toFixed(2) + " mils";
        document.getElementById("mov-in2").innerHTML  = ((moves.inboard.mi >= 0) ? "+" : "") + moves.inboard.mi.toFixed(2) + " mils";
    }
    else
    {
        document.getElementById("mov-in1").innerHTML  = "???";
        document.getElementById("mov-out1").innerHTML = "???";
        document.getElementById("sta-in1").innerHTML  = "???";
        document.getElementById("mov-in2").innerHTML  = "???";
    }
}

//Clear all inputted data.
let clearData = () =>
{
    //Check for advanced mode. If in advanced mode, let the belt alignment manager handle the data clear.
    if(mode)
    {
        document.getElementById("monthly-radio").checked      = true;
        document.getElementById("kwh").value                  = "";
        document.getElementById("volt").value                 = "";
        document.getElementById("mult").value                 = "";
        document.getElementById("report-title").value         = "";
        document.getElementById("report-comments").value      = "";
        document.getElementById("multi").innerHTML            = "";
        document.getElementById("kwh").style.backgroundColor  = "";
        document.getElementById("volt").style.backgroundColor = "";
        document.getElementById("mult").style.backgroundColor = "";
        sam.clearData();
        return;
    }

    document.getElementById("dial-dist").value                   = "";
    document.getElementById("dial-dist").style.backgroundColor   = "#ffffff";
    document.getElementById("mff-to-dial").value                 = "";
    document.getElementById("mff-to-dial").style.backgroundColor = "#ffffff";
    document.getElementById("mrf-to-dial").value                 = "";
    document.getElementById("mrf-to-dial").style.backgroundColor = "#ffffff";
    document.getElementById("sff-to-dial").value                 = "";
    document.getElementById("sff-to-dial").style.backgroundColor = "#ffffff";
    document.getElementById("srf-to-dial").value                 = "";
    document.getElementById("srf-to-dial").style.backgroundColor = "#ffffff";
    document.getElementById("total-dist").innerHTML              = "??? inches";
    document.getElementById("m-tir").value                       = "";
    document.getElementById("m-tir").style.backgroundColor       = "#ffffff";
    document.getElementById("s-tir").value                       = "";
    document.getElementById("s-tir").style.backgroundColor       = "#ffffff";
    document.getElementById("m-tir-1/2").innerHTML               = "???";
    document.getElementById("s-tir-1/2").innerHTML               = "???";
    document.getElementById("m-tir-pm").innerHTML                = "???";
    document.getElementById("mov-in1").innerHTML                 = "???";
    document.getElementById("mov-out1").innerHTML                = "???";
    document.getElementById("sta-in1").innerHTML                 = "???";
    document.getElementById("mov-in2").innerHTML                 = "???";

    dialDist  = undefined;
    mffToDial = undefined;
    mrfToDial = undefined;
    sffToDial = undefined;
    srfToDial = undefined;
    totalDist = undefined;
    mTIR      = undefined;
    sTIR      = undefined;
    validDist = false;

    sDial.setDial(sTIR);
    mDial.setDial(mTIR);
    plot.doCalcs(dialDist, mffToDial, mrfToDial, sffToDial, srfToDial, sTIR / 2, -mTIR / 2);
}

//Advanced mode functions. Just pass data to the SAM.
let loadData = (e) => 
{
    let kwh = document.getElementById("kwh");
    let volt = document.getElementById("volt");
    let mult = document.getElementById("mult");
    sam.loadData(e, kwh, volt, mult);
}

let updateTitle    = (obj) => sam.updateTitle(obj.value);
let updateComments = (obj) => sam.updateComments(obj.value);
let addAdjustment  = ()    => sam.addAdjustment();
let addMeasurement = ()    => sam.addMeasurement();
let saveData       = ()    => sam.saveData();
let print          = ()    => sam.print();
let updateTime     = (x)   => sam.updateTime(x);

clearData();
