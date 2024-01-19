import { solvePartOne, solvePartTwo } from '../src/index'

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day9'

describe('test solvePartOne', () => {
    it('result should be 114 with sample data', async () => {
        let answer = await solvePartOne(dataFolder + '/data/tests/input.txt')
        expect(answer).toBe(114)
    })
    
    test('result should be 1884768153 with my data', async () => {
        let answer = await solvePartOne(dataFolder + '/data/input.txt')
        expect(answer).toBe(1884768153)
    })   
})

describe('test solvePartOne', () => {
    test('part 2 result should be 2 with sample data', async () => {
        let answer = await solvePartTwo(dataFolder + '/data/tests/input.txt')
        expect(answer).toBe(2)
    })
    
    test('part 2 result should be 8231 with my data', async () => {
        let answer = await solvePartTwo(dataFolder + '/data/input.txt')
        expect(answer).toBe(1031)
    })
})
