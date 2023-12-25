import { solvePartOne, solvePartTwo, findCombinations } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 21 with sample data', async () => {
        let result = await solvePartOne('./tests/data/input.txt')
        expect(result).toBe(21)
    })

    test('result should be 7732 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(7732)
    })
    
    test('part 2 result should be 525152 with sample data', async () => {
        let partTwoAnswer = await solvePartTwo('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(525152)
    })
    
    // test('part 2 result should be 459 with my data', async () => {
    //     let partTwoAnswer = await solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(459)
    // })
})

describe('test findCombinations', () => {
    it('should find 6 combinations with 5 inputs and combination of 3 nunbers', async () => {
        // 1, 2, 5, 6, 10 - need to find 3
        // 1, 2, 5
        // 1, 2, 6
        // 1, 2, 10
        // 2, 5, 6
        // 2, 5, 10
        // 5, 6, 10
        let result: Array<Array<number>> = []
        result = await findCombinations([], [1, 2, 5, 6, 10], 3)
        console.log('result', result)
        expect(result.length).toBe(10)
    })
})