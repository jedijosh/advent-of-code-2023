const index = require('../index.js')

test('result should be 2 with sample data', async () => {
    let answer = await index.solvePartOne('./tests/data/input.txt')
    expect(answer).toBe(2)
})

test('result should be 6 with sample data set 2', async () => {
    let answer = await index.solvePartOne('./tests/data/input2.txt')
    expect(answer).toBe(6)
})

test('part 1 result should be 19667 with my data', async () => {
    let answer = await index.solvePartOne('./input.txt')
    expect(answer).toBe(19667)
})

describe('doAllLocationsEndInZ', () => {
    test('doAllLocationsEndInZ should return false when 1 location does not end in Z', async () => {
        let answer = await index.doAllLocationsEndInZ(['AAZ', 'BCZ', 'ZZA'])
        expect(answer).toBe(false)
    })

    test('doAllLocationsEndInZ should return true when all locations end in Z', async () => {
        let answer = await index.doAllLocationsEndInZ(['AAZ', 'BCZ', 'ZZZ'])
        expect(answer).toBe(true)
    })    
})

test('part 2 result should be 6 with sample data', async () => {
    let answer = await index.solvePartTwo('./tests/data/input3.txt')
    expect(answer).toBe(6)
})

// test('part 2 result should be 6839 with sample data set 2', async () => {
//     let answer = await index.solvePartTwo('./tests/data/input2.txt')
//     expect(answer).toBe(6839)
// })

test('part 2 result should be 19185263738117 with my data', async () => {
    let answer = await index.solvePartTwo('./input.txt')
    expect(answer).toBe(19185263738117)
})
