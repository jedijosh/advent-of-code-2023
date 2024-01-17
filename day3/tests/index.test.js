const index = require('../index.js')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day3'

test('part 1 result should be 4361 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(partOneAnswer).toBe(4361)
})

test('part 1 result should be 529618 with actual data', async () => {
    let partOneAnswer = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(partOneAnswer).toBe(529618)
})

test('part 2 result should be 467835 with sample data', async () => {
    let partTwoAnswer = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(partTwoAnswer).toBe(467835)
})

test('part 2 result should be 77509019 with actual data', async () => {
    let partTwoAnswer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(partTwoAnswer).toBe(77509019)
})
