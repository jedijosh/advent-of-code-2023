const index = require('../index.js')

test('part 1 result should be 13 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./tests/data/input.txt')
    expect(partOneAnswer).toBe(13)
})

test('part 1 result should be 23235 with actual data', async () => {
    let partOneAnswer = await index.solvePartOne('./input.txt')
    expect(partOneAnswer).toBe(23235)
})

test('part 2 result should be 30 with sample data', async () => {
    let partTwoAnswer = await index.solvePartTwo('./tests/data/input.txt')
    expect(partTwoAnswer).toBe(30)
})

// test('part 2 result should be 77509019 with actual data', async () => {
//     let partTwoAnswer = await index.solvePartTwo('./input.txt')
//     expect(partTwoAnswer).toBe(77509019)
// })
