/**********************************************
*Author: Baruch Flores                        *
*Homework 3: JavaScript Assignment            *
*UCB Extension - Full-Stack Bootcamp          *
*June 2018                                    *
***********************************************/


//Hangman Object
var Hangman = {
    listOfWords: ["riesling", "gewurztraminer", "chardonnay", "sauvignon blanc", "syrah", "cabernet sauvignon", "pinot noir", "merlot", "zinfandel"],
    selectedWord: "",
    currentWord: "",    //word that is being guessed
    guessedLetters: [],
    index: 0,           //used to select a word from the list of words
    key: "",            //key pressed by the user
    lives: 12,          //remaining user attempts
    wins: 0,            //total game wins
    losses: 0,          //total game losses

    //gets the length of list of words
    get length() {
        return this.listOfWords.length;
    },

    //Initializes Hangman properties for a new game
    initialize: function () {
        this.index = Math.floor(Math.random() * this.length);
        this.selectedWord = this.listOfWords[this.index];
        console.log(this.selectedWord);
        this.currentWord = "";
        this.currentWord = this.currentWord.padStart((this.selectedWord).length, "-");
        this.guessedLetters = [];
        this.key = "";
        this.lives = 12;
    },

    //Restarts Hangman to original values (game restart)
    restart: () => {
        this.initialize();
        this.wins = 0;
        this.losses = 0;
    },

    // Checks if user had already guessed that letter
    isInGuessedLetters: function () {
        //if letter is guessed, return true, else false
        var list = this.guessedLetters.filter(el => el === this.key.toLowerCase());
        if (list.length)
            return true;
        else
            return false;
    },

    //Updates guessed letters
    updateGuessedLetters: function () {
        this.guessedLetters.push(this.key);
        document.getElementById("guessedLetters").textContent = this.guessedLetters.toString();
    },

    //Returns an array of indexes that matched the key pressed, or empty array if no match
    isAMatch: function () {
        var charPos = [];
        var index = 0;

        while ((index = this.selectedWord.indexOf(this.key, index)) > -1) {
            charPos.push(index);
            index++;
        }
        return charPos;
    },

    //Updates currentWord revealing the new matched letters. Receives the indexes to be revealed
    updateCurrentWord: function (indexArr) {
        indexArr.forEach(element => {
            this.currentWord = this.currentWord.substring(0, element) + this.key + this.currentWord.substring(element + 1);
        });
    },

    //checks if the word is complete by searching any remaining dashes in current word
    isWordComplete: function () {
        if (/-/.test(this.currentWord))
            return false;
        else
            return true;
    }
};

// If user presses any key
document.onkeypress = function (event) {
    Hangman.key = event.key.toLowerCase();
    //if key has not been guessed before
    if (!Hangman.isInGuessedLetters()) {
        Hangman.updateGuessedLetters();
        document.getElementById("guessedLetters").textContent = Hangman.guessedLetters;

        // -> check if the letter matches any character in the selected word
        var indexArr = Hangman.isAMatch();
        if (indexArr.length) {
            // If so, show the letters in current word
            Hangman.updateCurrentWord(indexArr);
            document.getElementById("currentWord").textContent = Hangman.currentWord;
            // -> if the word is complete, user wins and game is restarted
            if (Hangman.isWordComplete()) {
                Hangman.wins += 1;
                document.getElementById("wins").textContent = Hangman.wins;
                // alert("You are a hero! You saved the Hangman");
                startGame();
            }
        }
        else {
            //if false, decrease lives by 1 and check if not alive
            if (!--Hangman.lives) {
                Hangman.losses++;
                document.getElementById("losses").textContent = Hangman.losses;
                // alert("Ohh no.. hangman is dead!");
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


function startGame() {
    Hangman.initialize();
    initHtml();
}


// Initializes HTML dynamic content
function initHtml() {

    document.getElementById("wins").textContent = Hangman.wins;
    document.getElementById("losses").textContent = Hangman.losses;
    document.getElementById("currentWord").textContent = Hangman.currentWord;
    document.getElementById("guessesRemaining").textContent = Hangman.lives;
    document.getElementById("guessedLetters").textContent = Hangman.guessedLetters;
}

startGame();