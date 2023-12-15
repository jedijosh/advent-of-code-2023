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
            let priorValue = currentValue
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
        let destinationRangeEnd = Number(destinationRangeStart) + Number(rangeLength)
        let sourceRangeEnd = Number(sourceRangeStart) + Number(rangeLength)
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

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    
}

async function buildSeedToSoilMap () {

}

// solvePartOne('./tests/data/input.txt')
solvePartOne('./input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartTwo('./input.txt')
//     .then(sumOfGames => console.log('sumOfGames:', sumOfGames))

module.exports = { solvePartOne, solvePartTwo }