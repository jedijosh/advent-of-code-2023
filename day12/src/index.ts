import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = false

export async function solvePartOne ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    
    for (let line of fileLines) {
        let splitLine = line.split(' ')
        let conditionRecord = splitLine[0] || ''
        let groupOrder = splitLine[1] || ''
        console.log('conditionRecord', conditionRecord)
        console.log('groupOrder', groupOrder)

        let totalNumberOfDamagedSprings = 0
        let regexString = "^\\.*" // might start with periods
        for (let number of groupOrder.split(',')) {
            totalNumberOfDamagedSprings += Number(number)
            regexString += "\\#{" + number + "}\\.+"
        }
        regexString = regexString.substring(0, regexString.length - 1) + '*$'
        let regexToMatch = new RegExp(regexString)
        // console.log('regexToMatch', regexToMatch)
        // console.log('#.#.###'.match(regexToMatch))
        console.log('number of springs', totalNumberOfDamagedSprings)

        let numberOfKnownDamagedSprings = 0
        let damagedSpringLocations = conditionRecord.match(/\#{1}/g) || []
        numberOfKnownDamagedSprings = damagedSpringLocations.length
        for (let location of damagedSpringLocations) {
            console.log('location', location)
        }
        let numberOfSpringsToFind: number = totalNumberOfDamagedSprings - numberOfKnownDamagedSprings
        console.log(`Know of ${numberOfKnownDamagedSprings} and there are ${totalNumberOfDamagedSprings} total so ${numberOfSpringsToFind} to find`)

        let unknownLocations = conditionRecord.matchAll(/\?{1}/g) || []
        let positionOfUnknownLocations: Array<number> = []
        for (let location of unknownLocations) {
            if (location.index !== undefined) positionOfUnknownLocations.push(location.index)
        }
        console.log('positionOfUnknownLocations', positionOfUnknownLocations)
       
        console.log(`calling functions with ${positionOfUnknownLocations} and ${numberOfSpringsToFind}`)
        
        // let result: Array<Array<number>> = []
        // result = findCombinations([], [1, 2, 5], 3)
        // result = await findCombinations([], [1, 2, 5, 6, 10], 3)
        

        let combinations: Array<Array<number>> = findCombinations(new Array<number>(), positionOfUnknownLocations, numberOfSpringsToFind)
        console.log('combinations', combinations)

        // let stringWithUnknownReplaced = conditionRecord.replace('?', '.')
        // console.log('stringWithUnknownReplaced', stringWithUnknownReplaced)
        // for (let combinationNumber = 0; combinationNumber < combinations.length; combinationNumber++) {
        //     for (let )
        //     let stringForCombination = 
        // }
        


        // See if there are periods separating all of the groups?
        let conditionRecordGroups = conditionRecord.matchAll(/\.+/g)
        // If there were periods at the beginning, ignore from the count.
        for (let group of conditionRecordGroups) {
            console.log('group', group)
        }
    }

    return pathLength
}

// Inital call will pass in an empty array.
// Build arrays with length 
export function findCombinations(inputArray: Array<number> = [], availableValues: Array<number>, combinationLength: number): Array<Array<number>> {
    // If the remaining values complete the combination length, combine with existing array and return.
    console.log('inputArray', inputArray)
    console.log('availableValues', availableValues)
    if (inputArray.length + availableValues.length === combinationLength) {
        console.log('returning', inputArray.concat(availableValues))
        return [inputArray.concat(availableValues)]
    } else if (inputArray.length === combinationLength ) {
        // Have enough values in the array, return the result
        return [inputArray]
    } else {
        // Push combinations with and without the current element
        return findCombinations(inputArray.concat(availableValues.slice(0,1)), availableValues.slice(1), combinationLength)
            .concat(findCombinations(inputArray, availableValues.slice(1), combinationLength))
    
    }
    // 1, 2, 5, 6, 10 - need to find 3
    // 1, 2, 5
    // 1, 2, 6
    // 1, 2, 10
    // 2, 5, 6
    // 2, 5, 10
    // 5, 6, 10
}


export async function solvePartTwo ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    
    return pathLength
}



solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/tests/data/input2.txt')
// // solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/input.txt')
        // .then(answer => console.log('answer:', answer))