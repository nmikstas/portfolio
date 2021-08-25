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
        delBtn.classList.add("btn", "btn-outline-danger", "delete", "m-1");
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
        desc.innerHTML = "Adjustment, entry #" + this.entryNum;

        //Add everything together.
        mainDiv.appendChild(delBtn);
        mainDiv.appendChild(desc);
        this.parentDiv.prepend(mainDiv);

        //Create object of relevant stuff for the history array.
        let obj =
        {
            num: this.entryNum,
            type: Bam.ADJ,
            desc: desc.innerHTML
        }

        this.history = [...this.history, obj];
        this.entryNum++;
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
        delBtn.classList.add("btn", "btn-outline-danger", "delete", "m-1");
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

    generatePdf()
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

    updateVolts(num)
    {
        console.log("Update Volts: " + num);
    }

    updateMultiplier(num)
    {
        console.log("Update Multiplier: " + num);
    }
}