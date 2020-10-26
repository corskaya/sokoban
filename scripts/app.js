document.addEventListener('keydown', keydown);

const boardElement = document.getElementById('board');

const ground = [
    [" ", " ", "#", "#", "#", "#", "#", " "],
    ["#", "#", "#", " ", " ", " ", "#", " "],
    ["#", ".", " ", " ", " ", " ", "#", " "],
    ["#", "#", "#", " ", " ", " ", "#", " "],
    ["#", " ", "#", "#", " ", " ", "#", " "],
    ["#", " ", "#", " ", " ", " ", "#", "#"],
    ["#", " ", " ", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", "#"],
    ["#", "#", "#", "#", "#", "#", "#", "#"]];

const position = [
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", "x", "o", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "]];

function printBoard() {
    let board = "";

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 8; j++) {
            let cell = ground[i][j];

            if (cell === "#") {
                board += cell;
                continue;
            }
            if (cell === " ") {
                board += position[i][j];
                continue;
            }
            if (position[i][j] === "x") {
                board += "X";
            }
            else if (position[i][j] === "o") {
                board += "O";
            } else {
                board += cell;
            }
        }
        board += "\n";
    }

    boardElement.innerText = board;
}

printBoard();

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