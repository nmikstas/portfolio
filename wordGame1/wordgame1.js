"use strict";

//Print debug info.
let debug = true;

//Initial state of game parameters.
let rows = 7;
let columns = 7;
let numWords = 1;
let minLength = 5;
let numTries = 4;

//Fix this.
let usedLettersArray = new Array(0);

//Go button pressed indicator.
let isGo = false;

let gg = new GameGenerator1(); //Create a new game generator.
let gp = new GamePrinter1(); //Create a new game printer.
let ge = new GameEngine1(); //Create a new game engine.
let gr = new GameRenderer1 //Create a new game renderer.
(
    document.getElementById("game-body"),
    document.getElementById("go-btn"),
    document.getElementById("remain-span")
);

/************************************* Game Control Functions ************************************/

const evaluate = () =>
{
    gr.animActive = true;
    document.getElementById("go-btn").removeEventListener("click", evaluate);
    ge.doEvaluation();
}

//-------------------- Right Letter Wrong Column Evaluations --------------------

//Game renderer
const animRightLetWrongCol2 = () =>
{
    //Set smooth scrolling for all columns.
    for(let i = 0; i < gr.columnArray.length; i++)
    {
        gr.columnArray[i].classList.remove("smooth-scroll");
    }
   
    gr.redraw(ge.gameObject, usedLettersArray);
    evalRightLetWrongCol2();
}

//Game engine.
const evalRightLetWrongCol2 = () =>
{
    if(ge.didSwap)
    {
        ge.updateColumns(); //Consolidate columns.   
        ge.doEvaluation();
    }
    else
    {
        evalUsedLetters();
    }
}

//-------------------- Used Letter Evaluations --------------------

const evalUsedLetters = () =>
{
    let prevLength = usedLettersArray.length;

    //Loop through the top row of letters and look for ones in the solution.
    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        //Skip solved columns.
        if(!ge.gameObject.locksArray[i].column || !ge.gameObject.locksArray[i].letter)
        {
            let thisLetter = ge.gameObject.letterArray[0][i];

            //Loop through winning row and locks array to see if this a used letter not yet solved for.
            for(let j = 0; j < ge.gameObject.columns; j++)
            {
                //If letter appears in the winning row in an unlocked column, add it to the used letters array.
                if((thisLetter === ge.gameObject.winningRow[j]) && (!ge.gameObject.locksArray[j].column || !ge.gameObject.locksArray[j].letter))
                {
                    //Only add if its not already in there.
                    if(!usedLettersArray.includes(thisLetter))
                    {
                        usedLettersArray.push(thisLetter);
                    }
                }
            }
        }
    }

    if(debug)console.log("Used Letters:");
    if(debug)console.log(usedLettersArray);


    //Run the used letters animation only if something has changed.
    if(usedLettersArray.length !== prevLength)
    {
        animUsedLetters1();
    }
    else
    {
        evalUnusedLetters();
    }
}

const animUsedLetters1 = () =>
{

    //Cycle through all the letters on the screen and add an orange background to the used letters.
    for(let i = 0; i < gr.columnArray.length; i++)
    {
        for(let j = 0; j < gr.columnArray[i].childNodes.length; j++)
        {
            let thisLetter = gr.columnArray[i].childNodes[j].innerHTML;
            if(usedLettersArray.includes(thisLetter) && (!ge.gameObject.locksArray[i].column || !ge.gameObject.locksArray[i].letter))
            {
                gr.columnArray[i].childNodes[j].style.fontWeight = "bold";
                gr.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
            }
        }
    }

    setTimeout(animUsedLetters2, 500);
}

const animUsedLetters2 = () =>
{
    ge.updateColumns(); //Consolidate columns.   
    ge.checkLetterLock(); //Check for letter lock only.
    gr.redraw(ge.gameObject, usedLettersArray);
    evalUnusedLetters();
}

//-------------------- Unused Letter Evaluations --------------------

const evalUnusedLetters = () =>
{
    let unusedLettersArray = new Array(0);

    //Create an ibject that holds all the instances of letters used in the solution.
    let alphabetObj =
    {
        A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0,
        N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0
    }

    //Keep track of what letters and how many are used in the solution.
    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        alphabetObj[ge.gameObject.winningRow[i]]++;
    }

    //Now subtract the solved letters from the alphabet object.
    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        if(ge.gameObject.locksArray[i].column && ge.gameObject.locksArray[i].letter)
        {
            alphabetObj[ge.gameObject.letterArray[0][i]]--;
        }
    }

    console.log(alphabetObj)

    //Now we can calculate an array of unused letters.
    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        if(alphabetObj[ge.gameObject.letterArray[0][i]] === 0)
        {
            let thisLetter = ge.gameObject.letterArray[0][i];
            if(!unusedLettersArray.includes(thisLetter))
            {
                unusedLettersArray.push(thisLetter);
            }
        }
    }

    console.log(unusedLettersArray)

    if(unusedLettersArray.length !== 0)
    {
        if(debug)console.log("Unused Letters:");
        if(debug)console.log(unusedLettersArray);

        //Shrink unused letters away.
        for(let i = 0; i < ge.gameObject.columns; i++)
        {
            //Only work on columns that have not already been solved
            if(!ge.gameObject.locksArray[i].column || !ge.gameObject.locksArray[i].letter)
            {
                //Reset scroll for animation effects.
                gr.columnArray[i].scrollTop = 0;

                for(let j = 0; j < gr.columnArray[i].childNodes.length; j++)
                {
                    let thisLetter = gr.columnArray[i].childNodes[j].innerHTML;
                    if(unusedLettersArray.includes(thisLetter))
                    {
                        gr.columnArray[i].childNodes[j].style.transform = "scale(0, 0)";
                        gr.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                    }
                }
            }
        }

        //Remove letters from the game object.
        for(let i = 0; i < ge.gameObject.letterArray.length; i++)
        {
            //Need to make sure things are up to date.
            if(ge.gameObject.locksArray[i].letter)
            {
                ge.gameObject.remainArray[i] = 1;
            }

            for(let j = 0; j < ge.gameObject.letterArray[i].length; j++)
            {
                if(unusedLettersArray.includes(ge.gameObject.letterArray[i][j]))
                {
                    ge.gameObject.letterArray[i][j] = " ";
                }
            }
        }

        setTimeout(() => animUnusedLetters(unusedLettersArray), 500);
    }
    else
    {
        evalFinished();
    }
}

const animUnusedLetters = (unusedLettersArray) =>
{
    //Move letters up in the columns to fill in any holes from removed letters.
    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        let missingLetters = 0;

        //Go through only the first repitition of letters.
        for(let j = 0; j < ge.gameObject.remainArray[i]; j++)
        {
            let thisLetter
            try
            {
                thisLetter = gr.columnArray[i].childNodes[j].innerHTML;
            }
            catch(error)
            {
                console.log("ERROR");
                console.log("i: %s, j: %s, gameObject.remainArray[i]: %s, childNodes length: %s", 
                             i, j, ge.gameObject.remainArray[i], gr.columnArray[i].childNodes.length)
            }
            
            if(unusedLettersArray.includes(thisLetter) && ge.gameObject.remainArray[i] > 1)
            {
                //Letter has been removed.
                missingLetters++;
            }
            else
            {
                //Letter is still present. Move it up, if necessary.
                if(missingLetters)
                {
                    let dy = -missingLetters * gr.letterHeight;
                    gr.columnArray[i].childNodes[j].style.transitionDuration = ".4s";
                    gr.columnArray[i].childNodes[j].style.transform = "translateY(" + dy + "px)";
                }
            }
        }

        //Resize column, if necessary.
        if(missingLetters)
        {
            gr.columnArray[i].style.transitionDuration = ".4s";
            gr.columnArray[i].style.height = ((ge.gameObject.remainArray[i] - missingLetters) * gr.letterHeight) + "px";
        }
    }

    setTimeout(animUnusedLettersFinish, 500);
}

const animUnusedLettersFinish = () =>
{
    ge.updateColumns(); //Consolidate columns.   
    ge.checkLetterLock(); //Check for letter lock only.

    gr.redraw(ge.gameObject, usedLettersArray);
    setTimeout(evalFinished, 500);
}

//-------------------- Finished Evaluations --------------------
const evalFinished = () =>
{   
    gr.redraw(ge.gameObject, usedLettersArray);
    gr.animActive = false;
    document.getElementById("go-btn").addEventListener("click", evaluate);
}

const resetGame = () =>
{
    ge.copyGameObject(gg.newGameObject(rows, columns, numWords, minLength, numTries));
    usedLettersArray.length = 0;
}

//Set the selections in the game settings modal.
const setSelections = (rows, columns, numWords, minLength, numTries) =>
{
    const minRows = 3;
    const minColumns = 5;
    const minWords = 1;
    const minLen = 2;
    const minTries = 2;

    let selRows = document.getElementById("sel-rows");
    let selColumns = document.getElementById("sel-columns");
    let selWords = document.getElementById("sel-words");
    let selLength = document.getElementById("sel-length");
    let selTries = document.getElementById("sel-tries");

    selRows.selectedIndex = rows - minRows;
    selColumns.selectedIndex = columns - minColumns;
    selWords.selectedIndex = numWords - minWords;
    selLength.selectedIndex = minLength - minLen;
    selTries.selectedIndex = numTries - minTries;
}

//Column swap timer expired. Indicate single click did not happen.
const checkColumnSwap = () =>
{
    gr.singleClick = false;
}

const columnSwap = () =>
{
    let animIndexArray = new Array(0);

    //Save the temp index.
    if(gr.colIndex1 === undefined)
    {
        gr.colIndex1 = gr.tempIndex;
    }
    else if(gr.colIndex2 === undefined)
    {
        gr.colIndex2 = gr.tempIndex;
    }

    if(gr.colIndex1 !== undefined && gr.colIndex2 === undefined)
    {
        //Accounts for a corner case where the border is clicked.
        if(isNaN(gr.colIndex1))
        {
            gr.colIndex1 = undefined;
            gr.colIndex2 = undefined;
            return;
        }

        if(ge.gameObject.locksArray[gr.colIndex1].column)
        {
            //Locked. Indicate it can't move and cancel.
            animIndexArray.push(gr.colIndex1);
            gr.doShakeAnimations(animIndexArray);
            gr.colIndex1 = undefined;
            gr.colIndex2 = undefined;
        }
        else
        {
            gr.columnArray[gr.colIndex1].style.transform = "scale(1.1, 1.05)";
            gr.columnArray[gr.colIndex1].style.transitionDuration = ".15s";
            gr.columnArray[gr.colIndex1].style.backgroundColor = "rgb(230, 230, 230)";
        }
    }
    else if(gr.colIndex1 !== undefined && gr.colIndex2 !== undefined)
    {
        //Accounts for a corner case where the border is clicked.
        if(isNaN(gr.colIndex2))
        {
            gr.colIndex1 = undefined;
            gr.colIndex2 = undefined;
            return;
        }

        if(ge.gameObject.locksArray[gr.colIndex2].column)
        {
            //Locked. Indicate it can't move and cancel.
            gr.columnArray[gr.colIndex1].style.backgroundColor = "rgba(0, 0, 0, 0)";
            gr.columnArray[gr.colIndex1].style.transform = "scale(1.0, 1.0)";
            gr.columnArray[gr.colIndex1].style.transitionDuration = ".15s";
            animIndexArray.push(gr.colIndex1);
            animIndexArray.push(gr.colIndex2);
            gr.doShakeAnimations(animIndexArray);
            gr.colIndex1 = undefined;
            gr.colIndex2 = undefined;
        }
        else if(gr.colIndex1 === gr.colIndex2)
        {
            //Cancel selection.
            gr.columnArray[gr.colIndex1].style.transform = "scale(1.0, 1.0)";
            gr.columnArray[gr.colIndex1].style.transitionDuration = ".15s";
            gr.columnArray[gr.colIndex1].style.backgroundColor = "rgba(0, 0, 0, 0)";
            gr.colIndex1 = undefined;
            gr.colIndex2 = undefined;
        }
        else
        {
            //Swap columns.
            animIndexArray.push(gr.colIndex1);
            animIndexArray.push(gr.colIndex2);
            doSwapAnimations(animIndexArray);
            gr.colIndex1 = undefined;
            gr.colIndex2 = undefined;
        }
    }
}

//Update the rotation of the column after a user has clicked and dragged it.
const updateColumnDrag = () =>
{
    if(isGo)
    {
        isGo = false;
        return;
    }

    if(gr.animActive) return;
    if(gr.singleClick) return;

    for(let i = 0; i < columns; i++)
    {
        //Get number of letters remaining in current column.
        let lettersRemaining = ge.gameObject.remainArray[i];

        //Get the scroll offset for current column.
        let thisScrollOffset = gr.columnArray[i].scrollTop;

        //Caclulate the scroll offset for the first character.
        let zeroScroll = Math.floor(gr.letterHeight * lettersRemaining);

        //Calculate how many letters away from zero scroll.
        let lettersOffset = Math.round((thisScrollOffset - zeroScroll) / gr.letterHeight) % lettersRemaining;
    
        //Get the remaining letters from the current column.
        let tempArray = new Array(0);
        let reformedArray = new Array(0);
        for(let j = 0; j < rows; j++)
        {
            if(ge.gameObject.letterArray[j][i] !== " ")
            {
                tempArray.push(ge.gameObject.letterArray[j][i]);
            }
        }

        //Update the column order.
        if(lettersOffset > 0)
        {
            for(let j = lettersOffset; j < tempArray.length; j++)
            {
                reformedArray.push(tempArray[j]);
            }

            for(let j = 0; j < lettersOffset; j++)
            {
                reformedArray.push(tempArray[j]);
            }

            for(let j = 0; j < reformedArray.length; j++)
            {
                ge.gameObject.letterArray[j][i] = reformedArray[j];
            }
        }

        if(lettersOffset < 0)
        {
            for(let j = tempArray.length + lettersOffset; j < tempArray.length; j++)
            {
                reformedArray.push(tempArray[j]);
            }

            for(let j = 0; j < tempArray.length + lettersOffset; j++)
            {
                reformedArray.push(tempArray[j]);
            }

            for(let j = 0; j < reformedArray.length; j++)
            {
                ge.gameObject.letterArray[j][i] = reformedArray[j];
            }
        }
    }

    //Show the results.
    if(debug)gp.printGameObject(ge.gameObject);
    gr.redraw(ge.gameObject, usedLettersArray);
}

/********************************** Game Presentation Functions **********************************/

//Swaps columns whose indexes are in the animation index array.
const doSwapAnimations = (animIndexArray) =>
{
    switch(gr.animState)
    {
        case 0:
            gr.animActive = true;
            clearTimeout(gr.animTimer);
            if(animIndexArray.length === 2)
            {
                let xpos0 = parseFloat(gr.columnArray[animIndexArray[0]].getBoundingClientRect().x);
                let xpos1 = parseFloat(gr.columnArray[animIndexArray[1]].getBoundingClientRect().x);
                let xdiff = xpos0 - xpos1;

                gr.columnArray[animIndexArray[0]].style.backgroundColor = "rgba(0, 0, 0, 0)";
                gr.columnArray[animIndexArray[0]].style.transform = "translate(" + (-xdiff) + "px)";
                gr.columnArray[animIndexArray[0]].style.transitionDuration = ".4s";

                gr.columnArray[animIndexArray[1]].style.backgroundColor = "rgba(0, 0, 0, 0)";
                gr.columnArray[animIndexArray[1]].style.transform = "translate(" + xdiff + "px)";
                gr.columnArray[animIndexArray[1]].style.transitionDuration = ".4s";
            }
            gr.animTimer = setTimeout(() => doSwapAnimations(animIndexArray), 500);
            gr.animState++;
        break;

        default:
            //Swap columns in the letter array.
            for(let i = 0; i < ge.gameObject.letterArray.length; i++)
            {
                [ge.gameObject.letterArray[i][animIndexArray[0]], ge.gameObject.letterArray[i][animIndexArray[1]]] = 
                [ge.gameObject.letterArray[i][animIndexArray[1]], ge.gameObject.letterArray[i][animIndexArray[0]]];
            }

            //Swap items in the column order.
            [ge.gameObject.columnArray[animIndexArray[0]], ge.gameObject.columnArray[animIndexArray[1]]] =
            [ge.gameObject.columnArray[animIndexArray[1]], ge.gameObject.columnArray[animIndexArray[0]]];

            //Swap items in the locks array.
            [ge.gameObject.locksArray[animIndexArray[0]], ge.gameObject.locksArray[animIndexArray[1]]] =
            [ge.gameObject.locksArray[animIndexArray[1]], ge.gameObject.locksArray[animIndexArray[0]]];

            //Swap items in letters remaining array.
            [ge.gameObject.remainArray[animIndexArray[0]], ge.gameObject.remainArray[animIndexArray[1]]] =
            [ge.gameObject.remainArray[animIndexArray[1]], ge.gameObject.remainArray[animIndexArray[0]]];

            if(debug)gp.printGameObject(ge.gameObject);
            gr.redraw(ge.gameObject, usedLettersArray);
            gr.animActive = false;
            clearTimeout(gr.animTimer);
            gr.animState = 0;
            animIndexArray.length = 0;
        break;
    }
}

/**************************************** Event Listeners ****************************************/

//Event listener that closes modals if clicked outside of modal.
window.onclick = (event) =>
{
    if (event.target.className === "modal")
    {
      event.target.style.display = "none";
    }
}

//Event listeners that close modals if x is clicked.
const settingsModal = document.getElementById("settings-modal");
const helpModal = document.getElementById("help-modal");
let closeBtn = document.getElementsByClassName("close");

closeBtn[0].addEventListener("click", () =>
{
    helpModal.style.display = "none";
    settingsModal.style.display = "none";
});

closeBtn[1].addEventListener("click", () =>
{
    helpModal.style.display = "none";
    settingsModal.style.display = "none";
});

//Event listener that brings up the settings modal.
const settings = document.getElementById("settings");
settings.addEventListener("click", () =>
{
    setSelections(rows, columns, numWords, minLength, numTries);
    let modal = document.getElementById("settings-modal");
    modal.style.display = "block";
    document.getElementById("sel-columns").style.borderColor = "";
    document.getElementById("sel-words").style.borderColor = "";
    document.getElementById("sel-length").style.borderColor = "";
});

//Event listener that brings up the help modal.
const help = document.getElementById("help");
help.addEventListener("click", () =>
{
    let modal = document.getElementById("help-modal");
    modal.style.display = "block";
});

//Event listener that updates the game settings.
const settingsBtn = document.getElementById("settings-btn");
settingsBtn.addEventListener("click", () =>
{
    //Get values of all the text boxes.
    const setRows = parseInt(document.getElementById("sel-rows").value);
    const setColumns = parseInt(document.getElementById("sel-columns").value);
    const setWords = parseInt(document.getElementById("sel-words").value);
    const setLength = parseInt(document.getElementById("sel-length").value);
    const setTries = parseInt(document.getElementById("sel-tries").value);

    //Calculate to see if user values are valid.
    const remainder = setColumns + setWords * (1 - setLength) - 1;

    if(remainder < 0)
    {
        document.getElementById("sel-columns").style.borderColor = "rgb(255, 0, 0)";
        document.getElementById("sel-words").style.borderColor = "rgb(255, 0, 0)";
        document.getElementById("sel-length").style.borderColor = "rgb(255, 0, 0)";
        return;
    }
    
    //User entered values are correct. Update game variables and recalculate everything.
    settingsModal.style.display = "none";
    rows = setRows;
    columns = setColumns;
    numWords = setWords;
    minLength = setLength;
    numTries = setTries;

    resetGame();
    gr.redraw(ge.gameObject, usedLettersArray);
});

//Resize window event listener.
const resize = window.addEventListener("resize", () =>
{
    gr.redraw(ge.gameObject, usedLettersArray);
});

//Check for column updates whenever the mouse button is released.
window.addEventListener("mouseup", updateColumnDrag);
window.addEventListener("touchup", updateColumnDrag);

//Event listeners for the "Go" button.
document.getElementById("go-btn").addEventListener("mousedown", () =>
{
    isGo = true;
    gr.colIndex1 = undefined;
    gr.colIndex2 = undefined;
});

document.getElementById("go-btn").addEventListener("touchstart", () =>
{
    isGo = true;
});

document.getElementById("go-btn").addEventListener("click", evaluate);

/******************************************* Game Code *******************************************/

//Setup game engine and game renderer callbacks.
ge.animColumnLocks = gr.animColumnLocks;
ge.animDoneColumn1 = gr.animDoneColumn1;
ge.animRightLetWrongCol1 = gr.animRightLetWrongCol1;
ge.evalUsedLetters = evalUsedLetters;

gr.evalDoneColumn = ge.evalDoneColumn;
gr.evalRightLetWrongCol = ge.evalRightLetWrongCol;
gr.animRightLetWrongCol2 = animRightLetWrongCol2;

resetGame();
gr.redraw(ge.gameObject, usedLettersArray);
if(debug)gp.printGameObject(ge.gameObject);
