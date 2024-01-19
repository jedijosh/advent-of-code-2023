const index = require('../index.js')
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day14'

test('part 1 result should be 136 with sample data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(136)
})

test('part 1 result should be 110779 with actual data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(result).toBe(110779)
})

test('part 2 result should be 64 with sample data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data/tests/input.txt', 1000)
    expect(result).toBe(64)
})

test('part 2 result should be 86069 with actual data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data//input.txt', 1000)
    expect(result).toBe(86069)
})

