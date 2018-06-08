/**********************************************
*Author: Baruch Flores                        *
*Homework 3: JavaScript Assignment            *
*UCB Extension - Full-Stack Bootcamp          *
*June 2018                                    *
***********************************************/


//Global HTML handlers
var wins = document.getElementById("wins");
var losses = document.getElementById("losses");
var currentWord = document.getElementById("currentWord");
var guessesRemaining = document.getElementById("guessesRemaining");
var guessedLetters = document.getElementById("guessedLetters");
var wineCard = document.getElementById("wineCard");
var bgAudio = document.getElementById("bgAudio");
var welcome = document.getElementById("welcome");
var enterGame = document.getElementById("enterGame");
var restartGame = document.getElementById("restartGame");


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
    wine: {
        img: ["riesling.png", "gewurztraminer.png", "chardonnay.png", "sauvignon_blanc.png", "syrah.png", "cabernet_sauvignon.png", "pinot_noir.png", "merlot.png", "zinfandel.png"],
        text: [
            "Lighter than Chardonnay. The aromas generally include fresh apples. The German varietal is usually made slightly sweet with steely acidity for balance.",
            "Fruity flavours with aromas of rose petal, peach, lychee, and allspice. It often appears not as refreshing as other kinds of dry whites.",
            "Often wider-bodied (and more velvety) than other types of dry whites, with rich citrus (lemon, grapefruit) flavours. Fermenting in new oak barrels adds a buttery tones.",
            "It normally shows a herbal character suggesting bell pepper or freshly mown grass. The dominating flavours range from sour green fruits of apple, pear and gooseberry through to tropical fruits of melon, mango and blackcurrant",
            "Aromas and flavors of wild black-fruit (such as blackcurrant), with overtones of black pepper spice and roasting meat. The abundance of fruit sensations is often complemented by warm alcohol and gripping tannins.",
            "Widely accepted as one of the world’s best varieties. Full-bodied, but firm and gripping when young. With age, rich currant qualities change to that of pencil box. Bell pepper notes remain.",
            "The structure is delicate and fresh. The tannins are very soft; this is related to the low level of polyphenols. The aromatics are very fruity (cherry, strawberry, plum), often with notes of tea-leaf, damp earth, or worn leather.",
            "Key player in the Bordeaux blend. Black-cherry and herbal flavours are typical. The texture is round but a middle palate gap is common.",
            "Perhaps the world’s most versatile wine grape, making everything from blush wine to rich, heavy reds. Often a zesty flavor with berry and pepper."
        ]
    },

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
        this.currentWord = this.currentWord.padStart(this.selectedWord.length, "-");
        for (var i = 0; i < this.selectedWord.length; i++) {
            if (this.selectedWord[i] == " ") {
                this.currentWord = this.currentWord.substring(0, i) + " " + this.currentWord.substring(i + 1);
            }
        }
        this.guessedLetters = [];
        this.key = "";
        this.lives = 12;
    },

    //Restarts Hangman to original values (game restart)
    restart: function() {
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
        guessedLetters.textContent = this.guessedLetters.toString();
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
        guessedLetters.textContent = Hangman.guessedLetters;

        // -> check if the letter matches any character in the selected word
        var indexArr = Hangman.isAMatch();
        if (indexArr.length) {
            // If so, show the letters in current word
            Hangman.updateCurrentWord(indexArr);
            currentWord.textContent = Hangman.currentWord;
            // -> if the word is complete, user wins and game is restarted
            if (Hangman.isWordComplete()) {
                Hangman.wins += 1;
                wins.textContent = Hangman.wins;
                currentWord.style = "animation: blinker 2s linear infinite;";
                wineCard.style = "animation: disappear 1s forwards;"
                // alert("You are a hero! You saved the Hangman");
                window.setTimeout(function () {
                    currentWord.style = "";
                    startGame();
                }, 2000);

                // debugger;
            }
        }
        else {
            //if false, decrease lives by 1 and check if not alive
            if (!--Hangman.lives) {
                Hangman.losses++;
                losses.textContent = Hangman.losses;
                losses.style = "animation: blinker 1s linear infinite;";
                currentWord.style = "animation: blinker 2s linear infinite; color: red";
                wineCard.style = "animation: disappear 1s forwards;"
                // alert("Ohh no.. hangman is dead!");
                window.setTimeout(function () {
                    losses.style = "";
                    currentWord.style = "";
                    // wineCard.style = "animation: disappear 1s forwards;"
                    startGame();
                }, 2000);
            }
            else {
                guessesRemaining.textContent = Hangman.lives;
            }
        }
    }
    else
        alert("You already guessed that letter!");
};

//Plays music once welcome screen is accepted
enterGame.onclick = function () {
    bgAudio.play();
}

// Initializes HTML dynamic content
function initHtml() {
    wins.textContent = Hangman.wins;
    losses.textContent = Hangman.losses;
    currentWord.textContent = Hangman.currentWord;
    guessesRemaining.textContent = Hangman.lives;
    guessedLetters.textContent = Hangman.guessedLetters;
    wineBottle.src = "assets/images/" + Hangman.wine.img[Hangman.index];
    wineText.textContent = Hangman.wine.text[Hangman.index];
    wineCard.style = "animation: appear 2s forwards;"
}

//Full game restart
restartGame.onclick = function () {
    Hangman.restart();
    initHtml();
}


function startGame() {
    Hangman.initialize();
    initHtml();
}

//Bootstrap: Initialize  popovers
$(function () {
    $('[data-toggle="popover"]').popover()
})

//Manually triggers via JS the Bootstrap modal
welcome.click();

startGame();