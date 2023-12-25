import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = true

export async function solvePartOne ( filename : string) {
    let possibleArrangements: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    
    for (let line of fileLines) {
        let splitLine = line.split(' ')
        let conditionRecord = splitLine[0] || ''
        let groupOrder = splitLine[1] || ''
        if (LOGGING) console.log('conditionRecord', conditionRecord)
        if (LOGGING) console.log('groupOrder', groupOrder)

        let totalNumberOfDamagedSprings = 0
        let regexString = "^\\.*" // might start with periods
        for (let number of groupOrder.split(',')) {
            totalNumberOfDamagedSprings += Number(number)
            regexString += "\\#{" + number + "}\\.+"
        }
        regexString = regexString.substring(0, regexString.length - 1) + '*$'
        let regexToMatch = new RegExp(regexString)
        if (LOGGING) console.log('number of springs', totalNumberOfDamagedSprings)

        let numberOfKnownDamagedSprings = 0
        let damagedSpringLocations = conditionRecord.match(/\#{1}/g) || []
        numberOfKnownDamagedSprings = damagedSpringLocations.length
        let numberOfSpringsToFind: number = totalNumberOfDamagedSprings - numberOfKnownDamagedSprings
        if (LOGGING) console.log(`Know of ${numberOfKnownDamagedSprings} and there are ${totalNumberOfDamagedSprings} total so ${numberOfSpringsToFind} to find`)

        let unknownLocations = conditionRecord.matchAll(/\?{1}/g) || []
        let positionOfUnknownLocations: Array<number> = []
        for (let location of unknownLocations) {
            if (location.index !== undefined) positionOfUnknownLocations.push(location.index)
        }
        // if (LOGGING) console.log('positionOfUnknownLocations', positionOfUnknownLocations)        

        let combinations: Array<Array<number>> = findCombinations(new Array<number>(), positionOfUnknownLocations, numberOfSpringsToFind)
        // if (LOGGING) console.log('combinations', combinations)

        for (let combinationNumber = 0; combinationNumber < combinations.length; combinationNumber++) {
            let stringToTest = conditionRecord.replace(/\?/g, '.')
            // if (LOGGING) console.log('stringToTest', stringToTest)
            for (let positionNumber of combinations[combinationNumber]) {
                let stringForCombination = stringToTest.substring(0,positionNumber) + '#' + stringToTest.substring(positionNumber+1)
                stringToTest = stringForCombination
            }
            // if (LOGGING) console.log('stringToTest', stringToTest)
            if ( stringToTest.match(regexToMatch)) possibleArrangements++
        }
        


        // // See if there are periods separating all of the groups?
        // let conditionRecordGroups = conditionRecord.matchAll(/\.+/g)
        // // If there were periods at the beginning, ignore from the count.
        // for (let group of conditionRecordGroups) {
        //     console.log('group', group)
        // }
    }

    return possibleArrangements
}

// Inital call will pass in an empty array.
// Build arrays with length 
export function findCombinations(inputArray: Array<number> = [], availableValues: Array<number>, combinationLength: number): Array<Array<number>> {
    // If the remaining values complete the combination length, combine with existing array and return.
    // console.log('inputArray', inputArray)
    // console.log('availableValues', availableValues)
    if (inputArray.length + availableValues.length === combinationLength) {
        // console.log('returning', inputArray.concat(availableValues))
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
    let possibleArrangements: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    
    for (let line of fileLines) {
        let splitLine = line.split(' ')
        // Condition record is the string containing the known springs and missing data.
        let conditionRecord: string = splitLine[0] || ''
        // Group order is an array containing the numbers at the end of the line.  Example: "1, 1, 3"
        let groupOrder: string = splitLine[1] || ''
        if (LOGGING) console.log('conditionRecord', conditionRecord)
        if (LOGGING) console.log('groupOrder', groupOrder)

        // See if we can strip off any of the string from the beginning or the end
        // Look for one or more periods, one or more #, zero or more "." and then end of line
        let matchesAtEndOfString = [...conditionRecord.matchAll(/(\.+\#+\.*)+$/g)]
        for (let match of matchesAtEndOfString) {
            console.log('match', match)
            let newString: string = conditionRecord.substring(0, match.index)
            console.log('length', match.length)
            for (let i = 0; i < match.length; i++) {
                console.log('popping')
                groupOrder = groupOrder.split(',').pop() || ''
            }
            conditionRecord = newString
            if (LOGGING) console.log('conditionRecord', conditionRecord)
            if (LOGGING) console.log('groupOrder', groupOrder)
        }

        // Split the line based on "."s.  This will give the total number of sections to be solved
        
        let sectionsToBeSolved = conditionRecord.matchAll(/\.+/g)
        console.log('sectionsToBeSolved', sectionsToBeSolved)
        // // // If there were periods at the beginning, ignore from the count.
        let numberOfSections: number = 0
        for (let section of sectionsToBeSolved) {
            numberOfSections++
        }
        for (let section of sectionsToBeSolved) {
            console.log('section', section)
        }

        // If there are the same number of sections to be solved as numbers in the groupOrder
        // there are periods between each section already so just loop through each section.
        if (numberOfSections + 1 === groupOrder.length) {

        }

        return 0




        // Calculate the total number of damaged springs for the line
        // Also create a RegEx to check if the full filled in line matches the "groupOrder" numbers
        // let totalNumberOfDamagedSprings = 0
        // let regexString = "^\\.*" // might start with periods
        // for (let number of groupOrder.split(',')) {
        //     totalNumberOfDamagedSprings += Number(number)
        //     regexString += "\\#{" + number + "}\\.+"
        // }
        // regexString = regexString.substring(0, regexString.length - 1) + '*$'
        // let regexToMatch = new RegExp(regexString)

        // let numberOfKnownDamagedSprings = 0
        // // Find the location of each damaged spring within the condition record.
        // // Only currently using to calculate how many we know about.
        // let damagedSpringLocations = conditionRecord.match(/\#{1}/g) || []
        // numberOfKnownDamagedSprings = damagedSpringLocations.length
        // let numberOfSpringsToFind: number = totalNumberOfDamagedSprings - numberOfKnownDamagedSprings
        // if (LOGGING) console.log(`Know of ${numberOfKnownDamagedSprings} and there are ${totalNumberOfDamagedSprings} total so ${numberOfSpringsToFind} to find`)

        // // Find the positions of each unknown location in the full string
        // let unknownLocations = conditionRecord.matchAll(/\?{1}/g) || []
        // let positionOfUnknownLocations: Array<number> = []
        // for (let location of unknownLocations) {
        //     if (location.index !== undefined) positionOfUnknownLocations.push(location.index)
        // }
        // // if (LOGGING) console.log('positionOfUnknownLocations', positionOfUnknownLocations)        

        // let combinations: Array<Array<number>> = findCombinations(new Array<number>(), positionOfUnknownLocations, numberOfSpringsToFind)
        // // if (LOGGING) console.log('combinations', combinations)

        // for (let combinationNumber = 0; combinationNumber < combinations.length; combinationNumber++) {
        //     let stringToTest = conditionRecord.replace(/\?/g, '.')
        //     // if (LOGGING) console.log('stringToTest', stringToTest)
        //     for (let positionNumber of combinations[combinationNumber]) {
        //         let stringForCombination = stringToTest.substring(0,positionNumber) + '#' + stringToTest.substring(positionNumber+1)
        //         stringToTest = stringForCombination
        //     }
        //     // if (LOGGING) console.log('stringToTest', stringToTest)
        //     if ( stringToTest.match(regexToMatch)) possibleArrangements++
        // }
    }

    return possibleArrangements
}



// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/tests/data/input.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/input.txt')
    // .then(answer => console.log('answer:', answer))

solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/input.txt')
        .then(answer => console.log('answer:', answer))