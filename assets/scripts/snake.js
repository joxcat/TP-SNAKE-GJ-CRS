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
        changeLevel(window.location.hash.substr(1))
    } else {
        document.getElementById("content").innerHTML = "<div><a href=\"#1\">Niveau 1</a><a href=\"#2\">Niveau 2</a></div>";
    }
}

function changeLevel(id) {
    let ratio = 0.7;
    let w = document.querySelector("body").offsetWidth*ratio;
    let h = document.querySelector("body").offsetHeight*ratio;
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

function loadLevel() {
    
}