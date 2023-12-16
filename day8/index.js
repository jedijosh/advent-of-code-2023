const { Console } = require('node:console')
const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let instructions = lines[0]
    instructions = instructions.replace(/L/g, '0').replace(/R/g, '1')
    console.log(instructions)
    let numberOfSteps = 0
    
    let networkMap = new Map()
    for (let line = 2; line < lines.length; line++) {
        let pattern = lines[line].match(/(\w\w\w) = \((\w\w\w), (\w\w\w)\)/)
        networkMap.set(pattern[1], [ pattern[2], pattern[3] ] )
        
    }
    console.log(networkMap)

    let currentLocation = 'AAA'
    let currentInstruction = 0
    while (currentLocation !== 'ZZZ') {
        // console.log(`at ${currentLocation}, currentInstruction: ${currentInstruction}`)
        currentLocation = networkMap.get(currentLocation)[instructions[currentInstruction]]
        currentInstruction = (currentInstruction + 1) % (instructions.length - 1)
        numberOfSteps++
    }
    
    
    return numberOfSteps
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let instructions = lines[0]
    instructions = instructions.replace(/L/g, '0').replace(/R/g, '1')
    let numberOfSteps = 0

    // console.log('instructions:', instructions)
    
    let networkMap = new Map()
    let currentLocations = []
    for (let line = 2; line < lines.length; line++) {
        let pattern = lines[line].match(/(\w\w\w) = \((\w\w\w), (\w\w\w)\)/)
        if (pattern[1].charAt(2) === 'A') currentLocations.push(pattern[1])
        networkMap.set(pattern[1], [ pattern[2], pattern[3] ] )
        
    }
    
    // console.log('currentLocations:', currentLocations)
    let locationEndInZArray = new Array(currentLocations.length)
    let endInZFrequencyArray = new Array(currentLocations.length)
    for (let i = 0; i < locationEndInZArray.length; i++) {
        locationEndInZArray[i] = []
    }

    let currentInstruction = 0
    let allLocationsEndInZ = false
    let atLeastTwoZLocationsLogged = false
    while (!allLocationsEndInZ && !atLeastTwoZLocationsLogged) {
        numberOfSteps++
        if (numberOfSteps % 100000 === 0 ) {
            // console.log(`on step number ${numberOfSteps}`)
            // console.log(locationEndInZArray)
        }

        for (location = 0; location < currentLocations.length; location++) {
            // console.log(`at ${currentLocations[location]}, currentInstruction: ${instructions[currentInstruction]}`)
            currentLocations[location] = networkMap.get(currentLocations[location])[instructions[currentInstruction]]
            // console.log(`new location: ${currentLocations[location]}`)
            // console.log(currentLocations)
            
            if (currentLocations[location].match(/\w\wZ/g)) {
                // console.log(`location ${currentLocations[location]} ends in Z on step ${numberOfSteps}, adding to array at location ${location}`)
                locationEndInZArray[location].push(numberOfSteps)      
            }
        }
        
        currentInstruction = (currentInstruction + 1) % (instructions.length)
        allLocationsEndInZ = await doAllLocationsEndInZ(currentLocations)
        atLeastTwoZLocationsLogged = locationEndInZArray.every(array => array.length >= 3)
    }

    if (allLocationsEndInZ) return numberOfSteps

    // console.log(locationEndInZArray)

    for (let i = 0; i < locationEndInZArray.length; i++) {
        let frequency = Number(locationEndInZArray[i][1]) - Number(locationEndInZArray[i][0])
        endInZFrequencyArray[i] = frequency
        while (locationEndInZArray[i].length < 200000) {
            locationEndInZArray[i].push(Number(locationEndInZArray[i][locationEndInZArray[i].length-1]) + Number(frequency))
        }
    }

    // console.log(locationEndInZArray)

    // console.log(endInZFrequencyArray)

    let stepsNeededForAllToEndInZ = 0
    stepsNeededForAllToEndInZ = await findLowestCommonMultiple(endInZFrequencyArray)
    // for (let i = 100000; i < locationEndInZArray[0].length; i++) {
    //     let valueInAllArrays = true
    //     if (i % 1000 === 0 ) console.log(`checking the ${i} value of ${locationEndInZArray[0][i]}`)
    //     // Check each of the other arrays for matching numbers
    //     for (let arrayNumber = 1; arrayNumber < locationEndInZArray.length; arrayNumber++) {
    //         if (locationEndInZArray[arrayNumber].findIndex(value => value === locationEndInZArray[0][i]) === -1) {
    //             valueInAllArrays = false
    //             break
    //         }
    //     }
    //     if (valueInAllArrays) {
    //         stepsNeededForAllToEndInZ = locationEndInZArray[0][i]
    //         break
    //     }
    // }
    
    // calculate out the next x number of steps it will take each to end in Z.  Compare for matches

    

    return stepsNeededForAllToEndInZ

    // return Number(endInZFrequencyArray[0]) * Number(endInZFrequencyArray[1]) * endInZFrequencyArray[2] * endInZFrequencyArray[3] * endInZFrequencyArray[4] * endInZFrequencyArray[5] * endInZFrequencyArray[6]
}

// async function findLowestCommonMultiple ( arrayOfNumbers ) {
//     let lowestCommonMultiple = arrayOfNumbers[0]
//     for (let i = 1; i < arrayOfNumbers.length; i++) {
//         lowestCommonMultiple = lowestCommonMultiple * arrayOfNumbers[i]
//     }
//     return lowestCommonMultiple
// }

async function findLowestCommonMultiple ( arrayOfNumbers ) {
    arrayOfNumbers.sort((a,b) => b - a)
    let allNumbersDivisible = false
    let multiple = 1
    let largestNumber = arrayOfNumbers[0]
    let largestNumberIteration
    while (!allNumbersDivisible) {
        // console.log(`on multiple ${multiple}`)
        if (multiple % 1000000 === 0 ) console.log(`on multiple ${multiple}`)
        largestNumberIteration = largestNumber * multiple
        multiple++
        allNumbersDivisible = true
        for (let i = 1; i < arrayOfNumbers . length; i++) {
            allNumbersDivisible = (largestNumberIteration % arrayOfNumbers[i] === 0) ? true : false
            if (!allNumbersDivisible) break
        }
    }   
    return largestNumberIteration
}

async function doAllLocationsEndInZ ( locationArray ) {
    let allEndInZ = true
    for (let arrayNumber = 0; arrayNumber < locationArray.length; arrayNumber++) {
        allEndInZ = locationArray[arrayNumber].match(/\w\wZ/g) ? true : false
        // if (allEndInZ) console.log(`location ${locationArray[arrayNumber]} ends in Z`)
        if (!allEndInZ) break
    }
    return allEndInZ
}

// solvePartOne('./input.txt')
//  solvePartOne('./tests/data/input2.txt')
    // .then(answer => console.log('answer:', answer))

solvePartTwo('./input.txt')
// solvePartTwo('./tests/data/input3.txt')
    .then(answer => console.log('answer:', answer))



module.exports = { solvePartOne, solvePartTwo, doAllLocationsEndInZ } 