"use strict";

//NOTE: This class prints the game object to the console window.

class GamePrinter1
{  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //Prints the game object.
    printGameObject(go)
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

        console.log("Solved Letters:");
        let solvedLetters = "";
        for(let i = 0; i < go.columns; i++)
        {
            solvedLetters += ("%s" + (go.solvedArray[i] ? "T " : "F ")); 
        }
        console.log(solvedLetters, ...colNum);

    }
}