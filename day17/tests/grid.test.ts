import { Vector } from '../src/classes/Vector'
import { Grid } from '../src/classes/grid'

let grid = new Grid(['123', '456', '789'])

describe('test getNextLocation function', () => {
    it('on a 3x3 grid should be able to move right from 0,0', async () => {
        let newLocation = await grid.getNextLocation(0, 0, new Vector(1, 'R'))
        expect(newLocation.row).toBe(0)
        expect(newLocation.column).toBe(1)
        
    })
})

describe('test canMoveToLocation function', () => {
    it('on a 3x3 grid should be able to move to 2,2', async () => {
        let canMove = await grid.canMoveToLocation(0, 0, 2, 2)
        expect(canMove).toBe(true)
    })

    it('on a 3x3 grid should not be able to move to 3,3', async () => {
        let canMove = await grid.canMoveToLocation(0, 0, 3, 3)
        expect(canMove).toBe(false)
    })

    it('on a 3x3 grid should not be able to move to -1, -1', async () => {
        let canMove = await grid.canMoveToLocation(0, 0, -1, -1)
        expect(canMove).toBe(false)
    })
})
