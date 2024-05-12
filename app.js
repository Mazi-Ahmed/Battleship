const rocketContainer = document.querySelector('.rocket-container')
const playButton = document.querySelector('#play-button')
const gridsContainer = document.querySelector('#grids-container')
const rotateButton = document.querySelector('#rotate-button')
// Play Button
// function play() {}

// Rotate Ships
var angle = 0
function rotate () {
    if (angle === 0) {
        angle = 90 
    } else {
        angle = 0
    }
    Array.from(rocketContainer.children).forEach(rocket => rocket.style.transform = `rotate(${angle}deg)`)
}

rotateButton.addEventListener('click',rotate)

// Create a Player Grid and Enemy Grid
const gridSize = 10;

function createGrid(user) {
    const gridContainer = document.createElement('div')
    gridContainer.classList.add('board')
    gridContainer.style.backgroundColor = 'gray'
    gridContainer.id = user
    
    for (let i = 0; i< gridSize * gridSize; i++) {
        const plotBox = document.createElement('div')
        plotBox.classList.add('plotbox')
        plotBox.id = i
        gridContainer.append(plotBox)
    }
    gridsContainer.append(gridContainer)
}
createGrid('player')
createGrid('CPU')

// Create Ships

class Ship {
    constructor(name, parts) {
        this.name = name;
        this.parts = parts;

    }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

// Place Ships on Board
// function placeShipOnBoard(ship) {
//     const boardPieces = document.querySelectorAll('#CPU div')
//     let randomBoolean = Math.random() < 0.5
//     let shipHorizontal = randomBoolean
//     let randomShipIndex = Math.floor(Math.random() * gridSize * gridSize)
//     console.log(randomShipIndex)

//     let checkPlot = shipHorizontal ? randomShipIndex <= gridSize * gridSize - ship.parts ? randomShipIndex :
//         gridSize * gridSize - ship.parts :
//         randomShipIndex <= gridSize * gridSize - gridSize * ship.parts ? randomShipIndex :
//             randomShipIndex - ship.parts * gridSize + gridSize

//     let shipPieces = []

//     for (let i = 0; i < ship.parts; i++) {
//         if (shipHorizontal) {
//             shipPieces.push(boardPieces[Number(checkPlot) + i])
//         } else {
//             shipPieces.push(boardPieces[Number(checkPlot) + i * gridSize])
//         }
//     }
//     let check 
//     if (shipHorizontal) {
//         shipPieces.every((_shipPiece, index) => 
//         check = shipPieces[0].id % gridSize !== gridSize - (shipPieces.length - (index + 1)))
//     } else {
//         shipBlocks.every((_shipPiece, index) =>
//             check = shipPieces[0].id < 90 + (gridSize * index + 1)
//             )
//     }
//     const freeSpace = shipPieces.every(shipPiece => !shipPiece.classList.contains('placed'))
//     if (check && freeSpace) {
//         shipPieces.forEach(shipPiece => {
//             shipPiece.classList.add(ship.name)
//             shipPiece.classList.add('placed')
//     })
//     } else {
//         placeShipOnBoard(ship)
//     }
// } 
// ships.forEach(ship => placeShipOnBoard(ship))

function placeShipOnBoard(ship) {
    const boardPieces = document.querySelectorAll('#CPU .plotbox');
    let shipHorizontal = Math.random() < 0.5;
    let randomShipIndex = Math.floor(Math.random() * (gridSize * gridSize - ship.parts));
    
    let shipPieces = [];
    for (let i = 0; i < ship.parts; i++) {
        let index = shipHorizontal ? randomShipIndex + i : randomShipIndex + i * gridSize;
        shipPieces.push(boardPieces[index]);
    }

    // Check if ship can be placed without overflowing the grid
    let canPlaceShip = true;
    shipPieces.forEach(shipPiece => {
        if (shipPiece === undefined || shipPiece.classList.contains('placed')) {
            canPlaceShip = false;
        }
    });

    if (canPlaceShip) {
        shipPieces.forEach(shipPiece => {
            shipPiece.classList.add(ship.name);
            shipPiece.classList.add('placed');
        });
    } else {
        placeShipOnBoard(ship);
    }
} 
ships.forEach(ship => placeShipOnBoard(ship))