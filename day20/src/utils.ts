const fs = require('node:fs/promises')

export async function parseFileIntoArrayOfLines ( filename : any) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    file.close()

    return fileInput.trim().split('\n')
}
