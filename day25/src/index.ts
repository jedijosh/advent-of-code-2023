import { parseFileIntoArrayOfLines } from './utils'

import { Edge } from './classes/Edge'
import { Graph } from './classes/Graph'
import { Node } from './classes/Node'

const LOGGING = false

export async function translateInput ( filename : string) {
    // For test, look for intersections that happen with an X and Y position each at least 7 and at most 27
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    for (let line of fileLines) {
        let originatingComponent: string = line.split(':')[0]
        let destinationComponents: Array<string> = line.split(':')[1].trim().split(' ')
        for (let destinationComponent of destinationComponents) {
            console.log(`${originatingComponent} -- ${destinationComponent}`)
        }    
    }

    return 
}

// Once have the translated input, plug into https://dreampuf.github.io/GraphvizOnline/ to find the 3 connections to cut
// Full input had to be run through GraphViz locally.
// Command (run in regular terminal): neato -Tsvg input-AllConnections.txt
// Remove those connections from the list and then calculate how many components are on each side.

// For full input, need to remove the following connections:
// vqj -- szh
// zhb -- vxr
// jbx -- sml

export async function solution ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let graph: Graph = new Graph()
    
    for (let line of fileLines) {
        let originatingNode: Node
        let destinationNode: Node
        let originatingComponent: string = line.split('--')[0].trim()
        let destinationComponent: string = line.split('--')[1].trim()

        console.log(`${originatingComponent} -- ${destinationComponent}`)
        
        if (!graph.nodes.find(node => node.id === originatingComponent)) {
            originatingNode = new Node(originatingComponent, 0, 0)
            graph.nodes.push(originatingNode)
        } else {
            originatingNode = graph.nodes.find(node => node.id === originatingComponent)!
        }
        
        if (!graph.nodes.find(node => node.id === destinationComponent)) {
            destinationNode = new Node(destinationComponent, 0, 0)
            graph.nodes.push(destinationNode)
        } else {
            destinationNode = graph.nodes.find(node => node.id === destinationComponent)!
        }
        destinationNode.edges.push(new Edge(destinationNode, originatingNode, 1))
        originatingNode.edges.push(new Edge(originatingNode, destinationNode, 1))
        graph.edges.push(new Edge(originatingNode, destinationNode, 1))
    }

    console.log('number of nodes:', graph.nodes.length)

    let nodesOnFirstSide: number = 1
    let nodesOnSecondSide: number = 1
    let vqjNodeList: Array<Node> = new Array()
    let szhNodeList: Array<Node> = new Array()
    let vqjVisitedNodeList: Array<Node> = new Array()
    let szhVisitedNodeList: Array<Node> = new Array()


    // For test input, these should be hfx and pzl
    // For full input, these should be vqj and szh
    // vqjNodeList.push(graph.nodes.find(node => node.id === 'hfx')!)
    // vqjVisitedNodeList.push(graph.nodes.find(node => node.id === 'hfx')!)
    vqjNodeList.push(graph.nodes.find(node => node.id === 'vqj')!)
    vqjVisitedNodeList.push(graph.nodes.find(node => node.id === 'vqj')!)
    
    while (vqjNodeList.length > 0) {
        let nodeToProcess = vqjNodeList.shift()
        if (!nodeToProcess) break
        for (let edgeNumber = 0; edgeNumber < nodeToProcess.edges.length; edgeNumber++) {
            let edge = nodeToProcess.edges[edgeNumber]
            let nodeToCheck = (edge.node1.id === nodeToProcess.id) ? edge.node2 : edge.node1
            if(!vqjVisitedNodeList.find(node => node.id === nodeToCheck.id)) {
                vqjNodeList.push(nodeToCheck)
                vqjVisitedNodeList.push(nodeToCheck)
                nodesOnFirstSide++
            }
        }
    }

    // snhNodeList.push(graph.nodes.find(node => node.id === 'pzl')!)
    // snhVisitedNodeList.push(graph.nodes.find(node => node.id === 'pzl')!)
    szhNodeList.push(graph.nodes.find(node => node.id === 'szh')!)
    szhVisitedNodeList.push(graph.nodes.find(node => node.id === 'szh')!)

    while (szhNodeList.length > 0) {
        let nodeToProcess = szhNodeList.shift()
        if (!nodeToProcess) break
        for (let edgeNumber = 0; edgeNumber < nodeToProcess.edges.length; edgeNumber++) {
            let edge = nodeToProcess.edges[edgeNumber]
            let nodeToCheck = (edge.node1.id === nodeToProcess.id) ? edge.node2 : edge.node1
            if(!szhVisitedNodeList.find(node => node.id === nodeToCheck.id)) {
                szhNodeList.push(nodeToCheck)
                szhVisitedNodeList.push(nodeToCheck)
                nodesOnSecondSide++
            }
        }
    }

    console.log(`Nodes on first side: ${nodesOnFirstSide}`)
    console.log(`Nodes on second side: ${nodesOnSecondSide}`)

    console.log('Answer:', nodesOnFirstSide * nodesOnSecondSide)
    
    return
}

// translateInput('/mnt/c/Users/joshs/code/advent-of-code-2023/day25/tests/data/input.txt')
// solution('/mnt/c/Users/joshs/code/advent-of-code-2023/day25/tests/data/cutConnections.txt')

// translateInput('/mnt/c/Users/joshs/code/advent-of-code-2023/day25/input.txt')
solution('/mnt/c/Users/joshs/code/advent-of-code-2023/day25/input-CutConnections.txt')