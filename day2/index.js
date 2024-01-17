const fs = require('node:fs/promises')

const LOGGING = false

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
    let lines = fileInput.trim().split('\n')

    let sumOfPossibleGames = 0

    for (const gameInstance of lines) {
        let gameWasPossible = true
        let gameData = gameInstance.split(':')
        let gameNumber = gameData[0].match(/\d+/)
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
                if (LOGGING) console.log(`${gameNumber} was not possible`)
            }
        }
        if (gameWasPossible) sumOfPossibleGames += Number(gameNumber)
    }
    return sumOfPossibleGames
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
    let lines = fileInput.trim().split('\n')

    let sumOfGames = 0

    for (const gameInstance of lines) {
        let gameData = gameInstance.split(':')
        let turns = gameData[1].split(';')
        let maxNumberOfRed = 0
        let maxNumberOfGreen = 0
        let maxNumberOfBlue = 0
        for (const turn of turns) {
            let numberOfRed = 0
            let numberOfGreen = 0
            let numberOfBlue = 0
            let cubePulls = turn.split(",")
            for (const pull of cubePulls) {
                let numberOfCubes = Number(pull.match(/\d+/))
                if (pull.search(/red/) !== -1) numberOfRed = numberOfCubes
                if (pull.search(/green/) !== -1) numberOfGreen = numberOfCubes
                if (pull.search(/blue/) !== -1) numberOfBlue = numberOfCubes
            }
            if (numberOfRed > maxNumberOfRed) maxNumberOfRed = numberOfRed
            if (numberOfGreen > maxNumberOfGreen) maxNumberOfGreen = numberOfGreen
            if (numberOfBlue > maxNumberOfBlue) maxNumberOfBlue = numberOfBlue
        }
        
        sumOfGames += (maxNumberOfRed * maxNumberOfGreen * maxNumberOfBlue)
    }
    return sumOfGames
}

async function isTurnPossible (numberOfRed, numberOfGreen, numberOfBlue) {
    const MAX_RED_CUBES = 12
    const MAX_GREEN_CUBES = 13
    const MAX_BLUE_CUBES = 14
    return ( numberOfRed <= MAX_RED_CUBES && numberOfGreen <= MAX_GREEN_CUBES && numberOfBlue <= MAX_BLUE_CUBES )
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day2'
solvePartOne(dataFolder + '/data/input.txt')
    .then(sumOfPossibleGames => console.log('sumOfPossibleGames:', sumOfPossibleGames))

solvePartTwo(dataFolder + '/data/input.txt')
    .then(sumOfGames => console.log('sumOfGames:', sumOfGames))

module.exports = { solvePartOne, solvePartTwo }