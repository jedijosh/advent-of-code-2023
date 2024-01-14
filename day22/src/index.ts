import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = false

class Cube {
    id: number
    disintegrated: boolean = false
    firstPoint: {x: number, y: number, z: number}  = {x: 0, y: 0, z: 0}
    secondPoint: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0}
    cubesAbove: Array<number> = []
    cubesBelow: Array<number> = []
    coordinates: Array<string> = []
    numberOfBricksSupporting: number = -1

constructor (id: number, firstPoint: Array<string>, secondPoint: Array<string>) {
    this.id = id    
    if (parseInt(firstPoint[2]) <= parseInt(secondPoint[2])) {
            this.firstPoint.x = parseInt(firstPoint[0])
            this.firstPoint.y = parseInt(firstPoint[1])
            this.firstPoint.z = parseInt(firstPoint[2])
            this.secondPoint.x = parseInt(secondPoint[0])
            this.secondPoint.y = parseInt(secondPoint[1])
            this.secondPoint.z = parseInt(secondPoint[2])
        } else {
            this.firstPoint.x = parseInt(secondPoint[0])
            this.firstPoint.y = parseInt(secondPoint[1])
            this.firstPoint.z = parseInt(secondPoint[2])
            this.secondPoint.x = parseInt(firstPoint[0])
            this.secondPoint.y = parseInt(firstPoint[1])
            this.secondPoint.z = parseInt(firstPoint[2])
        }

        for (let x = this.firstPoint.x; x <= this.secondPoint.x; x++) {
            for (let y = this.firstPoint.y; y <= this.secondPoint.y; y++) {
                this.coordinates.push(`${x},${y}`)
            }
        }
       
    }
    // Horizontal if minZ = maxZ
    isHorizonal () {
        return this.firstPoint.z === this.secondPoint.z
    }

    // Returns an array of strings containing the X,Y coordinates occupied by this brick
    getAllXYCoordinates (): Array<string> {
        return this.coordinates
    }

}

export async function solvePartOne ( filename : string) {
    let safeToDisintegrateCount: number = 0
    let brickMap: Map<string, Array<Cube>> = new Map()

    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let cubeArray: Array<Cube> = []

    // Store all brick values
    for (let lineNumber = 0; lineNumber < fileLines.length; lineNumber++) {
        let line = fileLines[lineNumber]
        let points = line.split('~')
        if (LOGGING) console.log(points)
        let firstPoint: Array<string> = points[0].split(',')
        let secondPoint = points[1].split(',')
        let newCube = new Cube(lineNumber, firstPoint, secondPoint)
        cubeArray.push(newCube) 
        let cubeXYCoordinates = newCube.getAllXYCoordinates()
        for (let coordinate of cubeXYCoordinates) {
            let bricksAtCoordinate = brickMap.get(coordinate)
            if (!bricksAtCoordinate) {
                brickMap.set(coordinate, [newCube])
            } else {
                bricksAtCoordinate.push(newCube)
            }
        }
    }

    if (LOGGING) console.log(brickMap)

    // Sort the cube array in descending order.
    cubeArray.sort((a, b) => a.firstPoint.z - b.firstPoint.z)
    if (LOGGING) console.log('---------------- AFTER SORTING ----------------')
    if (LOGGING) console.log(cubeArray)
   
    if (LOGGING) console.log('---------------- FIND FINAL RESTING STATE ----------------')
    // Figure out the final resting state
    for (let i = 0; i < cubeArray.length; i++) {
        // For each cube, find the max z value of another cube which shares X and Y coordinates
        let cubeToCheck = cubeArray[i]
        if (LOGGING) console.log(`Checking ${JSON.stringify(cubeToCheck)}`)
        // If cube is already at z=1, it cannot go lower.
        if (cubeToCheck.firstPoint.z === 1) continue

        let maxZValue = 1
        let bricksBelow: Array<number> = []
        
        let cubeCoordinates = cubeToCheck.getAllXYCoordinates()
        // Need to loop through all X,Y coordinates and find the next largest z value
        for (let coordinate of cubeCoordinates) {
            if (LOGGING) console.log(`Checking coordinate ${coordinate}`)
            // Need to check all coordinates before determining final z value
            let bricksAtCoordinate = brickMap.get(coordinate)

            // There will always be at least one brick at this coordinate as the cubeToCheck would be in the array.
            if (bricksAtCoordinate && bricksAtCoordinate.length > 1) {
                for (let brick of bricksAtCoordinate) {
                    if (brick.id !== cubeToCheck.id && brick.secondPoint.z < cubeToCheck.firstPoint.z) {
                        if (brick.secondPoint.z + 1 > maxZValue) {
                            maxZValue = brick.secondPoint.z + 1
                            bricksBelow = [ brick.id ] // Need to capture all bricks which are below
                            if (LOGGING) console.log(`Set maxZValue to ${maxZValue}`)
                        }
                        if (brick.secondPoint.z + 1 === maxZValue) {
                            maxZValue = brick.secondPoint.z + 1
                            if(!bricksBelow.includes(brick.id)) bricksBelow.push(brick.id) // Need to capture all bricks which are below
                            if (LOGGING) console.log(`Set maxZValue to ${maxZValue}`)
                        }
                    }
                }
            }
            if (LOGGING) console.log(`maxZValue is ${maxZValue}`)
        }
        
        let distance = cubeToCheck.firstPoint.z - maxZValue
        if (LOGGING) console.log(`Moving ${cubeToCheck.id} down by ${distance} starting from ${cubeToCheck.firstPoint.z} and ${cubeToCheck.secondPoint.z}`)
        cubeToCheck.firstPoint.z -= distance
        cubeToCheck.secondPoint.z -= distance
        if (LOGGING) console.log(`New z values: ${cubeToCheck.firstPoint.z} and ${cubeToCheck.secondPoint.z}`)
        for (let brick of bricksBelow) {
            if (LOGGING) console.log(`${brick} is below ${i}`)
            cubeArray[i].cubesBelow.push(brick)
            if (LOGGING) console.log(`${i} is above ${brick}`)
            cubeArray[brick].cubesAbove.push(i)
        }
        if (LOGGING) console.log('----------------')
    }
    
    if (LOGGING) console.log('---------------- AFTER MOVING DOWN ----------------')
    if (LOGGING) console.log(cubeArray)

    for (let i = 0; i < cubeArray.length; i++) {
        let cubeToCheck = cubeArray[i]
        // If there are no cubes above, this is safe to disintegrate
        if (cubeToCheck.cubesAbove.length === 0 && !cubeToCheck.disintegrated) {
            if (LOGGING) console.log(`Nothing above, ok to disintegrate ${i}`)
            safeToDisintegrateCount++
            cubeToCheck.disintegrated = true
        } else {
            let allCubesAboveSupportedElsewhere = true
            for(let indexOfCubeAbove of cubeToCheck.cubesAbove) {
                if (cubeArray[indexOfCubeAbove].cubesBelow.length === 1) {
                    allCubesAboveSupportedElsewhere = false
                    if (LOGGING) console.log(`Cannot disintegrate ${i}. Brick ${indexOfCubeAbove} is only supported by ${i}.`)
                    break    
                }   
            }
            if (allCubesAboveSupportedElsewhere) {
                if (LOGGING) console.log(`Brick ${cubeToCheck.id} has bricks above but they are supported elsewhere. Ok to disintegrate.`)
                cubeToCheck.disintegrated = true
                safeToDisintegrateCount++
            }
        }

    }
    if (LOGGING) console.log('---------------- AFTER CHECKING FOR DISINTEGRATION ----------------')
    if (LOGGING) console.log(cubeArray)
    
    return safeToDisintegrateCount
}

export async function solvePartTwo ( filename : string) {
    let result: number = 0
    let brickMap: Map<string, Array<Cube>> = new Map()

    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let cubeArray: Array<Cube> = []

    // Store all brick values
    for (let lineNumber = 0; lineNumber < fileLines.length; lineNumber++) {
        let line = fileLines[lineNumber]
        let points = line.split('~')
        if (LOGGING) console.log(points)
        let firstPoint: Array<string> = points[0].split(',')
        let secondPoint = points[1].split(',')
        let newCube = new Cube(lineNumber, firstPoint, secondPoint)
        cubeArray.push(newCube) 
        let cubeXYCoordinates = newCube.getAllXYCoordinates()
        for (let coordinate of cubeXYCoordinates) {
            let bricksAtCoordinate = brickMap.get(coordinate)
            if (!bricksAtCoordinate) {
                brickMap.set(coordinate, [newCube])
            } else {
                bricksAtCoordinate.push(newCube)
            }
        }
    }

    if (LOGGING) console.log(brickMap)

    // Sort the cube array in descending order.
    cubeArray.sort((a, b) => a.firstPoint.z - b.firstPoint.z)
    if (LOGGING) console.log('---------------- AFTER SORTING ----------------')
    if (LOGGING) console.log('---------------- FIND FINAL RESTING STATE ----------------')
    // Figure out the final resting state
    for (let i = 0; i < cubeArray.length; i++) {
        // For each cube, find the max z value of another cube which shares X and Y coordinates
        let cubeToCheck = cubeArray[i]
        if (LOGGING) console.log(`Checking ${JSON.stringify(cubeToCheck)}`)
        // If cube is already at z=1, it cannot go lower.
        if (cubeToCheck.firstPoint.z === 1) continue

        let maxZValue = 1
        let brickIdsBelow: Array<number> = []
        
        let cubeCoordinates = cubeToCheck.getAllXYCoordinates()
        // Need to loop through all X,Y coordinates and find the next largest z value
        for (let coordinate of cubeCoordinates) {
            if (LOGGING) console.log(`Checking coordinate ${coordinate}`)
            // Need to check all coordinates before determining final z value
            let bricksAtCoordinate = brickMap.get(coordinate)

            // There will always be at least one brick at this coordinate as the cubeToCheck would be in the array.
            if (bricksAtCoordinate && bricksAtCoordinate.length > 1) {
                for (let brick of bricksAtCoordinate) {
                    if (brick.id !== cubeToCheck.id && brick.secondPoint.z < cubeToCheck.firstPoint.z) {
                        if (brick.secondPoint.z + 1 > maxZValue) {
                            maxZValue = brick.secondPoint.z + 1
                            // Start capturing the bricks which are below
                            brickIdsBelow = [ brick.id ]
                            if (LOGGING) console.log(`Set maxZValue to ${maxZValue}`)
                        }
                        if (brick.secondPoint.z + 1 === maxZValue) {
                            maxZValue = brick.secondPoint.z + 1
                            if(!brickIdsBelow.includes(brick.id)) brickIdsBelow.push(brick.id)
                            if (LOGGING) console.log(`Adding additional brick at ${maxZValue}`)
                        }
                    }
                }
            }
            if (LOGGING) console.log(`maxZValue is ${maxZValue}`)
        }
        
        let distance = cubeToCheck.firstPoint.z - maxZValue
        if (LOGGING) console.log(`Moving ${cubeToCheck.id} down by ${distance} starting from ${cubeToCheck.firstPoint.z} and ${cubeToCheck.secondPoint.z}`)
        cubeToCheck.firstPoint.z -= distance
        cubeToCheck.secondPoint.z -= distance
        if (LOGGING) console.log(`New z values: ${cubeToCheck.firstPoint.z} and ${cubeToCheck.secondPoint.z}`)
        for (let brickId of brickIdsBelow) {
            cubeArray[i].cubesBelow.push(brickId)
            let cubeToUpdate = cubeArray.find(cubeObject => cubeObject.id === brickId)
            if (cubeToUpdate == undefined) break
            cubeToUpdate.cubesAbove.push(cubeToCheck.id)
        }
        if (LOGGING) console.log('----------------')
    }
    
    if (LOGGING) console.log('---------------- AFTER MOVING DOWN ----------------')
    if (LOGGING) console.log(cubeArray)

    for (let i = 0; i < cubeArray.length; i++) {
        let cubesWhichWillFall = 0
        
        let fallingCubes: Array<number> = [cubeArray[i].id]
        let disintegratedCubes: Array<number> = []
        while(fallingCubes.length > 0) {
            let idOfCubeToCheck = fallingCubes.shift()
            if (idOfCubeToCheck == undefined) break
            disintegratedCubes.push(idOfCubeToCheck)
            
            // Look at each cube above the cubeToCheck
            let cubeToCheck = cubeArray.find(cubeObject => cubeObject.id === idOfCubeToCheck)
            if (cubeToCheck == undefined) break
            for(let idOfCubeAbove of cubeToCheck.cubesAbove) {
                // For each cube, see if there are any remaining bricks below it will will still support it.
                if (LOGGING) console.log(`Within cube ${i}, checking brick ${idOfCubeAbove} above brick ${idOfCubeToCheck}`)
                let cubeAbove = cubeArray.find(cubeObject => cubeObject.id === idOfCubeAbove)
                if (cubeAbove == undefined) break
                
                let cubeSupported = false
                // Check the cubesBelow to see if there are any non-disintegrated which will support this cube
                for (let idOfBrickBelow of cubeAbove.cubesBelow) {
                    if (LOGGING) console.log(`checking if ${idOfCubeAbove} will still be supported by ${idOfBrickBelow}`)
                    if (!disintegratedCubes.includes(idOfBrickBelow)) cubeSupported = true
                }
                if (!cubeSupported) {
                    if (LOGGING) console.log(`Disintegrating ${idOfCubeToCheck} will cause brick ${idOfCubeAbove} to fall.`) 
                    disintegratedCubes.push(idOfCubeToCheck)
                    cubesWhichWillFall++
                    if (!fallingCubes.includes(idOfCubeAbove)) {
                        fallingCubes.push(idOfCubeAbove)
                    }
                }  
            }
        }
        result += cubesWhichWillFall
    }
    return result
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day22/data'

// solvePartOne(dataFolder + '/tests/input.txt')
// solvePartOne(dataFolder + '/input.txt')
//     .then(answer => console.log('answer:', answer))

// solvePartTwo(dataFolder + '/tests/input.txt')
solvePartTwo(dataFolder + '/input.txt')
    .then(answer => console.log('answer:', answer))
