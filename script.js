// CONTENT DISPLAY FUNCTIONS 


document.addEventListener('DOMContentLoaded', () => {
// PLAYER DETAILS AND MODE
    const gameSetupDiv = document.getElementById('game_setup');
    const gameModeDiv = document.getElementById('mode_setup');
    const playerNamesDiv = document.querySelector('.player_name_input');
    //const playerTwoDiv = document.getElementsByID('player2_names');
    // the queryselector for next button will decide which to display

    //const gameModeRadios = document.querySelectorAll('input[name="game_mode"]');
    // not necessary because we are targeting each indivisually
    
    const singlePlayerRadio = document.getElementById('single_player');
    const playComputerRadio = document.getElementById('play_computer');
    const oneMorePlayerRadio = document.getElementById('one_more_player');

    const playerOneNameInput = document.getElementById('player1_names');
    const playerTwoNameInput = document.getElementById('player2_names');

    let player1Name = "";
    let gameMode = 'single'; // Default for single player
    let player2Name = 'Computer'; // Default for playing with the computer

    // NEXT BUTTON FUNCTIONS
    document.querySelector('#mode_setup .next').addEventListener('click', () => {
        if (singlePlayerRadio.checked) {
            gameMode = 'single';
            playerTwoNameInput.style.display = 'none';
        }else if (playComputerRadio.checked) {
            gameMode = 'computer';
        }else if (oneMorePlayerRadio.checked) {
            gameMode = 'another_player';
            playerTwoNameInput.style.display = 'block';
        }
        
        gameModeSetup.style.display = 'none';
        playerNamesDiv.style.display = 'block';
    });

    document.querySelector('.player_name_input .next').addEventListener('click', () => {
        // Retrieve player names
        player1Name = document.getElementById('player1_name').value || 'Player 1';
        player2Name = (gameMode === 'another_player') ? (document.getElementById('player2_name').value || 'Player 2') : 'Computer';
        
        playerNamesDiv.style.display = 'none';
        gameInfo.style.display = 'block';

        // Set default turn message
        document.getElementById('current-turn').textContent = `Turn: ${player1Name}`;
       
        // Initialize the game board
        initGameBoard(); // to create game board initialising function
    });

    


}


/// TO BE CORRECTED !!!!
// GAME STATS
const gameInfo = document.getElementById('game_info');

const gameStatus = document.getElementById('game_status');
const gameBoard = document.getElementById('game_board');


const playButton = document.getElementById('start_game');
const quitButton = document.getElementById('quit_game');
const playerTurn = document.getElementById('current_turn');
const playMoves = document.getElementById('moves');
const gameHint = document.getElementById('hints');
const score = document.getElementById('score');

// GAME BOARD 

let currentPlayerTurn = 1;
let scorePoints = 0;
let movesLeft = 20;

// EVENT LISTERNER
//gameModeRadios.array.forEach(radio => {
  //  radio.addEventListener('change', updateGameMode);
//});


//playButton.addEventListener('click', playGameButton);




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

