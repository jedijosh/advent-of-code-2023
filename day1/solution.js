const fs = require('node:fs/promises')

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

async function solvePartTwo () {
    let file = await fs.open('./input.txt')
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let replacedInput = replaceTextWithNumbers(fileInput)
    let lines = replacedInput.trim().split('\n')
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

async function replaceTextWithNumbers ( inputString ) {
    const numbers = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine'
    ]

    let modifiedString = inputString
    for (number of numbers) {
        let newString = modifiedString.replace(new RegExp(number, "g"), numbers.indexOf(number))
        modifiedString = newString
    }

    return modifiedString

}

// solvePartTwo()
//     .then(result => {
//         console.log(result)
//     })

module.exports = {replaceTextWithNumbers, solvePartOne, solvePartTwo }