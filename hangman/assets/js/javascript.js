//Debug variable.
var debug = true;

//A list of basic words that are used if a file is not loaded.
var defaultPhrases =
[
    "tiger",      "dolphin",     "giraffe",        "elephant",    "competition",
    "kangaroo",   "rabbit",      "aardvark",       "wolverine",   "connection",
    "hamburger",  "alligator",   "crocodile",      "balloon",     "destruction",
    "hammer",     "basketball",  "football",       "trousers",    "distribution",
    "flower",     "apartment",   "computer",       "fantastic",   "education",
    "attention",  "beautiful",   "building",       "business",    "existence",
    "experience", "feather",     "foolish",        "frequent",    "government",
    "harmony",    "important",   "instrument",     "invention",   "journey",
    "knowledge",  "learning",    "leather",        "manager",     "military",
    "necessary",  "observation", "organization",   "parallel",    "position",
    "potato",     "punishment",  "representative", "responsible", "scissors",
    "selection",  "statement",   "thought",        "transport",   "yesterday",
];

var userPhrases = [];

//Game status messages.
const gameMessages =
{
    PLAY: "Press a letter key to make a guess",
    PAUSE: "Oh no! That letter is not present",
    WIN: "You win! Press any key to play again",
    LOSE: "You lose! Press any key to play again",
    TRYAGAIN: "Letter already chosen! Try again"
};

//Index into array above.
var msgText = "";

//Results of an updatePhrase function call.
const updateCode =
{
    HIT:  0, //User guessed a letter in the phrase.
    MISS: 1, //User guessed a letter not in the phrase.
    PUSH: 2  //User already tried this letter.
};

//Gate state enumeration.
const gameStates =
{
    PLAY:  0,
    PAUSE: 1,
    NEXT:  2,
};

var state = gameStates.PLAY;
var phraseIndex = 0;
var guesses = 10;
var wins = 0;
var losses = 0;
var phrase = "";
var misses = [];
var hits = [];

//Animation variables.
var doAnimation;
var animOpacity = 0;

//Set up key listener.
document.onkeyup = function(event)
{
    var key = event.key.toLocaleLowerCase();

    switch(state)
    {
        case gameStates.PLAY:
            //Only accept alphabetic characters.
            if(key.match(/[a-z]/i) && key.length == 1)
            {
                var status = updatePhrase(key);

                //Update message if user already picked this letter.
                if(status == updateCode.PUSH)
                {
                    msgText = gameMessages.TRYAGAIN;
                    updatePageText();
                }
                //User guessed a letter in the phrase.
                else if(status == updateCode.HIT)
                {
                    msgText = gameMessages.PLAY;
                    updatePageText();
                    if(isSolved())
                    {
                        wins++;
                        document.getElementById("win").play();
                        state = gameStates.NEXT;
                        msgText = gameMessages.WIN;
                        updatePageText();
                    }
                    else
                    {
                        document.getElementById("hit").play();
                    }
                }
                //User guessed a letter not in the phrase.
                else
                {
                    guesses--;
                    document.getElementById("miss").play();
                    state = gameStates.PAUSE;
                    msgText = gameMessages.PAUSE;
                    updatePageText();
                    animOpacity = 0;
                    doAnimation = setInterval(animate, 50);
                }
            }
            break;

        case gameStates.PAUSE:
            //Nothing to process. Ignore the input.
            break;

        case gameStates.NEXT:
            //Start new game after any key pressed.
            state = gameStates.PLAY;
            stopAudio();
            newMatch();
            break;

        //Reset game if something goes wrong.
        default:
            init();
            break;
    }
};

//Checks to see if the player won.
function isSolved()
{
    var solved = true;

    //Loop through the phrases array and check if there are any more dashes.
    for(let i = 0; i < phrase.length; i++)
    {
        if(phrase[i] === '-')
        {
            solved = false;
        }
    }

    return solved;
}

//Update the phrase after a user guesses a letter.
function updatePhrase(character)
{
    var isCharPresent = false;

    //Check to make sure the letter has not already been chosen and in the misses array.
    for(let i = 0; i < misses.length; i++)
    {
        if(misses[i] == character)
        {
            return updateCode.PUSH;
        }
    }

    //Check to make sure the letter has not already been chosen and in the hits array.
    for(let i = 0; i < hits.length; i++)
    {
        if(hits[i] == character)
        {
            return updateCode.PUSH;
        }
    }

    for(let i = 0; i < phrase.length; i++)
    {
        //Replace dashes in phrase string if character is present.
        if(userPhrases[phraseIndex][i] == character)
        {
            isCharPresent = true;
            phrase = phrase.substr(0, i) + character + phrase.substr(i + 1);            
        }
    }

    if(isCharPresent)
    {
        //Add character to hit array.
        hits.push(character);
        msgText = gameMessages.PLAY;
        updatePageText();
        return updateCode.HIT;
    }
    else
    {
        //Add character to miss array.
        misses.push(character);
        return updateCode.MISS;
    }
}

//Check if character is in the misses array.
function isMissed(character)
{
    var isPresent = false;

    for(let i = 0; i < misses.length; i++)
    {
        if(misses[i] == character)
        {
            isPresent = true;
        }
    }
    return isPresent;
}

//Check if character is in the hits array.
function isHit(character)
{
    var isPresent = false;

    for(let i = 0; i < hits.length; i++)
    {
        if(hits[i] == character)
        {
            isPresent = true;
        }
    }
    return isPresent;
}

//Initialize the phrase with dashes and spaces.
function initPhrase()
{
    for(let i = 0; i < userPhrases[phraseIndex].length; i++)
    {
        if(userPhrases[phraseIndex][i].match(/ /))
        {
            phrase = phrase.concat(" ");
        }
        else
        {
            phrase = phrase.concat("-");
        }
    }
    if(debug)console.log(userPhrases[phraseIndex]);
}

/*********************************** Website Display Functions ***********************************/

function updatePageText()
{
    document.getElementById('status').innerHTML = msgText;
    document.getElementById("phrase").innerHTML = phrase;
    document.getElementById("used-letters").innerHTML = "Letters used: " + misses;
    document.getElementById("guesses-left").innerHTML = "Guesses left: " + guesses;
    document.getElementById("wins").innerHTML = "Wins: " + wins;
    document.getElementById("losses").innerHTML = "Losses: " + losses;
}

//This is required to make the website look right with the xs media query.
function resize()
{
    var imgBackground = document.getElementById("img-hangman0");
    var bkgHeightWidth = imgBackground.clientHeight;
    var imgContainer = document.getElementById("img-container");
    imgContainer.style.minHeight = bkgHeightWidth + "px";
}

//This function fades in the hangman guy.
function animate()
{
    
    if(animOpacity >= 1)
    {
        //Make sure image is full opaque.
        document.getElementById("img-hangman" + (10 - guesses)).style.opacity = 1;

        //Animation done.  Check what to do next.
        clearInterval(doAnimation);
        if(!guesses)
        {
            //Player lost.
            state = gameStates.NEXT;
            msgText = gameMessages.LOSE;
            losses++;
            document.getElementById("lose").play();
            updatePageText();
            document.getElementById("phrase").innerHTML = userPhrases[phraseIndex];
        }
        else
        {
            //Game still going.
            state = gameStates.PLAY;
            msgText = gameMessages.PLAY;
            updatePageText();
        }
    }
    else
    {
        //Keep animating.
        document.getElementById("img-hangman" + (10 - guesses)).style.opacity = animOpacity;
        animOpacity += .05;
    }
}

/*********************************** Game Initialize And Reset ***********************************/

function init()
{
    //Reset and log the user phrases to the default.
    userPhrases = defaultPhrases;
    if(debug)console.log(userPhrases);

    //Reset the game variables.
    
    wins = 0;
    losses = 0;

    //Clear the user selected file box.
    document.getElementById('file-input').value = '';

    newMatch();
}

function newMatch()
{
    state = gameStates.PLAY;
    guesses = 10;
    phrase = "";
    misses = [];
    hits = [];

    //Randomly choose a phrase.
    phraseIndex = Math.floor(Math.random() * userPhrases.length);
    initPhrase();

    //Reset the opacity of the images.
    document.getElementById("img-hangman0").style.opacity = 1;
    for(let i = 1; i <= 10; i++)
    {
        document.getElementById("img-hangman" + i).style.opacity = 0;
    }

    //Set the default message in the status box.
    msgText = gameMessages.PLAY;
    updatePageText();

    //Update the layout.
    resize();  
}

//Stop any playing audio.
function stopAudio()
{
    var lose = document.getElementById("lose");
    lose.pause();
    lose.currentTime = 0;

    var win = document.getElementById("win");
    win.pause();
    win.currentTime = 0;

    var hit = document.getElementById("hit");
    hit.pause();
    hit.currentTime = 0;

    var miss = document.getElementById("miss");
    miss.pause();
    miss.currentTime = 0;
}

/***************************************** File Parsing ******************************************/

//Takes the user supplied file and validates each phrase.
var openFile = function(event)
{
    var input = event.target;
    var reader = new FileReader();

    //Read the contents of the file uploaded by the user.
    reader.onload = function()
    {
        //Clear out old phrases.
        userPhrases = [];

        //Get the contents of the file.
        var text = reader.result;

        //Separate the contents by newlines.
        text = text.split('\n');
        
        //Loop through the text array and format the results.
        text.forEach(readLines);
        function readLines(line, index)
        {
            //Trim whitespaces off the front and end.
            line = line.trim();

            //Log commented lines.
            if(line[0] === '/' && line[1] === '/')
            {
                if(debug)console.log("*** Comment at line " + index + 1 +" ***");
            }
            //Log blank lines.
            else if(line === "")
            {
                if(debug)console.log("*** Blank at line " + index + 1 +" ***");
            }
            else
            {
                //Look for invalid characters.
                var isValidPhrase = true;
                for(let i = 0; i < line.length; i++)
                {
                    if(!line[i].match(/[a-z ]/i))
                    {
                        isValidPhrase = false;
                    }
                }

                if(isValidPhrase)
                {
                    if(debug)console.log(line + " ---Valid---");
                    userPhrases.push(line.toLowerCase());
                }
                else
                {
                    if(debug)console.log(line + " !!!INVALID!!!");
                }
            }
        }

        //Reset userArray to valid values if the entered file is invalid.
        if(userPhrases.length === 0)
        {
            userPhrases = defaultPhrases;

            //Clear the user selected file box.
            document.getElementById('file-input').value = '';
        }

        if(debug)console.log(userPhrases);  
        
        //Start a new match once file is loaded.
        newMatch();
    };

    reader.readAsText(input.files[0]);
};