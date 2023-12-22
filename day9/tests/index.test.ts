import { solvePartOne, solvePartTwo } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 114 with sample data', async () => {
        let answer = await solvePartOne('./tests/data/input.txt')
        expect(answer).toBe(114)
    })
    
    test('result should be 1884768153 with my data', async () => {
        let answer = await solvePartOne('./input.txt')
        expect(answer).toBe(1884768153)
    })
    
    test('part 2 result should be 2 with sample data', async () => {
        let answer = await solvePartTwo('./tests/data/input.txt')
        expect(answer).toBe(2)
    })
    
    test('part 2 result should be 8231 with my data', async () => {
        let answer = await solvePartTwo('./input.txt')
        expect(answer).toBe(1031)
    })
})
