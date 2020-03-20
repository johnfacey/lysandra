const Game = {
    config: {
        phase: 1,
        firstMatch: "",
        secondMatch: "",
        inPhase: false,
        music: 0,
        clickActive: false,
        audioPath: "assets/audio/",
        imagePath: "assets/images/",
        time: 0,
        score: 0,
        miss: 0,
        timer: ""
    },
    sounds: {

    },
    assets: [
        'img/asset1.png',
        'img/asset2.png',
        'img/asset3.png',
        'img/asset4.png'
    ],
    tick : function() {
        setTimeout(() => {
            document.querySelector("#timer").innerHTML = "Time: "+ Game.config.time++; 
            Game.tick();
        }, 1000);
    },
    addPoints: function(points) {
        Game.config.score += points;
        document.querySelector("#score").innerHTML = "Score: "+ Game.config.score; 
    },
    addMiss: function() {
        Game.config.miss += 1;
        document.querySelector("#smimisssscore").innerHTML = "Miss: "+ Game.config.miss; 
    },
    resetPoints : function() {
        Game.config.score = 0;
        document.querySelector("#score").innerHTML = "Score: "+ Game.config.score; 
    },
    resetMiss : function() {
        Game.config.score = 0;
        document.querySelector("#miss").innerHTML = "Miss: "+ Game.config.miss; 
    },
    playSound: function (audioName) {
        var audio = document.createElement('audio');
        audio.src = Game.config.audioPath + audioName + ".mp3";
        audio.addEventListener("canplaythrough", new function () {
            audio.play();
        }, false);
    },
    toggleMusic: function (audioName) {
        if (Game.config.music == 1) {
            Game.config.music = 0;
            document.getElementById("bgMusic").innerHTML = "";
            return;
        }
        if (Game.config.music == 0) {
            Game.config.music = 1;
            document.getElementById("bgMusic").innerHTML =
                "<embed src='" + Game.config.audioPath + audioName + ".mp3' hidden='true' autostart='true' loop='true' />";
            return;
        }
    },
    resetState: function () {
        for (i = 0; i < itemSet.length; i++) {
            if (itemSet[i].getAttribute("matched") != "true") {
                itemSet[i].innerHTML = "<img src='" + Game.config.imagePath + "treasure.svg' />";
            }
        }
        Game.config.phase = 1;
        Game.config.inPhase = false;
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

        Game.config.phase = 1,
        Game.config.firstMatch = "";
        Game.config.secondMatch = "";
        Game.config.inPhase = false;
        Game.config.music = 0;
        Game.config.time = 0;
        Game.config.score = 0;
        Game.config.miss = 0;
        Game.resetPoints();

        matchingGridOrigin = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
        matchingGrid = [];
        itemSet = [];
        matchingGrid = Game.shuffle(matchingGridOrigin);
        itemTypes = [0, 1, 2, 3, 4, 5];

        itemSet = document.getElementsByClassName('matchItem');

        for (i = 0; i < itemSet.length; i++) {

            itemSet[i].innerHTML = "<img src='" + Game.config.imagePath + "treasure.svg' />";

            itemSet[i].setAttribute("matched", "false");
            if (matchingGrid[i] == 0) {
                itemSet[i].setAttribute("pic", "sword");
            }
            if (matchingGrid[i] == 1) {
                itemSet[i].setAttribute("pic", "axe");
            }
            if (matchingGrid[i] == 2) {
                itemSet[i].setAttribute("pic", "gem");
            }
            if (matchingGrid[i] == 3) {
                itemSet[i].setAttribute("pic", "key");
            }
            if (matchingGrid[i] == 4) {
                itemSet[i].setAttribute("pic", "bomb");
            }
            if (matchingGrid[i] == 5) {
                itemSet[i].setAttribute("pic", "shield");
            }
            //diamond
            if (Game.config.clickActive == false) {
                itemSet[i].addEventListener("click", function () {

                    if (this.getAttribute("matched") == "true" || this.querySelector('img').getAttribute("src").indexOf('treasure') == -1) {
                        Game.playSound('error');
                        return;
                    } else {
                        Game.playSound('scribble');
                    }
                    Game.config.inPhase = true;
                    this.innerHTML = "<img src='" + Game.config.imagePath + this.getAttribute("pic") + ".svg' />";

                    if (Game.config.phase == 1) {
                        Game.config.firstMatch = this;

                    } else {
                        setTimeout(() => {
                            FreezeUI(); 
                        }, 500);
             

                        setTimeout(() => {
                            UnFreezeUI(); //Call this anywhere and the UI will UnFreeze.
                        }, 2000);

                        //second match 
                        Game.config.secondMatch = this;
                        //compare
                        var value1 = Game.config.firstMatch.getAttribute("pic");
                        var value2 = Game.config.secondMatch.getAttribute("pic");
                        if (value1 == value2) {
                            //these pairs have match
                            Game.config.firstMatch.setAttribute("matched", "true");
                            Game.config.secondMatch.setAttribute("matched", "true");
                            Game.playSound('success');
                            Game.addPoints(10);
                        } else {
                            //did not match 
                            setTimeout("Game.resetState()", 1050);
                        }

                    }
                    Game.config.phase++;
                    if (Game.config.phase > 2) {
                        Game.config.phase = 1;
                    }
                    Game.config.inPhase = false;

                    
                })
            } //end false check
        }
        Game.config.clickActive = true;
    }
}