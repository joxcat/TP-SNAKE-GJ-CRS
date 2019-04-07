"use strict";
const WALL = 1;
const FRUIT = 2;
const SNAKE_TAIL = 3;
const DIR_NORTH = 0;
const DIR_EST = 1;
const DIR_SOUTH = 2;
const DIR_WEST = 3;

document.addEventListener("DOMContentLoaded", function () {
    updateContent();

    window.addEventListener("hashchange", function () {
        updateContent();
    });

    window.addEventListener("resize", function () {
        let ratio = 0.7;
        let elem = document.getElementById("snake-canvas");
        elem.setAttribute("width", document.querySelector("body").offsetWidth*ratio);
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
    let w = document.querySelector("body").offsetWidth*0.97;
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

    console.log(pxX + " " + pxY + " -> " + canvas.width + " " + canvas.height);

    let ctx = canvas.getContext("2d");
    let gameTable = Array(data['dimensions'][0]);
    for (let i = 0; i < data['dimensions'][1]; i++) {
        gameTable[i] = Array(data['dimensions'][1]);
    }

    console.log(gameTable);

    for (let i = 0; i < data['walls'].length; i++) {
        console.log(data['walls'][i]);
        for (let j = data['walls'][i][0]; j <= data['walls'][i][2]; j++) {
            for (let k = data['walls'][i][1]; k <= data['walls'][i][3]; k++) {
                gameTable[j][k] = WALL;
            }
        }
    }

    gameTable[data['fruit'][0]][data['fruit'][1]] = FRUIT;

    loadImages(function (fruit, snakeHead, snakeTail, wall) {
        renderGame(fruit, snakeHead, snakeTail, wall, ctx, data, pxX, pxY, gameTable, data['snake'][0], data['snake'][1], DIR_EST);
    });
}

function loadImages(callback) {
    let countImg = 0;
    let fruit = new Image();
    let snakeHead = new Image();
    let snakeTail = new Image();
    let wall = new Image();

    fruit.src = "./assets/images/Brigitte.png";
    fruit.addEventListener("load", function () {
        countImg++;
        if (countImg == 4) callback(fruit, snakeHead, snakeHead, wall);
    });

    snakeHead.src = "./assets/images/Cronmac.png";
    fruit.addEventListener("load", function () {
        countImg++;
        if (countImg == 4) callback(fruit, snakeHead, snakeHead, wall);
    });

    snakeTail.src = "./assets/images/CRS.png";
    snakeTail.addEventListener("load", function () {
        countImg++;
        if (countImg == 4) callback(fruit, snakeHead, snakeHead, wall);
    });

    wall.src = "./assets/images/GJ.png";
    wall.addEventListener("load", function () {
        countImg++;
        if (countImg == 4) callback(fruit, snakeHead, snakeHead, wall);
    });
}

function renderGame(fruit, snakeHead, snakeTail, wall, ctx, data, pxX, pxY, gameTable, snakeHeadX, snakeHeadY, snakeDir) {
    ctx.drawImage(snakeHead, snakeHeadX * pxX, snakeHeadY * pxY, pxX, pxY);
    for (let i = 0; i < gameTable.length; i++) {
        for (let j = 0; j < gameTable[i].length; j++) {
            if (gameTable[i][j] == WALL) {
                ctx.drawImage(wall, i * pxX, j * pxY, pxX, pxY);
            } else if (gameTable[i][j] == FRUIT) {
                ctx.drawImage(fruit, i * pxX, j * pxY, pxX, pxY);
            } else if (gameTable[i][j] == SNAKE_TAIL) {
                ctx.drawImage(snakeTail, i * pxX, j * pxY, pxX, pxY);
            }
        }
    }
}