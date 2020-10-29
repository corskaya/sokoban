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
let playerDirection = 'playerDown';
let undoCount = 0;
let currentLevel = +localStorage.getItem('currentLevel') || 0;

['ground', 'redbox', 'target', 'wall', 'yellowbox', 'playerUp', 'playerDown', 'playerLeft', 'playerRight'].forEach(name => {
    const img = new Image();
    img.src = `images/${name}.png`;
    img.alt = name;
    images[name] = img;
});

window.onload = () => {
    setPlayerPosition();
    printBoard();
}

createLevel(levels[currentLevel]);

function createLevel(level) {
    playerDirection = 'playerDown'
    moveStack = [];
    undoCount = 0;
    let groundRow = [];
    let positionRow = [];
    ground = [];
    position = [];
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
    setPlayerPosition();
    canvas.width = ground[0].length * 64;
    canvas.height = ground.length * 64 + 60;
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
                ctx.drawImage(images[playerDirection], j * 64 + 13.5, i * 64 + 2.5);
            }
            if (rows[i][j] === "X") {
                ctx.drawImage(images.target, j * 64 + 16, i * 64 + 16);
                ctx.drawImage(images[playerDirection], j * 64 + 13.5, i * 64 + 2.5);
            }
        }
    }

    printInfo();
}

function printInfo() {
    let info = `Move: ${moveStack.length} Undo: ${undoCount} Box: ${getRemainingBoxCount()} Level: ${currentLevel + 1}`;
    var ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.textBaseline = 'top';
    ctx.clearRect(0, position.length * 64, position.length * 64, 60);
    ctx.fillText(info, 10, position.length * 64 + 10);
}

function getRemainingBoxCount() {
    let count = 0;

    for (let i = 0; i < ground.length; i++) {
        for (let j = 0; j < ground[i].length; j++) {
            if (ground[i][j] === "." && position[i][j] !== "o")
                count++;
        }
    }

    return count;
}

function keydown(e) {
    if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight") {
        movePlayer(e.code);
    } else if (e.code === "KeyR") {
        resetLevel();
    } else if (e.code === "KeyU") {
        undoLastMove();
    } else if (e.code === "KeyG") {
        goToLevel();
    } else if (e.code === "KeyP") {
        previousLevel();
    } else if (e.code === "KeyN") {
        nextLevel();
    }
}

function movePlayer(direction) {
    switch (direction) {
        case 'ArrowUp':
            playerDirection = 'playerUp';
            break;

        case 'ArrowDown':
            playerDirection = 'playerDown';
            break;

        case 'ArrowLeft':
            playerDirection = 'playerLeft';
            break;

        case 'ArrowRight':
            playerDirection = 'playerRight';
            break;
    }
    printBoard();

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
    nextLevel();
}

function setPlayerPosition() {
    for (let i = 0; i < position.length; i++)
        for (let j = 0; j < position[i].length; j++)
            if (position[i][j] === "x")
                player = { x: i, y: j };
}

function resetLevel() {
    playerDirection = 'playerDown'
    position = copyPosition(originalPosition);
    moveStack = [];
    undoCount = 0;
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
    undoCount++;

    printBoard();
}

function goToLevel() {
    var level = prompt('Enter a level number(1-1000)', currentLevel + 1);
    if (isNaN(level) || + (+level < 1 || +level > 1000)) {
        goToLevel();
        return;
    }
    changeLevel(+level - 1);
}

function previousLevel() {
    if (currentLevel === 0) return
    changeLevel(currentLevel - 1);
}

function nextLevel() {
    if (currentLevel > levels.length - 2) return;
    changeLevel(currentLevel + 1);
}

function changeLevel(level) {
    currentLevel = level;
    createLevel(levels[currentLevel]);
    localStorage.setItem('currentLevel', currentLevel);
    printBoard();
}

document.addEventListener('keydown', keydown);