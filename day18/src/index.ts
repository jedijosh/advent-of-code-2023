import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = false

export async function solvePartOne ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let perimeter: number = 0
    let verticies: Array<{x: number, y: number}> = new Array()

    let currentLocation = {x: 0, y: 0}
    for (let line of fileLines) {
        let splitString = line.split(' ')
        console.log('splitString', splitString)
        let direction = splitString[0]
        let magnitude: number = Number(splitString[1])
        let newX: number = currentLocation.x
        let newY: number = currentLocation.y
        switch(direction) {
            case 'U':
                newY = currentLocation.y + magnitude
                currentLocation.y = newY
                break
            case 'D':
                newY = currentLocation.y - magnitude
                currentLocation.y = newY
                break
            case 'L':
                newX = currentLocation.x - magnitude
                currentLocation.x = newX
                break
            case 'R':
                newX = currentLocation.x + magnitude
                currentLocation.x = newX
                break
        }
        verticies.push({x: newX, y: newY})
        perimeter += magnitude
    }
    let area: number = await findAreaUsingVerticies(verticies.reverse())
    // Once you have the area, use Pick's theorum to find how many interior points exist
    let numberOfInteriorPoints: number = area + 1 - ( (perimeter) / 2) 

    // if (LOGGING) for (let vertex of verticies) console.log(vertex)
    console.log(`Perimeter: ${perimeter}, area: ${area}, number of interior points: ${numberOfInteriorPoints}`)
    return numberOfInteriorPoints + perimeter

}

export async function solvePartTwo ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let perimeter: number = 0
    let verticies: Array<{x: number, y: number}> = new Array()

    let currentLocation = {x: 0, y: 0}
    for (let line of fileLines) {
        let splitString = line.split(' ')
        let direction
        // 0 means R, 1 means D, 2 means L, and 3 means U.
        switch(splitString[2].substring(7,8)) {
            case '0':
                direction = 'R'
                break
            case '1':
                direction = 'D'
                break
            case '2':
                direction = 'L'
                break   
            case '3':
                direction = 'U'
                break
        }
        let magnitude: number = parseInt(splitString[2].substring(2,7), 16)
        let newX: number = currentLocation.x
        let newY: number = currentLocation.y
        switch(direction) {
            case 'U':
                newY = currentLocation.y + magnitude
                currentLocation.y = newY
                break
            case 'D':
                newY = currentLocation.y - magnitude
                currentLocation.y = newY
                break
            case 'L':
                newX = currentLocation.x - magnitude
                currentLocation.x = newX
                break
            case 'R':
                newX = currentLocation.x + magnitude
                currentLocation.x = newX
                break
        }
        verticies.push({x: newX, y: newY})
        perimeter += magnitude
    }
    let area: number = await findAreaUsingVerticies(verticies.reverse())
    // Once you have the area, use Pick's theorum to find how many interior points exist
    let numberOfInteriorPoints: number = area + 1 - ( (perimeter) / 2) 

    // if (LOGGING) for (let vertex of verticies) console.log(vertex)
    console.log(`Perimeter: ${perimeter}, area: ${area}, number of interior points: ${numberOfInteriorPoints}`)
    return numberOfInteriorPoints + perimeter

}

export async function findAreaUsingVerticies (verticies: Array<{x: number, y: number}>) {
    // Implements the Shoelace formula
    // Verticies need to be counter-clockwise on x, y chart
    let area: number = 0
    let j = verticies.length - 1
    if (LOGGING) for (let vertex of verticies) console.log(vertex)
    for (let i = 0; i < verticies.length; i++) {
        area += (verticies[j].x + verticies[i].x) * (verticies[j].y - verticies[i].y)
        j = i
    }
    return Math.abs(area / 2.0);
}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day18/tests/data/input.txt', 1)
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day18/input.txt', 1)
    // .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day18/tests/data/input.txt')
solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day18/input.txt')
.then(answer => console.log('answer:', answer))