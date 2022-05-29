"use strict";

//Print debug info.
let debug = true;

//Initial state of game parameters.
let rows = 10;
let columns = 20;
let numWords = 3;
let minLength = 6;
let numTries = 6;

//Main game object;
let gameObject;

//Array of letter columns.
let columnArray = new Array(0);

//Slider variables.
let isDown = false;
let startY;
let scrollOffset;
let scrollDiv;
let letterDiv;
let mouseX;
let mouseY;

//Column swap variables.
let singleClick = false;
let colIndex1 = undefined;
let colIndex2 = undefined;
let tempIndex;

//Animation variables.
let animActive = false;
let animIndexArray = new Array(0);
let animState = 0;
let animTimer;

//This can possibly be used for giving a heavier bias to words starting 
//with certain letters by putting those letters in this array multiple times.
const alphabet =
[
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
];

//Constant color indexes.
const BLACK   = 0;
const ORANGE  = 1;
const GREEN   = 2;
const BLUE    = 3;
const VIOLET  = 4;
const WHITE   = 5;
const DEFAULT = 6;

//Array of colors
const clrArr =
[
    "color:black",
    "color:orange",
    "color:green",
    "color:blue",
    "color:violet",
    "color:white",
    "color:default"
];

/************************************** Game Model Functions *************************************/

let getWordLengths = (columns, numWords, minLength) =>
{
    //Min/max columns: 12/20.
    if(columns > 20 || columns < 12)
    {
        return -1;
    }

    //Min/Max words: 1/5.
    if(numWords > 5 || numWords < 1)
    {
        return -1;
    }

    let remainingLetters = columns;      //Keep track of how many letters left to consume.
    let wordLengthsArray = new Array(0); //Empty array of word lengths.
    let wordLengthsRemaining = numWords; //Number of lengths calculated.

    //Loop to fill length array.
    while(wordLengthsRemaining > 0)
    {
        //On the last word, just assign the length as the remainer of the letters remaining.
        if(wordLengthsRemaining === 1)
        {
            wordLengthsArray.push(remainingLetters);
        }
        else
        {
            //Calculate the max letters in the current word.
            let maxLength = remainingLetters - (minLength - 1) * (wordLengthsRemaining - 1);
            let thisWordLength = Math.floor(Math.random() * (maxLength + 1 - minLength)) + minLength;
            remainingLetters -= thisWordLength - 1;
            wordLengthsArray.push(thisWordLength);
        }

        wordLengthsRemaining--;
    }

    let currentIndex = wordLengthsArray.length,  randomIndex;

    //While there remain elements to shuffle.
    while (currentIndex != 0)
    {
        //Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        //And swap it with the current element using destructuring.
        [wordLengthsArray[currentIndex], wordLengthsArray[randomIndex]] = [wordLengthsArray[randomIndex], wordLengthsArray[currentIndex]];
    }

    return wordLengthsArray;
}

let getWord = (wordLength, startingLetter) =>
{
    let word = -1;
    let tries = 0;
    let success = false;

    //Convert starting letter to array index.
    let arrayIndex = startingLetter.charCodeAt(0) - 65;

    //Get the number of words that start with the given letter.
    let numWords = wordArray[arrayIndex].length;

    //Attempt to find a word that starts with the given letter and has the given length.
    while(tries < 100 && !success)
    {
        let wordIndex = Math.floor(Math.random() * numWords);
        let potentialWord = wordArray[arrayIndex][wordIndex];
        if(potentialWord.length === wordLength)
        {
            success = true;
            word = potentialWord;
        }

        tries++;
    }
    return word;
}

//Gets a single row of words.
let getWordRow = (wordLengthsArray) =>
{
    let wordArray = new Array(0);

    for(let i = 0; i < wordLengthsArray.length; i++)
    {
        //Get first word.
        if(i === 0)
        {
            let index = Math.floor(Math.random() * alphabet.length);
            let chosenWord = getWord(wordLengthsArray[i], alphabet[index]);
            if(chosenWord === -1)
            {
                //Return if failed.
                return -1;
            }
            else
            {
                wordArray.push(chosenWord);
            }
        }
        else
        {
            //Get last letter in previous entry in the word array.
            let prevWord = wordArray[i-1];
            let lastWordLength = prevWord.length;
            let lastLetter = prevWord[lastWordLength - 1];
            let chosenWord = getWord(wordLengthsArray[i], lastLetter);
            if(chosenWord === -1)
            {
                //Return if failed.
                return -1;
            }
            else
            {
                wordArray.push(chosenWord);
            }
        }    
    }

    return wordArray;
}

//Generates a 2D matrix of words for the game.
let get2DWordArray = (rows, columns, numWords, minLength) =>
{
    let gameArray = new Array(rows);

    for(let i = 0; i < rows; i++)
    {
        let wordRow = -1;

        while(wordRow === -1)
        {
            wordRow = getWordRow(getWordLengths(columns, numWords, minLength))
        }

        gameArray[i] = wordRow;
    }
    
    return gameArray;
}

let get2DLetterArray = (rows, columns, numWords, minLength) =>
{
    //Get the 2D word array.
    let wordArray = get2DWordArray(rows, columns, numWords, minLength);

    //Create empty letter array.
    let letterArray = new Array(rows);

    for(let i = 0; i < rows; i++)
    {
        letterArray[i] = new Array(columns);
    }

    //Fill array with letters.
    for(let i = 0; i < rows; i++)
    {
        let thisColumn = 0;

        //Fill row.
        for(let j = 0; j < wordArray[i].length; j++)
        {
            let wordLength = (j === wordArray[i].length - 1) ? wordArray[i][j].length : wordArray[i][j].length - 1;

            for(let k = 0; k < wordLength; k++)
            {   
                letterArray[i][thisColumn] = wordArray[i][j][k];
                thisColumn++;
            }
        }  
    }

    return letterArray;
}

let getGameObject = (rows, columns, numWords, minLength, numTries) =>
{
    //Create an unshuffled letter array.
    let letterArray = get2DLetterArray(rows, columns, numWords, minLength);

    //Pick the row that is the solution to the puzzle.
    let rowNumber = Math.floor(Math.random() * rows);
    let winningRow = [...letterArray[rowNumber]];

    //Generate array of original column numbers.
    let columnArray = new Array(columns);
    for(let i = 0; i < columns; i++)
    {
        columnArray[i] = i;
    }

    //Shuffle rows.
    for(let i = 0; i < columns; i++)
    {
        for(let j = 0; j < rows * 5; j++)
        {
            let row1 = Math.floor(Math.random() * rows);
            let row2 = Math.floor(Math.random() * rows);

            [letterArray[row1][i], letterArray[row2][i]] = [letterArray[row2][i], letterArray[row1][i]];
        }
    }

    //Shuffle columns and original column numbers.
    for(let i = 0; i < columns * 5; i++)
    {
        let column1 = Math.floor(Math.random() * columns);
        let column2 = Math.floor(Math.random() * columns);

        [columnArray[column1], columnArray[column2]] = [columnArray[column2], columnArray[column1]];

        for(let j = 0 ; j < rows; j++)
        {
            [letterArray[j][column1], letterArray[j][column2]] = [letterArray[j][column2], letterArray[j][column1]];
        }
    }

    //Generate array of letter and column locks.
    let locksArray = new Array(0);

    for(let i = 0; i < columns; i++)
    {
        locksArray.push({letter: false, column: false});
    }

    //Generate array of letters remaining numbers.
    let remainArray = new Array(0);

    for(let i = 0; i < columns; i++)
    {
       remainArray.push(rows);
    }
    
    //Bundle everything inside an object and return it.
    return {
        rows:        rows,
        columns:     columns, 
        numWords:    numWords, 
        minLength:   minLength,
        numTries:    numTries,
        letterArray: letterArray,
        winningRow:  winningRow,
        columnArray: columnArray,
        locksArray:  locksArray,
        remainArray: remainArray
    }
}

/************************************* Game Control Functions ************************************/

const printGameObject = (go) =>
{
    console.log("------------------ Game Object ------------------");
    console.log("Rows: %s, Columns: %s, NumWords: %s,\nMinLength: %s, NumTries: %s", 
                go.rows, go.columns, go.numWords, go.minLength, go.numTries);
    
    console.log("Letter Array:");
    for(let i = 0; i < go.letterArray.length; i++)
    {
        console.log(...go.letterArray[i]);
    }
    
    console.log("Winning Row:");
    console.log(...go.winningRow);
    
    console.log("Column Order:");
    console.log(...go.columnArray);
    
    console.log("Letters Remaining In Each Column:");
    console.log(...go.remainArray);

    let colNum = new Array(0);
    for(let i = 0; i < go.columns; i++)
    {
        colNum.push(i + ":");
    }

    console.log("Letter Locks:");
    let letLocks = "";
    for(let i = 0; i < go.columns; i++)
    {
        letLocks += ("%s" + (go.locksArray[i].letter ? "T " : "F "));
    }
    console.log(letLocks, ...colNum);

    console.log("Column Locks:");
    let colLocks = "";
    for(let i = 0; i < go.columns; i++)
    {
        colLocks += ("%s" + (go.locksArray[i].column ? "T " : "F ")); 
    }
    console.log(colLocks, ...colNum);
}

const resetGame = () =>
{
    gameObject = getGameObject(rows, columns, numWords, minLength, numTries);
    if(debug)printGameObject(gameObject);
}

//Set the selections in the game settings modal.
const setSelections = (rows, columns, numWords, minLength, numTries) =>
{
    const minRows = 3;
    const minColumns = 12;
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
    singleClick = false;
}

const columnSwap = () =>
{
    //Save the temp index.
    if(colIndex1 === undefined)
    {
        colIndex1 = tempIndex;
    }
    else if(colIndex2 === undefined)
    {
        colIndex2 = tempIndex;
    }
    
    if(colIndex1 !== undefined && colIndex2 === undefined)
    {
        if(gameObject.locksArray[colIndex1].column)
        {
            //Locked. Indicate it can't move and cancel.
            animIndexArray.push(colIndex1);
            doShakeAnimations();
            colIndex1 = undefined;
            colIndex2 = undefined;
        }
        else
        {
            columnArray[colIndex1].style.transform = "scale(1.1, 1.05)";
            columnArray[colIndex1].style.transitionDuration = ".15s";
            columnArray[colIndex1].style.backgroundColor = "rgb(231, 165, 43)";
        }
    }
    else if(colIndex1 !== undefined && colIndex2 !== undefined)
    {
        if(gameObject.locksArray[colIndex2].column)
        {
            //Locked. Indicate it can't move and cancel.
            columnArray[colIndex1].style.backgroundColor = "rgba(0, 0, 0, 0)";
            columnArray[colIndex1].style.transform = "scale(1.0, 1.0)";
            columnArray[colIndex1].style.transitionDuration = ".15s";
            animIndexArray.push(colIndex1);
            animIndexArray.push(colIndex2);
            doShakeAnimations();
            colIndex1 = undefined;
            colIndex2 = undefined;
        }
        else if(colIndex1 === colIndex2)
        {
            //Cancel selection.
            columnArray[colIndex1].style.transform = "scale(1.0, 1.0)";
            columnArray[colIndex1].style.transitionDuration = ".15s";
            columnArray[colIndex1].style.backgroundColor = "rgba(0, 0, 0, 0)";
            colIndex1 = undefined;
            colIndex2 = undefined;
        }
        else
        {
            //Swap columns.
            animIndexArray.push(colIndex1);
            animIndexArray.push(colIndex2);
            doSwapAnimations();
            colIndex1 = undefined;
            colIndex2 = undefined;
        }
    }
}

/********************************** Game Presentation Functions **********************************/

const redraw = () =>
{
    columnArray.length = 0;

    //Get critical dimension info about the game body element.
    let gameBody = document.getElementById("game-body");
    let gameWidth = gameBody.clientWidth;
    let gameHeight = gameBody.clientHeight;
    
    //Update the number of tries remaining.
    let triesRemaining = document.getElementById("remain-span");
    triesRemaining.innerHTML = "Tries Remaining: " + numTries;

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
    gameBody.innerHTML = "";

    //Generate the column divs.
    for(let i = 0; i < columns; i++)
    {
        let thisDiv = document.createElement("div");
        columnArray.push(thisDiv);
        thisDiv.classList.add("column-div");
        thisDiv.innerHTML = i;
        thisDiv.style.fontSize = "2.5vw";
        thisDiv.setAttribute("index", i);
        gameBody.appendChild(thisDiv);

        if(gameObject.locksArray[i].column)
        {
            thisDiv.style.backgroundColor = "rgb(157, 188, 255)";
        }

        thisDiv.addEventListener("mousedown", start);
	    thisDiv.addEventListener("touchstart", start);

	    thisDiv.addEventListener("mousemove", move);
	    thisDiv.addEventListener("touchmove", move);

	    thisDiv.addEventListener("mouseleave", end);
	    thisDiv.addEventListener("mouseup", release);
	    thisDiv.addEventListener("touchend", end);
    }

    //Get the exact letter height. Need to subtract 2. Border, perhaps?
    let letterHeight = parseFloat(columnArray[0].getBoundingClientRect().height) - 2;

    //Calculate column height.
    for(let i = 0; i < columns; i++)
    {
        let thisColLetters = transLetterArray[i].length;
        let newHeight = thisColLetters * letterHeight;
        columnArray[i].style.height = newHeight + "px";
    }

    //Now go back in and fill the columns with the letters.
    for(let i = 0; i < columns; i++)
    {
        columnArray[i].innerHTML = "";

        //Push 3 copies into the array for scrolling.
        for(let j = 0; j < 3; j++)
        {
            for(let k = 0; k < transLetterArray[i].length; k++)
            {
                let thisDiv = document.createElement("div");
                columnArray[i].appendChild(thisDiv);
                thisDiv.classList.add("letter-div");
                thisDiv.innerHTML = transLetterArray[i][k];
                thisDiv.style.fontSize = "2.5vw";
            }
        }
    }

    //Calculate scroll offset.
    let scrollOffset = letterHeight * transLetterArray[0].length;
    for(let i = 0; i < columns; i++)
    {
        columnArray[i].scrollTop = scrollOffset;     
    }
}

//Swaps columns whose indexes are in the animation index array.
const doSwapAnimations = () =>
{
    switch(animState)
    {
        case 0:
            animActive = true;
            clearTimeout(animTimer);
            if(animIndexArray.length === 2)
            {
                let xpos0 = parseFloat(columnArray[animIndexArray[0]].getBoundingClientRect().x);
                let xpos1 = parseFloat(columnArray[animIndexArray[1]].getBoundingClientRect().x);
                let xdiff = xpos0 - xpos1;

                columnArray[animIndexArray[0]].style.backgroundColor = "rgba(0, 0, 0, 0)";
                columnArray[animIndexArray[0]].style.transform = "translate(" + (-xdiff) + "px)";
                columnArray[animIndexArray[0]].style.transitionDuration = ".25s";

                columnArray[animIndexArray[1]].style.backgroundColor = "rgba(0, 0, 0, 0)";
                columnArray[animIndexArray[1]].style.transform = "translate(" + xdiff + "px)";
                columnArray[animIndexArray[1]].style.transitionDuration = ".25s";
            }
            animTimer = setTimeout(doSwapAnimations, 250);
            animState++;
        break;

        default:
            //Swap columns in the letter array.
            for(let i = 0; i < gameObject.letterArray.length; i++)
            {
                [gameObject.letterArray[i][animIndexArray[0]], gameObject.letterArray[i][animIndexArray[1]]] = 
                [gameObject.letterArray[i][animIndexArray[1]], gameObject.letterArray[i][animIndexArray[0]]];
            }

            //Swap items in the column order.
            [gameObject.columnArray[animIndexArray[0]], gameObject.columnArray[animIndexArray[1]]] =
            [gameObject.columnArray[animIndexArray[1]], gameObject.columnArray[animIndexArray[0]]];

            //Swap items in the locks array.
            [gameObject.locksArray[animIndexArray[0]], gameObject.locksArray[animIndexArray[1]]] =
            [gameObject.locksArray[animIndexArray[1]], gameObject.locksArray[animIndexArray[0]]];

            if(debug)printGameObject(gameObject);
            redraw();
            animActive = false;
            clearTimeout(animTimer);
            animState = 0;
            animIndexArray.length = 0;
        break;
    }
}

//Shake columns whose indexes are in the animation index array.
const doShakeAnimations = () =>
{
    switch(animState)
    {
        case 0:
            animActive = true;
            clearTimeout(animTimer);
            for(let i = 0; i < animIndexArray.length; i++)
            {
                columnArray[animIndexArray[i]].style.transform = "translate(-1vh)";
                columnArray[animIndexArray[i]].style.transitionDuration = ".075s";
            }
            animTimer = setTimeout(doShakeAnimations, 75);
            animState++;
        break;
        
        case 1:
            for(let i = 0; i < animIndexArray.length; i++)
            {
                columnArray[animIndexArray[i]].style.transform = "translate(1vh)";
                columnArray[animIndexArray[i]].style.transitionDuration = ".1s";
            }
            animTimer = setTimeout(doShakeAnimations, 100);
            animState++;
        break;

        case 2:
            for(let i = 0; i < animIndexArray.length; i++)
            {
                columnArray[animIndexArray[i]].style.transform = "translate(0vh)";
                columnArray[animIndexArray[i]].style.transitionDuration = ".075s";
            }
            animTimer = setTimeout(doShakeAnimations, 75);
            animState++;
        break;

        default:
            animActive = false;
            clearTimeout(animTimer);
            animState = 0;
            animIndexArray.length = 0;
        break;
    }
}

/**************************************** Event Listeners ****************************************/

const end = (e) =>
{
    if(animActive) return;
    if(!isDown) return;

    let yTop = scrollDiv.getBoundingClientRect().y;
    let yBottom = scrollDiv.getBoundingClientRect().height + yTop;

    if(mouseY > yBottom || mouseY < yTop)
    {
        isDown = false;
        letterDiv.style.cursor = "pointer";
    }
}

const release = (e) =>
{
    if(animActive) return;
    isDown = false;
    letterDiv.style.cursor = "pointer";

    //Check if there was a quick click, indicating a column swap is desired.
    if(singleClick)columnSwap();
}

const start = (e) =>
{
    if(animActive) return;
    //Set a timer to check for a column swap(single fast click).
    setTimeout(checkColumnSwap, 150);
    singleClick = true; 
    
    isDown = true;
    scrollDiv = e.target.parentNode;
    letterDiv = e.target;
    letterDiv.style.cursor = "grab";
    startY = e.pageY || e.touches[0].pageY - scrollDiv.offsetTop;
    scrollOffset = scrollDiv.scrollTop;

    //Get the index of the clicked column for column swapping purposes.
    tempIndex = parseInt(scrollDiv.getAttribute("index"));
}

const move = (e) =>
{
    if(animActive) return;
    if(!isDown) return;

    e.preventDefault();
    
    const y = e.pageY || e.touches[0].pageY - scrollDiv.offsetTop;
    const dist = (y - startY);
    scrollDiv.scrollTop = scrollOffset - dist;
}

document.addEventListener("mousemove", (event) => 
{
    if(animActive) return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    if(!isDown && letterDiv)letterDiv.style.cursor = "pointer";
});

document.addEventListener("mouseup", (event) => 
{
    if(animActive) return;
    isDown = false;
});

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
    redraw();
});

//Resize window event listener.
const resize = window.addEventListener("resize", () =>
{
    redraw();
});

/******************************************* Game Code *******************************************/

resetGame();
gameObject.locksArray[5].column = true;
gameObject.locksArray[3].letter = true;
redraw();

