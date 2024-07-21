/**************************************** Quiz Game Class ****************************************/
class QuizGame
{
    constructor(numQuestions)
    {
        this.debug = true;

        //Array of question objects.
        this.quizQuestions =
        [
            {
                question: "What character did Kurt Russel play in \"The Thing\"?",
                answer:   "R. J. MacReady",
                ansInfo:  "Kurt Russel played R.J. MacReady in \"The Thing\"",
                wrong:    ["Wyatt Earp", "Snake Plissken", "Jack Burton"],
                image:    "assets/images/macready.gif"
            },
            {
                question: "What character did Kurt Russel play in \"Big Trouble in Little China\"?",
                answer:   "Jack Burton",
                ansInfo:  "Kurt Russel played Jack Burton in \"Big Trouble in Little China\"",
                wrong:    ["Wyatt Earp", "R. J. MacReady", "Snake Plissken"],
                image:    "assets/images/burton.gif"
            },
            {
                question: "What character did Kurt Russel play in \"Escape From New York\"?",
                answer:   "Snake Plissken",
                ansInfo:  "Kurt Russel played Snake Plissken in \"Escape From New York\"",
                wrong:    ["Wyatt Earp", "R. J. MacReady", "Jack Burton"],
                image:    "assets/images/snake.gif"
            },
            {
                question: "What character did Kurt Russel play in \"Tombstone\"?",
                answer:   "Wyatt Earp",
                ansInfo:  "Kurt Russel played Wyatt Earp in \"Tombstone\"",
                wrong:    ["R. J. MacReady", "Jack Burton", "Snake Plissken"],
                image:    "assets/images/earp.gif"
            },
            {
                question: "What character did Arnold Schwarzenegger play in \"Predator\"?",
                answer:   "Alan \"Dutch\" Schaefer",
                ansInfo:  "Arnold Schwarzenegger played Alan \"Dutch\" Schaefer in \"Predator\"",
                wrong:    ["John Matrix", "Ben Richards", "Harry Tasker"],
                image:    "assets/images/schaeffer.gif"
            },
            {
                question: "What character did Arnold Schwarzenegger play in \"Commando\"?",
                answer:   "John Matrix",
                ansInfo:  "Arnold Schwarzenegger played John Matrix in \"Commando\"",
                wrong:    ["Alan \"Dutch\" Schaefer", "Ben Richards", "Harry Tasker"],
                image:    "assets/images/matrix.gif"
            },
            {
                question: "What character did Arnold Schwarzenegger play in \"The Running Man\"?",
                answer:   "Ben Richards",
                ansInfo:  "Arnold Schwarzenegger played Ben Richards in \"The Running Man\"",
                wrong:    ["John Matrix", "Harry Tasker", "Alan \"Dutch\" Schaefer"],
                image:    "assets/images/richards.gif"
            },
            {
                question: "What character did Arnold Schwarzenegger play in \"True Lies\"?",
                answer:   "Harry Tasker",
                ansInfo:  "Arnold Schwarzenegger played Harry Tasker in \"True Lies\"",
                wrong:    ["Ben Richards", "John Matrix", "Alan \"Dutch\" Schaefer"],
                image:    "assets/images/tasker.gif"
            },
            {
                question: "What character did Sylvester Stallone play in \"Demolition Man\"?",
                answer:   "John Spartan",
                ansInfo:  "Sylvester Stallone played John Spartan in \"Demolition Man\"",
                wrong:    ["Marion Cobretti", "Lincoln Hawk", "Barney Ross"],
                image:    "assets/images/spartan.gif"
            },
            {
                question: "What character did Sylvester Stallone play in \"Cobra\"?",
                answer:   "Marion Cobretti",
                ansInfo:  "Sylvester Stallone played Marion Cobretti in \"Cobra\"",
                wrong:    ["John Spartan", "Lincoln Hawk", "Barney Ross"],
                image:    "assets/images/cobretti.gif"
            },
            {
                question: "What character did Sylvester Stallone play in \"Over the Top\"?",
                answer:   "Lincoln Hawk",
                ansInfo:  "Sylvester Stallone played Lincoln Hawk in \"Over the Top\"",
                wrong:    ["Marion Cobretti", "John Spartan", "Barney Ross"],
                image:    "assets/images/hawk.gif"
            },
            {
                question: "What character did Sylvester Stallone play in \"The Expendables\"?",
                answer:   "Barney Ross",
                ansInfo:  "Sylvester Stallone played Barney Ross in \"The Expendables\"",
                wrong:    ["Marion Cobretti", "John Spartan", "Lincoln Hawk"],
                image:    "assets/images/ross.gif"
            }
        ];

        this.gameStates = //These are the various game states.
        {
            IDLE:                "idle",
            FADE_IN_QUESTION:    "fade-in-question",
            PLAYER_QUESTION:     "player-question",
            FADE_OUT_QUESTION:   "fade-out-question",
            FADE_IN_CORRECT:     "fade-in-correct",
            FADE_IN_INCORRECT:   "fade-in-incorrect",
            FADE_IN_TIMEOUT:     "fade-in-timeout",
            SHOW_ANSWER:         "show-answer",
            FADE_OUT_ANSWER:     "fade-out-answer",
            FADE_IN_PLAY_AGAIN:  "fade-in-play-again",
            PLAY_AGAIN:          "play-again",
            FADE_OUT_PLAY_AGAIN: "fade-out-play-again" 
        } 

        this.questionResults = //Possible outcomes of a question.
        {
            CORRECT:   "Correct",
            INCORRECT: "Incorrect",
            TIME_UP:   "Time's up"
        }

        this.state = this.gameStates.IDLE;
        this.questionResult;
        this.numQuestions = numQuestions;
        this.isCorrect = false;
        this.isTimeout = false;
        this.questionNumber = 1;
        this.questionArr = [];  //Questions to choose.
        this.selectionArr = []; //Order of selections to choose from.

        //Keep track of right, wrong and timed out questions.
        this.correct   = 0;
        this.incorrect = 0;
        this.timeOut   = 0;

        //The following variables are used for building the webpage dynamically.
        //Question display screen.
        this.questionRow1;
        this.questionCol1;
        this.questionRow2;
        this.questionCol2;
        this.questionCol3;
        this.questionCan1;
        this.thisQuestion;

        //Question and answer timers.
        this.qTimer;
        this.aTimer;

        //Audio elements for the game.
        this.audEndQuiz   = new Audio("assets/sounds/End_Quiz.mp3");
        this.audCorrect   = new Audio("assets/sounds/Right_Answer.mp3");
        this.audIncorrect = new Audio("assets/sounds/Wrong_Answer.mp3");
        this.audTimeUp    = new Audio("assets/sounds/Time_Up.mp3");
        this.audClock     = new Audio("assets/sounds/Tick_Tock.mp3");

    } //End constructor.
    
    /********************************* QuizGame Class Functions **********************************/
    //This is the main function that runs the game.
    updateState(playArea)
    {
        switch(this.state)
        {
            //Resets the game and randomizes questions and selections.
            case this.gameStates.IDLE:
                if(this.debug)console.log("state: " + this.state);
                playArea.empty(); //Prepare to redraw play area.

                //Clear and end game audio that may be playing.
                this.audEndQuiz.pause();
                this.audEndQuiz.currentTime = 0;

                //Make sure the number of questions does not exceed the quizQuesions array size.
                if(this.numQuestions > this.quizQuestions.length)
                {
                    this.numQuestions = this.quizQuestions.length;
                }

                //Randomly pick questions to use.
                this.questionArr = this.genRandNums(this.quizQuestions.length, this.numQuestions);

                //Randomly choose order of selections(2D array).
                for(let i = 0; i < this.numQuestions; i++)
                {
                    this.selectionArr.push(this.genRandNums(4, 4));
                }

                //Check if the arrays were properly formed if debugging.
                if(this.debug)console.log("Questions: "  + this.questionArr);
                if(this.debug)console.log("Selections: " + this.selectionArr);
                if(this.debug)console.log("Selections Length: " + this.selectionArr.length);

                //Move to next state to show the question.
                this.state = this.gameStates.FADE_IN_QUESTION;
                this.updateState(playArea);
                break;

            //Used to put questions on the display. Can also do fancy fade-in, if desired.
            case this.gameStates.FADE_IN_QUESTION:
                if(this.debug)console.log("state: " + this.state);

                //Get the index of the question in quizQuestions.
                var questionIndex = this.questionArr[this.questionNumber-1];
                if(this.debug)console.log("Question index: " + questionIndex);

                //Display the question number.
                this.questionRow1 = $("<div>");
                this.questionRow1.addClass("row");
                this.questionCol1 = $("<div>");
                this.questionCol1.addClass("col-md-12");
                this.questionRow1.append(this.questionCol1);
                this.questionCol1.html("<h3 class=\"pb-4 mb-3\">Question #" + this.questionNumber + 
                                       " of " + this.numQuestions + "</h3>");
                $("#main-container").append(this.questionRow1);

                //Display the question.
                this.thisQuestion = $("<h2>");
                this.thisQuestion.addClass("pb-4 mb-3");
                this.thisQuestion.text(this.quizQuestions[questionIndex].question);
                this.questionCol1.append(this.thisQuestion);

                //Setup row for the buttons and timer.
                this.questionRow2 = $("<div>");
                this.questionRow2.addClass("row");
                this.questionCol2 = $("<div>");
                this.questionCol2.addClass("col-md-8");
                this.questionRow2.append(this.questionCol2);
                this.questionCol3 = $("<div>");
                this.questionCol3.addClass("col-md-4");
                this.questionRow2.append(this.questionCol3);
                $("#main-container").append(this.questionRow2);

                //Add a canvas for the timer. Cannot be created with JQuery.
                this.questionCan1 = document.createElement("canvas");
                this.questionCan1.classList.add("question-timer");
                this.questionCol3.append(this.questionCan1);
                
                //Set up the buttons.
                for(let i = 0; i < 4; i++)
                {
                    //Get index for the text of the current button.
                    var answerOrder = this.selectionArr[this.questionNumber-1][i];
                    var button = $("<button>");

                    //Check to see if correct answer needs to be put on this button.
                    if(answerOrder === 3)
                    {
                        button.text(this.quizQuestions[questionIndex].answer);
                    }
                    //Put an incorrect answer on the button.
                    else
                    {
                        button.text(this.quizQuestions[questionIndex].wrong[answerOrder]);
                    }
                    
                    button.attr("value", answerOrder);
                    button.addClass("choice-button pb-3");
                    this.questionCol2.append(button);

                    //Handle the button press. Need to have pointers to BOTH the button and the class.
                    var self = this;
                    self.playerChoice = function()
                    {
                        self.qTimer.stopTimer();
                        //Get value pressed by player.  Correct answer is always 3.
                        var buttonPressed = $(this).attr("value");
                        if(self.debug)console.log("Button value: " + buttonPressed);

                        //Check if user was correct or not.
                        if(buttonPressed === '3')
                        {
                            self.questionResult = self.questionResults.CORRECT;
                        }
                        else
                        {
                            self.questionResult = self.questionResults.INCORRECT;
                        }
                        
                        //Move to next state.
                        if(self.debug)console.log("Player choice: " + self.questionResult);
                        self.state = self.gameStates.FADE_OUT_QUESTION;
                        self.updateState(playArea);
                    };

                    button.on('click', self.playerChoice);
                }

                this.state = this.gameStates.PLAYER_QUESTION;
                this.updateState(playArea);
                break;

            //Starts the question timer.
            case this.gameStates.PLAYER_QUESTION:
                if(this.debug)console.log("state: " + this.state);

                var self = this;

                //Callback for expired question timer.
                var timeUp1 = function()
                {
                    //Play the time up sound.
                    self.audTimeUp.play();

                    self.questionResult = self.questionResults.TIME_UP;
                    if(self.debug)console.log("Player choice: " + self.questionResult);
                    self.state = self.gameStates.FADE_OUT_QUESTION;
                    self.updateState(playArea);
                }

                //Instantiate the timer object and start it.
                this.qTimer = new ATimer(this.questionCan1, 300, 20, ATimer.CLOCK_STYLE_1, "#4aaaa5", timeUp1);
                this.qTimer.startTimer();

                //Play the clock ticking sound effect.
                this.audClock.loop = true;
                this.audClock.play()
                break;

            //Use this state to remove the quesion and show the answer. Fancy fade out stuff can be put here.
            case this.gameStates.FADE_OUT_QUESTION:
                if(this.debug)console.log("state: " + this.state);

                //Stop the clock sound.
                this.audClock.pause();
                this.audClock.currentTime = 0;

                this.thisQuestion.empty();
                this.questionRow2.empty();

                //Choose next state based on player result and update the stats.
                if(this.questionResult === this.questionResults.CORRECT)
                {
                    this.audCorrect.play();
                    this.state = this.gameStates.FADE_IN_CORRECT;
                    this.correct++;
                }
                else if(this.questionResult === this.questionResults.INCORRECT)
                {
                    this.audIncorrect.play();
                    this.state = this.gameStates.FADE_IN_INCORRECT;
                    this.incorrect++;
                }
                else
                {
                    this.state = this.gameStates.FADE_IN_TIMEOUT;
                    this.timeOut++;
                }

                if(this.debug)console.log("Correct: " + this.correct + ", Incorrect: " + this.incorrect + ", Time-outs: " + this.timeOut);
                this.updateState(playArea);
                break;

            //Fade in the correct, incorrect or time's up answer.
            case this.gameStates.FADE_IN_CORRECT:
            case this.gameStates.FADE_IN_INCORRECT:
            case this.gameStates.FADE_IN_TIMEOUT:
                if(this.debug)console.log("state: " + this.state);

                //Get the index of the question in quizQuestions.
                var questionIndex = this.questionArr[this.questionNumber-1];

                //Show the question info where the question used to be.
                this.thisQuestion.text(this.questionResult + "! " + this.quizQuestions[questionIndex].ansInfo);

                //Add a wide column to the row below the answer.
                this.questionCol2 = $("<div>");
                this.questionCol2.addClass("col-md-12");
                this.questionRow2.append(this.questionCol2);

                //Create image object for the gif.
                var image = $("<img src=" + this.quizQuestions[questionIndex].image + ">");
                image.addClass("gif-image");
                this.questionCol2.append(image);

                //Add a canvas for the timer. Cannot be created with JQuery.
                this.questionCan1 = document.createElement("canvas");
                this.questionCan1.classList.add("answer-timer");
                this.questionCol2.append(this.questionCan1);

                this.state = this.gameStates.SHOW_ANSWER;
                this.updateState(playArea);
                break;

            //Start the answer timer.
            case this.gameStates.SHOW_ANSWER:
                if(this.debug)console.log("state: " + this.state);

                var self = this;

                //Callback for expired answer timer.
                var timeUp2 = function()
                {
                    if(self.debug)console.log("Answer timer callback called");
                    self.state = self.gameStates.FADE_OUT_ANSWER;
                    self.updateState(playArea);
                }

                //Instantiate the timer object and start it.
                this.aTimer = new ATimer(this.questionCan1, 50, 5, ATimer.CLOCK_STYLE_0, "transparent", timeUp2);
                this.aTimer.startTimer();
                break;

            //Remove the answer from the display.  Can do fancy fade out stuff here.
            case this.gameStates.FADE_OUT_ANSWER:
                if(this.debug)console.log("state: " + this.state);

                this.questionNumber++; //Move to the next question.
                playArea.empty();      //Prepare to redraw play area.

                if(this.questionNumber <= this.numQuestions)
                {
                    //Move to next state to show the next question.
                    this.state = this.gameStates.FADE_IN_QUESTION;
                    this.updateState(playArea);
                }
                else
                {
                    //Move to next state to end the quiz.
                    this.state = this.gameStates.FADE_IN_PLAY_AGAIN;
                    this.updateState(playArea);
                }
                break;

            //Show the play again display.
            case this.gameStates.FADE_IN_PLAY_AGAIN:
                if(this.debug)console.log("state: " + this.state);

                //Play end game sound.
                this.audEndQuiz.play();

                //Display Movie Mania Quiz Game.
                this.questionRow1 = $("<h3>");
                this.questionRow1.addClass("pb-4 mb-3");
                this.questionRow1.text("Movie Mania Quiz Game");
                $("#main-container").append(this.questionRow1);

                //Display the player's results.
                this.questionRow2 = $("<h2>");
                this.questionRow2.addClass("pb-4 mb-3");
                this.questionRow2.html("You have completed the movie quiz! Here are your results:" +
                                       "<br>Correct: "   + this.correct   +
                                       "<br>Incorrect: " + this.incorrect +
                                       "<br>Timed out: " + this.timeOut);
                $("#main-container").append(this.questionRow2);

                this.state = this.gameStates.PLAY_AGAIN;
                this.updateState(playArea);
                break;

            //Reset the variables.
            case this.gameStates.PLAY_AGAIN:
                if(this.debug)console.log("state: " + this.state);

                var self = this;
 
                //Event listener for play again button.
                var playAgain = function()
                {
                    self.state = self.gameStates.FADE_OUT_PLAY_AGAIN;
                    self.updateState(playArea);
                }

                //Add play again button to the display. Reuse an existing variable.
                this.questionCol1 = $("<input>");
                this.questionCol1.addClass("btn btn-primary");
                this.questionCol1.attr("id", "play-again");
                this.questionCol1.attr("type", "button");
                this.questionCol1.attr("value", "Play Again");
                $("#main-container").append(this.questionCol1);
                
                //Add event listener to button.
                this.questionCol1.on("click", playAgain);
                break;

            //Reset the game stats.
            case this.gameStates.FADE_OUT_PLAY_AGAIN:
                if(this.debug)console.log("state: " + this.state);

                //Reset the score and question variables.
                this.correct = 0;
                this.incorrect = 0;
                this.timeOut = 0;
                this.questionNumber = 1;

                //Clear the game area.
                $("#main-container").empty();

                //Start again!
                this.state = this.gameStates.IDLE;
                this.updateState(playArea);
                break;

            //Should never get here.
            default:
                if(this.debug)console.log("invalid-state");
                break;
        }
    }

    //Generate a quantity of random numbers between 0 and randRange-1.
    //Return the array of random numbers. All unique numbers.
    genRandNums(randRange, quantity)
    {
        var randArr = [];

        for(let i = 0; i < quantity; i++)
        {
            var isDuplicate = true;
            while(isDuplicate)
            {
                var rand = Math.floor(Math.random() * randRange);
                if(!randArr.includes(rand))
                {
                    isDuplicate = false;
                }
            }
            //Save the random number in the array.
            randArr.push(rand);
        }

        return randArr;
    }
} //End QuizGame class.

/******************************************* Top Level *******************************************/
quizGame = new QuizGame(12); //Create a QuizGame object with 12 questions.

$(document).ready(function()
{ 
    //Bind start game button.
    $('#start').on('click', startGame);
});

//Start the game after the "start game" button is pressed.
function startGame()
{
    quizGame.updateState($('#main-container'));
}
