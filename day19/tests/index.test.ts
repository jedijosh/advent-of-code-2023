import { solvePartOne, solvePartTwo } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day19'

describe('test solvePartOne', () => {
    it('result should be 19114 with sample data', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(19114)
    })
    
    test('result should be 432788 with my data', async () => {
        let result = await solvePartOne(dataFolder + '/data/input.txt')
        expect(result).toBe(432788)
    })
    
    test('part 2 result should be 167409079868000 with sample data', async () => {
        let result = await solvePartTwo(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(167409079868000)
    })
    
    test('part 2 result should be 142863718918201 with my data', async () => {
        let result = await solvePartTwo(dataFolder + '/data/input.txt')
        expect(result).toBe(142863718918201)
    })
})
