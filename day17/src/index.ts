import { parseFileIntoArrayOfLines } from './utils'

export async function solvePartOne ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    console.log(fileLines)
}

solvePartOne('./tests/data/input.txt')
    .then(answer => console.log('answer:', answer))