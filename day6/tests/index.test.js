const index = require('../index.js')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day6'
test('result should be 288 with sample data', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(answer).toBe(288)
})

test('result should be 2756160 with my data', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(answer).toBe(2756160)
})

test('part 2 result should be 71503 with sample data', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(answer).toBe(71503)
})

test('part 2 result should be 34788142 with my data', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(answer).toBe(34788142)
})
