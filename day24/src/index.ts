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


function prime(n: number) { 
    let result = [1,n]; 
    for (let i = 2; i < Math.pow(n, 0.5); i++) { 
        if (n % i == 0) { 
            result.push(i); 
            result.push(n / i); 
        } 
    } 
    return result.sort((a, b) => a - b); 
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
        
    // 196585676695373, 377190465592782, 476692653244482 @ 9, -111, -205
    // 259137820407881, 377947255148589, 331579905063874 @ 9, -168, -49
    // 253626200182004, 247728843793474, 137686136674585 @ 9, 58, 282
    let startingXPosition: number = 0
    let startingYPosition: number = 0
    let startingZPosition: number = 0
    
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

    
    let divisorsAB = prime(hailstoneB.startingPosition.x - hailstoneA.startingPosition.x) 
    let divisorsAC = prime(hailstoneC.startingPosition.x - hailstoneA.startingPosition.x) 
    let divisorsToConsider: Array<number> = []

    for (let divisor of divisorsAB) {
        if(divisorsAC.includes(divisor)) {
            divisorsToConsider.push(divisor)
            divisorsToConsider.push(divisor * -1)
        }
    }
    console.log('divisors to consider', divisorsToConsider)

    for (let relativeXSpeed of divisorsToConsider) {
        console.log('-----------------------------')
        console.log('relative x speed', relativeXSpeed)
        // Given dxr we can calculate dt12 = t2 - t1 and dt13 = t3 - t1 by taking (x20 - x10) / dxr and (x30 - x10) / dxr.

        // dt12 is timeBetweenHittingAandB
        // dt13 is timeBetweenHittingAandC
        // dt21 is timeBetweenHittingAandC - timeBetweenHittingAandB
        
        // dyr = ((y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)) / dt21
        
        // The x velocities are the same so the x distance is constant
        let timeBetweenHittingAandB = (hailstoneB.startingPosition.x - hailstoneA.startingPosition.x) / relativeXSpeed
        // (253626200182004 - 196585676695373) / 339
        // 168261131229 nanoseconds
        // In this time, the rock needs to travel y22 - y11 meters
        console.log('timeBetweenHittingAandB', timeBetweenHittingAandB) // t2 - t1
        console.log('x distance between A and B', hailstoneB.startingPosition.x - hailstoneA.startingPosition.x)
        // (y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)
        // let temp = (hailstoneB.startingPosition.y + hailstoneB.velocity.y * (t1 + dt12)) - (y10 + dy1 * t1)
        // console.log('y distance which needs to be traveled', temp)


        let timeBetweenHittingAandC = (hailstoneC.startingPosition.x - hailstoneA.startingPosition.x) / relativeXSpeed
        // (259137820407881 - 196585676695373) / 339
        // 184519597972 nanoseconds
        console.log('timeBetweenHittingAandC', timeBetweenHittingAandC) // t3 - t1
        console.log('x distance between A and C', hailstoneC.startingPosition.x - hailstoneA.startingPosition.x)
        
        // let dt21 = timeBetweenHittingAandC - timeBetweenHittingAandB
        // let dt31 = timeBetweenHittingAandC - timeBetweenHittingAandB


        // Given dxr we can calculate dt12 = t2 - t1 and dt13 = t3 - t1 by taking (x20 - x10) / dxr and (x30 - x10) / dxr. 
        // In the dt21 nanoseconds between t1 and t2, the thrown rock would need to travel yr2 - yr1 meters. 
        // This is equal to y22 - y11, since we're intersecting with rock 1 at t1 and with rock 2 at t2. 
        // Written out, this is (y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1). Dividing this distance by dt21 and we have an equation for dyr: 
        
        let dt21 = (hailstoneA.startingPosition.x - hailstoneB.startingPosition.x) / relativeXSpeed
        let dt31 = (hailstoneA.startingPosition.x - hailstoneC.startingPosition.x) / relativeXSpeed
        // let dt21 = timeBetweenHittingAandB
        // let dt31 = timeBetweenHittingAandC
        console.log('dt21', dt21)
        console.log('dt31', dt31)
        
        //t1 = (dt12 / dt13 * (y30 + dy3 * dt31 - y10) -                                                                                                                            y20 - dy2 * dt21 + y10) / (dt21 / dt31 * (dy1 - dy3) + dy2 - dy1)
        
        let dt12 = timeBetweenHittingAandB
        let dt13 = timeBetweenHittingAandC
        let y30 = hailstoneC.startingPosition.y
        let dy3 = hailstoneC.velocity.y
        let y10 = hailstoneA.startingPosition.y
        let y20 = hailstoneB.startingPosition.y
        let dy2 = hailstoneB.velocity.y
        let dy1 = hailstoneA.velocity.y
        // t1 = (dt12 / dt13 * (y30 + dy3 * dt31 - y10) - y20 - dy2 * dt21 + y10) / (dt21 / dt31 * (dy1 - dy3) + dy2 - dy1)
        let t1 = (dt12 / dt13 * (y30 + dy3 * dt31 - y10) - y20 - dy2 * dt21 + y10) / (dt21 / dt31 * (dy1 - dy3) + dy2 - dy1)
        console.log('t1', t1)
        let t1Y = (timeBetweenHittingAandB / timeBetweenHittingAandC * (hailstoneC.startingPosition.y + hailstoneC.velocity.y * dt31 - hailstoneA.startingPosition.y) - hailstoneB.startingPosition.y - hailstoneB.velocity.y * dt21 + hailstoneA.startingPosition.y) / (dt21 / dt31 * (hailstoneA.velocity.y - hailstoneC.velocity.y) + hailstoneB.velocity.y - hailstoneA.velocity.y)
        // console.log('exp', (hailstoneB.startingPosition.y + hailstoneB.velocity.y * (t1Y + timeBetweenHittingAandB)) - (hailstoneA.startingPosition.y + hailstoneA.velocity.y * t1Y))

        let t1Z = (timeBetweenHittingAandB / timeBetweenHittingAandC * (hailstoneC.startingPosition.z + hailstoneC.velocity.z * dt31 - hailstoneA.startingPosition.z) - hailstoneB.startingPosition.z - hailstoneB.velocity.z * dt21 + hailstoneA.startingPosition.z) / (dt21 / dt31 * (hailstoneA.velocity.z - hailstoneC.velocity.z) + hailstoneB.velocity.z - hailstoneA.velocity.z)

        if (t1Y !== t1Z) {
            console.log(`${t1Y} does not equal ${t1Z}`)
            continue
        }
        console.log('------------ tYs match -----------------')

        //dyr = ((y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)) / dt21
        // let relativeYSpeed = ((hailstoneC.startingPosition.y + hailstoneC.velocity.y * (t1Y + timeBetweenHittingAandC)) - (hailstoneA.startingPosition.y + hailstoneA.velocity.y * t1Y)) / dt31
        // dyr = ((y30 + dy3 * (t1 + dt13)) - (y10 + dy1 * t1)) / dt31
        let relativeYSpeed2 = ((y30 + dy3 * (t1 + dt13)) - (y10 + dy1 * t1)) / dt31
        console.log('relativeYSpeed2', relativeYSpeed2)
        
        // dyr = ((y20 + dy2 * (t1 + dt12)) - (y10 + dy1 * t1)) / dt21
        let relativeYSpeed = ((hailstoneB.startingPosition.y + hailstoneB.velocity.y * (t1Y + timeBetweenHittingAandB)) - (hailstoneA.startingPosition.y + hailstoneA.velocity.y * t1Y)) / dt21
        let relativeZSpeed = ((hailstoneC.startingPosition.z + hailstoneC.velocity.z * (t1Z + timeBetweenHittingAandC)) - (hailstoneA.startingPosition.z + hailstoneA.velocity.z * t1Z)) / dt31

        // let t1 = (timeBetweenHittingAandB / timeBetweenHittingAandC * (hailstoneC.startingPosition.y + hailstoneC.velocity.y * timeBetweenHittingAandC - hailstoneA.startingPosition.y) - hailstoneB.startingPosition.y - hailstoneB.velocity.y * dt21 + hailstoneA.startingPosition.y) / (dt21 / dt31 * (hailstoneA.velocity.y - hailstoneC.velocity.y) + hailstoneB.velocity.y - hailstoneA.velocity.y)
        // t1 is the time of intersection with rock 1
        console.log('t1Y', t1Y)
        console.log('t1Z', t1Z)
        
        let actualXSpeed = hailstoneA.velocity.x - relativeXSpeed
        // let actualYSpeed = hailstoneA.velocity.y - relativeYSpeed
        let actualYSpeed = 63
        // calculated relative -53 and actual -58
        // let actualZSpeed = hailstoneA.velocity.z - relativeZSpeed
        let actualZSpeed = 94
        // if too high, need to increase
        
        // let actualXSpeed = relativeXSpeed - hailstoneA.velocity.x
        // let actualYSpeed = relativeYSpeed - hailstoneA.velocity.y
        // let actualZSpeed = relativeZSpeed- hailstoneA.velocity.z

        // let actualXSpeed = relativeXSpeed
        // let actualYSpeed = relativeYSpeed
        // let actualZSpeed = relativeZSpeed
        console.log('relative x speed', relativeXSpeed)
        console.log('actual x speed:', actualXSpeed)
        console.log('relative y speed', relativeYSpeed)
        console.log('actual y speed:', actualYSpeed)
        console.log('relative z speed', relativeZSpeed)
        console.log('actual z speed:', actualZSpeed)

        let stoneToHitFirst = hailstoneA
        startingXPosition = (stoneToHitFirst.startingPosition.x + stoneToHitFirst.velocity.x * t1Y) - (actualXSpeed * t1Y)
        startingYPosition = (stoneToHitFirst.startingPosition.y + stoneToHitFirst.velocity.y * t1Y) - (actualYSpeed * t1Y)
        startingZPosition = (stoneToHitFirst.startingPosition.z + stoneToHitFirst.velocity.z * t1Y) - (actualZSpeed * t1Y)

        console.log(`starting rock position: ${startingXPosition}, ${startingYPosition}, ${startingZPosition}`)

        let thrownRock = new Hailstone({x: startingXPosition, y: startingYPosition, z: startingZPosition}, {x: actualXSpeed, y: actualYSpeed, z: actualZSpeed})
        console.log(thrownRock)
        console.log()

        console.log(thrownRock.findPositionAtTime(1))

        console.log('------------- timeInterceptsA ----------------------')
        let timeInterceptsA = t1Y
        let position = thrownRock.findPositionAtTime(timeInterceptsA)
        console.log(`thrown rock position: ${position.x}, ${position.y}, ${position.z} at time timeInterceptsA`)
        position = hailstoneA.findPositionAtTime(timeInterceptsA)
        console.log(`rock A position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsA}`)
        position = hailstoneB.findPositionAtTime(timeInterceptsA)
        console.log(`rock B position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsA}`)
        position = hailstoneC.findPositionAtTime(timeInterceptsA)
        console.log(`rock C position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsA}`)
        console.log()

        console.log('------------- timeInterceptsB ----------------------')
        // If the actual x speed is positive, the rock will hit A, B, C
        // If the actual x speed is negative, the rock will hit C, B, A
        let timeInterceptsB = actualXSpeed > 0 ? t1Y + timeBetweenHittingAandB : t1Y - timeBetweenHittingAandB
        position = thrownRock.findPositionAtTime(timeInterceptsB)
        console.log(`thrown rock position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsB}`)
        position = hailstoneB.findPositionAtTime(timeInterceptsB)
        console.log(`rock B position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsB}`)
        position = hailstoneA.findPositionAtTime(timeInterceptsB)
        console.log(`rock A position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsB}`)
        position = hailstoneC.findPositionAtTime(timeInterceptsB)
        console.log(`rock C position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsB}`)
        console.log()


        console.log('------------- timeInterceptsC ----------------------')
        let timeInterceptsC = actualXSpeed > 0 ? t1Y + timeBetweenHittingAandC : t1Y - timeBetweenHittingAandC
        position = thrownRock.findPositionAtTime(timeInterceptsC)
        console.log(`thrown rock position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsC}`)
        position = hailstoneC.findPositionAtTime(timeInterceptsC)
        console.log(`rock C position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsC}`)
        position = hailstoneB.findPositionAtTime(timeInterceptsC)
        console.log(`rock B position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsC}`)
        position = hailstoneA.findPositionAtTime(timeInterceptsC)
        console.log(`rock A position: ${position.x}, ${position.y}, ${position.z} at time ${timeInterceptsC}`)
        console.log()
        
        console.log(thrownRock)

    }  
    return startingXPosition + startingYPosition + startingZPosition
}




// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt', 7, 27)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input2.txt', 7, 27)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt', 200000000000000, 400000000000000)
    // .then(answer => console.log('answer:', answer))

    // solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/tests/data/input.txt')
solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day24/input.txt')
.then(answer => console.log('answer:', answer))