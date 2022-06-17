"use strict";

//This class Presents the game to the user and handles inputs.

class GameRenderer1
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        gameBody,
        goButton,
        RemainDiv,
        {
            debug = false,
            gameObject = null,
            evalDoneColumn = null,
            evalRightLetWrongCol = null,



            animRightLetWrongCol2 = null
        } = {}
    )
    {
        this.gameBody = gameBody;
        this.goButton = goButton;
        this.RemainDiv = RemainDiv;
        this.debug = debug;
        this.gameObject = gameObject;
        this.evalDoneColumn = evalDoneColumn;
        this.evalRightLetWrongCol = evalRightLetWrongCol;
        


        this.animRightLetWrongCol2 = animRightLetWrongCol2;







        //Slider variables.
        this.isDown = false;
        this.startY;
        this.scrollOffset;
        this.scrollDiv;
        this.letterDiv;
        this.mouseX;
        this.mouseY;

        //Column swap variables.
        this.singleClick = false;
        this.colIndex1 = undefined;
        this.colIndex2 = undefined;
        this.tempIndex;

        //Animation variables.
        this.animActive = false;
        this.animState = 0;
        this.animTimer;

        this.columnArray = new Array(0); //Array of letter columns.
        this.letterHeight = 0; //Letter height in web presentation.









        
        document.addEventListener("mousemove", (event) => 
        {
            if(this.animActive) return;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            if(!this.isDown && this.letterDiv)this.letterDiv.style.cursor = "pointer";
        });

        document.addEventListener("touchmove", (event) => 
        {
            if(this.animActive) return;
            this.mouseX = event.touches[0].clientX;
            this.mouseY = event.touches[0].clientY;
            if(!this.isDown && this.letterDiv)this.letterDiv.style.cursor = "pointer";
        });

        document.addEventListener("mouseup", (event) => 
        {
            if(this.animActive) return;
            this.isDown = false;
        });

        document.addEventListener("touchup", (event) => 
        {
            if(this.animActive) return;
            this.isDown = false;
        });

        document.addEventListener("mousemove", this.move);
        document.addEventListener("touchmove", this.move);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    redraw = (gameObject, usedLettersArray) =>
    {
        this.columnArray.length = 0;

        //Get critical dimension info about the game body element.
        let gameWidth = this.gameBody.clientWidth;
        let gameHeight = this.gameBody.clientHeight;
        
        //Update the number of tries remaining.
        this.RemainDiv.innerHTML = "Tries Remaining: " + gameObject.numTries;

        let limitingFactor = (gameWidth > gameHeight) ? gameHeight : gameWidth;

        //Need to transpose the letter array.
        let transLetterArray = new Array(columns);
        for(let i = 0; i < transLetterArray.length; i++)
        {
            transLetterArray[i] = new Array(0);
        }

        for(let i = 0; i < gameObject.letterArray.length; i++)
        {
            for(let j = 0; j < gameObject.letterArray[i].length; j++)
            {
                if(gameObject.letterArray[i][j] !== " ")
                {
                    transLetterArray[j].push(gameObject.letterArray[i][j]);
                }
            }
        }

        //Clear out the game body div.
        this.gameBody.innerHTML = "";

        //Generate the column divs.
        for(let i = 0; i < gameObject.columns; i++)
        {
            //Else draw whole column.
            let thisDiv = document.createElement("div");
            this.columnArray.push(thisDiv);
            thisDiv.classList.add("column-div");
            thisDiv.innerHTML = i;
            thisDiv.style.fontSize = "2.5vw";
            thisDiv.setAttribute("index", i);
            this.gameBody.appendChild(thisDiv);

            thisDiv.addEventListener("mousedown", this.start);
            thisDiv.addEventListener("touchstart", this.start);

            if(!gameObject.locksArray[i].letter)
            {
                //thisDiv.addEventListener("mousemove", this.move);
                //thisDiv.addEventListener("touchmove", this.move);
                thisDiv.addEventListener("mouseleave", this.end);
                thisDiv.addEventListener("touchleave", this.end);
            }
            
            thisDiv.addEventListener("mouseup", this.release);
            thisDiv.addEventListener("touchend", this.release);

            //Check for column lock only.
            if(gameObject.locksArray[i].column && !gameObject.locksArray[i].letter)
            {
                thisDiv.style.backgroundColor = "rgb(157, 188, 255)";
            }

            //Check for word lock and column lock.
            if(gameObject.locksArray[i].column && gameObject.locksArray[i].letter)
            {
                thisDiv.style.fontWeight = "bold";
                thisDiv.style.backgroundColor = "rgb(169, 255, 158)";
            }
        }

        //Get the exact letter height. Need to subtract 2. Border, perhaps?
        this.letterHeight = parseFloat(this.columnArray[0].getBoundingClientRect().height) - 2;

        //Calculate column height.
        for(let i = 0; i < gameObject.columns; i++)
        {
            let thisColLetters = transLetterArray[i].length;
            let newHeight = thisColLetters * this.letterHeight;
            this.columnArray[i].style.height = newHeight + "px";
        }

        //Now go back in and fill the columns with the letters.
        for(let i = 0; i < gameObject.columns; i++)
        {
            this.columnArray[i].innerHTML = "";

            //Only put one copy of letter in box if it is letter locked.
            let repeats = (gameObject.locksArray[i].letter) ? 1 : 3;

            //Push 3 copies into the array for scrolling.
            for(let j = 0; j < repeats; j++)
            {
                for(let k = 0; k < transLetterArray[i].length; k++)
                {
                    let thisDiv = document.createElement("div");
                    this.columnArray[i].appendChild(thisDiv);
                    thisDiv.classList.add("letter-div");
                    thisDiv.innerHTML = transLetterArray[i][k];
                    thisDiv.style.fontSize = "2.5vw";
                    thisDiv.style.height = this.letterHeight + "px"; //Explicitly assign letter div height for transition effect.
                }
            }
        }

        //Explicitly set the horizontal position of the columns for transition effects.
        for(let i = 0; i < gameObject.columns; i++)
        {
            this.columnArray[i].style.left = this.columnArray[i].getBoundingClientRect().x;
        }

        //Calculate scroll offset.
        for(let i = 0; i < gameObject.columns; i++)
        {
            let scrollOffset = this.letterHeight * gameObject.remainArray[i];
            this.columnArray[i].scrollTop = scrollOffset;     
        }

        //Cycle through all the letters on the screen and bold the used letters.
        {
            for(let i = 0; i < this.columnArray.length; i++)
            {
                for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
                {
                    let thisLetter = this.columnArray[i].childNodes[j].innerHTML;
                    if(usedLettersArray.includes(thisLetter) && (!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter))
                    {
                        this.columnArray[i].childNodes[j].style.fontWeight = "bold";
                        this.columnArray[i].childNodes[j].style.transitionDuration = "0s";
                    }
                }
            }
        }
    }

    //Shake columns whose indexes are in the animation index array.
    doShakeAnimations = (animIndexArray) =>
    {
        switch(this.animState)
        {
            case 0:
                this.animActive = true;
                clearTimeout(this.animTimer);
                for(let i = 0; i < animIndexArray.length; i++)
                {
                    this.columnArray[animIndexArray[i]].style.transform = "translate(-1vh)";
                    this.columnArray[animIndexArray[i]].style.transitionDuration = ".075s";
                }
                this.animTimer = setTimeout(() => this.doShakeAnimations(animIndexArray), 75);
                this.animState++;
            break;
            
            case 1:
                for(let i = 0; i < animIndexArray.length; i++)
                {
                    this.columnArray[animIndexArray[i]].style.transform = "translate(1vh)";
                    this.columnArray[animIndexArray[i]].style.transitionDuration = ".1s";
                }
                this.animTimer = setTimeout(() => this.doShakeAnimations(animIndexArray), 100);
                this.animState++;
            break;

            case 2:
                for(let i = 0; i < animIndexArray.length; i++)
                {
                    this.columnArray[animIndexArray[i]].style.transform = "translate(0vh)";
                    this.columnArray[animIndexArray[i]].style.transitionDuration = ".075s";
                }
                this.animTimer = setTimeout(() => this.doShakeAnimations(animIndexArray), 75);
                this.animState++;
            break;

            default:
                this.animActive = false;
                clearTimeout(this.animTimer);
                this.animState = 0;
                animIndexArray.length = 0;
            break;
        }
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Event Listeners                                       //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    end = (e) =>
    {
        if(this.animActive) return;
        if(!this.isDown) return;

        let yTop = this.scrollDiv.getBoundingClientRect().y;
        let yBottom = this.scrollDiv.getBoundingClientRect().height + yTop;

        if(this.mouseY > yBottom || this.mouseY < yTop)
        {
            this.isDown = false;
            this.letterDiv.style.cursor = "pointer";
        }
    }

    release = (e) =>
    {
        if(this.animActive) return;
        this.isDown = false;
        this.letterDiv.style.cursor = "pointer";

        //Check if there was a quick click, indicating a column swap is desired.
        if(this.singleClick)
        {
            columnSwap(); /* ***************************************************************************************** */
        }
        //Cancel any column swap if second click was a long click.
        else 
        {
            this.colIndex1 = undefined;
            this.colIndex2 = undefined;
        }
    }

    start = (e) =>
    {
        if(this.animActive) return;

        //Set a timer to check for a column swap(single fast click).
        setTimeout(checkColumnSwap, 200); /* ***************************************************************************************** */
        this.singleClick = true; 
        this.isDown = true;
        this.scrollDiv = e.target.parentNode;
        this.letterDiv = e.target;
        this.letterDiv.style.cursor = "grab";
        this.startY = e.pageY || e.touches[0].pageY - this.scrollDiv.offsetTop;
        this.scrollOffset = this.scrollDiv.scrollTop;

        //Get the index of the clicked column for column swapping purposes.
        this.tempIndex = parseInt(this.scrollDiv.getAttribute("index"));
    }

    move = (e) =>
    {
        //Exit if in middle of column swap.
        if(this.colIndex1 !== undefined) return;

        if(this.animActive) return;
        if(!this.isDown) return;

        e.preventDefault();

        const bottom = this.scrollDiv.getBoundingClientRect().bottom;
        const top = this.scrollDiv.getBoundingClientRect().top;
        const y = e.pageY || e.touches[0].pageY - this.scrollDiv.offsetTop;
        const dist = (y - this.startY);

        //Don't scroll if above or below column.
        if(y < bottom && y > top)
        {
            this.scrollDiv.scrollTop = this.scrollOffset - dist;
        }
    }

    











    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Evaluation Functions                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //-------------------- Column Lock Animations --------------------

    animColumnLocks = (newColumnLocksArray) =>
    {
            
        for(let i = 0; i < newColumnLocksArray.length; i++)
        {
            this.columnArray[newColumnLocksArray[i]].style.backgroundColor = "rgb(157, 188, 255)";
            this.columnArray[newColumnLocksArray[i]].style.transitionDuration = ".4s";
        }

        setTimeout(this.evalDoneColumn, 500);
    }

    //-------------------- Completed Columns Animations --------------------

    animDoneColumn1 = (newDoneColumnArray) =>
    {
        //Cycle through the solved columns and remove all the letters except for the top one.
        for(let i = 0; i < newDoneColumnArray.length; i++)
        {
            //Set scroll offset to zero to make things easier.
            this.columnArray[newDoneColumnArray[i]].scrollTop = 0;

            //Remove all letters except for the first one.
            for(let j = 1; j < this.columnArray[newDoneColumnArray[i]].childNodes.length; j++)
            {
                this.columnArray[newDoneColumnArray[i]].childNodes[j].style.transform = "scale(0, 0)";
                this.columnArray[newDoneColumnArray[i]].childNodes[j].style.transitionDuration = ".4s";
            }
        }

        setTimeout(() => this.animDoneColumn2(newDoneColumnArray), 500);
    }

    animDoneColumn2 = (newDoneColumnArray) =>
    {
        //Transition background color to green.
        for(let i = 0; i < newDoneColumnArray.length; i++)
        {
            this.columnArray[newDoneColumnArray[i]].style.fontWeight = "bold";
            this.columnArray[newDoneColumnArray[i]].style.backgroundColor = "rgb(169, 255, 158)";
            this.columnArray[newDoneColumnArray[i]].style.transitionDuration = ".4s";
            this.columnArray[newDoneColumnArray[i]].style.height = this.letterHeight + "px";
        }
   
        setTimeout(this.evalRightLetWrongCol, 500);
    }

    //-------------------- Right Letter Wrong Column Animations --------------------

    animRightLetWrongCol1 = (scrollArray, moveChainArray) =>
    {
        //Set smooth scrolling for all columns.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            this.columnArray[i].classList.add("smooth-scroll");
        }

        //Adjust scroll offset of columns to scroll.
        for(let i = 0; i < scrollArray.length; i++)
        {
            this.columnArray[scrollArray[i].colIndex].scrollTop += this.letterHeight * scrollArray[i].scrollIndex;
        }

        //Swap columns.
        for(let i = 0; i < moveChainArray.length; i++)
        {
            let startPos = this.columnArray[moveChainArray[i].from].getBoundingClientRect().x;
            let endPos = this.columnArray[moveChainArray[i].to].getBoundingClientRect().x;
            let xDiff = endPos - startPos;
            this.columnArray[moveChainArray[i].from].style.transform = "translate(" + xDiff + "px)";
            this.columnArray[moveChainArray[i].from].style.transitionDuration = ".4s";
        }
      
        setTimeout(this.animRightLetWrongCol2, 500);
    }

    



    //-------------------- Used Letter Animations --------------------





    //-------------------- Unused Letter Animations --------------------





    //-------------------- Finished Animations --------------------






}