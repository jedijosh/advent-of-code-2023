import { IncomingMessage } from "http"

export class Point {
    row: number
    column: number
    value: String
    hasBeenVisited: boolean = false
    lowestIncomingValue: number = 999999999999
    // Incoming vectors would store the prior directions (for example, 2 left moves) and the lowest incoming value related to that movement
    // This allows us to see if the next tentative move would be more efficient than what has already been done
    // Vectors have a magnitude and direction
    incomingVectors : Array<{incomingDirection: String, lowestIncomingValue: number}> = []

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

    public async setIncomingVectors(newVectorArray: Array<{incomingDirection: String, lowestIncomingValue: number}>) {
        this.incomingVectors = newVectorArray
    }

    public async addNewIncomingVector(newVectorToAdd : {incomingDirection: String, lowestIncomingValue: number}) {
        this.incomingVectors.push(newVectorToAdd)
    }

    public async getLowestIncomingValueForIncomingVector(incomingVector: String) {
        let indexToUpdate: number = this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === incomingVector)
        if (indexToUpdate !== -1) {
            return this.incomingVectors[indexToUpdate].lowestIncomingValue
        } else {
            return 999999999999
        }
    }

    public async updateIncomingVector(incomingDirection: String, newLowestIncomingValue: number) {
        let indexToUpdate: number = this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === incomingDirection)
        if (indexToUpdate !== -1) this.incomingVectors[indexToUpdate].lowestIncomingValue = newLowestIncomingValue
    }

    public async hasBeenVisitedFromVector(incomingVector: String) {
        return (this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === incomingVector) !== -1)
    }
}