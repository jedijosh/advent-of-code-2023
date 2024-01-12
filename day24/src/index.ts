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

    slope: number
    yIntercept: number

    constructor (position: {x: number, y: number, z: number}, velocity: {x: number, y: number, z: number}) {
        this.startingPosition.x = position.x
        this.startingPosition.y = position.y
        this.startingPosition.z = position.z

        this.velocity.x = velocity.x
        this.velocity.y = velocity.y
        this.velocity.z = velocity.z
        this.slope = velocity.y / velocity.x
        // y = (m * x) + b      Need to solve for b
        // y / (m * x) = b
        this.yIntercept = position.y - (this.slope * position.x)
    }

    adjustStartingPositionForBoundary (boundaryStart: number, boundaryEnd: number) {
        if (this.startingPosition.x >= boundaryStart && this.startingPosition.y >= boundaryStart 
            && this.startingPosition.x <= boundaryEnd && this.startingPosition.y <= boundaryEnd ) {
            return
        } else {
            if (LOGGING) console.log('Stone is starting outside the boundary', this)
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
        // nanoseconds until leaves on x axis
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
        if (LOGGING) console.log(`slope is ${newHailstone.slope}, y intercept is ${newHailstone.yIntercept}`)
        hailstones.push(newHailstone)
            
    }
    
    for (let i = 0; i < hailstones.length - 1; i++) {
        for (let j = i+1; j < hailstones.length; j++) {
            if (LOGGING) console.log(`------------------------------`)
            if (LOGGING) console.log(`Comparing stones ${i} and ${j}`)

            let hailstone1: Hailstone = hailstones[i]
            let hailstone2: Hailstone = hailstones[j]
            // If the lines have the same slope, they are parallel and will never intersect
            if (hailstone1.slope === hailstone2.slope) {
                if (LOGGING) console.log(`Stones ${i} and ${j} are parallel and will never intersect`)
                continue
            }
            // y = mx * b
            // (hailstone1.slope * x) + hailstone1.yIntercept = (hailstone2.slope * x) + hailstone2.yIntercept      
            // (hailstone1.slope * x) = (hailstone2.slope * x) + hailstone2.yIntercept - hailstone1.yIntercept          // subtract hailstone1.yIntercept from both sides
            // (hailstone1.slope - hailstone2.slope) * x = hailstone2.yIntercept - hailstone1.yIntercept                // subtract hailstone2.slope * x from both sides
            // x = (hailstone2.yIntercept - hailstone1.yIntercept) / (hailstone1.slope - hailstone2.slope)              // Divide both sides by (slope1 - slope2)
            // -0.5x + 1 = 1x + 22.5
            // -0.5x = 1x + 21.5        // subtract hailstone1.yIntercept from both sides
            // (-0.5 - 1)x = 21.5       // subtract hailstone2.slope * x from both sides
            // x = 21.5 / (-0.5 - 1)    // Divide both sides by (slope1 - slope2)
            let xValueAtIntersection: number = (hailstone2.yIntercept - hailstone1.yIntercept) / (hailstone1.slope - hailstone2.slope)
            let yValueAtIntersection: number = (hailstone1.slope * xValueAtIntersection) + hailstone1.yIntercept

            if (LOGGING) console.log(`Stones ${i} and ${j} will intersect at ${xValueAtIntersection}, ${yValueAtIntersection}`)

            if (xValueAtIntersection > boundaryStart && yValueAtIntersection > boundaryStart && xValueAtIntersection < boundaryEnd && yValueAtIntersection < boundaryEnd) {
                // Stones will intersect within the boundary.  Now need to figure out if this happened in the past
                // If the velocity is negative, the intersection x needs to be less than the starting position
                let intersectionOccursInFuture = true
                if ((xValueAtIntersection - hailstone1.startingPosition.x) > 0 && hailstone1.velocity.x < 0) {
                    if (LOGGING) console.log('(1) collision happens in the past for hailstone1')
                    intersectionOccursInFuture = false
                }
                if ((xValueAtIntersection - hailstone1.startingPosition.x) < 0 && hailstone1.velocity.x > 0) {
                    if (LOGGING) console.log('(2) collision happens in the past for hailstone1')
                    intersectionOccursInFuture = false
                }
                if ((xValueAtIntersection - hailstone2.startingPosition.x) > 0 && hailstone2.velocity.x < 0) {
                    if (LOGGING) console.log('(3) collision happens in the past for hailstone2')
                    intersectionOccursInFuture = false
                }
                if ((xValueAtIntersection - hailstone2.startingPosition.x) < 0 && hailstone2.velocity.x > 0) {
                    if (LOGGING) console.log('(4) collision happens in the past for hailstone2')
                    intersectionOccursInFuture = false
                }

                if (intersectionOccursInFuture) {
                    if (LOGGING) console.log('-----------------------------------')
                    if (LOGGING) console.log(`Stones ${i} & ${j} had intersecting paths`)
                    if (LOGGING) console.log(`Stone i started at ${hailstones[i].startingPosition.x}, ${hailstones[i].startingPosition.y}, ${hailstones[i].startingPosition.z}`)
                    if (LOGGING) console.log(`Stone i ended at   ${hailstones[i].endingPosition.x}, ${hailstones[i].endingPosition.y}, ${hailstones[i].endingPosition.z}`)
                    if (LOGGING) console.log(`Stone j started at ${hailstones[j].startingPosition.x}, ${hailstones[j].startingPosition.y}, ${hailstones[j].startingPosition.z}`)
                    if (LOGGING) console.log(`Stone j ended at   ${hailstones[j].endingPosition.x}, ${hailstones[j].endingPosition.y}, ${hailstones[j].endingPosition.z}`)
                    numberOfIntersections++
                }
            } else {
                if (LOGGING) console.log(`Stones ${i} and ${j} intersect outside the boundary`)
            }
        }
    }
    
    // console.log(hailstones)

    return numberOfIntersections
}

function greatestCommonDivisor(a: number, b: number) {
    if (b) {
        return greatestCommonDivisor(b, a % b);
    } else {
        return Math.abs(a);
    }
}

export async function solvePartTwo ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    // let hailstoneFullList: Array<Hailstone> = []
    // let yVelocityList = new Map()
    // let zVelocityList = new Map()
    // for (let line of fileLines) {
    //     let positionString: Array<string> = line.split('@')[0].split(',')
    //     let velocityString: Array<string> = line.split('@')[1].split(',')
    //     let newHailstone = new Hailstone({x: Number(positionString[0]), y: Number(positionString[1]), z: Number(positionString[2])},
    //     {x: Number(velocityString[0]), y: Number(velocityString[1]), z: Number(velocityString[2])})
    //     if (LOGGING) console.log(`slope is ${newHailstone.slope}, y intercept is ${newHailstone.yIntercept}`)
    //     hailstoneFullList.push(newHailstone)
        
            
    // }
    // hailstoneFullList.sort((a,b) => a.velocity.y - b.velocity.y )
    // console.log(hailstoneFullList)

    // (thrownXSpeed - hailstoneA.velocity.x) * (t1 - t2) = hailstoneA.
    // for (let nanoseconds = 0; nanoseconds < 10; nanoseconds++) {
    //     // (thrownXSpeed + 2)(t1 - t2) = (19 - 20)
    //     // -3 
    // }

    // 18, 19, 22 @ -1, -1, -2
    // 12, 31, 28 @ -1, -2, -1
    // 20, 19, 15 @  1, -5, -3

    // 196585676695373, 377190465592782, 476692653244482 @ 9, -111, -205
    // 259137820407881, 377947255148589, 331579905063874 @ 9, -168, -49
    // 253626200182004, 247728843793474, 137686136674585 @ 9, 58, 282
    let hailstones: Array<Hailstone> = []
    hailstones.push(new Hailstone({x: 196585676695373, y: 377190465592782, z: 476692653244482},
        {x: 9, y: -111, z: -205})) 
    hailstones.push(new Hailstone({x: 253626200182004, y: 247728843793474, z: 137686136674585},
        {x: 9, y: 58, z: 282})) 
    hailstones.push(new Hailstone({x: 259137820407881, y: 377947255148589, z: 331579905063874},
        {x: 9, y: -168, z: -49})) 
    

    let hailstoneA = hailstones[0]
    let hailstoneB = hailstones[1]
    let hailstoneC = hailstones[2]

    

    let relativeXSpeed = greatestCommonDivisor(hailstoneB.startingPosition.x - hailstoneA.startingPosition.x, 
            hailstoneC.startingPosition.x - hailstoneA.startingPosition.x)
    console.log('relative x speed', relativeXSpeed)
    
    // Given dxr we can calculate dt12 = t2 - t1 and dt13 = t3 - t1 by taking (x20 - x10) / dxr and (x30 - x10) / dxr.

    // dt12 is timeBetweenHittingAandB
    // dt13 is timeBetweenHittingAandC
    // dt21 is timeBetweenHittingAandC - timeBetweenHittingAandB
    
    // dyr = ((y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)) / dt21
    let timeBetweenHittingAandB = (hailstoneB.startingPosition.x - hailstoneA.startingPosition.x) / relativeXSpeed
    // (259137820407881 - 196585676695373) / 339
    // 184519597972 nanoseconds
    // In this time, the rock needs to travel y22 - y11 meters
    console.log('timeBetweenHittingAandB', timeBetweenHittingAandB) // t2 - t1


    let timeBetweenHittingAandC = (hailstoneC.startingPosition.x - hailstoneA.startingPosition.x) / relativeXSpeed
    // (253626200182004 - 196585676695373) / 339
    // 168261131229 nanoseconds
    console.log('timeBetweenHittingAandC', timeBetweenHittingAandC) // t3 - t1
    
    // let dt21 = timeBetweenHittingAandC - timeBetweenHittingAandB
    // let dt31 = timeBetweenHittingAandC - timeBetweenHittingAandB

    let dt21 = (hailstoneA.startingPosition.x - hailstoneB.startingPosition.x) / relativeXSpeed
    let dt31 = (hailstoneA.startingPosition.x - hailstoneC.startingPosition.x) / relativeXSpeed
    console.log('dt21', dt21)
    console.log('dt31', dt31)
    
    //t1 = (dt12 / dt13 * (y30 + dy3 * dt31 - y10) -                                                                                                                            y20 - dy2 * dt21 + y10) / (dt21 / dt31 * (dy1 - dy3) + dy2 - dy1)
    
    let t1Y = (timeBetweenHittingAandB / timeBetweenHittingAandC * (hailstoneC.startingPosition.y + hailstoneC.velocity.y * dt31 - hailstoneA.startingPosition.y) - hailstoneB.startingPosition.y - hailstoneB.velocity.y * dt21 + hailstoneA.startingPosition.y) / (dt21 / dt31 * (hailstoneA.velocity.y - hailstoneC.velocity.y) + hailstoneB.velocity.y - hailstoneA.velocity.y)
    // console.log('exp', (hailstoneB.startingPosition.y + hailstoneB.velocity.y * (t1Y + timeBetweenHittingAandB)) - (hailstoneA.startingPosition.y + hailstoneA.velocity.y * t1Y))

    let t1Z = (timeBetweenHittingAandB / timeBetweenHittingAandC * (hailstoneC.startingPosition.z + hailstoneC.velocity.z * dt31 - hailstoneA.startingPosition.z) - hailstoneB.startingPosition.z - hailstoneB.velocity.z * dt21 + hailstoneA.startingPosition.z) / (dt21 / dt31 * (hailstoneA.velocity.z - hailstoneC.velocity.z) + hailstoneB.velocity.z - hailstoneA.velocity.z)

    //dyr = ((y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)) / dt21
    // let relativeYSpeed = ((hailstoneC.startingPosition.y + hailstoneC.velocity.y * (t1Y + timeBetweenHittingAandC)) - (hailstoneA.startingPosition.y + hailstoneA.velocity.y * t1Y)) / dt31
    
    // dyr = ((y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)) / dt21
    let relativeYSpeed = ((hailstoneB.startingPosition.y + hailstoneB.velocity.y * (t1Y + timeBetweenHittingAandB)) - (hailstoneA.startingPosition.y + hailstoneA.velocity.y * t1Y)) / timeBetweenHittingAandB
    let relativeZSpeed = ((hailstoneC.startingPosition.z + hailstoneC.velocity.z * (t1Z + timeBetweenHittingAandC)) - (hailstoneA.startingPosition.z + hailstoneA.velocity.z * t1Z)) / dt31

    // let t1 = (timeBetweenHittingAandB / timeBetweenHittingAandC * (hailstoneC.startingPosition.y + hailstoneC.velocity.y * timeBetweenHittingAandC - hailstoneA.startingPosition.y) - hailstoneB.startingPosition.y - hailstoneB.velocity.y * dt21 + hailstoneA.startingPosition.y) / (dt21 / dt31 * (hailstoneA.velocity.y - hailstoneC.velocity.y) + hailstoneB.velocity.y - hailstoneA.velocity.y)
    // t1 is the time of intersection with rock 1
    console.log('t1Y', t1Y)
    console.log('t1Z', t1Z)
    console.log('relative y speed', relativeYSpeed)
    console.log('relative z speed', relativeZSpeed)

    let actualXSpeed = relativeXSpeed - hailstoneA.velocity.x
    // let actualXSpeed = relativeXSpeed
    let actualYSpeed = hailstoneA.velocity.y - relativeYSpeed
    let actualZSpeed = hailstoneA.velocity.z - relativeZSpeed
    // let actualYSpeed = relativeYSpeed
    // let actualZSpeed = relativeZSpeed
    console.log('actual x speed:', actualXSpeed)
    console.log('actual y speed:', actualYSpeed)
    console.log('actual z speed:', actualZSpeed)

    let startingXPosition = hailstoneA.startingPosition.x - (actualXSpeed * t1Y)
    let startingYPosition = hailstoneA.startingPosition.y - (actualYSpeed * t1Y)
    let startingZPosition = hailstoneA.startingPosition.z - (actualZSpeed * t1Y)

    console.log(`starting rock position: ${startingXPosition}, ${startingYPosition}, ${startingZPosition}`)

    let thrownRock = new Hailstone({x: startingXPosition, y: startingYPosition, z: startingZPosition}, {x: actualXSpeed, y: actualYSpeed, z: actualZSpeed})
    console.log(thrownRock)
    let position = thrownRock.findPositionAtTime(0)
    console.log(`position: ${position.x}, ${position.y}, ${position.z} at time 0`)   
    console.log()

    console.log(thrownRock.findPositionAtTime(1))

    position = thrownRock.findPositionAtTime(t1Y)
    console.log(`thrown rock position: ${position.x}, ${position.y}, ${position.z} at time t1Y`)
    position = hailstoneA.findPositionAtTime(t1Y)
    console.log(`rock A position: ${position.x}, ${position.y}, ${position.z} at time ${t1Y}`)
    console.log()

    position = thrownRock.findPositionAtTime(t1Y + timeBetweenHittingAandB)
    console.log(`thrown rock position: ${position.x}, ${position.y}, ${position.z} at time ${t1Y + timeBetweenHittingAandB}`)
    position = hailstoneB.findPositionAtTime(t1Y + timeBetweenHittingAandB)
    console.log(`rock B position: ${position.x}, ${position.y}, ${position.z} at time ${t1Y + timeBetweenHittingAandB}`)
    console.log()

    position = thrownRock.findPositionAtTime(t1Y + timeBetweenHittingAandC)
    console.log(`thrown rock position: ${position.x}, ${position.y}, ${position.z} at time ${t1Y + timeBetweenHittingAandC}`)
    position = hailstoneC.findPositionAtTime(t1Y + timeBetweenHittingAandC)
    console.log(`rock C position: ${position.x}, ${position.y}, ${position.z} at time ${t1Y + timeBetweenHittingAandC}`)
    console.log()
    
    console.log(thrownRock)
    

    // position 447737773306283, 421332349239548, 275009908996327
    // velocities  -330, -58, 265
    
    return startingXPosition + startingYPosition + startingZPosition
}




// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt', 7, 27)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input2.txt', 7, 27)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt', 200000000000000, 400000000000000)
    // .then(answer => console.log('answer:', answer))
    // 12077 is too low
    // 12452 is not right
    // 14071 is too high
    // 19135 is too high

    // solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt')
solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt')
.then(answer => console.log('answer:', answer))

// 1461444953623217 is too high
// 1144080031542158 is too high