"use strict";
const WALL = 1;
const FRUIT = 2;
const SNAKE_TAIL = 3;
const VOID = 4;
const DIR_NORTH = 0;
const DIR_EST = 1;
const DIR_SOUTH = 2;
const DIR_WEST = 3;
const ARROW_UP = 38;
const ARROW_DOWN = 40;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
let snakeDir = DIR_NORTH;

document.addEventListener("DOMContentLoaded", function () {
    updateContent();

    window.addEventListener("hashchange", function () {
        updateContent();
    });

    window.addEventListener("resize", function () {
        let ratio = 0.75;
        let elem = document.getElementById("snake-canvas");
        elem.setAttribute("width", document.querySelector("body").offsetHeight*ratio);
        elem.setAttribute("height", document.querySelector("body").offsetHeight*ratio);
    });
});

function updateContent() {
    if (window.location.hash.length > 1) {
        changeLevel(window.location.hash.substr(1));
    } else {
        document.getElementById("content").innerHTML = "<div><a href=\"#1\">Niveau 1</a><a href=\"#2\">Niveau 2</a></div>";
    }
}

function changeLevel(id) {
    let w = document.querySelector("body").offsetHeight*0.75;
    let h = document.querySelector("body").offsetHeight*0.75;
    document.getElementById("content").setAttribute("data-return", "YEAH");
    document.getElementById("content").innerHTML = "<div><a href='./'>Retour</a></div><canvas id='snake-canvas' data-level='" + id + "' width='"+w+"' height='"+h+"'>Votre navigateur ne supporte pas les canvas</canvas>";
    getLevel(id);
}

function getLevel(id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (evt) {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            loadLevel(JSON.parse(this.responseText));
        }
    };

    xhttp.open("GET", "./assets/levels/level" + id + ".json", true);
    xhttp.send();
}

function loadLevel(data) {
    let canvas = document.getElementById("snake-canvas");
    let pxX = canvas.width / data['dimensions'][0];
    let pxY = canvas.height / data['dimensions'][1];

    let ctx = canvas.getContext("2d");
    let gameTable = Array(data['dimensions'][0]);
    for (let i = 0; i < data['dimensions'][1]; i++) {
        gameTable[i] = Array(data['dimensions'][1]);
    }

    for (let i = 0; i < data['walls'].length; i++) {
        for (let j = data['walls'][i][0]; j <= data['walls'][i][2]; j++) {
            for (let k = data['walls'][i][1]; k <= data['walls'][i][3]; k++) {
                gameTable[j][k] = WALL;
            }
        }
    }

    gameTable[data['fruit'][0]][data['fruit'][1]] = FRUIT;

    document.addEventListener("keydown", function (evt) {
        if (evt.keyCode == ARROW_UP) snakeDir = DIR_NORTH;
        else if (evt.keyCode == ARROW_RIGHT) snakeDir = DIR_EST;
        else if (evt.keyCode == ARROW_DOWN) snakeDir = DIR_SOUTH;
        else if (evt.keyCode == ARROW_LEFT) snakeDir = DIR_WEST;
    });

    loadImages(function (fruit, snakeHead, snakeTail, wall, win) {
        renderGame(fruit, snakeHead, snakeTail, wall, win, ctx, data, pxX, pxY, gameTable, data['snake'][0], data['snake'][1], data['delay'], new Array());
    });
}

function loadImages(callback) {
    let countImg = 0;
    let fruit = new Image();
    let snakeHead = new Image();
    let snakeTail = new Image();
    let wall = new Image();
    let win = new Image();

    fruit.src = "./assets/images/Brigitte.png";
    fruit.addEventListener("load", function () {
        countImg++;
        if (countImg == 5) callback(fruit, snakeHead, snakeTail, wall, win);
    });

    snakeHead.src = "./assets/images/Cronmac.png";
    fruit.addEventListener("load", function () {
        countImg++;
        if (countImg == 5) callback(fruit, snakeHead, snakeTail, wall, win);
    });

    snakeTail.src = "./assets/images/CRS.png";
    snakeTail.addEventListener("load", function () {
        countImg++;
        if (countImg == 5) callback(fruit, snakeHead, snakeTail, wall, win);
    });

    wall.src = "./assets/images/GJ.png";
    wall.addEventListener("load", function () {
        countImg++;
        if (countImg == 5) callback(fruit, snakeHead, snakeTail, wall, win);
    });

    win.src = "./assets/images/win%20GJ.jpg";
    win.addEventListener("load", function () {
        countImg++;
        if (countImg == 5) callback(fruit, snakeHead, snakeTail, wall, win);
    });
}

function renderGame(fruit, snakeHead, snakeTail, wall, win, ctx, data, pxX, pxY, gameTable, snakeHeadX, snakeHeadY, delay, snakeArray) {
    gameTable[snakeHeadX][snakeHeadY] = VOID;

    snakeArray[snakeArray.length] = JSON.parse(JSON.stringify({x: snakeHeadX, y: snakeHeadY}));

    if (snakeDir == DIR_NORTH) snakeHeadY--;
    else if (snakeDir == DIR_EST) snakeHeadX++;
    else if (snakeDir == DIR_SOUTH) snakeHeadY++;
    else if (snakeDir == DIR_WEST) snakeHeadX--;

    if (snakeHeadX < 0 || snakeHeadX >= gameTable.length || snakeHeadY < 0 || snakeHeadY >= gameTable[0].length || gameTable[snakeHeadX][snakeHeadY] == WALL) {
        ctx.drawImage(win, 0, 0, gameTable.length * pxX, gameTable[0].length * pxY);
        return;
    } else if (gameTable[snakeHeadX][snakeHeadY] == FRUIT) {
        let fx, fy;
        do {
            fx = Math.floor(Math.random() * gameTable.length);
            fy = Math.floor(Math.random() * gameTable[0].length);
            if (gameTable[fx][fy] == undefined) break;
        } while (gameTable[fx][fy] != VOID);
        gameTable[fx][fy] = FRUIT;
    } else {
        for (let i = 0; i < snakeArray.length; i++) {
            if (snakeArray[i]['x'] == snakeHeadX && snakeArray[i]['y'] == snakeHeadY) {
                ctx.drawImage(win, 0, 0, gameTable.length * pxX, gameTable[0].length * pxY);
                return;
            }
        }
        snakeArray.shift();
    }

    for (let i = 0; i < gameTable.length; i++) {
        for (let j = 0; j < gameTable[i].length; j++) {
            if (gameTable[i][j] == WALL) {
                ctx.drawImage(wall, i * pxX, j * pxY, pxX, pxY);
            } else if (gameTable[i][j] == FRUIT) {
                ctx.drawImage(fruit, i * pxX, j * pxY, pxX, pxY);
            } else if (gameTable[i][j] == SNAKE_TAIL) {
                ctx.drawImage(snakeTail, i * pxX, j * pxY, pxX, pxY);
            } else if (gameTable[i][j] == VOID) {
                ctx.clearRect(i * pxX, j * pxY, pxX, pxY);
            }
        }
    }

    for (let i = 0; i < snakeArray.length; i++) {
        ctx.drawImage(snakeTail, snakeArray[i]['x'] * pxX, snakeArray[i]['y'] * pxY, pxX, pxY);
    }

    ctx.drawImage(snakeHead, snakeHeadX * pxX, snakeHeadY * pxY, pxX, pxY);

    setTimeout(renderGame, delay, fruit, snakeHead, snakeTail, wall, win, ctx, data, pxX, pxY, gameTable, snakeHeadX, snakeHeadY, delay, snakeArray);
}