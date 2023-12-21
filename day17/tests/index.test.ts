import { solvePartOne } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 102 with sample data', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input.txt', 1)
        expect(partOneAnswer).toBe(102)
    })

    it('result should be 6 with sample data 2', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input2.txt', 1)
        expect(partOneAnswer).toBe(6)
    })

    it('result should be 9 with sample data 3', async () => {
        let partOneAnswer = await solvePartOne('./tests/data/input3.txt', 1)
        expect(partOneAnswer).toBe(9)
    })
    
    // test('result should be 1076 with my data', async () => {
    //     let partOneAnswer = await solvePartOne('./input.txt')
    //     expect(partOneAnswer).toBe(1076)
    // })
    
    test('part 2 result should be 94 with sample data', async () => {
        let partTwoAnswer = await solvePartOne('./tests/data/input.txt', 2)
        expect(partTwoAnswer).toBe(94)
    })
    
    // test('part 2 result should be 8231 with my data', async () => {
    //     let partTwoAnswer = await index.solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(8231)
    // })
})
