import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

const STORE_PATH = false
const LOGGING = false

class LavaPoint extends Point {
    heatLoss: number
    direction: String
    numberOfMovesInThisDirection: number
    path: Array<{row: number, column: number, heatLoss: number}>

    constructor(row: number, column: number, value: String, direction: String, heatLoss: number, magnitude: number, path: Array<{row: number, column: number, heatLoss: number}> = []) {
        super(row, column, value)
        this.heatLoss = heatLoss
        this.direction = direction
        this.numberOfMovesInThisDirection = magnitude
        this.path = path
    }
}

export async function solvePartOne ( filename : string, part: number) {
    let counter: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    let leastAmountOfHeatLoss = 10000000
    let bestPath: Array<{row: number, column: number}> = new Array()
    
    let currentLocations: Array<LavaPoint> = new Array()
    currentLocations.push(new LavaPoint(0, 0, '0', 'R', 0, 0, [{row :0, column :0, heatLoss:0}]))
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

    while (currentLocations.length > 0 ) {
        if (LOGGING) console.log('-----------------------------------------------')
        let firstItemInArray: any = currentLocations.shift()
        if (!firstItemInArray) break
        let currentLocation: LavaPoint = firstItemInArray
        if (STORE_PATH && LOGGING) console.log('currentLocation path', JSON.stringify(currentLocation.path))

        // for (let locationNumber = 0; locationNumber < currentLocations.length; locationNumber++) {
        // Get the current location's data
        if (counter % 100000 === 0) {
            let currentTime: Date = new Date(Date.now())
            console.log(`${currentTime.toISOString()} counter is ${counter}, number of searches ${currentLocations.length}, at ${currentLocation.row},${currentLocation.column}, heatLoss is ${currentLocation.heatLoss}`)
        }
        counter++
        // if (storePath) currentLocation.path.push({row: currentLocation.row, column: currentLocation.column, heatLoss: currentLocation.heatLoss})
        // console.log('currentLocation', currentLocation)
        // console.log('currentLocation path', JSON.stringify(currentLocation.path))
        if (LOGGING) console.log(`At ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}, current heat loss is ${currentLocation.heatLoss}`)
        if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
            // Reached goal
            // console.log(`Reached goal, heat loss is ${currentLocation.heatLoss}`)
            if (leastAmountOfHeatLoss > currentLocation.heatLoss) {
                leastAmountOfHeatLoss = currentLocation.heatLoss
                bestPath = currentLocation.path.slice()
                break
                // console.log(`new least heat loss is ${leastAmountOfHeatLoss} with path ${JSON.stringify(currentLocation.path)}`)
            }
            continue
        }

        // if (currentLocation.heatLoss >= leastAmountOfHeatLoss) {
        //     // Heat loss at current location is already more than the least needed to reach the goal.
        //     // console.log(`Removing search as heat loss ${currentLocation.heatLoss} exceeds least already calculated of ${leastAmountOfHeatLoss}`)
        //     continue
        // }

        let lowestIncomingValueForThisVector: number = await currentLocation.getLowestIncomingValueForIncomingVector(new Vector(currentLocation.numberOfMovesInThisDirection, currentLocation.direction))
        if (currentLocation.heatLoss > lowestIncomingValueForThisVector) {
            // There was a more efficient path from this vector.  Remove this search
            // console.log(`Removing search as heat loss ${currentLocation.heatLoss} exceeds least incoming of ${lowestIncomingValueForThisVector}`)
            continue
        }
        (part === 1) ? await addEligibleNeighbors(grid, currentLocation, currentLocations) : await addEligibleNeighborsPartTwo(grid, currentLocation, currentLocations)

        currentLocations.sort((lavaPointA, lavaPointB) => {
            return lavaPointA.heatLoss - lavaPointB.heatLoss
        })
    }
    let currentTime: Date = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    console.log('Best path is:')
    bestPath.forEach(point => {
        console.log(JSON.stringify(point))
    })
    // console.log(JSON.stringify(bestPath, null, 1))
    console.log('Counter', counter)
    return leastAmountOfHeatLoss

}

async function addEligibleNeighbors ( grid: Grid, currentLocation: LavaPoint, currentLocations: Array<LavaPoint>) {
    // For every node, have 6 possible next moves:
    // Rotate left, forward 1
    // Rotate left, forward 2
    // Rotate left, forward 3
    // Rotate right, forward 1
    // Rotate right, forward 2
    // Rotate right, forward 3

    let newDirections: Array<String>
    switch(currentLocation.direction) {
        case 'U':
        case 'D':
            newDirections = ['L', 'R']
            break
        default:
            newDirections = ['U', 'D']
            break
        
    }

    if (currentLocation.heatLoss === 0) newDirections.push(currentLocation.direction)
    if (LOGGING) console.log(`got here traveling ${currentLocation.direction}, new directions are: ${newDirections}`)

    for (let direction of newDirections) {
        let heatLossAlongPath: number = 0
        let newPath = []
        for (let numberOfMoves = 1; numberOfMoves <= 3; numberOfMoves++) {
            let incomingVector : Vector = new Vector(numberOfMoves, direction)
            try {
                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, new Vector(numberOfMoves, direction))

                let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                if (LOGGING) console.log(`Has ${pointToAdd.row}, ${pointToAdd.column} been visited from ${JSON.stringify(incomingVector)}? ${hasPreviouslyBeenVisitedFromThisVector}`)
                
                heatLossAlongPath = heatLossAlongPath + Number(pointToAdd.value)
                let newHeatLoss = currentLocation.heatLoss + heatLossAlongPath
                if (STORE_PATH) newPath.push({row: pointToAdd.row, column: pointToAdd.column, heatLoss: newHeatLoss})
                
                let newLavaPoint: LavaPoint = new LavaPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newHeatLoss, numberOfMoves, currentLocation.path.slice().concat(newPath))
                if (hasPreviouslyBeenVisitedFromThisVector) {
                    let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                    if (LOGGING) console.log(`current lowest value is ${currentLowestValue} for ${JSON.stringify(incomingVector)} and new heat loss is ${newHeatLoss}`)

                    if (currentLowestValue === -1 ) {
                        if (LOGGING) console.log(`Not adding ${pointToAdd.row}, ${pointToAdd.column} as there is a more efficient vector`)
                        await pointToAdd.updateIncomingVector(incomingVector, currentLowestValue)
                    }
                    if (newHeatLoss <= currentLowestValue) {
                        // Has been visited from this vector previously but heat loss will be less than or 
                        // equal to the lowest prior value.
                        if (LOGGING) console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} as ${newHeatLoss} is less than ${currentLowestValue}`)
                        await pointToAdd.updateIncomingVector(incomingVector, newHeatLoss)
                        currentLocations.push(newLavaPoint)
                    } else {
                        if (LOGGING) console.log(`Not adding ${pointToAdd.row}, ${pointToAdd.column} as ${newHeatLoss} is greater than ${currentLowestValue}`)
                    }
                } else {
                    // Hasn't previously been visited from this vector.
                    if (LOGGING) console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} with ${newHeatLoss} as it has not been visited from vector ${JSON.stringify(incomingVector)}`)
                    await pointToAdd.addNewIncomingVector({vector: incomingVector, lowestCost: newHeatLoss})
                    currentLocations.push(newLavaPoint)
                }
                
            } catch (error) {
                if (LOGGING) console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
            }
        }
    }
}

async function addEligibleNeighborsPartTwo ( grid: Grid, currentLocation: LavaPoint, currentLocations: Array<LavaPoint>) {
    // For every node, have 6 possible next moves:
    // Rotate left, forward 1
    // Rotate left, forward 2
    // Rotate left, forward 3
    // Rotate right, forward 1
    // Rotate right, forward 2
    // Rotate right, forward 3

    let newDirections: Array<String>
    switch(currentLocation.direction) {
        case 'U':
        case 'D':
            newDirections = ['L', 'R']
            break
        default:
            newDirections = ['U', 'D']
            break
        
    }

    if (currentLocation.heatLoss === 0) newDirections.push(currentLocation.direction)
    if (LOGGING) console.log(`got here traveling ${currentLocation.direction}, new directions are: ${newDirections}`)

    for (let direction of newDirections) {
        let heatLossAlongPath: number = 0
        let newPath = []
        // Can't turn in the first 4 squares
        for (let numberOfMoves = 1; numberOfMoves <= 3; numberOfMoves++) {
            try {
                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, new Vector(numberOfMoves, direction))
                heatLossAlongPath = heatLossAlongPath + Number(pointToAdd.value)
                let newHeatLoss = currentLocation.heatLoss + heatLossAlongPath
                if (STORE_PATH) newPath.push({row: pointToAdd.row, column: pointToAdd.column, heatLoss: newHeatLoss})
            } catch (error) {
                if (LOGGING) console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
            }
        }
        for (let numberOfMoves = 4; numberOfMoves <= 10; numberOfMoves++) {
            let incomingVector : Vector = new Vector(numberOfMoves, direction)
            try {
                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, new Vector(numberOfMoves, direction))

                let hasPreviouslyBeenVisitedFromThisVector: boolean = await pointToAdd.hasBeenVisitedFromVector(incomingVector)
                if (LOGGING) console.log(`Has ${pointToAdd.row}, ${pointToAdd.column} been visited from ${JSON.stringify(incomingVector)}? ${hasPreviouslyBeenVisitedFromThisVector}`)
                
                heatLossAlongPath = heatLossAlongPath + Number(pointToAdd.value)
                let newHeatLoss = currentLocation.heatLoss + heatLossAlongPath
                if (STORE_PATH) newPath.push({row: pointToAdd.row, column: pointToAdd.column, heatLoss: newHeatLoss})
                
                let newLavaPoint: LavaPoint = new LavaPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newHeatLoss, numberOfMoves, currentLocation.path.slice().concat(newPath))
                if (hasPreviouslyBeenVisitedFromThisVector) {
                    let currentLowestValue = await pointToAdd.getLowestIncomingValueForIncomingVector(incomingVector)
                    if (LOGGING) console.log(`current lowest value is ${currentLowestValue} for ${JSON.stringify(incomingVector)} and new heat loss is ${newHeatLoss}`)

                    if (currentLowestValue === -1 ) {
                        if (LOGGING) console.log(`Not adding ${pointToAdd.row}, ${pointToAdd.column} as there is a more efficient vector`)
                        await pointToAdd.updateIncomingVector(incomingVector, currentLowestValue)
                    }
                    if (newHeatLoss <= currentLowestValue) {
                        // Has been visited from this vector previously but heat loss will be less than or 
                        // equal to the lowest prior value.
                        if (LOGGING) console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} as ${newHeatLoss} is less than ${currentLowestValue}`)
                        await pointToAdd.updateIncomingVector(incomingVector, newHeatLoss)
                        currentLocations.push(newLavaPoint)
                    } else {
                        if (LOGGING) console.log(`Not adding ${pointToAdd.row}, ${pointToAdd.column} as ${newHeatLoss} is greater than ${currentLowestValue}`)
                    }
                } else {
                    // Hasn't previously been visited from this vector.
                    if (LOGGING) console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} with ${newHeatLoss} as it has not been visited from vector ${JSON.stringify(incomingVector)}`)
                    await pointToAdd.addNewIncomingVector({vector: incomingVector, lowestCost: newHeatLoss})
                    currentLocations.push(newLavaPoint)
                }
                
            } catch (error) {
                if (LOGGING) console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
            }
        }
    }
}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/tests/data/input.txt', 1)
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/input.txt', 1)
    .then(answer => console.log('answer:', answer))

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/tests/data/input.txt', 2)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day17/input.txt', 2)
// .then(answer => console.log('answer:', answer))