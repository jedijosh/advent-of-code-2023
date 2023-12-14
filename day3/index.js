const fs = require('node:fs/promises')
const { showCompletionScript } = require('yargs')

async function solvePartOne (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    const DIGIT_REGEX = /\d/
    const PERIOD_REGEX = /\./

    let totalSum = 0

    let previousLine
    let currentLine
    let nextLine

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        previousLine = currentLine
        currentLine = lines[lineNumber]
        nextLine = lineNumber < (lines.length - 1) ? lines[lineNumber + 1] : null
        const numbersInCurrentLine = currentLine.matchAll(/\d+/g)
        for (number of numbersInCurrentLine) {
            let isAdjacentToASymbol = false
            let firstDigitPosition = number.index
            let lastDigitPosition = number.index + number[0].length - 1

            // Current line: If there is a character to the left of the number, check it against the RegEx
            if (firstDigitPosition > 0) {
                let characterToLeft = currentLine[firstDigitPosition-1].trim()
                let cleansedString = await removeDigitsAndPeriods(characterToLeft)
                if (cleansedString.trim().length > 0) {
                    isAdjacentToASymbol = true
                }
            }
            // Current line: If there is a character to the right of the number, check it against the RegEx
            if (lastDigitPosition < (currentLine.length - 1)) {
                let characterToRight = currentLine[lastDigitPosition + 1].trim()
                let cleansedString = await removeDigitsAndPeriods(characterToRight)
                if (cleansedString.trim().length > 0) {
                     isAdjacentToASymbol = true
                }
            }
            
            if (previousLine && !isAdjacentToASymbol) {
                let substringStart = Math.max(firstDigitPosition - 1, 0)
                let substringEnd = Math.min(lastDigitPosition + 1, currentLine.length)
                let stringToCheck = previousLine.substring(substringStart, substringEnd + 1)
                let cleansedString = await removeDigitsAndPeriods(stringToCheck)
                if (cleansedString.trim().length > 0) {
                    isAdjacentToASymbol = true
                }
            }

            if (nextLine && !isAdjacentToASymbol) {
                let substringStart = Math.max(firstDigitPosition - 1, 0)
                let substringEnd = Math.min(lastDigitPosition + 1, nextLine.length)
                let stringToCheck = nextLine.substring(substringStart, substringEnd + 1)
                let cleansedString = await removeDigitsAndPeriods(stringToCheck)
                if (cleansedString.trim().length > 0) {
                    isAdjacentToASymbol = true
                }
            }
            if (isAdjacentToASymbol) {
                // console.log(`adding ${number[0]} from line number ${lineNumber} to sum`)
                totalSum += Number(number[0])
            }
        }
    }
    return totalSum
}

async function solvePartTwo (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    const ASTERISK_REGEX = /\*/

    let totalSum = 0

    let previousLine
    let currentLine
    let nextLine

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        previousLine = currentLine
        currentLine = lines[lineNumber]
        nextLine = lineNumber < (lines.length - 1) ? lines[lineNumber + 1] : null
        const asterisksInCurrentLine = currentLine.matchAll(/\*/g)
        // Iterating using "for" appears to remove entries from the list.  Traversing over a 2nd time finds an empty array.
        for (asterisk of asterisksInCurrentLine) {
            let adjacentNumbers = []
            let asteriskLocation = asterisk.index
            const numbersInCurrentLine = currentLine.matchAll(/\d+/g)
            const numbersInPreviousLine = previousLine ? previousLine.matchAll(/\d+/g) : null
            const numbersInNextLine = nextLine ? nextLine.matchAll(/\d+/g) : null
            for (number of numbersInCurrentLine) {
                let startIndexOfNumber = number.index
                let endIndexOfNumber = number.index + number[0].length - 1
                if ( endIndexOfNumber === (asteriskLocation - 1) || startIndexOfNumber === (asteriskLocation + 1))
                {
                    adjacentNumbers.push(number[0])
                }
            }
            for (number of numbersInPreviousLine) {
                let startIndexOfNumber = number.index
                let endIndexOfNumber = number.index + number[0].length - 1
                if ( 
                    (startIndexOfNumber >= (asteriskLocation - 1) && startIndexOfNumber <= (asteriskLocation + 1)) ||
                    (endIndexOfNumber >= (asteriskLocation - 1) && endIndexOfNumber <= (asteriskLocation + 1))) {
                        adjacentNumbers.push(number[0])
                }
                
            }
            for (number of numbersInNextLine) {
                let startIndexOfNumber = number.index
                let endIndexOfNumber = number.index + number[0].length - 1
                if ( 
                    (startIndexOfNumber >= (asteriskLocation - 1) && startIndexOfNumber <= (asteriskLocation + 1)) ||
                    (endIndexOfNumber >= (asteriskLocation - 1) && endIndexOfNumber <= (asteriskLocation + 1))) {
                        adjacentNumbers.push(number[0])
                }
            }
        
            if ( adjacentNumbers.length === 2 ) {
                totalSum += (Number(adjacentNumbers[0] * Number(adjacentNumbers[1])))
            }
        }
    }
    return totalSum
}

async function removeDigitsAndPeriods (inputString) {
    let stringWithDigitsRemoved = inputString.replace(/\d/g, '')
    let stringWithPeriodsRemoved = stringWithDigitsRemoved.replace(/\./g, '')
    return stringWithPeriodsRemoved.trim()
}

// solvePartOne('./input.txt')
//     .then(answer => console.log('Answer:', answer))

solvePartTwo('./input.txt')
// solvePartTwo('./tests/data/input.txt')
    .then(answer => console.log('Answer:', answer))

module.exports = { solvePartOne, solvePartTwo }