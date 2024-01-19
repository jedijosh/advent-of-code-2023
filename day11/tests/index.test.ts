import { solvePartOne, solvePartTwo } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day11'

describe('test solvePartOne', () => {
    it('result should be 374 with sample data', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(374)
    })

    test('result should be 9370588 with my data', async () => {
        let result = await solvePartOne(dataFolder + '/data/input.txt')
        expect(result).toBe(9370588)
    })
    
    // test('part 2 result should be 8410 with sample data', async () => {
    //     let result = await solvePartTwo(dataFolder + '/data/tests/input-part2.txt')
    //     expect(result).toBe(8410)
    // })
    
    test('part 2 result should be 746207878188 with my data', async () => {
        let result = await solvePartTwo(dataFolder + '/data/input.txt')
        expect(result).toBe(746207878188)
    })
})