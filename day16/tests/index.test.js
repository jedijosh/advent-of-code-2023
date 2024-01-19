const index = require('../index.js')
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day16'

test('result should be 46 with sample data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(46)
})

test('result should be 7543 with my data', async () => {
    let result = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(result).toBe(7543)
})

test('part 2 result should be 51 with my data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(result).toBe(51)
})

test('part 2 result should be 8231 with my data', async () => {
    let result = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(result).toBe(8231)
})
