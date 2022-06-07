"use strict";

//Print debug info.
let debug = true;

//Initial state of game parameters.
let rows = 5;
let columns = 7;
let numWords = 1;
let minLength = 5;
let numTries = 4;
let usedLettersArray = new Array(0);

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
let didSwap = false;
let removedLetters = false;

//Letter height in web presentation.
let letterHeight = 0;

//Go button pressed indicator.
let isGo = false;

//This can possibly be used for giving a heavier bias to words starting 
//with certain letters by putting those letters in this array multiple times.
const alphabet =
[
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
];

/************************************** Game Model Functions *************************************/

let getWordLengths = (columns, numWords, minLength) =>
{
    //Min/max columns: 5/20.
    if(columns > 20 || columns < 5)
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

const evaluate = () =>
{
    animActive = true;
    document.getElementById("go-btn").removeEventListener("click", evaluate);
    evalColumnLocks();
}

//-------------------- Column Lock Evaluations --------------------
let columnOpacity = 0;
let colLocksAnimArray = new Array(0);

const evalColumnLocks = () =>
{
    columnOpacity = 0;
    colLocksAnimArray.length = 0;

    //Check for column locks.
    for(let i = 0; i < columns; i++)
    {
        if(gameObject.columnArray[i] === i)
        {
            //Only include new columns.
            if(!gameObject.locksArray[i].column)
            {
                gameObject.locksArray[i].column = true;
                colLocksAnimArray.push(columnArray[i]);
            }
        }
    }

    if(colLocksAnimArray.length > 0)
    {
        setTimeout(animColumnLocks, 20);
    }
    else
    {
        evalDoneColumn();
    }
}

const animColumnLocks = () =>
{
    for(let i = 0; i < colLocksAnimArray.length; i++)
    {
        colLocksAnimArray[i].style.backgroundColor = "rgb(157, 188, 255)";
        colLocksAnimArray[i].style.transitionDuration = ".3s";
    }

    setTimeout(evalDoneColumn, 300);
}

//-------------------- Completed Columns Evaluations --------------------
let doneColAnimArray = new Array(0);

const evalDoneColumn = () =>
{
    doneColAnimArray.length = 0;

    //Check for column AND letter locks.
    for(let i = 0; i < columns; i++)
    {
        //Check if column is locked and correct letter is on top.
        if(gameObject.locksArray[i].column && gameObject.letterArray[0][i] === gameObject.winningRow[i])
        {
            //Only include new letters.
            if(!gameObject.locksArray[i].letter)
            {
                gameObject.locksArray[i].letter = true;
                doneColAnimArray.push(i);
            }
        }
    }

    if(doneColAnimArray.length === 0)
    {
        evalRightLetWrongCol();
    }
    else
    {
        //Cycle through the solved columns and remove all the letters except for the top one.
        for(let i = 0; i < doneColAnimArray.length; i++)
        {
            //Set scroll offset to zero to make things easier.
            columnArray[doneColAnimArray[i]].scrollTop = 0;

            //Remove all letters except for the first one.
            for(let j = 1; j < columnArray[doneColAnimArray[i]].childNodes.length; j++)
            {
                columnArray[doneColAnimArray[i]].childNodes[j].style.transform = "scale(0, 0)";
                columnArray[doneColAnimArray[i]].childNodes[j].style.transitionDuration = ".5s";
            }
        }

        setTimeout(animDoneColumn, 500);
    }
}

const animDoneColumn = () =>
{
    //Transition background color to green.
    for(let i = 0; i < doneColAnimArray.length; i++)
    {
        columnArray[doneColAnimArray[i]].style.fontWeight = "bold";
        columnArray[doneColAnimArray[i]].style.backgroundColor = "rgb(169, 255, 158)";
        columnArray[doneColAnimArray[i]].style.transitionDuration = ".5s";
        columnArray[doneColAnimArray[i]].style.height = letterHeight + "px";
    }
   
    setTimeout(animDoneColumnFinish, 500);
}

const animDoneColumnFinish = () =>
{
    redraw();
    setTimeout(evalRightLetWrongCol, 500);
}

//-------------------- Right Letter Wrong Column Evaluations --------------------

const evalRightLetWrongCol = () =>
{
    //Get array of the right letters but wrong columns.
    let moveArray = new Array(0);

    for(let i = 0; i < columns; i++)
    {
        if(gameObject.letterArray[0][i] === gameObject.winningRow[i] && !gameObject.locksArray[i].column)
        {
            let fromColumn;
            //Find the destination column
            for(let j = 0; j < gameObject.columnArray.length; j++)
            {
                if(gameObject.columnArray[j] === i)
                {
                    fromColumn = j;
                }
            }

            let moveObj = {from: fromColumn, to: i};
            moveArray.push([moveObj]);
        }
    }

    if(moveArray.length === 0)
    {
        //No move chains were found, move to next step.
        didSwap = false;
        evalUsedLetters();
    }
    else
    {
        //Move chains found. Process those chains.
        didSwap = true;
        let isModified = false;
        do
        {
            isModified = false;
            for(let i = 0; i < moveArray.length; i++)                //First dimension
            {
                for(let j = 0; j < moveArray.length; j++)            //First dimension
                {
                    for(let k = 0; k < moveArray[i].length; k++)     //Second dimension
                    {
                        for(let l = 0; l < moveArray[j].length; l++) //Second dimension
                        {
                            if(i !== j && (moveArray[i][k].from === moveArray[j][l].to || moveArray[i][k].to === moveArray[j][l].from))
                            {
                                let theseMoves = moveArray.splice(j, 1);                                
                                moveArray[i] = [...moveArray[i], ...theseMoves[0]];
                                isModified = true;
                            }
                            if(isModified) break;
                        }
                        if(isModified) break;
                    }     
                    if(isModified) break;
                }
                if(isModified) break;
            }
        }while(isModified);

        if(debug)console.log("Word Chains:");
        if(debug)console.log(moveArray);

        //Move chains are now complete. Need to determine which are closed chains and which are open chains.
        let closeArray = new Array(0);

        //Loop through letter chains to find open chains. If open chain, close it with one additional move.
        for(let i = 0; i < moveArray.length; i++)
        {
            let to, from;
            let isOpenChain = false;
            
            for(let j = 0; j < moveArray[i].length; j++)
            {
                let isFound = false;
                
                for(let k = 0; k < moveArray[i].length; k++)
                {
                    if(moveArray[i][j].to === moveArray[i][k].from)
                    {
                        isFound = true;
                    }
                }

                if(!isFound)
                {
                    from = moveArray[i][j].to;
                    isOpenChain = true;
                }
            }

            for(let j = 0; j < moveArray[i].length; j++)
            {
                let isFound = false;
                
                for(let k = 0; k < moveArray[i].length; k++)
                {
                    if(moveArray[i][j].from === moveArray[i][k].to)
                    {
                        isFound = true;
                    }
                }

                if(!isFound)
                {
                    to = moveArray[i][j].from;
                }
            }

            if(isOpenChain)
            {
                closeArray.push({from: from, to: to});
            }
        }

        if(debug)console.log("Close Array:");
        if(debug)console.log(closeArray);

        //Flatten out the arrays and put them into a single array for ease of processing.
        let moveChainArray = new Array(0);

        for(let i = 0; i < moveArray.length; i++)
        {
            for(let j = 0; j < moveArray[i].length; j++)
            {
                moveChainArray.push({from: moveArray[i][j].from, to: moveArray[i][j].to, rotate: true});
            }
        }

        for(let i = 0; i < closeArray.length; i++)
        {
            moveChainArray.push({from: closeArray[i].from, to: closeArray[i].to, rotate: false});
        }

        if(debug)console.log("Move Chain Array:");
        if(debug)console.log(moveChainArray);

        //Swap columns.
        for(let i = 0; i < moveChainArray.length; i++)
        {
            let startPos = columnArray[moveChainArray[i].from].getBoundingClientRect().x;
            let endPos = columnArray[moveChainArray[i].to].getBoundingClientRect().x;
            let xDiff = endPos - startPos;
            columnArray[moveChainArray[i].from].style.transform = "translate(" + xDiff + "px)";
            columnArray[moveChainArray[i].from].style.transitionDuration = ".5s";
        }

        //Set smooth scrolling for all columns.
        for(let i = 0; i < columnArray.length; i++)
        {
            columnArray[i].classList.add("smooth-scroll");
        }

        //Make an array of indexes to change to for rotation changes later.
        let indexesArray = new Array(gameObject.columns);
        for(let i = 0; i < indexesArray.length; i++)
        {
            indexesArray[i] = -1;
        }

        //Need to rotate letters to the proper position in the column.
        for(let i = 0; i < moveChainArray.length; i++)
        {
            if(moveChainArray[i].rotate)
            {
                let index;
                let letterToChangeTo = gameObject.winningRow[moveChainArray[i].to];
                
                //Find the index of the letter to rotate to.
                for(let j = 0; j < gameObject.letterArray.length; j++)
                {
                    if(gameObject.letterArray[j][moveChainArray[i].from] === letterToChangeTo)
                    {
                        index = j;
                        indexesArray[moveChainArray[i].from] = index;
                    }

                    columnArray[moveChainArray[i].from].scrollTop += letterHeight * index;
                }
            }
        }

        //Create a new version of the letter array and copy in all the changes.
        let letterArray = new Array(gameObject.rows);
        for(let i = 0; i < letterArray.length; i++)
        {
            letterArray[i] = [...gameObject.letterArray[i]];
        }
        
        //Create a new version of the indexes array.
        let indArray = [...indexesArray];

        //create new version of the columns array.
        let colArray = [...gameObject.columnArray];

        //Create new version of the locks array.
        let lckArray = [...gameObject.locksArray];

        //Create a new version of the remaining letters array.
        let remArray = [gameObject.remainArray];
        
        //Rearrange the order of all the newly formed arrays.
        for(let i = 0; i < moveChainArray.length; i++)
        {
            for(let j = 0; j < gameObject.letterArray.length; j++)
            {
                letterArray[j][moveChainArray[i].to] = gameObject.letterArray[j][moveChainArray[i].from];
            }

            indArray[moveChainArray[i].to] = indexesArray[moveChainArray[i].from];
            colArray[moveChainArray[i].to] = gameObject.columnArray[moveChainArray[i].from];
            lckArray[moveChainArray[i].to] = gameObject.locksArray[moveChainArray[i].from];
            remArray[moveChainArray[i].to] = gameObject.remainArray[moveChainArray[i].from];
        }

        //Now all the columns in the letter array need to be rotated to the proper indexes.
        for(let i = 0; i < gameObject.columns; i++)
        {
            if(indArray[i] !== -1)
            {
                let rotatedArray = new Array(0);
                for(let j = indArray[i]; j < remArray[i]; j++)
                {
                    rotatedArray.push(letterArray[j][i]);
                }
                for(let j = 0; j < indArray[i]; j++)
                {
                    rotatedArray.push(letterArray[j][i]);
                }

                //Copy rotated array back into the letter array.
                for(let j = 0; j < rotatedArray.length; j++)
                {
                    letterArray[j][i] = rotatedArray[j];
                }
            }
        }

        //Update the game object!
        for(let i = 0; i < gameObject.letterArray.length; i++)
        {
            gameObject.letterArray[i] = [...letterArray[i]];
        }

        gameObject.columnArray = [...colArray];
        gameObject.locksArray = [...lckArray];
        gameObject.remainArray = [...remArray];
        
        setTimeout(animRightLetWrongCol, 600);
    } 
}

const animRightLetWrongCol = () =>
{
    //Set smooth scrolling for all columns.
    for(let i = 0; i < columnArray.length; i++)
    {
        columnArray[i].classList.remove("smooth-scroll");
    }

    redraw();
    if(didSwap)
    {
        evaluate();
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
    for(let i = 0; i < gameObject.columns; i++)
    {
        //Skip solved columns.
        if(!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter)
        {
            let thisLetter = gameObject.letterArray[0][i];

            //Loop through winning row and locks array to see if this a used letter not yet solved for.
            for(let j = 0; j < gameObject.columns; j++)
            {
                //If letter appears in the winning row in an unlocked column, add it to the used letters array.
                if((thisLetter === gameObject.winningRow[j]) && (!gameObject.locksArray[j].column || !gameObject.locksArray[j].letter))
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
        //Cycle through all the letters on the screen and add an orange background to the used letters.
        {
            for(let i = 0; i < columnArray.length; i++)
            {
                for(let j = 0; j < columnArray[i].childNodes.length; j++)
                {
                    let thisLetter = columnArray[i].childNodes[j].innerHTML;
                    if(usedLettersArray.includes(thisLetter) && (!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter))
                    {
                        columnArray[i].childNodes[j].style.fontWeight = "bold";
                        columnArray[i].childNodes[j].style.transitionDuration = ".5s";
                    }
                }
            }
        }

        setTimeout(animUsedLetters, 500);
    }
    else
    {
        evalUnusedLetters();
    }
}

const animUsedLetters = () =>
{
    redraw();
    evalUnusedLetters();
}

//-------------------- Unused Letter Evaluations --------------------

const evalUnusedLetters = () =>
{
    removedLetters = false;
    let unusedLettersArray = new Array(0);

    //Create an ibject that holds all the instances of letters used in the solution.
    let alphabetObj =
    {
        A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0,
        N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0
    }

    //Keep track of what letters and how many are used in the solution.
    for(let i = 0; i < gameObject.winningRow.length; i++)
    {
        alphabetObj[gameObject.winningRow[i]]++;
    }

    //Now subtract the solved letters from the alphabet object.
    for(let i = 0; i < gameObject.letterArray[0].length; i++)
    {
        if(gameObject.locksArray[i].column && gameObject.locksArray[i].letter)
        {
            alphabetObj[gameObject.letterArray[0][i]]--;
        }
    }

    //Now we can calculate an array of unused letters.
    for(let i = 0; i < gameObject.letterArray[0].length; i++)
    {
        if(alphabetObj[gameObject.letterArray[0][i]] === 0 && (!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter))
        {
            let thisLetter = gameObject.letterArray[0][i];
            if(!unusedLettersArray.includes(thisLetter))
            {
                unusedLettersArray.push(thisLetter);
            }
        }
    }

    if(unusedLettersArray.length !== 0)
    {
        if(debug)console.log("Unused Letters:");
        if(debug)console.log(unusedLettersArray);

        //Shrink unused letters away.
        for(let i = 0; i < gameObject.columns; i++)
        {
            //Only work on columns that have not already been solved
            if(!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter)
            {
                //Reset scroll for animation effects.
                columnArray[i].scrollTop = 0;

                for(let j = 0; j < columnArray[i].childNodes.length; j++)
                {
                    let thisLetter = columnArray[i].childNodes[j].innerHTML;
                    if(unusedLettersArray.includes(thisLetter))
                    {
                        columnArray[i].childNodes[j].style.transform = "scale(0, 0)";
                        columnArray[i].childNodes[j].style.transitionDuration = ".5s";
                    }
                }
            }
        }

        //Remove letters from the game object.
        for(let i = 0; i < gameObject.letterArray.length; i++)
        {
            for(let j = 0; j < gameObject.letterArray[i].length; j++)
            {
                if(unusedLettersArray.includes(gameObject.letterArray[i][j]))
                {
                    gameObject.letterArray[i][j] = " ";
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
    for(let i = 0; i < gameObject.columns; i++)
    {
        let missingLetters = 0;

        //Go through only the first repitition of letters.
        for(let j = 0; j < gameObject.remainArray[i]; j++)
        {
            let thisLetter
            try
            {
                thisLetter = columnArray[i].childNodes[j].innerHTML;
            }
            catch(error)
            {
                console.log("ERROR");
                console.log("i: %s, j: %s, gameObject.remainArray[i]: %s, childNodes length: %s", 
                             i, j, gameObject.remainArray[i], columnArray[i].childNodes.length)
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
                    let dy = -missingLetters * letterHeight;
                    columnArray[i].childNodes[j].style.transitionDuration = ".5s";
                    columnArray[i].childNodes[j].style.transform = "translateY(" + dy + "px)";
                }
            }
        }

        //Resize column, if necessary.
        if(missingLetters)
        {
            columnArray[i].style.transitionDuration = ".5s";
            columnArray[i].style.height = ((gameObject.remainArray[i] - missingLetters) * letterHeight) + "px";
            removedLetters = true;
        }
    }

    setTimeout(animUnusedLettersFinish, 500);
}

const animUnusedLettersFinish = () =>
{
    redraw();
    setTimeout(evalFinished, 500);
}

//-------------------- Finished Evaluations --------------------
const evalFinished = () =>
{   
    redraw();
    animActive = false;
    document.getElementById("go-btn").addEventListener("click", evaluate);
}

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
        //Accounts for a corner case where the border is clicked.
        if(isNaN(colIndex1))
        {
            colIndex1 = undefined;
            colIndex2 = undefined;
            return;
        }

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
            columnArray[colIndex1].style.backgroundColor = "rgb(230, 230, 230)";
        }
    }
    else if(colIndex1 !== undefined && colIndex2 !== undefined)
    {
        //Accounts for a corner case where the border is clicked.
        if(isNaN(colIndex2))
        {
            colIndex1 = undefined;
            colIndex2 = undefined;
            return;
        }

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

//Take all the blanks out of the columns and put them at the bottom.
const updateColumns = () =>
{
    for(let i = 0; i < columns; i++)
    {
        let letterCount = 0;
        let tempArray = new Array(0);

        //Take all the valid letters out of the current column and push them into the temp array.
        for(let j = 0; j < rows; j++)
        {
            if(gameObject.letterArray[j][i] !== " ")
            {
                tempArray.push(gameObject.letterArray[j][i]);
                letterCount++;
            }
        }

        //Replace the letters in the letter array with the consolidated version.
        for(let j = 0; j < rows; j++)
        {
            gameObject.letterArray[j][i] = " ";
        }

        for(let j = 0; j < tempArray.length; j++)
        {
            gameObject.letterArray[j][i] = tempArray[j];
        }

        //Update the letters remaining array.
        gameObject.remainArray[i] = letterCount;

        //Update the letter lock indicator, if necessary.
        if(letterCount === 1)
        {
            gameObject.locksArray[i].letter = true;
        }
    }
}

//This will allow for easier testing and verify things stay valid.
const checkLetterLock = () =>
{
    for(let i = 0; i < columns; i++)
    {
        if(gameObject.locksArray[i].letter)
        {
            //Get the correct final letter for the current column.
            let finalLetter = gameObject.winningRow[gameObject.columnArray[i]];

            for(let j = 0; j < rows; j++)
            {
                gameObject.letterArray[j][i] = (j === 0) ? finalLetter : " ";
            }
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

    if(animActive) return;
    if(singleClick) return;

    for(let i = 0; i < columns; i++)
    {
        //Get number of letters remaining in current column.
        let lettersRemaining = gameObject.remainArray[i];

        //Get the scroll offset for current column.
        let thisScrollOffset = columnArray[i].scrollTop;

        //Caclulate the scroll offset for the first character.
        let zeroScroll = Math.floor(letterHeight * lettersRemaining);

        //Calculate how many letters away from zero scroll.
        let lettersOffset = Math.round((thisScrollOffset - zeroScroll) / letterHeight) % lettersRemaining;
    
        //Get the remaining letters from the current column.
        let tempArray = new Array(0);
        let reformedArray = new Array(0);
        for(let j = 0; j < rows; j++)
        {
            if(gameObject.letterArray[j][i] !== " ")
            {
                tempArray.push(gameObject.letterArray[j][i]);
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
                gameObject.letterArray[j][i] = reformedArray[j];
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
                gameObject.letterArray[j][i] = reformedArray[j];
            }
        }
    }

    //Show the results.
    if(debug)printGameObject(gameObject);
    redraw();
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

    //Consolidate columns.
    updateColumns();

    //Check for letter lock only.
    checkLetterLock();

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
        //Else draw whole column.
        let thisDiv = document.createElement("div");
        columnArray.push(thisDiv);
        thisDiv.classList.add("column-div");
        thisDiv.innerHTML = i;
        thisDiv.style.fontSize = "2.5vw";
        thisDiv.setAttribute("index", i);
        gameBody.appendChild(thisDiv);

        thisDiv.addEventListener("mousedown", start);
	    thisDiv.addEventListener("touchstart", start);

        if(!gameObject.locksArray[i].letter)
        {
            thisDiv.addEventListener("mousemove", move);
            thisDiv.addEventListener("touchmove", move);
            thisDiv.addEventListener("mouseleave", end);
        }
	    
	    thisDiv.addEventListener("mouseup", release);
	    thisDiv.addEventListener("touchend", end);

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
            gameObject.remainArray[i] = 1;
        }
    }

    //Get the exact letter height. Need to subtract 2. Border, perhaps?
    letterHeight = parseFloat(columnArray[0].getBoundingClientRect().height) - 2;

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

        //Only put one copy of letter in box if it is letter locked.
        let repeats = (gameObject.locksArray[i].letter) ? 1 : 3;

        //Push 3 copies into the array for scrolling.
        for(let j = 0; j < repeats; j++)
        {
            for(let k = 0; k < transLetterArray[i].length; k++)
            {
                let thisDiv = document.createElement("div");
                columnArray[i].appendChild(thisDiv);
                thisDiv.classList.add("letter-div");
                thisDiv.innerHTML = transLetterArray[i][k];
                thisDiv.style.fontSize = "2.5vw";
                thisDiv.style.height = letterHeight + "px"; //Explicitly assign letter div height for transition effect.
            }
        }
    }

    //Explicitly set the horizontal position of the columns for transition effects.
    for(let i = 0; i < columns; i++)
    {
        columnArray[i].style.left = columnArray[i].getBoundingClientRect().x;
    }

    //Calculate scroll offset.
    for(let i = 0; i < columns; i++)
    {
        let scrollOffset = letterHeight * gameObject.remainArray[i];
        columnArray[i].scrollTop = scrollOffset;     
    }

    //Cycle through all the letters on the screen and add an orange background to the used letters.
    {
        for(let i = 0; i < columnArray.length; i++)
        {
            for(let j = 0; j < columnArray[i].childNodes.length; j++)
            {
                let thisLetter = columnArray[i].childNodes[j].innerHTML;
                if(usedLettersArray.includes(thisLetter) && (!gameObject.locksArray[i].column || !gameObject.locksArray[i].letter))
                {
                    columnArray[i].childNodes[j].style.fontWeight = "bold";
                    columnArray[i].childNodes[j].style.transitionDuration = "0s";
                }
            }
        }
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
                columnArray[animIndexArray[0]].style.transitionDuration = ".5s";

                columnArray[animIndexArray[1]].style.backgroundColor = "rgba(0, 0, 0, 0)";
                columnArray[animIndexArray[1]].style.transform = "translate(" + xdiff + "px)";
                columnArray[animIndexArray[1]].style.transitionDuration = ".5s";
            }
            animTimer = setTimeout(doSwapAnimations, 500);
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

            //Swap items in letters remaining array.
            [gameObject.remainArray[animIndexArray[0]], gameObject.remainArray[animIndexArray[1]]] =
            [gameObject.remainArray[animIndexArray[1]], gameObject.remainArray[animIndexArray[0]]];

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
    if(singleClick)
    {
        columnSwap();
    }
    //Cancel any column swap if second click was a long click.
    else 
    {
        colIndex1 = undefined;
        colIndex2 = undefined;
    }
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
    //Exit if in middle of column swap.
    if(colIndex1 !== undefined) return;

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

//Check for column updates whenever the mouse button is released.
window.addEventListener("mouseup", updateColumnDrag);

//Event listeners for the "Go" button.
document.getElementById("go-btn").addEventListener("mousedown", () =>
{
    isGo = true;
    colIndex1 = undefined;
    colIndex2 = undefined;
});

document.getElementById("go-btn").addEventListener("touchstart", () =>
{
    isGo = true;
});

document.getElementById("go-btn").addEventListener("click", evaluate);

/******************************************* Game Code *******************************************/

resetGame();
redraw();
if(debug)printGameObject(gameObject);


