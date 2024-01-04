import { Point } from './point'
import { Vector } from '../classes/Vector'

export class Grid {
    numberOfRows: number
    numberOfColumns: number
    gridPoints : Point[][]  
    
    constructor(arrayOfValues: String[]) {
        this.numberOfRows = arrayOfValues.length
        this.numberOfColumns = arrayOfValues[0].length
        this.gridPoints = new Array(this.numberOfRows)
        for (let rowNumber = 0; rowNumber < this.numberOfRows; rowNumber++) {
            this.gridPoints[rowNumber] = new Array()
            for (let columnNumber = 0; columnNumber < this.numberOfColumns; columnNumber++) {
                this.gridPoints[rowNumber].push(new Point(rowNumber, columnNumber, arrayOfValues[rowNumber].substring(columnNumber, columnNumber+1)))
            }
        }
    }

    public async getNumberOfRows() {
        return this.numberOfRows
    }

    public async getNumberOfColumns() {
        return this.numberOfColumns
    }

    public async canMoveToLocation(oldRowNumber: number, oldColumnNumber: number, newRowNumber: number, newColumnNumber: number) {
        if (newRowNumber < 0 || newRowNumber >= this.numberOfRows) return false
        if (newColumnNumber < 0 || newColumnNumber >= this.numberOfColumns) return false
        return true
    }

    // public async getNextLocation(oldRowNumber: number, oldColumnNumber: number, direction: String, numberOfMoves: number = 1) {
    public async getNextLocation(oldRowNumber: number, oldColumnNumber: number, vector: Vector) {
        let newRowNumber: number
        let newColumnNumber: number
        switch (vector.direction) {
            case 'U':
                newRowNumber = oldRowNumber - vector.magnitude
                newColumnNumber = oldColumnNumber
                break
            case 'D':
                newRowNumber = oldRowNumber + vector.magnitude
                newColumnNumber = oldColumnNumber
                break
            case 'L':
                newRowNumber = oldRowNumber
                newColumnNumber = oldColumnNumber - vector.magnitude
                break
            case 'R':
                newRowNumber = oldRowNumber
                newColumnNumber = oldColumnNumber + vector.magnitude
                break
            default:
                newRowNumber = -1
                newColumnNumber = -1
        }
        if (newRowNumber < 0 || newRowNumber >= this.numberOfRows) throw new Error('Invalid row number')
        if (newColumnNumber < 0 || newColumnNumber >= this.numberOfColumns) throw new Error('Invalid column number')
        return this.gridPoints[newRowNumber][newColumnNumber]
    }

    public async getPointAtLocation(rowNumber: number, columnNumber: number) {
        return this.gridPoints[rowNumber][columnNumber]
    }
}