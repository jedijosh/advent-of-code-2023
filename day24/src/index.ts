import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = false

class Hailstone {
    startingPosition: {
        x: number
        y: number
        z: number
    } = {x: 0, y: 0, z: 0}

    endingPosition: {
        x: number
        y: number
        z: number
    } = {x: 0, y: 0, z: 0}
    
    velocity: {
        x: number
        y: number
        z: number
    } = {x: 0, y: 0, z: 0}

    constructor (position: {x: number, y: number, z: number}, velocity: {x: number, y: number, z: number}) {
        this.startingPosition.x = position.x
        this.startingPosition.y = position.y
        this.startingPosition.z = position.z

        this.velocity.x = velocity.x
        this.velocity.y = velocity.y
        this.velocity.z = velocity.z
    }

    findLastPointInBoundary (boundaryStart: number, boundaryEnd: number) {
        // Need to figure out if the point is in the boundary.
        // If the point is not in the boundary, calculate where it enters the boundary.
        // If the point is not in the boundary and moving away from it, ignore it.
        
        // boundaryStart 
        // 19, 13, 30 @ -2, 1, -2
        // 27 = 19 + (-2 * x)
        // seconds until leaves on x axis
        let nanosecondsUntilLeavesXBoundary: number
        let nanosecondsUntilLeavesYBoundary: number
        if (this.velocity.x < 0) {
            nanosecondsUntilLeavesXBoundary = (boundaryStart - this.startingPosition.x) / this.velocity.x
        } else {
            nanosecondsUntilLeavesXBoundary = (boundaryEnd - this.startingPosition.x) / this.velocity.x
        }

        if (this.velocity.y < 0) {
            nanosecondsUntilLeavesYBoundary = (boundaryStart - this.startingPosition.y) / this.velocity.y
        } else {
            nanosecondsUntilLeavesYBoundary = (boundaryEnd - this.startingPosition.y) / this.velocity.y
        }

        let secondsUntilLeavesBoundary: number = Math.min(nanosecondsUntilLeavesXBoundary, nanosecondsUntilLeavesYBoundary)
        console.log(`Point with starting values ${this.startingPosition.x}, ${this.startingPosition.y}, ${this.startingPosition.z} will leave the boundary after ${secondsUntilLeavesBoundary} nanoseconds.`)
        // Calculate ending position
        this.endingPosition.x = this.startingPosition.x + (secondsUntilLeavesBoundary * this.velocity.x)
        this.endingPosition.y = this.startingPosition.y + (secondsUntilLeavesBoundary * this.velocity.y)
        this.endingPosition.z = this.startingPosition.z + (secondsUntilLeavesBoundary * this.velocity.z)
        console.log(`Point will leave at ${this.endingPosition.x}, ${this.endingPosition.y}, ${this.endingPosition.z}.`)

        
    }

    // isInBoundary (boundaryStart: number, boundaryEnd: number) {
    //     if (this.startingPosition.x >= boundaryStart && this.startingPosition.x <= boundaryEnd &&
    // }
}

export async function solvePartOne ( filename : string, boundaryStart: number, boundaryEnd: number) {
    // For test, look for intersections that happen with an X and Y position each at least 7 and at most 27
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let hailstones: Array<Hailstone> = []
    for (let line of fileLines) {
        let positionString: Array<string> = line.split('@')[0].split(',')
        let velocityString: Array<string> = line.split('@')[1].split(',')
        console.log('positionString', positionString)
        console.log('velocityString', velocityString)
        let newHailstone = new Hailstone({x: Number(positionString[0]), y: Number(positionString[1]), z: Number(positionString[2])},
        {x: Number(velocityString[0]), y: Number(velocityString[1]), z: Number(velocityString[2])})
        newHailstone.findLastPointInBoundary(boundaryStart, boundaryEnd)
        hailstones.push(newHailstone)
            
    }

    // How do I know if the stones crossed?

    

    console.log(hailstones)
    let longestPathLength = -1

    return longestPathLength
}

export async function solution ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    
    return 0
}




solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt', 7, 27)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt', 200000000000000, 400000000000000)
    .then(answer => console.log('answer:', answer))

// solution('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt')
// solution('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt')
// .then(answer => console.log('answer:', answer))