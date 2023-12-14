const index = require('../index.js')

test('part 1 result should be 136 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./tests/data/input.txt')
    expect(partOneAnswer).toBe(136)
})

test('part 1 result should be 110779 with actual data', async () => {
    let partOneAnswer = await index.solvePartOne('./input.txt')
    expect(partOneAnswer).toBe(110779)
})

test('part 2 result should be 64 with sample data', async () => {
    let partTwoAnswer = await index.solvePartTwo('./tests/data/input.txt', 1000)
    expect(partTwoAnswer).toBe(64)
})

test('part 2 result should be 86069 with actual data', async () => {
    let partTwoAnswer = await index.solvePartTwo('./input.txt', 1000)
    expect(partTwoAnswer).toBe(86069)
})

