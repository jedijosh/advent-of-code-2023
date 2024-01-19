import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

const LOGGING = false

export async function solvePartOne ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    
    // Find where the loop starts
    let startingPoint: Point = new Point(0, 0, 'S')
    for (let row = 0; row < grid.numberOfRows; row++) {
        for (let column = 0; column < grid.numberOfColumns; column++) {
            if (grid.gridPoints[row][column].value === 'S') {
                startingPoint = grid.gridPoints[row][column]
                break
            }
        }
    }

    let pathsThroughPipe: Array<Point> = []
    pathsThroughPipe.push(new Point(startingPoint.row, startingPoint.column, startingPoint.value))
    pathsThroughPipe.push(new Point(startingPoint.row, startingPoint.column, startingPoint.value))

    // TODO: Find the actual starting vectors instead of hard-coding
        // Start from S and find the 2 adjacent points which are connected
    // let directions: Array<String> = ['U', 'D', 'L', 'R']
    // for (let directionNumber = 0; directionNumber < directions.length; directionNumber++) {
    //     let firstConnectedPoint = await findNextLocation(startingPoint, directions[directionNumber], grid)    
    // }

    // pathsThroughPipe[0].incomingVectors = [{vector: new Vector(1, 'R'), lowestCost: 0}]
    // pathsThroughPipe[1].incomingVectors = [{vector: new Vector(1, 'D'), lowestCost: 0}]

    pathsThroughPipe[0].incomingVectors = [{vector: new Vector(1, 'U'), lowestCost: 0}]
    pathsThroughPipe[1].incomingVectors = [{vector: new Vector(1, 'L'), lowestCost: 0}]
    if (LOGGING) console.log('Paths are:', pathsThroughPipe)
    // Travel the pipe until the 2 points meet
    let pathsMet: boolean = false
    while (!pathsMet) {
        if (LOGGING) console.log(`Current path length is ${pathLength}`)
        for(let pathNumber = 0; pathNumber < pathsThroughPipe.length; pathNumber++) {
            if (LOGGING) console.log(`At ${pathsThroughPipe[pathNumber].row}, ${pathsThroughPipe[pathNumber].column} going direction ${pathsThroughPipe[pathNumber].incomingVectors[0].vector.direction.toString()}`)
            let nextDirection = await findNextDirection(pathsThroughPipe[pathNumber].value, pathsThroughPipe[pathNumber].incomingVectors[0].vector.direction.toString())
            if (LOGGING) console.log(`Next direction is ${nextDirection}`)
            pathsThroughPipe[pathNumber] = await grid.getNextLocation(pathsThroughPipe[pathNumber].row, pathsThroughPipe[pathNumber].column, new Vector(1, nextDirection))
            if (LOGGING) console.log(`Next location is ${JSON.stringify(pathsThroughPipe[pathNumber])}`)
            await pathsThroughPipe[pathNumber].addNewIncomingVector({vector: new Vector(1, nextDirection), lowestCost: pathLength}) 
        }
        // figure out the next direction to travel
        pathLength++
        if (LOGGING) console.log('Paths are:', pathsThroughPipe)
        if (pathsThroughPipe[0].row === pathsThroughPipe[1].row && pathsThroughPipe[0].column === pathsThroughPipe[1].column) pathsMet = true
    }
    return pathLength
}

export async function solvePartTwo ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    
    // Find where the loop starts
    let startingPoint: Point = new Point(0, 0, 'S')
    for (let row = 0; row < grid.numberOfRows; row++) {
        for (let column = 0; column < grid.numberOfColumns; column++) {
            if (grid.gridPoints[row][column].value === 'S') {
                startingPoint = grid.gridPoints[row][column]
                break
            }
        }
    }

    let pathsThroughPipe: Array<Point> = []
    pathsThroughPipe.push(new Point(startingPoint.row, startingPoint.column, startingPoint.value))
    // pathsThroughPipe.push(new Point(startingPoint.row, startingPoint.column, startingPoint.value))

    // TODO: Find the actual starting vectors instead of hard-coding
        // Start from S and find the 2 adjacent points which are connected
    // let directions: Array<String> = ['U', 'D', 'L', 'R']
    // for (let directionNumber = 0; directionNumber < directions.length; directionNumber++) {
    //     let firstConnectedPoint = await findNextLocation(startingPoint, directions[directionNumber], grid)    
    // }

    // For tests, starting right is correct
    // For input, start up?
    pathsThroughPipe[0].incomingVectors = [{vector: new Vector(1, 'U'), lowestCost: 0}]
    let verticies: Array<{x: number, y: number}> = []
    if (LOGGING) console.log('Paths are:', pathsThroughPipe)
    // Travel the pipe until the 2 points meet
    let returnedToStart: boolean = false
    while (!returnedToStart) {
        if (LOGGING) console.log(`Current path length is ${pathLength}`)
        for(let pathNumber = 0; pathNumber < pathsThroughPipe.length; pathNumber++) {
            if (LOGGING) console.log(`At ${pathsThroughPipe[pathNumber].row}, ${pathsThroughPipe[pathNumber].column} going direction ${pathsThroughPipe[pathNumber].incomingVectors[0].vector.direction.toString()}`)
            let priorDirection = pathsThroughPipe[pathNumber].incomingVectors[0].vector.direction.toString()
            let nextDirection = await findNextDirection(pathsThroughPipe[pathNumber].value, priorDirection)
            if (LOGGING) console.log(`Next direction is ${nextDirection}`)
            if (priorDirection!== nextDirection) {
                // Translate rows and columns into an x, y graph
                verticies.push({ x: pathsThroughPipe[pathNumber].column + 1,
                    y: -1 * pathsThroughPipe[pathNumber].row + 1}
                )
            }
            pathsThroughPipe[pathNumber] = await grid.getNextLocation(pathsThroughPipe[pathNumber].row, pathsThroughPipe[pathNumber].column, new Vector(1, nextDirection))
            if (LOGGING) console.log(`Next location is ${JSON.stringify(pathsThroughPipe[pathNumber])}`)
            await pathsThroughPipe[pathNumber].addNewIncomingVector({vector: new Vector(1, nextDirection), lowestCost: pathLength}) 
        }
        // figure out the next direction to travel
        
        // Use Shoelace formula to calculate the area
        pathLength++
        if (LOGGING) console.log('Paths are:', pathsThroughPipe)
        if (pathsThroughPipe[0].value === 'S') {
            // Translate rows and columns into an x, y graph
            verticies.push({ x: pathsThroughPipe[0].column + 1, 
                y: -1 * pathsThroughPipe[0].row + 1 }
            )
            returnedToStart = true
        }
    }
    if (LOGGING) console.log('Verticies are:', verticies)
    let area: number = await findAreaUsingVerticies(verticies)
    if (LOGGING) console.log(`Area is ${area}`)
    // Once you have the area, use Pick's theorum to find how many interior points exist
    let numberOfInteriorPoints: number = area + 1 - ( (pathLength) / 2) 
    return numberOfInteriorPoints
}

export async function findAreaUsingVerticies (verticies: Array<{x: number, y: number}>) {
    // Implements the Shoelace formula
    // Verticies need to be counter-clockwise on x, y chart
    let area: number = 0
    let j = verticies.length - 1
    for (let i = 0; i < verticies.length; i++) {
        area += (verticies[j].x + verticies[i].x) * (verticies[j].y - verticies[i].y)
        j = i
    }
    return Math.abs(area / 2.0);
}


export async function findNextDirection (currentPointValue: String, lastDirectionTraveled: string) {
    // Given current space and last direction traveled, figure out the next direction to travel
    let nextDirectionToTravel: String = lastDirectionTraveled
    switch (currentPointValue) {
        // | is a vertical pipe connecting north and south.
        case '|':
            if (['U', 'D'].includes(lastDirectionTraveled)) nextDirectionToTravel = lastDirectionTraveled
            break
        // - is a horizontal pipe connecting east and west.
        case '-':
            if (['L', 'R'].includes(lastDirectionTraveled)) nextDirectionToTravel = lastDirectionTraveled
            break
        // L is a 90-degree bend connecting north and east.
        case 'L':
            if (['L', 'D'].includes(lastDirectionTraveled)) lastDirectionTraveled === 'L' ? nextDirectionToTravel = 'U' : nextDirectionToTravel = 'R'
            break
        // J is a 90-degree bend connecting north and west.
        case 'J':
            if (['R', 'D'].includes(lastDirectionTraveled)) lastDirectionTraveled === 'R' ? nextDirectionToTravel = 'U' : nextDirectionToTravel = 'L'
            break
        // 7 is a 90-degree bend connecting south and west.
        case '7':
            if (['R', 'U'].includes(lastDirectionTraveled)) lastDirectionTraveled === 'R' ? nextDirectionToTravel = 'D' : nextDirectionToTravel = 'L'
            break
        // F is a 90-degree bend connecting south and east.
        case 'F':
            if (['L', 'U'].includes(lastDirectionTraveled)) lastDirectionTraveled === 'U' ? nextDirectionToTravel = 'R' : nextDirectionToTravel = 'D'
            break
        default:
            break
        // . is ground; there is no pipe in this tile.
        // S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
    }
    return nextDirectionToTravel
}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day10'
// solvePartOne(dataFolder + 'data/tests/input.txt')
// // solvePartOne(dataFolder + '/data/input.txt')

// solvePartTwo(dataFolder + '/data/tests/input-part2.txt')
// solvePartTwo(dataFolder + '/data/tests/input2.txt')
solvePartTwo(dataFolder + '/data/input.txt')
        .then(answer => console.log('answer:', answer))

// solvePartOne(dataFolder + '/data/tests/input.txt')
// solvePartOne(dataFolder + '/data/input.txt')
// .then(answer => console.log('answer:', answer))