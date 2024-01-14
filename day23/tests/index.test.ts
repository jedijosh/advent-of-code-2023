import { solvePartOne, solution } from '../src/index'

const testDataFolder = '../../advent-of-code-2023-data/day23/data'
describe('test solvePartOne', () => {
    it('result should be 94 with sample data', async () => {
        let partOneAnswer = await solvePartOne(testDataFolder + '/tests/input.txt')
        expect(partOneAnswer).toBe(94)
    })
    
    test('result should be 2106 with my data', async () => {
        let partOneAnswer = await solvePartOne(testDataFolder + '/input.txt')
        expect(partOneAnswer).toBe(2106)
    })
    
    test('part 2 result should be 154 with sample data', async () => {
        let partTwoAnswer = await solution(testDataFolder +'/tests/input.txt')
        expect(partTwoAnswer).toBe(154)
    })
    
    test('part 2 result should be 6350 with my data', async () => {
        let partTwoAnswer = await solution(testDataFolder + '/input.txt')
        expect(partTwoAnswer).toBe(6350)
    })
})
