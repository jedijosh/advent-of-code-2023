import { Point } from '../src/classes/point'
import { Vector } from '../src/classes/Vector'

let point = new Point(1, 2, 'value')

describe('test getRow function', () => {
    it('should return the row', async () => {
        expect(await point.getRow()).toBe(1)
        
    })
})

describe('test getColumn function', () => {
    it('should return the column', async () => {
        expect(await point.getColumn()).toBe(2)
        
    })
})

describe('test getLowestIncomingValueForIncomingVector function ', () => {
    it('should return the max value when there are no values in the vector', async () => {
        let point = new Point(1, 2, 'value')
        point.incomingVectors = []
        expect(await point.getLowestIncomingValueForIncomingVector(new Vector(1, 'R'))).toBe(999999999999)
    })

    it.only('should return the lowest value when there is only 1 incoming vector', async () => {
        let point = new Point(1, 2, 'value')
        point.incomingVectors = [{ vector: new Vector(1, 'R'), lowestCost: 2}]
        expect(await point.getLowestIncomingValueForIncomingVector(new Vector(1, 'R'))).toBe(2)
    })

    it('should return the lowest value when there are 2 vectors and a shorter path has a lower distance', async () => {
        let point = new Point(1, 2, 'value')
        point.incomingVectors = [
            { vector: new Vector(1, 'R'), lowestCost: 2},
            { vector: new Vector(2, 'R'), lowestCost: 5}
        ]
        expect(await point.getLowestIncomingValueForIncomingVector(new Vector(2, 'R'))).toBe(-1)
        // Should I return -1 or max value instead so we don't search above
    })
})
