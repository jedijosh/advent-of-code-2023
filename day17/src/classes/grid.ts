class Grid {
    numberOfRows: number
    numberOfColumns: number
    
    constructor(rows: number, columns: number) {
        this.numberOfRows = rows
        this.numberOfColumns = columns
    }

    // asychronous function to return number of rows
    public async getNumberOfRows() {
        return this.numberOfRows
    }

    public async getNumberOfColumns() {
        return this.numberOfColumns
    }
}