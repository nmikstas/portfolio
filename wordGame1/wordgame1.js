//Print debug info.
let debug = true;

//Initial state of game parameters.
let rows = 10;
let columns = 20;
let numWords = 3;
let minLength = 6;
let numTries = 6;

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
        wordIndex = Math.floor(Math.random() * numWords);
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



/********************************** Game Presentation Functions **********************************/



/************************************* Game Control Functions ************************************/

let printGameObject = (go) =>
{
    console.log("------------------ Game Object ------------------");
    console.log("Rows: %s, Columns: %s, NumWords: %s,\nMinLength: %s, NumTries: %s", go.rows, go.columns, go.numWords, go.minLength, go.numTries);
    
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
    let modal = document.getElementById("settings-modal");
    modal.style.display = "block";
});

//Event listener that brings up the help modal.
const help = document.getElementById("help");
help.addEventListener("click", () =>
{
    let modal = document.getElementById("help-modal");
    modal.style.display = "block";
});


/******************************************* Game Code *******************************************/



let gameObject = getGameObject(rows, columns, numWords, minLength, numTries);

if(debug)printGameObject(gameObject);