import { solvePartOne, solution } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 94 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt', 7 , 27)
        expect(partOneAnswer).toBe(94)
    })
    
    test('result should be 12783 with my data', async () => {
        let partOneAnswer = await solvePartOne('./input.txt', 200000000000000, 400000000000000)
        expect(partOneAnswer).toBe(12783)
    })
    
    test('part 2 result should be 154 with sample data', async () => {
        let partTwoAnswer = await solution('./tests/data/input.txt')
        expect(partTwoAnswer).toBe(154)
    })
    
    // test('part 2 result should be 6350 with my data', async () => {
    //     let partTwoAnswer = await solution('./input.txt')
    //     expect(partTwoAnswer).toBe(6350)
    // })
})
