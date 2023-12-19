import { Point } from './point'

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
        let newPoint: Point = this.gridPoints[newRowNumber][newColumnNumber]
        return true
    }

    public async getNextLocation(oldRowNumber: number, oldColumnNumber: number, direction: String) {
        let newRowNumber: number
        let newColumnNumber: number
        switch (direction) {
            case 'U':
                newRowNumber = oldRowNumber - 1
                newColumnNumber = oldColumnNumber
                break
            case 'D':
                newRowNumber = oldRowNumber + 1
                newColumnNumber = oldColumnNumber
                break
            case 'L':
                newRowNumber = oldRowNumber
                newColumnNumber = oldColumnNumber - 1
                break
            case 'R':
                newRowNumber = oldRowNumber
                newColumnNumber = oldColumnNumber + 1
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