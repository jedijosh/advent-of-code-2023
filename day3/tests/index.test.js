const index = require('../index.js')

test('part 1 result should be 4361 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./tests/data/input.txt')
    expect(partOneAnswer).toBe(4361)
})

test('part 1 result should be 529618 with actual data', async () => {
    let partOneAnswer = await index.solvePartOne('./input.txt')
    expect(partOneAnswer).toBe(529618)
})


// test('part 2 result should be 400 with sample data', async () => {
//     let partTwoAnswer = await index.solvePartTwo('./tests/data/input.txt')
//     expect(partTwoAnswer).toBe(400)
// })
