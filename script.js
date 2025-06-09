/*
 * JavaScript Logic for the Professional Tic Tac Toe Game
 * Copyright © 2025 Shivakoti Shambhavi
 * This script manages game state, player turns (human and AI),
 * win/draw conditions, game mode selection, and UI updates.
 */

// Get references to DOM elements
const gameElements = document.getElementById('gameElements'); // Container for game board and status
const gameStatus = document.getElementById('gameStatus'); // Get the gameStatus div
const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const cells = document.querySelectorAll('.cell');

// Game state variables
let board = ['', '', '', '', '', '', '', '', '']; // Represents the 3x3 grid, initially empty
let currentPlayer = 'X'; // 'X' always starts the game
let gameActive = false; // Game is inactive until started
let gameMode = 'playerVsComputer'; // Automatically set to Player vs Computer

// Define all possible winning combinations (rows, columns, diagonals)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function getPlayerDisplayName(playerSymbol, isWinMessage = false) {
    if (playerSymbol === 'X') return isWinMessage ? 'You' : 'Your';
    return 'Computer';
}

function updateGameStatus(message) {
    gameStatus.textContent = message;
}

function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    gameActive = true;
    updateGameStatus(`${getPlayerDisplayName(currentPlayer)} Turn`);
    if (gameMode === 'playerVsComputer' && currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
    }
}

function handleCellClick(event) {
    const clickedCellIndex = parseInt(event.target.dataset.cellIndex);
    if (board[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') return;
    makeMove(clickedCellIndex, currentPlayer);
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    checkResult();
}

function makeComputerMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    let bestMove = -1;
    const emptyCells = board.map((val, idx) => val === '' ? idx : -1).filter(idx => idx !== -1);

    for (let move of emptyCells) {
        board[move] = 'O';
        if (checkWin('O')) {
            bestMove = move;
            board[move] = '';
            break;
        }
        board[move] = '';
    }

    if (bestMove === -1) {
        for (let move of emptyCells) {
            board[move] = 'X';
            if (checkWin('X')) {
                bestMove = move;
                board[move] = '';
                break;
            }
            board[move] = '';
        }
    }

    if (bestMove === -1 && board[4] === '') bestMove = 4;

    if (bestMove === -1) {
        for (let corner of [0, 2, 6, 8]) {
            if (board[corner] === '') {
                bestMove = corner;
                break;
            }
        }
    }

    if (bestMove === -1 && emptyCells.length > 0) {
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (bestMove !== -1) {
        setTimeout(() => makeMove(bestMove, 'O'), 700);
    }
}

function checkWin(player) {
    return winningConditions.some(condition =>
        condition.every(index => board[index] === player)
    );
}

function checkResult() {
    if (checkWin(currentPlayer)) {
        updateGameStatus(`${getPlayerDisplayName(currentPlayer, true)} Wins!`);
        gameActive = false;
        return;
    }
    if (!board.includes('')) {
        updateGameStatus(`It's a Draw!`);
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus(`${getPlayerDisplayName(currentPlayer)} Turn`);
    if (currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    updateGameStatus(`${getPlayerDisplayName(currentPlayer)} Turn`);
    if (currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500);
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
resetButton.addEventListener('click', resetGame);
document.addEventListener('DOMContentLoaded', startGame);
