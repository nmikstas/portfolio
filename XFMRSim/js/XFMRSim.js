//Make canvas images.
let bodyImg = new Image();
bodyImg.src = "./img/Body.png";
let in1Img = new Image();
in1Img.src = "./img/In1.png";
let in2Img = new Image();
in2Img.src = "./img/In2.png";
let in3Img = new Image();
in3Img.src = "./img/In3.png";
let in4Img = new Image();
in4Img.src = "./img/In4.png";
let in5Img = new Image();
in5Img.src = "./img/In5.png";
let in6Img = new Image();
in6Img.src = "./img/In6.png";
let inPhaseImg = new Image();
inPhaseImg.src = "./img/In-Phase.png";
let outPhaseImg = new Image();
outPhaseImg.src = "./img/Out-of-Phase.png";
let out1Img = new Image();
out1Img.src = "./img/Out1.png";
let out2Img = new Image();
out2Img.src = "./img/Out2.png";
let out3Img = new Image();
out3Img.src = "./img/Out3.png";
let out4Img = new Image();
out4Img.src = "./img/Out4.png";
let out5Img = new Image();
out5Img.src = "./img/Out5.png";
let out6Img = new Image();
out6Img.src = "./img/Out6.png";

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
let user_inputs   = document.getElementById("user-inputs");

let left  = document.getElementById("left");
let right = document.getElementById("right");
let eq    = document.getElementById("eq");

//Store image size. Remains constant.


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

let parentRect = left.getBoundingClientRect();
img_container.width = parentRect.width;





const updateImage = () =>
{
    let ctx = img_container.getContext("2d");

    //Get original size of images.
    let imgX = bodyImg.width;
    let imgY = bodyImg.height;

    console.log(imgX, imgY)

    //Clear the canvas.
    ctx.beginPath();
    ctx.fillStyle = "#ffffffff";
    ctx.fillRect(0, 0, img_container.width, img_container.height);
    ctx.stroke();

    //First time load.
    bodyImg.onload = () => ctx.drawImage(bodyImg, 0, 0, img_container.clientWidth, img_container.clientHeight);
    in1Img.onload = () => ctx.drawImage(in1Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
    inPhaseImg.onload = () => ctx.drawImage(inPhaseImg, 0, 0, img_container.clientWidth, img_container.clientHeight);
    out1Img.onload = () => ctx.drawImage(out1Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
    
    //Every other load after that.
    ctx.drawImage(bodyImg, 0, 0, img_container.clientWidth, img_container.clientHeight);
    ctx.drawImage(in1Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
    ctx.drawImage(inPhaseImg, 0, 0, img_container.clientWidth, img_container.clientHeight);
    ctx.drawImage(out1Img, 0, 0, img_container.clientWidth, img_container.clientHeight);
    
    
    
}

window.addEventListener("resize", () => 
    {
        let parentRect = left.getBoundingClientRect();
        img_container.width = parentRect.width;

        //console.log(img_container.width, img_container.height);
        updateImage();
    });

updateImage();
