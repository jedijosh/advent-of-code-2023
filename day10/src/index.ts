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

    // Start from S and find the 2 adjacent points which are connected
    // let directions: Array<String> = ['U', 'D', 'L', 'R']
    // for (let directionNumber = 0; directionNumber < directions.length; directionNumber++) {
    //     let firstConnectedPoint = await findNextLocation(startingPoint, directions[directionNumber], grid)    
    // }
    
    

    return pathLength

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

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day10/tests/data/input.txt')
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day10/input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day10/tests/data/input.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day10/input.txt')
// .then(answer => console.log('answer:', answer))