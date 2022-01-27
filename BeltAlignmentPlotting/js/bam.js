"use strict";

//Belt alignment manager.
class Bam
{
    static get ADJ()     {return 0}
    static get MEAS()    {return 1}
    static get COST()    {return 2}
    static get WEEKLY()  {return 0}
    static get MONTHLY() {return 1}
    static get YEARLY()  {return 2}

    constructor
    (
        parentDiv,
        changeCostData
    )
    {
        this.parentDiv = parentDiv;

        //Callback functions.
        this.changeCostData = changeCostData;

        this.history = []; //Array of adjustment and measurement objects.
        this.entryNum = 0; //Unique entry number into history array.

        //Cost analysis data.
        this.costKwh         = undefined;
        this.motorVoltage    = undefined;
        this.usageMultiplier = undefined;
        this.timePeriod      = Bam.MONTHLY;
        this.reportTitle     = "";
        this.reportComments  = "";
    }

    clearData()
    {
        this.history = [];
        this.entryNum = 0;
    }

    addAdjustment(object)
    {
        if(object) this.entryNum = object.num;

        /************************************* HTML Creation *************************************/

        //Create main div.
        let mainDiv = document.createElement("div");
        mainDiv.setAttribute("num", this.entryNum);
        mainDiv.classList.add("belt-border", "my-3", "px-2");

        //Add title and comments.
        let txtTitle = document.createElement("input");
        txtTitle.classList.add("form-control");
        txtTitle.setAttribute("maxlength", 80, "type", "text");
        txtTitle.setAttribute("id", "title" + this.entryNum);
        let label6 = document.createElement("label");
        label6.setAttribute("for", "title" + this.entryNum);
        label6.innerHTML = "Title (80 characters max)";
        let txtComments = document.createElement("textarea");
        txtComments.classList.add("form-control");
        txtComments.setAttribute("rows", 2);
        txtComments.setAttribute("maxlength", 1024);
        txtComments.setAttribute("id", "comments" + this.entryNum);
        let label5 = document.createElement("label");
        label5.setAttribute("for", "comments" + this.entryNum);
        label5.innerHTML = "Comments (1024 characters max)";

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
        txtDrivenDistance.classList.add("form-control", "bubble-input");
        txtDrivenDistance.setAttribute("maxlength", 6, "type", "text");
        let div6 = document.createElement("div");
        div6.classList.add("divider", "mx-3");
        let radio1 = document.createElement("input");
        radio1.type = "radio";
        radio1.name = "driven-bubble" + this.entryNum
        radio1.checked = true;
        radio1.classList.add("mr-2", "bubble-input");
        radio1.setAttribute("id", "driven-bubble-hi" + this.entryNum);
        let label1 = document.createElement("label");
        label1.setAttribute("for", "driven-bubble-hi" + this.entryNum);
        label1.innerHTML = "Bubble Up";
        let break1 = document.createElement("br");
        let radio2 = document.createElement("input");
        radio2.type = "radio";
        radio2.name = "driven-bubble" + this.entryNum
        radio2.classList.add("mr-2", "bubble-input");
        radio2.setAttribute("id", "driven-bubble-lo" + this.entryNum);
        let label2 = document.createElement("label");
        label2.setAttribute("for", "driven-bubble-lo" + this.entryNum);
        label2.innerHTML = "Bubble Down";
        let break2 = document.createElement("br");
        let p2 = document.createElement("p");
        p2.innerHTML = "Bubble offset<br>(0 to 8 ticks):";
        let txtDrivenBubble = document.createElement("input");
        txtDrivenBubble.classList.add("form-control", "bubble-input");
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
        txtDriverDistance.classList.add("form-control", "bubble-input");
        txtDriverDistance.setAttribute("maxlength", 6, "type", "text");
        let div11 = document.createElement("div");
        div11.classList.add("divider", "mx-3");
        let radio3 = document.createElement("input");
        radio3.type = "radio";
        radio3.name = "driver-bubble" + this.entryNum
        radio3.checked = true;
        radio3.classList.add("mr-2", "bubble-input");
        radio3.setAttribute("id", "driver-bubble-hi" + this.entryNum);
        let label3 = document.createElement("label");
        label3.setAttribute("for", "driver-bubble-hi" + this.entryNum);
        label3.innerHTML = "Bubble Up";
        let break3 = document.createElement("br");
        let radio4 = document.createElement("input");
        radio4.type = "radio";
        radio4.name = "driver-bubble" + this.entryNum
        radio4.classList.add("mr-2", "bubble-input");
        radio4.setAttribute("id", "driver-bubble-lo" + this.entryNum);
        let label4 = document.createElement("label");
        label4.setAttribute("for", "driven-bubble-lo" + this.entryNum);
        label4.innerHTML = "Bubble Down";
        let break4 = document.createElement("br");
        let p4 = document.createElement("p");
        p4.innerHTML = "Bubble offset<br>(0 to 8 ticks):";
        let txtDriverBubble = document.createElement("input");
        txtDriverBubble.classList.add("form-control", "bubble-input");
        txtDriverBubble.setAttribute("maxlength", 6, "type", "text");
        let pDriverLine = document.createElement("p");
        pDriverLine.innerHTML = "Line down ???";
        let divDriverLevel = document.createElement("div");
        divDriverLevel.classList.add("col-md-3");

        //Calculation results row.
        let div12 = document.createElement("div");
        div12.classList.add("row", "mt-3", "mx-1");
        let div13 = document.createElement("div");
        div13.classList.add("col-md-8", "belt-border");
        let h3 = document.createElement("h3");
        h3.innerHTML = "Option 1";
        let div19 = document.createElement("div");
        div19.classList.add("divider", "mx-3");
        let div14 = document.createElement("div");
        div14.classList.add("row", "mt-3");
        let div15 = document.createElement("div");
        div15.classList.add("col-md-6");
        let h4 = document.createElement("h4");
        h4.classList.add("align");
        h4.innerHTML = "Driven to Level";
        let txtDrivenToLevel = document.createElement("p");
        txtDrivenToLevel.classList.add("align");
        txtDrivenToLevel.innerHTML = "???";
        let div20 = document.createElement("div");
        div20.classList.add("col-md-6");
        let h5 = document.createElement("h4");
        h5.innerHTML = "Driver to Level";
        let txtDriverToLevel = document.createElement("p");
        txtDriverToLevel.classList.add("align");
        txtDriverToLevel.innerHTML = "???";
        let div21 = document.createElement("div");
        div21.classList.add("col-md-4", "belt-border");
        let options = document.createElement("h3");
        options.setAttribute("id", "options" + this.entryNum);
        options.innerHTML = "Option 2 (Option 3)";
        let div22 = document.createElement("div");
        div22.classList.add("divider", "mx-3");
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
        this.appendChildren(mainDiv, [delBtn, label6, txtTitle, label5, txtComments, div1, div12, div16, div18]);
        this.appendChildren(div1, [div2, div3, div7, div8]);
        this.appendChildren(div3, [h1, div4]);
        this.appendChildren(div4, [div5, divDrivenLevel]);
        this.appendChildren(div5, [p1, txtDrivenDistance, div6, radio1, label1, break1, radio2, label2, break2, p2, txtDrivenBubble, pDrivenLine]);        
        this.appendChildren(div8, [h2, div9]);
        this.appendChildren(div9, [div10, divDriverLevel]);
        this.appendChildren(div10, [p3, txtDriverDistance, div11, radio3, label3, break3, radio4, label4, break4, p4, txtDriverBubble, pDriverLine]);
        this.appendChildren(div12, [div13, div21]);
        this.appendChildren(div13, [h3, div19, div14]);
        this.appendChildren(div14, [div15, div20]);
        this.appendChildren(div15, [h4, txtDrivenToLevel]);
        this.appendChildren(div20, [h5, txtDriverToLevel]);
        this.appendChildren(div21, [options, div22, txtOptimalMoves]);
        div16.appendChild(div17);
        div17.appendChild(hideBtn);
        div18.appendChild(divPlot);
        this.parentDiv.prepend(mainDiv);

        /********************************* Class Instantiations **********************************/

        let drivenLevel = new Level(divDrivenLevel, {bubbleColor: "#3030ff"});
        let driverLevel = new Level(divDriverLevel);
        let plot = new BeltPlot(divPlot, {backgroundImg: document.getElementById("blank")});

        /********************************** JSON Instantiation ***********************************/

        //Create object of relevant stuff for the history array.
        let obj = {};

        if(object)
        {
            obj =
            {
                //Object info.
                num:                this.entryNum,
                type:               Bam.ADJ,
                title:              object.hasOwnProperty("title") ? object.title : "",
                comments:           object.hasOwnProperty("comments") ? object.comments : "",

                //Inputs.
                driverFeetDistance: object.hasOwnProperty("driverFeetDistance") ? object.driverFeetDistance : undefined,
                drivenFeetDistance: object.hasOwnProperty("drivenFeetDistance") ? object.drivenFeetDistance : undefined,
                driverTicks:        object.hasOwnProperty("driverTicks") ? object.driverTicks : undefined,
                drivenTicks:        object.hasOwnProperty("drivenTicks") ? object.drivenTicks : undefined,
                driverBubbleHi:     object.hasOwnProperty("driverBubbleHi") ? object.driverBubbleHi : true,
                drivenBubbleHi:     object.hasOwnProperty("drivenBubbleHi") ? object.drivenBubbleHi : true,

                //Outputs.
                driverToLevel:      object.hasOwnProperty("driverToLevel") ? object.driverToLevel : undefined,
                drivenToLevel:      object.hasOwnProperty("drivenToLevel") ? object.drivenToLevel : undefined,
                driverToDriven:     object.hasOwnProperty("driverToDriven") ? object.driverToDriven : undefined,
                drivenToDriver:     object.hasOwnProperty("drivenToDriver") ? object.drivenToDriver : undefined,
            
                //Canvas variables.
                drivenLevel:        drivenLevel,
                driverLevel:        driverLevel,
                txtDrivenToLevel:   txtDrivenToLevel,
                txtDriverToLevel:   txtDriverToLevel,
                txtOptimalMoves:    txtOptimalMoves,
                plot:               plot,
                plotHidden:         object.hasOwnProperty("plotHidden") ? object.plotHidden : false
            }
        }
        else
        {
            obj =
            {
                //Object info.
                num:                this.entryNum,
                type:               Bam.ADJ,
                title:              "",
                comments:           "",

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
        }

        //Add values to elements if object exists.
        if(object)
        {
            //Title and comments.
            txtTitle.value    = obj.title;
            txtComments.value = obj.comments;

            //Driver and driven feet distance.
            txtDriverDistance.value = isNaN(obj.driverFeetDistance) ? "" : obj.driverFeetDistance;
            txtDrivenDistance.value = isNaN(obj.drivenFeetDistance) ? "" : obj.drivenFeetDistance;

            //Bubble up/bubble down radio buttons.
            obj.drivenBubbleHi ? radio1.checked = true : radio2.checked = true;
            obj.driverBubbleHi ? radio3.checked = true : radio4.checked = true;

            //Bubble tick marks.
            txtDriverBubble.value = isNaN(obj.driverTicks) ? "" : obj.driverTicks;
            txtDrivenBubble.value = isNaN(obj.drivenTicks) ? "" : obj.drivenTicks;

            //Bubble canvases.
            let signedDrivenBubble = obj.drivenBubbleHi ? obj.drivenTicks : -obj.drivenTicks;
            obj.drivenLevel.bubbleDraw(signedDrivenBubble);
            let signedDriverBubble = obj.driverBubbleHi ? obj.driverTicks : -obj.driverTicks;
            obj.driverLevel.bubbleDraw(signedDriverBubble);

            //Line up/line down text.
            let lineText = "Line down ";
            if(!obj.drivenBubbleHi) lineText = "Line up ";
            pDrivenLine.innerHTML = lineText + ((obj.drivenTicks === undefined) ? "???" : obj.drivenTicks.toFixed(2));
            lineText = "Line down ";
            if(!obj.driverBubbleHi) lineText = "Line up ";
            pDriverLine.innerHTML = lineText + ((obj.driverTicks === undefined) ? "???" : obj.driverTicks.toFixed(2));

            //Plot and output.
            this.updatePlot(obj);

            //Hide/show button.
            if(obj.plotHidden)
            {
                hideBtn.innerHTML = "Show Plot";
                divPlot.style.display = "none";
            }
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

        //Title event listener.
        txtTitle.addEventListener("keyup", () =>
        {
            obj.title = txtTitle.value;
        });

        //Comments event listener.
        txtComments.addEventListener("keyup", () =>
        {
            obj.comments = txtComments.value;
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

        /*********************************** History Addition ************************************/

        //Add object data to history.
        this.history = [...this.history, obj];
        this.entryNum++;
    }

    addMeasurement(object)
    {
        if(object) this.entryNum = object.num;

        /************************************* HTML Creation *************************************/

        //Create main div.
        let mainDiv = document.createElement("div");
        mainDiv.setAttribute("num", this.entryNum);
        mainDiv.classList.add("belt-border", "my-3", "px-2");

        //Add delete button.
        let delBtn = document.createElement("button");
        delBtn.setAttribute("num", this.entryNum);
        delBtn.innerHTML = "X";
        delBtn.classList.add("btn", "btn-outline-danger", "float-btn", "m-1");

        //Add title and comments.
        let txtTitle = document.createElement("input");
        txtTitle.classList.add("form-control");
        txtTitle.setAttribute("maxlength", 80, "type", "text");
        txtTitle.setAttribute("id", "title" + this.entryNum);
        let label1 = document.createElement("label");
        label1.setAttribute("for", "title" + this.entryNum);
        label1.innerHTML = "Title (80 characters max)";
        let txtComments = document.createElement("textarea");
        txtComments.classList.add("form-control");
        txtComments.setAttribute("rows", 2);
        txtComments.setAttribute("maxlength", 1024);
        txtComments.setAttribute("id", "comments" + this.entryNum);
        let label2 = document.createElement("label");
        label2.setAttribute("for", "comments" + this.entryNum);
        label2.innerHTML = "Comments (1024 characters max)";

        //Position 1 data.
        let div1 = document.createElement("div");
        div1.classList.add("row", "my-2");
        let div2 = document.createElement("div");
        div2.classList.add("col-md-3");
        let h1 = document.createElement("h4");
        h1.innerHTML = "Position 1";
        let div6 = document.createElement("div");
        div6.classList.add("belt-border", "px-1");

        //Horizontal data.
        let p1 = document.createElement("p");
        p1.classList.add("center", "mb-0");
        p1.innerHTML = "Horizontal (X)"
        let div7 = document.createElement("div");
        div7.classList.add("row");
        let div8 = document.createElement("div");
        div8.classList.add("col-md-6");
        let label3 = document.createElement("label");
        label3.setAttribute("for", "p1h-vel" + this.entryNum);
        label3.innerHTML = "Vel";
        let txtp1hVel = document.createElement("input");
        txtp1hVel.classList.add("form-control", "position-input");
        txtp1hVel.setAttribute("maxlength", 6);
        txtp1hVel.setAttribute("id", "p1h-vel" + this.entryNum);
        let div9 = document.createElement("div");
        div9.classList.add("col-md-6");
        let label4 = document.createElement("label");
        label4.setAttribute("for", "p1h-ge" + this.entryNum);
        label4.innerHTML = "gE";
        let txtp1hGe = document.createElement("input");
        txtp1hGe.classList.add("form-control", "position-input");
        txtp1hGe.setAttribute("maxlength", 6);
        txtp1hGe.setAttribute("id", "p1h-ge" + this.entryNum);

        //Vertical data.
        let p2 = document.createElement("p");
        p2.classList.add("center", "mb-0");
        p2.innerHTML = "Vertical (Y)"
        let div10 = document.createElement("div");
        div10.classList.add("row");
        let div11 = document.createElement("div");
        div11.classList.add("col-md-6");
        let label5 = document.createElement("label");
        label5.setAttribute("for", "p1v-vel" + this.entryNum);
        label5.innerHTML = "Vel";
        let txtp1vVel = document.createElement("input");
        txtp1vVel.classList.add("form-control", "position-input");
        txtp1vVel.setAttribute("maxlength", 6);
        txtp1vVel.setAttribute("id", "p1v-vel" + this.entryNum);
        let div12 = document.createElement("div");
        div12.classList.add("col-md-6");
        let label6 = document.createElement("label");
        label6.setAttribute("for", "p1v-ge" + this.entryNum);
        label6.innerHTML = "gE";
        let txtp1vGe = document.createElement("input");
        txtp1vGe.classList.add("form-control", "position-input");
        txtp1vGe.setAttribute("maxlength", 6);
        txtp1vGe.setAttribute("id", "p1v-ge" + this.entryNum);

        //Axial data.
        let p3 = document.createElement("p");
        p3.classList.add("center", "mb-0");
        p3.innerHTML = "Axial (Z)"
        let div13 = document.createElement("div");
        div13.classList.add("row");
        let div14 = document.createElement("div");
        div14.classList.add("col-md-6");
        let label7 = document.createElement("label");
        label7.setAttribute("for", "p1a-vel" + this.entryNum);
        label7.innerHTML = "Vel";
        let txtp1aVel = document.createElement("input");
        txtp1aVel.classList.add("form-control", "position-input");
        txtp1aVel.setAttribute("maxlength", 6);
        txtp1aVel.setAttribute("id", "p1a-vel" + this.entryNum);
        let div15 = document.createElement("div");
        div15.classList.add("col-md-6");
        let label8 = document.createElement("label");
        label8.setAttribute("for", "p1a-ge" + this.entryNum);
        label8.innerHTML = "gE";
        let txtp1aGe = document.createElement("input");
        txtp1aGe.classList.add("form-control", "position-input");
        txtp1aGe.setAttribute("maxlength", 6);
        txtp1aGe.setAttribute("id", "p1a-ge" + this.entryNum);

        //Bearing temperature data.
        let div16 = document.createElement("div");
        div16.classList.add("divider", "mx-1", "mt-3");
        let label9 = document.createElement("label");
        label9.setAttribute("for", "p1-temp" + this.entryNum);
        label9.innerHTML = "Bearing Temperature";
        let txtp1Temp = document.createElement("input");
        txtp1Temp.classList.add("form-control", "position-input");
        txtp1Temp.setAttribute("maxlength", 6);
        txtp1Temp.setAttribute("id", "p1-temp" + this.entryNum);

        //Position 2 data.
        let div3 = document.createElement("div");
        div3.classList.add("col-md-3");
        let h2 = document.createElement("h4");
        h2.innerHTML = "Position 2";
        let div60 = document.createElement("div");
        div60.classList.add("belt-border", "px-1");

        //Horizontal data.
        let p10 = document.createElement("p");
        p10.classList.add("center", "mb-0");
        p10.innerHTML = "Horizontal (X)"
        let div70 = document.createElement("div");
        div70.classList.add("row");
        let div80 = document.createElement("div");
        div80.classList.add("col-md-6");
        let label30 = document.createElement("label");
        label30.setAttribute("for", "p2h-vel" + this.entryNum);
        label30.innerHTML = "Vel";
        let txtp2hVel = document.createElement("input");
        txtp2hVel.classList.add("form-control", "position-input");
        txtp2hVel.setAttribute("maxlength", 6);
        txtp2hVel.setAttribute("id", "p2h-vel" + this.entryNum);
        let div90 = document.createElement("div");
        div90.classList.add("col-md-6");
        let label40 = document.createElement("label");
        label40.setAttribute("for", "p2h-ge" + this.entryNum);
        label40.innerHTML = "gE";
        let txtp2hGe = document.createElement("input");
        txtp2hGe.classList.add("form-control", "position-input");
        txtp2hGe.setAttribute("maxlength", 6);
        txtp2hGe.setAttribute("id", "p2h-ge" + this.entryNum);

        //Vertical data.
        let p20 = document.createElement("p");
        p20.classList.add("center", "mb-0");
        p20.innerHTML = "Vertical (Y)"
        let div100 = document.createElement("div");
        div100.classList.add("row");
        let div110 = document.createElement("div");
        div110.classList.add("col-md-6");
        let label50 = document.createElement("label");
        label50.setAttribute("for", "p2v-vel" + this.entryNum);
        label50.innerHTML = "Vel";
        let txtp2vVel = document.createElement("input");
        txtp2vVel.classList.add("form-control", "position-input");
        txtp2vVel.setAttribute("maxlength", 6);
        txtp2vVel.setAttribute("id", "p2v-vel" + this.entryNum);
        let div120 = document.createElement("div");
        div120.classList.add("col-md-6");
        let label60 = document.createElement("label");
        label60.setAttribute("for", "p2v-ge" + this.entryNum);
        label60.innerHTML = "gE";
        let txtp2vGe = document.createElement("input");
        txtp2vGe.classList.add("form-control", "position-input");
        txtp2vGe.setAttribute("maxlength", 6);
        txtp2vGe.setAttribute("id", "p2v-ge" + this.entryNum);

        //Axial data.
        let p30 = document.createElement("p");
        p30.classList.add("center", "mb-0");
        p30.innerHTML = "Axial (Z)"
        let div130 = document.createElement("div");
        div130.classList.add("row");
        let div140 = document.createElement("div");
        div140.classList.add("col-md-6");
        let label70 = document.createElement("label");
        label70.setAttribute("for", "p2a-vel" + this.entryNum);
        label70.innerHTML = "Vel";
        let txtp2aVel = document.createElement("input");
        txtp2aVel.classList.add("form-control", "position-input");
        txtp2aVel.setAttribute("maxlength", 6);
        txtp2aVel.setAttribute("id", "p2a-vel" + this.entryNum);
        let div150 = document.createElement("div");
        div150.classList.add("col-md-6");
        let label80 = document.createElement("label");
        label80.setAttribute("for", "p2a-ge" + this.entryNum);
        label80.innerHTML = "gE";
        let txtp2aGe = document.createElement("input");
        txtp2aGe.classList.add("form-control", "position-input");
        txtp2aGe.setAttribute("maxlength", 6);
        txtp2aGe.setAttribute("id", "p2a-ge" + this.entryNum);

        //Bearing temperature data.
        let div160 = document.createElement("div");
        div160.classList.add("divider", "mx-1", "mt-3");
        let label90 = document.createElement("label");
        label90.setAttribute("for", "p2-temp" + this.entryNum);
        label90.innerHTML = "Bearing Temperature";
        let txtp2Temp = document.createElement("input");
        txtp2Temp.classList.add("form-control", "position-input");
        txtp2Temp.setAttribute("maxlength", 6);
        txtp2Temp.setAttribute("id", "p2-temp" + this.entryNum);

        //Position 3 data.
        let div4 = document.createElement("div");
        div4.classList.add("col-md-3");
        let h3 = document.createElement("h4");
        h3.innerHTML = "Position 3";
        let div600 = document.createElement("div");
        div600.classList.add("belt-border", "px-1");

        //Horizontal data.
        let p100 = document.createElement("p");
        p100.classList.add("center", "mb-0");
        p100.innerHTML = "Horizontal (X)"
        let div700 = document.createElement("div");
        div700.classList.add("row");
        let div800 = document.createElement("div");
        div800.classList.add("col-md-6");
        let label300 = document.createElement("label");
        label300.setAttribute("for", "p3h-vel" + this.entryNum);
        label300.innerHTML = "Vel";
        let txtp3hVel = document.createElement("input");
        txtp3hVel.classList.add("form-control", "position-input");
        txtp3hVel.setAttribute("maxlength", 6);
        txtp3hVel.setAttribute("id", "p3h-vel" + this.entryNum);
        let div900 = document.createElement("div");
        div900.classList.add("col-md-6");
        let label400 = document.createElement("label");
        label400.setAttribute("for", "p3h-ge" + this.entryNum);
        label400.innerHTML = "gE";
        let txtp3hGe = document.createElement("input");
        txtp3hGe.classList.add("form-control", "position-input");
        txtp3hGe.setAttribute("maxlength", 6);
        txtp3hGe.setAttribute("id", "p3h-ge" + this.entryNum);

        //Vertical data.
        let p200 = document.createElement("p");
        p200.classList.add("center", "mb-0");
        p200.innerHTML = "Vertical (Y)"
        let div1000 = document.createElement("div");
        div1000.classList.add("row");
        let div1100 = document.createElement("div");
        div1100.classList.add("col-md-6");
        let label500 = document.createElement("label");
        label500.setAttribute("for", "p3v-vel" + this.entryNum);
        label500.innerHTML = "Vel";
        let txtp3vVel = document.createElement("input");
        txtp3vVel.classList.add("form-control", "position-input");
        txtp3vVel.setAttribute("maxlength", 6);
        txtp3vVel.setAttribute("id", "p3v-vel" + this.entryNum);
        let div1200 = document.createElement("div");
        div1200.classList.add("col-md-6");
        let label600 = document.createElement("label");
        label600.setAttribute("for", "p3v-ge" + this.entryNum);
        label600.innerHTML = "gE";
        let txtp3vGe = document.createElement("input");
        txtp3vGe.classList.add("form-control", "position-input");
        txtp3vGe.setAttribute("maxlength", 6);
        txtp3vGe.setAttribute("id", "p3v-ge" + this.entryNum);

        //Axial data.
        let p300 = document.createElement("p");
        p300.classList.add("center", "mb-0");
        p300.innerHTML = "Axial (Z)"
        let div1300 = document.createElement("div");
        div1300.classList.add("row");
        let div1400 = document.createElement("div");
        div1400.classList.add("col-md-6");
        let label700 = document.createElement("label");
        label700.setAttribute("for", "p3a-vel" + this.entryNum);
        label700.innerHTML = "Vel";
        let txtp3aVel = document.createElement("input");
        txtp3aVel.classList.add("form-control", "position-input");
        txtp3aVel.setAttribute("maxlength", 6);
        txtp3aVel.setAttribute("id", "p3a-vel" + this.entryNum);
        let div1500 = document.createElement("div");
        div1500.classList.add("col-md-6");
        let label800 = document.createElement("label");
        label800.setAttribute("for", "p3a-ge" + this.entryNum);
        label800.innerHTML = "gE";
        let txtp3aGe = document.createElement("input");
        txtp3aGe.classList.add("form-control", "position-input");
        txtp3aGe.setAttribute("maxlength", 6);
        txtp3aGe.setAttribute("id", "p3a-ge" + this.entryNum);

        //Bearing temperature data.
        let div1600 = document.createElement("div");
        div1600.classList.add("divider", "mx-1", "mt-3");
        let label900 = document.createElement("label");
        label900.setAttribute("for", "p3-temp" + this.entryNum);
        label900.innerHTML = "Bearing Temperature";
        let txtp3Temp = document.createElement("input");
        txtp3Temp.classList.add("form-control", "position-input");
        txtp3Temp.setAttribute("maxlength", 6);
        txtp3Temp.setAttribute("id", "p3-temp" + this.entryNum);

        //Position 4 data.
        let div5 = document.createElement("div");
        div5.classList.add("col-md-3");
        let h4 = document.createElement("h4");
        h4.innerHTML = "Position 4";
        let div6000 = document.createElement("div");
        div6000.classList.add("belt-border", "px-1");

        //Horizontal data.
        let p1000 = document.createElement("p");
        p1000.classList.add("center", "mb-0");
        p1000.innerHTML = "Horizontal (X)"
        let div7000 = document.createElement("div");
        div7000.classList.add("row");
        let div8000 = document.createElement("div");
        div8000.classList.add("col-md-6");
        let label3000 = document.createElement("label");
        label3000.setAttribute("for", "p4h-vel" + this.entryNum);
        label3000.innerHTML = "Vel";
        let txtp4hVel = document.createElement("input");
        txtp4hVel.classList.add("form-control", "position-input");
        txtp4hVel.setAttribute("maxlength", 6);
        txtp4hVel.setAttribute("id", "p4h-vel" + this.entryNum);
        let div9000 = document.createElement("div");
        div9000.classList.add("col-md-6");
        let label4000 = document.createElement("label");
        label4000.setAttribute("for", "p4h-ge" + this.entryNum);
        label4000.innerHTML = "gE";
        let txtp4hGe = document.createElement("input");
        txtp4hGe.classList.add("form-control", "position-input");
        txtp4hGe.setAttribute("maxlength", 6);
        txtp4hGe.setAttribute("id", "p4h-ge" + this.entryNum);

        //Vertical data.
        let p2000 = document.createElement("p");
        p2000.classList.add("center", "mb-0");
        p2000.innerHTML = "Vertical (Y)"
        let div10000 = document.createElement("div");
        div10000.classList.add("row");
        let div11000 = document.createElement("div");
        div11000.classList.add("col-md-6");
        let label5000 = document.createElement("label");
        label5000.setAttribute("for", "p4v-vel" + this.entryNum);
        label5000.innerHTML = "Vel";
        let txtp4vVel = document.createElement("input");
        txtp4vVel.classList.add("form-control", "position-input");
        txtp4vVel.setAttribute("maxlength", 6);
        txtp4vVel.setAttribute("id", "p4v-vel" + this.entryNum);
        let div12000 = document.createElement("div");
        div12000.classList.add("col-md-6");
        let label6000 = document.createElement("label");
        label6000.setAttribute("for", "p4v-ge" + this.entryNum);
        label6000.innerHTML = "gE";
        let txtp4vGe = document.createElement("input");
        txtp4vGe.classList.add("form-control", "position-input");
        txtp4vGe.setAttribute("maxlength", 6);
        txtp4vGe.setAttribute("id", "p4v-ge" + this.entryNum);

        //Axial data.
        let p3000 = document.createElement("p");
        p3000.classList.add("center", "mb-0");
        p3000.innerHTML = "Axial (Z)"
        let div13000 = document.createElement("div");
        div13000.classList.add("row");
        let div14000 = document.createElement("div");
        div14000.classList.add("col-md-6");
        let label7000 = document.createElement("label");
        label7000.setAttribute("for", "p4a-vel" + this.entryNum);
        label7000.innerHTML = "Vel";
        let txtp4aVel = document.createElement("input");
        txtp4aVel.classList.add("form-control", "position-input");
        txtp4aVel.setAttribute("maxlength", 6);
        txtp4aVel.setAttribute("id", "p4a-vel" + this.entryNum);
        let div15000 = document.createElement("div");
        div15000.classList.add("col-md-6");
        let label8000 = document.createElement("label");
        label8000.setAttribute("for", "p4a-ge" + this.entryNum);
        label8000.innerHTML = "gE";
        let txtp4aGe = document.createElement("input");
        txtp4aGe.classList.add("form-control", "position-input");
        txtp4aGe.setAttribute("maxlength", 6);
        txtp4aGe.setAttribute("id", "p4a-ge" + this.entryNum);

        //Bearing temperature data.
        let div16000 = document.createElement("div");
        div16000.classList.add("divider", "mx-1", "mt-3");
        let label9000 = document.createElement("label");
        label9000.setAttribute("for", "p4-temp" + this.entryNum);
        label9000.innerHTML = "Bearing Temperature";
        let txtp4Temp = document.createElement("input");
        txtp4Temp.classList.add("form-control", "position-input");
        txtp4Temp.setAttribute("maxlength", 6);
        txtp4Temp.setAttribute("id", "p4-temp" + this.entryNum);

        //Motor data.
        let div1m = document.createElement("div");
        div1m.classList.add("belt-border", "mb-1", "mx-1", "row");

        //Column 1.
        let div2m = document.createElement("div");
        div2m.classList.add("col-md-3");
        let label1m = document.createElement("label");
        label1m.setAttribute("for", "amp-draw" + this.entryNum);
        label1m.innerHTML = "Amp Draw(.01 to 1000)";
        let txtAmpDraw = document.createElement("input");
        txtAmpDraw.classList.add("form-control", "position-input");
        txtAmpDraw.setAttribute("maxlength", 6);
        txtAmpDraw.setAttribute("id", "amp-draw" + this.entryNum);
        let label2m = document.createElement("label");
        label2m.setAttribute("for", "motor-cost" + this.entryNum);
        label2m.innerHTML = "Motor Operation Cost";
        let txtCost = document.createElement("h4");
        txtCost.setAttribute("id", "motor-cost" + this.entryNum);
        txtCost.style.textAlign = "left";
        txtCost.innerHTML = "???";

        //Column 2.
        let div2m2 = document.createElement("div");
        div2m2.classList.add("col-md-3");
        let label1m2 = document.createElement("label");
        label1m2.setAttribute("for", "driver-rpm" + this.entryNum);
        label1m2.innerHTML = "Driver RPM";
        let txtDvrRpm = document.createElement("input");
        txtDvrRpm.classList.add("form-control", "position-input");
        txtDvrRpm.setAttribute("maxlength", 6);
        txtDvrRpm.setAttribute("id", "driver-rpm" + this.entryNum);
        let label2m2 = document.createElement("label");
        label2m2.setAttribute("for", "driven-rpm" + this.entryNum);
        label2m2.innerHTML = "Driven RPM";
        let txtDvnRpm = document.createElement("input");
        txtDvnRpm.classList.add("form-control", "position-input");
        txtDvnRpm.setAttribute("maxlength", 6);
        txtDvnRpm.setAttribute("id", "driven-rpm" + this.entryNum);

        //Column 3.
        let div2m3 = document.createElement("div");
        div2m3.classList.add("col-md-3");
        let label1m3 = document.createElement("label");
        label1m3.setAttribute("for", "highest-ue" + this.entryNum);
        label1m3.innerHTML = "Highest UE(dB)";
        let txtHighestUe = document.createElement("input");
        txtHighestUe.classList.add("form-control", "position-input");
        txtHighestUe.setAttribute("maxlength", 7);
        txtHighestUe.setAttribute("id", "highest-ue" + this.entryNum);
        let label2m3 = document.createElement("label");
        label2m3.setAttribute("for", "highest-snd" + this.entryNum);
        label2m3.innerHTML = "Highest Sound(DB)";
        let txtHighestSnd = document.createElement("input");
        txtHighestSnd.classList.add("form-control", "position-input");
        txtHighestSnd.setAttribute("maxlength", 7);
        txtHighestSnd.setAttribute("id", "highest-snd" + this.entryNum);

        //Column 4.
        let div2m4 = document.createElement("div");
        div2m4.classList.add("col-md-3");
        let label1m4 = document.createElement("label");
        label1m4.setAttribute("for", "belt-temp" + this.entryNum);
        label1m4.innerHTML = "Belt Temperature";
        let txtBeltTemp = document.createElement("input");
        txtBeltTemp.classList.add("form-control", "position-input");
        txtBeltTemp.setAttribute("maxlength", 6);
        txtBeltTemp.setAttribute("id", "belt-temp" + this.entryNum);

        //Add everything together.
        this.appendChildren(mainDiv, [delBtn, label1, txtTitle, label2, txtComments, div1, div1m]);
        this.appendChildren(div1, [div2, div3, div4, div5]);
        this.appendChildren(div2, [h1, div6]);
        this.appendChildren(div6, [p1, div7, p2, div10, p3, div13, div16, label9, txtp1Temp]);
        this.appendChildren(div7, [div8, div9]);
        this.appendChildren(div8, [label3, txtp1hVel]);
        this.appendChildren(div9, [label4, txtp1hGe]);
        this.appendChildren(div10, [div11, div12]);
        this.appendChildren(div11, [label5, txtp1vVel]);
        this.appendChildren(div12, [label6, txtp1vGe]);
        this.appendChildren(div13, [div14, div15]);
        this.appendChildren(div14, [label7, txtp1aVel]);
        this.appendChildren(div15, [label8, txtp1aGe]);
        this.appendChildren(div3, [h2, div60]);
        this.appendChildren(div60, [p10, div70, p20, div100, p30, div130, div160, label90, txtp2Temp]);
        this.appendChildren(div70, [div80, div90]);
        this.appendChildren(div80, [label30, txtp2hVel]);
        this.appendChildren(div90, [label40, txtp2hGe]);
        this.appendChildren(div100, [div110, div120]);
        this.appendChildren(div110, [label50, txtp2vVel]);
        this.appendChildren(div120, [label60, txtp2vGe]);
        this.appendChildren(div130, [div140, div150]);
        this.appendChildren(div140, [label70, txtp2aVel]);
        this.appendChildren(div150, [label80, txtp2aGe]);
        this.appendChildren(div4, [h3, div600]);
        this.appendChildren(div600, [p100, div700, p200, div1000, p300, div1300, div1600, label900, txtp3Temp]);
        this.appendChildren(div700, [div800, div900]);
        this.appendChildren(div800, [label300, txtp3hVel]);
        this.appendChildren(div900, [label400, txtp3hGe]);
        this.appendChildren(div1000, [div1100, div1200]);
        this.appendChildren(div1100, [label500, txtp3vVel]);
        this.appendChildren(div1200, [label600, txtp3vGe]);
        this.appendChildren(div1300, [div1400, div1500]);
        this.appendChildren(div1400, [label700, txtp3aVel]);
        this.appendChildren(div1500, [label800, txtp3aGe]);
        this.appendChildren(div5, [h4, div6000]);
        this.appendChildren(div6000, [p1000, div7000, p2000, div10000, p3000, div13000, div16000, label9000, txtp4Temp]);
        this.appendChildren(div7000, [div8000, div9000]);
        this.appendChildren(div8000, [label3000, txtp4hVel]);
        this.appendChildren(div9000, [label4000, txtp4hGe]);
        this.appendChildren(div10000, [div11000, div12000]);
        this.appendChildren(div11000, [label5000, txtp4vVel]);
        this.appendChildren(div12000, [label6000, txtp4vGe]);
        this.appendChildren(div13000, [div14000, div15000]);
        this.appendChildren(div14000, [label7000, txtp4aVel]);
        this.appendChildren(div15000, [label8000, txtp4aGe]);
        this.appendChildren(div1m, [div2m, div2m2, div2m3, div2m4]);
        this.appendChildren(div2m, [label1m, txtAmpDraw, label2m, txtCost]);
        this.appendChildren(div2m2, [label1m2, txtDvrRpm, label2m2, txtDvnRpm]);
        this.appendChildren(div2m3, [label1m3, txtHighestUe, label2m3, txtHighestSnd]);
        this.appendChildren(div2m4, [label1m4, txtBeltTemp]);
        this.parentDiv.prepend(mainDiv);

        /********************************** JSON Instantiation ***********************************/

        //Create object of relevant stuff for the history array.
        let obj = {};

        if(object)
        {

            obj =
            {
                //Object info.
                num:      this.entryNum,
                type:     Bam.MEAS,
                title:    object.title,
                comments: object.comments,

                //Bearing data.
                p1hVel: object.p1hVel, p1hGe: object.p1hGe, p1vVel: object.p1vVel, p1vGe: object.p1vGe, p1aVel: object.p1aVel, p1aGe: object.p1aGe, p1Temp: object.p1Temp,
                p2hVel: object.p2hVel, p2hGe: object.p2hGe, p2vVel: object.p2vVel, p2vGe: object.p2vGe, p2aVel: object.p2aVel, p2aGe: object.p2aGe, p2Temp: object.p2Temp,
                p3hVel: object.p3hVel, p3hGe: object.p3hGe, p3vVel: object.p3vVel, p3vGe: object.p3vGe, p3aVel: object.p3aVel, p3aGe: object.p3aGe, p3Temp: object.p3Temp,
                p4hVel: object.p4hVel, p4hGe: object.p4hGe, p4vVel: object.p4vVel, p4vGe: object.p4vGe, p4aVel: object.p4aVel, p4aGe: object.p4aGe, p4Temp: object.p4Temp,

                //Motor data.
                ampDraw:    object.hasOwnProperty("ampDraw") ? object.ampDraw : undefined,
                cost:       object.hasOwnProperty("cost")    ? object.cost    : undefined,
                rpmDriver:  object.rpmDriver,
                rpmDriven:  object.rpmDriven,
                beltTemp:   object.beltTemp,
                highestUe:  object.highestUe,
                highestSnd: object.highestSnd,

                //Cost analysis.
                txtCost: txtCost
            }
        }
        else
        {
            obj =
            {
                //Object info.
                num:      this.entryNum,
                type:     Bam.MEAS,
                title:    "",
                comments: "",

                //Bearing data.
                p1hVel: "", p1hGe: "", p1vVel: "", p1vGe: "", p1aVel: "", p1aGe: "", p1Temp: "",
                p2hVel: "", p2hGe: "", p2vVel: "", p2vGe: "", p2aVel: "", p2aGe: "", p2Temp: "",
                p3hVel: "", p3hGe: "", p3vVel: "", p3vGe: "", p3aVel: "", p3aGe: "", p3Temp: "",
                p4hVel: "", p4hGe: "", p4vVel: "", p4vGe: "", p4aVel: "", p4aGe: "", p4Temp: "",

                //Motor data.
                ampDraw:    undefined,
                cost:       undefined,
                costString: "",
                rpmDriver:  "",
                rpmDriven:  "",
                beltTemp:   "",
                highestUe:  "",
                highestSnd: "",

                //Cost analysis.
                txtCost: txtCost
            }
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

        //Amp draw text box event listeners.
        txtAmpDraw.addEventListener("keyup", (e) =>
        {
            let isValid, didValidate, num;
            [isValid, didValidate, num] = this.isNumKey(e, txtAmpDraw, .01, 1000);
            if(didValidate) obj.ampDraw = isValid ? num : undefined;
            this.updateCosts();
        });

        txtAmpDraw.addEventListener("focusout", () =>
        {
            let isValid, num;
            [isValid, num] = this.valNumber(txtAmpDraw, .01, 1000);
            obj.ampDraw = isValid ? num : undefined;
            this.updateCosts();
        });

        txtTitle.addEventListener("keyup", () => obj.title = txtTitle.value);                //Title event listener.
        txtComments.addEventListener("keyup", () => obj.comments = txtComments.value);       //Comments event listener.
        txtp1hVel.addEventListener("keyup", () => obj.p1hVel = txtp1hVel.value);             //Position 1, horizontal vel event listener.
        txtp1hGe.addEventListener("keyup", () => obj.p1hGe = txtp1hGe.value);                //Position 1, horizontal gE event listener.
        txtp1vVel.addEventListener("keyup", () => obj.p1vVel = txtp1vVel.value);             //Position 1, vertical vel event listener.
        txtp1vGe.addEventListener("keyup", () => obj.p1vGe = txtp1vGe.value);                //Position 1, vertical gE event listener.
        txtp1aVel.addEventListener("keyup", () => obj.p1aVel = txtp1aVel.value);             //Position 1, axial vel event listener.
        txtp1aGe.addEventListener("keyup", () => obj.p1aGe = txtp1aGe.value);                //Position 1, axial gE event listener.
        txtp1Temp.addEventListener("keyup", () => obj.p1Temp = txtp1Temp.value);             //Position 1, bearing temperature event listener.
        txtp2hVel.addEventListener("keyup", () => obj.p2hVel = txtp2hVel.value);             //Position 2, horizontal vel event listener.
        txtp2hGe.addEventListener("keyup", () => obj.p2hGe = txtp2hGe.value);                //Position 2, horizontal gE event listener.
        txtp2vVel.addEventListener("keyup", () => obj.p2vVel = txtp2vVel.value);             //Position 2, vertical vel event listener.
        txtp2vGe.addEventListener("keyup", () => obj.p2vGe = txtp2vGe.value);                //Position 2, vertical gE event listener.
        txtp2aVel.addEventListener("keyup", () => obj.p2aVel = txtp2aVel.value);             //Position 2, axial vel event listener.
        txtp2aGe.addEventListener("keyup", () => obj.p2aGe = txtp2aGe.value);                //Position 2, axial gE event listener.
        txtp2Temp.addEventListener("keyup", () => obj.p2Temp = txtp2Temp.value);             //Position 2, bearing temperature event listener.
        txtp3hVel.addEventListener("keyup", () => obj.p3hVel = txtp3hVel.value);             //Position 3, horizontal vel event listener.
        txtp3hGe.addEventListener("keyup", () => obj.p3hGe = txtp3hGe.value);                //Position 3, horizontal gE event listener.
        txtp3vVel.addEventListener("keyup", () => obj.p3vVel = txtp3vVel.value);             //Position 3, vertical vel event listener.
        txtp3vGe.addEventListener("keyup", () => obj.p3vGe = txtp3vGe.value);                //Position 3, vertical gE event listener.
        txtp3aVel.addEventListener("keyup", () => obj.p3aVel = txtp3aVel.value);             //Position 3, axial vel event listener.
        txtp3aGe.addEventListener("keyup", () => obj.p3aGe = txtp3aGe.value);                //Position 3, axial gE event listener.
        txtp3Temp.addEventListener("keyup", () => obj.p3Temp = txtp3Temp.value);             //Position 3, bearing temperature event listener.
        txtp4hVel.addEventListener("keyup", () => obj.p4hVel = txtp4hVel.value);             //Position 4, horizontal vel event listener.
        txtp4hGe.addEventListener("keyup", () => obj.p4hGe = txtp4hGe.value);                //Position 4, horizontal gE event listener.
        txtp4vVel.addEventListener("keyup", () => obj.p4vVel = txtp4vVel.value);             //Position 4, vertical vel event listener.
        txtp4vGe.addEventListener("keyup", () => obj.p4vGe = txtp4vGe.value);                //Position 4, vertical gE event listener.
        txtp4aVel.addEventListener("keyup", () => obj.p4aVel = txtp4aVel.value);             //Position 4, axial vel event listener.
        txtp4aGe.addEventListener("keyup", () => obj.p4aGe = txtp4aGe.value);                //Position 4, axial gE event listener.
        txtp4Temp.addEventListener("keyup", () => obj.p4Temp = txtp4Temp.value);             //Position 4, bearing temperature event listener.
        txtDvrRpm.addEventListener("keyup", () => obj.rpmDriver = txtDvrRpm.value);          //Driver RPM event listener.
        txtDvnRpm.addEventListener("keyup", () => obj.rpmDriven = txtDvnRpm.value);          //Driver RPM event listener.
        txtHighestUe.addEventListener("keyup", () => obj.highestUe = txtHighestUe.value);    //Highest ultrasound event listener.
        txtHighestSnd.addEventListener("keyup", () => obj.highestSnd = txtHighestSnd.value); //Highest audible noise event listener.
        txtBeltTemp.addEventListener("keyup", () => obj.beltTemp = txtBeltTemp.value);       //Belt temperature event listener.

        /******************************** Update Existing Objects ********************************/

        //Add values to elements if object exists.
        if(object)
        {
            txtTitle.value      = obj.title;
            txtComments.value   = obj.comments;
            txtp1hVel.value     = obj.p1hVel;
            txtp1hGe.value      = obj.p1hGe;
            txtp1vVel.value     = obj.p1vVel;
            txtp1vGe.value      = obj.p1vGe;
            txtp1aVel.value     = obj.p1aVel;
            txtp1aGe.value      = obj.p1aGe;
            txtp1Temp.value     = obj.p1Temp;
            txtp2hVel.value     = obj.p2hVel;
            txtp2hGe.value      = obj.p2hGe;
            txtp2vVel.value     = obj.p2vVel;
            txtp2vGe.value      = obj.p2vGe;
            txtp2aVel.value     = obj.p2aVel;
            txtp2aGe.value      = obj.p2aGe;
            txtp2Temp.value     = obj.p2Temp;
            txtp3hVel.value     = obj.p3hVel;
            txtp3hGe.value      = obj.p3hGe;
            txtp3vVel.value     = obj.p3vVel;
            txtp3vGe.value      = obj.p3vGe;
            txtp3aVel.value     = obj.p3aVel;
            txtp3aGe.value      = obj.p3aGe;
            txtp3Temp.value     = obj.p3Temp;
            txtp4hVel.value     = obj.p4hVel;
            txtp4hGe.value      = obj.p4hGe;
            txtp4vVel.value     = obj.p4vVel;
            txtp4vGe.value      = obj.p4vGe;
            txtp4aVel.value     = obj.p4aVel;
            txtp4aGe.value      = obj.p4aGe;
            txtp4Temp.value     = obj.p4Temp;
            txtDvrRpm.value     = obj.rpmDriver;
            txtDvnRpm.value     = obj.rpmDriven;
            txtHighestUe.value  = obj.highestUe;
            txtHighestSnd.value = obj.highestSnd;
            txtBeltTemp.value   = obj.beltTemp;
            txtAmpDraw.value    = obj.ampDraw;

            txtAmpDraw.dispatchEvent(new Event("focusout"));
        }

        /*********************************** History Addition ************************************/

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

            if(obj.driverToDriven !== undefined && obj.drivenToDriver !== undefined)
            {
                document.getElementById("options" + obj.num).innerHTML = "Option 2 (Option 3)";
            }
            else
            {
                document.getElementById("options" + obj.num).innerHTML = "Option 2 (Option 3)";
            }

            if(obj.driverToDriven !== undefined)
            {
                optimalCount++;
                obj.txtOptimalMoves.innerHTML += "Driver to Driven: " + obj.driverToDriven + " mils";
            }

            if(obj.drivenToDriver !== undefined)
            {
                if(optimalCount > 0) obj.txtOptimalMoves.innerHTML += "<br>(";
                obj.txtOptimalMoves.innerHTML += "Driven to Driver: " + obj.drivenToDriver + " mils";
                if(optimalCount > 0) obj.txtOptimalMoves.innerHTML += ")";
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

    //Append multiple children to an HTML element.
    appendChildren(parent, childArray)
    {
        for(let i = 0; i < childArray.length; i++)
        {
            parent.appendChild(childArray[i]);
        }
    }

    //Update the cost on all the entries.
    updateCosts()
    {
        let isBaseDataValid = true;

        if(isNaN(this.costKwh) || isNaN(this.motorVoltage) || isNaN(this.usageMultiplier))
        {
            isBaseDataValid = false;
        }

        //Update measurements with valid amp draw numbers.
        if(isBaseDataValid)
        {
            for(let i = 0; i < this.history.length; i++)
            {
                if(this.history[i].type === Bam.MEAS && this.history[i].ampDraw !== undefined)
                {
                    let kiloWatts = Math.sqrt(3) * this.history[i].ampDraw * this.motorVoltage / 1000.0;
                    let hours, txtTimePeriod;

                    switch(this.timePeriod)
                    {
                        case Bam.WEEKLY:
                            hours = 24 * 7;
                            txtTimePeriod = " per week"
                        break;
                        case Bam.MONTHLY:
                            hours = 730.5;
                            txtTimePeriod = " per month"
                        break;
                        case Bam.YEARLY:
                            hours = 365.25 * 24;
                            txtTimePeriod = " per year"
                        break;
                        default:
                            console.log("Invalid time period.");
                            return;
                    }

                    let kwh = kiloWatts * hours;
                    let cost = kwh * this.usageMultiplier * this.costKwh;
                    this.history[i].cost = cost;
                    this.history[i].txtCost.innerHTML = "$" + cost.toFixed(2) + txtTimePeriod;
                    this.history[i].costString = "$" + cost.toFixed(2) + txtTimePeriod;
                }
                else if(this.history[i].type === Bam.MEAS && this.history[i].ampDraw === undefined)
                {
                    this.history[i].txtCost.innerHTML = "???";
                    this.history[i].costString = "";
                    this.history[i].cost = undefined;
                }
            }
        }
        //Invalidate all cost values.
        else
        {
            for(let i = 0; i < this.history.length; i++)
            {
                if(this.history[i].type === Bam.MEAS)
                {
                    this.history[i].txtCost.innerHTML = "???";
                    this.history[i].costString = "";
                    this.history[i].cost = undefined;
                }
            }
        }
    }

    saveData()
    {
        //Store the cost data in an object.
        let costObj =
        {
            type:            Bam.COST,
            costKwh:         this.costKwh,
            motorVoltage:    this.motorVoltage,
            usageMultiplier: this.usageMultiplier,
            timePeriod:      this.timePeriod,
            reportTitle:     this.reportTitle,
            reportComments:  this.reportComments
        }

        let histCopy = [costObj];
        
        //Iterate through the copy of the history array and keep only the data.
        for(let i = 0; i < this.history.length; i++)
        {
            switch(this.history[i].type)
            {
                case Bam.ADJ:
                    let adjObj =
                    {
                        num:                this.history[i].num,
                        type:               Bam.ADJ,
                        title:              this.history[i].title,
                        comments:           this.history[i].comments,
                        driverFeetDistance: this.history[i].driverFeetDistance,
                        drivenFeetDistance: this.history[i].drivenFeetDistance,
                        driverTicks:        this.history[i].driverTicks,
                        drivenTicks:        this.history[i].drivenTicks,
                        driverBubbleHi:     this.history[i].driverBubbleHi,
                        drivenBubbleHi:     this.history[i].drivenBubbleHi,
                        driverToLevel:      this.history[i].driverToLevel,
                        drivenToLevel:      this.history[i].drivenToLevel,
                        driverToDriven:     this.history[i].driverToDriven,
                        drivenToDriver:     this.history[i].drivenToDriver,
                        plotHidden:         this.history[i].plotHidden
                    }
                    histCopy = [...histCopy, adjObj];
                break;
                case Bam.MEAS:
                    let measObj =
                    {
                        num:        this.history[i].num,
                        type:       Bam.MEAS,
                        title:      this.history[i].title,
                        comments:   this.history[i].comments,
                        p1hVel:     this.history[i].p1hVel, p1hGe: this.history[i].p1hGe, p1vVel: this.history[i].p1vVel, p1vGe: this.history[i].p1vGe,
                        p1aVel:     this.history[i].p1aVel, p1aGe: this.history[i].p1aGe, p1Temp: this.history[i].p1Temp,
                        p2hVel:     this.history[i].p2hVel, p2hGe: this.history[i].p2hGe, p2vVel: this.history[i].p2vVel, p2vGe: this.history[i].p2vGe,
                        p2aVel:     this.history[i].p2aVel, p2aGe: this.history[i].p2aGe, p2Temp: this.history[i].p2Temp,
                        p3hVel:     this.history[i].p3hVel, p3hGe: this.history[i].p3hGe, p3vVel: this.history[i].p3vVel, p3vGe: this.history[i].p3vGe,
                        p3aVel:     this.history[i].p3aVel, p3aGe: this.history[i].p3aGe, p3Temp: this.history[i].p3Temp,
                        p4hVel:     this.history[i].p4hVel, p4hGe: this.history[i].p4hGe, p4vVel: this.history[i].p4vVel, p4vGe: this.history[i].p4vGe,
                        p4aVel:     this.history[i].p4aVel, p4aGe: this.history[i].p4aGe, p4Temp: this.history[i].p4Temp,
                        ampDraw:    this.history[i].ampDraw,
                        cost:       this.history[i].cost,
                        rpmDriver:  this.history[i].rpmDriver,
                        rpmDriven:  this.history[i].rpmDriven,
                        beltTemp:   this.history[i].beltTemp,
                        highestUe:  this.history[i].highestUe,
                        highestSnd: this.history[i].highestSnd,
                    }
                    histCopy = [...histCopy, measObj];
                break;
                case Bam.COST:
                    //Nothing to do here.
                break;
                default:
                    console.log("Unknown object type");
                break;
            }            
        }

        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(histCopy)], {type : 'text/html'});
  
        a.href= URL.createObjectURL(file);
        a.download = "beltData.dat";
        a.click();

	    URL.revokeObjectURL(a.href);
    }

    //Read data from file.
    loadData(e, kwh, volt, mult)
    {
        let file = e.files[0];
        let reader = new FileReader();

        reader.readAsText(file);
        reader.onerror = () => console.log(reader.error);

        //Get contents of file.
        reader.onload = () =>
        {
            //Clear any colors indicating errors.
            kwh.style.backgroundColor = "";
            volt.style.backgroundColor = "";
            mult.style.backgroundColor = "";

            //Convert contents to an array of objects.
            let dataArray = JSON.parse(reader.result);

            //Clear out old data.
            this.history = [];
            this.parentDiv.innerHTML = "";

            //Load report title and comments.
            this.reportTitle = dataArray[0].reportTitle;
            this.reportComments = dataArray[0].reportComments;

            //Load cost data.
            let costKwh = dataArray[0].hasOwnProperty("costKwh") ? dataArray[0].costKwh : undefined;
            let voltage = dataArray[0].hasOwnProperty("motorVoltage") ? dataArray[0].motorVoltage : undefined;
            let multiplier = dataArray[0].hasOwnProperty("usageMultiplier") ? dataArray[0].usageMultiplier : undefined;
            let period = dataArray[0].hasOwnProperty("timePeriod") ? dataArray[0].timePeriod : Bam.MONTHLY;
            this.changeCostData(costKwh, voltage, multiplier, period, this.reportTitle, this.reportComments);
        
            //Iterate through data objects and load.
            for(let i = 1; i < dataArray.length; i++)
            {
                switch(dataArray[i].type)
                {
                    case Bam.ADJ:
                        this.addAdjustment(dataArray[i]);
                    break;
                    case Bam.MEAS:
                        this.addMeasurement(dataArray[i]);
                    break;
                    default:
                        console.log("Unknown object type");
                    break;
                }
            }

            //Update cost text.
            this.updateCosts();
        };
    }

    //Update cost analysis functions.
    updateTime(x)
    {
        this.timePeriod = x;
        this.updateCosts();
    }

    updateKwh(num)
    {
        this.costKwh = num;
        this.updateCosts();
    }
    
    updateVolts(num)
    {
        this.motorVoltage = num;
        this.updateCosts();
    }

    updateMultiplier(num)
    {
        this.usageMultiplier = num;
        this.updateCosts();
    }

    updateTitle(text)
    {
        this.reportTitle = text;
    }

    updateComments(text)
    {
        this.reportComments = text;
    }

    print()
    {
        //Store the cost data in an object.
        let costObj =
        {
            type:            Bam.COST,
            costKwh:         this.costKwh,
            motorVoltage:    this.motorVoltage,
            usageMultiplier: this.usageMultiplier,
            timePeriod:      this.timePeriod,
            title:           this.reportTitle,
            comments:        this.reportComments
        }

        let histCopy = [costObj];
        
        //Iterate through the copy of the history array and keep only the data.
        for(let i = 0; i < this.history.length; i++)
        {
            switch(this.history[i].type)
            {
                case Bam.ADJ:
                    let adjObj =
                    {
                        num:                this.history[i].num,
                        type:               Bam.ADJ,
                        title:              this.history[i].title,
                        comments:           this.history[i].comments,
                        driverFeetDistance: this.history[i].driverFeetDistance,
                        drivenFeetDistance: this.history[i].drivenFeetDistance,
                        driverTicks:        this.history[i].driverTicks,
                        drivenTicks:        this.history[i].drivenTicks,
                        driverBubbleHi:     this.history[i].driverBubbleHi,
                        drivenBubbleHi:     this.history[i].drivenBubbleHi,
                        driverToLevel:      this.history[i].driverToLevel,
                        drivenToLevel:      this.history[i].drivenToLevel,
                        driverToDriven:     this.history[i].driverToDriven,
                        drivenToDriver:     this.history[i].drivenToDriver,
                        plotHidden:         this.history[i].plotHidden
                    }
                    histCopy = [...histCopy, adjObj];
                break;
                case Bam.MEAS:
                    let measObj =
                    {
                        num:        this.history[i].num,
                        type:       Bam.MEAS,
                        title:      this.history[i].title,
                        comments:   this.history[i].comments,
                        p1hVel:     this.history[i].p1hVel, p1hGe: this.history[i].p1hGe, p1vVel: this.history[i].p1vVel, p1vGe: this.history[i].p1vGe,
                        p1aVel:     this.history[i].p1aVel, p1aGe: this.history[i].p1aGe, p1Temp: this.history[i].p1Temp,
                        p2hVel:     this.history[i].p2hVel, p2hGe: this.history[i].p2hGe, p2vVel: this.history[i].p2vVel, p2vGe: this.history[i].p2vGe,
                        p2aVel:     this.history[i].p2aVel, p2aGe: this.history[i].p2aGe, p2Temp: this.history[i].p2Temp,
                        p3hVel:     this.history[i].p3hVel, p3hGe: this.history[i].p3hGe, p3vVel: this.history[i].p3vVel, p3vGe: this.history[i].p3vGe,
                        p3aVel:     this.history[i].p3aVel, p3aGe: this.history[i].p3aGe, p3Temp: this.history[i].p3Temp,
                        p4hVel:     this.history[i].p4hVel, p4hGe: this.history[i].p4hGe, p4vVel: this.history[i].p4vVel, p4vGe: this.history[i].p4vGe,
                        p4aVel:     this.history[i].p4aVel, p4aGe: this.history[i].p4aGe, p4Temp: this.history[i].p4Temp,
                        ampDraw:    this.history[i].ampDraw,
                        cost:       this.history[i].cost,
                        costString: this.history[i].costString,
                        rpmDriver:  this.history[i].rpmDriver,
                        rpmDriven:  this.history[i].rpmDriven,
                        beltTemp:   this.history[i].beltTemp,
                        highestUe:  this.history[i].highestUe,
                        highestSnd: this.history[i].highestSnd,
                    }
                    histCopy = [...histCopy, measObj];
                break;
                case Bam.COST:
                    //Nothing to do here.
                break;
                default:
                    console.log("Unknown object type");
                break;
            }            
        }

        //Send belt alignment data to the new window.
        sessionStorage.setItem("beltAlignmentArray", JSON.stringify(histCopy));
        window.open("./beltAlignmentPrint.html");
    }
}