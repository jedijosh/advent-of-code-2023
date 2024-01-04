import { parseFileIntoArrayOfLines } from './utils'

const STORE_PATH = false
const LOGGING = false

export async function solvePartOne ( filename : string) {
    // Have to let all the bricks fall until they settle?

    // Do the bricks need to fall?  As long as you know whether there is something below/above the brick,
    // does it matter what the end stack looks like?

    // I think we do need to figure out the final state

    // Need to be able to get the points above and below the current y value
    // Need to know what is above and below each brick.
    //   If nothing above, can be disintegrated.
    //   If something above but there is another brick below that one, the current brick can be disintegrated.
    
    // Array of z values?

    class Cube {
        firstPoint: {x: number, y: number, z: number}  = {x: 0, y: 0, z: 0}
        secondPoint: {x: number, y: number, z: number} = {x: 0, y: 0, z: 0}
        cubesAbove: Array<number> = []
        cubesBelow: Array<number> = []

        // If minZ is 1, brick is resting on the ground

//        constructor (firstPoint: {x: number, y: number, z: number}, secondPoint: {x: number, y: number, z: number}) {
    constructor (firstPoint: Array<string>, secondPoint: Array<string>) {
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
           
        }
        // Horizontal if minZ = maxZ
        isHorizonal () {
            return this.firstPoint.z === this.secondPoint.z
        
        }

    }
    let safeToDisintegrateCount: number = 0
    let zArray: Array<{x: number, y: number}>

    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let cubeArray: Array<Cube> = []

    // Store all brick values
    for (let line of fileLines) {
        let points = line.split('~')
        console.log(points)
        let firstPoint: Array<string> = points[0].split(',')
        let secondPoint = points[1].split(',')
        cubeArray.push(new Cube(firstPoint, secondPoint)) 
    }

    // Sort the cube array in descending order.
    cubeArray.sort((a, b) => a.firstPoint.z - b.firstPoint.z)
   
    // Figure out the final resting state
    let piecesMoved = true
    while(piecesMoved) {
        for (let i = 0; i < cubeArray.length - 1; i++) {
            // For each cube, find the max z value of another cube which shares an X or Y coordinate
            // TODO: Does it need to share x or y OR x and y?
            let cubeToCheck = cubeArray[i]
            let cubeIsAbove = cubeToCompare.firstPoint.z > cubeToCheck.secondPoint.z
            let cubeSharesXCoordinates = true
            let cubeSharesYCoordinates = true
        }
    }
    
    
    let maxZValue = cubeArray[cubeArray.length-1].secondPoint.z

    for (let i = 0; i < cubeArray.length - 1; i++) {
        let cubeToCheck = cubeArray[i]
        for (let j = i+1; j < cubeArray.length; j++) {
            let cubeToCompare = cubeArray[j]
            let cubeIsAbove = cubeToCompare.firstPoint.z > cubeToCheck.secondPoint.z
            let cubeSharesXCoordinates = true // TODO
            let cubeSharesYCoordinates = true // TODO
            if (cubeIsAbove && (cubeSharesXCoordinates || cubeSharesYCoordinates)) {
                // cubeToCompare would rest on cubeToCheck
                cubeToCompare.cubesBelow.push(i)
                cubeToCheck.cubesAbove.push(j)
            }
        }
    }

    for (let i = 0; i < cubeArray.length - 1; i++) {
        let cubeToCheck = cubeArray[i]
        // If there are no cubes above, this is safe to disintegrate
        if (cubeToCheck.cubesAbove.length === 0) {
            safeToDisintegrateCount++
        } else {
            for(let indexOfCubeAbove in cubeToCheck.cubesAbove) {
                if (cubeArray[indexOfCubeAbove].cubesBelow.length > 1) safeToDisintegrateCount++
            }
        }

    }

    console.log(cubeArray)
    // For each brick, check which bricks are above and which are below
    // Check which can be disintegrated
    
    // Brick has x, y, z values

    // Brick is below if z is less and 

    
    
    
    return safeToDisintegrateCount

}


export async function solvePartTwo ( filename : string, numberOfSteps: number) {
   
    return 0

}

solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day22/tests/data/input.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day22/input.txt')
//     .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day22/tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day22/input.txt')
    .then(answer => console.log('answer:', answer))
