import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = false

export async function solvePartOne ( filename : string) {
    let currentTime: Date = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    let sumOfNextValues: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    for (let stringOfNumbers of fileLines) {
        if (!stringOfNumbers) continue
        if (LOGGING) console.log('string of numbers:', stringOfNumbers)
        let arrayOfStrings = stringOfNumbers.match(/-?\d+/g) || []
        let arrayOfNumbers: Array<number> = []
        for (let string of arrayOfStrings) {
            arrayOfNumbers.push(Number(string))
        }

        if (LOGGING) console.log('array of numbers:', arrayOfNumbers)
        let nextValue = await findNextValueInSequence(arrayOfNumbers)
        sumOfNextValues += nextValue
    }
    
    currentTime = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    return sumOfNextValues
}

export async function findNextValueInSequence( arrayOfNumbers: Array<number>) {
    // Need to know the previous sequence
    // Need to build a new array of numbers with the differences

    let arrayOfDifferences: Array<number> = []
    let firstNumber: number = arrayOfNumbers[0]
    let allDifferencesAreZero: boolean = true
    for (let number = 1; number < arrayOfNumbers.length; number++) {
        let secondNumber: number = arrayOfNumbers[number]
        let difference: number = secondNumber - firstNumber
        arrayOfDifferences.push(difference)
        if (difference !== 0) allDifferencesAreZero = false
        firstNumber = secondNumber
    }
    let valueToAdd: number = 0
    if (LOGGING) console.log('array of differences:', arrayOfDifferences)
    if (!allDifferencesAreZero) {
        if (LOGGING) console.log('calling function recursively')
        valueToAdd = await findNextValueInSequence(arrayOfDifferences)
    }
    // If we've gotten here, we've received a value from the recursive call.

    let newValue: number = valueToAdd + arrayOfNumbers[arrayOfNumbers.length - 1]
    if (LOGGING) console.log('returning value from function', newValue)
    arrayOfNumbers.push(newValue)
    return newValue
}

export async function findPreviousValueInSequence( arrayOfNumbers: Array<number>) {
    // Need to know the previous sequence
    // Need to build a new array of numbers with the differences

    let arrayOfDifferences: Array<number> = []
    let firstNumber: number = arrayOfNumbers[0]
    let allDifferencesAreZero: boolean = true
    for (let number = 1; number < arrayOfNumbers.length; number++) {
        let secondNumber: number = arrayOfNumbers[number]
        let difference: number = secondNumber - firstNumber
        arrayOfDifferences.push(difference)
        if (difference !== 0) allDifferencesAreZero = false
        firstNumber = secondNumber
    }
    let valueToAdd: number = 0
    if (LOGGING) console.log('array of differences:', arrayOfDifferences)
    if (!allDifferencesAreZero) {
        if (LOGGING) console.log('calling function recursively')
        valueToAdd = await findPreviousValueInSequence(arrayOfDifferences)
    }
    // If we've gotten here, we've received a value from the recursive call.

    let newValue: number = arrayOfNumbers[0] - valueToAdd
    if (LOGGING) console.log('returning value from function', newValue)
    arrayOfNumbers.push(newValue)
    return newValue
}


export async function solvePartTwo ( filename : string) {
    let currentTime: Date = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    let sumOfNextValues: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    for (let stringOfNumbers of fileLines) {
        if (!stringOfNumbers) continue
        if (LOGGING) console.log('string of numbers:', stringOfNumbers)
        let arrayOfStrings = stringOfNumbers.match(/-?\d+/g) || []
        let arrayOfNumbers: Array<number> = []
        for (let string of arrayOfStrings) {
            arrayOfNumbers.push(Number(string))
        }

        if (LOGGING) console.log('array of numbers:', arrayOfNumbers)
        let nextValue = await findPreviousValueInSequence(arrayOfNumbers)
        sumOfNextValues += nextValue
    }
    
    currentTime = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    return sumOfNextValues
}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day9/tests/data/input3.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day9/input.txt')
//     .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day9/tests/data/input.txt')
solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day9/input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day9/tests/data/input.txt', 2)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day9/input.txt', 2)
// .then(answer => console.log('answer:', answer))