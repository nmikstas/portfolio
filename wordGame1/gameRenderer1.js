"use strict";

//This class Presents the game to the user and handles inputs.

class GameRenderer1
{
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                Enumerations and Constants                                 //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                        Constructor                                        //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    constructor
    (
        parentDiv,
        {
            debug = false,
            evalDoneColumn = null,





        } = {}
    )
    {
        this.parentDiv = parentDiv;
        this.debug = debug;
        this.evalDoneColumn = evalDoneColumn;

        




        this.columnArray = new Array(0); //Array of letter columns.

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                      Class Functions                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //--------------------Column Lock Animations--------------------

    animColumnLocks = (newColumnLocksArray) =>
    {
            
        for(let i = 0; i < newColumnLocksArray.length; i++)
        {
            this.columnArray[newColumnLocksArray[i]].style.backgroundColor = "rgb(157, 188, 255)";
            this.columnArray[newColumnLocksArray[i]].style.transitionDuration = ".4s";
        }

        setTimeout(this.evalDoneColumn, 500);
        

       


    }

}