const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8' })
    file.close()
    let lines = fileInput.trim().split('\n')

    let finalNumber = 0
    let pattern = []

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        if (lines[lineNumber].trim() === '' || lineNumber === (lines.length - 1)) {
            if (lineNumber === (lines.length - 1)) pattern.push(lines[lineNumber])
            let numberOfRowsAboveReflection = await findHorizontalReflection(pattern)
            // if (numberOfRowsAboveReflection !== 0 ) console.log(`reflection found at row ${numberOfRowsAboveReflection}`)
            let columnsAsRows = await transposeColumnsToRows(pattern)
            let numberOfColumnsLeftOfTheReflection = await findHorizontalReflection(columnsAsRows)
            // if (numberOfColumnsLeftOfTheReflection !== 0 ) console.log(`reflection found at column ${numberOfColumnsLeftOfTheReflection}`)
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
            // Check the remainder of the rows to determine if this is a reflection
            let isReflection = true
            let numberOfRowsToCheck = Math.min(rowNumber - 1, patternArray.length - rowNumber - 1)
            for (let rowsToCheckForReflection = 1; rowsToCheckForReflection <= numberOfRowsToCheck; rowsToCheckForReflection++) {
                let firstRow = patternArray[rowNumber - 1 - rowsToCheckForReflection]
                let secondRow = patternArray[rowNumber + rowsToCheckForReflection]
                if ( firstRow !== secondRow ) {
                    isReflection = false
                    break
                }
            }
            if (isReflection) {
                reflectionLocation = rowNumber
                break
            }
        }
    }
    return reflectionLocation
}

async function solvePartTwo ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
    let lines = fileInput.trim().split('\n')

    let finalNumber = 0
    let pattern = []

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        if (lines[lineNumber].trim() === '' || lineNumber === (lines.length - 1)) {
            let numberOfRowsAboveReflection = await findHorizontalReflectionWithSmudge(pattern)
            // if (numberOfRowsAboveReflection !== 0 ) console.log(`reflection found at row ${numberOfRowsAboveReflection}`)
            let columnsAsRows = await transposeColumnsToRows(pattern)
            let numberOfColumnsLeftOfTheReflection = await findHorizontalReflectionWithSmudge(columnsAsRows)
            // if (numberOfColumnsLeftOfTheReflection !== 0 ) console.log(`reflection found at column ${numberOfColumnsLeftOfTheReflection}`)
            pattern = []
            finalNumber = finalNumber + (numberOfRowsAboveReflection * 100) + numberOfColumnsLeftOfTheReflection
        } else {
            pattern.push(lines[lineNumber])
        }
    }
    return finalNumber
}

// If returns 0, no reflection was found.
async function findHorizontalReflectionWithSmudge ( patternArray) {
    let reflectionLocation = 0
    let previousRow
    let currentRow
    // Start searching at the second row (index 1) so there are 2 rows to compare
    for (let rowNumber = 1; rowNumber < patternArray.length; rowNumber++) {
        previousRow = patternArray[rowNumber - 1]
        currentRow = patternArray[rowNumber]
        let numberOfChangesRemaining = 1 // Allow one change on either the current line or one of the later comparison lines
        let differenceCount = await numberOfDifferences(previousRow, currentRow)
        numberOfChangesRemaining -= differenceCount
        if ( numberOfChangesRemaining >= 0 ) {
            // Check the remainder of the rows to determine if this is a reflection
            let isReflection = true
            let numberOfRowsToCheck = Math.min(rowNumber - 1, patternArray.length - rowNumber - 1)
            for (let rowsToCheckForReflection = 1; rowsToCheckForReflection <= numberOfRowsToCheck; rowsToCheckForReflection++) {
                let firstRow = patternArray[rowNumber - 1 - rowsToCheckForReflection]
                let secondRow = patternArray[rowNumber + rowsToCheckForReflection]
                numberOfChangesRemaining -= await numberOfDifferences(firstRow, secondRow)
                if ( numberOfChangesRemaining < 0 ) {
                    isReflection = false
                    break
                }
            }
            if (isReflection && numberOfChangesRemaining === 0 ) {
                reflectionLocation = rowNumber
                break
            }
        }
    }
    return reflectionLocation
}
 
async function numberOfDifferences ( firstString, secondString) {
    let numberOfDifferences = 0
    for (let characterNumber = 0; characterNumber < firstString.length; characterNumber++) {
        if (firstString[characterNumber] !== secondString[characterNumber]) numberOfDifferences++
    }
    return numberOfDifferences
}

async function transposeColumnsToRows ( patternArray) {
    let columns = []
    for (let columnNumber = 0; columnNumber < patternArray[0].length; columnNumber++) {
        for (let rowNumber = 0; rowNumber < patternArray.length; rowNumber++) {
            if ( rowNumber === 0) columns[columnNumber] = ''
            columns[columnNumber] += patternArray[rowNumber].substring(columnNumber, columnNumber + 1).trim()
        }
    }
    return columns
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day13'
solvePartOne(dataFolder + '/data/tests/input.txt')
// solvePartOne(dataFolder + '/data/input.txt')
// solvePartTwo(dataFolder + '/data/input.txt')

.then(finalNumber => console.log('finalNumber:', finalNumber))

module.exports = { solvePartOne, solvePartTwo, numberOfDifferences }