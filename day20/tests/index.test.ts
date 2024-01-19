import { solvePartOne, solvePartTwo } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day20'

describe('test solvePartOne', () => {
    it('result should be 32000000 with sample data 1', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(32000000)
    })

    it('result should be 11687500 with sample data 2', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input2.txt')
        expect(result).toBe(11687500)
    })
    
    test('result should be 712543680 with my data', async () => {
        let result = await solvePartOne(dataFolder + '/data/input.txt')
        expect(result).toBe(712543680)
    })
    
    test('part 2 result should be 238920142622879 with my data', async () => {
        let result = await solvePartTwo(dataFolder + '/data/input.txt')
        expect(result).toBe(238920142622879)
    })
})
