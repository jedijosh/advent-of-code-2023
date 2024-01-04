const fs = require('node:fs/promises')

export async function parseFileIntoArrayOfLines ( filename : any) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()

    return fileInput.trim().split('\n')
}

export async function findLowestCommonMultiple ( arrayOfNumbers: Array<number> ): Promise<number> {
    // Sort so the numbers are in descending order
    arrayOfNumbers.sort((a,b) => b - a)
    let allNumbersDivisible = false
    let multiple = 1
    let largestNumber = arrayOfNumbers[0]
    let largestNumberIteration = 0
    while (!allNumbersDivisible) {
        // console.log(`on multiple ${multiple}`)
        if (multiple % 100000000 === 0 ) console.log(`on multiple ${multiple}`)
        largestNumberIteration = largestNumber * multiple
        multiple++
        allNumbersDivisible = true
        for (let i = 1; i < arrayOfNumbers.length; i++) {
            allNumbersDivisible = (largestNumberIteration % arrayOfNumbers[i] === 0) ? true : false
            if (!allNumbersDivisible) break
        }
    }   
    return largestNumberIteration
}
