const fs = require('node:fs/promises')

async function findCalibrationValues () {
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

findCalibrationValues()
    .then(result => {
        console.log(result)

    })