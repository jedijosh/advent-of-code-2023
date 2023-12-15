const index = require('../index.js')

test('result should be 35 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./tests/data/input.txt')
    expect(partOneAnswer).toBe(35)
})

test('result should be 340994526 with my data', async () => {
    let partOneAnswer = await index.solvePartOne('./input.txt')
    expect(partOneAnswer).toBe(340994526)
})

// test('part 2 result should be 63307 with my data', async () => {
//     let partTwoAnswer = await index.solvePartTwo('./input.txt')
//     expect(partTwoAnswer).toBe(63307)
// })
