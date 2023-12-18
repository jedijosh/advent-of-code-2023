import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/Grid'
import { Point } from './classes/Point'
import { isCallOrNewExpression } from 'typescript'

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

export async function solvePartOne ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    console.log(fileLines)
    let grid: Grid = new Grid(fileLines)
    let leastAmountOfHeatLoss = 10000000
    // console.log(grid)
    
    let currentLocations: Array<LavaPoint> = new Array()
    currentLocations.push(new LavaPoint(0, 0, '0', 'R', 0))
    currentLocations.push(new LavaPoint(0, 0, '0', 'D', 0))
    currentLocations[0].heatLoss = currentLocations[0].heatLoss + Number('3')
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

    while (currentLocations.length > 0 ) {
        for (let locationNumber = 0; locationNumber < currentLocations.length; locationNumber++) {
            console.log(`searching ${locationNumber} of ${currentLocations.length}`)
            // Get the current location's data
            let currentLocation: LavaPoint = currentLocations[locationNumber]
            currentLocation.heatLoss = Number(currentLocation.heatLoss) + Number(await currentLocation.getValue())
            console.log(`at ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}, current heat loss is ${currentLocation.heatLoss}`)
            if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
                // Reached goal
                console.log(`Reached goal, heat loss is ${currentLocation.heatLoss}`)
                if (leastAmountOfHeatLoss > currentLocation.heatLoss) leastAmountOfHeatLoss = currentLocation.heatLoss
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue
            }
            if (currentLocation.heatLoss >= leastAmountOfHeatLoss) {
                // Heat loss at current location is already more than the least needed to reach the goal.
                console.log('heat loss exceeds least already calculated')
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue
            }

            // Try to see if we can move again in the same direction
            let newPoint: Point 
            try {
                newPoint = await grid.getNextLocation(currentLocation.row, currentLocation.column, currentLocation.direction)
                if (currentLocation.numberOfMovesInThisDirection < 3 && newPoint) {
                    // Can still move in same direction as haven't moved 3 times in this direction yet
                    // Find the new location details
                    currentLocation.numberOfMovesInThisDirection++
                    currentLocation.row = await newPoint.getRow()
                    currentLocation.column = await newPoint.getColumn()
                    let incomingVector : String = currentLocation.numberOfMovesInThisDirection.toString() + currentLocation.direction
                    console.log(`next location to search is ${currentLocation.row}, ${currentLocation.column} with vector ${incomingVector}`)
                    
                    // If has already been visited from the same incoming vector 
                    // but the current heat loss is less than the heat loss when it was visited, keep this alive
                    
                    let priorTripAlongThisVector = await newPoint.hasBeenVisitedFromVector(incomingVector)
                    
                    // let newPointIncomingVectors = await newPoint.getIncomingVectors()
                    // console.log(newPointIncomingVectors)
                    // let priorTripAlongThisVector = newPointIncomingVectors.find((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === incomingVector)
                    if (priorTripAlongThisVector) {
                        // Returns the incomingVector object
                        if (await newPoint.getLowestIncomingValueForIncomingVector(incomingVector) > (currentLocation.heatLoss + Number(await newPoint.getValue))) {
                            newPoint.updateIncomingVector(incomingVector, currentLocation.heatLoss)
                            
                            // Try to add the other directions to the stack
                            let directions: Array<String>
                            ['U', 'D', 'L', 'R'].forEach(async value => {
                                if (value !== currentLocation.direction) {
                                    try {
                                        let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                                        let newPointIncomingVectors = await pointToAdd.getIncomingVectors()
                                        // console.log(newPointIncomingVectors)
                                        let incomingVector : String = '1' + currentLocation.direction
                                        let priorTripAlongThisVector = await newPoint.hasBeenVisitedFromVector(incomingVector)
                                        // 
                                        // let priorTripAlongThisVector = newPointIncomingVectors.find((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === '1' + value)
                                        if (priorTripAlongThisVector) {
                                            // Returns the incomingVector object
                                            //if (currentLocation.heatLoss < priorTripAlongThisVector.lowestIncomingValue) {
                                            if (await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector) > (currentLocation.heatLoss + Number(pointToAdd.getValue))) {
                                                // Has been visited from this vector previously.  Only add if the heat loss when we get there is less than the lowest prior value.
                                                newPoint.updateIncomingVector(incomingVector, currentLocation.heatLoss + Number(pointToAdd.getValue()))
                                                currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                                            }
                                        } else {
                                            // Haven't visited this location before
                                            currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                                        }
                                        // keep updating here
                                    } catch (error) {
                                        console.log(`(1) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${value}`)
                                    }
                                }
                            })
                        } else {
                        // if (await newPoint.getHasBeenVisited()) {
                                currentLocations.splice(locationNumber, 1)
                                locationNumber--
                        //}
                        }
                    } else {
                        // Has not been visited from this incomingVector.  Log incoming vector for future trips
                        console.log(`next location to search ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction} has not been seached from ${incomingVector}`)
                        newPoint.addNewIncomingVector({incomingDirection: incomingVector, lowestIncomingValue: (currentLocation.heatLoss + Number(newPoint.getValue()))})

                        let directions: Array<String>
                            ['U', 'D', 'L', 'R'].forEach(async value => {
                                if (value !== currentLocation.direction) {
                                    try {
                                        let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                                        let newPointIncomingVectors = await pointToAdd.getIncomingVectors()
                                        // console.log(newPointIncomingVectors)
                                        let incomingVector : String = '1' + currentLocation.direction
                                        let priorTripAlongThisVector = await newPoint.hasBeenVisitedFromVector(incomingVector)
                                        // 
                                        // let priorTripAlongThisVector = newPointIncomingVectors.find((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === '1' + value)
                                        if (priorTripAlongThisVector) {
                                            // Returns the incomingVector object
                                            //if (currentLocation.heatLoss < priorTripAlongThisVector.lowestIncomingValue) {
                                            if (await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector) > (currentLocation.heatLoss + Number(pointToAdd.getValue))) {
                                                // Has been visited from this vector previously.  Only add if the heat loss when we get there is less than the lowest prior value.
                                                newPoint.updateIncomingVector(incomingVector, currentLocation.heatLoss + Number(pointToAdd.getValue()))
                                                currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                                            }
                                        } else {
                                            // Haven't visited this location before
                                            currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                                        }
                                        // keep updating here
                                    } catch (error) {
                                        console.log(`(1) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${value}`)
                                    }
                                }
                            })
                    }
                    
                    await newPoint.setHasBeenVisited(true)
                    // if (await newPoint.getLowestIncomingValue() < currentLocation.heatLoss) await newPoint.setLowestIncomingValue(currentLocation.heatLoss)
                    // moved from here
                } else {
                    // Either already moved 3 times in this direction or the newPoint can't be moved to
                    console.log(`Can't move any further in direction ${currentLocation.direction}, pruning search`)
                    let directions: Array<String>
                    ['U', 'D', 'L', 'R'].forEach(async value => {
                        if (value !== currentLocation.direction) {
                            try {
                                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                                let incomingVector : String = '1' + value
                                let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                                if (hasPreviouslyBeenVisitedFromThisVector) {
                                    let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                                    if ((currentLocation.heatLoss + Number(pointToAdd.getValue())) < currentLowestValue) {
                                        // Has been visited from this vector previously.  Only add if the current heat loss is less than the lowest prior value.
                                        pointToAdd.updateIncomingVector(currentLocation.direction, currentLocation.heatLoss)
                                        currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                                    }
                                } else {
                                    currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                                }
                                
                            } catch (error) {
                                console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${value}`)
                            }
                        }
                    })
                    currentLocations.splice(locationNumber, 1)
                    locationNumber--
                    continue
                }
            } catch (error) {
                // Error was thrown, can't move int that direction any further
                console.log(`Error was thrown moving in direction ${currentLocation.direction} from ${currentLocation.row}, ${currentLocation.column}`)
                // console.log(error)
                if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
                    // Reached goal
                    if (leastAmountOfHeatLoss > currentLocation.heatLoss) leastAmountOfHeatLoss = currentLocation.heatLoss
                }
                await addEligibleNeighbors(grid, currentLocation, currentLocations)
                // let directions: Array<String>
                // ['U', 'D', 'L', 'R'].forEach(async value => {
                //     if (value !== currentLocation.direction) {
                //         try {
                //             let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                //             let incomingVector : String = '1' + value
                //             let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                //             if (hasPreviouslyBeenVisitedFromThisVector) {
                //                 let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                //                 if (currentLocation.heatLoss < currentLowestValue) {
                //                     // Has been visited from this vector previously.  Only add if the current heat loss is less than the lowest prior value.
                //                     pointToAdd.updateIncomingVector(currentLocation.direction, currentLocation.heatLoss)
                //                     currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, pointToAdd.value, value, currentLocation.heatLoss))
                //                 }
                //             } else {
                //                 // Hasn't previously been visited from this vector.
                //                 currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, pointToAdd.value, value, currentLocation.heatLoss))
                //             }
                            
                //         } catch (error) {
                //             console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${value}`)
                //         }
                //     }
                // })
                
                
                // let directions: Array<String>
                //     ['U', 'D', 'L', 'R'].forEach(async value => {
                //         if (value !== currentLocation.direction) {
                //             try {
                //                 let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                //                 if (!await pointToAdd.getHasBeenVisited()) currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, newPoint.value, value, currentLocation.heatLoss))
                //             } catch (error) {
                //                 console.log('Cannot move to location')
                //             }
                //         }
                //     })
                currentLocations.splice(locationNumber, 1)
                locationNumber--
                continue 
            }
            
            // console.log('currentLocations')
            // console.log(currentLocations)
        }
        
    }
    console.log(goalRowLocation, goalColumnLocation)
    return leastAmountOfHeatLoss

}

async function addEligibleNeighbors ( grid: Grid, currentLocation: LavaPoint, currentLocations: Array<LavaPoint>) {
    // Need to know the grid and current location



    let directions: Array<String>
    ['U', 'D', 'L', 'R'].forEach(async value => {
        if (value !== currentLocation.direction) {
            try {
                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, value)
                let incomingVector : String = '1' + value
                let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                if (hasPreviouslyBeenVisitedFromThisVector) {
                    let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                    if (currentLocation.heatLoss < currentLowestValue) {
                        // Has been visited from this vector previously.  Only add if the current heat loss is less than the lowest prior value.
                        pointToAdd.updateIncomingVector(currentLocation.direction, currentLocation.heatLoss)
                        currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, pointToAdd.value, value, currentLocation.heatLoss))
                    }
                } else {
                    // Hasn't previously been visited from this vector.
                    currentLocations.push(new LavaPoint(currentLocation.row, currentLocation.column, pointToAdd.value, value, currentLocation.heatLoss))
                }
                
            } catch (error) {
                console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${value}`)
            }
        }
    })

}

solvePartOne('./tests/data/input.txt')
    .then(answer => console.log('answer:', answer))

    // should be 102 with test input