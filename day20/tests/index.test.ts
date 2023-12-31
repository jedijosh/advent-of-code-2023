import { solvePartOne, solvePartTwo } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 32000000 with sample data 1', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt')
        expect(partOneAnswer).toBe(32000000)
    })

    it('result should be 11687500 with sample data 2', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input2.txt')
        expect(partOneAnswer).toBe(11687500)
    })
    
    test('result should be 712543680 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(712543680)
    })
    
    test('part 2 result should be 238920142622879 with my data', async () => {
        let partTwoAnswer = await solvePartTwo('./input.txt')
        expect(partTwoAnswer).toBe(238920142622879)
    })
})
