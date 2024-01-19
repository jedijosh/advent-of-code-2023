import { solvePartOne, solvePartTwo } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day18'

describe('test solvePartOne', () => {
    it('result should be 62 with sample data', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(62)
    })
    
    test('result should be 28911 with my data', async () => {
        let result = await solvePartOne(dataFolder + '/data/input.txt')
        expect(result).toBe(28911)
    })
    
    test('part 2 result should be 952408144115 with sample data', async () => {
        let result = await solvePartTwo(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(952408144115)
    })
    
    test('part 2 result should be 77366737561114 with my data', async () => {
        let result = await solvePartTwo(dataFolder + '/data/input.txt')
        expect(result).toBe(77366737561114)
    })
})
