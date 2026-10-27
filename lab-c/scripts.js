let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Your Localization</strong>");

if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
    });
} else {
    console.log("No notifications.");
}

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

// ===== 22-drag-and-drop =====
let items = document.querySelectorAll('.item');
for (let item of items) {
    item.addEventListener("dragstart", function(event) {
        this.style.border = "5px dashed #D8D8FF";
        event.dataTransfer.setData("text", this.id);
    });

    item.addEventListener("dragend", function(event) {
        this.style.borderWidth = "0";
    });
}

let targets = document.querySelectorAll(".drag-target");
for (let target of targets) {
    target.addEventListener("dragenter", function (event) {
        this.style.border = "2px solid #7FE9D9";
    });
    target.addEventListener("dragleave", function (event) {
        this.style.border = "2px dashed #7f7fe9";
    });
    target.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    target.addEventListener("drop", function (event) {
        let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
        this.appendChild(myElement)
        this.style.border = "2px dashed #7f7fe9";
    }, false);
}

// ===== podział mapy na kafelki =====
let tilesCount = 16;
let gridSize = Math.sqrt(tilesCount);

function splitMap() {
    let rasterMap = document.getElementById("rasterMap");
    let puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = "";                  // usuń poprzednie kafelki

    let pieceW = Math.floor(rasterMap.width / gridSize);
    let pieceH = Math.floor(rasterMap.height / gridSize);
    let pieces = [];

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let piece = document.createElement("canvas");
            piece.id = "tile-" + (row * gridSize + col);   // poprawna pozycja kafelka
            piece.width = pieceW;
            piece.height = pieceH;
            piece.style.width = (100 / gridSize) + "%";
            piece.style.height = (100 / gridSize) + "%";

            piece.getContext("2d").drawImage(
                rasterMap,
                col * pieceW, row * pieceH, pieceW, pieceH,   // skąd wyciąć
                0, 0, pieceW, pieceH                          // gdzie narysować
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
