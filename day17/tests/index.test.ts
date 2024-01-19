import { solvePartOne } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day17'

describe('test solvePartOne', () => {
    it('result should be 102 with sample data', async () => {
        let partOneAnswer = await solvePartOne(dataFolder + '/data/tests/input.txt', 1)
        expect(partOneAnswer).toBe(102)
    }, 50000)

    it('result should be 6 with sample data 2', async () => {
        let partOneAnswer = await solvePartOne(dataFolder + '/data/tests/input2.txt', 1)
        expect(partOneAnswer).toBe(6)
    })

    it('result should be 9 with sample data 3', async () => {
        let partOneAnswer = await solvePartOne(dataFolder + '/data/tests/input3.txt', 1)
        expect(partOneAnswer).toBe(9)
    })
    
    // test('result should be 1076 with my data', async () => {
    //     let partOneAnswer = await solvePartOne(dataFolder + '/data/input.txt')
    //     expect(partOneAnswer).toBe(1076)
    // })
    
    test('part 2 result should be 94 with sample data', async () => {
        let partTwoAnswer = await solvePartOne(dataFolder + '/data/tests/input.txt', 2)
        expect(partTwoAnswer).toBe(94)
    })
    
    // test('part 2 result should be 8231 with my data', async () => {
    //     let partTwoAnswer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    //     expect(partTwoAnswer).toBe(8231)
    // })
})
