import { match } from 'assert'
import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = true

let cache: { [key: string]: number } = {}

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

export function removeMatchesFromEnd(conditionRecord: string, groupOrderArray: Array<number>) {
    let matchesAtEndOfString = [...conditionRecord.matchAll(/\.+\#+\.*$/g)]
    while (matchesAtEndOfString.length > 0) {
        for (let match of matchesAtEndOfString) {
            let newString: string = conditionRecord.substring(0, match.index) + "."
            conditionRecord = newString
            groupOrderArray.pop()
            if (LOGGING) console.log('conditionRecord', conditionRecord)
            if (LOGGING) console.log('groupOrderArray', groupOrderArray)
        }
        matchesAtEndOfString = [...conditionRecord.matchAll(/\.+\#+\.*$/g)]
    }
    return { conditionRecord, groupOrderArray }
}

export function removeMatchesFromBeginning(conditionRecord: string, groupOrderArray: Array<number>) {
    let matchesAtBeginningdOfString = [...conditionRecord.matchAll(/^\.+\#+\.+/g)]
    while (matchesAtBeginningdOfString.length > 0) {
        for (let match of matchesAtBeginningdOfString) {
            let newString: string = "." + conditionRecord.substring(match[0].length)
            conditionRecord = newString
            let newArray = groupOrderArray.slice(1)
            groupOrderArray = newArray
            if (LOGGING) console.log('conditionRecord', conditionRecord)
            if (LOGGING) console.log('groupOrderArray', groupOrderArray)
        }
        matchesAtBeginningdOfString = [...conditionRecord.matchAll(/\.+\#+\.*$/g)]
    }
    return { conditionRecord, groupOrderArray }
}

export function buildRegex(groupOrderArray: Array<number>) {
    let regexString = "^\\.*" // might start with periods
    for (let number of groupOrderArray) {
        regexString += "\\#{" + number + "}\\.+"
    }
    regexString = regexString.substring(0, regexString.length - 1) + '*$'
    return new RegExp(regexString)
    
}

// Inital call will pass in an empty array.
// Build arrays with length 
// Has trouble running out of memory depending on combination lenngth
export function findCombinations(inputArray: Array<number> = [], availableValues: Array<number>, combinationLength: number): Array<Array<number>> {
    // If the remaining values complete the combination length, combine with existing array and return.
    // console.log('inputArray', inputArray)
    // console.log('availableValues', availableValues)
    if (inputArray.length + availableValues.length === combinationLength) {
        return [inputArray.concat(availableValues)]
    } else if (inputArray.length === combinationLength ) {
        // Have enough values in the array, return the result
        return [inputArray]
    } else {
        // Push combinations with and without the current element
        return findCombinations(inputArray.concat(availableValues.slice(0,1)), availableValues.slice(1), combinationLength)
            .concat(findCombinations(inputArray, availableValues.slice(1), combinationLength))
    
    }
}

export function findAvailableCombinations(stringToTest: string, groupOrderArray: Array<number>): number {
    const line = stringToTest + " " + groupOrderArray.join(",")
    if (cache[line]) return cache[line]
    // No more elements in groupOrderArray.  Check if there's any springs remaining in stringToTest.
    if (groupOrderArray.length <= 0) return Number(!stringToTest.includes("#"));


    // Check the number of remaining letters.  If less than the sum of numbers plus room for periods, there are no 
    // more valid combinations
    if (stringToTest.length - groupOrderArray.reduce((a, b) => a + b) - groupOrderArray.length + 1 < 0) return 0;

    // Take a substring of the next group number.  If that includes a period, will return 0 as it's not a valid combination
    const damagedOrUnknown = !stringToTest.slice(0, groupOrderArray[0]).includes(".");
    if (stringToTest.length == groupOrderArray[0]) return Number(damagedOrUnknown);
    let returnValue
    if (cache[line]) {
        returnValue = cache[line]
     } else {
        returnValue = (stringToTest[0] != "#" ? findAvailableCombinations(trimStart(stringToTest.slice(1)), groupOrderArray) : 0) +
        (damagedOrUnknown && stringToTest[groupOrderArray[0]] != "#" ? findAvailableCombinations(trimStart(stringToTest.slice(groupOrderArray[0] + 1)), groupOrderArray.slice(1)) : 0);
        cache[line] = returnValue
     }
     return returnValue
}

function trimStart(str: string) {
    return str.startsWith(".") ? str.split(/(?<=\.)(?=[^.])/).slice(1).join("") : str;
}


export async function solution ( filename : string, copiesToAdd: number) {
    let possibleArrangements: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let counter: number = 1
    
    for (let line of fileLines) {
        console.log(`processing ${counter} of ${fileLines.length}, result is currently ${possibleArrangements}`)
        let splitLine = line.split(' ')
        // Condition record is the string containing the known springs and missing data.
        let conditionRecord: string = splitLine[0] || ''
        // Group order is an array containing the numbers at the end of the line.  Example: "1, 1, 3"
        let groupOrder: string = splitLine[1] || ''
        // if (LOGGING) console.log('conditionRecord', conditionRecord)
        // if (LOGGING) console.log('groupOrder', groupOrder)

        let groupOrderArray: Array<number> = groupOrder.split(',').map(Number)
        // let result = removeMatchesFromEnd(conditionRecord, groupOrderArray)
        // conditionRecord = result.conditionRecord
        // groupOrderArray = result.groupOrderArray

        // result = removeMatchesFromBeginning(conditionRecord, groupOrderArray)
        // conditionRecord = result.conditionRecord
        // groupOrderArray = result.groupOrder

        // Can be done more efficiently with:
        // Array(5).fill(conditionRecord).join("?"), 
        // Array(5).fill(groups).flat()
        
        let conditionRecordCopy = conditionRecord.substring(0)
        let groupOrderCopy = groupOrderArray.slice(0)
        for (let i = 0; i < copiesToAdd; i++) {
            let newString = conditionRecord.concat('?').concat(conditionRecordCopy)
            conditionRecord = newString
            let newArray = groupOrderArray.concat(groupOrderCopy)
            groupOrderArray = newArray
        }
        // if (LOGGING) console.log('final conditionRecord', conditionRecord)
        // if (LOGGING) console.log('final groupOrderArray', groupOrderArray)

        possibleArrangements += findAvailableCombinations(conditionRecord, groupOrderArray)
        counter++
    }

        

        // See if we can strip off any of the string from the beginning or the end
        // Look for one or more periods, one or more #, zero or more "." and then end of line

        // See if there are any complete sections which can help break up the overall line
        // Look for one or more periods, one or more #s, and one or more periods
        // let completeSections = [...conditionRecord.matchAll(/\.{1}\#+\.{1}/g)]
        // if (LOGGING) console.log('completeSections', completeSections)





        
        // // Split the line based on "."s.  This will give the total number of sections to be solved    
    
        // let sectionsToSolve: Array<String> = []
        // let locationOfPeriods = conditionRecord.matchAll(/\.+/g)
        // if (LOGGING) console.log('locationOfPeriods', locationOfPeriods)
        // // // // If there were periods at the beginning, ignore from the count.
        // let numberOfSections: number = 0
        // let startingPosition = 0
        // for (let periodLocation of locationOfPeriods) {
        //     if (LOGGING) console.log('periodLocation', periodLocation)
        //     sectionsToSolve.push(conditionRecord.substring(startingPosition, periodLocation.index))
        //     startingPosition = periodLocation.index || 0 + 1
        //     numberOfSections++
        // }
        // if (LOGGING) console.log('numberOfSections', numberOfSections)

        // for (let section of sectionsToSolve) {
        //     if (LOGGING) console.log('section', section)
        // }

        // // If there are the same number of sections to be solved as numbers in the groupOrder
        // // there are periods between each section already so just loop through each section.
        // if (sectionsToSolve.length === groupOrderArray.length) {
        //     for (let sectionNumber = 0; sectionNumber < sectionsToSolve.length; sectionNumber++) {
        //         findNumberOfCombinations(sectionsToSolve[sectionNumber], groupOrderArray[sectionNumber])
        //     }
        // }




        // // Calculate the total number of damaged springs for the line
        // // Also create a RegEx to check if the full filled in line matches the "groupOrder" numbers
        // let totalNumberOfDamagedSprings = groupOrderArray.reduce(
        //     (accumulator, currentValue) => accumulator + currentValue, 
        //     0, 
        // )
        // let regexToMatch: RegExp = buildRegex(groupOrderArray)

        // let numberOfKnownDamagedSprings = 0
        // // Find the location of each damaged spring within the condition record.
        // // Only currently using to calculate how many we know about.
        // let damagedSpringLocations = conditionRecord.match(/\#{1}/g) || []
        // numberOfKnownDamagedSprings = damagedSpringLocations.length
        // let numberOfSpringsToFind: number = totalNumberOfDamagedSprings - numberOfKnownDamagedSprings
        // if (LOGGING) console.log(`Know of ${numberOfKnownDamagedSprings} and there are ${totalNumberOfDamagedSprings} total so ${numberOfSpringsToFind} to find`)

        // // Find the positions of each unknown location in the full string
        // let unknownLocations = conditionRecord.matchAll(/\?{1}/g) || []
        // let positionsOfUnknownLocations: Array<number> = []
        // for (let location of unknownLocations) {
        //     if (location.index !== undefined) positionsOfUnknownLocations.push(location.index)
        // }
        // // if (LOGGING) console.log('positionOfUnknownLocations', positionOfUnknownLocations)        

        // let combinations: Array<Array<number>> = findCombinations(new Array<number>(), positionsOfUnknownLocations, numberOfSpringsToFind)
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
    // }

    return possibleArrangements
}


const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day12'
// solution(dataFolder + 'data/tests/input.txt')
// solution(dataFolder + '/data/input.txt')

solution(dataFolder + '/data/tests/input.txt', 4)
// solution(dataFolder + '/data/input.txt', 4)
        .then(answer => console.log('answer:', answer))