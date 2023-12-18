import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/Grid'
import { Point } from './classes/Point'

export async function solvePartOne ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    console.log(fileLines)
    let grid: Grid = new Grid(fileLines)
    let leastAmountOfHeatLoss = 10000000
    // console.log(grid)

    class LavaPoint extends Point {
        heatLoss: number
        direction: String
        numberOfMovesInThisDirection: number

        constructor(row: number, column: number, value: String, direction: String, heatLoss: number) {
            super(row, column, value)
            this.heatLoss = heatLoss
            this.direction = direction
            this.numberOfMovesInThisDirection = 0
        }
    }
    
    let currentLocations: Array<LavaPoint> = new Array()
    currentLocations.push(new LavaPoint(0, 0, '0', 'R', 0))
    currentLocations.push(new LavaPoint(0, 0, '0', 'D', 0))
    currentLocations[0].heatLoss = currentLocations[0].heatLoss + Number('3')
    // console.log(currentLocations)
    let goalRowLocation: number = grid.numberOfRows - 1
    let goalColumnLocation: number = grid.numberOfColumns - 1

    while (currentLocations.length > 0 ) {
        for (let locationNumber = 0; locationNumber < currentLocations.length; locationNumber++) {
            if (locationNumber < 0) locationNumber = 0
            console.log(`searching ${locationNumber} of ${currentLocations.length}`)
            let currentLocation: LavaPoint = currentLocations[locationNumber]
            console.log(`at ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}`)
            currentLocation.heatLoss = Number(currentLocation.heatLoss) + Number(await currentLocation.getValue())
            if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
                // Reached goal
                console.log('Reached goal')
                if (leastAmountOfHeatLoss > currentLocation.heatLoss) leastAmountOfHeatLoss = currentLocation.heatLoss
                currentLocations.splice(locationNumber, 1)
                locationNumber--
            }
            if (currentLocation.heatLoss >= leastAmountOfHeatLoss) {
                console.log('heat loss exceeds least already calculated')
                currentLocations.splice(locationNumber, 1)
                locationNumber--
            }
            if (await currentLocation.getHasBeenVisited()) {
                console.log('already visited, pruning search')
                currentLocations.splice(locationNumber, 1)
                locationNumber--
            }
            // console.log(currentLocation)
            let newPoint: Point 
            try {
                newPoint = await grid.getNextLocation(currentLocation.row, currentLocation.column, currentLocation.direction)
                if (currentLocation.numberOfMovesInThisDirection < 3 && newPoint) {
                    currentLocation.numberOfMovesInThisDirection++
                    currentLocation.row = await newPoint.getRow()
                    currentLocation.column = await newPoint.getColumn()
                    console.log(`next location to search is ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}`)
                    // Might need to revisit this.  If has been visited but the current heat loss is less than the heat loss when it was visited, keep this alive?
                    if (await newPoint.getHasBeenVisited()) {
                        currentLocations.splice(locationNumber, 1)
                        locationNumber--
                    }
                    await newPoint.setHasBeenVisited(true)
                    // Try to add the other directions to the stack
                    let directions: Array<String>
                    ['U', 'D', 'L', 'R'].forEach(async value => {
                        if (value !== currentLocation.direction) {
                            try {
                                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                                if (!await pointToAdd.getHasBeenVisited()) currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                            } catch (error) {
                                console.log('Cannot move to location')
                            }
                        }
                    })
                } else {
                    console.log(`Can't move any further in direction ${currentLocation.direction}, pruning search`)
                    let directions: Array<String>
                    ['U', 'D', 'L', 'R'].forEach(async value => {
                        if (value !== currentLocation.direction) {
                            try {
                                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                                if (!await pointToAdd.getHasBeenVisited()) currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                            } catch (error) {
                                console.log('Cannot move to location')
                            }
                        }
                    })
                    currentLocations.splice(locationNumber, 1)
                    locationNumber--    
                }
            } catch (error) {
                // Error was thrown, can't move int that direction any further
                console.log(`Error was thrown moving in direction ${currentLocation.direction} from ${currentLocation.row}, ${currentLocation.column}`)
                // console.log(error)
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
                    // Reached goal
                    if (leastAmountOfHeatLoss > currentLocation.heatLoss) leastAmountOfHeatLoss = currentLocation.heatLoss
                }
                let directions: Array<String>
                    ['U', 'D', 'L', 'R'].forEach(async value => {
                        if (value !== currentLocation.direction) {
                            try {
                                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                                if (!await pointToAdd.getHasBeenVisited()) currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                            } catch (error) {
                                console.log('Cannot move to location')
                            }
                        }
                    })
            }
            
            // console.log('currentLocations')
            // console.log(currentLocations)
        }
        
    }
    console.log(goalRowLocation, goalColumnLocation)
    return leastAmountOfHeatLoss

}

solvePartOne('./tests/data/input.txt')
    .then(answer => console.log('answer:', answer))