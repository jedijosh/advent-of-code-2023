const fs = require('node:fs/promises')

async function solvePartOne () {
    let file = await fs.open('./testInput.txt')
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
        console.log('parsing line', lineNumber)
        console.log('previousLine:', previousLine)
        console.log('currentLine: ', currentLine)
        console.log('nextLine:    ', nextLine)
        for (number of numbersInCurrentLine) {
            let isAdjacentToASymbol = false
            let firstDigitPosition = number.index
            let lastDigitPosition = number.index + number[0].length - 1
            console.log('number:', number)
            console.log('firstDigitPosition:', firstDigitPosition)
            console.log('lasstDigitPosition:', lastDigitPosition)

            // Current line: If there is a character to the left of the number, check it against the RegEx
            if (firstDigitPosition > 0 && !currentLine[firstDigitPosition - 1].match(DIGIT_REGEX) && !currentLine[firstDigitPosition - 1].match(PERIOD_REGEX)) {
                isAdjacentToASymbol = true
            }
            // Current line: If there is a character to the right of the number, check it against the RegEx
            if (lastDigitPosition < currentLine.length && !currentLine[lastDigitPosition + 1].match(DIGIT_REGEX) && !currentLine[lastDigitPosition + 1].match(PERIOD_REGEX)) isAdjacentToASymbol = true
            if (previousLine && !isAdjacentToASymbol) {
                let substringStart = Math.max(firstDigitPosition - 1, 0)
                let substringEnd = Math.min(lastDigitPosition + 1, currentLine.length)
                let stringToCheck = previousLine.substring(substringStart, substringEnd + 1)
                let stringWithDigitsRemoved = stringToCheck.replaceAll(/\d/g, '')
                let stringWithPeriodsRemoved = stringWithDigitsRemoved.replaceAll(/\./g, '')   
                console.log('stringToCheck:', stringToCheck)
                if (stringWithPeriodsRemoved.length > 0) {
                    isAdjacentToASymbol = true
                    console.log('matches RegEx')
                }
            }

            if (nextLine && !isAdjacentToASymbol) {
                let substringStart = Math.max(firstDigitPosition - 1, 0)
                let substringEnd = Math.min(lastDigitPosition + 1, nextLine.length)
                let stringToCheck = nextLine.substring(substringStart, substringEnd + 1)
                let stringWithDigitsRemoved = stringToCheck.replaceAll(/\d/g, '')
                let stringWithPeriodsRemoved = stringWithDigitsRemoved.replaceAll(/\./g, '')   
                console.log('stringToCheck:', stringToCheck)
                if (stringWithPeriodsRemoved.length > 0) {
                    isAdjacentToASymbol = true
                    console.log('matches RegEx')
                }
            }
            if (isAdjacentToASymbol) {
                console.log(`adding ${number[0]} to sum`)
                totalSum += Number(number[0])
            }
        }
        console.log('')
        console.log('totalSum:', totalSum)
    }
}

solvePartOne()

module.exports = { solvePartOne }