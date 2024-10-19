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
    const gameStatus = document.getElementById('game_status');
    const gameBoard = document.getElementById('game_board');
    const playButton = document.getElementById('play');
    const hintButton = document.getElementById('hints');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    // After game window display variables
    const resultsDiv = document.getElementById('results');
    const popupLoseDiv = document.querySelector('.popup_lose');
    const popupwinDiv = document.querySelector('.popup_win');

    // On section load content to be hidden
    playerNamesDiv.style.display = 'none';
    welcomeMsgDiv.style.display = 'none';
    gameInfo.style.display = 'none';

    let player1Name = "";
    // Default for single player
    let gameMode = 'single'; 
    // Default for playing with the computer
    let player2Name = 'Computer'; 
    // Stats variables
    let currentLevel = 1; 
    let movesLeft = 0; 
    let totalScore = 0;
    let matchedPairs = 0;
    let hintsLeft = 3;
    let timeLeft = 0;
    let timerInterval;
    let flippedCards = [];
    let playerTime = 0;  
    let totalTiles;

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


    // Set the timer on start of game and clear any time before game
    function startTimer() {
        let timeLeft = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft++;
            timeDisplay.textContent = ` : ${timeLeft}s`;
        }, 1000);
    }

    function initGameBoard(){ 
        let gridSize, numPairs, maxMoves;
        totalScore = 0;
        matchedPairs = 0;
        flippedCards = [];
        // Reset hints on start of game 
        hintsLeft = 3;
        
        if (currentLevel === 1) {
            gridSize = 4;
            numPairs = 8; 
            maxMoves = 20;
        } else if (currentLevel === 2) {
            gridSize = 6;
            numPairs = 18;
            maxMoves = 42;
        } else if (currentLevel === 3) {
            gridSize = 8;
            numPairs = 32;
            maxMoves = 72; 
        }

        const totalTiles = gridSize * gridSize;
        movesLeft = maxMoves;
        movesDisplay.textContent = ` : ${movesLeft}`;
        hintButton.textContent = ` : ${hintsLeft}`; 
        
        //To clear out any content
        gameBoard.innerHTML = '';

        // Grid size created based on game 
        // Level one 4x4 = 8pairs, level two 6x6 = 18pairs and level three 8x8 = 32pairs
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        // There can only be 1 pair of cards per each grid board
        const cardValues = generateCardPairs(numPairs); 
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
        
        // Start the timer
        startTimer();  
    }

    // Onclick event for  "Play" button
    playButton.addEventListener('click', () => {
        flashTilesRandomly(() => {
            initGameBoard();
        });
    });

    // Onclick event for  "Hint" button to flash the cards
    hintButton.addEventListener('click', () => {
        if (hintsLeft > 0) {
            hintsLeft--; 
            hintButton.textContent = ` : ${hintsLeft}`;
        }
    });

    function shuffle(array) {}

    // Display image based on the viewport size
    function getDeviceType() {
        const width = window.innerWidth;
    
        if (width <= 768) {
            return 'mobile';
        } else if (width > 768 && width <= 1024) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    // Shuffle cards before each game
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateCardPairs(numPairs, currentLevel) {
        const deviceType = getDeviceType(); 
        const selectedImages = imageSets[deviceType][currentLevel];
        
        const imageSets = {
            mobile: {
                1: ['assets/pictures/4x4/mobile/img1.png', 
                    'assets/pictures/4x4/mobile/img2.png', 
                    'assets/pictures/4x4/mobile/img3.png', 
                    'assets/pictures/4x4/mobile/img4.png', 
                    'assets/pictures/4x4/mobile/img5.png', 
                    'assets/pictures/4x4/mobile/img6.png', 
                    'assets/pictures/4x4/mobile/img7.png', 
                    'assets/pictures/4x4/mobile/img8.png'      
                ],
                2:['assets/pictures/6x6/mobile/img1.png',
                    'assets/pictures/6x6/mobile/img2.png',
                    'assets/pictures/6x6/mobile/img3.png',
                    'assets/pictures/6x6/mobile/img4.png',
                    'assets/pictures/6x6/mobile/img5.png',
                    'assets/pictures/6x6/mobile/img6.png',
                    'assets/pictures/6x6/mobile/img7.png',
                    'assets/pictures/6x6/mobile/img8.png',
                    'assets/pictures/6x6/mobile/img9.png',
                    'assets/pictures/6x6/mobile/img10.png',
                    'assets/pictures/6x6/mobile/img12.png', 
                    'assets/pictures/6x6/mobile/img11.png', 
                    'assets/pictures/6x6/mobile/img13.png', 
                    'assets/pictures/6x6/mobile/img14.png', 
                    'assets/pictures/6x6/mobile/img15.png', 
                    'assets/pictures/6x6/mobile/img16.png', 
                    'assets/pictures/6x6/mobile/img17.png', 
                    'assets/pictures/6x6/mobile/img18.png',
                ],
                3:['assets/pictures/8x8/mobile/img1.png',
                    'assets/pictures/8x8/mobile/img2.png',
                    'assets/pictures/8x8/mobile/img3.png',
                    'assets/pictures/8x8/mobile/img4.png',
                    'assets/pictures/8x8/mobile/img5.png',
                    'assets/pictures/8x8/mobile/img6.png',
                    'assets/pictures/8x8/mobile/img7.png',
                    'assets/pictures/8x8/mobile/img8.png',
                    'assets/pictures/8x8/mobile/img9.png',
                    'assets/pictures/8x8/mobile/img10.png',
                    'assets/pictures/8x8/mobile/img11.png',
                    'assets/pictures/8x8/mobile/img12.png',
                    'assets/pictures/8x8/mobile/img13.png',
                    'assets/pictures/8x8/mobile/img14.png',
                    'assets/pictures/8x8/mobile/img15.png',
                    'assets/pictures/8x8/mobile/img16.png',
                    'assets/pictures/8x8/mobile/img17.png',
                    'assets/pictures/8x8/mobile/img18.png',
                    'assets/pictures/8x8/mobile/img19.png',
                    'assets/pictures/8x8/mobile/img20.png',
                    'assets/pictures/8x8/mobile/img21.png',
                    'assets/pictures/8x8/mobile/img22.png',
                    'assets/pictures/8x8/mobile/img23.png',
                    'assets/pictures/8x8/mobile/img24.png',
                    'assets/pictures/6x6/mobile/img25.png',
                    'assets/pictures/8x8/mobile/img26.png',
                    'assets/pictures/8x8/mobile/img27.png',
                    'assets/pictures/8x8/mobile/img28.png',
                    'assets/pictures/8x8/mobile/img29.png',
                    'assets/pictures/8x8/mobile/img30.png',
                    'assets/pictures/8x8/mobile/img31.png',
                    'assets/pictures/8x8/mobile/img32.png'
                ]
            },
            tablet: {
                1: ['assets/pictures/4x4/tablet/img1.png', 
                    'assets/pictures/4x4/tablet/img2.png', 
                    'assets/pictures/4x4/tablet/img3.png', 
                    'assets/pictures/4x4/tablet/img4.png', 
                    'assets/pictures/4x4/tablet/img5.png', 
                    'assets/pictures/4x4/tablet/img6.png', 
                    'assets/pictures/4x4/tablet/img7.png', 
                    'assets/pictures/4x4/tablet/img8.png' 
                ], 
                2:['assets/pictures/6x6/tablet/img1.png',
                    'assets/pictures/6x6/tablet/img2.png',
                    'assets/pictures/6x6/tablet/img3.png',
                    'assets/pictures/6x6/tablet/img4.png',
                    'assets/pictures/6x6/tablet/img5.png',
                    'assets/pictures/6x6/tablet/img6.png',
                    'assets/pictures/6x6/tablet/img7.png',
                    'assets/pictures/6x6/tablet/img8.png',
                    'assets/pictures/6x6/tablet/img9.png',
                    'assets/pictures/6x6/tablet/img10.png',
                    'assets/pictures/6x6/tablet/img11.png',
                    'assets/pictures/6x6/tablet/img12.png',
                    'assets/pictures/6x6/tablet/img13.png',
                    'assets/pictures/6x6/tablet/img14.png',
                    'assets/pictures/6x6/tablet/img15.png',
                    'assets/pictures/6x6/tablet/img16.png',
                    'assets/pictures/6x6/tablet/img17.png',
                    'assets/pictures/6x6/tablet/img18.png'
                ],
                3:['assets/pictures/8x8/tablet/img1.png',
                    'assets/pictures/8x8/tablet/img2.png',
                    'assets/pictures/8x8/tablet/img3.png',
                    'assets/pictures/8x8/tablet/img4.png',
                    'assets/pictures/8x8/tablet/img5.png',
                    'assets/pictures/8x8/tablet/img6.png',
                    'assets/pictures/8x8/tablet/img7.png',
                    'assets/pictures/8x8/tablet/img8.png',
                    'assets/pictures/8x8/tablet/img9.png',
                    'assets/pictures/8x8/tablet/img10.png',
                    'assets/pictures/8x8/tablet/img11.png',
                    'assets/pictures/8x8/tablet/img12.png',
                    'assets/pictures/8x8/tablet/img13.png',
                    'assets/pictures/8x8/tablet/img14.png',
                    'assets/pictures/8x8/tablet/img15.png',
                    'assets/pictures/8x8/tablet/img16.png',
                    'assets/pictures/8x8/tablet/img17.png',
                    'assets/pictures/8x8/tablet/img18.png',
                    'assets/pictures/8x8/tablet/img19.png',
                    'assets/pictures/8x8/tablet/img20.png',
                    'assets/pictures/8x8/tablet/img21.png',
                    'assets/pictures/8x8/tablet/img22.png',
                    'assets/pictures/8x8/tablet/img23.png',
                    'assets/pictures/8x8/tablet/img24.png',
                    'assets/pictures/8x8/tablet/img25.png',
                    'assets/pictures/8x8/tablet/img26.png',
                    'assets/pictures/8x8/tablet/img27.png',
                    'assets/pictures/8x8/tablet/img28.png',
                    'assets/pictures/8x8/tablet/img29.png',
                    'assets/pictures/8x8/tablet/img30.png',
                    'assets/pictures/8x8/tablet/img31.png',
                    'assets/pictures/8x8/tablet/img32.png'
                ]   
            },
            desktop: {
                1: ['assets/pictures/4x4/desktop/img1.png', 
                    'assets/pictures/4x4/desktop/img2.png', 
                    'assets/pictures/4x4/desktop/img3.png', 
                    'assets/pictures/4x4/desktop/img4.png', 
                    'assets/pictures/4x4/desktop/img5.png', 
                    'assets/pictures/4x4/desktop/img6.png', 
                    'assets/pictures/4x4/desktop/img7.png', 
                    'assets/pictures/4x4/desktop/img8.png' 
                ],  
                2:['assets/pictures/6x6/desktop/img1.png',
                    'assets/pictures/6x6/desktop/img2.png',
                    'assets/pictures/6x6/desktop/img3.png',
                    'assets/pictures/6x6/desktop/img4.png',
                    'assets/pictures/6x6/desktop/img5.png',
                    'assets/pictures/6x6/desktop/img6.png',
                    'assets/pictures/6x6/desktop/img7.png',
                    'assets/pictures/6x6/desktop/img8.png',
                    'assets/pictures/6x6/desktop/img9.png',
                    'assets/pictures/6x6/desktop/img10.png',
                    'assets/pictures/6x6/desktop/img11.png',
                    'assets/pictures/6x6/desktop/img12.png',
                    'assets/pictures/6x6/desktop/img13.png',
                    'assets/pictures/6x6/desktop/img14.png',
                    'assets/pictures/6x6/desktop/img15.png',
                    'assets/pictures/6x6/desktop/img16.png',
                    'assets/pictures/6x6/desktop/img17.png',
                    'assets/pictures/6x6/desktop/img18.png'
                ],
                3:['assets/pictures/8x8/desktop/img1.png',
                    'assets/pictures/8x8/desktop/img2.png',
                    'assets/pictures/8x8/desktop/img3.png',
                    'assets/pictures/8x8/desktop/img4.png',
                    'assets/pictures/8x8/desktop/img5.png',
                    'assets/pictures/8x8/desktop/img6.png',
                    'assets/pictures/8x8/desktop/img7.png',
                    'assets/pictures/8x8/desktop/img8.png',
                    'assets/pictures/8x8/desktop/img9.png',
                    'assets/pictures/8x8/desktop/img10.png',
                    'assets/pictures/8x8/desktop/img11.png',
                    'assets/pictures/8x8/desktop/img12.png',
                    'assets/pictures/8x8/desktop/img13.png',
                    'assets/pictures/8x8/desktop/img14.png',
                    'assets/pictures/8x8/desktop/img15.png',
                    'assets/pictures/8x8/desktop/img16.png',
                    'assets/pictures/8x8/desktop/img17.png',
                    'assets/pictures/8x8/desktop/img18.png',
                    'assets/pictures/8x8/desktop/img19.png',
                    'assets/pictures/8x8/desktop/img20.png',
                    'assets/pictures/8x8/desktop/img21.png',
                    'assets/pictures/8x8/desktop/img22.png',
                    'assets/pictures/8x8/desktop/img23.png',
                    'assets/pictures/8x8/desktop/img24.png',
                    'assets/pictures/8x8/desktop/img25.png',
                    'assets/pictures/8x8/desktop/img26.png',
                    'assets/pictures/8x8/desktop/img27.png',
                    'assets/pictures/8x8/desktop/img28.png',
                    'assets/pictures/8x8/desktop/img29.png',
                    'assets/pictures/8x8/desktop/img30.png',
                    'assets/pictures/8x8/desktop/img31.png',
                    'assets/pictures/8x8/desktop/img32.png'
                ]   
            }
        };

        if (!selectedImages || selectedImages.length < numPairs) {
            console.error("Not enough images for the selected level or invalid level.");
            return [];
        }

        const chosenImages = selectedImages
        // Shuffle images
        .sort(() => 0.5 - Math.random()) 
        .slice(0, numPairs);

        let cardValues = [];

        chosenImages.forEach(image => {
            // Adds image twice to create a pair
            cardValues.push(image, image);
        });
        
        return shuffle(cardValues);
    }

    function handleTileClick(tile) {
        if (tile.textContent === '?') {
            tile.textContent = tile.dataset.value;
            flippedCards.push(tile);
            
            if (flippedCards.length === 2) {
                const [firstCard, secondCard] = flippedCards;

                if (firstCard.dataset.value === secondCard.dataset.value) {
                    firstCard.style.visibility = 'hidden';
                    secondCard.style.visibility = 'hidden';
                    matchedPairs++;
                    // Add points for a match
                    totalScore += 10; 
                    checkForWin();

                // To check is there is any moves
                } else {
                    
                    setTimeout(() => {
                        firstCard.textContent = '?';
                        secondCard.textContent = '?';
                    }, 1000);
                }

                flippedCards = [];
                movesLeft--;
                movesDisplay.textContent = ` ${movesLeft}`;

                if (movesLeft === 0) {
                    endGame(false); 
                }
            }
        }
    }
    
    function checkForWin() {
        if (matchedPairs === totalTiles / 2) {
            endGame(true); 
        }
    }

    function endGame(isWin) {
        clearInterval(timerInterval);
    
        if (isWin) {
            popupwinDiv.style.display = 'block'; 
        } else {
            popupLoseDiv.style.display = 'block'; 
        }
    
        // Show the results screen
        resultsDiv.style.display = 'block';
    }

    function flashCardsForTime(duration, shuffledCards) {
        // Show all card values
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.textContent = tile.dataset.value;
        });
    
        // Hide all card values again after shuffle
        setTimeout(() => {
            tiles.forEach(tile => {
                tile.textContent = '?'; 
            });
        }, duration);
    }

    function flashTilesRandomly(callback) {
        const tiles = document.querySelectorAll('.tile');
        const flashCount = 3; 
        let flashes = 0;
        let flashInterval = 500;

        function flashTile() {
            const shuffledTiles = shuffle(Array.from(tiles));
            shuffledTiles.forEach((tile, index) => {
                setTimeout(() => {
                    tile.textContent = tile.dataset.value; 
                    setTimeout(() => {
                        tile.textContent = '?';
                    }, flashInterval); 
                }, index * flashInterval);
            });
        }

        flashes++;

        if (flashes >= flashCount) {
            clearInterval(flashLoop);
            // Start the game after flashing
            callback(); 
        }
        const flashLoop = setInterval(flashTile, flashInterval * tiles.length);
    }

});