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
        // 12232 with old function, 7141 with new
        let lowestValueFound = MAX_VALUE
        let magnitudeToFind: number = Number(incomingVector.substring(0, 1))
        while (magnitudeToFind > 0) {
            let vectorToFind = magnitudeToFind.toString() + incomingVector.substring(1,2)
            // console.log('vector to find', vectorToFind)
            // console.log('searching', this.incomingVectors)
            let indexToRetrieve: number = this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => {
                return vector.incomingDirection === vectorToFind
            })
            // console.log('index to retrieve', indexToRetrieve)
            if (indexToRetrieve !== -1) {
                if (this.incomingVectors[indexToRetrieve].lowestIncomingValue < lowestValueFound) lowestValueFound = this.incomingVectors[indexToRetrieve].lowestIncomingValue
            }
            magnitudeToFind--

        }
        return lowestValueFound
        
        // let indexToRetrieve: number = this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => {
        //     return vector.incomingDirection === incomingVector
        //     // If an existing vector has the same direction, lower magnitude, and lower or equal value, return that value?
        //     // return vector.incomingDirection.substring(1,2) === incomingVector.substring(1,2) && Number(vector.incomingDirection.substring(0,1)) <= Number(incomingVector.substring(0,1))
        // })
        // // console.log('index to retrieve', indexToRetrieve)
        // if (indexToRetrieve !== -1) {
        //     return this.incomingVectors[indexToRetrieve].lowestIncomingValue
        // } else {
        //     return MAX_VALUE
        // }
    }

    public async updateIncomingVector(incomingDirection: String, newLowestIncomingValue: number) {
        let indexToUpdate: number = this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === incomingDirection)
        if (indexToUpdate !== -1) {
            this.incomingVectors[indexToUpdate].lowestIncomingValue = newLowestIncomingValue
        }
    }

    public async hasBeenVisitedFromVector(incomingVector: String) {
        return (this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => vector.incomingDirection === incomingVector) !== -1)
        // return (this.incomingVectors.findIndex((vector: {incomingDirection: String, lowestIncomingValue: number}) => {
        //     return vector.incomingDirection.substring(1,2) === incomingVector.substring(1,2) && Number(vector.incomingDirection.substring(0,1)) <= Number(incomingVector.substring(0,1))
        // }) !== -1)
    }
}