const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()

    let lines = fileInput.trim().split('\n')

    let currentLightLocations = [ { x: 0, y: -1, direction: 'R' }]
    let energizedMap = []
    let boardWidth = lines[0].length - 1
    let boardHeight = lines.length - 1
    let numberOfNodesEnergized = 0

    for (let y = 0; y < lines.length; y++) {
        energizedMap[y] = []
        for (let charPosition = 0; charPosition < lines[0].length; charPosition++) {
            energizedMap[y].push( { energized: false, energizedDirections: [] })
        }
    }
    
    // console.log('energizedMap:')
    // console.log(energizedMap)
    while (currentLightLocations.length > 0 ) {
        for (let lightNumber = 0; lightNumber < currentLightLocations.length; lightNumber++) {
            // console.log('energizedMap:')
            // console.log(energizedMap)

            switch (currentLightLocations[lightNumber].direction) {
                case 'R':
                    currentLightLocations[lightNumber].y++
                    break
                case 'L':
                    currentLightLocations[lightNumber].y--
                    break
                case 'U':
                    currentLightLocations[lightNumber].x--
                    break
                case 'D':
                    currentLightLocations[lightNumber].x++
                    break
            }
            let newXPosition = currentLightLocations[lightNumber].x
            let newYPosition = currentLightLocations[lightNumber].y
            // console.log(`new positions are ${newXPosition}, ${newYPosition}`)
            // Check if location is still on the map
            if (newXPosition === -1 || newXPosition > boardWidth || newYPosition === -1 || newYPosition > boardHeight) {
                // Don't need to trace the light further as it is now off the board.
                // console.log(`removing light as new positions are ${newXPosition}, ${newYPosition}`)
                currentLightLocations.splice([lightNumber], 1)
                // Move the light position back one so we don't skip a spot
                lightNumber--
            } else {
                // New location is still on the map
                // Check if location is already energized
                if (energizedMap[newXPosition][newYPosition].energized) {
                    // If the node was already energized from this direction, no need to trace further
                    
                    if (energizedMap[newXPosition][newYPosition].energizedDirections.findIndex(element => element === currentLightLocations[lightNumber].direction) !== -1) {
                        // console.log(`already energized from direction ${currentLightLocations[lightNumber].direction}, stopping trace`)
                        currentLightLocations.splice([lightNumber], 1)
                        // Move the light position back one so we don't skip a spot
                        lightNumber--
                    } else {
                        energizedMap[newXPosition][newYPosition].energizedDirections.push(currentLightLocations[lightNumber].direction)
                        let newDirections = await findNextDirectionsToTravel(lines, currentLightLocations[lightNumber].direction, newXPosition, newYPosition)
                        currentLightLocations[lightNumber].direction = newDirections[0]
                        if (newDirections.length === 2) {
                            currentLightLocations.push({ x: newXPosition, y: newYPosition, direction: newDirections[1] })
                        }
                    }
                } else {
                    // Energize the location and log the direction the node was energized from
                    energizedMap[newXPosition][newYPosition].energized = true
                    numberOfNodesEnergized++
                    energizedMap[newXPosition][newYPosition].energizedDirections.push(currentLightLocations[lightNumber].direction)
                    let newDirections = await findNextDirectionsToTravel(lines, currentLightLocations[lightNumber].direction, newXPosition, newYPosition)
                    currentLightLocations[lightNumber].direction = newDirections[0]
                    if (newDirections.length === 2) {
                        currentLightLocations.push({ x: newXPosition, y: newYPosition, direction: newDirections[1] })
                    }
                }
            }
        }  
    }   
    
    return numberOfNodesEnergized    
}

async function findNextDirectionsToTravel ( board, currentDirection, newXPosition, newYPosition ) {
    let newDirections = [ currentDirection ]
    let newSpace = board[newXPosition].substring(newYPosition, newYPosition+1)
    // console.log(`newXPosition: ${newXPosition}, newYPosition: ${newYPosition}, newSpace: ${newSpace}`)
    if (currentDirection === 'R' || currentDirection === 'L') { 
        switch (newSpace) {
            case '.':
                // New space is empty, continue in same direction
                break
            case '-':
                // Traveling horizontally and hit "pointy end", continue normally
                break
            case '/':
                newDirections[0] === 'R' ? newDirections[0] = 'U' : newDirections[0] = 'D'
                break
            case '\\':
                newDirections[0] === 'R' ? newDirections[0] = 'D' : newDirections[0] = 'U'
                break
            case '|':
                // console.log('traveling horizontally and hit splitter')    
                // Split into 2
                // Set the current direction to up
                newDirections[0] = 'U'
                // Create a new light trace going down
                newDirections.push('D')
                break
        }
    } else {
        // console.log('traveling vertically')
        // Traveling vertically
        switch (newSpace) {
            case '.':
                // New space is empty, continue in same direction
                break
            case '/':
                currentDirection === 'D' ? newDirections[0] = 'L' : newDirections[0] = 'R'
                break
            case '\\':
                currentDirection === 'U' ? newDirections[0] = 'L' : newDirections[0] = 'R'
                break
            case '|':
                // Traveling vertically and hit "pointy end", continue normally
                break
            default:
                // console.log('traveling vertically and hit splitter')
                // Split into 2
                // Set the current direction to up
                newDirections[0] = 'L'
                // Create a new light trace going down
                newDirections.push('R')
                break
        }
    }

    return newDirections
}

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()

    let lines = fileInput.trim().split('\n')
    let maxiumumNumberEnergized = 0    

    let startingLightLocations = []
    // go across the top and bottom with directions down and up (respectively)
    for (let i = 0; i < lines[0].length; i++) {
        startingLightLocations.push({ x: -1, y: i, direction: 'D' })
        startingLightLocations.push({ x: lines.length, y: i, direction: 'U' })
    }

    for (let i = 0; i < lines.length; i++) {
        startingLightLocations.push({ x: i, y: -1, direction: 'R' })
        startingLightLocations.push({ x: i, y: lines[0].length, direction: 'L' })
    }
    
    for (let startingConfiguration = 0; startingConfiguration < startingLightLocations.length; startingConfiguration++) {
        // let currentLightLocations = [ { x: 0, y: -1, direction: 'R' }]
        
        console.log(`running configuration #${startingConfiguration} of ${startingLightLocations.length-1}`)
        let currentLightLocations = []
        currentLightLocations.push(startingLightLocations[startingConfiguration])
        let energizedMap = []
        let boardWidth = lines[0].length - 1
        let boardHeight = lines.length - 1
        let numberOfNodesEnergized = 0

        for (let y = 0; y < lines.length; y++) {
            energizedMap[y] = []
            for (let charPosition = 0; charPosition < lines[0].length; charPosition++) {
                energizedMap[y].push( { energized: false, energizedDirections: [] })
            }
        }
        
        // console.log('energizedMap:')
        // console.log(energizedMap)
        while (currentLightLocations.length > 0 ) {
            for (let lightNumber = 0; lightNumber < currentLightLocations.length; lightNumber++) {
                // console.log('energizedMap:')
                // console.log(energizedMap)

                switch (currentLightLocations[lightNumber].direction) {
                    case 'R':
                        currentLightLocations[lightNumber].y++
                        break
                    case 'L':
                        currentLightLocations[lightNumber].y--
                        break
                    case 'U':
                        currentLightLocations[lightNumber].x--
                        break
                    case 'D':
                        currentLightLocations[lightNumber].x++
                        break
                }
                let newXPosition = currentLightLocations[lightNumber].x
                let newYPosition = currentLightLocations[lightNumber].y
                // console.log(`new positions are ${newXPosition}, ${newYPosition}`)
                // Check if location is still on the map
                if (newXPosition === -1 || newXPosition > boardWidth || newYPosition === -1 || newYPosition > boardHeight) {
                    // Don't need to trace the light further as it is now off the board.
                    // console.log(`removing light as new positions are ${newXPosition}, ${newYPosition}`)
                    currentLightLocations.splice([lightNumber], 1)
                    // Move the light position back one so we don't skip a spot
                    lightNumber--
                } else {
                    // New location is still on the map
                    // Check if location is already energized
                    if (energizedMap[newXPosition][newYPosition].energized) {
                        // If the node was already energized from this direction, no need to trace further
                        
                        if (energizedMap[newXPosition][newYPosition].energizedDirections.findIndex(element => element === currentLightLocations[lightNumber].direction) !== -1) {
                            // console.log(`already energized from direction ${currentLightLocations[lightNumber].direction}, stopping trace`)
                            currentLightLocations.splice([lightNumber], 1)
                            // Move the light position back one so we don't skip a spot
                            lightNumber--
                        } else {
                            energizedMap[newXPosition][newYPosition].energizedDirections.push(currentLightLocations[lightNumber].direction)
                            let newDirections = await findNextDirectionsToTravel(lines, currentLightLocations[lightNumber].direction, newXPosition, newYPosition)
                            currentLightLocations[lightNumber].direction = newDirections[0]
                            if (newDirections.length === 2) {
                                currentLightLocations.push({ x: newXPosition, y: newYPosition, direction: newDirections[1] })
                            }
                        }
                    } else {
                        // Energize the location and log the direction the node was energized from
                        energizedMap[newXPosition][newYPosition].energized = true
                        numberOfNodesEnergized++
                        energizedMap[newXPosition][newYPosition].energizedDirections.push(currentLightLocations[lightNumber].direction)
                        let newDirections = await findNextDirectionsToTravel(lines, currentLightLocations[lightNumber].direction, newXPosition, newYPosition)
                        currentLightLocations[lightNumber].direction = newDirections[0]
                        if (newDirections.length === 2) {
                            currentLightLocations.push({ x: newXPosition, y: newYPosition, direction: newDirections[1] })
                        }
                    }
                }
            }  
        }   
        
        if (numberOfNodesEnergized > maxiumumNumberEnergized) {
            maxiumumNumberEnergized = numberOfNodesEnergized
        }
        
    }
    return maxiumumNumberEnergized
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day16'
// solvePartOne(dataFolder + '/data/tests/input.txt')
// solvePartOne(dataFolder + '/data/input.txt')

// solvePartTwo(dataFolder + '/data/tests/input.txt')
 solvePartTwo(dataFolder + '/data/input.txt')
 
    .then(answer => console.log('answer:', answer))

module.exports = { solvePartOne, solvePartTwo }