import { solvePartOne, solvePartTwo, findNextDirection } from '../src/index'
const dataFolder = '/mnt/c/Users/joshs/code/advent-of-code-2023-data/day10'

describe('test solvePartOne', () => {
    it('result should be 8 with sample data', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input.txt')
        expect(result).toBe(8)
    })

    it('result should be 4 with sample data 2', async () => {
        let result = await solvePartOne(dataFolder + '/data/tests/input2.txt')
        expect(result).toBe(4)
    })

    test('result should be 6828 with my data', async () => {
        let partOneAnswer = await solvePartOne(dataFolder + '/data/input.txt')
        expect(partOneAnswer).toBe(6828)
    })
    
    test('part 2 result should be 4 with sample data', async () => {
        let partTwoAnswer = await solvePartOne(dataFolder + '/data/tests/input-part2.txt')
        expect(partTwoAnswer).toBe(4)
    })
    
    test('part 2 result should be 459 with my data', async () => {
        let partTwoAnswer = await solvePartTwo(dataFolder + '/data/input.txt')
        expect(partTwoAnswer).toBe(459)
    })
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
