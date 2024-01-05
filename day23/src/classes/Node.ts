import { Edge } from '../classes/Edge'

export class Node {
    edges: Array<Edge> = new Array()
    id: number
    x: number
    y: number

    constructor(id: number, x: number, y: number) {
        this.id = id
        this.x = x
        this.y = y
    }
}