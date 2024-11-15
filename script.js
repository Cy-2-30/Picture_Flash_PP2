document.addEventListener('DOMContentLoaded', () => {
    // MENU AND CONTENT DISPLAY FUNCTIONS 
    // Menu display variables
    const landingSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const gameSection = document.getElementById('game');
    const formSection = document.getElementById('contact');
    const sections = [landingSection, aboutSection, gameSection, formSection];
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
    const welcomeMessage = document.getElementById('welcome');
    // Div display variables
    playerNamesDiv.style.display = 'none';
    welcomeMsgDiv.style.display = 'none';

    let playerTurnText = document.getElementById('current_turn');
   // let currentPlayer = player1;
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

      //  player1.name = player1Name // Set player name to pull the data 

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
           // player2.name = player2Name;  // Set player name to pull the data 
        } else if (gameMode === "single" || gameMode === "computer") {
            player2Name = "Computer";
        }
        
        // Update welcome message with player names and set to the selected mode 
        if (gameMode === 'single') {
            welcomeMessage.textContent = `Welcome ${player1Name},  to Memory Game!`;
        } else if (gameMode === 'computer') {
            welcomeMessage.textContent = `Welcome ${player1Name} vs Computer, to Memory Game!`;
        } else {
            welcomeMessage.textContent = `Welcome ${player1Name} vs ${player2Name}, to Memory Game!`;
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

      //  updateDisplayStats();
    });

    welcomeMsgDiv.querySelector('.next_btn').addEventListener('click', () => {
        if (gameMode !== 'single') {
            const player1Turn = document.getElementById('player1_turn').checked;
            const currentTurn = player1Turn ? player1Name : player2Name;
            playerTurnText.textContent = `${currentTurn}'s Turn`; 
        } else {
            playerTurnText.textContent = `${player1Name}'s Playing`;
        }
    
        welcomeMsgDiv.style.display = 'none';
        gameInfo.style.display = 'block';

        initGameBoard();
    });


    // Game board variables
    const gameInfo = document.getElementById('game_info');
    const gameBoard = document.getElementById('game_board');
    const score = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const movesDisplay = document.getElementById('moves');
    // Game buttons variables
    const gameButtons = document.getElementById('game_btn');
    const playPauseButton = document.getElementById('playPause');
    const playButton = document.getElementById('play');
    const hintButton = document.getElementById('hints');
    const pauseButton = document.getElementById('pause');
    const quitGame = document.getElementById('exit');

    gameInfo.style.display = 'none';
   // gameButtons.style.display = 'block';
    //gameBoard.style.display = 'block';
    
    // Cards
    //const tile = document.createElement('div');
   // const tiles = document.querySelectorAll('.tile');
    //const allTiles = document.querySelectorAll('.tile:not(.flipped)');
    //const frontElement = tile.querySelector('.front');
    // On section load content to be hidden

    // Moves are based on the grid size
    const gridSizes = {
        4: 24,
        6: 48,
        8: 80
    }; 

    // Stats variables
    let currentLevel = 1; 
    let gridSize = 0; 
    let movesLeft = 0; 
    let totalScore = 0;
    let hintsLeft = 3;
    let matchedPairs = [];
    let flippedCards = [];
    let timeLeft = 0;  
    let firstFlippedCard = null;
    let secondFlippedCard = null;
    let timerInterval = null;
    let flashInterval = null;
    let gameStarted = false;
    let gamePaused = false;
    //let flashCount = 0;

    // Shuffle cards before each game
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
            return array;
    }

    // Timer 
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft++;
            timeDisplay.textContent = ` ${timeLeft}s`;
        }, 1000);
    }

    // Pause the timer 
    function pauseTimer() {
        clearInterval(timerInterval);
    }

    // Resume timer
    function resumeTimer() {
        startTimer();
    }

    // Update the game statistics for a new game
    function resetGameStatus() {
        let gridSize = currentLevel; 
        // Grid size created based on game level 4x4, 6x6 and 8x8
        gridSize = currentLevel === 1 ? 4 : currentLevel === 2 ? 6 : 8;
        movesLeft = gridSizes[gridSize];
        totalScore = 0;
        hintsLeft = 3;
        matchedPairs = 0;
    
        // Stats to be displayed at the display of gameboard
        score.textContent = `Score : ${totalScore}`; 
        movesDisplay.textContent = ` ${movesLeft}`;
        hintButton.textContent = ` : ${hintsLeft}`; 
        timeDisplay.textContent = ` 0s`;
    }

    // Disable the click event when flashing cards
    function disableTileClicks() {
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(tile => {
            tile.style.pointerEvents = 'none';
        });
    }

    function disableAllInteractions() {
        playPauseButton.disabled = true;
        hintButton.disabled = true;
        quitGame.disabled = true;
        disableTileClicks(); 

        playPauseButton.style.pointerEvents = 'none';
        hintButton.style.pointerEvents = 'none';
        quitGame.style.pointerEvents = 'none';
    }

    // Activate the tiles event listener
    function enableTileClicks() {
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(tile => {
            tile.style.pointerEvents = 'auto';
        });
    }

    function enableAllInteractions() {
        playPauseButton.disabled = false;
        hintButton.disabled = hintsLeft > 0;
        quitGame.disabled = false;
        enableTileClicks();  

        playPauseButton.style.pointerEvents = 'auto';
        hintButton.style.pointerEvents = 'auto';
        quitGame.style.pointerEvents = 'auto';
    }

    // Flash all cards before game starts
    function flashCardsForTime(time){
        // Stop the click event
        disableAllInteractions(); 

        const allTiles = document.querySelectorAll('.tile');
        const shuffledTiles = shuffle(Array.from(allTiles));
        let flashCount = 0;

        flashInterval = setInterval(() => {
            if (flashCount >= shuffledTiles.length * 3) {
                clearInterval(flashInterval);
                // Enable interactions after flashing 
                enableAllInteractions();
                return;
            }

            const currentTile = shuffledTiles[flashCount % shuffledTiles.length];
            flipTile(currentTile);

            setTimeout(() => {
                unflipTile(currentTile);
            }, 500);

            flashCount++;
        }, 500);
    }

    // Handles tiles unturned to display the value
    function flipTile(tile) {
        tile.classList.add('flipped');
        const frontElement = tile.querySelector('.front');
        const img = frontElement.querySelector('.card-image');
        //frontElement.textContent = tile.dataset.value;
        img.style.visibility = 'visible';
    }

    // Handles tiles turned upside down 
    function unflipTile(tile) {
        tile.classList.remove('flipped');
        const frontElement = tile.querySelector('.front');
        //frontElement.textContent = ''; 
        const img = frontElement.querySelector('.card-image');
        img.style.visibility = 'hidden'; 
    }

    // Pause/Play the game on the click of a button
    playPauseButton.addEventListener('click', () => {
        if (!gameStarted || gamePaused) {
            // Start or resume the game
            if (!gamePaused) {
                gameStarted = true;
                resetGameStatus();
                initGameBoard();
                startTimer();
                flashCardsForTime();
                alert("Game started!");
            } else if (gamePaused) {
                gamePaused = false;
                resumeTimer();
                alert("Game resumed!");
            }

            // Swap icons
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
            // Update accessibility attributes
            playPauseButton.setAttribute('aria-label', 'Press to Play the Game');   
        } else {
            gamePaused = true;
            pauseTimer();
            alert("Game paused! Press 'Resume' to continue.");

            // Swap icons
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
            // Update accessibility attributes
            playPauseButton.setAttribute('aria-label', 'Press to Pause the Game');
        }
    });

    // Flash all for hint
    function flashCardsForHint() {
        if (!gameStarted) return alert("The game hasn't started yet!");

        disableAllInteractions();
        const allUnflippedTiles = document.querySelectorAll('.tile:not(.flipped)');
        if (allUnflippedTiles.length === 0) return; 

        const shuffledUnflippedTiles = shuffle(Array.from(allUnflippedTiles)); 
        let flashCount = 0;

        // allUnflippedTiles.forEach(tile => {
        //     flipTile(tile);
        // });

        const hintFlashInterval = setInterval(() => {
            if (flashCount >= shuffledUnflippedTiles.length * 3) {
                clearInterval(hintFlashInterval);
                enableAllInteractions();
                return;
            }

            const currentTile = shuffledUnflippedTiles[flashCount % shuffledUnflippedTiles.length];
            flipTile(currentTile);
        
            setTimeout(() => {
                unflipTile(currentTile);
            }, 500);

                flashCount++;
        }, 500);

    }

    // Onclick event for  "Hint" button to flash the cards
    hintButton.addEventListener('click', () => {
        if (!gameStarted) {
            alert("The game has not started yet! Press 'Play' to start.");
        } else {
            if (hintsLeft > 0) {
                const confirmUseHint = confirm("Are you sure you want to use a hint? Only have 3 for whole game!");
                if (confirmUseHint && hintsLeft > 0) {
                    hintsLeft--; 
                    flashCardsForHint();

                    hintButton.textContent = ` : ${hintsLeft}`;
                    
                }
                } else {
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
                // Swap icons
                pauseButton.style.display = 'none';
                playButton.style.display = 'block';
                // Update accessibility attributes
                playPauseButton.setAttribute('aria-label', 'Press to Pause the Game');
            }
    } else {
        alert("The game hasn't started yet.");
    }
});

    function initGameBoard(){
        // Grid size created based on game level 4x4, 6x6 and 8x8
        gridSize = currentLevel === 1 ? 4 : currentLevel === 2 ? 6 : 8;
        movesLeft = gridSizes[gridSize];
        
        // Set the grid layout based on the game level
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; 
    
        //To clear out any content
        gameBoard.innerHTML = '';
        resetGameStatus();

        const totalTiles = gridSize * gridSize;
        // There can only be 1 pair of cards per each grid board
        const cardValues = generateCardPairs(totalTiles / 2);
        let shuffledCards = shuffle(cardValues);
    
        // Creates the tiles
        shuffledCards.forEach(imagePath => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.value = imagePath;

            // The card image front
            const front = document.createElement('div');
            front.classList.add('front');


            const img = document.createElement('img');
            img.src = imagePath;
            img.classList.add('card-image');
            img.style.visibility = 'hidden';
            front.appendChild(img);

            // The card background image
            const back = document.createElement('div');
            back.classList.add('back');
            const diamondIcon = document.createElement('i');
            diamondIcon.classList.add('fa-solid', 'fa-diamond');
            back.appendChild(diamondIcon); 

            // Append both front and back to the tile
            tile.appendChild(front);
            tile.appendChild(back);
    
            tile.addEventListener('click', () => handleTileClick(tile));
            gameBoard.appendChild(tile)

            score.textContent = `Score : ${totalScore}`; 
            movesDisplay.textContent = ` ${movesLeft}`;
            hintButton.textContent = ` : ${hintsLeft}`; 
            timeDisplay.textContent = ` 0s`;
        });
    }
    
    // TESTING CARD PAIRS
    function generateCardPairs(numPairs) {
        let cardImages = [];

        let imgPrefix;

        if (window.innerWidth <= 550) {
            imgPrefix = 'assets/pictures/4x4/mobile/img';
        } else if(window.innerWidth <= 950) {
            imgPrefix = 'assets/pictures/4x4/tablet/img';
        } else {
            imgPrefix = 'assets/pictures/4x4/desktop/img';
        }
        
        for (let i = 1; i <= numPairs; i++) {
            let imagePath = `${imgPrefix}${i}.png`;
            cardImages.push(imagePath, imagePath); 
        }
        // Shuffle the cards radomly
        return cardImages.sort(() => 0.5 - Math.random());
    }
    
    function checkForMatch() {
      const firstImg = firstFlippedCard.querySelector('.card-image').src;
      const secondImg = secondFlippedCard.querySelector('.card-image').src;
        
        if (firstImg === secondImg) {
            totalScore++;
            score.textContent = `Score: ${totalScore}`;
            matchedPairs++;
            //movesLeft--;

            // If all pairs are matched
            if (matchedPairs === (gridSize * gridSize) / 2) {
                alert("You've matched all pairs! Game over.");
                showResults('win');
                stopGame();
            }

            firstFlippedCard = null;
            secondFlippedCard = null;
        } else {
            setTimeout(() => {
                firstFlippedCard.querySelector('.card-image').style.visibility = 'hidden';
                secondFlippedCard.querySelector('.card-image').style.visibility = 'hidden';
                firstFlippedCard.classList.remove('flipped');
                secondFlippedCard.classList.remove('flipped');
                firstFlippedCard = null;
                secondFlippedCard = null;
            }, 1000);
        }
    }

    function handleTileClick(tile) {
        const img = tile.querySelector('.card-image');

       // No action for cards if the game has not started yet 
       if (!gameStarted || gamePaused) {
            alert("The game is paused or hasn't started. Press 'Play' to continue.");
            return;
        }

        // Do nothing if this tile is already flipped
        if (tile.classList.contains('flipped')) {
            return;
        }

        flipTile(tile);
        
        if (!firstFlippedCard || !secondFlippedCard) {
           // img.style.visibility = 'visible';
            tile.classList.add('flipped');

            if (!firstFlippedCard) {
                firstFlippedCard = tile;
            } else {
                secondFlippedCard = tile;
                checkForMatch();
            }
        }

        // Update moves left and display it
        movesLeft--;
        movesDisplay.textContent = ` ${movesLeft}`;

        //Check if there is still moves left
        if (movesLeft <= 0) {
            if (matchedPairs === (gridSize * gridSize) / 2) {
                showResults('win');
            } else {
                showResults('lose');
            }
            stopGame();
        }   
    }

    // ANIMATION SET UP FOR THE FALLING SAD FACE
    // Results game window display variables
    const gameStatus = document.getElementById('game_status');
    const resultsDiv = document.getElementById('results');
    const ScoreTable = document.getElementById('scoresboard');
    const popupLose = document.querySelector('.popup_lose');
    const popupWin = document.querySelector('.popup_win');
    const message = document.querySelector('.message');
    const exitGame = document.getElementById('quit');
    const nextLevel = document.getElementById('continue');
    // Number of sad faces falling
    const iconCount = 1000;
    const delayBetweenIcons = 0.3; 

    function createFallingIcon(index) {
        const icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-face-sad-tear', 'icon');

        // Randomize the starting position along the X-axis
        const randomX = Math.random() * window.innerWidth;
        icon.style.left = `${randomX}px`;

        // Add an animation delay to each icon based on its index
        icon.style.animationDelay = `${index * delayBetweenIcons}s`;

        popupLose.appendChild(icon);
    }

    // Create 1000 falling icons with delays
    for (let i = 0; i < iconCount; i++) {
        createFallingIcon(i);
    }


    // ANIMATION SET UP FOR THE FIREWORDKS
    function createFirework() {
        // Loop to generate and append 1000 fireworks
        for (let i = 0; i < 1000; i++) {
            const firework = document.createElement('div');
            firework.classList.add('firework');
            popupWin.appendChild(firework);
        }
    }

    function hideEndGameElements(){
        gameStatus.style.display = 'none';
        gameButtons.style.display = 'none';
        gameBoard.style.display = 'none';
    }
    

    
    

    const playerName = document.querySelector('.player_name');
    const time = document.querySelector('.complete_time');
    const finalScore = document.querySelector('.final_score');

    let player = {
        name: "", 
        time: "00:00",     
        score: 0         
    };

    function updateScoreboard(player) {
        // Update the table with player's data
        playerName.textContent = player.name;
        time.textContent = player.time;
        finalScore.textContent = player.score;
    }




    function showResults(result) {
        hideEndGameElements();

        ScoreTable.style.display = 'block';

        if (result === 'win') {
            popupWin.style.display = 'block';
            popupLose.style.display = 'none';
            alert("Congratulations! You've matched all pairs and won the game!");
        } else {
            popupWin.style.display = 'none';
            popupLose.style.display = 'block';
            alert("Game Over! You've run out of moves.");
        }
    
        resultsDiv.style.display = 'block'; 
        resultsDiv.focus()
    }

    // function showWinPopup() {
    //     // gameButtons.style.display = 'none';
    //      //gameBoard.style.display = 'none';
    //      createFirework(); 
    //      updateScoreboard(player);
    //      popupWin.style.display = 'block';
    //  }
     
    //  showWinPopup();
 
    // function showLosePopup() {
    //     // gameButtons.style.display = 'none';
    //     // gameBoard.style.display = 'none';
    //     createFallingIcon();
    //     updateScoreboard(player);
    //     popupLose.style.display = 'block';
    //  }
     
    //  showLosePopup();

    // function endGame(results){
    //     // player.time = "1:20";
    //     // player.score = 10;

    //     const playerName = document.querySelector('.player_name');
    //     const time = document.querySelector('.complete_time');
    //     const finalScore = document.querySelector('.final_score');

    //     // updateScoreboard();
    //     // showResults(results);
    //     playerName.textContent = currentPlayer.name;
    //     time.textContent = currentPlayer.time;
    //     finalScore.textContent = currentPlayer.score;
    // }
});