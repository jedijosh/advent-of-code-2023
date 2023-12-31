import { parseFileIntoArrayOfLines } from './utils'

const LOGGING = false

export async function solvePartOne ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let sumOfAcceptedParts: number = 0

    let lineNumber = 0
    let workflows: Map<string, Array<{comparison: {property: string, operator: string, numberToCompare: number}, nextStep: string}>> = new Map()
    while (fileLines[lineNumber].trim() !== '') {
        let workflowKey = fileLines[lineNumber].substring(0, fileLines[lineNumber].indexOf('{'))
        let workflowRulesString = fileLines[lineNumber].substring(fileLines[lineNumber].indexOf('{') + 1, fileLines[lineNumber].length - 2)
        let workflowRules = workflowRulesString.split(',')
        let workflowRulesArray: Array<{comparison: {property: string, operator: string, numberToCompare: number}, nextStep: string}> = []
        for (let rule of workflowRules) {
            let splitString = rule.split(':')
            if (splitString.length === 1) {
                // Represents a rule which doesn't have a comparison.  
                // Set to something which will always be true.
                workflowRulesArray.push({comparison: {property: 'x', operator: '>', numberToCompare: 0}, nextStep: splitString[0]})    
            } else {
                workflowRulesArray.push({comparison: {
                    property: splitString[0].substring(0,1), 
                    operator: splitString[0].substring(1,2),
                    numberToCompare: parseInt(splitString[0].substring(2))
                }, nextStep: splitString[1]})
            }
            
        }
        workflows.set(workflowKey, workflowRulesArray)
        lineNumber++
    }

    if (LOGGING) console.log('workflows', workflows)
    let comparisonMap: Map<string, Function> = new Map()
    comparisonMap.set('<', function(a: number, b: number) {return a < b })
    comparisonMap.set('>', function(a: number, b: number) {return a > b })

    let parts: Array<{x: number; m: number; a: number; s: number; }> = []
    for (lineNumber = lineNumber + 1; lineNumber < fileLines.length; lineNumber++) {
        console.log(`processing line number ${lineNumber}`)
        let splitString = fileLines[lineNumber].split(',')
        let partMap: Map<string, number> = new Map()
        splitString.map(instance => partMap.set(instance.split('=')[0].replace(/\{/g, ''), parseInt(instance.split('=')[1])))
        if (LOGGING) console.log('partMap', partMap)
        let workflowName = 'in'
        let isNextStep = true
        let visitedWorkflows: Array<string> = []
        while (isNextStep) {
            visitedWorkflows.push(workflowName)
            if (LOGGING) console.log(`On line number ${lineNumber} and workflow name ${workflowName}`)
            let currentWorkflow = workflows.get(workflowName)
            if (!currentWorkflow) throw new Error(`Workflow ${workflowName} was not found`)
            for (let workflowRuleNumber = 0; workflowRuleNumber < currentWorkflow.length || 0; workflowRuleNumber++) {
                let workflowRule = currentWorkflow[workflowRuleNumber]
                if (!comparisonMap.get(workflowRule.comparison.operator)) {
                    continue
                } else {
                    let operationFunction: Function = comparisonMap.get(workflowRule.comparison.operator) || function() { return false }
                    let result: boolean = operationFunction(partMap.get(workflowRule.comparison.property), workflowRule.comparison.numberToCompare)
                    if (result) {
                        workflowName = workflowRule.nextStep
                        if (LOGGING) console.log(`Have result, workflowName is: ${workflowName}`)
                        if (workflowName === 'R' || visitedWorkflows.includes(workflowName)) {
                            isNextStep = false
                        }
                        if (workflowName === 'A') {
                            sumOfAcceptedParts += (partMap.get('x') || 0) + (partMap.get('m') || 0) + (partMap.get('a') || 0) + (partMap.get('s') || 0)
                            isNextStep = false
                        }
                        break
                    }
                }
            }
            
        }
    }
    return sumOfAcceptedParts

}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/tests/data/input.txt')
solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/input.txt')
    .then(answer => console.log('answer:', answer))

// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/input.txt')
// .then(answer => console.log('answer:', answer))