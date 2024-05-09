const playButton = document.querySelector('#play-button')
const gridsContainer = document.querySelector('#grids-container')

// Play Button
function play() {}

// Create a Player Grid and Enemy Grid
const gridSize = 10;

function createGrid(user) {
    const gridContainer = document.createElement('div')
    gridContainer.classList.add('board')
    gridContainer.style.backgroundColor = 'gray'
    gridContainer.id = user
    
    for (let i = 0; i<100; i++) {
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
    constructor(name) {
        this.name = name;
        this.parts = parts;

    }
}