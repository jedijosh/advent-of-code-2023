const index = require('../index.js')
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day15'

test('result should be 1320 with sample data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(1320)
})

test('result should be 521341 with my data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(result).toBe(521341)
})

test('part 2 result should be 145 with my data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(145)
})

test('part 2 result should be 252782 with my data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(result).toBe(252782)
})
