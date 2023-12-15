const { Console } = require('node:console')
const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let seedList = []
    let mappingData = new Map()

    for ( let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        if ( lineNumber === 0) {
            seedList = lines[lineNumber].match(/\d+/g)
        }

        if (lines[lineNumber].trim() === '') {
            lineNumber++
            let mapSection = lines[lineNumber].trim()
            let linesInSection = []
            lineNumber++
            while (lineNumber < lines.length && lines[lineNumber].trim() !== '') {
                linesInSection.push(lines[lineNumber])
                lineNumber++
            }
            let processedData = await processMapLines(mapSection, linesInSection)
            // console.log(processedData)
            mappingData.set(processedData.sourceSubject, {
                destinationSubject: processedData.destinationSubject,
                arrayOfMaps: processedData.arrayOfMaps
            })
            lineNumber--
        }
    }

    let minLocation
    for (let seed of seedList) {
        let currentSubject = 'seed'
        let currentValue = seed
        while (currentSubject !== 'location') {
            let currentArrayOfMaps = mappingData.get(currentSubject).arrayOfMaps
            // let currentSubjectMap = new Map(mappingData.get(currentSubject).mappedValues)
            // console.log(currentArrayOfMaps)
            // let newValue = currentSubjectMap.get(Number(currentValue))
            let newValue = await findDestinationValue(currentValue, currentArrayOfMaps)
            if (newValue) currentValue = newValue
            currentSubject = mappingData.get(currentSubject).destinationSubject
        }
        if (!minLocation || currentValue < minLocation) minLocation = currentValue
    }
    return minLocation    
}

async function findDestinationValue ( searchValue, arrayOfRanges) {
    // console.log('searching for', searchValue)
    // console.log('array', arrayOfRanges)
    let returnValue = searchValue
    for (let i = 0; i < arrayOfRanges.length; i++) {
        if ( Number(searchValue) >= Number(arrayOfRanges[i].sourceRangeStart) && Number(searchValue) <= Number(arrayOfRanges[i].sourceRangeEnd)) {
            // console.log(`${searchValue} is between ${arrayOfRanges[i].sourceRangeStart} and ${arrayOfRanges[i].sourceRangeEnd}`)
            let positionInRange = Number(searchValue) - arrayOfRanges[i].sourceRangeStart
            returnValue = Number(arrayOfRanges[i].destinationRangeStart + positionInRange)
            break
        }
    }
    return returnValue
}

async function processMapLines ( mapSection, linesInSection) {
    let wordsInMapSection = mapSection.split(' ')[0].split('-')
    let sourceSubject = wordsInMapSection[0]
    let destinationSubject = wordsInMapSection[2]
    let arrayOfMaps = []
    for (line of linesInSection) {       
        let numbersInLine = line.match(/\d+/g)
        let destinationRangeStart = Number(numbersInLine[0])
        let sourceRangeStart = Number(numbersInLine[1])
        let rangeLength = Number(numbersInLine[2])
        let destinationRangeEnd = Number(destinationRangeStart) + Number(rangeLength) - 1
        let sourceRangeEnd = Number(sourceRangeStart) + Number(rangeLength) - 1
        // console.log(`destinationRangeStart ${destinationRangeStart}, destinationRangeEnd ${destinationRangeEnd}, rangeLength ${rangeLength}`)
        // console.log(`sourceRangeStart ${sourceRangeStart}, sourceRangeEnd ${sourceRangeEnd}, rangeLength ${rangeLength}`)
        arrayOfMaps.push({
            sourceRangeStart,
            sourceRangeEnd,
            destinationRangeStart,
            destinationRangeEnd
        })
        // for (let numberInRange = 0; numberInRange < rangeLength; numberInRange++) {
        //     mappedValues.set(Number(sourceRangeStart) + Number(numberInRange), Number(destinationRangeStart) + Number(numberInRange))
        // }
    }    
    return {
        sourceSubject,
        destinationSubject,
        arrayOfMaps
    } 
}

async function processMapLinesInReverse ( mapSection, linesInSection) {
    let wordsInMapSection = mapSection.split(' ')[0].split('-')
    let destinationSubject = wordsInMapSection[0]
    let sourceSubject = wordsInMapSection[2]
    let arrayOfMaps = []
    for (line of linesInSection) {       
        let numbersInLine = line.match(/\d+/g)
        //  let destinationRangeStart = Number(numbersInLine[0])
        // let sourceRangeStart = Number(numbersInLine[1])
        // let rangeLength = Number(numbersInLine[2])
        // let destinationRangeEnd = Number(destinationRangeStart) + Number(rangeLength)
        // let sourceRangeEnd = Number(sourceRangeStart) + Number(rangeLength)
        
        
        let sourceRangeStart = Number(numbersInLine[0])
        let destinationRangeStart = Number(numbersInLine[1])
        let rangeLength = Number(numbersInLine[2])
        let sourceRangeEnd = Number(sourceRangeStart) + Number(rangeLength) - 1
        let destinationRangeEnd = Number(destinationRangeStart) + Number(rangeLength) - 1
        // console.log(`destinationRangeStart ${destinationRangeStart}, destinationRangeEnd ${destinationRangeEnd}, rangeLength ${rangeLength}`)
        // console.log(`sourceRangeStart ${sourceRangeStart}, sourceRangeEnd ${sourceRangeEnd}, rangeLength ${rangeLength}`)
        arrayOfMaps.push({
            sourceRangeStart,
            sourceRangeEnd,
            destinationRangeStart,
            destinationRangeEnd
        })
    }    
    return {
        sourceSubject,
        destinationSubject,
        arrayOfMaps
    } 
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let seedList = []
    let mappingData = new Map()

    for ( let lineNumber = 0; lineNumber < lines.length; lineNumber++ ) {
        // Build mapping ranges for seeds
        if ( lineNumber === 0) {
            let arrayOfMaps = []
            seedList = lines[lineNumber].match(/\d+/g)
            for (let seedRange = 0; seedRange < seedList.length; seedRange = seedRange + 2) {
                arrayOfMaps.push({
                    sourceRangeStart: Number(seedList[seedRange]),
                    sourceRangeEnd: Number(seedList[seedRange]) + Number(seedList[seedRange + 1]) - 1
                })
            }
            console.log(`arrayOfMaps:`)
            console.log(arrayOfMaps)
            mappingData.set('seed', {
                arrayOfMaps: arrayOfMaps
            })
        }

        if (lines[lineNumber].trim() === '') {
            lineNumber++
            let mapSection = lines[lineNumber].trim()
            let linesInSection = []
            lineNumber++
            while (lineNumber < lines.length && lines[lineNumber].trim() !== '') {
                linesInSection.push(lines[lineNumber])
                lineNumber++
            }
            let processedData = await processMapLinesInReverse(mapSection, linesInSection)
            mappingData.set(processedData.sourceSubject, {
                destinationSubject: processedData.destinationSubject,
                arrayOfMaps: processedData.arrayOfMaps
            })
            lineNumber--
        }
    }

    let minLocation = 0
    let seedExistsForLocation = false
    while (!seedExistsForLocation) {
        
        if (minLocation % 500000 === 0 ) console.log(`checking location ${minLocation}`)
        let currentSubject = 'location'
        let currentValue = minLocation
        while (currentSubject !== 'seed') {
            let currentArrayOfMaps = mappingData.get(currentSubject).arrayOfMaps
            // console.log(currentArrayOfMaps)
            let newValue = await findDestinationValue(currentValue, currentArrayOfMaps)
            if (newValue) currentValue = newValue
            currentSubject = mappingData.get(currentSubject).destinationSubject
        }
        // Current subject is now seed.  Check if the seed is in the range
        // console.log(`checking if seed ${currentValue} is in the range`)
        let seedMap = mappingData.get('seed').arrayOfMaps
        let seedExists = false
        for (let i = 0; i < seedMap.length; i++) {
            if ( Number(currentValue) >= Number(seedMap[i].sourceRangeStart) && Number(currentValue) <= Number(seedMap[i].sourceRangeEnd)) {
                console.log(`${currentValue} is between ${seedMap[i].sourceRangeStart} and ${seedMap[i].sourceRangeEnd}`)
                seedExists = true
                break
            }
        }
        
        if (seedExists) {
            seedExistsForLocation = true
        } else {
            minLocation++
        }
    }
    
    return minLocation
}

// solvePartOne('./input.txt')
//     .then(answer => console.log('answer:', answer))

solvePartTwo('./input.txt')
//solvePartTwo('./tests/data/input.txt')
    .then(answer => console.log('answer:', answer))

module.exports = { solvePartOne, solvePartTwo }