import { solvePartOne } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 94 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt')
        expect(partOneAnswer).toBe(94)
    })
    
    test('result should be 2106 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(2106)
    })
    
    test('part 2 result should be 94 with sample data', async () => {
        let partTwoAnswer = await solvePartOne('./tests/data/input.txt', 2)
        expect(partTwoAnswer).toBe(94)
    })
    
    // test('part 2 result should be 8231 with my data', async () => {
    //     let partTwoAnswer = await index.solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(8231)
    // })
})
