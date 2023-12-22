import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

const LOGGING = false

export async function solvePartOne ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    
    // Expand universe if row is empty
    for (let row = 0; row < fileLines.length; row++) {
        if (fileLines[row].indexOf('#') === -1) {
            fileLines.splice(row, 0, fileLines[row])
            row++
        }
    }

    // Expand universe if column is empty
    let rowLength = fileLines.length
    for (let column = 0; column < rowLength; column++) {
        let isColumnEmpty = true
        for (let row = 0; row < fileLines.length; row++) {
            if (fileLines[row][column] === '#') {
                isColumnEmpty = false
                break
            }
        }
        if (isColumnEmpty) {
            for (let row = 0; row < fileLines.length; row++) {
                fileLines[row] = fileLines[row].substring(0, column) + '.' + fileLines[row].substring(column)
            }
            column++
        }
    }

    if (LOGGING) {
        console.log('filelines:')
        fileLines.forEach(line => {
            console.log(line)
        })
    }

    // Find galaxies
    let galaxyLocations : Array<Point> = []
    for (let row = 0; row < fileLines.length; row++) {
        let galaxies = fileLines[row].matchAll(/#/g)
        if (galaxies) {
            for (let galaxy of galaxies) {
                galaxyLocations.push(new Point(row, galaxy.index || 0, '#'))
            }
        }
    }

    let grid: Grid = new Grid(fileLines)

    if (LOGGING) console.log('galaxyLocations', galaxyLocations)

    let pathsToFind: Array<{firstGalaxy: Point, secondGalaxy: Point}> = []
    for (let i = 0; i < galaxyLocations.length; i++) {
        for (let j = i + 1; j < galaxyLocations.length; j++) {
            pathsToFind.push({firstGalaxy: galaxyLocations[i], secondGalaxy: galaxyLocations[j]})
        }
    }

    for (let path of pathsToFind) {
        pathLength += Math.abs(path.firstGalaxy.column - path.secondGalaxy.column) + Math.abs(path.firstGalaxy.row - path.secondGalaxy.row)
         // Reset all visited and lowest incoming values
        //  for (let row = 0; row < grid.numberOfRows; row++) {
        //     for (let column = 0; column < grid.numberOfColumns; column++) {
        //         grid.gridPoints[row][column].hasBeenVisited = false
        //         grid.gridPoints[row][column].lowestIncomingValue = 999999999999
        //     }
        // }

        // // let counter: number = 0
        // let currentLocations: Array<Point> = new Array()
        // currentLocations.push(path.firstGalaxy)
        // let goalRowLocation: number = path.secondGalaxy.row
        // let goalColumnLocation: number = path.secondGalaxy.column
        // path.firstGalaxy.lowestIncomingValue = 0
        // let currentTime: Date = new Date(Date.now())
        // console.log(`${currentTime.toISOString()} Searching from ${currentLocations[0].row}, ${currentLocations[0].column} to ${goalRowLocation}, ${goalColumnLocation}`)

        // while (currentLocations.length > 0 ) {
        //     if (LOGGING) console.log('-----------------------------------------------')
        //     let firstItemInArray: any = currentLocations.shift()
        //     if (!firstItemInArray) break
        //     let currentLocation: Point = firstItemInArray

        //     if (currentLocation.row === goalRowLocation && currentLocation.column !== goalColumnLocation) {
        //         pathLength += currentLocation.lowestIncomingValue + Math.abs(currentLocation.column - goalColumnLocation)
        //         break
        //     }

        //     if (currentLocation.column === goalColumnLocation && currentLocation.row !== goalRowLocation) {
        //         pathLength += currentLocation.lowestIncomingValue + Math.abs(currentLocation.row - goalRowLocation)
        //         break
        //     }

        //     if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
        //         // Reached goal
        //         // console.log(`Reached goal, heat loss is ${currentLocation.heatLoss}`)
        //         pathLength += currentLocation.lowestIncomingValue
        //         if (LOGGING) console.log(`Reached goal, cost is ${currentLocation.lowestIncomingValue}`)
        //         break
        //     }

        //     // if (counter % 100000 === 0) {
        //     //     let currentTime: Date = new Date(Date.now())
        //     //     console.log(`${currentTime.toISOString()} counter is ${counter}, number of searches ${currentLocations.length}, at ${currentLocation.row},${currentLocation.column}, heatLoss is ${currentLocation.lowestIncomingValue}`)
        //     // }
        //     // counter++
    
        //     await addEligibleNeighbors(grid, currentLocation, currentLocations)
    
        //     currentLocations.sort((pointA, pointB) => {
        //         return pointA.lowestIncomingValue - pointB.lowestIncomingValue
        //     })
        // }
    }

    return pathLength
}

export async function solvePartTwo ( filename : string) {
    let pathLength: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    // Find galaxies
    let galaxyLocations : Array<{originalX: number, originalY: number, finalX: number, finalY: number}> = []
    for (let row = 0; row < fileLines.length; row++) {
        let galaxies = fileLines[row].matchAll(/#/g)
        if (galaxies) {
            for (let galaxy of galaxies) {
                galaxyLocations.push({originalX: row, originalY: galaxy.index || 0, finalX: row, finalY: galaxy.index || 0})
            }
        }
    }
    
    // Find empty rows
    // Expand universe if row is empty
    for (let row = 0; row < fileLines.length; row++) {
        if (fileLines[row].indexOf('#') === -1) {
            for (let galaxyNumber = 0; galaxyNumber < galaxyLocations.length; galaxyNumber++) {
                if(galaxyLocations[galaxyNumber].originalX > row) {
                    galaxyLocations[galaxyNumber].finalX += 999999
                }
            }
        }
    }

    // Expand universe if column is empty
    let rowLength = fileLines.length
    for (let column = 0; column < rowLength; column++) {
        let isColumnEmpty = true
        for (let row = 0; row < fileLines.length; row++) {
            if (fileLines[row][column] === '#') {
                isColumnEmpty = false
                break
            }
        }
        if (isColumnEmpty) {
            for (let galaxyNumber = 0; galaxyNumber < galaxyLocations.length; galaxyNumber++) {
                if(galaxyLocations[galaxyNumber].originalY > column) {
                    galaxyLocations[galaxyNumber].finalY += 999999
                }
            }
        }
    }

    if (LOGGING) {
        console.log('filelines:')
        fileLines.forEach(line => {
            console.log(line)
        })
    }

    if (LOGGING) console.log('galaxyLocations', galaxyLocations)

    let pathsToFind: Array<{firstGalaxy: {originalX: number, originalY: number, finalX: number, finalY: number}, 
        secondGalaxy: { originalX: number, originalY: number, finalX: number, finalY: number }}> = []
    for (let i = 0; i < galaxyLocations.length; i++) {
        for (let j = i + 1; j < galaxyLocations.length; j++) {
            pathsToFind.push({firstGalaxy: galaxyLocations[i], secondGalaxy: galaxyLocations[j]})
        }
    }

    for (let path of pathsToFind) {
        let distance =  Math.abs(path.firstGalaxy.finalY - path.secondGalaxy.finalY) + Math.abs(path.firstGalaxy.finalX - path.secondGalaxy.finalX)
        console.log('distance', distance)
        pathLength += distance
    }

    return pathLength
}

// async function addEligibleNeighbors ( grid: Grid, currentLocation: Point, currentLocations: Array<Point>) {
//     for (let direction of ['U', 'D', 'L', 'R']) {
//         try {
//             let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, new Vector(1, direction))
//             // if (pointToAdd.lowestIncomingValue > pointToAdd.lowestIncomingValue + 1) {
//             if (LOGGING) console.log(`Calculated point ${pointToAdd.row}, ${pointToAdd.column} with visted value of ${pointToAdd.hasBeenVisited}`)
//             if (!pointToAdd.hasBeenVisited) {
//                 // Cost is lower, add point
//                 let newCost = currentLocation.lowestIncomingValue + 1
//                 if (LOGGING) console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} with cost ${newCost} as it has not been visited`)
//                 pointToAdd.lowestIncomingValue = newCost
//                 pointToAdd.hasBeenVisited = true
//                 currentLocations.push(pointToAdd)
//             }
//         } catch (error) {

//         }
//     }
// }

// export async function solvePartTwo ( filename : string) {
//     let pathLength: number = 0
//     let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
//     let grid: Grid = new Grid(fileLines)
    
    
// }

// // solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day11/tests/data/input.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day11/input.txt')
//     .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day11/tests/data/input.txt')
solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day11/input.txt')
        .then(answer => console.log('answer:', answer))