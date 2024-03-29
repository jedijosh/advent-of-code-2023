import {expect, test} from '@jest/globals'
const index = require('../index.js')

const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day7'

test('result should be 6440 with sample data', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/tests/input.txt')
    expect(answer).toBe(6440)
})

test('result should be 6592 with sample data set 2', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/tests/input2.txt')
    expect(answer).toBe(6592)
})

test('part 1 result should be 246409899 with my data', async () => {
    let answer = await index.solvePartOne(dataFolder + '/data/input.txt')
    expect(answer).toBe(246409899)
})

test('part 2 result should be 5905 with sample data', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/tests/input.txt')
    expect(answer).toBe(5905)
})

test('part 2 result should be 6839 with sample data set 2', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/tests/input2.txt')
    expect(answer).toBe(6839)
})

test('part 2 result should be 244848487 with my data', async () => {
    let answer = await index.solvePartTwo(dataFolder + '/data/input.txt')
    expect(answer).toBe(244848487)
})

describe('five of a kind', () => {
    test('part 2 - five of a kind with 4 cards and 1 joker', async () => {
        let answer = await index.isFiveOfAKind([{ "label":"Q", count:4 },{ "label":"J", count:1 }], 1)
        expect(answer).toBe(true)
    })
    
    test('part 2 - five of a kind with 4 jokers and 1 card', async () => {
        let answer = await index.isFiveOfAKind([{ "label":"J", count:4 },{ "label":"Q", count:1 }], 4)
        expect(answer).toBe(true)
    })
    
    test('part 2 - five of a kind with 5 jokers', async () => {
        let answer = await index.isFiveOfAKind([{ "label":"J", count:5 }], 5)
        expect(answer).toBe(true)
    })
    
    test('part 2 - five of a kind with 5 other cards', async () => {
        let answer = await index.isFiveOfAKind([{ "label":"4", count:5 }], 0)
        expect(answer).toBe(true)
    })
})




describe('four of a kind', () => {
    test('part 2 - four of a kind with 3 cards and 1 joker', async () => {
        let answer = await index.isFourOfAKind([{ "label":"Q","count":3 },{ "label":"2", count:1 },{ "label":"J","count":1 }], 1)
        expect(answer).toBe(true)
    })
    
    test('part 2 - four of a kind with 3 jokers and 1 card', async () => {
        let answer = await index.isFourOfAKind([{ "label":"J","count":3 },{ "label":"Q", count:1 },{ "label":"4","count":1 }], 3)
        expect(answer).toBe(true)
    })
    
    test('part 2 - four of a kind with 4 jokers', async () => {
        let answer = await index.isFourOfAKind([{ "label":"J", count:4 },{ "label":"4", count:1 }], 4)
        expect(answer).toBe(true)
    })
    
    test('part 2 - four of a kind with 4 other cards', async () => {
        let answer = await index.isFourOfAKind([{ "label":"4","count":4 },{ "label":"3", count:1 }], 0)
        expect(answer).toBe(true)
    })
})
