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
        remainDiv,
        scoreDiv,
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
            evalUnusedLetters3 = null,
            doEvaluations = null,
            scrollColumn = null,
            evalSwap = null,
            disableReset = null,
            enableReset = null,
            updateGameState = null,
            resetFunction = null,
            loseSwap = null,
            setGameLost = null
        } = {}
    )
    {
        this.gameBody = gameBody;
        this.goButton = goButton;
        this.remainDiv = remainDiv;
        this.scoreDiv = scoreDiv;
        this.debug = debug;
        this.getGameObject = getGameObject;
        this.getUsedLettersArray = getUsedLettersArray;
        this.evalDoneColumn = evalDoneColumn;
        this.evalRightLetWrongCol1 = evalRightLetWrongCol1;
        this.evalRightLetWrongCol2 = evalRightLetWrongCol2;
        this.evalUsedLetters = evalUsedLetters;
        this.evalUnusedLetters1 = evalUnusedLetters1;
        this.evalUnusedLetters2 = evalUnusedLetters2;
        this.evalUnusedLetters3 = evalUnusedLetters3;
        this.doEvaluations = doEvaluations;
        this.scrollColumn = scrollColumn;
        this.evalSwap = evalSwap;
        this.disableReset = disableReset;
        this.enableReset = enableReset;
        this.updateGameState = updateGameState;
        this.resetFunction = resetFunction;
        this.loseSwap = loseSwap;
        this.setGameLost = setGameLost;

        //Column swap variables.
        this.colIndex1 = undefined;
        this.colIndex2 = undefined;
        this.letterIndex1 = undefined;
        this.letterIndex2 = undefined;

        //Animation variables.
        this.animState = 0;
        this.animTimer;

        //Win/lose indicators.
        this.win = false;
        this.lost = false;

        this.columnArray = new Array(0); //Array of letter columns.
        this.letterHeight = 0; //Letter height in web presentation.
        this.letterDivSide;

        //Resize event listener.
        window.addEventListener("resize", this.redraw);

        //Go button event listener.
        this.goButton.addEventListener("click", this.evaluate);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                     Event Listeners                                       //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    letterClick = (e) =>
    {
        let target = e.srcElement;
        let parent = target.parentElement;
        let selectedColumn, selectedLetter;
        let gameObject = ge.getGameObject();
        let animIndexArray = new Array(0);
        let usedLettersArray = this.getUsedLettersArray();

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

                //Cycle through all the letters on the screen and bold the used letters.
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

                //Make the first column being selected be a higher index than the rest.
                for(let i = 0; i < this.columnArray.length; i++)
                {
                    if(i !== this.colIndex1)
                    {
                        this.columnArray[i].style.zIndex = "-1";
                    }
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

                //Check if one column is a solved column.
                if((gameObject.locksArray[this.colIndex1].column && gameObject.locksArray[this.colIndex1].letter) ||
                    (gameObject.locksArray[this.colIndex2].column && gameObject.locksArray[this.colIndex2].letter))
                {
                    animIndexArray.push(this.colIndex1);
                    animIndexArray.push(this.colIndex2);
                    this.doShakeAnimations(animIndexArray);
                    setTimeout(this.solvedLetterClicked, 300);
                }
                //Check if one column is a locked column.
                else if(gameObject.locksArray[this.colIndex1].column || gameObject.locksArray[this.colIndex2].column)
                {
                    animIndexArray.push(this.colIndex1);
                    animIndexArray.push(this.colIndex2);
                    this.doShakeAnimations(animIndexArray);
                    setTimeout(this.solvedLetterClicked, 300);
                }
                //Move columns if they are not locked or solved.
                else
                {
                    let milliseconds = 200; //Total time of animation.
                    let dt = 10; //Time between animation frames.

                    //The same index is clicked on both columns.
                    if(this.letterIndex1 === this.letterIndex2)
                    {
                        //Nothing to do.
                    }

                    //The second index is less than the first index.
                    else if(this.letterIndex1 >  this.letterIndex2)
                    {
                        let scrollEnd = this.letterDivSide * (this.letterIndex1 - this.letterIndex2);
                        let numCalls = milliseconds / dt; //Total number of frames for animation.
                        let dy = scrollEnd / numCalls; //Vertical distance moved for each frame of animation.

                        setTimeout(() => this.animScrollUp(0, scrollEnd, dy, this.columnArray[this.colIndex1], dt), dt);
                        setTimeout(() => this.scrollColumn(this.colIndex1, this.letterIndex1 - this.letterIndex2), 500);
                    }

                    //The second index is greater than the first index.
                    else
                    {
                        //Some browswers do not support the above calculation for border widths.
                        if(isNaN(topBorder))
                        {
                            topBorder = parseFloat(window.getComputedStyle(thisDiv).getPropertyValue("border-top-width").split("px")[0]);
                            bottomBorder = parseFloat(window.getComputedStyle(thisDiv).getPropertyValue("border-bottom-width").split("px")[0]);
                        }

                        let maxIndex = this.columnArray[this.colIndex1].childNodes.length / 2 - 1;
                        let targetIndex = (maxIndex < this.letterIndex2) ? maxIndex : this.letterIndex2;
                        console.log("Col 2 index: %s, Max index: %s, Target index: %s", this.letterIndex2, maxIndex, targetIndex)
                        
                        //Set the initial scroll location.
                        let scrollStart = totalHeight - topBorder - bottomBorder;
                        this.columnArray[this.colIndex1].scrollTop = scrollStart

                        let scrollEnd = this.columnArray[this.colIndex1].scrollTop - this.letterDivSide * (targetIndex - this.letterIndex1);
                        let numCalls = milliseconds / dt; //Total number of frames for animation.
                        let dy = (scrollStart - scrollEnd) / numCalls; //Vertical distance moved for each frame of animation.

                        setTimeout(() => this.animScrollDown(scrollStart, scrollEnd, dy, this.columnArray[this.colIndex1], dt), dt);
                        this.scrollColumn(this.colIndex1, this.letterIndex1 - targetIndex);
                    }

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
                let topBorder = window.getComputedStyle(thisDiv).borderTop.split("px") || window.getComputedStyle(thisDiv).getPropertyValue("border-top-width").split("px");
                let bottomBorder = window.getComputedStyle(thisDiv).borderBottom.split("px") || window.getComputedStyle(thisDiv).getPropertyValue("border-bottom-width").split("px");
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

                //Cycle through all the letters on the screen and bold the used letters.
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
                    this.columnArray[this.colIndex1].classList.add("smooth-scroll");
                    this.columnArray[this.colIndex1].scrollTop = this.letterDivSide * (this.letterIndex1 - this.letterIndex2);
                }
                //Scroll down.
                else
                { 
                    //Some browswers do not support the above calculation for border widths.
                    if(isNaN(topBorder))
                    {
                        topBorder = parseFloat(window.getComputedStyle(thisDiv).getPropertyValue("border-top-width").split("px")[0]);
                        bottomBorder = parseFloat(window.getComputedStyle(thisDiv).getPropertyValue("border-bottom-width").split("px")[0]);
                    }

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
        let thisDiv = e.srcElement;
        thisDiv.classList.remove("selected-leave");
        thisDiv.classList.add("selected-hov");
    }

    //Special case for mouse leaving a selected letter.
    selectedLeave = (e) =>
    {
        let thisDiv = e.srcElement;
        thisDiv.classList.remove("selected-hov");
        thisDiv.classList.add("selected-leave");
    } 

    //Mouse hovering over a non-selected letter.
    hoverOver = (e) =>
    {
        let thisDiv = e.srcElement;
        thisDiv.classList.add("hov");
        thisDiv.style.borderWidth = (.05 * this.letterDivSide) + "px";
    }

    //Mouse leaving a non-selected letter.
    mouseLeave = (e) =>
    {
        let thisDiv = e.srcElement;
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
        this.win = false;
        this.lost = false;
        this.goButton.removeEventListener("click", this.newGame);
        this.goButton.addEventListener("click", this.evaluate);
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

        this.goButton.classList.remove("go-icon");
        this.goButton.classList.add("go-icon2");
        this.goButton.src = "./images/GoButton2.png";
        this.goButton.removeEventListener("click", this.evaluate);
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

        this.goButton.classList.remove("go-icon2");
        this.goButton.classList.add("go-icon");
        this.goButton.src = "./images/GoButton1.png";
        this.goButton.addEventListener("click", this.evaluate);
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
        this.remainDiv.innerHTML = "Tries: " + gameObject.numTries;

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
        let colTopBorder, colBottomBorder;

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
                colTopBorder = window.getComputedStyle(thisDiv).borderTop.split("px");
                colBottomBorder = window.getComputedStyle(thisDiv).borderBottom.split("px");
                
                colWidth = (gameWidth - (parseInt(colLeftMargin[0]) + parseInt(colRightMargin[0])) * gameObject.columns) / gameObject.columns;
                colHeight = (gameHeight - parseInt(colTopMargin[0]) - parseInt(colBotMargin[0])) / gameObject.rows;
                this.letterDivSide = (colHeight < colWidth) ? colHeight - 2: colWidth - 2;
            }

            colBorderWidth = .02 * this.letterDivSide;
            thisDiv.style.width = this.letterDivSide + "px";
            thisDiv.style.borderWidth = colBorderWidth + "px";
            thisDiv.style.borderRadius = (this.letterDivSide * .15) + "px";

            if(i === 0)
            {
                colTopBorder = window.getComputedStyle(thisDiv).borderTop.split("px");
                colBottomBorder = window.getComputedStyle(thisDiv).borderBottom.split("px");
                colTopBorder = parseFloat(colTopBorder[0]);
                colBottomBorder = parseFloat(colBottomBorder[0]);
            }

            thisDiv.style.height = ((this.letterDivSide * gameObject.remainArray[i]) + colTopBorder + colBottomBorder) + "px";

            //Get the width for the letter divs.
            if(i === 0)letterDivWidth = window.getComputedStyle(thisDiv).width;

            //Normal background color.
            if(!gameObject.locksArray[i].column && !gameObject.locksArray[i].letter && !this.lost)
            {
                thisDiv.style.backgroundColor = "rgba(255, 255, 255, 1)";
            }

            //Check for letter lock only.
            if(!gameObject.locksArray[i].column && gameObject.locksArray[i].letter && !this.lost)
            {
                thisDiv.style.backgroundColor = "rgba(255, 255, 255, 1)";
            }

            //Check for column lock only.
            if(gameObject.locksArray[i].column && !gameObject.locksArray[i].letter && !this.lost)
            {
                thisDiv.style.backgroundColor = "rgba(157, 188, 255, 1)";
            }

            //Check for word lock and column lock.
            if(gameObject.locksArray[i].column && gameObject.locksArray[i].letter && !this.lost)
            {
                thisDiv.style.backgroundColor = "rgba(169, 255, 158, 1)";
            }

            //check for game lost
            if(this.lost)
            {
                thisDiv.style.backgroundColor = "rgb(255, 138, 134)";
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
                if(this.lost || this.win)thisDiv.style.cursor = "auto";

                //Explicitly assign letter div height for transition effect.
                thisDiv.style.height = this.letterDivSide + "px"; 
                thisDiv.style.width = letterDivWidth + "px";

                if(gameObject.locksArray[i].column && gameObject.locksArray[i].letter)
                {
                    thisDiv.style.fontWeight = "bold";
                }
                else
                {
                    thisDiv.style.fontWeight = "normal";
                }
                
                if(!this.lost && !this.win)
                {
                    thisDiv.addEventListener("click", this.letterClick);
                }
                
                //Add event listeners for mouse hovering.
                if(!gameObject.solvedArray[i] && !this.lost)
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
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                let thisLetter = this.columnArray[i].childNodes[j].innerHTML;
                if(usedLettersArray.includes(thisLetter) && (!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter))
                {
                    this.columnArray[i].childNodes[j].style.transitionDuration = "0s";
                    this.columnArray[i].childNodes[j].style.fontWeight = "bold";
                }
            }
        }

        //Update the score
        this.scoreDiv.innerHTML = "Score: " + gameObject.score;
    }

    //Shake columns whose indexes are in the animation index array.
    doShakeAnimations = (animIndexArray) =>
    {
        switch(this.animState)
        {
            case 0:
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
                clearTimeout(this.animTimer);
                this.animState = 0;
                animIndexArray.length = 0;
            break;
        }
    }

    animScrollUp = (thisScroll, endOffset, dy, thisDiv, dt) =>
    {
        thisScroll += dy;

        if(thisScroll >= endOffset)
        {
            thisScroll = endOffset;
        }
        else
        {
            setTimeout(() => this.animScrollUp(thisScroll, endOffset, dy, thisDiv, dt), dt);
        }

        thisDiv.scrollTop = thisScroll;
    }

    animScrollDown = (thisScroll, endOffset, dy, thisDiv, dt) =>
    {
        thisScroll -= dy;

        if(thisScroll <= endOffset)
        {
            thisScroll = endOffset;
        }
        else
        {
            setTimeout(() => this.animScrollDown(thisScroll, endOffset, dy, thisDiv, dt), dt);
        }

        thisDiv.scrollTop = thisScroll;
    }

    //Swaps columns whose indexes are in the animation index array.
    animSwap1 = (animIndexArray) =>
    {
        clearTimeout(this.animTimer);
        if(animIndexArray.length === 2)
        {
            let xpos0 = parseFloat(this.columnArray[animIndexArray[0]].getBoundingClientRect().x);
            let xpos1 = parseFloat(this.columnArray[animIndexArray[1]].getBoundingClientRect().x);
            let xdiff = xpos0 - xpos1;

            this.columnArray[animIndexArray[0]].style.transform = "translate(" + (-xdiff) + "px)";
            this.columnArray[animIndexArray[0]].style.transitionDuration = ".4s";
            this.columnArray[animIndexArray[1]].style.transform = "translate(" + xdiff + "px)";
            this.columnArray[animIndexArray[1]].style.transitionDuration = ".4s";
        }
        this.animTimer = setTimeout(() => this.evalSwap(animIndexArray), 500);
         
    }

    animSwap2 = () =>
    {
        this.redraw();
        clearTimeout(this.animTimer);
    }

    //Shrink the score away.
    shrinkScore = (scoreDiv) =>
    {
        scoreDiv.style.transform = "scale(1.5, 1.5)";
        scoreDiv.style.color = "rgba(162, 0, 255, 0)";
        scoreDiv.style.transitionDuration = ".8s";
        setTimeout(() => this.removeScore(scoreDiv), 400);
    }

    //Remove the score div.
    removeScore = (scoreDiv) =>
    {
        scoreDiv.remove();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Evaluation Functions                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //-------------------- Start Evaluations --------------------

    evaluate = () =>
    {
        this.colIndex1 = undefined;
        this.colIndex2 = undefined;
        this.letterIndex1 = undefined;
        this.letterIndex2 = undefined;
        this.disableReset();
        this.removeAllListeners();
        this.doEvaluations();
    }

    //-------------------- Column Lock Animations --------------------

    animColumnLocks = (newColumnLocksArray, scorePerColumn) =>
    {
        let gameObject = this.getGameObject();

        for(let i = 0; i < newColumnLocksArray.length; i++)
        {
            this.columnArray[newColumnLocksArray[i]].style.backgroundColor = "rgba(157, 188, 255, 1)";
            this.columnArray[newColumnLocksArray[i]].style.transitionDuration = ".4s";

            //Add the score added to the top of each column.
            let colScoreDiv = document.createElement("div");
            let fontSize = .3 * this.letterDivSide;
            colScoreDiv.style.fontSize = fontSize + "px";
            colScoreDiv.style.fontWeight = "bold";
            colScoreDiv.style.color = "rgba(162, 0, 255, 1)";
            colScoreDiv.style.top = (.2 * this.letterDivSide) + "px";
            colScoreDiv.style.left = "0px";
            colScoreDiv.innerHTML = "+" + scorePerColumn;
            colScoreDiv.classList.add("column-score");
            this.columnArray[newColumnLocksArray[i]].appendChild(colScoreDiv);

            //Shrink the score away after a period of time.
            setTimeout(() => this.shrinkScore(colScoreDiv), 10);
        }

        //Only delay if work was done.
        if(newColumnLocksArray.length > 0)
        {
            this.scoreDiv.innerHTML = "Score: " + gameObject.score;
            setTimeout(this.evalDoneColumn, 700);
        }
        else
        {
            this.redraw();
            this.evalDoneColumn();
        }
    }

    //-------------------- Completed Columns Animations --------------------

    animDoneColumn1 = (newDoneColumnArray, scorePerRemovedLetter) =>
    {
        //Update the score.
        let gameObject = this.getGameObject();
        this.scoreDiv.innerHTML = "Score: " + gameObject.score;

        //Cycle through the solved columns and remove all the letters except for the top one.
        for(let i = 0; i < newDoneColumnArray.length; i++)
        {
            //Set scroll offset to zero to make things easier.
            this.columnArray[newDoneColumnArray[i]].scrollTop = 0;

            //Remove all letters except for the first one.
            for(let j = 1; j < this.columnArray[newDoneColumnArray[i]].childNodes.length; j++)
            {
                this.columnArray[newDoneColumnArray[i]].childNodes[j].style.transform = "scale(0, 0)";
                this.columnArray[newDoneColumnArray[i]].childNodes[j].style.transitionDuration = ".8s";
            }

            //Add score divs to each letter to be removed.
            let numNodes = this.columnArray[newDoneColumnArray[i]].childNodes.length;
            for(let j = 1; j < numNodes; j++)
            {
                let ypos = this.columnArray[newDoneColumnArray[i]].childNodes[j].getBoundingClientRect().height * j;
                ypos += .25 * this.letterDivSide;
                let scoreDiv = document.createElement("div");
                let fontSize = .3 * this.letterDivSide;
                scoreDiv.style.fontSize = fontSize + "px";
                scoreDiv.style.fontWeight = "bold";
                scoreDiv.style.color = "rgba(162, 0, 255, 1)";
                scoreDiv.style.top = ypos + "px";
                scoreDiv.style.left = "0px";
                scoreDiv.innerHTML = "+" + scorePerRemovedLetter;
                scoreDiv.classList.add("column-score");
                this.columnArray[newDoneColumnArray[i]].appendChild(scoreDiv);
                setTimeout(() => this.shrinkScore(scoreDiv), 10);
            }
        }

        //Only delay if work was done.
        if(newDoneColumnArray.length > 0)
        {
            setTimeout(() => this.animDoneColumn2(newDoneColumnArray), 800);
        }
        else
        {
            this.animDoneColumn2(newDoneColumnArray);
        } 
    }

    animDoneColumn2 = (newDoneColumnArray) =>
    {
        let thisDiv = this.columnArray[0];
        let colTopBorder, colBottomBorder;

        //Calculate border widths.
        colTopBorder = window.getComputedStyle(thisDiv).borderTop.split("px");
        colBottomBorder = window.getComputedStyle(thisDiv).borderBottom.split("px");
        colTopBorder = parseFloat(colTopBorder[0]);
        colBottomBorder = parseFloat(colBottomBorder[0]);

        //Transition background color to green and resize column to a single letter height plus border.
        for(let i = 0; i < newDoneColumnArray.length; i++)
        {
            this.columnArray[newDoneColumnArray[i]].childNodes[0].style.transitionDuration = ".4s";
            this.columnArray[newDoneColumnArray[i]].style.transitionDuration = ".4s";
            this.columnArray[newDoneColumnArray[i]].childNodes[0].style.fontWeight = "bold";
            this.columnArray[newDoneColumnArray[i]].style.backgroundColor = "rgba(169, 255, 158, 1)";
            this.columnArray[newDoneColumnArray[i]].style.height = (this.letterDivSide + colTopBorder + colBottomBorder) + "px";
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
        let usedLettersArray = this.getUsedLettersArray();
        let gameObject = this.getGameObject();

        //Set smooth scrolling for all columns.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            this.columnArray[i].classList.add("smooth-scroll");
        }

        //Double up the letters in each column.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            let numColItems = this.columnArray[i].childNodes.length;
            let letterDivWidth = window.getComputedStyle(this.columnArray[i]).width;

            let totalHeight = window.getComputedStyle(this.columnArray[i]).height.split("px");
            let topBorder = window.getComputedStyle(this.columnArray[i]).borderTop.split("px");
            let bottomBorder = window.getComputedStyle(this.columnArray[i]).borderBottom.split("px");
            totalHeight = parseFloat(totalHeight[0]);
            topBorder = parseFloat(topBorder[0]);
            bottomBorder = parseFloat(bottomBorder[0]);
            this.columnArray[i].style.height = totalHeight + "px";

            //Make sure column does not end up with a scroll bar.
            this.columnArray[i].style.overflowY = "hidden";
        
            for(let j = 0; j < numColItems; j++)
            {
                let tempLetter = this.columnArray[i].childNodes[j].innerHTML;
                let thisDiv = document.createElement("div");
                this.columnArray[i].appendChild(thisDiv);
                thisDiv.classList.add("letter-div");
                thisDiv.innerHTML = tempLetter;
                thisDiv.style.fontSize = this.letterHeight + "px";
                thisDiv.style.height = this.letterDivSide + "px"; 
                thisDiv.style.width = letterDivWidth + "px";
            }
        }

        //Cycle through all the letters on the screen and bold the used letters.
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

        //Adjust scroll offset of columns to scroll.
        for(let i = 0; i < scrollArray.length; i++)
        {
            this.columnArray[scrollArray[i].colIndex].scrollTop += this.letterDivSide * scrollArray[i].scrollIndex;
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
                    this.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                    this.columnArray[i].childNodes[j].style.fontWeight = "bold";
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

    animUnusedLetters1 = (unusedLettersArray, scorePerUnusedLetter) =>
    {
        let workDone = false; //Only delay if some animations set.
        let gameObject = this.getGameObject();

        //Update the score.
        this.scoreDiv.innerHTML = "Score: " + gameObject.score;
    
        if(this.debug)console.log("Unused Letters:");
        if(this.debug)console.log(unusedLettersArray);
    
        for(let i = 0; i < gameObject.columns; i++)
        {
            //Only work on columns that have not already been solved
            if(!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter)
            {    
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

                //Add score divs to each letter to be removed.
                let numNodes = this.columnArray[i].childNodes.length;
                for(let j = 0; j < numNodes; j++)
                {
                    let thisLetter = this.columnArray[i].childNodes[j].innerHTML;
                    if(unusedLettersArray.includes(thisLetter))
                    {
                        let ypos = this.columnArray[i].childNodes[j].getBoundingClientRect().height * j;
                        ypos += .25 * this.letterDivSide;
                        let xpos = .15 * this.letterDivSide;
                        let scoreDiv = document.createElement("div");
                        let fontSize = .3 * this.letterDivSide;
                        scoreDiv.style.fontSize = fontSize + "px";
                        scoreDiv.style.fontWeight = "bold";
                        scoreDiv.style.color = "rgba(162, 0, 255, 1)";
                        scoreDiv.style.top = ypos + "px";
                        scoreDiv.style.left = xpos + "px";
                        scoreDiv.innerHTML = "+" + scorePerUnusedLetter;
                        scoreDiv.classList.add("column-score");
                        this.columnArray[i].appendChild(scoreDiv);
                        setTimeout(() => this.shrinkScore(scoreDiv), 10);
                    }
                }
            }
        }
    
        if(workDone)
        {
            setTimeout(() => this.evalUnusedLetters2(unusedLettersArray), 500);
        }
        else
        {
            this.evalUnusedLetters2(unusedLettersArray);
        } 
    }

    animUnusedLetters2 = (unusedLettersArray, newSolvedArray) =>
    {
        let workDone = false; //Only delay if some animations set.
        let gameObject = this.getGameObject();
    
        //Move letters up in the columns to fill in any holes from removed letters.
        for(let i = 0; i < gameObject.columns; i++)
        {
            let missingLetters = 0;
            let newSolved = newSolvedArray.includes(i);

            //Set column height explicitly.
            let totalHeight = window.getComputedStyle(this.columnArray[i]).height.split("px");
            totalHeight = parseFloat(totalHeight[0]);
            this.columnArray[i].style.height = totalHeight + "px";
    
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
                        let dy = -missingLetters * this.letterDivSide;
                        this.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                        this.columnArray[i].childNodes[j].style.transform = "translateY(" + dy + "px)";
                    }
                }
            }
    
            //Resize column, if necessary.
            if(missingLetters)
            {
                let colTopBorder = window.getComputedStyle(this.columnArray[i]).borderTop.split("px");
                let colBottomBorder = window.getComputedStyle(this.columnArray[i]).borderBottom.split("px");
                colTopBorder = parseFloat(colTopBorder[0]);
                colBottomBorder = parseFloat(colBottomBorder[0]);

                this.columnArray[i].style.transitionDuration = ".4s";
                this.columnArray[i].style.height = ((ge.gameObject.remainArray[i] - missingLetters) * this.letterDivSide + colTopBorder + colBottomBorder) + "px";
                workDone = true;
            }

            if(newSolved)
            {                
                this.columnArray[i].style.transitionDuration = ".4s";
                this.columnArray[i].style.backgroundColor = "rgba(169, 255, 158, 1)";
            }
        }
    
        if(workDone)
        {
            setTimeout(() => this.evalUnusedLetters3(newSolvedArray), 500);
        }
        else
        {
            this.evalUnusedLetters3(newSolvedArray);
        } 
    }

    animUnusedLetters3 = () =>
    {
        this.redraw();
        this.updateGameState();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Win, Lose, Play Functions                                  //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    winLoseStyleChange = (numTries) =>
    {
        this.remainDiv.innerHTML = "Tries: " + numTries;
        this.enableReset();

        //Remove all event listeners from game field.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                this.columnArray[i].childNodes[j].removeEventListener("click", this.letterClick);
                this.columnArray[i].childNodes[j].removeEventListener("mouseenter", this.hoverOver);
                this.columnArray[i].childNodes[j].removeEventListener("mouseleave", this.mouseLeave);
                this.columnArray[i].childNodes[j].style.cursor = "auto";
            }
        }
    }

    //Reset the game.
    newGame = () =>
    {
        this.win = false;
        this.lost = false;
        this.goButton.removeEventListener("click", this.newGame);
        this.goButton.addEventListener("click", this.evaluate);
        this.goButton.src = "./images/GoButton1.png"
        this.resetFunction();
    }

    //Replace the go button with the next button.
    showNextButton = () =>
    {
        this.goButton.removeEventListener("click", this.evaluate);
        this.goButton.src = "./images/NextButton.png";
        this.goButton.addEventListener("click", this.newGame);
        this.goButton.classList.add("go-icon");
        this.enableReset();
    }

    gamePlay = () =>
    {   
        this.redraw();
        this.enableReset();
        this.addAllListeners();
    } 

    gameWon = (gameObject, multiplier) =>
    {
        //Update the score.
        this.scoreDiv.innerHTML = "Score: " + gameObject.score;

        //Show score multiplier, if there is one.
        if(multiplier > 1)
        {
            let scoreDiv = document.createElement("div");
            let fontSize = .05 * this.gameBody.getBoundingClientRect().width;
            scoreDiv.style.fontSize = fontSize + "px";
            scoreDiv.style.fontWeight = "bold";
            scoreDiv.style.color = "rgba(162, 0, 255, 1)";
            scoreDiv.innerHTML = "Score Multiplier X" + multiplier;
            scoreDiv.classList.add("column-score");
            this.gameBody.appendChild(scoreDiv);

            //Center multiplier text in game body.
            let xpos = this.gameBody.getBoundingClientRect().width / 2 - scoreDiv.getBoundingClientRect().width / 2;
            let ypos = this.gameBody.getBoundingClientRect().height / 2;
            scoreDiv.style.top = ypos + "px";
            scoreDiv.style.left = xpos + "px";

            setTimeout(() => this.shrinkScore(scoreDiv), 10);
        }

        this.winLoseStyleChange(gameObject.numTries);
        this.disableReset();

        //Rotate letters and slightly enlarge.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            this.columnArray[i].style.transitionDuration = ".2s";
            this.columnArray[i].style.transform = "rotate(45deg) scale(1.1)";
        }

        setTimeout(this.animGameWon1, 300);
    }

    animGameWon1 = () =>
    {
        //Put letters back in original state.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            this.columnArray[i].style.transitionDuration = ".7s";
            this.columnArray[i].style.transform = "rotate(-360deg) scale(1.0)";
        }

        this.win = true;
        setTimeout(this.showNextButton, 700);
    }

    gameLost = () =>
    {
        setTimeout(this.animGameLost0, 500);
    }

    animGameLost0 = () =>
    {
        let gameObject = this.getGameObject();
        this.winLoseStyleChange(gameObject.numTries);
        this.disableReset();

        for(let i = 0; i < this.columnArray.length; i++)
        {
            //Check if column is in the right position.
            if(gameObject.columnArray[i] !== i)
            {
                let targetPosition = this.columnArray[gameObject.columnArray[i]].getBoundingClientRect().x;
                let startPosition = this.columnArray[i].getBoundingClientRect().x;

                let dx = targetPosition - startPosition;

                this.columnArray[i].style.transitionDuration = ".4s";
                this.columnArray[i].style.transform = "translateX(" + dx + "px)";
            }

            this.columnArray[i].style.transitionDuration = ".4s";
            this.columnArray[i].style.backgroundColor = "rgb(255, 138, 134)";
        }

        //Move and incorrect columns in the game object.
        let isOrdered = true;

        do
        {
            isOrdered = true;
            for(let i = 0; i < gameObject.columns; i++)
            {
                if(gameObject.columnArray[i] !== i)
                {
                    this.loseSwap([i, gameObject.columnArray[i]]);
                    isOrdered = false;
                }
            }

        }while(!isOrdered);

        setTimeout(this.animGameLost1, 500);
    }

    animGameLost1 = () =>
    {
        let gameObject = this.getGameObject();
        let letterIndexArray = new Array(0);

        this.lost = true;
        this.redraw();
        this.winLoseStyleChange(gameObject.numTries);
        this.disableReset();
        
        //Get the index of the child nodes for each of the correct letters.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                if(this.columnArray[i].childNodes[j].innerHTML === gameObject.winningRow[i])
                {
                    letterIndexArray.push(j);
                    break;
                }
            }
        }

        //Shrink away all letters that are not part of the solution.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            for(let j = 0; j < this.columnArray[i].childNodes.length; j++)
            {
                if(letterIndexArray[i] !== j)
                {
                    this.columnArray[i].childNodes[j].style.transitionDuration = "0.4s";
                    this.columnArray[i].childNodes[j].style.transform = "scale(0)";
                }
            }
        }

        setTimeout(() => this.animGameLost2(letterIndexArray), 500);
    }

    animGameLost2 = (letterIndexArray) =>
    {
        //Move all letters to the top row.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            let dy = -letterIndexArray[i] * this.letterDivSide;   
            this.columnArray[i].childNodes[letterIndexArray[i]].style.transitionDuration = "0.4s";
            this.columnArray[i].childNodes[letterIndexArray[i]].style.transform = "translateY(" + dy + "px)";
            this.columnArray[i].childNodes[letterIndexArray[i]].style.fontWeight = "bold";
        }

        //Shrink the columns to the correct size.
        for(let i = 0; i < this.columnArray.length; i++)
        {
            let colTopBorder = window.getComputedStyle(this.columnArray[i]).borderTop.split("px");
            let colBottomBorder = window.getComputedStyle(this.columnArray[i]).borderBottom.split("px");
            colTopBorder = parseFloat(colTopBorder[0]);
            colBottomBorder = parseFloat(colBottomBorder[0]);

            this.columnArray[i].style.transitionDuration = ".4s";
            this.columnArray[i].style.height = (this.letterDivSide + colTopBorder + colBottomBorder) + "px";
        }

        //Make sure presentation stays consistent after a screen resize.
        this.setGameLost();
        setTimeout(this.showNextButton, 700);
    }
}