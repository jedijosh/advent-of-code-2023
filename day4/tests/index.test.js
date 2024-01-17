const index = require('../index.js')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day4'

test('part 1 result should be 13 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(partOneAnswer).toBe(13)
})

test('part 1 result should be 23235 with actual data', async () => {
    let partOneAnswer = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(partOneAnswer).toBe(23235)
})

test('part 2 result should be 30 with sample data', async () => {
    let partTwoAnswer = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(partTwoAnswer).toBe(30)
})

test('part 2 result should be 5920640 with actual data', async () => {
    let partTwoAnswer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(partTwoAnswer).toBe(5920640)
})
