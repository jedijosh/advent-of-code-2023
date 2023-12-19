import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'

class LavaPoint extends Point {
    heatLoss: number
    direction: String
    numberOfMovesInThisDirection: number
    path: Array<{row: number, column: number}>

    constructor(row: number, column: number, value: String, direction: String, heatLoss: number, path: Array<{row: number, column: number}> = []) {
        super(row, column, value)
        this.heatLoss = heatLoss
        this.direction = direction
        this.numberOfMovesInThisDirection = 0
        this.path = path
    }
}

export async function solvePartOne ( filename : string) {
    let counter: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    // console.log(fileLines)
    let grid: Grid = new Grid(fileLines)
    let leastAmountOfHeatLoss = 10000000
    let bestPath: Array<{row: number, column: number}> = new Array()
    // console.log(grid)
    
    let currentLocations: Array<LavaPoint> = new Array()
    currentLocations.push(new LavaPoint(0, 0, '0', 'R', 0, []))
    // console.log(currentLocations)
    let goalRowLocation: number = grid.numberOfRows - 1
    let goalColumnLocation: number = grid.numberOfColumns - 1

    // Algorithm
    // Mark all nodes unvisited
    // Assign to every node a tentative distance value.  Set to infinity originally
    // Step 3: For the current node, conisder it's unvisited neighbors and calculate the tentative distance.  If the distance is lower than the prior value, update.
    // After considering all neighbors, mark the current node as visited.
    // If the destination node has been marked visited or if the smallest tentative distance is infinity, stop.
    // Otherwise select the unvisited node that has the smallest tentative distance and go back to step 3.

    // Find a viable path

    while (currentLocations.length > 0 ) {
        for (let locationNumber = 0; locationNumber < currentLocations.length; locationNumber++) {
            // Get the current location's data
            let currentLocation: LavaPoint
            currentLocation = currentLocations[locationNumber]
            if (counter % 100000 === 0) console.log(`counter is ${counter}, searching ${locationNumber} of ${currentLocations.length}, at ${currentLocation.row},${currentLocation.column}`)
            counter++
            currentLocation.path.push({row: currentLocation.row, column: currentLocation.column})
            // console.log(`at ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}, current heat loss is ${currentLocation.heatLoss}`)
            if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
                // Reached goal
                // console.log(`Reached goal, heat loss is ${currentLocation.heatLoss}`)
                if (leastAmountOfHeatLoss > currentLocation.heatLoss) {
                    leastAmountOfHeatLoss = currentLocation.heatLoss
                    bestPath = currentLocation.path.slice()
                    // console.log(`new least heat loss is ${leastAmountOfHeatLoss} with path ${JSON.stringify(currentLocation.path)}`)
                }
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue
            }
            if (currentLocation.heatLoss >= leastAmountOfHeatLoss) {
                // Heat loss at current location is already more than the least needed to reach the goal.
                // console.log(`Removing search as heat loss ${currentLocation.heatLoss} exceeds least already calculated of ${leastAmountOfHeatLoss}`)
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue
            }

            let lowestIncomingValueForThisVector: number = await currentLocation.getLowestIncomingValueForIncomingVector(currentLocation.numberOfMovesInThisDirection.toString() + currentLocation.direction)
            if (currentLocation.heatLoss > lowestIncomingValueForThisVector) {
                // There was a more efficient path from this vector.  Remove this search
                // console.log(`Removing search as heat loss ${currentLocation.heatLoss} exceeds least incoming of ${lowestIncomingValueForThisVector}`)
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue
            }
            // await addEligibleNeighbors(grid, currentLocation, currentLocations)

            // Try to see if we can move again in the same direction
            let newPoint: Point 
            try {
                newPoint = await grid.getNextLocation(currentLocation.row, currentLocation.column, currentLocation.direction)
                if (currentLocation.numberOfMovesInThisDirection < 2 && newPoint) {
                    // Can still move in same direction as haven't moved 3 times in this direction yet
                    // Find the new location details
                    currentLocation.numberOfMovesInThisDirection++
                    let newHeatLoss: number = currentLocation.heatLoss + Number(await newPoint.getValue())
                    
                    let newRow = await newPoint.getRow()
                    let newColumn = await newPoint.getColumn()
                    let incomingVector : String = currentLocation.numberOfMovesInThisDirection.toString() + currentLocation.direction
                    //console.log(`newHeatLoss: ${newHeatLoss}`)
                    // console.log(`next location to search is ${newRow}, ${newColumn} with vector ${incomingVector}`)
                    
                    // If has already been visited from the same incoming vector 
                    // but the current heat loss is less than the heat loss when it was visited, keep this alive
                    let priorTripAlongThisVector = await newPoint.hasBeenVisitedFromVector(incomingVector)
                    if (priorTripAlongThisVector) {
                        // If the node has been visited from this vector, check if the incoming value is less than
                        // or equal to the prior visit
                        if (newHeatLoss <= await newPoint.getLowestIncomingValueForIncomingVector(incomingVector)) {
                            // console.log(`new heat loss ${newHeatLoss} is less than old heat loss ${await newPoint.getLowestIncomingValueForIncomingVector(incomingVector)}`)
                            await newPoint.updateIncomingVector(incomingVector, newHeatLoss)
                            
                            // Try to add the other directions to the stack
                            await addEligibleNeighbors(grid, currentLocation, currentLocations)
                            currentLocation.row = newRow
                            currentLocation.column = newColumn
                            currentLocation.heatLoss = newHeatLoss
                        } else {
                            currentLocations.splice(locationNumber, 1)
                            locationNumber--
                        }
                    } else {
                        // Has not been visited from this incomingVector.  Log incoming vector for future trips
                        // console.log(`next location to search ${newRow}, ${newColumn} going direction ${currentLocation.direction} has not been seached from ${incomingVector}`)
                        await newPoint.addNewIncomingVector({incomingDirection: incomingVector, lowestIncomingValue: newHeatLoss})
                        await addEligibleNeighbors(grid, currentLocation, currentLocations)
                        currentLocation.row = newRow
                        currentLocation.column = newColumn
                        currentLocation.heatLoss = newHeatLoss
                    }
                    
                    await newPoint.setHasBeenVisited(true)
                    // moved from here
                } else {
                    // Either already moved 3 times in this direction or the newPoint can't be moved to
                    // console.log(`Can't move any further in direction ${currentLocation.direction}, pruning search`)
                    await addEligibleNeighbors(grid, currentLocation, currentLocations)
                    currentLocations.splice(locationNumber, 1)
                    locationNumber--
                    continue
                }
            } catch (error) {
                // Error was thrown, can't move in that direction any further
                // console.log(`Error was thrown moving in direction ${currentLocation.direction} from ${currentLocation.row}, ${currentLocation.column}`)
                // console.log(error)
                if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
                    // Reached goal
                    if (leastAmountOfHeatLoss > currentLocation.heatLoss) leastAmountOfHeatLoss = currentLocation.heatLoss
                }
                await addEligibleNeighbors(grid, currentLocation, currentLocations)
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue 
            }
            
            // console.log('currentLocations')
            // console.log(currentLocations)
        }
        // console.log('currentLocations')
        // console.log(currentLocations)
        // break
    }
    // console.log('Best path is:')
    // console.log(JSON.stringify(bestPath, null, 2))
    return leastAmountOfHeatLoss

}

async function addEligibleNeighbors ( grid: Grid, currentLocation: LavaPoint, currentLocations: Array<LavaPoint>) {
    // Need to know the grid and current location
    for (let direction of ['U', 'D', 'L', 'R']) {
        // Add all directions except for what the current search's direction      
        if (direction !== currentLocation.direction) {
            // console.log(`checking ${direction}, was heading ${currentLocation.direction}`)
            try {
                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, direction)
                let incomingVector : String = '1' + direction
                let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                // console.log(`new point ${pointToAdd.row}, ${pointToAdd.column} has value ${await pointToAdd.getValue()}`)
                let newHeatLoss = currentLocation.heatLoss + Number(await pointToAdd.getValue())
                // console.log(`${pointToAdd.row}, ${pointToAdd.column} has been visited ${hasPreviouslyBeenVisitedFromThisVector}`)
                if (hasPreviouslyBeenVisitedFromThisVector) {
                    let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                    if (newHeatLoss <= currentLowestValue) {
                        // Has been visited from this vector previously but heat loss will be less than or 
                        // equal to the lowest prior value.
                        // console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} as ${newHeatLoss} is less than ${currentLowestValue}`)
                        pointToAdd.updateIncomingVector(incomingVector, newHeatLoss)
                        currentLocations.push(new LavaPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newHeatLoss, currentLocation.path.slice()))
                    }
                } else {
                    // Hasn't previously been visited from this vector.
                    // console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} with ${newHeatLoss} as it has not been visited from direction ${direction}`)
                    currentLocations.push(new LavaPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newHeatLoss, currentLocation.path.slice()))
                }
                
            } catch (error) {
                // console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
            }
        }
    }
}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/tests/data/input.txt')
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/src/input.txt')
    .then(answer => console.log('answer:', answer))

    // should be 102 with test input