const index = require('../index.js')

test('result should be 46 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./tests/data/input.txt')
    expect(partOneAnswer).toBe(46)
})

test('result should be 7543 with my data', async () => {
    let partOneAnswer = await index.solvePartOne('./input.txt')
    expect(partOneAnswer).toBe(7543)
})

test('part 2 result should be 51 with my data', async () => {
    let partTwoAnswer = await index.solvePartTwo('./tests/data/input.txt')
    expect(partTwoAnswer).toBe(51)
})

test('part 2 result should be 8231 with my data', async () => {
    let partTwoAnswer = await index.solvePartTwo('./input.txt')
    expect(partTwoAnswer).toBe(8231)
})
