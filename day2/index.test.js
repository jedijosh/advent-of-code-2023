const index = require('../index')

test('result should be 8 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne()
    expect(partOneAnswer).toBe(8)
})