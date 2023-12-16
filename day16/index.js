const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()

    let lines = fileInput.trim().split('\n')
    let obstacleMap = new Array(lines.length)
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        obstacleMap[lineNumber] = []
        let matches = lines[lineNumber].matchAll(/[^\.]/g)
        let rangeStart = 0
        for (let match of matches ) {
            console.log('match:', match)
            let rangeEnd = match.index
            obstacleMap[lineNumber].push({rangeStart, rangeEnd, character: match[0]})
            rangeStart = rangeEnd
            // if (match.index)
        }
    }
    console.log('obstacleMap:', obstacleMap)

    let finalValue = 0

    let cleansedFileInput = fileInput.replace(/\n/g, '')
    let initializationSequence = cleansedFileInput.split(',')
    
    // Store each row and non-empty spaces in each row

    let energizedMap = []
    
    return finalValue    
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
    let cleansedFileInput = fileInput.replace(/\n/g, '')

    let finalValue = 0

    return finalValue
}

solvePartOne('./tests/data/input.txt')
// //solvePartOne('./input.txt')
    .then(answer => console.log('answer:', answer))

//solvePartTwo('./tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day16/input.txt')
//  solvePartTwo('./input.txt')
    // .then(answer => console.log('answer:', answer))

module.exports = { solvePartOne, solvePartTwo }