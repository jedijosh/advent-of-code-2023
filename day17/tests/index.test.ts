import { solvePartOne } from '../src/index'

const index = require('../index.js')

describe('test solvePartOne', () => {
    it('result should be 102 with sample data', async () => {
        let partOneAnswer = await solvePartOne('../tests/data/input.txt')
        expect(partOneAnswer).toBe(102)
    })
    
    test('result should be 7543 with my data', async () => {
        let partOneAnswer = await index.solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(7543)
    })
    
    test('part 2 result should be 51 with my data', async () => {
        let partTwoAnswer = await index.solvePartTwo('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(51)
    })
    
    test('part 2 result should be 8231 with my data', async () => {
        let partTwoAnswer = await index.solvePartTwo('./input.txt')
        expect(partTwoAnswer).toBe(8231)
    })
})
