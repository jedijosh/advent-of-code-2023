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

    adjustStartingPositionForBoundary (boundaryStart: number, boundaryEnd: number) {
        if (this.startingPosition.x >= boundaryStart && this.startingPosition.y >= boundaryStart 
            && this.startingPosition.x <= boundaryEnd && this.startingPosition.y <= boundaryEnd ) {
            return
        } else {
            console.log('Stone is starting outside the boundary', this)
            let nanosecondsUntilEntersXBoundary: number
            let nanosecondsUntilEntersYBoundary: number
            if (this.velocity.x < 0) {
                // boundaryEnd = startingPosition.x + (velocity.x * nanoseconds)
                // boundaryEnd - startingPosition.x = velocity.x * nanoseconds
                // nanoseconds = (boundaryEnd - startingPosition.x) / velocity.x 
                nanosecondsUntilEntersXBoundary = (boundaryEnd - this.startingPosition.x) / this.velocity.x
            } else {
                nanosecondsUntilEntersXBoundary = (boundaryStart - this.startingPosition.x) / this.velocity.x
            }

            if (this.velocity.y < 0) {
                // boundaryEnd = startingPosition.y + (velocity.y * nanoseconds)
                // boundaryEnd - startingPosition.y = velocity.y * nanoseconds
                // nanoseconds = (boundaryEnd - startingPosition.y) / velocity.y 
                nanosecondsUntilEntersYBoundary = (boundaryEnd - this.startingPosition.y) / this.velocity.y
            } else {
                nanosecondsUntilEntersYBoundary = (boundaryStart - this.startingPosition.y) / this.velocity.y
            }
            let nanosecondsUntilEntersBoundary = Math.max(nanosecondsUntilEntersXBoundary, nanosecondsUntilEntersYBoundary)
            let startingPosition = this.findPositionAtTime(nanosecondsUntilEntersBoundary)
            this.startingPosition.x = startingPosition.x
            this.startingPosition.y = startingPosition.y
            this.startingPosition.z = startingPosition.z
        }
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

        let nanosecondsUntilLeavesBoundary: number = Math.min(nanosecondsUntilLeavesXBoundary, nanosecondsUntilLeavesYBoundary)
        if (LOGGING) console.log(`Stone with starting values ${this.startingPosition.x}, ${this.startingPosition.y}, ${this.startingPosition.z} will leave the boundary after ${nanosecondsUntilLeavesBoundary} nanoseconds.`)
        // Calculate ending position
        
        let endingPosition = this.findPositionAtTime(nanosecondsUntilLeavesBoundary)
        this.endingPosition.x = endingPosition.x
        this.endingPosition.y = endingPosition.y
        this.endingPosition.z = endingPosition.z
        if (LOGGING) console.log(`Point will leave at ${this.endingPosition.x}, ${this.endingPosition.y}, ${this.endingPosition.z}.`)
    }

    findPositionAtTime (nanoseconds: number) {
        return {
            x: this.startingPosition.x + (nanoseconds * this.velocity.x),
            y: this.startingPosition.y + (nanoseconds * this.velocity.y),
            z: this.startingPosition.z + (nanoseconds * this.velocity.z)
        }        
    }

    // isInBoundary (boundaryStart: number, boundaryEnd: number) {
    //     if (this.startingPosition.x >= boundaryStart && this.startingPosition.x <= boundaryEnd &&
    // }
}

export async function solvePartOne ( filename : string, boundaryStart: number, boundaryEnd: number) {
    // For test, look for intersections that happen with an X and Y position each at least 7 and at most 27
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let hailstones: Array<Hailstone> = []
    let numberOfIntersections = 0
    for (let line of fileLines) {
        let positionString: Array<string> = line.split('@')[0].split(',')
        let velocityString: Array<string> = line.split('@')[1].split(',')
        let newHailstone = new Hailstone({x: Number(positionString[0]), y: Number(positionString[1]), z: Number(positionString[2])},
        {x: Number(velocityString[0]), y: Number(velocityString[1]), z: Number(velocityString[2])})
        // Store the last point this hailstone will be within the boundary.
        newHailstone.findLastPointInBoundary(boundaryStart, boundaryEnd)
        // Store the first point this hailstone will enter the boundary.
        newHailstone.adjustStartingPositionForBoundary(boundaryStart, boundaryEnd)
        hailstones.push(newHailstone)
            
    }

    // How do I know if the stones crossed?
    
    for (let i = 0; i < hailstones.length - 1; i++) {
        for (let j = i+1; j < hailstones.length; j++) {
            if (LOGGING) console.log(`------------------------------`)
            if (LOGGING) console.log(`Comparing stones ${i} and ${j}`)
            
            // hailstone1 will have the smallest x value
            let hailstone1: Hailstone = hailstones[i]
            let hailstone2: Hailstone = hailstones[j]
            let stonesIntersected = false
            if (!hailstone1) break
            if (!hailstone2) break
            if (hailstones[i].startingPosition.x > hailstones[j].startingPosition.x) {
                hailstone1 = hailstones[j]
                hailstone2 = hailstones[i]
            }

            // Heading in the same x direction with a negative x velocity
            if (hailstone1.velocity.x < 0 && hailstone2.velocity.x < 0)  {
                if (LOGGING) console.log('both are traveling with a negative x velocity')
                // Traveling in the same x direction
                // Find the position where the second hailstone has the same x value as the first hailstone's starting position
                // hailstone1.startingPosition.x = hailstone2.startingPosition.x + (hailstone2.velocity.x * nanoseconds)
                // hailstone1.startingPosition.x - hailstone2.startingPosition.x = hailstone2.velocity.x * nanoseconds
                // nanosections = (hailstone1.startingPosition.x - hailstone2.startingPosition.x) / hailstone2.velocity.x
                let nanoseconds: number = (hailstone1.startingPosition.x - hailstone2.startingPosition.x) / hailstone2.velocity.x
                let matchingXPosition = hailstone2.findPositionAtTime(nanoseconds)
                
                // If the stones started at the same x and y, they intersected
                if (matchingXPosition.x === hailstone1.startingPosition.x && matchingXPosition.y === hailstone1.startingPosition.y) {
                    stonesIntersected = true
                }
                // If the stones ended at the same x and y, they intersected
                if (hailstone1.endingPosition.x === hailstone2.endingPosition.x && hailstone1.endingPosition.y === hailstone2.endingPosition.y) {
                    stonesIntersected = true
                }
                let hailstone1HigherAtStart = hailstone1.startingPosition.y > matchingXPosition.y
                let hailstone1HigherAtEnd = hailstone1.endingPosition.y >= hailstone2.endingPosition.y
                // Check to make sure there's an overlap in x coordinates
                if (hailstone2.endingPosition.x <= hailstone1.startingPosition.x) {
                    if ((hailstone1HigherAtStart && !hailstone1HigherAtEnd) || (!hailstone1HigherAtStart && hailstone1HigherAtEnd)) {
                        stonesIntersected = true
                    }
                }
                
            }

            // Heading in the same x direction, both with a positive velocity
            if (hailstone1.velocity.x > 0 && hailstone2.velocity.x > 0) {
                if (LOGGING) console.log('both are traveling with a positive x velocity')
                // Find the position where the first hailstone has the same x value as the second hailstone's starting position
                // hailstone2.startingPosition.x = hailstone1.startingPosition.x + (hailstone1.velocity.x * nanoseconds)
                // nanoseconds = hailstone2.startingPosition.x - hailstone1.startingPosition.x / hailstone1.velocity.x
                let nanoseconds: number = (hailstone2.startingPosition.x - hailstone1.startingPosition.x) / hailstone1.velocity.x
                let matchingXPosition = hailstone1.findPositionAtTime(nanoseconds)
                if (LOGGING) console.log(`Matching position at ${matchingXPosition.x}, ${matchingXPosition.y}, ${matchingXPosition.z}`)

                // If the stones started at the same x and y, they intersected
                if (matchingXPosition.x === hailstone2.startingPosition.x && matchingXPosition.y === hailstone2.startingPosition.y) {
                    stonesIntersected = true
                }
                // If the stones endedat the same x and y, they intersected
                if (hailstone1.endingPosition.x === hailstone2.endingPosition.x && hailstone1.endingPosition.y === hailstone2.endingPosition.y) {
                    stonesIntersected = true
                }
                let hailstone1HigherAtStart = matchingXPosition.y > hailstone2.startingPosition.y
                let hailstone1HigherAtEnd = hailstone1.endingPosition.y >= hailstone2.endingPosition.y
                // Check to make sure there's an overlap in x coordinates
                if (hailstone1.endingPosition.x >= hailstone2.startingPosition.x) {
                    if ((hailstone1HigherAtStart && !hailstone1HigherAtEnd) || (!hailstone1HigherAtStart && hailstone1HigherAtEnd)) {
                        stonesIntersected = true
                    }
                }
                
            }

            // Heading in opposite x directions
            if ((hailstone1.velocity.x > 0 && hailstone2.velocity.x < 0) || hailstone1.velocity.x < 0 && hailstone2.velocity.x > 0) {
                    
                // If the stones started at the same x and y, they intersected
                if (hailstone1.startingPosition.x === hailstone2.startingPosition.x && hailstone1.startingPosition.y === hailstone2.startingPosition.y) {
                    stonesIntersected = true
                }

                // If the stones ended at the same x and y, they intersected
                if (hailstone1.endingPosition.x === hailstone2.endingPosition.x && hailstone1.endingPosition.y === hailstone2.endingPosition.y) {
                    stonesIntersected = true
                }

                // Check to make sure there's an overlap in x coordinates    
                if (hailstone1.endingPosition.x >= hailstone2.startingPosition.x) {
                    let hailstone1HigherAtStart = hailstone1.startingPosition.y > hailstone2.startingPosition.y
                    let hailstone1HigherAtEnd = hailstone1.endingPosition.y >= hailstone2.endingPosition.y
                    if ((hailstone1HigherAtStart && !hailstone1HigherAtEnd) || (!hailstone1HigherAtStart && hailstone1HigherAtEnd)) {
                        stonesIntersected = true
                    }
                }
            }


            if (stonesIntersected) {
                if (LOGGING) console.log('-----------------------------------')
                if (LOGGING) console.log(`Stones ${i} & ${j} had intersecting paths`)
                if (LOGGING) console.log(`Stone i started at ${hailstones[i].startingPosition.x}, ${hailstones[i].startingPosition.y}, ${hailstones[i].startingPosition.z}`)
                if (LOGGING) console.log(`Stone i ended at   ${hailstones[i].endingPosition.x}, ${hailstones[i].endingPosition.y}, ${hailstones[i].endingPosition.z}`)
                if (LOGGING) console.log(`Stone j started at ${hailstones[j].startingPosition.x}, ${hailstones[j].startingPosition.y}, ${hailstones[j].startingPosition.z}`)
                if (LOGGING) console.log(`Stone j ended at   ${hailstones[j].endingPosition.x}, ${hailstones[j].endingPosition.y}, ${hailstones[j].endingPosition.z}`)
                numberOfIntersections++
            }
        }
    }
    
    // console.log(hailstones)

    return numberOfIntersections
}

export async function solution ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    
    return 0
}




// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt', 7, 27)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input2.txt', 7, 27)
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt', 200000000000000, 400000000000000)
    .then(answer => console.log('answer:', answer))
    // 12077 is too low
    // 12452 is not right
    // 14071 is too high
    // 19135 is too high

// solution('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt')
// solution('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt')
// .then(answer => console.log('answer:', answer))