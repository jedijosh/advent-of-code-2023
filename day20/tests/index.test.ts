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
    
    test('result should be 432788 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(432788)
    })
    
    test('part 2 result should be 167409079868000 with sample data', async () => {
        let partTwoAnswer = await solvePartTwo('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(167409079868000)
    })
    
    test('part 2 result should be 142863718918201 with my data', async () => {
        let partTwoAnswer = await solvePartTwo('./input.txt')
        expect(partTwoAnswer).toBe(142863718918201)
    })
})
