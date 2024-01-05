import { solution } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 94 with sample data', async () => {
        let partOneAnswer = await solution('./tests/data/input.txt', 1)
        expect(partOneAnswer).toBe(94)
    })
    
    test('result should be 2106 with my data', async () => {
        let partOneAnswer = await solution('./input.txt', 1)
        expect(partOneAnswer).toBe(2106)
    })
    
    test('part 2 result should be 154 with sample data', async () => {
        let partTwoAnswer = await solution('./tests/data/input.txt', 2)
        expect(partTwoAnswer).toBe(154)
    })
    
    // test('part 2 result should be 8231 with my data', async () => {
    //     let partTwoAnswer = await solution('./input.txt', 2)
    //     expect(partTwoAnswer).toBe(8231)
    // })
})
