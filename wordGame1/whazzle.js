"use strict";

//Print debug info.
let debug = true;

//Initial state of game parameters.
let rows = 5;
let columns = 6;
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

/**************************** Top Level Event Listeners and Functions ****************************/

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

    ge.resetGame();
    gr.resetGame();
    gr.redraw();
});

/************************************** Game Initialization **************************************/

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
ge.newGameObject = gg.newGameObject;
ge.evalFinished = gr.evalFinished;
ge.animSwap2 = gr.animSwap2;

gr.getGameObject = ge.getGameObject;
gr.doEvaluations = ge.doEvaluations;
gr.getUsedLettersArray = ge.getUsedLettersArray;
gr.evalDoneColumn = ge.evalDoneColumn;
gr.evalRightLetWrongCol1 = ge.evalRightLetWrongCol1;
gr.evalRightLetWrongCol2 = ge.evalRightLetWrongCol2;
gr.evalUsedLetters = ge.evalUsedLetters;
gr.evalUnusedLetters1 = ge.evalUnusedLetters1;
gr.evalUnusedLetters2 = ge.evalUnusedLetters2;
gr.evalUnusedLetters3 = ge.evalUnusedLetters3;
gr.scrollColumn = ge.scrollColumn;
gr.evalSwap = ge.evalSwap;

ge.resetGame();
gr.resetGame();
gr.redraw();
if(debug)ge.printGameObject(ge.gameObject);
