const canvas = document.getElementById('board');
const boardElement = document.getElementById('board');
document.addEventListener('keydown', keydown);

const groundImg = new Image();
groundImg.src = 'images/ground.png';
groundImg.alt = 'ground';

const playerImg = new Image();
playerImg.src = 'images/player.png';
playerImg.alt = 'player';

const redboxImg = new Image();
redboxImg.src = 'images/redbox.png';
redboxImg.alt = 'redbox';

const targetImg = new Image();
targetImg.src = 'images/target.png';
targetImg.alt = 'target';

const wallImg = new Image();
wallImg.src = 'images/wall.png';
wallImg.alt = 'wall';

const yellowboxImg = new Image();
yellowboxImg.src = 'images/yellowbox.png';
yellowboxImg.alt = 'yellowbox';

window.onload = () => {
    printBoard();
}

const ground = [
    [" ", " ", "#", "#", "#", "#", "#", " "],
    ["#", "#", "#", " ", " ", " ", "#", " "],
    ["#", ".", " ", " ", " ", " ", "#", " "],
    ["#", "#", "#", " ", " ", ".", "#", " "],
    ["#", ".", "#", "#", " ", " ", "#", " "],
    ["#", " ", "#", " ", ".", " ", "#", "#"],
    ["#", " ", " ", ".", " ", " ", ".", "#"],
    ["#", " ", " ", " ", ".", " ", " ", "#"],
    ["#", "#", "#", "#", "#", "#", "#", "#"]];

const position = [
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", "x", "o", " ", " ", " ", " "],
    [" ", " ", " ", " ", "o", " ", " ", " "],
    [" ", " ", " ", " ", "o", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", "o", " ", "o", "o", "o", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "]];

function printBoard() {
    let rows = [];

    for (let i = 0; i < 9; i++) {
        let cells = []

        for (let j = 0; j < 8; j++) {
            let cell = ground[i][j];
            if (cell === "#") {
                cells.push(cell);
                continue;
            }
            if (cell === " ") {
                cells.push(position[i][j]);
                continue;
            }
            if (position[i][j] === "x") {
                cells.push("X");
            }
            else if (position[i][j] === "o") {
                cells.push("O");
            } else {
                cells.push(cell);
            }
        }
        rows.push(cells);
    }

    var ctx = canvas.getContext('2d');

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.drawImage(groundImg, j * 64, i * 64);
            if (rows[i][j] === "#") {
                ctx.drawImage(wallImg, j * 64, i * 64);
            }
            if (rows[i][j] === ".") {
                ctx.drawImage(targetImg, j * 64 + 16, i * 64 + 16);
            }
            if (rows[i][j] === "o") {
                ctx.drawImage(yellowboxImg, j * 64, i * 64);
            }
            if (rows[i][j] === "O") {
                ctx.drawImage(redboxImg, j * 64, i * 64);
            }
            if (rows[i][j] === "x") {
                ctx.drawImage(playerImg, j * 64 + 13.5, i * 64 + 2.5);
            }
            if (rows[i][j] === "X") {
                ctx.drawImage(targetImg, j * 64 + 16, i * 64 + 16);
                ctx.drawImage(playerImg, j * 64 + 13.5, i * 64 + 2.5);
            }
        }
    }
}

function getCurrentPlayerPosition() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 8; j++) {
            if (position[i][j] === "x")
                return [i, j];
        }
    }
}

function keydown(e) {
    let x = getCurrentPlayerPosition();

    if (e.code === "ArrowUp") {
        let i = x[0];
        let j = x[1];
        if (ground[i - 1][j] === "#") return;
        if (position[i - 1][j] === "o") {
            if (position[i - 2][j] === "o" || ground[i - 2][j] === "#") return;
            position[i - 2][j] = "o";
            position[i - 1][j] = "x";
            position[i][j] = " ";
        }
        position[i - 1][j] = "x";
        position[i][j] = " ";
    }
    if (e.code === "ArrowDown") {
        let i = x[0];
        let j = x[1];
        if (ground[i + 1][j] === "#") return;
        if (position[i + 1][j] === "o") {
            if (position[i + 2][j] === "o" || ground[i + 2][j] === "#") return;
            position[i + 2][j] = "o";
            position[i + 1][j] = "x";
            position[i][j] = " ";
        }
        position[i + 1][j] = "x";
        position[i][j] = " ";
    }
    if (e.code === "ArrowLeft") {
        let i = x[0];
        let j = x[1];
        if (ground[i][j - 1] === "#") return;
        if (position[i][j - 1] === "o") {
            if (position[i][j - 2] === "o" || ground[i][j - 2] === "#") return;
            position[i][j - 2] = "o";
            position[i][j - 1] = "x";
            position[i][j] = " ";
        }
        position[i][j - 1] = "x";
        position[i][j] = " ";
    }
    if (e.code === "ArrowRight") {
        let i = x[0];
        let j = x[1];
        if (ground[i][j + 1] === "#") return;
        if (position[i][j + 1] === "o") {
            if (position[i][j + 2] === "o" || ground[i][j + 2] === "#") return;
            position[i][j + 2] = "o";
            position[i][j + 1] = "x";
            position[i][j] = " ";
        }
        position[i][j + 1] = "x";
        position[i][j] = " ";
    }

    printBoard();
    let win = checkPosition();
    if (win) {
        alert("Congratulations");
    }
}

function checkPosition() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 8; j++) {
            if (ground[i][j] === "." && position[i][j] != "o")
                return false;
        }
    }
    return true;
}