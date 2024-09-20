const gameInfo = document.getElementById('game_info');
const gameSetup = document.getElementById('game_setup');
const gameStatus = document.getElementById('game_status');
const gameBoard = document.getElementById('game_board');
const playerOneNameInput = document.getElementById('player1_names');
const playerTwoNameInput = document.getElementById('player2_names');
const playerTwoDiv = document.getElementsByID('player2_names');
const playButton = document.getElementById('start_game');
const quitButton = document.getElementById('quit_game');
const playerTurn = document.getElementById('current_turn');
const playMoves = document.getElementById('moves');
const gameHint = document.getElementById('hints');
const score = document.getElementById('score');

const gameModeRadios = document.querySelectorAll('input[name="game_mode"]');
let player1Name = "";
let player2Name = "";
let gameMode = 'single'; // Default to a single player
let currentPlayerTurn = 1;
let scorePoints = 0;
let movesLeft = 20;

// EVENT LISTERNER
gameModeRadios.array.forEach(radio => {
    radio.addEventListener('change', updateGameMode);
});

function updateGameMode(){
    gameMode = document.querySelector('input[name="game_mode"]:checked').value;
    if (gameMode === 'another_player'){
        playerTwoDiv.style.display = 'block';
    } else {
        playerTwoDiv.style.display ='none';
    }
}

playButton.addEventListener('click', playGameButton);

function playGameButton(){
    player1Name = playerOneNameInput.value || 'Player 1';
    player2Name = gameMode === 'another_player' ? (playerTwoNameInput.value || 'Player 2') : 'Computer';

    // HIDE THE NAME INPUT SCREEN AND SHOW GAME SCREEN INFO
    gameInfo.style.display = 'block';
    gameSetup.style.display = 'none';

    //UPDATE THE GAME STATISTIC SCREEN
    updatePlayerTurn();
    updateScore();
    updatePlayerMoves();
}

function updatePlayersTurn(){
    if(gameMode === 'single'){
        currentPlayerTurn.textContent = "Turn: ${player1Name}"; 
    } else{
        if (currentPlayerTurn === 1){
            currentPlayerTurn.textContent = "Turn: ${player2Name}";
        }
    }
}

gameHint.addEventListener('click', showHint);

function showHints(){
    console.log('Hint clicked!');
}

function updateScorePoints(){
    score.textContent = "Score: ${scorePoints}";
}

function updateMovesLeft(){
    playMoves.textContent = "Moves left: ${movesLeft}";
}

// SWITCH BETWEEN TWO PLAYERS
function switchTurns () {
    if(gameMode !== 'single'){
        currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
        updateMovesLeft();
    }
}

// RESET THE GAME STATISTICS
function resetGame(){
    score = 0;
    movesLeft = 20;
    currentPlayerTurn = 1;
    updateScorePoints();
    updateMovesLeft();
    updatePlayerTurn();
}
