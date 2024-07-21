$(document).ready(function()
{ 
    //The object that contains all the crystal game variables and methods.
    var crystalGame =
    {
        /*********************************** Object Variables ************************************/
        debug: true,
        crystalImageArray: [],
        crystalValArray: [],
        currentScore: 0,
        targetScore: 0,
        losses: 0,
        wins: 0,

        aud0:    document.createElement("audio"),
        aud1:    document.createElement("audio"),
        audWin:  document.createElement("audio"),
        audLose: document.createElement("audio"),
  
        /*********************************** Object Functions ************************************/
        //Reset the game.
        reset: function()
        {
            this.losses = 0;
            this.wins = 0;
            this.init();

            //Update webpage.
            $('#wins').html('Wins: 0');
            $('#losses').html('Losses: 0');
        },

        //Initialize the variables.
        init: function()
        {
            this.setImages();
            this.setValues();
            this.currentScore = 0;
            this.targetScore = Math.floor(Math.random() * 102) + 19;
            
            //Update webpage.
            $('#target-score').html('Target Score: ' + this.targetScore);
            $('#current-score').html('Your Score: ' + this.currentScore);

            $('#score0').attr('src', 'assets/images/' + this.crystalValArray[0] + '.png');
            $('#score1').attr('src', 'assets/images/' + this.crystalValArray[1] + '.png');
            $('#score2').attr('src', 'assets/images/' + this.crystalValArray[2] + '.png');
            $('#score3').attr('src', 'assets/images/' + this.crystalValArray[3] + '.png');
        },

        //Randomly choose values for each crystal.
        setValues: function()
        {
            //Get a number between 1 and 12 for randomizing crystal value.
            //Make sure there are no duplicates.
            this.crystalValArray = [];
            for(let i = 0; i < 4; i++)
            {
                var isDuplicate = true;
                while(isDuplicate)
                {
                    var rand = Math.floor(Math.random() * 12) + 1;
                    if(!this.crystalValArray.includes(rand))
                    {
                        isDuplicate = false;
                    }
                }
                //Save the random number in the array.
                this.crystalValArray.push(rand);
            }
            if(this.debug)console.log("Crystal values: " + this.crystalValArray);
        },

        //Randomly choose the crystal images.
        setImages: function()
        {
            //Get a number between 0 and 5 for randomizing crystal images.
            //Make sure there are no duplicates.
            this.crystalImageArray = [];
            for(let i = 0; i < 4; i++)
            {
                var isDuplicate = true;
                while(isDuplicate)
                {
                    var rand = Math.floor(Math.random() * 6);
                    if(!this.crystalImageArray.includes(rand))
                    {
                        isDuplicate = false;
                    }
                }
                //Save the random number in the array.
                this.crystalImageArray.push(rand);
            }
            if(this.debug)console.log("Crystal images: " + this.crystalImageArray);

            $('#crystal0').attr('src', 'assets/images/crystal' + this.crystalImageArray[0] + '.png');
            $('#crystal1').attr('src', 'assets/images/crystal' + this.crystalImageArray[1] + '.png');
            $('#crystal2').attr('src', 'assets/images/crystal' + this.crystalImageArray[2] + '.png');
            $('#crystal3').attr('src', 'assets/images/crystal' + this.crystalImageArray[3] + '.png');
        },

        //Play a random crystal sound.
        playSound: function()
        {
            var rand = Math.floor(Math.random() * 2);
            rand ? this.aud0.play() : this.aud1.play();
        },

        //Stop any playing audio.
        stopAudio: function()
        {
            this.aud0.pause();
            this.aud0.currentTime = 0;

            this.aud1.pause();
            this.aud1.currentTime = 0;

            this.audWin.pause();
            this.audWin.currentTime = 0;

            this.audLose.pause();
            this.audLose.currentTime = 0;
        }
    };

    /************************************ Web Page Functions *************************************/
   
    //Initial function run when page is loaded.
    $(function ()
    {
        crystalGame.aud0.setAttribute("src", "./assets/sounds/crystal0.mp3");
        crystalGame.aud1.setAttribute("src", "./assets/sounds/crystal1.mp3");
        crystalGame.audWin.setAttribute("src", "./assets/sounds/win.mp3");
        crystalGame.audLose.setAttribute("src", "./assets/sounds/lose.mp3");
        crystalGame.reset();
    });
 
    //Bind crystal button click.
    $('.gem-btn').on('click', clickCrystal);
    
    //Function bound to crystal click.
    function clickCrystal()
    {
        //Unbind function to wait for animation to complete.
        $('.gem-btn').off('click');

        //Stop any playing audio.
        crystalGame.stopAudio();

        var id = $(this).attr('value');
        var reInit = false;

        //Animate the crystals.
        animateScore(id);

        //Update the player's score.
        crystalGame.currentScore += crystalGame.crystalValArray[id];
        $('#current-score').html('Your Score: ' + crystalGame.currentScore);

        //Check if the player won this round.
        if(crystalGame.currentScore === crystalGame.targetScore)
        {
            crystalGame.wins++;
            $('#wins').html('Wins: ' + crystalGame.wins);
            $('#wins').css('color', '#00ff00');
            $('#wins').animate({fontSize: '30px'}, 100);
            $('#wins').animate({fontSize: '22px'}, 100);
            reInit = true;
            crystalGame.audWin.play();
        }

        //Check if player lost this round.
        else if(crystalGame.currentScore > crystalGame.targetScore)
        {
            crystalGame.losses++;
            $('#losses').html('Losses: ' + crystalGame.losses);
            $('#losses').css('color', '#ff0000');
            $('#losses').animate({fontSize: '30px'}, 100);
            $('#losses').animate({fontSize: '22px'}, 100);
            reInit = true;
            crystalGame.audLose.play();
        }

        crystalGame.playSound();
        
        //Rebind function after animation is done.
        setTimeout(function() 
        {
            $('.gem-btn').on('click', clickCrystal);
            $('#losses').css('color', '#000000');
            $('#wins').css('color', '#000000');

            if(reInit)
            {
                crystalGame.init();
            }
        }, 700);
    }

    //Do some fancy animations after crystal clicked.
    function animateScore(id)
    {
        //Animate buttons.
        $('#crystal' + id).animate({ width: '95%'}, 100);
        $('#crystal' + id).animate({ width: '110%'}, 50);
        $('#crystal' + id).animate({ width: '100%'}, 100);

        //Animate score.        
        $('#score' + id).css('opacity', '1');
        $('#score' + id).animate({top: '-=100px'}, 200);
        $('#score' + id).fadeTo(300, 0);
        $('#score' + id).animate({top: '+=100px'}, 0);
    }

    //Get reset button click.
    $("#reset").on("click", function()
    {
        crystalGame.reset();
    });
});