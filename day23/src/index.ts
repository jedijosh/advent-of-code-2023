import { parseFileIntoArrayOfLines } from './utils'
import { Grid } from './classes/grid'
import { Point } from './classes/point'
import { Vector } from './classes/Vector'

const LOGGING = false

class PathPoint extends Point {
    cost: number
    direction: String

    constructor(row: number, column: number, value: String, direction: String, cost: number) {
        super(row, column, value)
        this.cost = cost
        this.direction = direction
    }
}

export async function solvePartOne ( filename : string) {
    let counter: number = 0
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    let longestPathLength = -1
    
    let currentLocations: Array<{point: PathPoint, visited: Array<string>}> = new Array()
    currentLocations.push({point: new PathPoint(0, 1, '1', 'D', 0), visited: ['0,1']})
    let goalRowLocation: number = grid.numberOfRows - 1
    // let goalColumnLocation: number = grid.numberOfColumns - 2
    let goalColumnLocation: number = grid.gridPoints[grid.numberOfRows-1].findIndex(point => point.value === '.')
    console.log(`goal location is ${goalRowLocation},${goalColumnLocation}`)

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
        let currentLocation: PathPoint = firstItemInArray.point
        let pointsVisited: Array<string> = firstItemInArray.visited

        // Get the current location's data
        if (counter % 100000 === 0) {
            let currentTime: Date = new Date(Date.now())
            console.log(`${currentTime.toISOString()} counter is ${counter}, number of searches ${currentLocations.length}, at ${currentLocation.row},${currentLocation.column}, cost is ${currentLocation.cost}`)
        }
        counter++
        if (LOGGING) console.log(`At ${currentLocation.row}, ${currentLocation.column} going direction ${currentLocation.direction}, current cost is ${currentLocation.cost}`)
        if (currentLocation.row === goalRowLocation && currentLocation.column === goalColumnLocation) {
            // Reached goal
            console.log(`Reached goal, cost is ${currentLocation.cost}`)
            if (longestPathLength < currentLocation.cost) {
                longestPathLength = currentLocation.cost
            }
            continue
        }

        await addEligibleNeighbors(grid, currentLocation, pointsVisited, currentLocations)

        currentLocations.sort((pointA, pointB) => {
            return pointA.point.cost - pointB.point.cost
        })
    }
    let currentTime: Date = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    console.log('Counter', counter)
    return longestPathLength
}

async function addEligibleNeighbors ( grid: Grid, currentLocation: PathPoint, pointsVisited: Array<string>, currentLocations: Array<{point: PathPoint, visited: Array<string>}>) {
    let newDirections: Array<string> = []
    switch (await currentLocation.getValue()) {
        case '>':
            newDirections = ['R']
            break
        case '<':
            newDirections = ['L']
            break
        case '^':
            newDirections = ['U']
            break
        case 'v':
            newDirections = ['D']
            break
        default:
            newDirections = ['L', 'R', 'U', 'D']
    }
    for (let direction of newDirections) {
        let incomingVector : Vector = new Vector(1, direction)
        try {
            let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, new Vector(1, direction))
            let canMoveToLocation = await grid.canMoveToLocation(currentLocation.row, currentLocation.column, pointToAdd.row, pointToAdd.column)

            let hasPreviouslyBeenVisited: boolean = pointsVisited.includes(`${pointToAdd.row},${pointToAdd.column}`)
            if (LOGGING) console.log(`Has ${pointToAdd.row}, ${pointToAdd.column} been visited from ${JSON.stringify(incomingVector)}? ${hasPreviouslyBeenVisited}`)
            
            let newCost = currentLocation.cost + 1
            
            let newPoint: PathPoint = new PathPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, newCost)
            if (!hasPreviouslyBeenVisited && canMoveToLocation) {
                // Hasn't previously been visited from this vector.
                if (LOGGING) console.log(`Adding ${pointToAdd.row}, ${pointToAdd.column} with ${newCost} as it has not been visited from vector ${JSON.stringify(incomingVector)}`)
                let newPointsVisited = pointsVisited.slice(0)
                newPointsVisited.push(`${pointToAdd.row},${pointToAdd.column}`)
                currentLocations.push({point: newPoint, visited: newPointsVisited})
            }
        } catch (error) {
            if (LOGGING) console.log(`(2) Cannot move from ${currentLocation.row}, ${currentLocation.column} going direction ${direction}`)
        }
    }
}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day23/tests/data/input.txt')
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day23/input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day23/tests/data/input.txt', 2)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day23/input.txt', 2)
// .then(answer => console.log('answer:', answer))