const solution = require('../solution')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day1'

test('part one solution matches with sample data', async () => {
    expect(await solution.solvePartOne(dataFolder + '/data/tests/part1.txt')).toBe(142)
})

test('part one solution matches', async () => {
    expect(await solution.solvePartOne(dataFolder + '/data/input.txt')).toBe(54239)
})

test('part two solution matches with sample data', async () => {
    expect(await solution.solvePartTwo(dataFolder + '/data/tests/part2.txt')).toBe(281)
})

test('part two solution matches with actual data', async () => {
    expect(await solution.solvePartTwo(dataFolder + '/data/input.txt')).toBe(55343)
})

test('text replacement works on line 1', async () => {
    expect(await solution.replaceTextWithNumbers('two1nine')).toBe('219')
})

test('text replacement works on line 2', async () => {
    expect(await solution.replaceTextWithNumbers('eightwothree')).toBe('823')
})

test('text replacement works for one', async () => {
    expect(await solution.replaceTextWithNumbers('one')).toBe('1')
})

test('text replacement works for two', async () => {
    expect(await solution.replaceTextWithNumbers('two')).toBe('2')
})

test('text replacement works for three', async () => {
    expect(await solution.replaceTextWithNumbers('three')).toBe('3')
})

test('text replacement works for four', async () => {
    expect(await solution.replaceTextWithNumbers('four')).toBe('4')
})

test('text replacement works for five', async () => {
    expect(await solution.replaceTextWithNumbers('five')).toBe('5')
})

test('text replacement works for six', async () => {
    expect(await solution.replaceTextWithNumbers('six')).toBe('6')
})

test('text replacement works for seven', async () => {
    expect(await solution.replaceTextWithNumbers('seven')).toBe('7')
})

test('text replacement works for eight', async () => {
    expect(await solution.replaceTextWithNumbers('eight')).toBe('8')
})

test('text replacement works for nine', async () => {
    expect(await solution.replaceTextWithNumbers('nine')).toBe('9')
})
