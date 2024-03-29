const fs = require('node:fs/promises')

async function solvePartOne (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()
    
    let totalSum = 0

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        let numberOfMatches = 0
        let tempArray = lines[lineNumber].split(':')
        let secondTempArray = tempArray[1].split('|')
        let winningNumbers = secondTempArray[0].match(/\d+/g)
        let cardNumbers = secondTempArray[1].match(/\d+/g)

        for (let cardNumber of cardNumbers) {
            if (winningNumbers.indexOf(cardNumber) !== -1) numberOfMatches++
        }
        if (numberOfMatches > 0) totalSum += Math.pow(2, Number(numberOfMatches - 1))
    }
    return totalSum
}

async function solvePartTwo (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let gameCards = fileInput.trim().split('\n')
    file.close()

    let totalNumberOfCards = 0

    let arrayOfNumberOfMatches = []

    for (let lineNumber = 0; lineNumber < gameCards.length; lineNumber++) {
        totalNumberOfCards++
        let numberOfMatches = 0
        let tempArray = gameCards[lineNumber].split(':')
        let cardGameNumber = tempArray[0].match(/\d+/g)[0]
        let secondTempArray = tempArray[1].split('|')
        let winningNumbers = secondTempArray[0].match(/\d+/g)
        let cardNumbers = secondTempArray[1].match(/\d+/g)

        if (arrayOfNumberOfMatches[cardGameNumber-1]) {
            numberOfMatches = arrayOfNumberOfMatches[cardGameNumber-1]
        } else {
            for (let cardNumber of cardNumbers) {
                if (winningNumbers.indexOf(cardNumber) !== -1) numberOfMatches++
            }
            arrayOfNumberOfMatches.push(numberOfMatches)
        }
        for (let i = 0; i < numberOfMatches; i++) {
            gameCards.push(gameCards[Number(cardGameNumber) + Number(i)])
        }
    }
    return totalNumberOfCards
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day4'
solvePartOne(dataFolder + '/data/input.txt')
    .then(answer => console.log('Answer:', answer))

solvePartTwo(dataFolder + '/data/input.txt')
// solvePartTwo('./tests/data/input.txt')
    .then(answer => console.log('Answer:', answer))

module.exports = { solvePartOne, solvePartTwo }