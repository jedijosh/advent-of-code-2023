import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

const LOGGING = false

export async function solvePartOne ( filename : string, part: number, numberOfSteps: number) {
    let pointsTraveledTo: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)

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

    for (let currentPoint of currentPoints) {
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
        
    // console.log('final points:')
    // finalPoints.forEach(point => {
    //     console.log(JSON.stringify(point))
    // })
    return pointsTraveledTo

}

export async function solvePartTwo ( filename : string, numberOfSteps: number) {
    // Start is at 65, 65
    // Each square is 131 x 131
    // Start is in the middle of the square

    // Use BFS to calculate the shortest distances from the center to each tile.  Each tile will have an even or odd parity.
    // Number of steps is 26501365 = 65 + (202300 * 131)
    // 202300 full boards
    // s = number of steps
    // t = tile width/height
    // d = distance from center to edge
    // n = number of full boards
    // s = d + (n * t)

    // The parity of each board flips each time you cross a border
    // (n + 1)^2 odd input-squares and n^2 even input-squares.

    let pointsTraveledTo: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    let distanceToTile: Map<string, number> = new Map()

    // Find the starting point
    let currentPoints: Array<{point: Point, numberOfSteps: number}> = new Array()
    // let finalPoints: Array<Point> = new Array()
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
    
    // Search through all available points
    for (let currentPoint of currentPoints) {
        if(!distanceToTile.has(currentPoint.point.row + ',' + currentPoint.point.column)) {
            distanceToTile.set(currentPoint.point.row + ',' + currentPoint.point.column, currentPoint.numberOfSteps)
        }
        for(let direction of ['U', 'D', 'L', 'R']) {
            try {
                let pointToTravelTo: Point = await grid.getNextLocation(currentPoint.point.row, currentPoint.point.column, new Vector(1, direction))
                if (await pointToTravelTo.canBeTraveledTo() && !pointToTravelTo.hasBeenVisited) {
                    if (LOGGING) console.log(`adding ${pointToTravelTo.row}, ${pointToTravelTo.column} with cost ${currentPoint.numberOfSteps + 1} to the list of points to travel to`)
                    if (currentPoint.numberOfSteps % 2) {
                        // finalPoints.push(currentPoint.point)
                        pointToTravelTo.hasBeenVisited = true
                        pointsTraveledTo++
                    } 
                    currentPoints.push({point: pointToTravelTo, numberOfSteps: currentPoint.numberOfSteps + 1})
                }
            } catch (error) {

            }
        }
    }

    // 15399 tiles (including start)
    // In full file, row: 42, column: 30 and row: 52, column: 97 cannot be traveled to as they are boxed in.
    // for (let row = 0; row < grid.numberOfRows; row++) {
    //     for (let column = 0; column < grid.numberOfColumns; column++) {
    //         let point = grid.gridPoints[row][column]
    //         if (point.value !== '#') {
    //             if(!distanceToTile.has(point.row + ',' + point.column)) {
    //                 console.log(`row: ${point.row}, column: ${point.column} is missing`)
    //             }
    //         }
    //     }
    // }
    
    // This is the number of tiles in a full board for each parity
    let numberOfEvenParityTilesFullSquare: number = 0
    let numberOfOddParityTilesFullSquare: number = 0
    let numberOfTilesEvenCorner: number = 0
    let numberOfTilesOddCorner: number = 0
    let distanceToEdge = (grid.numberOfColumns - 1) / 2
    console.log('distanceToEdge', distanceToEdge)
    let evenParityMap: Map<string, number> = new Map()
    let oddParityMap: Map<string, number> = new Map()
    distanceToTile.forEach((value: number, key: string) => {
        if (value % 2 === 1) {
            numberOfOddParityTilesFullSquare++
            oddParityMap.set(key, value)
            if (value > distanceToEdge) numberOfTilesOddCorner++
        } else {
            numberOfEvenParityTilesFullSquare++
            evenParityMap.set(key, value)
            if (value > distanceToEdge) numberOfTilesEvenCorner++
        }
    })

    console.log(distanceToTile)
    console.log('numberOfEvenParityTiles', numberOfEvenParityTilesFullSquare)
    console.log('numberOfOddParityTiles', numberOfOddParityTilesFullSquare)
    console.log('numberOfTilesEvenCorner', numberOfTilesEvenCorner)
    console.log('numberOfTilesOddCorner', numberOfTilesOddCorner)

    // 26501365 - 65 / 131 - 202,300
    let numberOfBoards = (numberOfSteps - ((grid.numberOfRows - 1) / 2)) / (grid.numberOfRows)

    let result = (Math.pow(numberOfBoards + 1, 2) * numberOfOddParityTilesFullSquare) 
                 + (Math.pow(numberOfBoards, 2) * numberOfEvenParityTilesFullSquare) 
                 - ((numberOfBoards + 1) * numberOfTilesOddCorner)
                 + (numberOfBoards * numberOfTilesEvenCorner)

    return result


    
    

}

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day21'
// solvePartOne(dataFolder + '/data/tests/input.txt', 1, 6)
// solvePartOne(dataFolder + '/data/input.txt', 1, 64)

// solvePartTwo(dataFolder + '/data/tests/input.txt', 100)
solvePartTwo(dataFolder + '/data/input.txt', 26501365)

.then(answer => console.log('answer:', answer))