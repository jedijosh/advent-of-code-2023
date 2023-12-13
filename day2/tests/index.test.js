const index = require('../index.js')

test('result should be 8 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./testInput.txt')
    expect(partOneAnswer).toBe(8)
})

test('result should be 2416 with my data', async () => {
    let partOneAnswer = await index.solvePartOne('./input.txt')
    expect(partOneAnswer).toBe(2416)
})

test('part 2 result should be 63307 with my data', async () => {
    let partTwoAnswer = await index.solvePartTwo('./input.txt')
    expect(partTwoAnswer).toBe(63307)
})
