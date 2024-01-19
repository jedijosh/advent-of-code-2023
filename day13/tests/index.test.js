const index = require('../index.js')
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day13'

test('part 1 result should be 405 with sample data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(405)
})

test('part 2 result should be 400 with sample data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(400)
})
