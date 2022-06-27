"use strict";

//This class keeps track of the game state and performs operations on the game object.

class GameEngine1
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        {
            gameObject = null,
            debug = false,
            printGameObject = null,
            animColumnLocks = null,
            animDoneColumn1 = null,
            animRightLetWrongCol1 = null,
            animRightLetWrongCol2 = null,
            animUsedLetters1 = null,
            animUsedLetters2 = null,
            animUnusedLetters1 = null,
            animUnusedLetters2 = null,
            animUnusedLetters3 = null,
            newGameObject = null,
            evalFinished = null,
            animSwap2 = null,
        } = {}
    )
    {
        this.gameObject = this.copyGameObject(gameObject);
        this.debug = debug;
        this.printGameObject = printGameObject;
        this.animColumnLocks = animColumnLocks;
        this.animDoneColumn1 = animDoneColumn1;
        this.animRightLetWrongCol1 = animRightLetWrongCol1;
        this.animRightLetWrongCol2 = animRightLetWrongCol2;
        this.animUsedLetters1 = animUsedLetters1;
        this.animUsedLetters2 = animUsedLetters2;
        this.animUnusedLetters1 = animUnusedLetters1;
        this.animUnusedLetters2 = animUnusedLetters2;
        this.animUnusedLetters3 = animUnusedLetters3;
        this.newGameObject = newGameObject;
        this.evalFinished = evalFinished;
        this.animSwap2 = animSwap2;

        this.didSwap = false;
        this.usedLettersArray = new Array(0);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    resetGame = () =>
    {
        this.copyGameObject(this.newGameObject(rows, columns, numWords, minLength, numTries));
        this.usedLettersArray.length = 0;
    }

    copyGameObject = (gameObject) =>
    {
        if(gameObject)
        {
            this.gameObject = 
            {
                rows:        gameObject.hasOwnProperty("rows") ? gameObject.rows : null,
                columns:     gameObject.hasOwnProperty("columns") ? gameObject.columns : null, 
                numWords:    gameObject.hasOwnProperty("numWords") ? gameObject.numWords : null, 
                minLength:   gameObject.hasOwnProperty("minLength") ? gameObject.minLength : null,
                numTries:    gameObject.hasOwnProperty("numTries") ? gameObject.numTries : null,
                letterArray: gameObject.hasOwnProperty("letterArray") ? [...gameObject.letterArray] : null,
                winningRow:  gameObject.hasOwnProperty("winningRow") ? [...gameObject.winningRow] : null,
                columnArray: gameObject.hasOwnProperty("columnArray") ? [...gameObject.columnArray] : null,
                locksArray:  gameObject.hasOwnProperty("locksArray") ? [...gameObject.locksArray] : null,
                remainArray: gameObject.hasOwnProperty("remainArray") ? [...gameObject.remainArray] : null,
                solvedArray: gameObject.hasOwnProperty("solvedArray") ? [...gameObject.solvedArray] : null
            }
        }
    }

    getGameObject = () =>
    {
        return this.gameObject;
    }

    getUsedLettersArray = () =>
    {
        return this.usedLettersArray;
    }

    //Rotates the columns of letters up and down by a given offset.
    scrollColumn = (column, lettersOffset) =>
    {
        //Get the remaining letters from the current column.
        let tempArray = new Array(0);
        for(let j = 0; j < this.gameObject.rows; j++)
        {
            if(this.gameObject.letterArray[j][column] !== " ")
            {
                tempArray.push(this.gameObject.letterArray[j][column]);
            }
        }

        //Update the column order.
        let reformedArray = new Array(0);
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
                this.gameObject.letterArray[j][column] = reformedArray[j];
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
                this.gameObject.letterArray[j][column] = reformedArray[j];
            }
        }
        
        //Show the results.
        if(this.debug)this.printGameObject(this.gameObject);
    }

    //If there is a letter lock on a column, it erases all the letters except for the correct one for the column.
    checkLetterLock = () =>
    {
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            if(this.gameObject.locksArray[i].letter)
            {
                //Set the letters remaining to 1.
                this.gameObject.remainArray[i] = 1;

                //Get the correct final letter for the current column.
                let finalLetter = this.gameObject.winningRow[this.gameObject.columnArray[i]];

                for(let j = 0; j < this.gameObject.rows; j++)
                {
                    this.gameObject.letterArray[j][i] = (j === 0) ? finalLetter : " ";
                }
            }
        }
    }

    //Take all the blanks out of the columns and put them at the bottom.
    updateColumns = () =>
    {
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            let letterCount = 0;
            let tempArray = new Array(0);

            //Take all the valid letters out of the current column and push them into the temp array.
            for(let j = 0; j < this.gameObject.rows; j++)
            {
                if(this.gameObject.letterArray[j][i] !== " ")
                {
                    tempArray.push(this.gameObject.letterArray[j][i]);
                    letterCount++;
                }
            }

            //Replace the letters in the letter array with the consolidated version.
            for(let j = 0; j < this.gameObject.rows; j++)
            {
                this.gameObject.letterArray[j][i] = " ";
            }

            for(let j = 0; j < tempArray.length; j++)
            {
                this.gameObject.letterArray[j][i] = tempArray[j];
            }

            //Update the letters remaining array.
            this.gameObject.remainArray[i] = letterCount;

            //Update the letter lock indicator, if necessary.
            if(letterCount === 1)
            {
                this.gameObject.locksArray[i].letter = true;
                this.gameObject.remainArray[i] = 1;
            }
        }
    }

    evalSwap = (animIndexArray) =>
    {
        for(let i = 0; i < this.gameObject.letterArray.length; i++)
        {
            [this.gameObject.letterArray[i][animIndexArray[0]], this.gameObject.letterArray[i][animIndexArray[1]]] = 
            [this.gameObject.letterArray[i][animIndexArray[1]], this.gameObject.letterArray[i][animIndexArray[0]]];
        }

        //Swap items in the column order.
        [this.gameObject.columnArray[animIndexArray[0]], this.gameObject.columnArray[animIndexArray[1]]] =
        [this.gameObject.columnArray[animIndexArray[1]], this.gameObject.columnArray[animIndexArray[0]]];

        //Swap items in the locks array.
        [this.gameObject.locksArray[animIndexArray[0]], this.gameObject.locksArray[animIndexArray[1]]] =
        [this.gameObject.locksArray[animIndexArray[1]], this.gameObject.locksArray[animIndexArray[0]]];

        //Swap items in letters remaining array.
        [this.gameObject.remainArray[animIndexArray[0]], this.gameObject.remainArray[animIndexArray[1]]] =
        [this.gameObject.remainArray[animIndexArray[1]], this.gameObject.remainArray[animIndexArray[0]]];

        if(debug)this.printGameObject(this.gameObject);
        this.animSwap2();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                   Evaluation Functions                                    //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //-------------------- Start Evaluations --------------------

    doEvaluations = () =>
    {
        this.evalColumnLocks()
    }

    //-------------------- Column Lock Evaluations --------------------

    evalColumnLocks = () =>
    {
        let newColumnLocksArray = new Array(0);

        //Check for column locks.
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            if(this.gameObject.columnArray[i] === i)
            {
                //Only include new columns.
                if(!this.gameObject.locksArray[i].column)
                {
                    this.gameObject.locksArray[i].column = true;
                    newColumnLocksArray.push(i);
                }
            }
        }

        if(newColumnLocksArray.length > 0)
        {
            this.animColumnLocks(newColumnLocksArray);
        }
        else
        {
            this.evalDoneColumn();
        }
    }

    //-------------------- Completed Columns Evaluations --------------------

    evalDoneColumn = () =>
    {
        let newDoneColumnArray = new Array(0);
        let workDone = false; //Only delay if some animations set.

        this.updateColumns();

        //Check for column AND letter locks.
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            //Check if column is locked and correct letter is on top.
            if(this.gameObject.locksArray[i].column && (this.gameObject.letterArray[0][i] === this.gameObject.winningRow[i]))
            {
                //Only process changes on newly solved letters.
                if(!this.gameObject.solvedArray[i])
                {
                    this.gameObject.solvedArray[i] = true;
                    this.gameObject.locksArray[i].letter = true;
                    this.gameObject.remainArray[i] = 1;
                    workDone = true;
                }
                
                newDoneColumnArray.push(i);
            }
        }

        if(workDone)
        {
            this.animDoneColumn1(newDoneColumnArray);
        }
        else
        {
            this.evalRightLetWrongCol1();
        }
    }

    //-------------------- Right Letter Wrong Column Evaluations --------------------

    evalRightLetWrongCol1 = () =>
    {
        //Get array of the right letters but wrong columns.
        let moveArray = new Array(0);

        for(let i = 0; i < columns; i++)
        {
            if(this.gameObject.letterArray[0][i] === this.gameObject.winningRow[i] && !this.gameObject.locksArray[i].column)
            {
                let fromColumn;
                //Find the destination column
                for(let j = 0; j < this.gameObject.columnArray.length; j++)
                {
                    if(this.gameObject.columnArray[j] === i)
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
            this.didSwap = false;
            this.evalUsedLetters();
        }
        else
        {
            //Move chains found. Process those chains.
            this.didSwap = true;
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

            if(this.debug)console.log("Word Chains:");
            if(this.debug)console.log(moveArray);

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

            if(this.debug)console.log("Close Array:");
            if(this.debug)console.log(closeArray);

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

            if(this.debug)console.log("Move Chain Array:");
            if(this.debug)console.log(moveChainArray);

            //Make an array of indexes to change to for scroll changes later.
            let indexesArray = new Array(this.gameObject.columns);
            for(let i = 0; i < indexesArray.length; i++)
            {
                indexesArray[i] = -1;
            }

            //Create an array of columns to scroll and how much to scroll them.
            let scrollArray = new Array(0);

            //Need to rotate letters to the proper position in the column.
            for(let i = 0; i < moveChainArray.length; i++)
            {
                if(moveChainArray[i].rotate)
                {
                    let index = 0;
                    let letterToChangeTo = this.gameObject.winningRow[moveChainArray[i].to];
                
                    //Find the index of the letter to scroll to.
                    for(let j = 0; j < this.gameObject.letterArray.length; j++)
                    {
                        if(this.gameObject.letterArray[j][moveChainArray[i].from] === letterToChangeTo)
                        {
                            index = j;
                            indexesArray[moveChainArray[i].from] = index;

                            scrollArray.push({colIndex: moveChainArray[i].from, scrollIndex: index});
                            break; //Keeps it from rotating to bottom letter if multiple instances.
                        }
                    }
                }
            }

            //Create a new version of the letter array and copy in all the changes.
            let letterArray = new Array(this.gameObject.rows);
            for(let i = 0; i < letterArray.length; i++)
            {
                letterArray[i] = [...this.gameObject.letterArray[i]];
            }
        
            //Create a new version of the indexes array.
            let indArray = [...indexesArray];

            //create new version of the columns array.
            let colArray = [...this.gameObject.columnArray];

            //Create new version of the locks array.
            let lckArray = [...this.gameObject.locksArray];

            //Create a new version of the remaining letters array.
            let remArray = [this.gameObject.remainArray];
        
            //Rearrange the order of all the newly formed arrays.
            for(let i = 0; i < moveChainArray.length; i++)
            {
                for(let j = 0; j < this.gameObject.letterArray.length; j++)
                {
                    letterArray[j][moveChainArray[i].to] = this.gameObject.letterArray[j][moveChainArray[i].from];
                }

                indArray[moveChainArray[i].to] = indexesArray[moveChainArray[i].from];
                colArray[moveChainArray[i].to] = this.gameObject.columnArray[moveChainArray[i].from];
                lckArray[moveChainArray[i].to] = this.gameObject.locksArray[moveChainArray[i].from];
                remArray[moveChainArray[i].to] = this.gameObject.remainArray[moveChainArray[i].from];
            }

            //Now all the columns in the letter array need to be rotated to the proper indexes.
            for(let i = 0; i < this.gameObject.columns; i++)
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
            for(let i = 0; i < this.gameObject.letterArray.length; i++)
            {
                this.gameObject.letterArray[i] = [...letterArray[i]];
            }

            this.gameObject.columnArray = [...colArray];
            this.gameObject.locksArray = [...lckArray];
            this.gameObject.remainArray = [...remArray];

            this.checkLetterLock(); //Check for letter lock only.
            this.animRightLetWrongCol1(scrollArray, moveChainArray);
        } 
    }

    evalRightLetWrongCol2 = () =>
    {
        if(this.didSwap)
        {
            this.updateColumns(); //Consolidate columns.   
            setTimeout(this.doEvaluations(), 500);
        }
        else
        {
            this.evalUsedLetters();
        }
    }

    //-------------------- Used Letter Evaluations --------------------

    evalUsedLetters = () =>
    {
        let prevLength = this.usedLettersArray.length;
    
        //Loop through the top row of letters and look for ones in the solution.
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            //Skip solved columns.
            if(!this.gameObject.locksArray[i].column || !this.gameObject.locksArray[i].letter)
            {
                let thisLetter = this.gameObject.letterArray[0][i];
    
                //Loop through winning row and locks array to see if this a used letter not yet solved for.
                for(let j = 0; j < this.gameObject.columns; j++)
                {
                    //If letter appears in the winning row in an unlocked column, add it to the used letters array.
                    if((thisLetter === this.gameObject.winningRow[j]) && (!this.gameObject.locksArray[j].column || !this.gameObject.locksArray[j].letter))
                    {
                        //Only add if its not already in there.
                        if(!this.usedLettersArray.includes(thisLetter))
                        {
                            this.usedLettersArray.push(thisLetter);
                        }
                    }
                }
            }
        }
    
        if(this.debug)console.log("Used Letters:");
        if(this.debug)console.log(this.usedLettersArray);
    
        this.updateColumns(); //Consolidate columns.   
        this.checkLetterLock(); //Check for letter lock only.
    
        //Run the used letters animation only if something has changed.
        if(this.usedLettersArray.length !== prevLength)
        {
            this.animUsedLetters1(this.usedLettersArray);
        }
        else
        {
            this.evalUnusedLetters1();
        }
    }

    //-------------------- Unused Letter Evaluations --------------------

    evalUnusedLetters1 = () =>
    {
        let unusedLettersArray = new Array(0);
    
        //Create an ibject that holds all the instances of letters used in the solution.
        let alphabetObj =
        {
            A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0,
            N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0
        }
    
        //Keep track of what letters and how many are used in the solution.
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            alphabetObj[this.gameObject.winningRow[i]]++;
        }
    
        //Now subtract the solved letters from the alphabet object.
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            if(this.gameObject.locksArray[i].column && this.gameObject.locksArray[i].letter)
            {
                alphabetObj[this.gameObject.letterArray[0][i]]--;
            }
        }
    
        //Now we can calculate an array of unused letters.
        for(let i = 0; i < this.gameObject.columns; i++)
        {
            if(alphabetObj[this.gameObject.letterArray[0][i]] === 0)
            {
                let thisLetter = this.gameObject.letterArray[0][i];
                if(!unusedLettersArray.includes(thisLetter))
                {
                    unusedLettersArray.push(thisLetter);
                }
            }
        }
    
        //Remove letters from the game object.
        for(let i = 0; i < this.gameObject.letterArray.length; i++)
        {
            for(let j = 0; j < this.gameObject.letterArray[i].length; j++)
            {
                if(unusedLettersArray.includes(this.gameObject.letterArray[i][j]))
                {
                    this.gameObject.letterArray[i][j] = " ";
                }
            }
        }
    
        //Shrink unused letters away from screen.
        if(unusedLettersArray.length !== 0)
        {
            this.animUnusedLetters1(unusedLettersArray);
        }
        else
        {
            this.evalFinished();
        }
    }

    evalUnusedLetters2 = () =>
    {
        this.updateColumns(); //Consolidate columns.   
        this.checkLetterLock(); //Check for letter lock only.
        this.animUnusedLetters3();
    }

    //-------------------- Finished Evaluations --------------------

      



}