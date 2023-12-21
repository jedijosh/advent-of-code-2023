import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

const STORE_PATH = false
const LOGGING = false

export async function solvePartOne ( filename : string, part: number, numberOfSteps: number) {
    let pointsTraveledTo: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    // let leastAmountOfHeatLoss = 10000000
    // Find the starting point
    let currentPoints: Array<{point: Point, numberOfSteps: number}> = new Array()
    let finalPoints: Array<Point> = new Array()
    for (let row = 0; row < grid.numberOfRows; row++) {
        for (let column = 0; column < grid.numberOfColumns; column++) {
            let point = grid.gridPoints[row][column]
            if (point.value === 'S') {
                currentPoints.push({point: new Point(row, column, 'S'), numberOfSteps: 0})
                break
            }
        }
    }

    console.log('currentPoints:')
    currentPoints.forEach(point => {
        console.log(JSON.stringify(point))
    })
    // for (let step = 0; step < numberOfSteps; step++) {
    //     console.log('************* STEP:', step)
    //     let nextPoints: Array<Point> = new Array()
        for (let currentPoint of currentPoints) {
            // console.log(`processing ${currentPoint.point.row}, ${currentPoint.point.column}, after ${currentPoint.numberOfSteps} steps`)
            if (currentPoint.numberOfSteps === numberOfSteps) {
                if (!currentPoint.point.hasBeenVisited) {
                    finalPoints.push(currentPoint.point)
                    currentPoint.point.hasBeenVisited = true
                    pointsTraveledTo++
                }
                
            } else {
                for(let direction of ['U', 'D', 'L', 'R']) {
                    try {
                        let pointToTravelTo: Point = await grid.getNextLocation(currentPoint.point.row, currentPoint.point.column, new Vector(1, direction))
                        if (await pointToTravelTo.canBeTraveledTo() && !pointToTravelTo.hasBeenVisited) {
                            if (LOGGING) console.log(`adding ${pointToTravelTo.row}, ${pointToTravelTo.column} with cost ${currentPoint.numberOfSteps + 1} to the list of points to travel to`)
                            if (currentPoint.numberOfSteps % 2) {
                                finalPoints.push(currentPoint.point)
                                pointToTravelTo.hasBeenVisited = true
                                pointsTraveledTo++
                            } 
                            currentPoints.push({point: pointToTravelTo, numberOfSteps: currentPoint.numberOfSteps + 1})
                        }
                    } catch (error) {

                    }
                }
            }
            // console.log('currentPoints:')
            // currentPoints.forEach(point => {
            // console.log(JSON.stringify(point))
        // })
        }
        // currentPoints = nextPoints
        
    // }
    
    // console.log('final points:')
    // finalPoints.forEach(point => {
    //     console.log(JSON.stringify(point))
    // })
    return pointsTraveledTo

}

export async function solvePartOneRewrite ( filename : string, part: number, numberOfSteps: number) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)

    // Find the distance from the start to each tile
    // Count the number which have even parity
    for (let row = 0; row < grid.numberOfRows; row++) {
        for (let column = 0; column < grid.numberOfColumns; column++) {
        }
    }

    pointsTraveledTo


    // let leastAmountOfHeatLoss = 10000000
    // Find the starting point
    let currentPoints: Array<{point: Point, numberOfSteps: number}> = new Array()
    let finalPoints: Array<Point> = new Array()
    for (let row = 0; row < grid.numberOfRows; row++) {
        for (let column = 0; column < grid.numberOfColumns; column++) {
            let point = grid.gridPoints[row][column]
            if (point.value === 'S') {
                currentPoints.push({point: new Point(row, column, 'S'), numberOfSteps: 0})
                break
            }
        }
    }

    console.log('currentPoints:')
    currentPoints.forEach(point => {
        console.log(JSON.stringify(point))
    })
    // for (let step = 0; step < numberOfSteps; step++) {
    //     console.log('************* STEP:', step)
    //     let nextPoints: Array<Point> = new Array()
        for (let currentPoint of currentPoints) {
            // console.log(`processing ${currentPoint.point.row}, ${currentPoint.point.column}, after ${currentPoint.numberOfSteps} steps`)
            if (currentPoint.numberOfSteps === numberOfSteps) {
                if (!currentPoint.point.hasBeenVisited) {
                    finalPoints.push(currentPoint.point)
                    currentPoint.point.hasBeenVisited = true
                    pointsTraveledTo++
                }
                
            } else {
                for(let direction of ['U', 'D', 'L', 'R']) {
                    try {
                        let pointToTravelTo: Point = await grid.getNextLocation(currentPoint.point.row, currentPoint.point.column, new Vector(1, direction))
                        if (await pointToTravelTo.canBeTraveledTo() && !pointToTravelTo.hasBeenVisited) {
                            if (LOGGING) console.log(`adding ${pointToTravelTo.row}, ${pointToTravelTo.column} with cost ${currentPoint.numberOfSteps + 1} to the list of points to travel to`)
                            if (currentPoint.numberOfSteps % 2) {
                                finalPoints.push(currentPoint.point)
                                pointToTravelTo.hasBeenVisited = true
                                pointsTraveledTo++
                            } 
                            currentPoints.push({point: pointToTravelTo, numberOfSteps: currentPoint.numberOfSteps + 1})
                        }
                    } catch (error) {

                    }
                }
            }
            // console.log('currentPoints:')
            // currentPoints.forEach(point => {
            // console.log(JSON.stringify(point))
        // })
        }
        // currentPoints = nextPoints
        
    // }
    
    // console.log('final points:')
    // finalPoints.forEach(point => {
    //     console.log(JSON.stringify(point))
    // })
    return pointsTraveledTo

}

export async function solvePartTwo ( filename : string, numberOfSteps: number) {
    let pointsTraveledTo: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    // let leastAmountOfHeatLoss = 10000000
    // Find the starting point
    let currentPoints: Array<{point: Point, numberOfSteps: number}> = new Array()
    let finalPoints: Array<Point> = new Array()
    for (let row = 0; row < grid.numberOfRows; row++) {
        for (let column = 0; column < grid.numberOfColumns; column++) {
            let point = grid.gridPoints[row][column]
            if (point.value === 'S') {
                currentPoints.push({point: new Point(row, column, 'S'), numberOfSteps: 0})
                break
            }
        }
    }

    

    console.log('currentPoints:')
    currentPoints.forEach(point => {
        console.log(JSON.stringify(point))
    })
    // for (let step = 0; step < numberOfSteps; step++) {
    //     console.log('************* STEP:', step)
    //     let nextPoints: Array<Point> = new Array()
        for (let currentPoint of currentPoints) {
            // console.log(`processing ${currentPoint.point.row}, ${currentPoint.point.column}, after ${currentPoint.numberOfSteps} steps`)
            if (currentPoint.numberOfSteps === numberOfSteps) {
                if (!currentPoint.point.hasBeenVisited) {
                    finalPoints.push(currentPoint.point)
                    currentPoint.point.hasBeenVisited = true
                    pointsTraveledTo++
                }
                
            } else {
                for(let direction of ['U', 'D', 'L', 'R']) {
                    try {
                        // getPointAtLocationInfiniteGrid
                        let pointToTravelTo: Point = await grid.getNextLocationInfiniteGrid(currentPoint.point.row, currentPoint.point.column, new Vector(1, direction))
                        if (await pointToTravelTo.canBeTraveledTo() && !pointToTravelTo.hasBeenVisited) {
                            if (LOGGING) console.log(`adding ${pointToTravelTo.row}, ${pointToTravelTo.column} with cost ${currentPoint.numberOfSteps + 1} to the list of points to travel to`)
                            if (currentPoint.numberOfSteps % 2) {
                                finalPoints.push(currentPoint.point)
                                pointToTravelTo.hasBeenVisited = true
                                pointsTraveledTo++
                            } 
                            currentPoints.push({point: pointToTravelTo, numberOfSteps: currentPoint.numberOfSteps + 1})
                        }
                    } catch (error) {

                    }
                }
            }
            // console.log('currentPoints:')
            // currentPoints.forEach(point => {
            // console.log(JSON.stringify(point))
        // })
        }
        // currentPoints = nextPoints
        
    // }
    
    // console.log('final points:')
    // finalPoints.forEach(point => {
    //     console.log(JSON.stringify(point))
    // })
    return pointsTraveledTo

}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day21/tests/data/input.txt', 1, 6)
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day21/input.txt', 1, 64)
//     .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day21/tests/data/input.txt', 10)
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day21/input.txt', 10)
    .then(answer => console.log('answer:', answer))

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day21/tests/data/input.txt', 2)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day21/input.txt', 2)
// .then(answer => console.log('answer:', answer))