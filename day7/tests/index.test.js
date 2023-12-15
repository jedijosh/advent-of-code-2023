const index = require('../index.js')

test('result should be 6440 with sample data', async () => {
    let answer = await index.solvePartOne('./tests/data/input.txt')
    expect(answer).toBe(6440)
})

// test('result should be 2756160 with my data', async () => {
//     let answer = await index.solvePartOne('./input.txt')
//     expect(answer).toBe(2756160)
// })

// test('part 2 result should be 71503 with sample data', async () => {
//     let answer = await index.solvePartTwo('./tests/data/input.txt')
//     expect(answer).toBe(71503)
// })

// test('part 2 result should be 34788142 with my data', async () => {
//     let answer = await index.solvePartTwo('./input.txt')
//     expect(answer).toBe(34788142)
// })
