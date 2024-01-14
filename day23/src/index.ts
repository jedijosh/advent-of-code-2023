import { parseFileIntoArrayOfLines } from './utils'
import { Edge } from './classes/Edge'
import { Graph } from './classes/Graph'
import { Node } from './classes/Node'

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
            if (longestPathLength < currentLocation.cost) {
                longestPathLength = currentLocation.cost
            }
            console.log(`Reached goal, cost is ${currentLocation.cost}, max cost is ${longestPathLength}`)
            continue
        }

        await addEligibleNeighbors(grid, currentLocation, pointsVisited, currentLocations)

        currentLocations.sort((pointA, pointB) => {
            return pointB.point.cost - pointA.point.cost
        })
    }
    let currentTime: Date = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    console.log('Counter', counter)
    return longestPathLength
}


// This solution does not currently work for part 1.  The edges are now one-way instead of bi-directional.
// However, the edge finding does not account for the fact that certain movements are restricted in part 1.
export async function solution ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let grid: Grid = new Grid(fileLines)
    
    let goalRowLocation: number = grid.numberOfRows - 1
    let goalColumnLocation: number = grid.gridPoints[grid.numberOfRows-1].findIndex(point => point.value === '.')
    console.log(`goal location is ${goalRowLocation},${goalColumnLocation}`)

    // A point is an intersection if it has a value of '.' and there are at least 3 points bordering with non-# values.
    let graph: Graph = new Graph()
    let nodeId = 0
    graph.nodes.push(new Node(nodeId, 0, 1))
    nodeId++
    graph.nodes.push(new Node(nodeId, goalRowLocation, goalColumnLocation))
    await findNodes(grid, graph, nodeId)
    
    
    // Now that we have the list of nodes, calculate edges which exist between them.
    // Find edges

    for (let nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        if (LOGGING) console.log('-------------CALCULATING EDGE----------------------------------')
        let startingNode: Node = graph.nodes[nodeIndex]
        let startingPoint: Point = await grid.getPointAtLocation(startingNode.x, startingNode.y)
        let pointsVisited: Array<Point> = new Array()
        pointsVisited.push(startingPoint)
        if (LOGGING) console.log(`Starting search from ${startingPoint.row}, ${startingPoint.column}`)
        
        // From the node, find out which direction(s) can be moved to.
        let possibleDirections: Array<string> = []
        for (let direction of ['L', 'R', 'U', 'D']) {
            try {
                let pointToAdd: Point = await grid.getNextLocation(startingPoint.row, startingPoint.column, new Vector(1, direction))
                let canMoveToLocation = await grid.canMoveToLocation(startingPoint.row, startingPoint.column, pointToAdd.row, pointToAdd.column)
                if (canMoveToLocation) {
                    possibleDirections.push(direction)
                }
            } catch (error) {

            }
        }
        // For each direction which can be moved to, follow the path until no more moves are possible or another node is found.
        for (let direction of possibleDirections) {
            let currentLocation: PathPoint = new PathPoint(startingPoint.row, startingPoint.column, startingPoint.value, direction, 0)
            if (LOGGING) console.log(`Starting search at ${currentLocation.row}, ${currentLocation.column} searching ${direction}`)
            let foundIntersection = false
            let currentCost = 0

            while (!foundIntersection) {
                try {
                    for (let directionToCheck of ['U', 'D', 'L', 'R']) {
                        if (LOGGING) console.log(`At ${currentLocation.row}, ${currentLocation.column}, Checking ${directionToCheck}`)
                        if (!foundIntersection) {
                            try {
                                let pointToAdd: Point = await grid.getNextLocation(currentLocation.row, currentLocation.column, new Vector(1, directionToCheck))
                                let canMoveToLocation = await grid.canMoveToLocation(currentLocation.row, currentLocation.column, pointToAdd.row, pointToAdd.column)
                                let pointAlreadyVisited = pointsVisited.findIndex(point => point.row === pointToAdd.row && point.column === pointToAdd.column) !== -1

                                if (canMoveToLocation && !pointAlreadyVisited) {
                                    direction = directionToCheck
                                    if (LOGGING) console.log(`Moving to ${pointToAdd.row}, ${pointToAdd.column} searching ${direction}`)
                                    // Found a valid movement.  Set that as the next location and stop searching.
                                    currentCost++
                                    // If now at an intersection, add the edge and stop searching on this path
                                    let endingNode = graph.nodes.find(node => node.x === pointToAdd.row && node.y === pointToAdd.column)
                                    if (endingNode) {
                                        if (LOGGING) console.log(`Found intersection at ${pointToAdd.row}, ${pointToAdd.column}`)
                                        foundIntersection = true
                                        // Check if the edge is already known
                                        let firstNode: Node = startingNode
                                        let secondNode: Node = endingNode
                                        let edgeAlreadyAdded = graph.edges.findIndex(edge => edge.node1.id === firstNode.id && edge.node2.id === secondNode.id) !== -1
                                        if (!edgeAlreadyAdded) {
                                            let newEdge: Edge = new Edge(firstNode, secondNode, currentCost)
                                            graph.edges.push(newEdge)
                                            startingNode.edges.push(newEdge)
                                        } else {
                                            if (LOGGING) console.log(`edge ${JSON.stringify(firstNode)}, ${JSON.stringify(secondNode)} was already added, not adding again.`)
                                        }                                        
                                    } else {
                                        pointsVisited.push(new Point(currentLocation.row, currentLocation.column, ''))
                                        currentLocation.row = pointToAdd.row
                                        currentLocation.column = pointToAdd.column
                                    }
                                    break
                                } else {
                                    if (LOGGING) console.log(`Point ${pointToAdd.row}, ${pointToAdd.column} can be moved to ${canMoveToLocation} and was already visited ${pointAlreadyVisited}`)
                                }
                            } catch (error) {
                                console.log('ERROR:', error)
                            }
                        }
                    }
                } catch (error) {
                    console.log('ERROR:', error)
                }
            }
        }
    }
    // Now we have the list of nodes and edges
    
    console.log('nodes', graph.nodes)
    console.log('---------------- EDGES ----------------------')
    console.log('edges', graph.edges)
    console.log('---------------- EDGES ----------------------')
    console.log(`There are ${graph.edges.length} edges`)
    let counter: number = 0
    let longestPathLength = -1
    let startingNode = graph.nodes.find(node => node.id === 0)
    if (!startingNode) return -1
    let endingNode = graph.nodes.find(node => node.id === 1)
    if (!endingNode) return -1

    let currentPaths: Array<{node: Node, visited: Array<Node>, cost: number}> = new Array()

    currentPaths.push({node: startingNode, visited: [startingNode], cost: 0})
    if (LOGGING) console.log('---------- STARTING PATH SEARCHING ----------')
    while (currentPaths.length > 0 ) {
        let firstItemInArray: any = currentPaths.shift()
        if (!firstItemInArray) break
        let currentNode: Node = firstItemInArray.node
        let currentCost: number = firstItemInArray.cost
        let nodesVisited: Array<Node> = firstItemInArray.visited

        if (counter % 100000 === 0) {
            let currentTime: Date = new Date(Date.now())
            console.log(`${currentTime.toISOString()} counter is ${counter}, number of searches ${currentPaths.length}, at ${currentNode.x},${currentNode.y}, max cost is ${longestPathLength}`)
        }
        counter++

        // Get the current location's data
        if (LOGGING) console.log(`At ${currentNode.x}, ${currentNode.y}, current cost is ${currentCost}, max cost is ${longestPathLength}`)
        if (currentNode.x === goalRowLocation && currentNode.y === goalColumnLocation) {
            // Reached goal
            if (longestPathLength < currentCost) {
                longestPathLength = currentCost
            }
            if (LOGGING) console.log(`Reached goal, cost is ${currentCost}, max cost is ${longestPathLength}`)
            continue
        }

        for (let edgeNumber = 0; edgeNumber < currentNode.edges.length; edgeNumber++) {
            let nextEdge = currentNode.edges[edgeNumber]
            // The current node will always be node 1 as the edges are one-way
            let nextNode: Node = nextEdge.node2
            
            // If the node in the edge has already been visited, cannot revisit.
            if (nodesVisited.findIndex(visitedNode => visitedNode.x === nextNode.x && visitedNode.y === nextNode.y) === -1) {
                // console.log(nodesVisited)
                // console.log(`Node ${nextNode.x}, ${nextNode.y} has not been visited`)
                let newVisited = nodesVisited.slice(0)
                newVisited.push(nextNode)
                currentPaths.push({node: nextNode, visited: newVisited, cost: currentCost + nextEdge.cost})    
            }
        }

        // (part === 1) ? await addEligibleNeighbors(grid, currentNode, nodesVisited, currentLocations) : await addEligibleNeighborsPartTwo(grid, currentNode, nodesVisited, currentLocations)

        currentPaths.sort((pathA, pathB) => {
            return pathB.cost - pathA.cost
        })
    }

    // Look at depth first search?
    // Optimization - Find intersections in the grid and calculate the distances between each intersection.
    // Breadth first search?

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

    let currentTime: Date = new Date(Date.now())
    console.log(`${currentTime.toISOString()} execution finished`)
    console.log('Counter', counter)
    return longestPathLength
}

async function findNodes ( grid: Grid, graph: Graph, startingNodeId: number) {
    for (let i = 0; i < grid.numberOfRows; i++) {
        for (let j = 0; j < grid.numberOfColumns; j++) {
            let currentPointValue = grid.gridPoints[i][j].value
            if (currentPointValue === '#') continue
            let neighbors: Array<PathPoint> = new Array()
            let possibleDirections: Array<string> = []
            switch (currentPointValue) {
                case '>':
                    possibleDirections = ['R']
                    break
                case '<':
                    possibleDirections = ['L']
                    break
                case '^':
                    possibleDirections = ['U']
                    break
                case 'v':
                    possibleDirections = ['D']
                    break
                default:
                    possibleDirections = ['L', 'R', 'U', 'D']
            }
            
            for (let direction of possibleDirections) {
                try {
                    let pointToAdd: Point = await grid.getNextLocation(i, j, new Vector(1, direction))
                    let canMoveToLocation = await grid.canMoveToLocation(i, j, pointToAdd.row, pointToAdd.column)
                    if (canMoveToLocation) {
                        neighbors.push(new PathPoint(pointToAdd.row, pointToAdd.column, pointToAdd.value, direction, 1))
                    }
                } catch (error) {

                }
            }
            if (neighbors.length >= 3) {
                graph.nodes.push(new Node(startingNodeId, i, j))
                startingNodeId++
            }
            // Store the neighbors 
            // grid.gridPoints[i][j].neighbors = neighbors
        }
    }
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

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day23'
// solvePartOne(dataFolder + '/data/tests/input.txt')
// solvePartOne(dataFolder + '/input.txt')
    // .then(answer => console.log('answer:', answer))

// solution(dataFolder + '/data/tests/input.txt')
// solution(dataFolder + '/input.txt')
// .then(answer => console.log('answer:', answer))