const index = require('../index.js')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day4'

test('result should be 35 with sample data', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(answer).toBe(35)
})

test('result should be 340994526 with my data', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(answer).toBe(340994526)
})

test('part 2 result should be 46 with sample data', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(answer).toBe(46)
})

test('part 2 result should be 52210644 with my data', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(answer).toBe(52210644)
})
