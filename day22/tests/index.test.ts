import { solvePartOne, solvePartTwo } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 5 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt')
        expect(partOneAnswer).toBe(5)
    })

    it('result should be 1 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input2.txt')
        expect(partOneAnswer).toBe(1)
    })
    
    test('result should be 441 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(441)
    })
    
    test('part 2 result should be 7 with sample data', async () => {
        let partTwoAnswer = await solvePartTwo('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(7)
    })
    
    test('part 2 result should be 80778 with my data', async () => {
        let partTwoAnswer = await solvePartTwo('./input.txt')
        expect(partTwoAnswer).toBe(80778)
    })
})
