import { Node } from '../classes/Node'

export class Edge {
    // Default is that every node is an equal weight of 1
    cost: number
    node1: Node
    node2: Node

    constructor(node1: Node, node2: Node, cost: number = 1) {
        this.node1 = node1
        this.node2 = node2
        this.cost = cost
    }
}