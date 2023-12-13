const index = require('../index.js')

test('result should be 8 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne()
    expect(partOneAnswer).toBe(8)
})

test.only('result should be 2416 with my data', async () => {
    let partOneAnswer = await index.solvePartOne()
    expect(partOneAnswer).toBe(2416)
})