const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    // let lines = fileInput.trim().split('\n')
    file.close()

    let finalValue = 0

    let cleansedFileInput = fileInput.replace(/\n/g, '')
    let initializationSequence = cleansedFileInput.split(',')
    for (let sequenceStep = 0; sequenceStep < initializationSequence.length; sequenceStep++) {
        let stepValue = 0
        let currentSequence = initializationSequence[sequenceStep]
        for ( let characterNumber = 0; characterNumber < currentSequence.length; characterNumber++ ) {
            stepValue += currentSequence.charCodeAt(characterNumber)
            stepValue = Number(stepValue) * 17
            stepValue = Number(stepValue) % 256
        }
        // console.log(`adding ${stepValue} to finalValue`)
        finalValue += Number(stepValue)
    }
    
    return finalValue    
}

async function findDestinationValue ( searchValue, arrayOfRanges) {
    
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    
}

//  solvePartOne('./tests/data/input.txt')
solvePartOne('./input.txt')
    .then(answer => console.log('answer:', answer))

    // NOT 521351 - too high

// solvePartTwo('./input.txt')
//     .then(sumOfGames => console.log('sumOfGames:', sumOfGames))

module.exports = { solvePartOne, solvePartTwo }