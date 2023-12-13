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
        console.log('original line:', line)
        line = replaceTextWithNumbers(line)
        let numbers = line.match(/\d{1}/g)
        console.log(numbers)
        let firstNumber = numbers[0]
        let lastNumber = numbers[numbers.length-1]
        console.log(`firstNumber: ${firstNumber}, lastNumber: ${lastNumber}`)
        sum += Number(`${firstNumber}${lastNumber}`)
        console.log(`adding ${firstNumber}${lastNumber} results in a new sum of ${sum}`)
        console.log('')
    })
    return sum
}

function replaceTextWithNumbers ( inputString ) {
    const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    let modifiedString = inputString.replace(NUMBER_TEXT_REGEX, (match) => {
        return numbers.indexOf(match)
    })

    console.log('modifiedString:', modifiedString)
    return modifiedString

}

solvePartTwo('./input.txt')
    .then(result => {
        console.log('result:', result)
    })

module.exports = { replaceTextWithNumbers, solvePartOne, solvePartTwo }