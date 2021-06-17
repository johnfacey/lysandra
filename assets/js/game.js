var Game = {
    config: {
        phase: 1,
        firstMatch: "",
        secondMatch: "",
        inPhase: false,
        music: 1,
        clickActive: false,
        audioPath: "assets/audio/",
        imagePath: "assets/images/",
        time: 0,
        score: 0,
        miss: 0,
        timer: "",
        totalTiles: 16,
        backgroundMusic: ""
    },
    successArray: [
        "Good Job",
        "Great Match",
        "Nice!",
        "Your a Pro"
    ],
    errorArray: [
        "Not quite right",
        "Try Again",
        "So Close",
        "Come on you can do it",
        "Good Try",
        "Almost got it that time"
    ],
    assets: [
        'img/asset1.png',
        'img/asset2.png',
        'img/asset3.png',
        'img/asset4.png'
    ],
    tick: function () {
        Game.timer = setTimeout(() => {
            document.querySelector("#timer").innerHTML = "Time " + Game.config.time++;
            Game.tick();
        }, 1000);
    },
    stopTimer: function () {
        clearTimeout(Game.timer);
    },
    calculateScore: function () {
        Game.config.score -= Game.config.miss;
    },
    addPoints: function (points) {
        Game.config.score += points;
        document.querySelector("#score").innerHTML = "Match " + Game.config.score;
    },
    addMiss: function () {
        Game.config.miss += 1;
        document.querySelector("#miss").innerHTML = "Miss " + Game.config.miss;
    },
    resetPoints: function () {
        Game.config.score = 0;
        document.querySelector("#score").innerHTML = "Match " + Game.config.score;
        Game.leaderboard();
        Game.showPanel("gamePanel");
    },
    resetMiss: function () {
        Game.config.score = 0;
        document.querySelector("#miss").innerHTML = "Miss " + Game.config.miss;
    },
    checkFinish: function () {
        if (document.querySelectorAll('.matchItem[matched="true"]').length === document.querySelectorAll('.matchItem').length) {
            Game.stopTimer();
            Game.calculateScore();
            //Calculate Score

            Swal.fire({
                title: 'Enter Your Initials',
                input: 'text',

                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!'
                    }

                    if (value.length !== 3) {
                        return '3 Characters Only'
                    }
                    Game.saveScore(value.substring(0, 3), Game.config.score);
                    Swal.fire({
                        title: 'You Win!',
                        text: 'You matched all the tiles',
                        imageUrl: 'assets/images/logo.svg',
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: 'Lysandra Match Game',
                    }).then((result) => {
                        Game.showPanel('scorePanel');
                        //}
                    });
                    Game.toast('You Win');
                }
            }).then((result) => {

            })

        }
    },
    getSettings: function () {
        var gameStorage = window.localStorage;
        var settings = gameStorage.getItem('settings');

        if (settings === undefined) {
            settings = {
                "music": 1
            }

        } else {
            settings = JSON.parse(settings);
        }

        if (settings == undefined || settings == null) {
            Game.resumeMusic();
        } else {
            if (settings.music === 1) { //TODO: fix this crash on initial load
                Game.resumeMusic();
            } else {
                Game.pauseMusic();
            }
        }
    },
    saveSettings: function () {
        var gameStorage = window.localStorage;

        var settings = {
            "music": Game.config.music
        }

        var jsonSettings = JSON.stringify(settings);
        gameStorage.setItem('settings', jsonSettings);

    },
    resetLeaderboard: function () {
        var gameStorage = window.localStorage;
        gameStorage.removeItem('scores');
        Game.leaderboard();
    },
    leaderboard: function () {
        document.querySelector('#scoreTable').innerHTML = "";
        var gameStorage = window.localStorage;
        var scores = JSON.parse(gameStorage.getItem('scores'));
        if (gameStorage.length == 0 || scores === null || scores === undefined) {

        } else {
            for (var i = 0; i < scores.length; i++) {
                var scoreTemplate = `<div class="container">
                                        <div class="base-font">${scores[i].name}</div>
                                        <div class="base-font">---</div>
                                        <div class="base-font">${scores[i].value}</div>
                                    </div>`;

                document.querySelector('#scoreTable').insertAdjacentHTML("beforeend", scoreTemplate);
            }
            //alert(scores[0].value)
        }
        Game.showPanel('scorePanel');
    },
    saveScore: function (name, score) {

        var gameStorage = window.localStorage;
        var scores = JSON.parse(gameStorage.getItem('scores'));
        if (scores === undefined) {
            scores = [{
                "name": name,
                "value": score
            }]
        } else {
            scores.push({
                "name": name,
                "value": score
            });
        }

        if (scores.length < 11) {

        } else {
            scores.sort(function (a, b) {
                return a.value - b.value;
            });
            while (scores.length > 10) {
                scores = scores.pop();
            }
        }

        var jsonScores = JSON.stringify(scores);
        gameStorage.setItem('scores', jsonScores);

    },
    showPanel: function (panelName) {
        var panels = document.querySelectorAll(".panel");
        for (var i = 0; i < panels.length; i++) {
            panels[i].style.display = 'none';
        }
        document.querySelector("#" + panelName).style.display = 'block';
        if (panelName === "gamePanel") {
            document.querySelector("footer").style.display = 'block';
        }
    },
    toast: function (message) {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");
        x.innerHTML = message;
        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 3000);
    },
    playMusic: function (audioName) {
        Game.config.backgroundMusic = document.createElement('audio');
        Game.config.backgroundMusic.volume = 0.3;
        Game.config.backgroundMusic.loop = true;
        Game.config.backgroundMusic.src = Game.config.audioPath + audioName + ".mp3";
        Game.config.backgroundMusic.addEventListener("canplaythrough", () => {
            Game.config.backgroundMusic.play();
        }, false);
    },
    pauseMusic: function () {
        Game.config.backgroundMusic.pause();
        document.querySelector('#musicButton').setAttribute("src", Game.config.imagePath + "music-off.svg");
    },
    resumeMusic: function () {
        Game.config.backgroundMusic.play();
        document.querySelector('#musicButton').setAttribute("src", Game.config.imagePath + "music-on.svg");
    },
    playSound: function (audioName) {
        var audio = document.createElement('audio');
        audio.volume = 0.3;
        audio.src = Game.config.audioPath + audioName + ".mp3";
        audio.addEventListener("canplaythrough", () => {
            audio.play();
        }, false);
    },
    toggleMusic: function () {
        if (Game.config.music === 1) {
            Game.config.music = 0;
            Game.pauseMusic();
            Game.saveSettings();
            return;
        }
        if (Game.config.music === 0) {
            Game.config.music = 1;
            Game.resumeMusic();
            Game.saveSettings();
            return;
        }
    },
    resetState: function () {
        for (var i = 0; i < Game.itemSet.length; i++) {
            if (Game.itemSet[i].getAttribute("matched") !== "true") {
                Game.itemSet[i].innerHTML = "<img src='" + Game.config.imagePath + "treasure.svg'/>";
            }
        }
        Game.config.phase = 1;
        Game.config.inPhase = false;
        var errorMessage = Game.errorArray[Math.floor(Math.random() * (Game.errorArray.length - 1))];
        Game.toast(errorMessage);
    },
    shuffle: function (array) {

        var currentIndex = array.length;
        var temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;

    },


    start: function () {

        Game.config.phase = 1;
        Game.config.firstMatch = "";
        Game.config.secondMatch = "";
        Game.config.inPhase = false;
        Game.config.music = 1;
        Game.config.time = 0;
        Game.config.score = 0;
        Game.config.miss = 0;
        Game.resetPoints();
        Game.resetMiss();
        Game.tick();
        Game.matchingGridOrigin = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
        // matchingGrid = [];
        Game.itemSet = [];
        Game.matchingGrid = Game.shuffle(Game.matchingGridOrigin);
        Game.itemTypes = [0, 1, 2, 3, 4, 5];

        Game.itemSet = document.getElementsByClassName('matchItem');
        var tileSet = ["sword", "axe", "gem", "key", "bomb", "shield", "diamond", "potion"];

        for (var i = 0; i < Game.itemSet.length; i++) {

            Game.itemSet[i].innerHTML = "<img src='" + Game.config.imagePath + "treasure.svg'/>";
            Game.itemSet[i].setAttribute("matched", "false");
            Game.itemSet[i].setAttribute("pic", tileSet[Game.matchingGrid[i]]);

            if (Game.config.clickActive === false) {
                Game.itemSet[i].addEventListener("click", function () {
                    if (this.getAttribute("matched") === "true" || this.querySelector('img').getAttribute("src").indexOf('treasure') === -1) {
                        Game.playSound('error');
                        Game.config.phase = 1;
                        return;
                    } else {
                        Game.playSound('scribble');
                    }
                    Game.config.inPhase = true;
                    this.innerHTML = "<img src='" + Game.config.imagePath + this.getAttribute("pic") + ".svg'/>";

                    if (Game.config.phase === 1) {
                        Game.config.firstMatch = this;
                        Game.config.phase = 2;
                    } else {


                        //second match 
                        Game.config.secondMatch = this;
                        //compare
                        var value1 = Game.config.firstMatch.getAttribute("pic");
                        var value2 = Game.config.secondMatch.getAttribute("pic");
                        if (value1 === value2) {
                            //these pairs have match
                            Game.config.firstMatch.setAttribute("matched", "true");
                            Game.config.secondMatch.setAttribute("matched", "true");
                            Game.playSound('success');
                            var successMessage = Game.successArray[Math.floor(Math.random() * (Game.successArray.length - 1))];
                            Game.toast(successMessage);
                            Game.addPoints(10);
                            Game.config.phase = 1;
                        } else {
                            //did not match 
                            //var errorMessage = Game.errorArray[Math.floor(Math.random() * (Game.errorArray.length-1))];
                            
                            setTimeout(() => {
                                FreezeUI({
                                    text: 'Matching'
                                });
                            }, 250);


                            setTimeout(() => {
                                UnFreezeUI(); //Call this anywhere and the UI will UnFreeze.
                                setTimeout(Game.resetState(), 3000);
                            }, 750);
                            //setTimeout(Game.resetState(), 3000);
                            Game.addMiss();

                        }

                    }

                    if (Game.config.phase >= 2) {
                        //Game.config.phase = 1;
                    } else {
                        //Game.config.phase = 2;
                    }
                    Game.config.inPhase = false;
                    Game.checkFinish();


                })
            } //end false check
        }
        Game.config.clickActive = true;
    }
}