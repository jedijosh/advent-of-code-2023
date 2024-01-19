import { solution, findCombinations } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day12'

describe('test solvePartOne', () => {
    it('result should be 21 with sample data with no added copies', async () => {
        let result = await solution(dataFolder + '/data/tests/input.txt', 0)
        expect(result).toBe(21)
    })

    test('result should be 7732 with my data with no added copies', async () => {
        let partOneAnswer = await solution(dataFolder + '/data/input.txt', 0)
        expect(partOneAnswer).toBe(7732)
    })
    
    // test('part 2 result should be 525152 with sample data', async () => {
    //     let partTwoAnswer = await solution(dataFolder + '/data/tests/input.txt', 4)
    //     expect(partTwoAnswer).toBe(525152)
    // })

    test('part 2 result should be 16 with sample data and 4 added copies', async () => {
        let partTwoAnswer = await solution(dataFolder + '/data/tests/input3.txt', 4)
        expect(partTwoAnswer).toBe(16)
    })
    
    // test('part 2 result should be 4500070301581 with my data', async () => {
    //     let partTwoAnswer = await solvePartTwo(dataFolder + '/data/input.txt')
    //     expect(partTwoAnswer).toBe(4500070301581)
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