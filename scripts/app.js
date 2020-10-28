const canvas = document.getElementById('board');
const images = {};
const directions = {
    'ArrowUp': [-1, 0],
    'ArrowDown': [+1, 0],
    'ArrowLeft': [0, -1],
    'ArrowRight': [0, +1],
}

let player = { x: 0, y: 0 };
let ground = [];
let position = [];
let originalPosition = [];
let moveStack = [];

['ground', 'player', 'redbox', 'target', 'wall', 'yellowbox'].forEach(name => {
    const img = new Image();
    img.src = `images/${name}.png`;
    img.alt = name;
    images[name] = img;
});

window.onload = () => {
    setPlayerPosition();
    printBoard();
}

let level = `##########
##########
##########
#######@ #
### $   .#
### . $  #
## .$##  #
###  ##$.#
##   ##  #
##########`;
createLevel(level);

function createLevel(level) {
    let groundRow = [];
    let positionRow = [];
    for (let i = 0; i < level.length; i++) {
        if (level[i] === "#") {
            groundRow.push("#");
            positionRow.push(" ");
        } else if (level[i] === " ") {
            groundRow.push(" ");
            positionRow.push(" ");
        } else if (level[i] === ".") {
            groundRow.push(".");
            positionRow.push(" ");
        } else if (level[i] === "@") {
            groundRow.push(" ");
            positionRow.push("x");
        } else if (level[i] === "$") {
            groundRow.push(" ");
            positionRow.push("o");
        } else {
            ground.push(groundRow);
            position.push(positionRow);
            groundRow = [];
            positionRow = [];
        }
    }
    ground.push(groundRow);
    position.push(positionRow);
    originalPosition = copyPosition(position);
    canvas.width = ground[0].length * 64;
    canvas.height = ground.length * 64;
}

function copyPosition(position) {
    let newPosition = [];
    for (let i = 0; i < position.length; i++) {
        var row = [];
        for (let j = 0; j < position[i].length; j++) {
            row.push(position[i][j]);
        }
        newPosition.push(row);
    }
    return newPosition;
}

function printBoard() {
    const rows = [];

    for (let i = 0; i < ground.length; i++) {
        const cells = []

        for (let j = 0; j < ground[i].length; j++) {
            const cell = ground[i][j];
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
                cells.push(".");
            }
        }

        rows.push(cells);
    }

    var ctx = canvas.getContext('2d');

    for (let i = 0; i < ground.length; i++) {
        for (let j = 0; j < ground[i].length; j++) {
            ctx.drawImage(images.ground, j * 64, i * 64);
            if (rows[i][j] === "#") {
                ctx.drawImage(images.wall, j * 64, i * 64);
            }
            if (rows[i][j] === ".") {
                ctx.drawImage(images.target, j * 64 + 16, i * 64 + 16);
            }
            if (rows[i][j] === "o") {
                ctx.drawImage(images.yellowbox, j * 64, i * 64);
            }
            if (rows[i][j] === "O") {
                ctx.drawImage(images.redbox, j * 64, i * 64);
            }
            if (rows[i][j] === "x") {
                ctx.drawImage(images.player, j * 64 + 13.5, i * 64 + 2.5);
            }
            if (rows[i][j] === "X") {
                ctx.drawImage(images.target, j * 64 + 16, i * 64 + 16);
                ctx.drawImage(images.player, j * 64 + 13.5, i * 64 + 2.5);
            }
        }
    }
}

function keydown(e) {
    if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        movePlayer(e.code);
    } else if (e.code === "KeyR") {
        resetLevel();
    } else if (e.code === "KeyU") {
        undoLastMove();
    }
}

function movePlayer(direction) {
    const x1 = player.x + directions[direction][0];
    const x2 = player.x + 2 * directions[direction][0];
    const y1 = player.y + directions[direction][1];
    const y2 = player.y + 2 * directions[direction][1];

    if (ground[x1][y1] === "#") {
        return;
    }
    let move = {};
    if (position[x1][y1] === "o") {
        if (position[x2][y2] === "o" || ground[x2][y2] === "#") {
            return;
        }
        position[x2][y2] = "o";
        move.box = { from: { x: x2, y: y2 }, to: { x: x1, y: y1 } };
    }
    position[x1][y1] = "x";
    position[player.x][player.y] = " ";
    move.player = { from: { x: x1, y: y1 }, to: { x: player.x, y: player.y } };
    moveStack.push(move);

    player = { x: x1, y: y1 };

    printBoard();
    checkPosition();
}

function checkPosition() {
    for (let i = 0; i < position.length; i++)
        for (let j = 0; j < position[i].length; j++)
            if (ground[i][j] === "." && position[i][j] != "o")
                return;
    alert("Congratulations");
}

function setPlayerPosition() {
    for (let i = 0; i < position.length; i++)
        for (let j = 0; j < position[i].length; j++)
            if (position[i][j] === "x")
                player = { x: i, y: j };
}

function resetLevel() {
    position = copyPosition(originalPosition);
    moveStack = [];
    setPlayerPosition();
    printBoard();
}

function undoLastMove() {
    if (moveStack.length === 0) {
        return;
    }

    let move = moveStack.pop();
    position[move.player.to.x][move.player.to.y] = "x";
    position[move.player.from.x][move.player.from.y] = move.box !== undefined ? "o" : " ";
    if (move.box !== undefined) {
        position[move.box.to.x][move.box.to.y] = "o";
        position[move.box.from.x][move.box.from.y] = " ";
    }
    player = { x: move.player.to.x, y: move.player.to.y };
    printBoard();
}

document.addEventListener('keydown', keydown);