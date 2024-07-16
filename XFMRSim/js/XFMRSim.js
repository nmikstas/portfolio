//Get access to the page elements.
let header = document.getElementById("header");
let footer = document.getElementById("sticky-footer");

let img_container  = document.getElementById("img-container");
let img_body       = document.getElementById("img-body");
let in1            = document.getElementById("img-in1");
let in2            = document.getElementById("img-in2");
let in3            = document.getElementById("img-in3");
let in4            = document.getElementById("img-in4");
let in5            = document.getElementById("img-in5");
let in6            = document.getElementById("img-in6");
let img_inphase    = document.getElementById("img-inphase");
let img_outofphase = document.getElementById("img-outofphase");
let out1           = document.getElementById("img-out1");
let out2           = document.getElementById("img-out2");
let out3           = document.getElementById("img-out3");
let out4           = document.getElementById("img-out4");
let out5           = document.getElementById("img-out5");
let out6           = document.getElementById("img-out6");

let input_wiring  = document.getElementById("input-wiring");
let coil_phase    = document.getElementById("coil-phase");
let output_wiring = document.getElementById("output-wiring");

let eq = document.getElementById("eq");

input_wiring.onchange = () =>
{
    in1.hidden = true;
    in2.hidden = true;
    in3.hidden = true;
    in4.hidden = true;
    in5.hidden = true;
    in6.hidden = true;

    switch(input_wiring.value)
    {
        case "input1":
            in1.hidden = false;
            break;
        case "input2":
            in2.hidden = false;
        break;
        case "input3":
            in3.hidden = false;
        break;
        case "input4":
            in4.hidden = false;
        break;
        case "input5":
            in5.hidden = false;
        break;
        case "input6":
            in6.hidden = false;
        break;
        default:
        break;
    }
}

coil_phase.onchange = () =>
{
    img_inphase.hidden = true;
    img_outofphase.hidden = true;
    coil_phase.value === "0" ? img_inphase.hidden = false : img_outofphase.hidden = false;
}

output_wiring.onchange = () =>
{
    out1.hidden = true;
    out2.hidden = true;
    out3.hidden = true;
    out4.hidden = true;
    out5.hidden = true;
    out6.hidden = true;

    switch(output_wiring.value)
    {
        case "output1":
            out1.hidden = false;
            break;
        case "output2":
            out2.hidden = false;
        break;
        case "output3":
            out3.hidden = false;
        break;
        case "output4":
            out4.hidden = false;
        break;
        case "output5":
            out5.hidden = false;
        break;
        case "output6":
            out6.hidden = false;
        break;
        default:
        break;
    }
}

