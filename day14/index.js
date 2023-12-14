const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let finalNumber = 0
    let mapLayout = []

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        let line = lines[lineNumber]
        // mapLayout.push(line)
        let lineContents = []
        for (let characterNumber = 0; characterNumber < line.length; characterNumber++) {
            // If the current character is a rock, move it as far north as possible.
            if (line[characterNumber] === 'O') {
                let newCharacter = 'O'
                // console.log(`rock position is ${[ lineNumber, characterNumber ] }`)
                let newPosition = rockPositionAfterMovingAsFarNorthAsPossible(mapLayout, [ lineNumber, characterNumber ])
                // console.log(`newPosition is ${newPosition}`)
                if (newPosition[0] !== lineNumber ) {
                    // Update new location with a rock symbol
                    // console.log(`updating ${newPosition[0]}, ${newPosition[1]}`)
                    let oldLine = mapLayout[newPosition[0]]
                    let newLine = oldLine.substring(0, newPosition[1]) + 'O' + oldLine.substring(newPosition[1] + 1)
                    mapLayout[newPosition[0]] = newLine
                    newCharacter = '.'
                }
                lineContents.push(newCharacter)
            } else {
                lineContents.push(line[characterNumber])
            }
        }
        mapLayout.push(lineContents.join(''))
    }

    let rockLoad = 1
    for (let lineNumber = mapLayout.length - 1; lineNumber >= 0; lineNumber--) {
        let line = mapLayout[lineNumber]
        for (let characterNumber = 0; characterNumber < line.length; characterNumber++) {
            if (line[characterNumber] === 'O') {
                finalNumber += rockLoad
            }
        }
        rockLoad++
    }
    return finalNumber
}

function rockPositionAfterMovingAsFarNorthAsPossible ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    while (canRockMoveNorth(mapLayout, rockPosition)) {
        rockRow = rockRow - 1
        rockPosition = [rockRow, rockColumn]
    }
    return rockPosition
}

function canRockMoveNorth ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    if (rockRow > 0 && mapLayout[rockRow - 1][rockColumn] === '.') {
        return true
    } else {
        return false
    }
}



// solvePartOne('./tests/data/input.txt')
solvePartOne('./input.txt')
    .then(finalNumber => console.log('finalNumber:', finalNumber))

// solvePartTwo('./input.txt')
//     .then(finalNumber => console.log('finalNumber:', finalNumber))

module.exports = { solvePartOne }