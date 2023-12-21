import { Vector } from '../classes/Vector'
const MAX_VALUE: number = 999999999999

export class Point {
    row: number
    column: number
    value: String
    hasBeenVisited: boolean = false
    lowestIncomingValue: number = MAX_VALUE
    // Incoming vectors would store the prior directions (for example, 2 left moves) and the lowest incoming value related to that movement
    // This allows us to see if the next tentative move would be more efficient than what has already been done
    // Vectors have a magnitude and direction

    incomingVectors : Array<{vector: Vector, lowestCost: number}> = []

    constructor(row: number, column: number, value: String) {
        this.row = row
        this.column = column
        this.value = value
    }

    public async setHasBeenVisited (value: boolean) {
        this.hasBeenVisited = value
    }

    public async getHasBeenVisited () {
        return this.hasBeenVisited
    }

    public async getRow() {
        return this.row
    }

    public async getColumn() { 
        return this.column
    }

    public async getValue() {
        return this.value
    }

    public async setLowestIncomingValue(value: number) {
        this.lowestIncomingValue = value
    }

    public async getLowestIncomingValue() {
        return this.lowestIncomingValue
    }

    public async getIncomingVectors() {
        return this.incomingVectors
    }

    public async setIncomingVectors(newVectorArray: Array<{vector: Vector, lowestCost: number}>) {
        this.incomingVectors = newVectorArray
    }

    public async addNewIncomingVector(newVectorToAdd : {vector: Vector, lowestCost: number}) {
        this.incomingVectors.push(newVectorToAdd)
    }

    public async getLowestIncomingValueForIncomingVector(incomingVector: Vector) {
        // 12232 with old function, 7141 with new
        let lowestCostFound = MAX_VALUE
        let betterPathWithLowerMagnitude = false
        for (let magnitude = incomingVector.magnitude; magnitude > 0; magnitude--) {
            let vectorToFind = new Vector(magnitude, incomingVector.direction)

            // console.log('vector to find', vectorToFind)
            // console.log('searching', this.incomingVectors)
            let indexToRetrieve: number = this.incomingVectors.findIndex((vectorToCheck: {vector: Vector, lowestCost: number}) => {
                // return vectorToCheck.vector.direction === vectorToFind.direction && vectorToCheck.vector.magnitude === vectorToFind.magnitude
                return vectorToCheck.vector.direction === incomingVector.direction && vectorToCheck.vector.magnitude === magnitude
            })
            // console.log('index to retrieve', indexToRetrieve)
            if (indexToRetrieve !== -1) {
                if (this.incomingVectors[indexToRetrieve].lowestCost < lowestCostFound) {
                    lowestCostFound = this.incomingVectors[indexToRetrieve].lowestCost
                    if (vectorToFind !== incomingVector) betterPathWithLowerMagnitude = true // We've already checked the cost so if not the same
                    // if (magnitude !== incomingVector.magnitude) betterPathWithLowerMagnitude = true
                    break
                }
            }

        }
        // If there is already a path to this node with the same direction, lower magnitude, and lower cost, return -1 as this is not the most efficient path
        return betterPathWithLowerMagnitude ? -1 : lowestCostFound
    }

    public async updateIncomingVector(vectorToUpdate: Vector, newLowestIncomingValue: number) {
        let indexToUpdate: number = this.incomingVectors.findIndex((vectorToCheck: { vector:Vector, lowestCost: number}) => {
            return vectorToCheck.vector.direction === vectorToUpdate.direction && vectorToCheck.vector.magnitude === vectorToUpdate.magnitude
        })
        if (indexToUpdate !== -1) {
            this.incomingVectors[indexToUpdate].lowestCost = newLowestIncomingValue
        }
    }

    // Returns whether this node has been visited from this specific incoming vector
    public async hasBeenVisitedFromVector(incomingVector: Vector) {
        return (this.incomingVectors.findIndex((vectorToCheck) => {
            return vectorToCheck.vector.direction === incomingVector.direction && vectorToCheck.vector.magnitude === incomingVector.magnitude
        }) !== -1)
    }
}