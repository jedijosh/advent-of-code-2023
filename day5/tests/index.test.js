const index = require('../index.js')

test('result should be 35 with sample data', async () => {
    let answer = await index.solvePartOne('./tests/data/input.txt')
    expect(answer).toBe(35)
})

// test('result should be 340994526 with my data', async () => {
//     let answer = await index.solvePartOne('./input.txt')
//     expect(answer).toBe(340994526)
// })

test('part 2 result should be 46 with sample data', async () => {
    let answer = await index.solvePartTwo('./tests/data/input.txt')
    expect(answer).toBe(46)
})

// test('part 2 result should be 52210644 with my data', async () => {
//     let answer = await index.solvePartTwo('./input.txt')
//     expect(answer).toBe(52210644)
// })
