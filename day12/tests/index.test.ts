import { solvePartOne, findNextDirection } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 374 with sample data', async () => {
        let result = await solvePartOne('./tests/data/input.txt')
        expect(result).toBe(374)
    })

    test('result should be 9370588 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(9370588)
    })
    
    test('part 2 result should be 8410 with sample data', async () => {
        let partTwoAnswer = await solvePartOne('./tests/data/input-part2.txt')
        expect(partTwoAnswer).toBe(8410)
    })
    
    // test('part 2 result should be 459 with my data', async () => {
    //     let partTwoAnswer = await solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(459)
    // })
})