"use strict";

//NOTE: wordArray.js Must be included before this code in order to generate random words!

class GameGenerator1
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    static get INVALID() {return -1}
    static get FAILED() {return -2}
    static get MAX_LETTERS() {return 20}
    static get MIN_LETTERS() {return 5}
    static get MAX_ROWS() {return 10}
    static get MIN_ROWS() {return 3}
    static get MAX_WORDS() {return 5}
    static get MIN_WORDS() {return 1}
    static get MAX_LENGTH() {return 20}
    static get MIN_LENGTH() {return 2}
   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        {
            rows = 7,
            columns = 7,
            numWords = 1,
            minLength = 5,
            numTries = 4,
            debug = false
        } = {}
    )
    {
        //Basic game parameters.
        this.rows = rows;
        this.columns = columns;
        this.numWords = numWords;
        this.minLength = minLength;
        this.numTries = numTries;

        //Used for printing extra stuff while debugging.
        this.debug = debug;

        //Generated game object.
        this.gameObject;

        //This can possibly be used for giving a heavier bias to words starting 
        //with certain letters by putting those letters in this array multiple times.
        this.alphabet =
        [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z"
        ];

        this.gameObject = this.generateGameObject();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    newGameObject(rows = this.rows, columns = this.columns, numWords = this.numWords,
                minLength = this.minLength, numTries = this.numTries)
    {
        this.rows = rows;
        this.columns = columns;
        this.numWords = numWords;
        this.minLength = minLength;
        this.numTries = numTries;
        this.gameObject = this.generateGameObject();
        return this.gameObject;
    }

    generateGameObject()
    {
        //Calculate to see if game parameters are valid.
        const remainder = this.columns + this.numWords * (1 - this.minLength) - 1;

        if(remainder < 0)
        {
            if(this.debug)console.log("GameGenerator1: Invalid game parameters");
            return GameGenerator1.INVALID;
        }

        //Create an unshuffled letter array.
        let letterArray = this.get2DLetterArray(this.rows, this.columns, this.numWords, this.minLength);
        if(letterArray === GameGenerator1.INVALID)
        {
            return GameGenerator1.INVALID;
        }

        //Pick the row that is the solution to the puzzle.
        let rowNumber = Math.floor(Math.random() * this.rows);
        let winningRow = [...letterArray[rowNumber]];

        //Generate array of original column numbers.
        let columnArray = new Array(this.columns);
        for(let i = 0; i < this.columns; i++)
        {
            columnArray[i] = i;
        }

        //Shuffle rows.
        for(let i = 0; i < this.columns; i++)
        {
            for(let j = 0; j < this.rows * 5; j++)
            {
                let row1 = Math.floor(Math.random() * this.rows);
                let row2 = Math.floor(Math.random() * this.rows);

                [letterArray[row1][i], letterArray[row2][i]] = [letterArray[row2][i], letterArray[row1][i]];
            }
        }

        //Shuffle columns and original column numbers.
        for(let i = 0; i < this.columns * 5; i++)
        {
            let column1 = Math.floor(Math.random() * this.columns);
            let column2 = Math.floor(Math.random() * this.columns);

            [columnArray[column1], columnArray[column2]] = [columnArray[column2], columnArray[column1]];

            for(let j = 0 ; j < this.rows; j++)
            {
                [letterArray[j][column1], letterArray[j][column2]] = [letterArray[j][column2], letterArray[j][column1]];
            }
        }

        //Generate array of letter and column locks.
        let locksArray = new Array(0);

        for(let i = 0; i < this.columns; i++)
        {
            locksArray.push({letter: false, column: false});
        }

        //Generate array of letters remaining numbers.
        let remainArray = new Array(0);

        for(let i = 0; i < this.columns; i++)
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

    //Generate word lengths for a single row.
    getWordLengths(columns, numWords, minLength)
    {
        //Min/max columns: 5/20.
        if(columns > GameGenerator1.MAX_LETTERS || columns < GameGenerator1.MIN_LETTERS)
        {
            if(this.debug)console.log("GameGenerator1: Invalid columns");
            return GameGenerator1.INVALID;
        }

        //Min/Max words: 1/5.
        if(numWords > GameGenerator1.MAX_WORDS || numWords < GameGenerator1.MIN_WORDS)
        {
            if(this.debug)console.log("GameGenerator1: Invalid numWords");
            return GameGenerator1.INVALID;
        }

        let remainingLetters = columns; //Keep track of how many letters left to consume.
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

        let currentIndex = wordLengthsArray.length, randomIndex;

        //While there remain elements to shuffle.
        while (currentIndex)
        {
            //Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            //And swap it with the current element using destructuring.
            [wordLengthsArray[currentIndex], wordLengthsArray[randomIndex]] = [wordLengthsArray[randomIndex], wordLengthsArray[currentIndex]];
        }

        return wordLengthsArray;
    }

    //Get a single word from the word array.
    getWord(wordLength, startingLetter)
    {
        let word = GameGenerator1.FAILED;
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
    getWordRow(wordLengthsArray)
    {
        let wordArray = new Array(0);

        for(let i = 0; i < wordLengthsArray.length; i++)
        {
            //Get first word.
            if(i === 0)
            {
                let index = Math.floor(Math.random() * this.alphabet.length);
                let chosenWord = this.getWord(wordLengthsArray[i], this.alphabet[index]);
                if(chosenWord === GameGenerator1.FAILED)
                {
                    //Return if failed.
                    return GameGenerator1.FAILED;
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
                let chosenWord = this.getWord(wordLengthsArray[i], lastLetter);
                if(chosenWord === GameGenerator1.FAILED)
                {
                    //Return if failed.
                    return GameGenerator1.FAILED;
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
    get2DWordArray(rows, columns, numWords, minLength)
    {
        //Min/max columns: 5/20.
        if(columns > GameGenerator1.MAX_LETTERS || columns < GameGenerator1.MIN_LETTERS)
        {
            if(this.debug)console.log("GameGenerator1: Invalid columns");
            return GameGenerator1.INVALID;
        }

        //Min/Max words: 1/5.
        if(numWords > GameGenerator1.MAX_WORDS || numWords < GameGenerator1.MIN_WORDS)
        {
            if(this.debug)console.log("GameGenerator1: Invalid numWords");
            return GameGenerator1.INVALID;
        }

        //Min/Max rows: 3/10.
        if(rows > GameGenerator1.MAX_ROWS || rows < GameGenerator1.MIN_ROWS)
        {
            if(this.debug)console.log("GameGenerator1: Invalid rows");
            return GameGenerator1.INVALID;
        }

        //Min/Max length: 2/20.
        if(minLength > GameGenerator1.MAX_LENGTH || minLength < GameGenerator1.MIN_LENGTH)
        {
            if(this.debug)console.log("GameGenerator1: Invalid minLength");
            return GameGenerator1.INVALID;
        }

        let gameArray = new Array(rows);

        for(let i = 0; i < rows; i++)
        {
            let wordRow = GameGenerator1.FAILED;

            while(wordRow === GameGenerator1.FAILED)
            {
                wordRow = this.getWordRow(this.getWordLengths(columns, numWords, minLength))
            }

            gameArray[i] = wordRow;
        }
    
        return gameArray;
    }

    //Get a 2D matrix of letters to use in the game object.
    get2DLetterArray(rows, columns, numWords, minLength)
    {
        //Get the 2D word array.
        let wordArray = this.get2DWordArray(rows, columns, numWords, minLength);
        if(wordArray === GameGenerator1.INVALID)
        {
            return GameGenerator1.INVALID;
        }

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
}
