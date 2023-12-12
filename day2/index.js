const fs = require('node:fs/promises')

async function solvePartOne () {
    let file = await fs.open('./input.txt')
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')

    let sumOfPossibleGames = 0

    for (const gameInstance of lines) {
        let gameWasPossible = true
        let gameData = gameInstance.split(':')
        let gameNumber = gameData[0].match(/\d/)
        let turns = gameData[1].split(';')
        for (const turn of turns) {
            if (!gameWasPossible) continue
            let numberOfRed = 0
            let numberOfGreen = 0
            let numberOfBlue = 0
            let cubePulls = turn.split(",")
            for (const pull of cubePulls) {
                let numberOfCubes = Number(pull.match(/\d+/))
                if (pull.search(/red/) !== -1) numberOfRed += numberOfCubes
                if (pull.search(/green/) !== -1) numberOfGreen += numberOfCubes
                if (pull.search(/blue/) !== -1) numberOfBlue += numberOfCubes
            }
            if (!await isTurnPossible(numberOfRed, numberOfGreen, numberOfBlue)) {
                gameWasPossible = false
                console.log('game was not possible')
            }
        }
        if (gameWasPossible) sumOfPossibleGames += Number(gameNumber)
    }
    return sumOfPossibleGames
}

async function isTurnPossible (numberOfRed, numberOfGreen, numberOfBlue) {
    const MAX_RED_CUBES = 12
    const MAX_GREEN_CUBES = 13
    const MAX_BLUE_CUBES = 12
    return ( numberOfRed <= MAX_RED_CUBES && numberOfGreen <= MAX_GREEN_CUBES && numberOfBlue <= MAX_BLUE_CUBES )
}

solvePartOne()
    .then(sumOfPossibleGames => console.log('sumOfPossibleGames:', sumOfPossibleGames))

module.exports = { solvePartOne }