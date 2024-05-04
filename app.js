// Create a Player Grid and Enemy Grid

const gridSize = 10;
let playerGrid = [];
let enemyGrid = [];

function createGrid(containerId,grid) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for(let i = 0;i < gridSize; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for(let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        row.appendChild(cell);
        grid.push({row: i, col: j, cell: cell});
        }
        container.appendChild(row)
    }
}
createGrid('playerGrid', playerGrid)




class Ship {
    constructor(name) {
        this.name = name;
        this.parts = parts;

    }
}