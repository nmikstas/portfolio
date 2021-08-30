"use strict";

//Belt alignment manager.
class Bam
{
    static get ADJ() {return 0}
    static get MEAS() {return 1}

    constructor
    (
        parentDiv
    )
    {
        this.parentDiv = parentDiv;

        this.history = []; //Array of adjustment and measurement objects.
        this.entryNum = 0; //Unique entry number into history array.
    }

    clearData()
    {
        this.history = [];
        this.entryNum = 0;
    }

    addAdjustment()
    {
        //Create main div.
        let mainDiv = document.createElement("div");
        mainDiv.setAttribute("num", this.entryNum);
        mainDiv.classList.add("belt-border", "my-3");

        //Add delete button.
        let delBtn = document.createElement("button");
        delBtn.setAttribute("num", this.entryNum);
        delBtn.innerHTML = "X";
        delBtn.classList.add("btn", "btn-outline-danger", "float-btn", "m-1");
        
        //Pre-padding.
        let div1 = document.createElement("div");
        div1.classList.add("row", "my-2");
        let div2 = document.createElement("div");
        div2.classList.add("col-md-1");

        //Driven bubble box.
        let div3 = document.createElement("div");
        div3.classList.add("col-md-4", "belt-border");
        let h1 = document.createElement("h3");
        h1.innerHTML = "Driven";
        let div4 = document.createElement("div");
        div4.classList.add("row");
        let div5 = document.createElement("div");
        div5.classList.add("col-md-9");
        let p1 = document.createElement("p");
        p1.innerHTML = "Foot distance, dimension A<br>(.1 to 100 inches):";
        let txtDrivenDistance = document.createElement("input");
        txtDrivenDistance.classList.add("form-control");
        txtDrivenDistance.setAttribute("maxlength", 6, "type", "text");
        let div6 = document.createElement("div");
        div6.classList.add("divider", "mx-3");
        let radio1 = document.createElement("input");
        radio1.type = "radio";
        radio1.name = "driven-bubble" + this.entryNum
        radio1.checked = true;
        radio1.classList.add("mr-2");
        radio1.setAttribute("id", "driven-bubble-hi" + this.entryNum);
        let label1 = document.createElement("label");
        label1.setAttribute("for", "driven-bubble-hi" + this.entryNum);
        label1.innerHTML = "Bubble Up";
        let break1 = document.createElement("br");
        let radio2 = document.createElement("input");
        radio2.type = "radio";
        radio2.name = "driven-bubble" + this.entryNum
        radio2.classList.add("mr-2");
        radio2.setAttribute("id", "driven-bubble-lo" + this.entryNum);
        let label2 = document.createElement("label");
        label2.setAttribute("for", "driven-bubble-lo" + this.entryNum);
        label2.innerHTML = "Bubble Down";
        let break2 = document.createElement("br");
        let p2 = document.createElement("p");
        p2.innerHTML = "Bubble offset<br>(0 to 8 ticks):";
        let txtDrivenBubble = document.createElement("input");
        txtDrivenBubble.classList.add("form-control");
        txtDrivenBubble.setAttribute("maxlength", 6, "type", "text");
        let pDrivenLine = document.createElement("p");
        pDrivenLine.innerHTML = "Line down ???";
        let divDrivenLevel = document.createElement("div");
        divDrivenLevel.classList.add("col-md-3");

        //Inner divider.
        let div7 = document.createElement("div");
        div7.classList.add("col-md-2");
        
        //Driver bubble box.
        let div8 = document.createElement("div");
        div8.classList.add("col-md-4", "belt-border");
        let h2 = document.createElement("h3");
        h2.innerHTML = "Driver";
        let div9 = document.createElement("div");
        div9.classList.add("row");
        let div10 = document.createElement("div");
        div10.classList.add("col-md-9");
        let p3 = document.createElement("p");
        p3.innerHTML = "Foot distance, dimension B<br>(.1 to 100 inches):";
        let txtDriverDistance = document.createElement("input");
        txtDriverDistance.classList.add("form-control");
        txtDriverDistance.setAttribute("maxlength", 6, "type", "text");
        let div11 = document.createElement("div");
        div11.classList.add("divider", "mx-3");
        let radio3 = document.createElement("input");
        radio3.type = "radio";
        radio3.name = "driver-bubble" + this.entryNum
        radio3.checked = true;
        radio3.classList.add("mr-2");
        radio3.setAttribute("id", "driver-bubble-hi" + this.entryNum);
        let label3 = document.createElement("label");
        label3.setAttribute("for", "driver-bubble-hi" + this.entryNum);
        label3.innerHTML = "Bubble Up";
        let break3 = document.createElement("br");
        let radio4 = document.createElement("input");
        radio4.type = "radio";
        radio4.name = "driver-bubble" + this.entryNum
        radio4.classList.add("mr-2");
        radio4.setAttribute("id", "driver-bubble-lo" + this.entryNum);
        let label4 = document.createElement("label");
        label4.setAttribute("for", "driven-bubble-lo" + this.entryNum);
        label4.innerHTML = "Bubble Down";
        let break4 = document.createElement("br");
        let p4 = document.createElement("p");
        p4.innerHTML = "Bubble offset<br>(0 to 8 ticks):";
        let txtDriverBubble = document.createElement("input");
        txtDriverBubble.classList.add("form-control");
        txtDriverBubble.setAttribute("maxlength", 6, "type", "text");
        let pDriverLine = document.createElement("p");
        pDriverLine.innerHTML = "Line down ???";
        let divDriverLevel = document.createElement("div");
        divDriverLevel.classList.add("col-md-3");

        //Calculation results row.
        let div12 = document.createElement("div");
        div12.classList.add("row", "mt-3", "mx-1");
        let div13 = document.createElement("div");
        div13.classList.add("col-md-4", "belt-border");
        let h3 = document.createElement("h3");
        h3.innerHTML = "Driven to Level";
        let txtDrivenToLevel = document.createElement("p");
        txtDrivenToLevel.classList.add("align");
        txtDrivenToLevel.innerHTML = "???";
        let div14 = document.createElement("div");
        div14.classList.add("col-md-4", "belt-border");
        let h4 = document.createElement("h3");
        h4.innerHTML = "Driver to Level";
        let txtDriverToLevel = document.createElement("p");
        txtDriverToLevel.classList.add("align");
        txtDriverToLevel.innerHTML = "???";
        let div15 = document.createElement("div");
        div15.classList.add("col-md-4", "belt-border");
        let h5 = document.createElement("h3");
        h5.innerHTML = "Optimal Moves";
        let txtOptimalMoves = document.createElement("p");
        txtOptimalMoves.classList.add("align");
        txtOptimalMoves.innerHTML = "???";

        //Show/hide graph button.
        let div16 = document.createElement("div");
        div16.classList.add("row");
        let div17 = document.createElement("div");
        div17.classList.add("col-md-12");
        let hideBtn = document.createElement("button");
        hideBtn.innerHTML = "Hide Plot";
        hideBtn.classList.add("btn", "btn-outline-primary", "float-btn", "m-1");

        //Graph.
        let div18 = document.createElement("div");
        div18.classList.add("row");
        let divPlot = document.createElement("div");
        divPlot.classList.add("col-md-12");

        //Add everything together.
        mainDiv.appendChild(delBtn);
        mainDiv.appendChild(div1);
        div1.appendChild(div2);
        div1.appendChild(div3);
        div3.appendChild(h1);
        div3.appendChild(div4);
        div4.appendChild(div5);
        div5.appendChild(p1);
        div5.appendChild(txtDrivenDistance); //Has listener.
        div5.appendChild(div6);
        div5.appendChild(radio1);            //Has listener.
        div5.appendChild(label1);
        div5.appendChild(break1);
        div5.appendChild(radio2);            //Has listener.
        div5.appendChild(label2);
        div5.appendChild(break2);
        div5.appendChild(p2);
        div5.appendChild(txtDrivenBubble);   //Has listener.
        div5.appendChild(pDrivenLine);       //Has listener.
        div4.appendChild(divDrivenLevel);
        div1.appendChild(div7);
        div1.appendChild(div8);
        div8.appendChild(h2);
        div8.appendChild(div9);
        div9.appendChild(div10);
        div10.appendChild(p3);
        div10.appendChild(txtDriverDistance); //Has listener.
        div10.appendChild(div11);
        div10.appendChild(radio3);            //Has listener.
        div10.appendChild(label3);
        div10.appendChild(break3);
        div10.appendChild(radio4);            //Has listener.
        div10.appendChild(label4);
        div10.appendChild(break4);
        div10.appendChild(p4);
        div10.appendChild(txtDriverBubble);   //Has listener.
        div10.appendChild(pDriverLine);       //Has listener.
        div9.appendChild(divDriverLevel);
        mainDiv.appendChild(div12);
        div12.appendChild(div13);
        div13.appendChild(h3);
        div13.appendChild(txtDrivenToLevel);
        div12.appendChild(div14);
        div14.appendChild(h4);
        div14.appendChild(txtDriverToLevel);
        div12.appendChild(div15);
        div15.appendChild(h5);
        div15.appendChild(txtOptimalMoves);
        mainDiv.appendChild(div16);
        div16.appendChild(div17);
        div17.appendChild(hideBtn);           //Has listener.
        mainDiv.appendChild(div18);
        div18.appendChild(divPlot);
        this.parentDiv.prepend(mainDiv);

        /********************************* Class Instantiations **********************************/

        let drivenLevel = new Level(divDrivenLevel, {bubbleColor: "#3030ff"});
        let driverLevel = new Level(divDriverLevel);
        let plot = new BeltPlot(divPlot, {backgroundImg: document.getElementById("blank")});

        /********************************** JSON Instantiation ***********************************/

        //Create object of relevant stuff for the history array.
        let obj =
        {
            //Object info.
            num:                this.entryNum,
            type:               Bam.ADJ,

            //Inputs.
            driverFeetDistance: undefined,
            drivenFeetDistance: undefined,
            driverTicks:        undefined,
            drivenTicks:        undefined,
            driverBubbleHi:     true,
            drivenBubbleHi:     true,

            //Outputs.
            driverToLevel:      undefined,
            drivenToLevel:      undefined,
            driverToDriven:     undefined,
            drivenToDriver:     undefined,
            
            //Canvas variables.
            drivenLevel:        drivenLevel,
            driverLevel:        driverLevel,
            txtDrivenToLevel:   txtDrivenToLevel,
            txtDriverToLevel:   txtDriverToLevel,
            txtOptimalMoves:    txtOptimalMoves,
            plot:               plot,
            plotHidden:         false
        }

        /************************************ Event Listeners ************************************/

        //Delete button event listener.
        delBtn.addEventListener("click", () =>
        {
            let num = parseInt(delBtn.getAttribute("num"));
            mainDiv.remove();
            
            //Remove entry in history array.
            let i = 0;
            while(i < this.history.length)
            {
                if(this.history[i].num === num)
                {
                    this.history.splice(i, 1);
                    i = this.history.length;
                }
                i++;
            }
        });

        //Hide/show plot event listener.
        hideBtn.addEventListener("click", () =>
        {
            if(obj.plotHidden)
            {
                hideBtn.innerHTML = "Hide Plot";
                divPlot.style.display = "block";
                plot.resize();
                obj.plotHidden = false;
            }
            else
            {
                hideBtn.innerHTML = "Show Plot";
                divPlot.style.display = "none";
                obj.plotHidden = true;
            }
        });

        //Add listener for keystrokes.
        txtDrivenDistance.addEventListener("keyup", (e) =>
        {
            let isValid, didValidate, num;
            [isValid, didValidate, num] = this.isNumKey(e, txtDrivenDistance, .1, 100);
            if(didValidate) obj.drivenFeetDistance = isValid ? num : undefined;
            this.updatePlot(obj);
        });

        txtDriverDistance.addEventListener("keyup", (e) =>
        {
            let isValid, didValidate, num;
            [isValid, didValidate, num] = this.isNumKey(e, txtDriverDistance, .1, 100);
            if(didValidate) obj.driverFeetDistance = isValid ? num : undefined;
            this.updatePlot(obj);
        });

        txtDrivenBubble.addEventListener("keyup", (e) =>
        {
            let isValid, didValidate, num;
            [isValid, didValidate, num] = this.isNumKey(e, txtDrivenBubble, 0, 8);
            if(didValidate) obj.drivenTicks = isValid ? num : undefined;

            let signedDrivenBubble = obj.drivenBubbleHi ? obj.drivenTicks : -obj.drivenTicks;
            obj.drivenLevel.bubbleDraw(signedDrivenBubble);
            this.updatePlot(obj);

            let lineText = "Line down ";
            if(!obj.drivenBubbleHi) lineText = "Line up ";
            pDrivenLine.innerHTML = lineText + ((obj.drivenTicks === undefined) ? "???" : obj.drivenTicks.toFixed(2));
        });

        txtDriverBubble.addEventListener("keyup", (e) =>
        {
            let isValid, didValidate, num;
            [isValid, didValidate, num] = this.isNumKey(e, txtDriverBubble, 0, 8);
            if(didValidate) obj.driverTicks = isValid ? num : undefined;

            let signedDriverBubble = obj.driverBubbleHi ? obj.driverTicks : -obj.driverTicks;
            obj.driverLevel.bubbleDraw(signedDriverBubble);
            this.updatePlot(obj);

            let lineText = "Line down ";
            if(!obj.driverBubbleHi) lineText = "Line up ";
            pDriverLine.innerHTML = lineText + ((obj.driverTicks === undefined) ? "???" : obj.driverTicks.toFixed(2));
        });

        //Validate number when user leaves text box focus.
        txtDrivenDistance.addEventListener("focusout", () =>
        {
            let isValid, num;
            [isValid, num] = this.valNumber(txtDrivenDistance, .1, 100);
            obj.drivenFeetDistance = isValid ? num : undefined;
            this.updatePlot(obj);
        });

        txtDriverDistance.addEventListener("focusout", () =>
        {
            let isValid, num;
            [isValid, num] = this.valNumber(txtDriverDistance, .1, 100);
            obj.driverFeetDistance = isValid ? num : undefined;
            this.updatePlot(obj);
        });

        txtDrivenBubble.addEventListener("focusout", () =>
        {
            let isValid, num;
            [isValid, num] = this.valNumber(txtDrivenBubble, 0, 8);
            obj.drivenTicks = isValid ? num : undefined;

            let signedDrivenBubble = obj.drivenBubbleHi ? obj.drivenTicks : -obj.drivenTicks;
            obj.drivenLevel.bubbleDraw(signedDrivenBubble);
            this.updatePlot(obj);

            let lineText = "Line down ";
            if(!obj.drivenBubbleHi) lineText = "Line up ";
            pDrivenLine.innerHTML = lineText + ((obj.drivenTicks === undefined) ? "???" : obj.drivenTicks.toFixed(2));
        });

        txtDriverBubble.addEventListener("focusout", () =>
        {
            let isValid, num;
            [isValid, num] = this.valNumber(txtDriverBubble, 0, 8);
            obj.driverTicks = isValid ? num : undefined;

            let signedDriverBubble = obj.driverBubbleHi ? obj.driverTicks : -obj.driverTicks;
            obj.driverLevel.bubbleDraw(signedDriverBubble);
            this.updatePlot(obj);

            let lineText = "Line down ";
            if(!obj.driverBubbleHi) lineText = "Line up ";
            pDriverLine.innerHTML = lineText + ((obj.driverTicks === undefined) ? "???" : obj.driverTicks.toFixed(2));
        });

        //Driven radio button listener.
        radio1.addEventListener("click", () =>
        {
            obj.drivenBubbleHi = true;
            obj.drivenLevel.bubbleDraw(obj.drivenTicks);
            this.updatePlot(obj);
            pDrivenLine.innerHTML = "Line down " + ((obj.drivenTicks === undefined) ? "???" : obj.drivenTicks.toFixed(2));
        });

        radio2.addEventListener("click", () =>
        {
            obj.drivenBubbleHi = false;
            obj.drivenLevel.bubbleDraw(-obj.drivenTicks);
            this.updatePlot(obj);
            pDrivenLine.innerHTML = "Line up " + ((obj.drivenTicks === undefined) ? "???" : obj.drivenTicks.toFixed(2));
        });

        //Driver radio button listener.
        radio3.addEventListener("click", () =>
        {
            obj.driverBubbleHi = true;
            obj.driverLevel.bubbleDraw(obj.driverTicks);
            this.updatePlot(obj);
            pDriverLine.innerHTML = "Line down " + ((obj.driverTicks === undefined) ? "???" : obj.driverTicks.toFixed(2));
        });

        radio4.addEventListener("click", () =>
        {
            obj.driverBubbleHi = false;
            obj.driverLevel.bubbleDraw(-obj.driverTicks);
            this.updatePlot(obj);
            pDriverLine.innerHTML = "Line up " + ((obj.driverTicks === undefined) ? "???" : obj.driverTicks.toFixed(2));
        });

        //Add object data to history.
        this.history = [...this.history, obj];
        this.entryNum++;
    }

    updatePlot(obj)
    {
        //Find the signed values of the level variables.
        let signedDriverBubble = obj.driverBubbleHi ? obj.driverTicks : -obj.driverTicks;
        let signedDrivenBubble = obj.drivenBubbleHi ? obj.drivenTicks : -obj.drivenTicks;

        //Pass everything on for calculation.
        let moves = obj.plot.doCalcs(obj.driverFeetDistance, obj.drivenFeetDistance, signedDriverBubble, signedDrivenBubble);

        //Get the numeric results.
        [obj.driverToLevel, obj.drivenToLevel, obj.driverToDriven, obj.drivenToDriver] =
        [moves.level.dvrToLvl, moves.level.dvnToLvl, moves.optimal.dvrToDvn, moves.optimal.dvnToDvr];

        //If everything passes, display the results.
        if(obj.driverToLevel !== undefined)
        {
            //Always give the two values to the level position.
            obj.txtDriverToLevel.innerHTML = obj.driverToLevel + " mils";
            obj.txtDrivenToLevel.innerHTML = obj.drivenToLevel + " mils";
        
            //Display the optimal moves.
            let optimalCount = 0;
            obj.txtOptimalMoves.innerHTML = "";

            if(obj.driverToDriven !== undefined)
            {
                optimalCount++;
                obj.txtOptimalMoves.innerHTML += "Driver to Driven: " + obj.driverToDriven + " mils";
            }

            if(obj.drivenToDriver !== undefined)
            {
                if(optimalCount > 0) obj.txtOptimalMoves.innerHTML += "<br>";
                obj.txtOptimalMoves.innerHTML += "Driven to Driver: " + obj.drivenToDriver + " mils";
            }  
        }
        else
        {
            obj.txtDrivenToLevel.innerHTML = "???";
            obj.txtDriverToLevel.innerHTML = "???";
            obj.txtOptimalMoves.innerHTML  = "???";
            obj.plot.doCalcs(undefined, undefined, undefined, undefined);
        }
    }

    //Refresh the canvas images.
    redraw()
    {
        for(let i = 0; i < this.history.length; i++)
        {
            if(this.history[i].type === Bam.ADJ)
            {
                this.history[i].drivenLevel.resize();
                this.history[i].driverLevel.resize();
                this.history[i].plot.resize();
            }
        }
    }

    //Check if a number has been entered in the box.
    isNumKey(e, inputBox, min, max)
    {
        //Look for special case when enter is hit.
        if(e.keyCode === 13)
        {
            let isValid, num;
            [isValid, num] = this.valNumber(inputBox, min, max);
            return [isValid, true, num];
        }
        
        //Remove any invalid characters.
        let inputTemp = "";
        let isDecimal = false;
        for(let i = 0; i < inputBox.value.length; i++)
        {
            if(inputBox.value[i] === "." && !isDecimal)
            {
                inputTemp += ".";
                isDecimal = true;
            }

            if((inputBox.value[i] >= "0" && inputBox.value[i] <= "9"))
            {
                inputTemp += inputBox.value[i];
            }
        }
        
        inputBox.value = inputTemp;
        return [false, false, undefined];
    }

    //Check if the number entered is valid.
    valNumber(inputBox, min, max)
    {
        inputBox.style.backgroundColor = "#ffffff";
        let num = parseFloat(inputBox.value, 10);    
    
        if(!isNaN(num) && num >= min && num <= max)
        {
            return [true, num];
        }

        inputBox.value = "";
        inputBox.style.backgroundColor = "#ffc0c0";
        return [false, undefined];
    }













    addMeasurement()
    {
        //Create main div.
        let mainDiv = document.createElement("div");
        mainDiv.setAttribute("num", this.entryNum);
        mainDiv.classList.add("belt-border", "my-3");

        //Add delete button.
        let delBtn = document.createElement("button");
        delBtn.setAttribute("num", this.entryNum);
        delBtn.innerHTML = "X";
        delBtn.classList.add("btn", "btn-outline-danger", "float-btn", "m-1");
        delBtn.addEventListener("click", () =>
        {
            let num = parseInt(delBtn.getAttribute("num"));
            mainDiv.remove();
            
            //Remove entry in history array.
            let i = 0;
            while(i < this.history.length)
            {
                if(this.history[i].num === num)
                {
                    this.history.splice(i, 1);
                    i = this.history.length;
                }
                i++;
            }
        });

        let desc = document.createElement("p");
        desc.setAttribute("num", this.entryNum);
        desc.innerHTML = "Measurement, entry #" + this.entryNum;

        //Add everything together.
        mainDiv.appendChild(delBtn);
        mainDiv.appendChild(desc);
        this.parentDiv.prepend(mainDiv);

        //Create object of relevant stuff for the history array.
        let obj =
        {
            num: this.entryNum,
            type: Bam.MEAS,
            desc: desc.innerHTML
        }

        this.history = [...this.history, obj];
        this.entryNum++;
    }











    print()
    {
        //console.log("Generate PDF");

        for(let i = 0; i < this.history.length; i++)
        {
            console.log(this.history[i]);
        }
    }

    updateTime(x)
    {
        console.log("Update Time: " + x);
    }

    updateKwh(num)
    {
        console.log("Update KWh: " + num);
    }

    saveData()
    {
        console.log("Save Data");
    }

    loadData()
    {
        console.log("Load Data");
    }

    updateVolts(num)
    {
        console.log("Update Volts: " + num);
    }

    updateMultiplier(num)
    {
        console.log("Update Multiplier: " + num);
    }
}