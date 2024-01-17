const index = require('../index.js')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day2'
test('result should be 8 with sample data', async () => {
    let partOneAnswer = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(partOneAnswer).toBe(8)
})

test('result should be 2416 with my data', async () => {
    let partOneAnswer = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(partOneAnswer).toBe(2416)
})

test('part 2 result should be 63307 with my data', async () => {
    let partTwoAnswer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(partTwoAnswer).toBe(63307)
})
