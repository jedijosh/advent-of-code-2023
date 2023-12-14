const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')

    let finalNumber = 0
    let pattern = []

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        if (lines[lineNumber].trim() === '' || lineNumber === (lines.length - 1)) {
            console.log('looking for reflections')
            let numberOfRowsAboveReflection = await findHorizontalReflection(pattern)
            if (numberOfRowsAboveReflection !== 0 ) console.log(`reflection found at row ${numberOfRowsAboveReflection}`)
            let columnsAsRows = await transposeColumnsToRows(pattern)
            console.log('columnsAsRows:', columnsAsRows)
            let numberOfColumnsLeftOfTheReflection = await findHorizontalReflection(columnsAsRows)
            console.log('number:', numberOfColumnsLeftOfTheReflection)
            if (numberOfColumnsLeftOfTheReflection !== 0 ) console.log(`reflection found at column ${numberOfColumnsLeftOfTheReflection}`)
            pattern = []
            finalNumber = finalNumber + (numberOfRowsAboveReflection * 100) + numberOfColumnsLeftOfTheReflection
        } else {
            pattern.push(lines[lineNumber])
        }
    }
    return finalNumber
}

// If returns 0, no reflection was found.
async function findHorizontalReflection ( patternArray) {
    let reflectionLocation = 0
    let previousRow
    let currentRow
    // Start searching at the second row (index 1) so there are 2 rows to compare
    for (let rowNumber = 1; rowNumber < patternArray.length; rowNumber++) {
        previousRow = patternArray[rowNumber - 1]
        currentRow = patternArray[rowNumber]
        if ( previousRow === currentRow ) {
            console.log(`tentative reflection at ${rowNumber}`)
            // Check the remainder of the rows to determine if this is a reflection
            let isReflection = true
            let numberOfRowsToCheck = Math.min(rowNumber - 1, patternArray.length - rowNumber - 1)
            // console.log(`need to check ${numberOfRowsToCheck} rows`)
            for (let rowsToCheckForReflection = 1; rowsToCheckForReflection <= numberOfRowsToCheck; rowsToCheckForReflection++) {
                let firstRow = patternArray[rowNumber - 1 - rowsToCheckForReflection]
                let secondRow = patternArray[rowNumber + rowsToCheckForReflection]
                if ( firstRow !== secondRow ) {
                    isReflection = false
                    console.log('not a reflection')
                    break
                }
            }
            if (isReflection) {
                reflectionLocation = rowNumber
                console.log('reflection found')
                break
            }
        }
    }
    return reflectionLocation
}
    
async function transposeColumnsToRows ( patternArray) {
    let columns = []
    for (let columnNumber = 0; columnNumber < patternArray[0].length - 1; columnNumber++) {
        for (let rowNumber = 0; rowNumber < patternArray.length; rowNumber++) {
            if ( rowNumber === 0) columns[columnNumber] = ''
            columns[columnNumber] += patternArray[rowNumber].substring(columnNumber, columnNumber + 1).trim()
        }
    }
    return columns
}

solvePartOne('./input.txt')
    .then(finalNumber => console.log('finalNumber:', finalNumber))


module.exports = { solvePartOne }