document.addEventListener('DOMContentLoaded', () => {
    // MENU AND CONTENT DISPLAY FUNCTIONS 
    const sections = document.querySelectorAll('section');
    const menuIcon = document.getElementById('menu_icon');
    const dropdownMenu = document.getElementById('dropdown_menu');
    const desktopMenu = document.getElementById('desktop_menu');

    // Hide all the content section on load 
    function hideAllSections() {
        sections.forEach(section => section.style.display = 'none');
    }

    // Only display the relevant called section by ID based on the click event
    function showSection(sectionId) {
        hideAllSections();
        document.getElementById(sectionId).style.display = 'block';
    }

    hideAllSections();
    showSection('home');

    dropdownMenu.style.display = 'none';

    menuIcon.addEventListener('click', () => {
        dropdownMenu.style.display = 'block';
        menuIcon.style.display = 'none';
      });

    dropdownMenu.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.tagName.toLowerCase() === 'a') {
            const sectionId = event.target.getAttribute('href').substring(1);

            showSection(sectionId);
            dropdownMenu.style.display = 'none';
            menuIcon.style.display = 'block';
        }
    });

    desktopMenu.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.tagName.toLowerCase() === 'a') {
            const sectionId = event.target.getAttribute('href').substring(1);

            showSection(sectionId);
            dropdownMenu.style.display = 'none';
            menuIcon.style.display = 'none';
        }
    });


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
    const gameBoard = document.getElementById('game_board');
    const score = document.getElementById('score');
    const playButton = document.getElementById('play');
    const hintButton = document.getElementById('hints');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const quitGame = document.getElementById('exit');
    // After game window display variables
    const resultsDiv = document.getElementById('results');
    const popupLoseDiv = document.querySelector('.popup_lose');
    const popupwinDiv = document.querySelector('.popup_win');

    // On section load content to be hidden
    playerNamesDiv.style.display = 'none';
    welcomeMsgDiv.style.display = 'none';
    gameInfo.style.display = 'none';

    let playerTurnText = document.getElementById('current_turn');
    let player1Name = "";
    // Default for single player
    let gameMode = 'single'; 
    // Default for playing with the computer
    let player2Name = 'Computer'; 
    // Stats variables
    let currentLevel = 1; 
    let gridSize = 0; 
    let movesLeft = 0; 
    let totalScore = 0;
    let hintsLeft = 3;
    let matchedPairs = [];
    let flippedCards = [];
    let playerTime = 0;  
    let timerInterval;
    let gameStarted = false;

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
            // Make sure the player input two different names
            if (player1Name.toLowerCase() === player2Name.toLowerCase()) {
                alert("Player 1 and Player 2 cannot have the same name. Choose different names.");
                return; 
            }
        } else if (gameMode === "single" || gameMode === "computer") {
            player2Name = "Computer";
        }

        // Update welcome message with player names and set to the selected mode 
        if (gameMode === 'single') {
            document.getElementById('welcome').textContent = `Welcome, ${player1Name} to Memory Game!`;
        } else if (gameMode === 'computer') {
            document.getElementById('welcome').textContent = `Welcome, ${player1Name} vs Computer to Memory Game!`;
        } else {
            document.getElementById('welcome').textContent = `Welcome, ${player1Name} vs ${player2Name} to Memory Game!`;
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

        initGameBoard();
    });

    // Moves are based on the grid size
    const gridSizes = {
        4: 20,
        6: 42,
        8: 72
    }; 

    // Shuffle cards before each game
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
            return array;
    }

    // Set the timer on start of game and clear any time before game
    function startTimer() {
        let timeLeft = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft++;
            timeDisplay.textContent = ` ${timeLeft}s`;
        }, 1000);
    }

    // Start the game on the click of play button
    playButton.addEventListener('click', () => {
        gameStarted = true;
        resetGameStatus();
        initGameBoard();
        startTimer();
    });

     // Onclick event for  "Hint" button to flash the cards
     hintButton.addEventListener('click', () => {
        if (!gameStarted) {
            alert("The game has not started yet! Press 'Play' to start.");
        } else {
            const confirmUseHint = confirm("Are you sure you want to use a hint? Only have 3 for whole game!");
            if (confirmUseHint && hintsLeft > 0) {
                hintsLeft--; 
                hintButton.textContent = ` : ${hintsLeft}`;
                flashCardsForTime(1000);
            } else if (hintsLeft === 0) {
                alert("No more hints available.");
            }
        }
    });

    function stopGame() {
        clearInterval(timerInterval);
        gameStarted = false; 

        alert("The game has stopped. You cannot resume it.");
    }

    quitGame.addEventListener('click', () => {
        if (gameStarted) {
            const confirmExit = confirm("Are you sure you want to stop the game? You cannot resume once it's stopped.");
        
        if (confirmExit) {
            stopGame();
        }
    } else {
        alert("The game hasn't started yet.");
    }
});

    // When play button is clicked to start the game
    function resetGameStatus() {
       let gridSize = currentLevel
        // Reset the values to start new game
        movesLeft = gridSizes[gridSize];
        totalScore = 0;
        hintsLeft = 3;

        score.textContent = `Score : ${totalScore}`;
        movesDisplay.textContent  = ` ${movesLeft}`;
        hintButton.textContent = `Hints: ${hintsLeft}`;
        timeDisplay.textContent  = ' 0s'; 
    }

    function initGameBoard(){
        // Grid size created based on game level 4x4, 6x6 and 8x8
        gridSize = currentLevel === 1 ? 4 : currentLevel === 2 ? 6 : 8;
        movesLeft = currentLevel === 1 ? 8 : currentLevel === 2 ? 12 : 16;
        movesLeft = gridSizes[gridSize];
        
        // Stats to be displayed at the display of gameboard
        score.textContent = `Score : ${totalScore}`; 
        movesDisplay.textContent = ` ${movesLeft}`;
        hintButton.textContent = ` : ${hintsLeft}`; 
        timeDisplay.textContent = ` 0s`;

        // Set the grid layout based on the game level
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
    }
    
    // TESTING CARD PAIRS
    function generateCardPairs(numPairs) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let cardValues = [];
    
        for (let i = 0; i < numPairs; i++) {
            cardValues.push(letters[i], letters[i]); 
        }
        return cardValues;
    }
    
    function handleTileClick(tile) {
        // No action for cards if the game has not started yet
        if (!gameStarted) {
            alert("Press 'Play' button, to start the game!");
            return;
        }

        if (tile.textContent === '?') {
            tile.textContent = tile.dataset.value;
            movesLeft--;
    
            // To check is there is any moves
            document.getElementById('moves').textContent = `Moves: ${movesLeft}`;
        }
    }

    // // Display image based on the viewport size
    // function getDeviceType() {
    //     const width = window.innerWidth;
    
    //     if (width <= 768) {
    //         return 'mobile';
    //     } else if (width > 768 && width <= 1024) {
    //         return 'tablet';
    //     } else {
    //         return 'desktop';
    //     }
    // }

});