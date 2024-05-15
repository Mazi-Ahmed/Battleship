const gridsContainer = document.querySelector('#grids-container')
const rotateButton = document.querySelector('#rotate-button')
const startButton = document.querySelector('#start-button')
const shipsContainer = document.querySelector('.ships-container')
const reportInfo = document.querySelector('#report-info')
const moveInfo = document.querySelector('#move-info')

let angle = 0
function rotateShips () {
const optionShips = Array.from(shipsContainer.children)
    if (angle === 0) {
        angle = 90
    }else {
        angle = 0
    }
    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}

rotateButton.addEventListener('click', rotateShips)


const width = 10 

function createBoard (color, user) {
    const gridContainer = document.createElement('div')
    gridContainer.classList.add('gameboard')
    gridContainer.style.backgroundColor = color
    gridContainer.id = user

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i 
        gridContainer.append(block)
    }


    gridsContainer.append(gridContainer)
}

createBoard('lightblue', 'player')
createBoard('gray', 'computer')

class Ship {
    constructor(name, length) {
        this.name = name
        this.length = length
    }
}
const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]
let didNotDrop

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
    let validStart;
    if (isHorizontal) {
        validStart = startIndex <= width * width - ship.length ? startIndex : width * width - ship.length;
    } else {validStart = startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width;
    }

    let shipBlocks = []

    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i])
    }else {
        shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
    }
}

let valid

if(isHorizontal) {
shipBlocks.every((_shipBlock, index) =>
    valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index+1)))
} else {
    shipBlocks.every((_shipBlock, index) =>
        valid = shipBlocks[0].id < 90 + (width * index + 1)
    )
}

const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

return {shipBlocks, valid, notTaken}
}

function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`)
    let aBoolean = Math.random() < 0.5
    let isHorizontal = user === 'player' ? angle === 0 : aBoolean
    let randomStartIndex = Math.floor(Math.random() * width * width)

    let startIndex = startId ? startId : randomStartIndex


const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)

if (valid && notTaken) {
shipBlocks.forEach(shipBlock => {
    shipBlock.classList.add(ship.name)
    shipBlock.classList.add('taken')
})
} else {
    if (user === 'computer') addShipPiece('computer', ship, startId)
    if (user === 'player') didNotDrop = true
}
}
ships.forEach(ship => addShipPiece('computer', ship))


let draggedShip 
const optionShips = Array.from(shipsContainer.children)
 optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragShip)
    playerBlock.addEventListener('drop', dropShip)
})
 
function dragStart(e){
    didNotDrop = false
    draggedShip = e.target
 }

function dragShip(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highlight(e.target.id, ship)
}

function dropShip(e) {
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if(!didNotDrop) {
        draggedShip.remove()
    }
}


function highlightShip (startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll('#player div')
    let isHorizontal = angle === 0

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
           shipBlock.classList.add('hover')
           setTimeout(() => shipBlock.classList.remove('hover', 5000)) 
        })
    }
}

let gameOver = false
let playerTurn


function startGame() {
    if (playerTurn === undefined) {
    if (shipsContainer.children.length != 0) {
        reportInfo.textContent = 'Get Your Ships On The Board!'
    } else {
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))        
        playerTurn = true
        moveInfo.textContent = 'Your Move Soldier!'
        reportInfo.textContent = 'GO!'
    }
}
}
startButton.addEventListener('click', startGame)

let playerHits = []
let computerHits = []
const playerDestroyShips = []
const computerDestroyShips = []

function handleClick(e) {
    if(!gameOver) {
        if(e.target.classList.contains('taken')){
            e.target.classList.add('hit')
            reportInfo.textContent = 'You hit the enemy ship'
            let classes = Array.from(e.target.classList)
            classes = classes.filter(className => className  !== 'block')
            classes = classes.filter(className => className !== 'hit')
            classes = classes.filter(className => className !== 'taken')
            playerHits.push(...classes)
            checkScore('player', playerHits, playerDestroyShips)
        }
        if (!e.target.classList.contains('taken')) {
            reportInfo.textContent = 'Nothing hit'
            e.target.classList.add('empty')
        }
        playerTurn = false
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
        setTimeout(computerTurn, 3000)
    }
}


function computerTurn() {
    if (!gameOver)  {
        moveInfo.textContent = 'Enemy Move'
        reportInfo.textContent = 'The enemy is plotting...'
        
        setTimeout(() => {
            let randomMove = Math.floor(Math.random() * width * width)
            const allBoardBlocks = document.querySelectorAll('#player div')

            if (allBoardBlocks[randomMove].classList.contains('taken') &&
            allBoardBlocks[randomMove].classList.contains('hit')
            ){ computerTurn()
            return
        }   else if (
            allBoardBlocks[randomMove].classList.contains('taken') &&
            !allBoardBlocks[randomMove].classList.contains('hit')
        ){
            allBoardBlocks[randomMove].classList.contains('hit')
            reportInfo.textContent = 'The enemy hit your ship!'
            let classes = Array.from(allBoardBlocks[randomMove].classList)
            classes = classes.filter(className => className  !== 'block')
            classes = classes.filter(className => className !== 'hit')
            classes = classes.filter(className => className !== 'taken')
            computerHits.push(...classes)
            checkScore('computer', computerHits, computerDestroyShips)
        } else {
            reportInfo.textContent = 'Nothing hit'
            allBoardBlocks[randomMove].classList.add('empty')
        }
        }, 1000)
        
        setTimeout(() => {
            playerTurn = true
            moveInfo.textContent = 'Your Move!'
            reportInfo.textContent = 'Try to hit the enemy ship'
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
        }, 2000)
    }
}


function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === 'player') {
                reportInfo.textContent = `You destroyed the computer's ${shipName}`
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if (user === 'computer') {
                reportInfo.textContent = `The computer destroyed your ${shipName}`
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
        }
    }
    checkShip('destroyer', 2)
    checkShip('submarine', 3)
    checkShip('cruiser', 3)
    checkShip('battleship', 4)
    checkShip('carrier', 5)

    if(playerDestroyShips.length === 5) {
        reportInfo.textContent = 'You destroyed all the enemy ships. You Won!'
        gameOver = true
    }
    if(computerDestroyShips.length === 5) {
        reportInfo.textContent = 'The enemy destroyed all your ships. You Lost!'
        gameOver = true
    }
}

