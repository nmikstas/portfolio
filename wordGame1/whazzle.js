"use strict";

//Print debug info.
let debug = true;

//Initial state of game parameters.
let rows = 5;
let columns = 6;
let numTries = 5;

//Make a copy of the game object for printing purposes.
let gameObjectCopy = null;
let setGameObject = null;

let gg = new GameGenerator1(); //Create a new game generator.
let gp = new GamePrinter1(); //Create a new game printer.
let ge = new GameEngine1({debug: debug}); //Create a new game engine.
let gr = new GameRenderer1 //Create a new game renderer.
(
    document.getElementById("game-body"),
    document.getElementById("go-btn"),
    document.getElementById("remain-span"),
    document.getElementById("score-span"),
    {debug: debug}
);

/**************************** Top Level Event Listeners and Functions ****************************/

const doEdit = () =>
{
    let editge = new GameEngine1();
    editge.copyGameObject(JSON.parse(ge.getGameObjectCopy()));
    let editDiv = document.getElementById("edit-div");
    editDiv.innerHTML = "";
    let textLettersArray = new Array(editge.gameObject.rows);

    //Create text areas for each letter in the puzzle.
    for(let i = 0; i < editge.gameObject.rows; i++)
    {
        textLettersArray[i] = new Array(editge.gameObject.column);
        let thisSpan = document.createElement("span");
        thisSpan.classList.add("letter-span");

        for(let j = 0; j < editge.gameObject.columns; j++)
        {
            let thisText = document.createElement("textarea");
            thisText.classList.add("game-letter");
            thisText.setAttribute("maxlength", 1);
            thisText.value = editge.gameObject.letterArray[i][j];
            thisSpan.appendChild(thisText);
            textLettersArray[i][j] = thisText;
        }

        editDiv.appendChild(thisSpan);
        editDiv.appendChild(document.createElement("br"));
    }

    //Make correct letter in each column uneditable.
    for(let i = 0; i < editge.gameObject.columns; i++)
    {
        let isFound = false;
        let winningLetter = editge.gameObject.winningRow[editge.gameObject.columnArray[i]];
        
        for(let j = 0; j < editge.gameObject.rows; j++)
        {
            
            if(textLettersArray[j][i].value === winningLetter && !isFound)
            {
                textLettersArray[j][i].style.backgroundColor = "rgb(255,222,222)";
                textLettersArray[j][i].readOnly = true;
                isFound = true;
            }
            else
            {
                //Force uppercase on letter change.
                textLettersArray[j][i].addEventListener("keyup", () => 
                {
                    textLettersArray[j][i].value = textLettersArray[j][i].value.toUpperCase();
                    updateLetters(editge.gameObject, textLettersArray);
                    editge.updateColumns();
                    
                });
            }
        }
    }








    const editorModal = document.getElementById("editor-modal");
    let saveCancelDiv = document.createElement("div");
    let save = document.createElement("button");
    let cancel = document.createElement("button");
    save.innerHTML = "Save";
    cancel.innerHTML = "Cancel";

    save.addEventListener("click", () =>
    {
        ge.copyGameObject(editge.gameObject);
        gr.resetGame();
        gr.redraw();
        editorModal.style.display = "none";
    });

    cancel.addEventListener("click", () =>
    {
        editorModal.style.display = "none";
    });

    saveCancelDiv.appendChild(save);
    saveCancelDiv.appendChild(cancel);
    editDiv.appendChild(saveCancelDiv);
}

//Helper that updates edited letters.
const updateLetters = (gameObject, letterArray) =>
{
    for(let i = 0; i < gameObject.rows; i++)
    {
        for(let j = 0; j < gameObject.columns; j++)
        {
            if(letterArray[i][j].value === "")
            {
                gameObject.letterArray[i][j] = " ";
            }
            else
            {
                gameObject.letterArray[i][j] = letterArray[i][j].value;
            }
        }
    }
    gameObject
}

//Set the selections in the game settings modal.
const setSelections = (rows, columns, numTries) =>
{
    const minRows = 3;
    const minColumns = 4;
    const minTries = 2;

    let selRows = document.getElementById("sel-rows");
    let selColumns = document.getElementById("sel-columns");
    let selTries = document.getElementById("sel-tries");

    selRows.selectedIndex = rows - minRows;
    selColumns.selectedIndex = columns - minColumns;
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
const editorModal = document.getElementById("editor-modal");
let closeBtn = document.getElementsByClassName("close");

closeBtn[0].addEventListener("click", () =>
{
    settingsModal.style.display = "none";
    editorModal.style.display = "none";
});

closeBtn[1].addEventListener("click", () =>
{
    settingsModal.style.display = "none";
    editorModal.style.display = "none";
});

//Event listener that brings up the settings modal.
const settings = document.getElementById("settings");
settings.addEventListener("click", () =>
{
    setSelections(rows, columns, numTries);
    let modal = document.getElementById("settings-modal");
    modal.style.display = "block";
    document.getElementById("sel-columns").style.borderColor = "";
});

//Event listener that brings up the editor modal.
const editor = document.getElementById("edit");
editor.addEventListener("click", () =>
{
    let modal = document.getElementById("editor-modal");
    modal.style.display = "block";
    doEdit();
});

//Event listener for game object copying.
const stats = document.getElementById("stats");
stats.addEventListener("click", () => 
{
    console.log("Copy original game");
    navigator.clipboard.writeText(gameObjectCopy);
    console.log(gameObjectCopy);
});

//Event listener for original game restore.
const rstrOgGame = document.getElementById("rstr-og-game");
rstrOgGame.addEventListener("click", () => 
{
    console.log("Restore original game");
    ge.copyGameObject(JSON.parse(gameObjectCopy));
    gr.resetGame();
    gr.redraw();
    if(debug)ge.printGameObject(ge.gameObject);

});

//Event listener for set this state.
const setThis = document.getElementById("set-this");
setThis.addEventListener("click", () => 
{
    console.log("Set this state");
    setGameObject = ge.getGameObjectCopy();
    if(debug)console.log(setGameObject);
});

//Event listener for restore this state.
const restoreThis = document.getElementById("restore-this");
restoreThis.addEventListener("click", () => 
{
    console.log("Restore set state");
    ge.copyGameObject(JSON.parse(setGameObject));
    gr.resetGame();
    gr.redraw();
    if(debug)ge.printGameObject(ge.gameObject);
});

//Event listener for copy set state.
const copySet = document.getElementById("copy-set");
copySet.addEventListener("click", () => 
{
    console.log("Copy set state");
    navigator.clipboard.writeText(setGameObject);
    console.log(setGameObject);
});

//Event listener for copy current state.
const copyCurrent = document.getElementById("copy-current");
copyCurrent.addEventListener("click", () => 
{
    console.log("Copy current state");
    let currentGameObject = ge.getGameObjectCopy();
    navigator.clipboard.writeText(currentGameObject);
    console.log(currentGameObject);
});

//Event listener for the reset button.
const resetFunction = () =>
{
    ge.resetGame(rows, columns, numTries);
    gameObjectCopy = ge.getGameObjectCopy();
    gr.resetGame();
    gr.redraw();
}
const reset = document.getElementById("reset");
reset.addEventListener("click", resetFunction);

const disableReset = () =>
{
    reset.style.opacity = 0.3;
    reset.removeEventListener("click", resetFunction);
    reset.classList.remove("reset-icon");
    reset.classList.add("reset-no-hov");
}

const enableReset = () =>
{
    reset.style.opacity = 1;
    reset.addEventListener("click", resetFunction);
    reset.classList.remove("reset-no-hov");
    reset.classList.add("reset-icon");
}

//Event listener that updates the game settings.
const settingsBtn = document.getElementById("settings-btn");
settingsBtn.addEventListener("click", () =>
{
    //Get values of all the text boxes.
    const setRows = parseInt(document.getElementById("sel-rows").value);
    const setColumns = parseInt(document.getElementById("sel-columns").value);
    const setTries = parseInt(document.getElementById("sel-tries").value);
    
    //User entered values are correct. Update game variables and recalculate everything.
    settingsModal.style.display = "none";
    rows = setRows;
    columns = setColumns;
    numTries = setTries;

    ge.resetGame(rows, columns, numTries);
    gameObjectCopy = ge.getGameObjectCopy();
    gr.resetGame();
    gr.redraw();
});

//Can be used for special formatting on different mobile platforms.
const getMobileOS = () =>
{
    const ua = navigator.userAgent
    if (/android/i.test(ua))
    {
      return "Android"
    }
    else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
    {
      return "iOS"
    }
    return "Other"
}

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
ge.animSwap2 = gr.animSwap2;
ge.gamePlay = gr.gamePlay;
ge.gameWon = gr.gameWon;
ge.gameLost = gr.gameLost;

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
gr.disableReset = disableReset;
gr.enableReset = enableReset;
gr.updateGameState = ge.updateGameState;
gr.resetFunction = resetFunction;
gr.loseSwap = ge.loseSwap;
gr.setGameLost = ge.setGameLost;

ge.resetGame(rows, columns, numTries);
gameObjectCopy = ge.getGameObjectCopy();
setGameObject = ge.getGameObjectCopy();
gr.resetGame();
gr.redraw();
if(debug)ge.printGameObject(ge.gameObject);
