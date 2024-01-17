const fs = require('node:fs/promises')
const NUMBER_TEXT_REGEX = /(zero|one|two|three|four|five|six|seven|eight|nine)/gi

const LOGGING = false

async function solvePartOne (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
    let lines = fileInput.trim().split('\n')
    let sum = 0
    lines.forEach(line => { 
        let numbers = line.match(/\d{1}/g)
        if (LOGGING) console.log(numbers)
        let firstNumber = numbers[0]
        let lastNumber = numbers[numbers.length-1]
        if (LOGGING) console.log(`firstNumber: ${firstNumber}, lastNumber: ${lastNumber}`)
        sum += Number(`${firstNumber}${lastNumber}`)
    })
    return sum
}

async function solvePartTwo (filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()
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
            modifiedString += results[0]
        } else {
            modifiedString += translatedNumber
        }
        NUMBER_TEXT_OR_DIGIT_REGEX.lastIndex = results.index + 1
    }
    return modifiedString

}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day1'
// solvePartOne(dataFolder + '/data/input.txt')
solvePartOne(dataFolder + '/data/tests/part1.txt')
// solvePartTwo(dataFolder + '/data/tests/part2.txt')
// solvePartTwo(dataFolder + '/data/input.txt')
    .then(result => { console.log('result:', result) })

module.exports = { replaceTextWithNumbers, solvePartOne, solvePartTwo }