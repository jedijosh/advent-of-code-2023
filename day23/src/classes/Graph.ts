import { Edge } from '../classes/Edge'
import { Node } from '../classes/Node'

// A graph is made up of points/nodes/verticies.
// Connections between verticies are called edges/links/lines.  These can have a weight associated with them
export class Graph {
    nodes: Array<Node> = new Array()
    edges: Array<Edge> = new Array()
} 