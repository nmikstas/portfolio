"use strict";

//Print debug info.
let debug = false;

//Initial state of game parameters.
let rows = 7;
let columns = 7;
let numWords = 1;
let minLength = 5;
let numTries = 4;

let gg = new GameGenerator1(); //Create a new game generator.
let gp = new GamePrinter1(); //Create a new game printer.
let ge = new GameEngine1({debug: debug}); //Create a new game engine.
let gr = new GameRenderer1 //Create a new game renderer.
(
    document.getElementById("game-body"),
    document.getElementById("go-btn"),
    document.getElementById("remain-span"),
    {debug: debug}
);

/************************************* Game Control Functions ************************************/

const evaluate = () =>
{
    gr.animActive = true;
    document.getElementById("go-btn").removeEventListener("click", evaluate);
    ge.doEvaluations();
}

//-------------------- Finished Evaluations --------------------

const evalFinished = () =>
{   
    gr.animActive = false;
    document.getElementById("go-btn").addEventListener("click", evaluate);
} 

const resetGame = () =>
{
    ge.copyGameObject(gg.newGameObject(rows, columns, numWords, minLength, numTries));
    ge.usedLettersArray.length = 0;
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

//Update the rotation of the column after a user has clicked and dragged it.
const updateColumnDrag = () =>
{
    if(gr.isGo)
    {
        gr.isGo = false;
        return;
    }

    if(gr.animActive) return;
    if(gr.singleClick) return;

    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        //Get number of letters remaining in current column.
        let lettersRemaining = ge.gameObject.remainArray[i];

        //Get the scroll offset for current column.
        let thisScrollOffset = gr.columnArray[i].scrollTop;

        //Caclulate the scroll offset for the first character.
        let zeroScroll = Math.floor(gr.letterHeight * lettersRemaining);

        //Calculate how many letters away from zero scroll.
        let lettersOffset = Math.round((thisScrollOffset - zeroScroll) / gr.letterHeight) % lettersRemaining;
    
        //Update the column in the game engine.
        ge.scrollColumn(i, lettersOffset);
    }

    gr.redraw();
}

/********************************** Game Presentation Functions **********************************/

//Swaps columns whose indexes are in the animation index array.
const animSwap1 = (animIndexArray) =>
{
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
    gr.animTimer = setTimeout(() => evalSwap(animIndexArray), 500);   
}

const evalSwap = (animIndexArray) =>
{
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
    animSwap2();
}

const animSwap2 = () =>
{
    gr.redraw();
    gr.animActive = false;
    clearTimeout(gr.animTimer);
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
    gr.redraw();
});

//Resize window event listener.
const resize = window.addEventListener("resize", () =>
{
    gr.redraw();
});

//Check for column updates whenever the mouse button is released.
document.addEventListener("mouseup", updateColumnDrag);
document.addEventListener("touchup", updateColumnDrag);

//Event listeners for the "Go" button.
document.getElementById("go-btn").addEventListener("mousedown", () =>
{
    gr.isGo = true;
    gr.colIndex1 = undefined;
    gr.colIndex2 = undefined;
});

document.getElementById("go-btn").addEventListener("touchstart", () =>
{
    gr.isGo = true;
});

document.getElementById("go-btn").addEventListener("click", evaluate);

/******************************************* Game Code *******************************************/

//Setup game engine and game renderer callbacks.
ge.printGameObject = gp.printGameObject;
ge.animColumnLocks = gr.animColumnLocks;
ge.animDoneColumn1 = gr.animDoneColumn1;
ge.animRightLetWrongCol1 = gr.animRightLetWrongCol1;
ge.animRightLetWrongCol2 = gr.animRightLetWrongCol2,
ge.animUsedLetters1 = gr.animUsedLetters1;
ge.animUsedLetters2 = gr.animUsedLetters2;
ge.animUnusedLetters1 = gr.animUnusedLetters1;
ge.animUnusedLetters2 = gr.animUnusedLetters2;
ge.animUnusedLetters3 = gr.animUnusedLetters3;

gr.getGameObject = ge.getGameObject;
gr.getUsedLettersArray = ge.getUsedLettersArray;
gr.evalDoneColumn = ge.evalDoneColumn;
gr.evalRightLetWrongCol1 = ge.evalRightLetWrongCol1;
gr.evalRightLetWrongCol2 = ge.evalRightLetWrongCol2;
gr.evalUsedLetters = ge.evalUsedLetters;
gr.evalUnusedLetters1 = ge.evalUnusedLetters1;
gr.evalUnusedLetters2 = ge.evalUnusedLetters2;
gr.evalFinished = evalFinished;

resetGame();
gr.redraw();
if(debug)gp.printGameObject(ge.gameObject);
