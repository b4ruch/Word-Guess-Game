
/**********************************************
*Author: Baruch Flores                        *
*Homework 3: JavaScript Assignment            *
*UCB Extension - Full-Stack Bootcamp          *
*June 2018                                    *
***********************************************/


// Global variable that stores total user wins
var wins = 0;

//Global var that stores total user loses
var losses = 0;

// var winsHtml = document.getElementById("wins");

//Object game with properties like current word, list of words, guessed words, etc
var Hangman = {
    listOfWords: ["doritos", "cheetos", "popcorn", "ruffles", "pringles"],
    index: 0,
    selectedWord: "",
    currentWord: "",
    // guessedLetters: [],
    guessedLetters: ['a', 'b', 'c'],
    key: "s",
    lives: 12,

    // Game Logic here:
    // If user presses any key,
    // Check if user had already guessed that letter
    isInGuessedLetters: function () {
        //if letter is guessed, return true, else false
        var list = this.guessedLetters.filter(el => el === this.key.toLowerCase());
        if (list.length)
            return true;
        else
            return false;
    },
    // ->if not,  update the guessed letters
    updateGuessedLetters: function () {
        this.guessedLetters.push(this.key);
        document.getElementById("guessedLetters").textContent = this.guessedLetters.toString();
    },

    // returns an array of indexes that matched the key pressed, or empty array if no match
    isAMatch: function () {
        var charPos = [];
        var index = 0;

        while ((index = this.selectedWord.indexOf(this.key, index)) > -1) {
            charPos.push(index);
            index++;
        }
        return charPos;
    },

    // updates currentWord showing the new matched letters
    updateCurrentWord: function (indexArr) {
        indexArr.forEach(element => {
            this.currentWord = this.currentWord.substring(0, element) + this.key + this.currentWord.substring(element + 1);
        });

        document.getElementById("currentWord").textContent = this.currentWord;
    },

    //checks if the word is complete by searching any remaining dashes in current word
    isWordComplete: function () {
        if (/-/.test(this.currentWord))
            return false;
        else
            return true;
    }

};

document.onkeypress = function (event) {
    Hangman.key = event.key.toLowerCase();
    //if key has not been guessed before
    if (!Hangman.isInGuessedLetters()) {
        Hangman.updateGuessedLetters();

        // -> check if the letter matches any character in the selected word
        var indexArr = Hangman.isAMatch();
        if (indexArr.length) {
            // If so, show the letters in current word
            Hangman.updateCurrentWord(indexArr);

            // -> if the word is complete, user wins, game is restarted
            if (Hangman.isWordComplete()) {
                wins += 1;
                alert("You are a hero! You saved the Hangman");
                document.getElementById("wins").textContent = wins;
                startGame();
            }
        }
        else {
            //if false, decrease lives by 1 and check if not alive
            if (!--Hangman.lives) {
                losses++;
                alert("Ohh no.. hangman is dead!");
                document.getElementById("losses").textContent = losses;
                startGame();
            }
            else {
                document.getElementById("guessesRemaining").textContent = Hangman.lives;
            }
            
        }
    }
    else
        alert("You already guessed that letter!");
};


// -> if no match, discount 1 to the remaining guesses 
// -> if remaining guesses is less than 1, user loses and game is restarted
//    (show a message or something to indicate this)

function startGame() {
    Hangman.index = Math.floor(Math.random() * (Hangman.listOfWords.length));
    Hangman.selectedWord = Hangman.listOfWords[Hangman.index];
    console.log(Hangman.selectedWord);
    Hangman.currentWord = "";
    Hangman.currentWord = Hangman.currentWord.padStart(Hangman.selectedWord.length, "-");
    Hangman.guessedLetters = [];
    Hangman.key = "";
    Hangman.lives = 12;
    initHtml();
    // don't forget the function to refresh the HTML values
    // debugger;

}


// Initializes HTML dynamic content
function initHtml () {

    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    document.getElementById("currentWord").textContent = Hangman.currentWord;
    document.getElementById("guessesRemaining").textContent = Hangman.lives;
    document.getElementById("guessedLetters").textContent = Hangman.guessedLetters;
}

startGame();