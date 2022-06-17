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





            evalUsedLetters = null
        } = {}
    )
    {
        this.gameObject = this.copyGameObject(gameObject);
        this.debug = debug;
        this.printGameObject = printGameObject;
        this.animColumnLocks = animColumnLocks;
        this.animDoneColumn1 = animDoneColumn1;
        this.animRightLetWrongCol1 = animRightLetWrongCol1;



        this.evalUsedLetters = evalUsedLetters;



        this.didSwap = false;
        this.usedLettersArray = new Array(0);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

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

    //Rotates the columns off letters up and down by a given offset.
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

    //This will allow for easier testing and verify things stay valid. If there is a letter lock on a column,
    //it erases all the letters except for the correct one for the column.
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
            this.evalRightLetWrongCol();
        }
    }

    //-------------------- Right Letter Wrong Column Evaluations --------------------

    evalRightLetWrongCol = () =>
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



    //-------------------- Used Letter Evaluations --------------------





    //-------------------- Unused Letter Evaluations --------------------





    //-------------------- Finished Evaluations --------------------





}