const gridContainer = document.getElementById('grid');
const timerDisplay = document.getElementById('time');
const messageDisplay = document.getElementById('message');
const gridSize = 10;
const totalMines = 10;
let revealedCount = 0;
let mines = [];
let firstClick = true;
let startTime;
let timerInterval;

function createGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', flagCell);
            gridContainer.appendChild(cell);
        }
    }
}

function placeMines(excludedCell) {
    while (mines.length < totalMines) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        if (excludedCell && (row === excludedCell.row && col === excludedCell.col)) {
            continue;
        }
        const mine = `${row}-${col}`;
        if (!mines.includes(mine)) {
            mines.push(mine);
        }
    }
}

function initializeGrid(row, col) {
    placeMines({ row, col });
    firstClick = false;
    startTimer();
}

function revealAdjacentZeros(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const adjacentCell = document.querySelector(`.cell[data-row="${row+i}"][data-col="${col+j}"]`);
            if (adjacentCell && !adjacentCell.classList.contains('revealed')) {
                let mineCount = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (mines.includes(`${row+i+x}-${col+j+y}`)) {
                            mineCount++;
                        }
                    }
                }
                if (mineCount === 0) {
                    adjacentCell.classList.add('revealed');
                    revealAdjacentZeros(row+i, col+j);
                } else {
                    adjacentCell.textContent = mineCount;
                    adjacentCell.classList.add('revealed');
                }
            }
        }
    }
}

function revealCell(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        return;
    }

    if (firstClick) {
        initializeGrid(row, col);
        if (mines.includes(`${row}-${col}`)) {
            const [mineRow, mineCol] = mines[0].split('-').map(Number);
            mines.splice(0, 1);
            placeMines({ row: mineRow, col: mineCol });
            mines.push(`${row}-${col}`);
        }
    }

    if (mines.includes(`${row}-${col}`)) {
        cell.classList.add('mine');
        gameOver();
    } else {
        let mineCount = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (mines.includes(`${row + i}-${col + j}`)) {
                    mineCount++;
                }
            }
        }
        if (mineCount === 0) {
            revealAdjacentZeros(row, col);
        } else {
            cell.textContent = mineCount;
            cell.classList.add('revealed');
            revealedCount = document.querySelectorAll('.cell.revealed').length;
            console.log(revealedCount, (gridSize * gridSize) - totalMines);
            if (revealedCount === (gridSize * gridSize) - totalMines) {
                win();
            }
        }
    }
}


function flagCell(event) {
    event.preventDefault();
    const cell = event.target;
    cell.classList.toggle('flagged');
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = currentTime;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function gameOver() {
    stopTimer();
    messageDisplay.innerHTML = '<img src="img/explosion.png" alt="Bomb"> Game Over';
}

function win() {
    stopTimer();
    messageDisplay.innerHTML = '<img src="img/trophy.png" alt="Trophy"> Congratulations! You Win!';
}

createGrid();
