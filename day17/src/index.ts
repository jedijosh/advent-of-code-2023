import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

class LavaPoint extends Point {
    heatLoss: number
    direction: String
    numberOfMovesInThisDirection: number
    path: Array<{row: number, column: number}>

    constructor(row: number, column: number, value: String, direction: String, heatLoss: number, magnitude: number, path: Array<{row: number, column: number}> = []) {
        super(row, column, value)
        this.heatLoss = heatLoss
        this.direction = direction
        this.numberOfMovesInThisDirection = magnitude
        this.path = path
    }
}

class PriorityQueue {
    items: Array<{ item: any, priority: number }>

    constructor() {
        this.items = []
      }
    
      enqueue(item: any, priority: number) {
        this.items.push({ item, priority });
        this.items.sort((a, b) => a.priority - b.priority)
      }
    
      dequeue() {
        let itemToReturn: any = this.items.shift()
        return itemToReturn.item || undefined
      }
    
      isEmpty() {
        return this.items.length === 0
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
    currentLocations.push(new LavaPoint(0, 0, '0', 'R', 0, 0, []))
    // console.log(currentLocations)
    let goalRowLocation: number = grid.numberOfRows - 1
    let goalColumnLocation: number = grid.numberOfColumns - 1

    // Algorithm
    // Let the node at which we are starting be called the initial node. Let the distance of node Y be the distance from the initial node to Y. 
    // Dijkstra's algorithm will initially start with infinite distances and will try to improve them step by step.

    // Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set.

    // Assign to every node a tentative distance value: set it to zero for our initial node and to infinity for all other nodes. During the run of the algorithm, the tentative distance of a node v is the length of the shortest path discovered so far between the node v and the starting node. Since initially no path is known to any other vertex than the source itself (which is a path of length zero), all other tentative distances are initially set to infinity. Set the initial node as current.[17]

    // For the current node, consider all of its unvisited neighbors and calculate their tentative distances through the current node. Compare the newly calculated tentative distance to the one currently assigned to the neighbor and assign it the smaller one. For example, if the current node A is marked with a distance of 6, and the edge connecting it with a neighbor B has length 2, then the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance greater than 8 then change it to 8. Otherwise, the current value will be kept.

    // When we are done considering all of the unvisited neighbors of the current node, mark the current node as visited and remove it from the unvisited set. A visited node will never be checked again (this is valid and optimal in connection with the behavior in step 6.: that the next nodes to visit will always be in the order of 'smallest distance from initial node first' so any visits after would have a greater distance).

    // If the destination node has been marked visited (when planning a route between two specific nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity (when planning a complete traversal; occurs when there is no connection between the initial node and remaining unvisited nodes), then stop. The algorithm has finished.

    // Otherwise, select the unvisited node that is marked with the smallest tentative distance, set it as the new current node, and go back to step 3.

    // When planning a route, it is actually not necessary to wait until the destination node is "visited" as above: the algorithm can stop once the destination node has the smallest tentative distance among all "unvisited" nodes (and thus could be selected as the next "current"). 

    
    
    // Find a viable path
    let foundAPathToExit = false
    let currentSearchLocation = new LavaPoint(0, 0, '0', 'R', 0, 0, [])
    while (!foundAPathToExit) {
        // Found exit
        if (currentSearchLocation.row === goalRowLocation && currentSearchLocation.column === goalColumnLocation) {
            foundAPathToExit = true
            leastAmountOfHeatLoss = currentSearchLocation.heatLoss
            break
        }
        
        // Move
        let newPoint: Point
        if (currentSearchLocation.row < grid.numberOfRows ) {
            newPoint = await grid.getNextLocation(currentSearchLocation.row, currentSearchLocation.column, 'D')
            currentSearchLocation.row = await newPoint.getRow()
            currentSearchLocation.column = await newPoint.getColumn()
            currentSearchLocation.heatLoss += Number(await newPoint.getValue())
            currentSearchLocation.path.push({row: currentSearchLocation.row, column: currentSearchLocation.column})
        }
        if (currentSearchLocation.row < grid.numberOfColumns ) {
            newPoint = await grid.getNextLocation(currentSearchLocation.row, currentSearchLocation.column, 'R')
            currentSearchLocation.row = await newPoint.getRow()
            currentSearchLocation.column = await newPoint.getColumn()
            currentSearchLocation.heatLoss += Number(await newPoint.getValue())
            currentSearchLocation.path.push({row: currentSearchLocation.row, column: currentSearchLocation.column})
        }
    }

    console.log(`Found a path to exit with heat loss ${leastAmountOfHeatLoss}`)   
    while (currentLocations.length > 0 ) {
        let firstItemInArray: any = currentLocations.shift()
        if (!firstItemInArray) break
        let currentLocation: LavaPoint = firstItemInArray
        // console.log('currentLocation path', JSON.stringify(currentLocation.path))

        // for (let locationNumber = 0; locationNumber < currentLocations.length; locationNumber++) {
        // Get the current location's data
        if (counter % 100000 === 0) console.log(`counter is ${counter}, number of searches ${currentLocations.length}, at ${currentLocation.row},${currentLocation.column}`)
        counter++
        currentLocation.path.push({row: currentLocation.row, column: currentLocation.column})
        // console.log('currentLocation', currentLocation)
        // console.log('currentLocation path', JSON.stringify(currentLocation.path))
        console.log(`at ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}, current heat loss is ${currentLocation.heatLoss}`)
        if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
            // Reached goal
            console.log(`Reached goal, heat loss is ${currentLocation.heatLoss}`)
            if (leastAmountOfHeatLoss > currentLocation.heatLoss) {
                leastAmountOfHeatLoss = currentLocation.heatLoss
                bestPath = currentLocation.path.slice()
                // console.log(`new least heat loss is ${leastAmountOfHeatLoss} with path ${JSON.stringify(currentLocation.path)}`)
            }
            continue
        }
        if (currentLocation.heatLoss >= leastAmountOfHeatLoss) {
            // Heat loss at current location is already more than the least needed to reach the goal.
            // console.log(`Removing search as heat loss ${currentLocation.heatLoss} exceeds least already calculated of ${leastAmountOfHeatLoss}`)
            continue
        }

        let lowestIncomingValueForThisVector: number = await currentLocation.getLowestIncomingValueForIncomingVector(currentLocation.numberOfMovesInThisDirection.toString() + currentLocation.direction)
        if (currentLocation.heatLoss > lowestIncomingValueForThisVector) {
            // There was a more efficient path from this vector.  Remove this search
            // console.log(`Removing search as heat loss ${currentLocation.heatLoss} exceeds least incoming of ${lowestIncomingValueForThisVector}`)
            continue
        }
        await addEligibleNeighbors(grid, currentLocation, currentLocations)

        // Try to see if we can move again in the same direction
        // let newPoint: Point 
        // try {
        //     newPoint = await grid.getNextLocation(currentLocation.row, currentLocation.column, currentLocation.direction)
        //     if (currentLocation.numberOfMovesInThisDirection < 2 && newPoint) {
        //         // Can still move in same direction as haven't moved 3 times in this direction yet
        //         // Find the new location details
        //         currentLocation.numberOfMovesInThisDirection++
        //         let newHeatLoss: number = currentLocation.heatLoss + Number(await newPoint.getValue())
                
        //         let newRow = await newPoint.getRow()
        //         let newColumn = await newPoint.getColumn()
        //         let incomingVector : String = currentLocation.numberOfMovesInThisDirection.toString() + currentLocation.direction
        //         //console.log(`newHeatLoss: ${newHeatLoss}`)
        //         // console.log(`next location to search is ${newRow}, ${newColumn} with vector ${incomingVector}`)
                
        //         // If has already been visited from the same incoming vector 
        //         // but the current heat loss is less than the heat loss when it was visited, keep this alive
        //         let priorTripAlongThisVector = await newPoint.hasBeenVisitedFromVector(incomingVector)
        //         if (priorTripAlongThisVector) {
        //             // If the node has been visited from this vector, check if the incoming value is less than
        //             // or equal to the prior visit
        //             if (newHeatLoss <= await newPoint.getLowestIncomingValueForIncomingVector(incomingVector)) {
        //                 // console.log(`new heat loss ${newHeatLoss} is less than old heat loss ${await newPoint.getLowestIncomingValueForIncomingVector(incomingVector)}`)
        //                 await newPoint.updateIncomingVector(incomingVector, newHeatLoss)
                        
        //                 // Try to add the other directions to the stack
        //                 await addEligibleNeighbors(grid, currentLocation, currentLocations)
        //                 currentLocation.row = newRow
        //                 currentLocation.column = newColumn
        //                 currentLocation.heatLoss = newHeatLoss
        //             } else {
        //                 console.log('not continuing with search')
        //             }
        //         } else {
        //             // Has not been visited from this incomingVector.  Log incoming vector for future trips
        //             // console.log(`next location to search ${newRow}, ${newColumn} going direction ${currentLocation.direction} has not been seached from ${incomingVector}`)
        //             await newPoint.addNewIncomingVector({incomingDirection: incomingVector, lowestIncomingValue: newHeatLoss})
        //             await addEligibleNeighbors(grid, currentLocation, currentLocations)
        //             currentLocation.row = newRow
        //             currentLocation.column = newColumn
        //             currentLocation.heatLoss = newHeatLoss
        //         }
                
        //         await newPoint.setHasBeenVisited(true)
        //         // moved from here
        //     } else {
        //         // Either already moved 3 times in this direction or the newPoint can't be moved to
        //         // console.log(`Can't move any further in direction ${currentLocation.direction}, pruning search`)
        //         await addEligibleNeighbors(grid, currentLocation, currentLocations)
        //         continue
        //     }
        // } catch (error) {
        //     // Error was thrown, can't move in that direction any further
        //     // console.log(`Error was thrown moving in direction ${currentLocation.direction} from ${currentLocation.row}, ${currentLocation.column}`)
        //     // console.log(error)
        //     if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
        //         // Reached goal
        //         if (leastAmountOfHeatLoss > currentLocation.heatLoss) leastAmountOfHeatLoss = currentLocation.heatLoss
        //     }
        //     await addEligibleNeighbors(grid, currentLocation, currentLocations)
        //     continue 
        // }
        
        // console.log('currentLocations')
        // console.log(currentLocations)
        currentLocations.sort((lavaPointA, lavaPointB) => lavaPointA.heatLoss - lavaPointB.heatLoss)
        // if (counter === 10) break
        // }
        // console.log('currentLocations')
        // console.log(currentLocations)
        // break
    }
    console.log('Best path is:')
    console.log(JSON.stringify(bestPath, null, 2))
    console.log('Counter', counter)
    return leastAmountOfHeatLoss

}

async function addEligibleNeighbors ( grid: Grid, currentLocation: LavaPoint, currentLocations: Array<LavaPoint>) {
    // Need to know the grid and current location
    for (let direction of ['U', 'D', 'L', 'R']) {
        // Add all directions except for what the current search's direction      
        let incomingVector : String
        let movesInThisDirection : number
        if (direction === currentLocation.direction) {
            movesInThisDirection = currentLocation.numberOfMovesInThisDirection + 1
        } else {
            movesInThisDirection = 1
        }
        incomingVector = movesInThisDirection.toString() + currentLocation.direction
        if (movesInThisDirection < 3) {
            try {
                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, direction)
                let incomingVector : String = '0' + direction
                let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                // console.log(`has ${pointToAdd.row}, ${pointToAdd.column} been visited from ${incomingVector}? ${hasPreviouslyBeenVisitedFromThisVector}`)
                // console.log(`new point ${pointToAdd.row}, ${pointToAdd.column} has value ${await pointToAdd.getValue()}`)
                let newHeatLoss = currentLocation.heatLoss + Number(await pointToAdd.getValue())
                // console.log(`${pointToAdd.row}, ${pointToAdd.column} has been visited ${hasPreviouslyBeenVisitedFromThisVector}`)
                if (hasPreviouslyBeenVisitedFromThisVector) {
                    let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                    // console.log(`current lowest value is ${currentLowestValue} for ${incomingVector} and new heat loss is ${newHeatLoss}`)
                    if (newHeatLoss <= currentLowestValue) {
                        // Has been visited from this vector previously but heat loss will be less than or 
                        // equal to the lowest prior value.
                        // console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} as ${newHeatLoss} is less than ${currentLowestValue}`)
                        await pointToAdd.updateIncomingVector(incomingVector, newHeatLoss)
                        currentLocations.push(new LavaPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newHeatLoss, movesInThisDirection, currentLocation.path.slice()))
                    }
                } else {
                    // Hasn't previously been visited from this vector.
                    // console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} with ${newHeatLoss} as it has not been visited from direction ${direction}`)
                    await pointToAdd.addNewIncomingVector({incomingDirection: incomingVector, lowestIncomingValue: newHeatLoss})
                    currentLocations.push(new LavaPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newHeatLoss, movesInThisDirection, currentLocation.path.slice()))
                }
                
            } catch (error) {
                // console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
            }
        }
        else {
            // console.log(`(3) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
        }
        
    }
}

solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/tests/data/input3.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/src/input.txt')
    .then(answer => console.log('answer:', answer))

    // should be 102 with test input