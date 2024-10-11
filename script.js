document.addEventListener('DOMContentLoaded', () => {
    // MENU AND CONTENT DISPLAY FUNCTIONS 
    const sections = document.querySelectorAll('section');

    // Hide all the contecnt section on load 
    function hideAllSections() {
        sections.forEach(section => section.style.display = 'none');
    }

    // Only display the relevant called section by ID based on the click event
    function showSection(sectionId) {
        hideAllSections();
        document.getElementById(sectionId).style.display = 'block';
    }

    const menuIcon = document.getElementById('menu_icon');
    const dropdownMenu = document.getElementById('dropdown_menu');

    dropdownMenu.style.display = 'none';

    menuIcon.addEventListener('click', () => {
        dropdownMenu.style.display = 'block';
        menuIcon.style.display = 'none';
      });

    dropdownMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            const sectionId = event.target.getAttribute('href').substring(1);

            showSection(sectionId);
            dropdownMenu.style.display = 'none';
            menuIcon.style.display = 'block';
        }
    });


    // GAME FUNCTIONS
    const gameModeDiv = document.getElementById('mode_setup');
    const gameInfo = document.getElementById('game_info');
    const playerNamesDiv = document.getElementById('player_name_input');
    const playerOneNameInput = document.getElementById('player1_names');
    const playerTwoNameInput = document.getElementById('player2_names');
    const playerTwoDiv = document.getElementById('player2_names');
    const gameStatus = document.getElementById('game_status');
    const gameBoard = document.getElementById('game_board');
    const welcomeMsg = document.getElementById('welcome_msg');
    const singlePlayerRadio = document.getElementById('single_player');
    const playComputerRadio = document.getElementById('play_computer');
    const oneMorePlayerRadio = document.getElementById('one_more_player');
    
    gameModeDiv.style.display = 'block';
    playerNamesDiv.style.display = 'none';
    welcomeMsg.style.display = 'none';
    gameInfo.style.display = 'none';

    let player1Name = "";
    let gameMode = 'single'; // Default for single player
    let player2Name = 'Computer'; // Default for playing with the computer

    // NEXT BUTTON FUNCTIONS
    gameModeDiv.querySelector('.next_btn').addEventListener('click', () => {
        if (singlePlayerRadio.checked) {
            gameMode = 'single';
            playerTwoDiv.style.display = 'none';
        }else if (playComputerRadio.checked) {
            gameMode = 'computer';
            playerTwoDiv.style.display = 'none';
        }else if (oneMorePlayerRadio.checked) {
            gameMode = 'another_player';
            playerTwoDiv.style.display = 'block';
        }
        
        gameModeDiv.style.display = 'none';
        playerNamesDiv.style.display = 'block';
    });

    playerNamesDiv.querySelector('.next_btn').addEventListener('click', () => {
        // Retrieve player names
        player1Name = playerOneNameInput.value || 'Player One';
        if (gameMode === "another_player") {
            player2Name = playerTwoNameInput.value || "Player Two"; 
        } else if (gameMode == "single" || gameMode === "computer"){
            player2Name = "Computer";
        }
       
        playerNamesDiv.style.display = 'none';
        welcomeMsg.style.display = 'block';

        // Set default turn message

        document.getElementById('welcome').textContent = `Welcome, ${player1Name} and ${player2Name}!`;
        
    });

    welcomeMsg.querySelector('.next_btn').addEventListener('click', () => {
        const player1Turn = document.getElementById('player1_turn').checked; 

        welcomeMsg.style.display = 'none';
        gameInfo.style.display = 'block';

        const currentTurn = player1Turn ? player1Name : player2Name;
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