const index = require('../index.js')

test('result should be 6440 with sample data', async () => {
    let answer = await index.solvePartOne('./tests/data/input.txt')
    expect(answer).toBe(6440)
})

test('result should be 6592 with sample data set 2', async () => {
    let answer = await index.solvePartOne('./tests/data/input2.txt')
    expect(answer).toBe(6592)
})

test('part 1 result should be 246409899 with my data', async () => {
    let answer = await index.solvePartOne('./input.txt')
    expect(answer).toBe(246409899)
})

// test('part 2 result should be 71503 with sample data', async () => {
//     let answer = await index.solvePartTwo('./tests/data/input.txt')
//     expect(answer).toBe(71503)
// })

// test('part 2 result should be 6839 with sample data set 2', async () => {
//     let answer = await index.solvePartTwo('./tests/data/input2.txt')
//     expect(answer).toBe(6839)
// })

// test('part 2 result should be 34788142 with my data', async () => {
//     let answer = await index.solvePartTwo('./input.txt')
//     expect(answer).toBe(34788142)
// })
