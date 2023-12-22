import { solvePartOne, findNextDirection } from '../src/index'

describe('test solvePartOne', () => {
    it('result should be 8 with sample data', async () => {
        let result = await solvePartOne('./tests/data/input.txt')
        expect(result).toBe(8)
    })

    it('result should be 4 with sample data 2', async () => {
        let result = await solvePartOne('./tests/data/input2.txt')
        expect(result).toBe(4)
    })

    // it('result should be 9 with sample data 3', async () => {
    //     let partOneAnswer = await solvePartOne('./tests/data/input3.txt')
    //     expect(partOneAnswer).toBe(9)
    // })
    
    // test('result should be 6828 with my data', async () => {
    //     let partOneAnswer = await solvePartOne('./input.txt')
    //     expect(partOneAnswer).toBe(6828)
    // })
    
    // test('part 2 result should be 94 with sample data', async () => {
    //     let partTwoAnswer = await solvePartOne('./tests/data/input.txt')
    //     expect(partTwoAnswer).toBe(94)
    // })
    
    // test('part 2 result should be 8231 with my data', async () => {
    //     let partTwoAnswer = await index.solvePartTwo('./input.txt')
    //     expect(partTwoAnswer).toBe(8231)
    // })
})

describe('test findNextDirection', () => {
    it('result should be down when traveling down through a vertical pipe', async () => {
        let result = await findNextDirection('|', 'D')
        expect(result).toBe('D')
    })

    it('result should be up when traveling up through a vertical pipe', async () => {
        let result = await findNextDirection('|', 'U')
        expect(result).toBe('U')
    })

    it('result should be left when traveling left through a horizontal pipe', async () => {
        let result = await findNextDirection('-', 'L')
        expect(result).toBe('L')
    })

    it('result should be right when traveling right through a horizontal pipe', async () => {
        let result = await findNextDirection('-', 'R')
        expect(result).toBe('R')
    })

    // L is a 90-degree bend connecting north and east.
    it('result should be up when traveling left through an L', async () => {
        let result = await findNextDirection('L', 'L')
        expect(result).toBe('U')
    })

    it('result should be right when traveling down through an L', async () => {
        let result = await findNextDirection('L', 'D')
        expect(result).toBe('R')
    })

    // J is a 90-degree bend connecting north and west.
    it('result should be up when traveling right through an J', async () => {
        let result = await findNextDirection('J', 'R')
        expect(result).toBe('U')
    })

    it('result should be left when traveling down through an L', async () => {
        let result = await findNextDirection('J', 'D')
        expect(result).toBe('L')
    })

    // 7 is a 90-degree bend connecting south and west.
    it('result should be down when traveling right through an 7', async () => {
        let result = await findNextDirection('7', 'R')
        expect(result).toBe('D')
    })

    it('result should be left when traveling up through an 7', async () => {
        let result = await findNextDirection('7', 'U')
        expect(result).toBe('L')
    })

    // F is a 90-degree bend connecting south and east.
    it('result should be right when traveling up through an F', async () => {
        let result = await findNextDirection('F', 'R')
        expect(result).toBe('R')
    })

    it('result should be down when traveling left through an F', async () => {
        let result = await findNextDirection('F', 'L')
        expect(result).toBe('D')
    })
})






// . is ground; there is no pipe in this tile.
