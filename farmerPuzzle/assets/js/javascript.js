//Constants used as indexes into the gameMessage array.
const MSGSAFEMOVE    = 0;
const MSGFOXEATCHKN  = 1;
const MSGCHKNEATSEED = 2;
const MSGWIN         = 3;
const MSGINTRO       = 4;

//Numbers assicated with user button presses.
const BTNFARMER = 0;
const BTNSEEDS  = 1;
const BTNFOX    = 2;
const BTNCHKN   = 3;

//Position variable for each item. false=left river bank, true=right river bank.
var isfarmerRight  = false;
var isseedsRight   = false;
var isfoxRight     = false;
var ischickenRight = false;

//Variables used for animation.
var animBtn;     //Button clicked by user.  Determines what objects to animate.
var doAnimation; //Animation interval variable.
var dx;          //Distance to move animated object per frame.

//Position and sizing variables.
var bkgHeightWidth;
var itemHeightWidth;
var itemSpacer;

//Possible game messages.
var gameMessages =
[
    "<p><b>Safe move! Make another move</b></p>",
    "<p><b>Oh no! The fox ate the chicken! The game is over!</b></p>", 
    "<p><b>Oh no! The chicken ate the seeds! The game is over!</b></p>", 
    "<p><b>Congratulations! The farmer has crossed the river! You win!</b></p>",
    "<p><b>Use the buttons above to select your next move</b></p>"
];

//Initialize the game when the webpage is loaded. 
resetGame();

function animate()
{
    //Animation takes the same amount of time no matter the size of the playing field.
    //These calculations are used to get the sizes of things and determine where the
    //stopping points are located.
    var imgBackground   = document.getElementById("img-background");
    var bkgHeightWidth  = imgBackground.clientHeight / 1.0;
    var itemHeightWidth = bkgHeightWidth / 4.7;
    var itemSpacer      = itemHeightWidth / 6;

    //Calculate the extents of the animations.
    var leftLimit  = Math.floor(itemSpacer);
    var rightLimit = Math.ceil(bkgHeightWidth - itemSpacer - itemHeightWidth);
    var farmerPos  = parseInt(document.getElementById("img-farmer").style.left);
   
    //Check if the animation has reached the end.
    if ((farmerPos < leftLimit) || (farmerPos > rightLimit))
    {
      clearInterval(doAnimation);
      updateState(animBtn);
    }
    else //Keep animating.
    {
        //Always animate the farmer and the boat.
        document.getElementById("img-farmer").style.left = farmerPos + dx + "px";
        document.getElementById("img-boat").style.left = farmerPos + dx + "px";

        //Check for any other necessary animations.
        if(animBtn == BTNSEEDS)
        {
            document.getElementById("img-seeds").style.left = farmerPos + dx + "px";
        }
        else if(animBtn == BTNFOX)
        {
            document.getElementById("img-fox").style.left = farmerPos + dx + "px";
        }
        else if(animBtn == BTNCHKN)
        {
            document.getElementById("img-chicken").style.left = farmerPos + dx + "px";
        } 
    }
}

function moveToState(buttonNum)
{
    //Get width/2 of the back ground for determining wich direction to animate.
    var imgBackground = document.getElementById("img-background");
    var midPoint      = imgBackground.clientHeight / 2;

    //Calculate dx per animation frame.
    dx = imgBackground.clientWidth / 80;

    //Check if moving from right to left. If so, move object in a negative direction.
    var farmerObj = document.getElementById("img-farmer");
    if(parseInt(farmerObj.style.left) > midPoint)
    {
        dx *= -1;
    }

    //Disable buttons during animation to avoid weird behavior.
    setButtonsAndMessage(true, true, true, true, null);

    doAnimation = setInterval(animate, 10);
    animBtn     = buttonNum;
}

//Advances the state of the game.
function updateState(buttonNum)
{
    //Always toggle the farmer's river bank variable.
    isfarmerRight = !isfarmerRight;

    //Update river bank variables.  They always toggle when the object is moved.
    switch(buttonNum)
    {
        case BTNFARMER: //Already toggled above.
            break;

        case BTNSEEDS: 
            isseedsRight = !isseedsRight;
            break;

        case BTNFOX:
            isfoxRight = !isfoxRight;
            break;

        case BTNCHKN:
            ischickenRight = !ischickenRight;
            break;

        default:
            resetGame(); //Should never get here but reset the game if it does.
            break;
    }

    updateImages(); //Place and size the images.

    //Enable the proper buttons.
    setButtonsAndMessage(false, isfarmerRight != isseedsRight, isfarmerRight != isfoxRight,
        isfarmerRight != ischickenRight, MSGSAFEMOVE);
   
    //Check for winning state.
    if(isfarmerRight && isseedsRight && isfoxRight && ischickenRight)
    {
        setButtonsAndMessage(true, true, true, true, MSGWIN);
    }
    //Check if the fox ate the chicken.
    else if((isfoxRight == ischickenRight) && (isfarmerRight != ischickenRight))
    {
        setButtonsAndMessage(true, true, true, true, MSGFOXEATCHKN);
    }
    //Check if the chicken ate the seeds.
    else if((ischickenRight == isseedsRight) && (isfarmerRight != ischickenRight))
    {
        setButtonsAndMessage(true, true, true, true, MSGCHKNEATSEED);
    }
}

//Reset the game back to its initial state.
function resetGame()
{
    clearInterval(doAnimation);
    isfarmerRight = isseedsRight = isfoxRight = ischickenRight = false;
    
    updateImages(); //Place and size the images.
    setButtonsAndMessage(false, false, false, false, MSGINTRO);
}

//Enable buttons and display the specified message.
function setButtonsAndMessage(farmerBtn, seedBtn, foxBtn, ChcknBtn, msgIndex)
{
    document.getElementById("farmerOnlyBtn").disabled     = farmerBtn;
    document.getElementById("farmerAndSeedsBtn").disabled = seedBtn;
    document.getElementById("farmerAndFoxBtn").disabled   = foxBtn;
    document.getElementById("farmerAndChknBtn").disabled  = ChcknBtn;

    if(msgIndex != null)
    {
        document.getElementById("game-status-text").innerHTML = gameMessages[msgIndex];
    }
}

//This function places and resizes all the images used in the game.
function updateImages()
{
    var imgBackground = document.getElementById("img-background");
    bkgHeightWidth = imgBackground.clientHeight;

    //This is required to make the website look right with the xs media query.
    var imgContainer = document.getElementById("img-container");
    imgContainer.style.height = bkgHeightWidth + "px";

    //tweek these variables to change the size of the objects and the spacing between them.
    itemHeightWidth = bkgHeightWidth  / 4.7;
    itemSpacer      = itemHeightWidth / 6;

    //Set the size and position of all the playing field objects.
    setSizeAndPos(document.getElementById("img-farmer") , isfarmerRight , 1, 0);
    setSizeAndPos(document.getElementById("img-seeds")  , isseedsRight  , 1, 1);
    setSizeAndPos(document.getElementById("img-fox")    , isfoxRight    , 0, 2);
    setSizeAndPos(document.getElementById("img-chicken"), ischickenRight, 0, 3);
    setSizeAndPos(document.getElementById("img-boat")   , isfarmerRight , 0, 3.7);    
}

//This functiondoes all the calculations for each individual object in updateImages.
function setSizeAndPos(image, isRight, spacerMult, spacerOffset)
{
    //Set the object image size.
    image.style.height = itemHeightWidth + "px";
    image.style.top = spacerMult * itemSpacer + spacerOffset * itemHeightWidth + "px";

    //Set the object on the left or right river bank.
    isRight ? image.style.left = bkgHeightWidth - itemSpacer - itemHeightWidth + "px" :
        image.style.left = itemSpacer + "px";
}