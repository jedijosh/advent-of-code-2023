const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
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
        finalValue += Number(stepValue)
    }
    
    return finalValue    
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
    let cleansedFileInput = fileInput.replace(/\n/g, '')

    let finalValue = 0
    let lensBoxes = new Array(256)

    let initializationSequence = cleansedFileInput.split(',')
    for (let sequenceStep = 0; sequenceStep < initializationSequence.length; sequenceStep++) {
        
        let currentSequence = initializationSequence[sequenceStep]
        let parsedValues = currentSequence.match(/(\w+)(=|\-)(\d?)/)
        let label = parsedValues[1]
        let operation = parsedValues[2]
        let focalLength = parsedValues[3] || null
        // If the operation character is a dash (-), go to the relevant box and remove the lens with the given label if it is present in the box. 
        // Then, move any remaining lenses as far forward in the box as they can go without changing their order, filling any space made by removing the indicated lens. 
        // (If no lens in that box has the given label, nothing happens.)
        
        let hashValue = 0
        for ( let characterNumber = 0; characterNumber < label.length; characterNumber++ ) {
            hashValue += label.charCodeAt(characterNumber)
            hashValue = Number(hashValue) * 17
            hashValue = Number(hashValue) % 256
        }
        if (operation === '-') {
            if (!lensBoxes[hashValue]) lensBoxes[hashValue] = []
            let indexToRemove = lensBoxes[hashValue].findIndex(lens => lens.label === label)
            if ( indexToRemove !== -1 ) lensBoxes[hashValue].splice(indexToRemove, 1)

        } else {
            // Operation is '='
            if (!lensBoxes[hashValue]) lensBoxes[hashValue] = []
            let indexToReplace = lensBoxes[hashValue].findIndex(lens => lens.label === label)
            if ( indexToReplace === -1 ) {
                lensBoxes[hashValue].push({ label, focalLength })
            } else {
                lensBoxes[hashValue].splice(indexToReplace, 1, { label, focalLength })
            }
        }
    }

    // Process lens boxes
    for (let boxNumber = 0; boxNumber < lensBoxes.length; boxNumber++) {
        let focusingPower = 0
        if (!lensBoxes[boxNumber]) continue;
        for (let lensNumber = 0; lensNumber < lensBoxes[boxNumber].length; lensNumber++) {
            focusingPower += (boxNumber + 1) * (lensNumber+1) * Number(lensBoxes[boxNumber][lensNumber].focalLength)
        }
        finalValue += focusingPower
    }

    return finalValue
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day15'
// solvePartOne(dataFolder + '/data/tests/input.txt')
// //solvePartOne(dataFolder + '/data/input.txt')

//solvePartTwo(dataFolder + '/data/tests/input.txt')
solvePartTwo(dataFolder + '/data/input.txt')
    .then(answer => console.log('answer:', answer))

module.exports = { solvePartOne, solvePartTwo }