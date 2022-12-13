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
    const editorModal = document.getElementById("editor-modal");

    let editge = new GameEngine1();

    //Column locks stuff.
    let locksArray = new Array();
    let columnLocksDiv = document.createElement("div");

    editge.copyGameObject(JSON.parse(ge.getGameObjectCopy()));

    let editDiv = document.getElementById("edit-div");
    editDiv.innerHTML = "";

    let matrixDiv = document.createElement("div");

    //Put solution in the editing modal.
    let solutionDiv = document.createElement("div");
    let solutionText = document.createElement("textarea");
    solutionText.classList.add("letter-span");
    solutionText.setAttribute("maxlength", editge.gameObject.columns);
    solutionText.style.backgroundColor = "rgb(222,255,222)";
    solutionText.style.resize = "none";
    solutionText.value = editge.gameObject.winningRow.join("");
    let solutionButton = document.createElement("button");
    solutionButton.innerHTML = "Set";
    solutionDiv.appendChild(solutionText);
    solutionDiv.appendChild(solutionButton);
    editDiv.appendChild(solutionDiv);

    solutionText.addEventListener("keyup", () =>
    {
        solutionText.value = solutionText.value.toLocaleUpperCase();

        //Must be maximum length.
        if(solutionText.value.length != editge.gameObject.columns)
        {
            solutionText.style.backgroundColor = "rgb(255,222,222)";
            solutionButton.disabled = true;
            return;
        }

        //Must all be valid characters.
        for(let i = 0; i < solutionText.value.length; i++)
        {
            if(!validateChar(solutionText.value[i]))
            {
                solutionText.style.backgroundColor = "rgb(255,222,222)";
                solutionButton.disabled = true;
                return;
            }
        }

        solutionText.style.backgroundColor = "rgb(222,255,222)";
        solutionButton.disabled = false;
        return;
    });

    //Put letter matrix on the editing modal.
    let textLettersArray = new Array(editge.gameObject.rows);
    addMatrix(textLettersArray, editge, matrixDiv);
    editDiv.appendChild(matrixDiv);

    solutionButton.addEventListener("click", () =>
    {
        //Update the solution letters in the letter matrix.
        for(let i = 0; i < editge.gameObject.columns; i++)
        {
            for(let j = 0; j < editge.gameObject.rows; j++)
            {
                if(textLettersArray[j][i].value === editge.gameObject.winningRow[editge.gameObject.columnArray[i]])
                {
                    textLettersArray[j][i].value = solutionText.value[editge.gameObject.columnArray[i]];
                    break;
                }
            }
        }

        //Update the puzzle with the nex value.
        updateLetters(editge.gameObject, textLettersArray);
        for(let i = 0; i < editge.gameObject.columns; i++)
        {
            editge.gameObject.winningRow[i] = solutionText.value[i];
        }
    });

    //Put up and down buttons on the editing modal.
    let upDiv = document.createElement("div");
    let rollTextUp = document.createElement("span");
    rollTextUp.innerHTML = "Roll Columns Up";
    for(let i = 0; i < editge.gameObject.columns; i++)
    {
        let upButton = document.createElement("button");
        upButton.classList.add("column-button");
        upButton.innerHTML = "Up";
        upDiv.appendChild(upButton);

        upButton.addEventListener("click", () =>
        {
            editge.scrollColumn(i, 1);
            addMatrix(textLettersArray, editge, matrixDiv);
        });
    }
    upDiv.appendChild(rollTextUp);

    let downDiv = document.createElement("div");
    let rollTextDown = document.createElement("span");
    rollTextDown.innerHTML = "Roll Columns Down";
    for(let i = 0; i < editge.gameObject.columns; i++)
    {
        let downButton = document.createElement("button");
        downButton.classList.add("column-button");
        downButton.innerHTML = "Dn";
        downDiv.appendChild(downButton);

        downButton.addEventListener("click", () =>
        {
            editge.scrollColumn(i, -1);
            addMatrix(textLettersArray, editge, matrixDiv);
        });
    }

    downDiv.appendChild(rollTextDown);
    editDiv.appendChild(upDiv);
    editDiv.appendChild(downDiv);

    //Add swap check boxes to the editing modal.
    let swapArray = new Array();
    let swapDiv = document.createElement("div");
    let swapText = document.createElement("span");
    swapText.innerHTML = "Swap Columns";
    for(let i = 0; i < editge.gameObject.columns; i++)
    {
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.classList.add("column-button");
        swapArray.push(checkbox);
        swapDiv.appendChild(checkbox);
        swapDiv.appendChild(swapText);

        checkbox.addEventListener("click", () =>
        {
            let firstChecked = -1;
            for(let j = 0; j < swapArray.length; j++)
            {
                if(swapArray[j].checked && firstChecked < 0)
                {
                    firstChecked = j;
                }
                else if(swapArray[j].checked)
                {
                    editge.gameObject.gameState = GameEngine1.STATE_PLAY;
                    editge.gameObject.locksArray[firstChecked].letter = false;
                    editge.gameObject.locksArray[firstChecked].column = false;
                    editge.gameObject.locksArray[j].letter = false;
                    editge.gameObject.locksArray[j].column = false;
                    editge.evalSwap([firstChecked, j], false);
                    addMatrix(textLettersArray, editge, matrixDiv);
                    addColumnLocks(editge, columnLocksDiv, locksArray);

                    for(let k = 0; k < swapArray.length; k++)
                    {
                        swapArray[k].checked = false;
                    }
                }  
            }
        });
    }

    editDiv.appendChild(swapDiv);

    //Add column lock checkboxes to the editing modal.
    editDiv.appendChild(columnLocksDiv);
    addColumnLocks(editge, columnLocksDiv, locksArray);
    
    //Add tries drop down text box to the editing modal.
    let triesDiv = document.createElement("div");
    let triesBox = document.createElement("select");
    let triesText = document.createElement("span");
    triesText.innerHTML = "Tries Remaining";

    for(let i = 0; i < 21; i++)
    {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        triesBox.appendChild(option);
    }

    triesBox.options[editge.gameObject.numTries].selected = true;
    triesDiv.appendChild(triesBox);
    triesDiv.appendChild(triesText);
    editDiv.appendChild(triesDiv);

    //Add puzzle info to the editing modal.
    let infoDiv = document.createElement("div");
    let infoBox = document.createElement("textarea");
    let infoText = document.createElement("span");
    infoText.innerHTML = "Puzzle Info";

    infoDiv.appendChild(infoBox);
    infoDiv.appendChild(infoText);
    editDiv.appendChild(infoDiv);

    //Put save and cancel buttons on the editing modal.
    let saveCancelDiv = document.createElement("div");
    let save = document.createElement("button");
    let cancel = document.createElement("button");
    save.innerHTML = "Apply";
    cancel.innerHTML = "Cancel";

    save.addEventListener("click", () =>
    {
        for(let i = 0; i < editge.gameObject.columns; i++)
        {
            //Unlock any letter locks that don't belong.
            if(editge.gameObject.remainArray[i] > 1)
            {
                editge.gameObject.locksArray[editge.gameObject.columnArray[i]].letter = false;
                editge.gameObject.solvedArray[editge.gameObject.columnArray[i]] = false;
            }

            //Unlock any false locked letters.
            if(!editge.gameObject.locksArray[i].letter || !editge.gameObject.locksArray[i].column)
            {
                editge.gameObject.solvedArray[i] = false;
            }

            //Set solved letters.
            if(editge.gameObject.locksArray[i].letter && editge.gameObject.locksArray[i].column)
            {
                editge.gameObject.solvedArray[i] = true;
            }

            //Special case to lock letters that have column locks and only one letter.
            if(editge.gameObject.remainArray[i] === 1 && editge.gameObject.locksArray[i].column)
            {
                editge.gameObject.locksArray[editge.gameObject.columnArray[i]].letter = true;
                editge.gameObject.solvedArray[i] = true;
            }
        }

        editge.gameObject.usedLettersArray = [];
        editge.gameObject.score = 0;
        editge.gameObject.numTries = (triesBox.selectedIndex < 1) ? 1 : triesBox.selectedIndex;
        editge.gameObject.info = infoBox.value;

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

const addColumnLocks = (ge, div, locksArray) =>
{
    div.innerHTML = "";
    let columnText = document.createElement("span");
    columnText.innerHTML = "Lock Column";
    for(let i = 0; i < ge.gameObject.columns; i++)
    {
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.classList.add("column-button");
        locksArray.push(checkbox);
        div.appendChild(checkbox);

        //See if column locking is valid for this column.
        if(i === ge.gameObject.columnArray[i])
        {
            checkbox.disabled = false;
        }
        else
        {
            checkbox.disabled = true;
            checkbox.checked = false;
        }

        //See if this column is already locked.
        if(ge.gameObject.locksArray[ge.gameObject.columnArray[i]].column)
        {
            checkbox.checked = true;
        }
        else
        {
            checkbox.checked = false;
        }

        //Lock/unlock column when checked.
        checkbox.addEventListener("click", () =>
        {
            if(checkbox.checked)
            {
                ge.gameObject.locksArray[ge.gameObject.columnArray[i]].column = true;
            }
            else
            {
                ge.gameObject.locksArray[ge.gameObject.columnArray[i]].column = false;
            }
        });
    }





    div.appendChild(columnText);
}










//Add letter matrix to the editing modal.
const addMatrix = (textLettersArray, editge, matrixDiv) =>
{
    matrixDiv.innerHTML = "";

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

        matrixDiv.appendChild(thisSpan);
        matrixDiv.appendChild(document.createElement("br"));
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
                    let validChar = validateChar(textLettersArray[j][i].value.toUpperCase(), true);

                    textLettersArray[j][i].value = validChar ? textLettersArray[j][i].value.toUpperCase() : "";
                    updateLetters(editge.gameObject, textLettersArray);
                    editge.updateColumns();
                    
                });
            }
        }
    }

    //Put column numbers in editing modal.
    let orderDiv = document.createElement("div");
    let orderDivText = document.createElement("span");
    orderDivText.innerHTML = "Column order";
    for(let i = 0; i < editge.gameObject.columns; i++)
    {
        let thisSpan = document.createElement("span");
        thisSpan.classList.add("letter-span");
        let thisText = document.createElement("textarea");
        thisText.style.backgroundColor = "rgb(200,200,200)";
        thisText.readOnly = true;
        thisText.classList.add("game-letter");
        thisText.value = editge.gameObject.columnArray[i];
        thisSpan.appendChild(thisText);
        orderDiv.appendChild(thisSpan);
    }
    orderDiv.appendChild(orderDivText);
    matrixDiv.appendChild(orderDiv);
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

//Check if a character is valid.
const validateChar = (char, allowSpace = false) =>
{
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";
    if(char === " " && allowSpace)return true;
    if(char === " " && !allowSpace)return false;
    if(validChars.includes(char))return true;
    return false;
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
const infoModal = document.getElementById("info-modal");
let closeBtn = document.getElementsByClassName("close");

closeBtn[0].addEventListener("click", () =>
{
    settingsModal.style.display = "none";
    editorModal.style.display = "none";
    infoModal.style.display = "none";
});

closeBtn[1].addEventListener("click", () =>
{
    settingsModal.style.display = "none";
    editorModal.style.display = "none";
    infoModal.style.display = "none";
});

closeBtn[2].addEventListener("click", () =>
{
    settingsModal.style.display = "none";
    editorModal.style.display = "none";
    infoModal.style.display = "none";
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

//Event listener that brings up the info modal.
const info = document.getElementById("info");
info.addEventListener("click", () =>
{
    let modal = document.getElementById("info-modal");
    modal.style.display = "block";
    let infoDiv = document.getElementById("info-div");
    let noInfoString = "<p>No special puzzle information</p>"
    infoDiv.innerHTML = (ge.gameObject.hasOwnProperty("info") && ge.gameObject.info !== null) ? ge.gameObject.info : infoDiv.innerHTML = noInfoString;
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
