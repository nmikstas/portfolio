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
            getGameObject = null,
            getUsedLettersArray = null,
            evalDoneColumn = null,
            evalRightLetWrongCol1 = null,
            evalRightLetWrongCol2 = null,
            evalUsedLetters = null,
            evalUnusedLetters1 = null,
            evalUnusedLetters2 = null,
            doEvaluations = null,
            scrollColumn = null,
            evalSwap = null,
        } = {}
    )
    {
        this.gameBody = gameBody;
        this.goButton = goButton;
        this.RemainDiv = RemainDiv;
        this.debug = debug;
        this.getGameObject = getGameObject;
        this.getUsedLettersArray = getUsedLettersArray;
        this.evalDoneColumn = evalDoneColumn;
        this.evalRightLetWrongCol1 = evalRightLetWrongCol1;
        this.evalRightLetWrongCol2 = evalRightLetWrongCol2;
        this.evalUsedLetters = evalUsedLetters;
        this.evalUnusedLetters1 = evalUnusedLetters1;
        this.evalUnusedLetters2 = evalUnusedLetters2;
        this.doEvaluations = doEvaluations;
        this.scrollColumn = scrollColumn;
        this.evalSwap = evalSwap;

        //Column swap variables.
        this.colIndex1 = undefined;
        this.colIndex2 = undefined;
        this.letterIndex1 = undefined;
        this.letterIndex2 = undefined;

        //Animation variables.
        this.animActive = false;
        this.animState = 0;
        this.animTimer;

        this.isGo = false; //Go button pressed indicator.
        this.columnArray = new Array(0); //Array of letter columns.
        this.letterHeight = 0; //Letter height in web presentation.
        this.letterDivSide;


        //Resize event listener.
        window.addEventListener("resize", this.redraw);

        //Go button event listener.
        this.goButton.addEventListener("click", () =>
        {
            this.isGo = true;
            this.colIndex1 = undefined;
            this.colIndex2 = undefined;
            this.evaluate();
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Event Listeners                                       //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    letterClick = (e) =>
    {
        let target = e.originalTarget;
        let parent = e.originalTarget.parentElement;
        let selectedColumn, selectedLetter;
        let gameObject = ge.getGameObject();
        let animIndexArray = new Array(0);

        //Find the column selected.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            if(this.columnArray[i] === parent)
            {
                selectedColumn = i;
                break;
            }
        }

        //Find the row selected.
        for(let i = 0; i < this.columnArray[selectedColumn].childNodes.length; i++)
        {
            if(this.columnArray[selectedColumn].childNodes[i] === target)
            {
                selectedLetter = i;
                break;
            }
        }

        //Check if no selection has been made yet.
        if(this.colIndex1 === undefined)
        {
            let animIndexArray = new Array(0);
            this.colIndex1 = selectedColumn;
            this.letterIndex1 = selectedLetter;
    
            this.removeAllListeners();

            //Check if green column has been clicked.
            if(gameObject.locksArray[this.colIndex1].column && gameObject.locksArray[this.colIndex1].letter)
            {
                animIndexArray.push(this.colIndex1);
                this.doShakeAnimations(animIndexArray);
                setTimeout(this.solvedLetterClicked, 300);
            }
            else //Else circular border around selected letter.
            {
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].style.transitionDuration = ".15s";
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].removeEventListener("mouseenter", this.hoverOver);
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].removeEventListener("mouseleave", this.mouseLeave);
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].addEventListener("mouseenter", this.selectedOver);
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].addEventListener("mouseleave", this.selectedLeave);
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].classList.add("selected-letter");

                setTimeout(() => this.columnSelected(), 200);
            }
        }
        else //First selection has already been made. Get second selection.
        {
            this.colIndex2 = selectedColumn;
            this.letterIndex2 = selectedLetter;

            this.removeAllListeners();
            this.columnArray[this.colIndex1].childNodes[this.letterIndex1].removeEventListener("mouseenter", this.selectedOver);
            this.columnArray[this.colIndex1].childNodes[this.letterIndex1].removeEventListener("mouseleave", this.selectedLeave);
            this.columnArray[this.colIndex1].childNodes[this.letterIndex1].addEventListener("mouseenter", this.hoverOver);
            this.columnArray[this.colIndex1].childNodes[this.letterIndex1].addEventListener("mouseleave", this.mouseLeave);
            this.columnArray[this.colIndex1].childNodes[this.letterIndex1].classList.remove("selected-letter");
            this.columnArray[this.colIndex1].childNodes[this.letterIndex1].classList.add("unselected-letter");

            //Same column clicked and action is cancelled.
            if(selectedColumn === this.colIndex1 && selectedLetter === this.letterIndex1)
            {
                this.columnArray[this.colIndex1].style.transitionDuration = ".15s";
                this.columnArray[this.colIndex1].childNodes[this.letterIndex1].style.borderRadius = "13%";

                setTimeout(this.solvedLetterClicked, 200);
            }
            //2 different columns selected.
            else if(this.colIndex2 !== this.colIndex1)
            {
                //Check if one column is a solved column.
                if((gameObject.locksArray[this.colIndex1].column && gameObject.locksArray[this.colIndex1].letter) ||
                    (gameObject.locksArray[this.colIndex2].column && gameObject.locksArray[this.colIndex2].letter))
                {
                    animIndexArray.push(this.colIndex1);
                    animIndexArray.push(this.colIndex2);
                    this.doShakeAnimations(animIndexArray);
                    setTimeout(this.solvedLetterClicked, 200);
                }
                //Check if one column is a locked column.
                else if(gameObject.locksArray[this.colIndex1].column || gameObject.locksArray[this.colIndex2].column)
                {
                    animIndexArray.push(this.colIndex1);
                    animIndexArray.push(this.colIndex2);
                    this.doShakeAnimations(animIndexArray);
                    setTimeout(this.solvedLetterClicked, 200);
                }
                //Move columns if they are not locked or solved.
                else
                {
                    let letterDiv1 = this.columnArray[this.colIndex1].childNodes[this.letterIndex1];
                    let letterDiv2 = this.columnArray[this.colIndex2].childNodes[this.letterIndex2];

                    //Clear out the borders on the letters selected.
                    letterDiv1.style.transitionDuration = "0s";
                    letterDiv1.style.borderWidth = 0;
                    letterDiv1.style.backgroundColor = "rgba(0, 0, 0, 0)";
                    letterDiv2.style.transitionDuration = "0s";
                    letterDiv2.style.borderWidth = 0;
                    letterDiv2.style.backgroundColor = "rgba(0, 0, 0, 0)";

                    animIndexArray.push(this.colIndex1);
                    animIndexArray.push(this.colIndex2);
                    this.animSwap1(animIndexArray);
                    setTimeout(this.solvedLetterClicked, 500);
                }
            }
            //Scroll column.
            else if(this.colIndex2 === this.colIndex1)
            {
                //Double the letters in the column for scrolling.
                let numColItems = this.columnArray[this.colIndex1].childNodes.length;
                let thisDiv = this.columnArray[this.colIndex1];
                let letterDivWidth = window.getComputedStyle(thisDiv).width;
                let totalHeight = window.getComputedStyle(thisDiv).height.split("px");
                let topBorder = window.getComputedStyle(thisDiv).borderTop.split("px");
                let bottomBorder = window.getComputedStyle(thisDiv).borderBottom.split("px");
                totalHeight = parseFloat(totalHeight[0]);
                topBorder = parseFloat(topBorder[0]);
                bottomBorder = parseFloat(bottomBorder[0]);
                thisDiv.style.height = totalHeight + "px";

                //Make sure column does not end up with a scroll bar.
                this.columnArray[this.colIndex1].style.overflowY = "hidden";
                
                for(let i = 0; i < numColItems; i++)
                {
                    let tempLetter = this.columnArray[this.colIndex1].childNodes[i].innerHTML;
                    let thisDiv = document.createElement("div");
                    this.columnArray[this.colIndex1].appendChild(thisDiv);
                    thisDiv.classList.add("letter-div");
                    thisDiv.innerHTML = tempLetter;
                    thisDiv.style.fontSize = this.letterHeight + "px";
                    thisDiv.style.height = this.letterDivSide + "px"; 
                    thisDiv.style.width = letterDivWidth + "px";
                }

                let letterDiv1 = this.columnArray[this.colIndex1].childNodes[this.letterIndex1];
                let letterDiv2 = this.columnArray[this.colIndex2].childNodes[this.letterIndex2];

                //Clear out the borders on the letters selected.
                letterDiv1.style.transitionDuration = "0s";
                letterDiv1.style.borderWidth = 0;
                letterDiv1.style.backgroundColor = "rgba(0, 0, 0, 0)";
                letterDiv2.style.transitionDuration = "0s";
                letterDiv2.style.borderWidth = 0;
                letterDiv2.style.backgroundColor = "rgba(0, 0, 0, 0)";

                //Scroll up.
                if(this.letterIndex1 > this.letterIndex2)
                {
                    this.columnArray[this.colIndex1].scrollTop = 0;
                    this.columnArray[this.colIndex1].classList.add("smooth-scroll");
                    this.columnArray[this.colIndex1].scrollTop = this.letterDivSide * (this.letterIndex1 - this.letterIndex2);
                }
                //Scroll down.
                else
                {   
                    this.columnArray[this.colIndex1].scrollTop = totalHeight - topBorder - bottomBorder;
                    this.columnArray[this.colIndex1].classList.add("smooth-scroll");
                    this.columnArray[this.colIndex1].scrollTop -= this.letterDivSide * (this.letterIndex2 - this.letterIndex1);
                }
                
                setTimeout(this.finishScroll, 500);
            }
        }
    }

    //Special case for letter selected after first click.
    selectedOver = (e) =>
    {
        let thisDiv = e.originalTarget;
        thisDiv.classList.remove("selected-leave");
        thisDiv.classList.add("selected-hov");
    }

    //Special case for mouse leaving a selected letter.
    selectedLeave = (e) =>
    {
        let thisDiv = e.originalTarget;
        thisDiv.classList.remove("selected-hov");
        thisDiv.classList.add("selected-leave");
    } 

    //Mouse hovering over a non-selected letter.
    hoverOver = (e) =>
    {
        let thisDiv = e.originalTarget;
        thisDiv.classList.add("hov");
        thisDiv.style.borderWidth = (.05 * this.letterDivSide) + "px";
    }

    //Mouse leaving a non-selected letter.
    mouseLeave = (e) =>
    {
        let thisDiv = e.originalTarget;
        thisDiv.classList.remove("hov");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Helper Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    finishScroll = () =>
    {
        this.scrollColumn(this.colIndex1, this.letterIndex1 - this.letterIndex2);
        this.solvedLetterClicked();
        this.redraw();
    }

    //Reset game variables.
    resetGame = () =>
    {
        this.solvedLetterClicked();
    }

    //Restore listeners after a user clicks a green letter.
    solvedLetterClicked = () =>
    {
        this.addAllListeners();
        this.colIndex1 = undefined;
        this.letterIndex1 = undefined;
        this.colIndex2 = undefined;
        this.letterIndex2 = undefined;
        this.redraw();
    }

    columnSelected = () =>
    {
        this.addAllListeners();
    }

    //Remove all listeners from game board before starting animations.
    removeAllListeners = () =>
    {
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                let thisDiv = this.columnArray[i].childNodes[j];
                thisDiv.removeEventListener("click", this.letterClick);
            }
        }

        this.goButton.removeEventListener("click", this.evaluate);
        this.goButton.disabled = true; 
    }

    //Add all listeners back to the game board after animations finish.
    addAllListeners = () =>
    {
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                let thisDiv = this.columnArray[i].childNodes[j];
                thisDiv.addEventListener("click", this.letterClick);
            }
        }

        this.goButton.addEventListener("click", this.evaluate);
        this.goButton.disabled = false;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    redraw = () =>
    {
        let gameObject = this.getGameObject();
        let usedLettersArray = this.getUsedLettersArray();

        this.columnArray.length = 0;

        //Get critical dimension info about the game body element.
        let gameWidth = this.gameBody.clientWidth;
        let gameHeight = this.gameBody.clientHeight;
        
        //Update the number of tries remaining.
        this.RemainDiv.innerHTML = "Tries Remaining: " + gameObject.numTries;

        //Need to transpose the letter array for future processing.
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

        let colWidth, colHeight;
        let colBorderWidth, letterDivWidth;

        //Generate the column divs.
        for(let i = 0; i < gameObject.columns; i++)
        {
            let thisDiv = document.createElement("div");
            this.columnArray.push(thisDiv);
            thisDiv.classList.add("column-div");
            thisDiv.setAttribute("index", i);
            this.gameBody.appendChild(thisDiv);

            //Calculate dimensions of the columns.
            if(i === 0)
            {
                let colLeftMargin, colRightMargin, colTopMargin, colBotMargin;

                colLeftMargin = window.getComputedStyle(thisDiv).marginLeft.split("px");
                colRightMargin = window.getComputedStyle(thisDiv).marginRight.split("px");
                colTopMargin = window.getComputedStyle(thisDiv).marginTop.split("px");
                colBotMargin = window.getComputedStyle(thisDiv).marginBottom.split("px");
                
                colWidth = (gameWidth - (parseInt(colLeftMargin[0]) + parseInt(colRightMargin[0])) * gameObject.columns) / gameObject.columns;
                colHeight = (gameHeight - parseInt(colTopMargin[0]) - parseInt(colBotMargin[0])) / gameObject.rows;
                this.letterDivSide = (colHeight < colWidth) ? colHeight - 2: colWidth - 2;
            }

            colBorderWidth = .02 * this.letterDivSide;
            thisDiv.style.width = this.letterDivSide + "px";
            thisDiv.style.borderWidth = colBorderWidth + "px";
            thisDiv.style.borderRadius = (this.letterDivSide * .15) + "px";

            //Get the width for the letter divs.
            if(i === 0)letterDivWidth = window.getComputedStyle(thisDiv).width;

            //Normal background color.
            if(!gameObject.locksArray[i].column && !gameObject.locksArray[i].letter)
            {
                thisDiv.style.backgroundColor = "rgba(255, 255, 255, 1)";
            }

            //Check for letter lock only.
            if(!gameObject.locksArray[i].column && gameObject.locksArray[i].letter)
            {
                thisDiv.style.backgroundColor = "rgba(255, 255, 255, 1)";
            }

            //Check for column lock only.
            if(gameObject.locksArray[i].column && !gameObject.locksArray[i].letter)
            {
                thisDiv.style.backgroundColor = "rgba(157, 188, 255, 1)";
            }

            //Check for word lock and column lock.
            if(gameObject.locksArray[i].column && gameObject.locksArray[i].letter)
            {
                thisDiv.style.fontWeight = "bold";
                thisDiv.style.backgroundColor = "rgba(169, 255, 158, 1)";
            }
        }

        //Get the exact letter height. Need to subtract 2. Border, perhaps?
        this.letterHeight = .9 * this.letterDivSide;

        //Now go back in and fill the columns with the letters.
        for(let i = 0; i < gameObject.columns; i++)
        {
            this.columnArray[i].innerHTML = "";

            for(let k = 0; k < transLetterArray[i].length; k++)
            {
                let thisDiv = document.createElement("div");
                this.columnArray[i].appendChild(thisDiv);
                thisDiv.classList.add("letter-div");
                thisDiv.innerHTML = transLetterArray[i][k];
                thisDiv.style.fontSize = this.letterHeight + "px";

                //Explicitly assign letter div height for transition effect.
                thisDiv.style.height = this.letterDivSide + "px"; 
                thisDiv.style.width = letterDivWidth + "px";

                thisDiv.addEventListener("click", this.letterClick);

                //Add event listeners for mouse hovering.
                if(!gameObject.solvedArray[i])
                {
                    thisDiv.addEventListener("mouseenter", this.hoverOver);
                    thisDiv.addEventListener("mouseleave", this.mouseLeave);
                }
            } 
        }

        //Explicitly set the horizontal position of the columns for transition effects.
        for(let i = 0; i < gameObject.columns; i++)
        {
            this.columnArray[i].style.left = this.columnArray[i].getBoundingClientRect().x;
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

    //Swaps columns whose indexes are in the animation index array.
    animSwap1 = (animIndexArray) =>
    {
        this.animActive = true;
        clearTimeout(this.animTimer);
        if(animIndexArray.length === 2)
        {
            let xpos0 = parseFloat(this.columnArray[animIndexArray[0]].getBoundingClientRect().x);
            let xpos1 = parseFloat(this.columnArray[animIndexArray[1]].getBoundingClientRect().x);
            let xdiff = xpos0 - xpos1;

            this.columnArray[animIndexArray[0]].style.backgroundColor = "rgba(0, 0, 0, 0)";
            this.columnArray[animIndexArray[0]].style.transform = "translate(" + (-xdiff) + "px)";
            this.columnArray[animIndexArray[0]].style.transitionDuration = ".4s";

            this.columnArray[animIndexArray[1]].style.backgroundColor = "rgba(0, 0, 0, 0)";
            this.columnArray[animIndexArray[1]].style.transform = "translate(" + xdiff + "px)";
            this.columnArray[animIndexArray[1]].style.transitionDuration = ".4s";
        }
        this.animTimer = setTimeout(() => this.evalSwap(animIndexArray), 500);   
    }

    animSwap2 = () =>
    {
        this.redraw();
        this.animActive = false;
        clearTimeout(this.animTimer);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Evaluation Functions                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //-------------------- Start Evaluations --------------------

    evaluate = () =>
    {
        this.animActive = true;
        this.goButton.removeEventListener("click", this.evaluate);
        this.doEvaluations();
    }

    //-------------------- Column Lock Animations --------------------

    animColumnLocks = (newColumnLocksArray) =>
    {
            
        for(let i = 0; i < newColumnLocksArray.length; i++)
        {
            this.columnArray[newColumnLocksArray[i]].style.backgroundColor = "rgba(157, 188, 255, 1)";
            this.columnArray[newColumnLocksArray[i]].style.transitionDuration = ".4s";
        }

        //Only delay if work was done.
        if(newColumnLocksArray.length > 0)
        {
            setTimeout(this.evalDoneColumn, 500);
        }
        else
        {
            this.evalDoneColumn();
        }
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

        //Only delay if work was done.
        if(newDoneColumnArray.length > 0)
        {
            setTimeout(() => this.animDoneColumn2(newDoneColumnArray), 500);
        }
        else
        {
            this.animDoneColumn2(newDoneColumnArray);
        }
        
    }

    animDoneColumn2 = (newDoneColumnArray) =>
    {
        //Transition background color to green.
        for(let i = 0; i < newDoneColumnArray.length; i++)
        {
            this.columnArray[newDoneColumnArray[i]].style.fontWeight = "bold";
            this.columnArray[newDoneColumnArray[i]].style.backgroundColor = "rgba(169, 255, 158, 1)";
            this.columnArray[newDoneColumnArray[i]].style.transitionDuration = ".4s";
            this.columnArray[newDoneColumnArray[i]].style.height = this.letterHeight + "px";
        }
   
        //Only delay if work was done.
        if(newDoneColumnArray.length > 0)
        {
            setTimeout(this.evalRightLetWrongCol1, 500);
        }
        else
        {
            this.evalRightLetWrongCol1();
        }
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
      
        //Only delay if work was done.
        if(moveChainArray.length > 0)
        {
            setTimeout(this.animRightLetWrongCol2, 500);
        }
        else
        {
            this.animRightLetWrongCol2();
        }
    }

    animRightLetWrongCol2 = () =>
    {
        //Set smooth scrolling for all columns.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            this.columnArray[i].classList.remove("smooth-scroll");
        }
    
        this.redraw();
        this.evalRightLetWrongCol2();
    }

    //-------------------- Used Letter Animations --------------------

    animUsedLetters1 = (usedLettersArray) =>
    {
        let workDone = false; //Only delay if some animations set.
        let gameObject = this.getGameObject();
    
        //Cycle through all the letters on the screen and add bold the used letters.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                let thisLetter = this.columnArray[i].childNodes[j].innerHTML;
                if(usedLettersArray.includes(thisLetter) && (!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter))
                {
                    this.columnArray[i].childNodes[j].style.fontWeight = "bold";
                    this.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                    workDone = true;
                }
            }
        }
    
        if(workDone)
        {
            setTimeout(this.animUsedLetters2, 500);
        }
        else
        {
            this.animUsedLetters2();
        }
    }
    
    animUsedLetters2 = () =>
    {
        this.redraw();
        this.evalUnusedLetters1();
    }

    //-------------------- Unused Letter Animations --------------------

    animUnusedLetters1 = (unusedLettersArray) =>
    {
        let workDone = false; //Only delay if some animations set.
        let gameObject = this.getGameObject();
    
        if(this.debug)console.log("Unused Letters:");
        if(this.debug)console.log(unusedLettersArray);
    
        for(let i = 0; i < gameObject.columns; i++)
        {
            //Only work on columns that have not already been solved
            if(!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter)
            {
                //Reset scroll for animation effects.
                this.columnArray[i].scrollTop = 0;
    
                for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
                {
                    let thisLetter = this.columnArray[i].childNodes[j].innerHTML;
                    if(unusedLettersArray.includes(thisLetter))
                    {
                        this.columnArray[i].childNodes[j].style.transform = "scale(0, 0)";
                        this.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                        workDone = true;
                    }
                }
            }
        }
    
        if(workDone)
        {
            setTimeout(() => this.animUnusedLetters2(unusedLettersArray), 500);
        }
        else
        {
            this.animUnusedLetters2(unusedLettersArray);
        } 
    }

    animUnusedLetters2 = (unusedLettersArray) =>
    {
        let workDone = false; //Only delay if some animations set.
        let gameObject = this.getGameObject();
    
        //Move letters up in the columns to fill in any holes from removed letters.
        for(let i = 0; i < gameObject.columns; i++)
        {
            let missingLetters = 0;
    
            //Go through only the first repitition of letters.
            for(let j = 0; j < gameObject.remainArray[i]; j++)
            {
                let thisLetter
                try
                {
                    thisLetter = this.columnArray[i].childNodes[j].innerHTML;
                }
                catch(error)
                {
                    console.log("ERROR");
                    console.log("i: %s, j: %s, gameObject.remainArray[i]: %s, childNodes length: %s", 
                                 i, j, gameObject.remainArray[i], this.columnArray[i].childNodes.length)
                }
                
                if(unusedLettersArray.includes(thisLetter) && gameObject.remainArray[i] > 1)
                {
                    //Letter has been removed.
                    missingLetters++;
                }
                else
                {
                    //Letter is still present. Move it up, if necessary.
                    if(missingLetters)
                    {
                        let dy = -missingLetters * this.letterHeight;
                        this.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                        this.columnArray[i].childNodes[j].style.transform = "translateY(" + dy + "px)";
                    }
                }
            }
    
            //Resize column, if necessary.
            if(missingLetters)
            {
                this.columnArray[i].style.transitionDuration = ".4s";
                this.columnArray[i].style.height = ((ge.gameObject.remainArray[i] - missingLetters) * this.letterHeight) + "px";
                workDone = true;
            }
        }
    
        if(workDone)
        {
            setTimeout(this.evalUnusedLetters2, 500);
        }
        else
        {
            this.evalUnusedLetters2();
        } 
    }

    animUnusedLetters3 = () =>
    {
        this.redraw();
        this.evalFinished();
    }

    //-------------------- Finished Animations --------------------

    evalFinished = () =>
    {   
        this.animActive = false;
        this.goButton.addEventListener("click", this.evaluate);
    } 
}