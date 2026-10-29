/*Kod wziety i zmodyfikowany z repo */
let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Your Localization</strong>");

/*Wygenerowane Claude oppus 5.5 kod notyfikacji*/
if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
    });
} else {
    console.log("No notifications.");
}

/*Kod wziety i zmodyfikowany z repo */
document.getElementById("Pobranie").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        // here we have the canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");

        // rozdzielczość canvasu = jego rzeczywisty rozmiar na stronie
        rasterMap.width = rasterMap.clientWidth;
        rasterMap.height = rasterMap.clientHeight;

        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

        splitMap();
    });
});

/*Kod wziety i zmodyfikowany z repo */
document.getElementById("Lokalizacja").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
        marker.setLatLng([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

/*Kod wziety i zmodyfikowany z repo */
function addItemListeners(item) {
    item.addEventListener("dragstart", function(event) {
        this.classList.add("dragging");
        event.dataTransfer.setData("text", this.id);
    });

    item.addEventListener("dragend", function(event) {
        this.classList.remove("dragging");
    });
}

/*Kod wziety i zmodyfikowany z repo */
function addTargetListeners(target) {
    target.addEventListener("dragenter", function (event) {
        this.classList.add("over");
    });
    target.addEventListener("dragleave", function (event) {
        this.classList.remove("over");
    });
    target.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    target.addEventListener("drop", function (event) {
        event.preventDefault();
        this.classList.remove("over");

        let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
        let source = myElement.parentElement;
        let existing = this.firstElementChild;

        if (existing && existing !== myElement) {
            source.insertBefore(existing, myElement);
        }

        this.appendChild(myElement)

        updateCellState(this);
        if (source.classList.contains("drag-target")) {
            updateCellState(source);
        }

        checkPuzzle();
    }, false);
}

/*Wygenerowane Claude oppus 5.5 */
function updateCellState(cell) {
    cell.classList.toggle("filled", cell.firstElementChild !== null);
}

/*Kod napisany przy wsparciu Claude oppus 5.5 tlumaczyl jak do tgeo podejsc*/
function checkPuzzle() {
    for (let i = 0; i < tilesCount; i++) {
        let cell = document.getElementById("cell-" + i);
        let tile = cell.firstElementChild;

        if (!tile || tile.id !== "tile-" + i) {
            return;
        }
    }

    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Sukces", {
            body: "Puzzle zostały poprawnie ułożone!"
        });
    }

    setTimeout(() => alert("Sukces"), 0);
}

let tilesCount = 4;
let gridSize = Math.sqrt(tilesCount);

/*Napisane przy wsparciu z repo ci opussa 5.5 on pomagał tlumaczyl ja staralem sie recznie pisac*/
function splitMap() {
    let rasterMap = document.getElementById("rasterMap");
    let puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = "";

    let pieceW = Math.floor(rasterMap.width / gridSize);
    let pieceH = Math.floor(rasterMap.height / gridSize);
    let pieces = [];

    let board = document.getElementById("ukladanie");
    board.innerHTML = "";

    document.documentElement.style.setProperty("--grid-size", gridSize);

    for (let i = 0; i < tilesCount; i++) {
        let cell = document.createElement("div");
        cell.className = "drag-target";
        cell.id = "cell-" + i;
        addTargetListeners(cell);
        board.appendChild(cell);
    }

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let piece = document.createElement("canvas");
            piece.id = "tile-" + (row * gridSize + col);
            piece.className = "item";
            piece.draggable = true;
            addItemListeners(piece);
            piece.width = pieceW;
            piece.height = pieceH;

            piece.getContext("2d").drawImage(
                rasterMap,
                col * pieceW, row * pieceH, pieceW, pieceH,
                0, 0, pieceW, pieceH
            );
            pieces.push(piece);
        }
    }

    while (pieces.length > 0) {
        let i = Math.floor(Math.random() * pieces.length);
        let piece = pieces.splice(i, 1)[0];
        puzzle.appendChild(piece);
    }
}
