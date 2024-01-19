import { solvePartOne } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day24'

describe('test solvePartOne', () => {
    it('result should be 2 with sample data', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input.txt', 7 , 27)
        expect(result).toBe(2)
    })
    
    test('result should be 12783 with my data', async () => {
        let result = await solvePartOne(dataFolder + '/data/input.txt', 200000000000000, 400000000000000)
        expect(result).toBe(12783)
    })
})
