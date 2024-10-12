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
    // Radio selections variables 
    const gameModeDiv = document.getElementById('mode_setup');
    const singlePlayerRadio = document.getElementById('single_player');
    const playComputerRadio = document.getElementById('play_computer');
    const oneMorePlayerRadio = document.getElementById('one_more_player');
    // Name input variables
    const playerNamesDiv = document.getElementById('player_name_input');
    const playerOneNameInput = document.getElementById('player1_name');
    const playerTwoNameInput = document.getElementById('player2_name');
    const playerTwoDiv = document.getElementById('player2_names');
    // Welcome message variable
    const welcomeMsgDiv = document.getElementById('welcome_msg');
    // Game board variables
    const gameInfo = document.getElementById('game_info');
    const gameStatus = document.getElementById('game_status');
    const gameBoard = document.getElementById('game_board');

    // On section load content to be hidden
    playerNamesDiv.style.display = 'none';
    welcomeMsgDiv.style.display = 'none';
    gameInfo.style.display = 'none';

    let player1Name = "";
    // Default for single player
    let gameMode = 'single'; 
    // Default for playing with the computer
    let player2Name = 'Computer'; 

    // Player mode selection options
    document.querySelector('#mode_setup .next_btn').addEventListener('click', () => {
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
        // Hiding and displaying relevant content
        gameModeDiv.style.display = 'none';
        playerNamesDiv.style.display = 'block';
    });

    // On click event 
    playerNamesDiv.querySelector('.next_btn').addEventListener('click', () => {
        // Retrieve player names based on the player input
        player1Name = playerOneNameInput.value.trim();
        player2Name = playerTwoNameInput.value.trim();

        if (!player1Name) {
            alert("Enter a name for Player 1.");
            return;
        }

        if (gameMode === "another_player") {
            if (!player2Name) {
                alert("Enter a name for Player 2.");
                return;
            }
            // Make sure the player input two different naames
            if (player1Name.toLowerCase() === player2Name.toLowerCase()) {
                alert("Player 1 and Player 2 cannot have the same name. Choose different names.");
                return; 
            }
        } else if (gameMode === "single" || gameMode === "computer") {
            player2Name = "Computer";
        }

        // Update welcome message with player names and set to the selected mode 
        if (gameMode === 'single') {
            document.getElementById('welcome').textContent = `Welcome, ${player1Name}!`;
        } else if (gameMode === 'computer') {
            document.getElementById('welcome').textContent = `Welcome, ${player1Name} vs Computer!`;
        } else {
            document.getElementById('welcome').textContent = `Welcome, ${player1Name} vs ${player2Name}!`;
        }
        
        playerNamesDiv.style.display = 'none';
        welcomeMsgDiv.style.display = 'block';
        
        // If it is only one player playing skip everything
        if (gameMode === 'single') {
            welcomeMsgDiv.querySelector('.next_btn').style.display = 'block';
            document.getElementById('many_playermsg').style.display = 'none';
        }  else {
            document.getElementById('many_playermsg').style.display = 'block'; 
        }

    });

    welcomeMsgDiv.querySelector('.next_btn').addEventListener('click', () => {
        if (gameMode !== 'single') {
            const player1Turn = document.getElementById('player1_turn').checked;
            const currentTurn = player1Turn ? player1Name : player2Name;
            document.getElementById('current_turn').textContent = `${currentTurn}'s Turn`; 
        } else {
            document.getElementById('current_turn').textContent = `${player1Name}'s Playing`;
        }
    
        welcomeMsgDiv.style.display = 'none';
        gameInfo.style.display = 'block';

        // Initialize the game board
        initGameBoard(); 
    });


    // GAME FUNCTIONS
    // Decalring variables
    let currentLevel = 1; 
    let movesLeft = 8;   
    let totalScore = 0;
    let matchedPairs = 0;
    let flippedCards = [];
    let timerInterval;
    let playerTime = 0;  

    function initGameBoard(){
        // Grid size created based on game level 4x4, 6x6 and 8x8
        const gridSize = currentLevel === 1 ? 4 : currentLevel === 2 ? 6 : 8;
        movesLeft = currentLevel === 1 ? 8 : currentLevel === 2 ? 12 : 16;
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; 
        
        //To clear out any content
        gameBoard.innerHTML = '';

        const totalTiles = gridSize * gridSize;
        // There can only be 1 pair of cards per each grid board
        const cardValues = generateCardPairs(totalTiles / 2);
        let shuffledCards = shuffle(cardValues);

        // Create the tiles
        shuffledCards.forEach(value => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.value = value;

            // Hide the card value
            tile.textContent = '?';  

            tile.addEventListener('click', () => handleTileClick(tile));
            gameBoard.appendChild(tile)
        });
        
        matchedPairs = 0; 
        // Update  the game moves and hint
        document.getElementById('moves').textContent = `Moves: ${movesLeft}`;
        document.getElementById('hints').textContent = `Hints: ${hintsLeft}`;
        // Start the timer
        startTimer();  
    }

    function handleTileClick(tile) {
        tile.textContent = Math.floor(Math.random() * 16); 
    }
    

    //document.getElementById('play_game').addEventListener('click', () => {
      //  initGameBoard(); 
    //});

   // document.getElementById('quit_game').addEventListener('click', () => {
     //   gameStatus.style.display = 'none';
       // gameBoard.style.display = 'none';  
    //});

});