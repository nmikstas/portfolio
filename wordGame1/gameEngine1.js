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
            animColumnLocks = null,






            evalDoneColumn = null
        } = {}
    )
    {
        this.gameObject = this.copyGameObject(gameObject);
        this.debug = debug;
        this.animColumnLocks = animColumnLocks;
        




        this.evalDoneColumn = evalDoneColumn;
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
                remainArray: gameObject.hasOwnProperty("remainArray") ? [...gameObject.remainArray] : null
            }
        }
    }

    //-------------------- Game Reduction Evaluations --------------------
    doEvaluation = () =>
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
}