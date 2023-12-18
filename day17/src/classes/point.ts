export class Point {
    row: number
    column: number
    value: String
    hasBeenVisited: boolean = false
    lowestIncomingValue: number = 999999999999

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
}