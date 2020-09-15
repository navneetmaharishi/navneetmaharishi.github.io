var scores, roundScore, activePlayer, diceDOM, isPlay, preDiceVal;

diceDOM = document.querySelector('.dice');
init();

function init() {
    isPlay = true;
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    preDiceVal = 0;
    diceDOM.style.display = "none";

    document.getElementById('name-0').textContent = "Player 1";
    document.getElementById('name-1').textContent = "Player 2";
    document.getElementById('current-0').textContent = "0";
    document.getElementById('current-1').textContent = "0";
    document.getElementById('score-0').textContent = "0";
    document.getElementById('score-1').textContent = "0";

    document.querySelector('.player-0-panel').classList.remove("winner");
    document.querySelector('.player-1-panel').classList.remove("winner");
    document.querySelector('.player-0-panel').classList.remove("active");
    document.querySelector('.player-0-panel').classList.add("active");
    document.querySelector('.player-1-panel').classList.remove("active");
}

document.querySelector('.btn-new').addEventListener('click', init);

document.querySelector('.btn-roll').addEventListener('click', function () {
    if (isPlay) {
        var diceVal = Math.floor(Math.random() * 6) + 1;
        diceDOM.style.display = "block";
        diceDOM.src = "assets/images/dice-" + diceVal + ".png";

        if (preDiceVal === 6 && diceVal === 6) {
            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
            nextPlayer();
        } else if (diceVal !== 1) {
            roundScore += diceVal;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
            preDiceVal = diceVal;
        } else {
            nextPlayer();
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (isPlay) {
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        var input = document.getElementById('maxScore').value;
        var maxScore;

        input ? maxScore = input : maxScore = 100;

        if (scores[activePlayer] >= maxScore) {
            document.getElementById('name-' + activePlayer).textContent = "Winner";
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove("active");
            document.querySelector('.player-' + activePlayer + '-panel').classList.add("winner");
            diceDOM.style.display = "none";
            isPlay = false;

        } else {
            nextPlayer();
            preDiceVal = 0;
        }
    }
});

function nextPlayer() {
    preDiceVal = 0;
    roundScore = 0;
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    document.getElementById('current-0').textContent = "0";
    document.getElementById('current-1').textContent = "0";
    document.querySelector('.player-0-panel').classList.toggle("active");
    document.querySelector('.player-1-panel').classList.toggle("active");
    diceDOM.style.display = "none";
}

