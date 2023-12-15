const { Console } = require('node:console')
const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let timeNumbers = lines[0].match(/\d+/g)
    let distanceNumbers = lines[1].match(/\d+/g)
    let races = []
    for (let i = 0; i < timeNumbers.length; i++) {
        races.push({time: Number(timeNumbers[i]), distance: Number(distanceNumbers[i])})
    }

    let howManyWaysToWin

    for (let raceNumber = 0; raceNumber < races.length; raceNumber++) {
        let race = races[raceNumber]
        let { minimumTimeToHold, maximumTimeToHold, numberOfWaysToWinCurrentRace} = await findWaysToWinRace(race.time, race.distance)
        
        // console.log(`race ${raceNumber}, minimum time ${minimumTimeToHold}, maximum time ${maximumTimeToHold}, number of ways to win: ${numberOfWaysToWinCurrentRace}`)
        if (raceNumber === 0 ) {
            howManyWaysToWin = numberOfWaysToWinCurrentRace
        } else {
            howManyWaysToWin = howManyWaysToWin * numberOfWaysToWinCurrentRace
        }
    }
    
    return howManyWaysToWin
}

async function boatTravelDistance ( numberOfSecondsCharged, amountOfTimeRemaining ) {
    return numberOfSecondsCharged * amountOfTimeRemaining
}

async function findWaysToWinRace ( raceTime, raceDistance) {
    // Find the minimum amount to hold to reach the distance
    let minimumTimeToHold
    let maximumTimeToHold
    for (let time = 0; time < raceTime - 1; time++) {
        let distance = await boatTravelDistance(time, raceTime - time)
        if (distance > raceDistance) {
            minimumTimeToHold = time
            break
        }
    }
    for (let time = raceTime - 1; time > 0; time--) {
        let distance = await boatTravelDistance(time, raceTime - time)
        if (distance > raceDistance) {
            maximumTimeToHold = time
            break
        }

    }
    let numberOfWaysToWinCurrentRace = maximumTimeToHold - minimumTimeToHold + 1
    return { minimumTimeToHold, maximumTimeToHold, numberOfWaysToWinCurrentRace }
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let timeNumbers = lines[0].replace(/ /g, '').match(/\d+/g)
    let distanceNumbers = lines[1].replace(/ /g, '').match(/\d+/g)
    let races = []
    for (let i = 0; i < timeNumbers.length; i++) {
        races.push({time: Number(timeNumbers[i]), distance: Number(distanceNumbers[i])})
    }

    let howManyWaysToWin

    for (let raceNumber = 0; raceNumber < races.length; raceNumber++) {
        let race = races[raceNumber]
        let { minimumTimeToHold, maximumTimeToHold, numberOfWaysToWinCurrentRace} = await findWaysToWinRace(race.time, race.distance)
        
        // console.log(`race ${raceNumber}, minimum time ${minimumTimeToHold}, maximum time ${maximumTimeToHold}, number of ways to win: ${numberOfWaysToWinCurrentRace}`)
        if (raceNumber === 0 ) {
            howManyWaysToWin = numberOfWaysToWinCurrentRace
        } else {
            howManyWaysToWin = howManyWaysToWin * numberOfWaysToWinCurrentRace
        }
    }
    
    return howManyWaysToWin

}

// solvePartOne('./input.txt')
// solvePartOne('./tests/data/input.txt')
//     .then(answer => console.log('answer:', answer))

solvePartTwo('./input.txt')
// solvePartTwo('./tests/data/input.txt')
    .then(answer => console.log('answer:', answer))



module.exports = { solvePartOne, solvePartTwo } 