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
        let positionOfUnknownLocations = []
        for (let location of unknownLocations) {
            positionOfUnknownLocations.push(location.index)
        }
        console.log('positionOfUnknownLocations', positionOfUnknownLocations)

        // 1, 2, 5, 6, 10 - need to find 3
        // 1, 2, 5
        // 1, 2, 6
        // 1, 2, 10
        // 2, 5, 6
        // 2, 5, 10
        // 5, 6, 10
        let permutations = []
        for (let i = 0; i < positionOfUnknownLocations.length; i++) {
            let numbersToAddToPermutation = numberOfSpringsToFind
            let newPermutation = []
            newPermutation.push(positionOfUnknownLocations[i])
            while ()
            for (let j = 1; j < positionOfUnknownLocations.length; j++) {

            }
        }

        // Calculate all possible permutations of substitutions
        let pathsToFind: Array<{firstGalaxy: Point, secondGalaxy: Point}> = []
        for (let i = 0; i < galaxyLocations.length; i++) {
            for (let j = i + 1; j < galaxyLocations.length; j++) {
                pathsToFind.push({firstGalaxy: galaxyLocations[i], secondGalaxy: galaxyLocations[j]})
            }
        }


        


        

        // See if there are periods separating all of the groups?
        let conditionRecordGroups = conditionRecord.matchAll(/\.+/g)
        // If there were periods at the beginning, ignore from the count.
        for (let group of conditionRecordGroups) {
            console.log('group', group)
        }
    }

    return pathLength
}

export async function solvePartTwo ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    
    return pathLength
}



solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/tests/data/input.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day12/input.txt')
        // .then(answer => console.log('answer:', answer))