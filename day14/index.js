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
        let lineContents = []
        for (let characterNumber = 0; characterNumber < line.length; characterNumber++) {
            // If the current character is a rock, move it as far north as possible.
            if (line[characterNumber] === 'O') {
                let newCharacter = 'O'
                // console.log(`rock position is ${[ lineNumber, characterNumber ] }`)
                let newPosition = await rockPositionAfterMovingAsFarNorthAsPossible(mapLayout, [ lineNumber, characterNumber ])
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

async function solvePartTwo ( filename, numberOfSpins) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let finalNumber = 0
    let mapLayout = []

    // Build initial map layout
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        mapLayout.push(lines[lineNumber])
    }

    let numberOfCharactersInEachRow = mapLayout[0].length

    for (numberOfSpinCycles = 0; numberOfSpinCycles < numberOfSpins; numberOfSpinCycles++) {
        // Move rocks as far North as possible.  Need to go from row 0 to last row
        for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
            let line = mapLayout[lineNumber]
            for (let characterNumber = 0; characterNumber < line.length; characterNumber++) {
                // If the current character is a rock, move it as far north as possible.
                if (line[characterNumber] === 'O') {
                    let newPosition = await rockPositionAfterMovingAsFarNorthAsPossible(mapLayout, [ lineNumber, characterNumber ])
                    let oldPosition = [ lineNumber, characterNumber ]
                    if ( newPosition[0] !== oldPosition[0] || newPosition[1] !== oldPosition[1]  ) {
                        mapLayout = await updateRockPositions(mapLayout, oldPosition, newPosition)
                    }
                }
            }
        }

        // console.log(`map layout after moving north`)
        // for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
        //     console.log(mapLayout[lineNumber])
        // }

        // Move rocks as far West as possible.  Need to go from column 0 to last column
        for (let characterNumber = 0; characterNumber < numberOfCharactersInEachRow; characterNumber++) {
            for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
                let line = mapLayout[lineNumber]
                if (line[characterNumber] === 'O') {
                    let newPosition = await rockPositionAfterMovingAsFarWestAsPossible(mapLayout, [ lineNumber, characterNumber ])
                    let oldPosition = [ lineNumber, characterNumber ]
                    if ( newPosition[0] !== oldPosition[0] || newPosition[1] !== oldPosition[1]  ) {
                        // console.log(`moving rock from ${oldPosition} to ${newPosition}`)
                        mapLayout = await updateRockPositions(mapLayout, oldPosition, newPosition)
                    }
                }
            }            
        }

        // console.log(`map layout after moving west`)
        // for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
        //     console.log(mapLayout[lineNumber])
        // }

        // // Move rocks as far South as possible.  Need to go from last row to row 0
        for (let lineNumber = mapLayout.length - 1; lineNumber >= 0; lineNumber-- ) {
            let line = mapLayout[lineNumber]
            for (let characterNumber = 0; characterNumber < numberOfCharactersInEachRow; characterNumber++) {
                if (line[characterNumber] === 'O') {
                    let newPosition = await rockPositionAfterMovingAsFarSouthAsPossible(mapLayout, [ lineNumber, characterNumber ])
                    let oldPosition = [ lineNumber, characterNumber ]
                    if ( newPosition[0] !== oldPosition[0] || newPosition[1] !== oldPosition[1]  ) {
                        mapLayout = await updateRockPositions(mapLayout, oldPosition, newPosition)
                    }
                }
            }
        }

        // console.log(`map layout after moving south`)
        // for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
        //     console.log(mapLayout[lineNumber])
        // }

        // // Move rocks as far East as possible.  Need to go from last column to column 0
        for (let characterNumber = numberOfCharactersInEachRow - 1; characterNumber >= 0; characterNumber--) {
            for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
                let line = mapLayout[lineNumber]
                if (line[characterNumber] === 'O') {
                    let newPosition = await rockPositionAfterMovingAsFarEastAsPossible(mapLayout, [ lineNumber, characterNumber ])
                    let oldPosition = [ lineNumber, characterNumber ]
                    if ( newPosition[0] !== oldPosition[0] || newPosition[1] !== oldPosition[1]  ) {
                        mapLayout = await updateRockPositions(mapLayout, oldPosition, newPosition)
                    }
                }
            }
        }
    }

    // console.log(`map layout after spin cycle ${numberOfSpinCycles}`)
    // for (let lineNumber = 0; lineNumber < mapLayout.length; lineNumber++ ) {
    //     console.log(mapLayout[lineNumber])
    // }
    
    // Calculate rock load based on current map layout
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

async function updateRockPositions (mapLayout, oldRockPosition, newRockPosition) {
     // Update the row the rock ended up in
     let newMapLayout = mapLayout
     let newRowNumber = newRockPosition[0]
     let newColumnNumber = newRockPosition[1]
     let oldRowNumber = oldRockPosition[0]
     let oldColumnNumber = oldRockPosition[1]

    let oldLine = mapLayout[oldRowNumber]
    //  let newLine = oldLine.substring(0, newRockPosition[1]) + 'O' + oldLine.substring(newRockPosition[1] + 1)
    //  newMapLayout[newRockPosition[0]] = newLine
 
    //console.log(`moving rock from ${oldRockPosition} to ${newRockPosition}`)
    // If the rock moved within the row, the "old" row has already been updated. 
    // If the rock moved to a new row, need to update the "old" and "new" rows. 
    if (newRowNumber === oldRowNumber) {
        // Put a rock in the new location
        let newLine = oldLine.substring(0, newColumnNumber) + 'O' + oldLine.substring(newColumnNumber + 1)
        // Put an empty space where the old rock was 
        newLine = newLine.substring(0, oldColumnNumber) + '.' + newLine.substring(oldColumnNumber + 1)   
        //console.log('newLine:', newLine)
        newMapLayout[newRowNumber] = newLine
     } else {
        let lineRockIsMovingTo = mapLayout[newRowNumber].substring(0, newColumnNumber) + 'O' + mapLayout[newRowNumber].substring(newColumnNumber + 1)
        //console.log('line rock is moving to:', lineRockIsMovingTo)
        newMapLayout[newRowNumber] = lineRockIsMovingTo

        let lineRockMovedFrom = oldLine.substring(0, oldColumnNumber) + '.' + oldLine.substring(oldColumnNumber + 1)
        //console.log('old row updated to:', lineRockMovedFrom)
        newMapLayout[oldRowNumber] = lineRockMovedFrom
     }

     return newMapLayout
}

async function rockPositionAfterMovingAsFarWestAsPossible ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    while (await canRockMoveWest(mapLayout, rockPosition)) {
        rockColumn = rockColumn - 1
        rockPosition = [rockRow, rockColumn]
    }
    return rockPosition
}

async function canRockMoveWest ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]    
    if (rockColumn > 0 && mapLayout[rockRow][rockColumn - 1] === '.') {
        return true
    } else {
        return false
    }
}

async function rockPositionAfterMovingAsFarSouthAsPossible ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    while (await canRockMoveSouth(mapLayout, rockPosition)) {
        rockRow = rockRow + 1
        rockPosition = [rockRow, rockColumn]
    }
    return rockPosition
}

async function canRockMoveSouth ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    if (rockRow < mapLayout.length - 1 && mapLayout[rockRow + 1][rockColumn] === '.') {
        return true
    } else {
        return false
    }
}

async function rockPositionAfterMovingAsFarEastAsPossible ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    while (await canRockMoveEast(mapLayout, rockPosition)) {
        rockColumn = rockColumn + 1
        rockPosition = [rockRow, rockColumn]
    }
    return rockPosition
}

async function canRockMoveEast ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    if (rockColumn < mapLayout[rockRow].length - 1 && mapLayout[rockRow][rockColumn + 1] === '.') {
        return true
    } else {
        return false
    }
}

async function rockPositionAfterMovingAsFarNorthAsPossible ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    while (await canRockMoveNorth(mapLayout, rockPosition)) {
        rockRow = rockRow - 1
        rockPosition = [rockRow, rockColumn]
    }
    return rockPosition
}

async function canRockMoveNorth ( mapLayout, rockPosition ) {
    let rockRow = rockPosition[0]
    let rockColumn = rockPosition[1]
    if (rockRow > 0 && mapLayout[rockRow - 1][rockColumn] === '.') {
        return true
    } else {
        return false
    }
}



solvePartOne('./tests/data/input.txt')
// solvePartOne('./input.txt')
    .then(finalNumber => console.log('finalNumber:', finalNumber))

//solvePartTwo('./tests/data/input.txt')
// solvePartTwo('./input.txt', 1000)
    // .then(finalNumber => console.log('finalNumber:', finalNumber))

module.exports = { solvePartOne, solvePartTwo }