document.addEventListener('DOMContentLoaded', () => {
    // MENU DISPLAY FUNCTIONS 
    const menuIcon = document.getElementById('menu_icon');
    const dropdownMenu = document.getElementById('dropdown_menu');

    dropdownMenu.style.display = 'none';

    menuIcon.addEventListener('click', () => {
        dropdownMenu.style.display = 'block';
        menuIcon.style.display = 'none';
      });

    
   




    // CONTENT DISPLAY FUNCTIONS 

    // PLAYER DETAILS AND MODE
    const gameModeDiv = document.getElementById('mode_setup');
    const playerNamesDiv = document.querySelector('.player_name_input');
    const gameInfo = document.getElementById('game_info');
    const gameStatus = document.getElementById('game_status');
    const gameBoard = document.getElementById('game_board');
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

    function initGameBoard(){
        //To clear out any content
        gameBoard.innerHTML = '';

        const gridSize = 4;
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; 
        
        // Loop to create the 4x4 grid tiles
        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = '?';  
            
            tile.addEventListener('click', () => handleTileClick(tile));

            gameBoard.appendChild(tile);
        };
    }

    function handleTileClick(tile) {
        tile.textContent = Math.floor(Math.random() * 16); 
    };

    document.getElementById('play_game').addEventListener('click', () => {
        initGameBoard(); 
    });

    document.getElementById('quit_game').addEventListener('click', () => {
        gameStatus.style.display = 'none';
        gameBoard.style.display = 'none';  
    });

});