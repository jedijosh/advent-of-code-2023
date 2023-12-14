const fs = require('node:fs/promises')
const NUMBER_TEXT_REGEX = /(zero|one|two|three|four|five|six|seven|eight|nine)/gi

async function solvePartOne () {
    let file = await fs.open('./input.txt')
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    let sum = 0
    lines.forEach(line => { 
        let numbers = line.match(/\d{1}/g)
        console.log(numbers)
        let firstNumber = numbers[0]
        let lastNumber = numbers[numbers.length-1]
        console.log(`firstNumber: ${firstNumber}, lastNumber: ${lastNumber}`)
        sum += Number(`${firstNumber}${lastNumber}`)
    })
    return sum
}

async function solvePartTwo (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    let sum = 0
    lines.forEach(line => { 
        line = replaceTextWithNumbers(line)
        let numbers = line.match(/\d{1}/g)
        let firstNumber = numbers[0]
        let lastNumber = numbers[numbers.length-1]
        sum += Number(`${firstNumber}${lastNumber}`)
    })
    return sum
}

function replaceTextWithNumbers ( inputString ) {
    const NUMBER_TEXT_OR_DIGIT_REGEX = /(zero|one|two|three|four|five|six|seven|eight|nine|\d)/gi
    const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    
    let modifiedString = ''
    let searchString = inputString
    while (searchString.length > 0) {
        let results = NUMBER_TEXT_OR_DIGIT_REGEX.exec(searchString) 
        if (!results) break
        let translatedNumber = numbers.indexOf(results[0])
        if ( translatedNumber === -1 ) {
            modifiedString += results
        } else {
            modifiedString += translatedNumber
        }
        NUMBER_TEXT_OR_DIGIT_REGEX.lastIndex = results.index + 1
    }
    return modifiedString

}

// solvePartTwo('./tests/data/sampleInputPartTwo.txt')
solvePartTwo('./input.txt')
    .then(result => {
        console.log('result:', result)
    })

    // NOT 55330

module.exports = { replaceTextWithNumbers, solvePartOne, solvePartTwo }