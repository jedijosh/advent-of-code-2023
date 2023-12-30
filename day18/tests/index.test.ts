import { solvePartOne, solvePartTwo } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 62 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt')
        expect(partOneAnswer).toBe(62)
    })
    
    test('result should be 28911 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(28911)
    })
    
    test('part 2 result should be 952408144115 with sample data', async () => {
        let partTwoAnswer = await solvePartTwo('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(952408144115)
    })
    
    test('part 2 result should be 77366737561114 with my data', async () => {
        let partTwoAnswer = await solvePartTwo('./input.txt')
        expect(partTwoAnswer).toBe(77366737561114)
    })
})
