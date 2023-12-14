const fs = require('node:fs/promises')

async function solvePartOne (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    
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
    let lines = fileInput.trim().split('\n')

    let totalSum = 0


    return totalSum
}


solvePartOne('./input.txt')
    .then(answer => console.log('Answer:', answer))

// solvePartTwo('./input.txt')
// // solvePartTwo('./tests/data/input.txt')
//     .then(answer => console.log('Answer:', answer))

module.exports = { solvePartOne, solvePartTwo }