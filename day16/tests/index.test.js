const index = require('../index.js')

test('result should be 46 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne('./tests/data/input.txt')
    expect(partOneAnswer).toBe(46)
})

// test('result should be 521341 with my data', async () => {
//     let partOneAnswer = await index.solvePartOne('./input.txt')
//     expect(partOneAnswer).toBe(521341)
// })

// test('part 2 result should be 145 with my data', async () => {
//     let partTwoAnswer = await index.solvePartTwo('./tests/data/input.txt')
//     expect(partTwoAnswer).toBe(145)
// })

// test('part 2 result should be 252782 with my data', async () => {
//     let partTwoAnswer = await index.solvePartTwo('./input.txt')
//     expect(partTwoAnswer).toBe(252782)
// })
