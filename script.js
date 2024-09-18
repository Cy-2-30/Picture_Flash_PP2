const gameInfo = document.getElementById('game_info');
const gameSetup = document.getElementById('game_setup');
const gameStatus = document.getElementById('game_status');
const gameMode = document.getElementById('input[name="game_mode"]');
const gameBoard = document.getElementById('game_board');
const playerOneNameInput = document.getElementById('player1_names');
const playerTwoNameInput = document.getElementById('player2_names');
const playerTwoDiv = document.getElementsByClassName('names2');
const playButton = document.getElementById('start_game');
const quitButton = document.getElementById('quit_game');
const playerTurn = document.getElementById('current_turn');
const playMoves = document.getElementById('moves');
const gameHint = document.getElementById('hints');
const score = document.getElementById('score');

let player1Name = "";
let player2Name = "";
let gameModeDefault = 'single'; // Default to a single player
let currentPlayerTurn = 1;
let scorePoints = 0;
let movesLeft = 20;

