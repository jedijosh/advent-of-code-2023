import { solvePartOne, solvePartTwo } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 19114 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt')
        expect(partOneAnswer).toBe(19114)
    })
    
    test('result should be 432788 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt')
        expect(partOneAnswer).toBe(432788)
    })
    
    test('part 2 result should be 167409079868000 with sample data', async () => {
        let partTwoAnswer = await solvePartTwo('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(167409079868000)
    })
    
    // test('part 2 result should be 77366737561114 with my data', async () => {
    //     let partTwoAnswer = await solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(77366737561114)
    // })
})
