const fs = require('node:fs/promises')

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
        const numbersInCurrentLine = currentLine.matchAll(/\d/g)
        const numbersInPreviousLine = previousLine ? previousLine.matchAll(/\d/g) : null
        const numbersInNextLine = nextLine ? nextLine.matchAll(/\d/g) : null
        for (asterisk of asterisksInCurrentLine) {
            console.log('asterisk', asterisk)
            console.log('numbers in previous line', numbersInPreviousLine)
            console.log('numbers in current line', numbersInCurrentLine)
            console.log('numbers in next line', numbersInNextLine)

            let numberOfAdjacentNumbers = 0
            let firstDigitPosition = asterisk.index
            let lastDigitPosition = asterisk.index + asterisk[0].length - 1

            // Current line: If there is a character to the left of the number, check it against the RegEx
            if (firstDigitPosition > 0) {
                let characterToLeft = currentLine[firstDigitPosition-1].trim()
                if (characterToLeft.match(/\d/)) {
                    numberOfAdjacentNumbers++
                    console.log('character to the left is a digit')
                }
            }
            // Current line: If there is a character to the right of the number, check it against the RegEx
            if (lastDigitPosition < (currentLine.length - 1)) {
                let characterToRight = currentLine[lastDigitPosition + 1].trim()
                if (characterToRight.match(/\d/)) {
                    numberOfAdjacentNumbers++
                    console.log('character to the right is a digit')
                }
            }
            
            // if (previousLine && !isAdjacentToASymbol) {
            //     let substringStart = Math.max(firstDigitPosition - 1, 0)
            //     let substringEnd = Math.min(lastDigitPosition + 1, currentLine.length)
            //     let stringToCheck = previousLine.substring(substringStart, substringEnd + 1)
            //     let cleansedString = await removeDigitsAndPeriods(stringToCheck)
            //     if (cleansedString.trim().length > 0) {
            //         isAdjacentToASymbol = true
            //     }
            // }

            // if (nextLine && !isAdjacentToASymbol) {
            //     let substringStart = Math.max(firstDigitPosition - 1, 0)
            //     let substringEnd = Math.min(lastDigitPosition + 1, nextLine.length)
            //     let stringToCheck = nextLine.substring(substringStart, substringEnd + 1)
            //     let cleansedString = await removeDigitsAndPeriods(stringToCheck)
            //     if (cleansedString.trim().length > 0) {
            //         isAdjacentToASymbol = true
            //     }
            // }
            // if (isAdjacentToASymbol) {
            //     // console.log(`adding ${number[0]} from line number ${lineNumber} to sum`)
            //     totalSum += Number(number[0])
            // }
        }





        
    }
}

async function removeDigitsAndPeriods (inputString) {
    let stringWithDigitsRemoved = inputString.replace(/\d/g, '')
    let stringWithPeriodsRemoved = stringWithDigitsRemoved.replace(/\./g, '')
    return stringWithPeriodsRemoved.trim()
}

// solvePartOne('./input.txt')
//     .then(answer => console.log('Answer:', answer))

solvePartTwo('./tests/data/input.txt')
    .then(answer => console.log('Answer:', answer))

module.exports = { solvePartOne, solvePartTwo }