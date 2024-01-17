import { solvePartOne } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 102 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt', 1, 6)
        expect(partOneAnswer).toBe(16)
    })
    
    test('result should be 3795 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt', 1, 64)
        expect(partOneAnswer).toBe(3795)
    })
    
    // test('part 2 result should be 94 with sample data', async () => {
    //     let partTwoAnswer = await solvePartOne('./tests/data/input.txt', 2)
    //     expect(partTwoAnswer).toBe(94)
    // })
    
    // test('part 2 result should be 630129824772393 with my data', async () => {
    //     let partTwoAnswer = await index.solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(630129824772393)
    // })
})
