import path from 'path'
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

export async function solvePartTwo ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)
    let numberOfCombinations: number = 0

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

    // Start at in.
    // Keep track of path.
    // Push each new path onto stack
    // If nextStep is 'A', keep track of how you got there
    // Perhaps track the min and max of each xmas value as you go to the next step?
    // let paths: Array<{currentWorkflow: string, visitedWorkflows: Array<string>}> = new Array()
    let paths: Array<{currentWorkflow: string, ruleNumber: number, visitedWorkflows: Array<string>, possibleValues: Map<string, {min: number, max: number}>}> = new Array()
    let acceptedPaths: Array<string> = new Array()
    let beginningMap: Map<string, {min: number, max: number}> = new Map()
    beginningMap.set('x', {min: 1, max: 4000})
    beginningMap.set('m', {min: 1, max: 4000})
    beginningMap.set('a', {min: 1, max: 4000})
    beginningMap.set('s', {min: 1, max: 4000})
    paths.push({currentWorkflow: 'in', ruleNumber: 0, visitedWorkflows: [], possibleValues: beginningMap})
    while(paths.length > 0) {
        let currentPath = paths.shift()
        if (!currentPath) break
        let currentWorkflow = workflows.get(currentPath.currentWorkflow)
        if (!currentWorkflow) break
        
        let workflowRule = currentWorkflow[currentPath.ruleNumber]
        console.log('--------------------------')
        console.log(`at ${currentPath.currentWorkflow}, # ${currentPath.ruleNumber}.`)
        console.log('workflowRule', workflowRule)
        // Add one path where this step evaluates to true
        let currentPathTrueCopy = {...currentPath}
        currentPathTrueCopy.possibleValues = new Map(currentPath.possibleValues)
        let currentPathFalseCopy = {...currentPath}
        currentPathFalseCopy.possibleValues = new Map(currentPath.possibleValues)

        if (workflowRule.nextStep === 'R' || currentPathTrueCopy.visitedWorkflows.includes(workflowRule.nextStep)) {
            // Path leads to rejection or has already been visited
        } else {
            let currentMinValue = currentPathTrueCopy.possibleValues.get(workflowRule.comparison.property)?.min
            let currentMaxValue = currentPathTrueCopy.possibleValues.get(workflowRule.comparison.property)?.max
            if (!currentMaxValue) break
            if (!currentMinValue) break
            
            // Hack to workaround my handling when there is no comparison
            if (workflowRule.comparison.numberToCompare !== 0) {
                switch(workflowRule.comparison.operator) {
                    case '<':
                        console.log('True path - adjusting max')
                        currentPathTrueCopy.possibleValues.set(workflowRule.comparison.property, {min: currentMinValue, max: Math.min(currentMaxValue, workflowRule.comparison.numberToCompare - 1)})
                        break
                    default:
                        console.log('True path - adjusting min')
                        currentPathTrueCopy.possibleValues.set(workflowRule.comparison.property, {min: Math.max(currentMinValue, workflowRule.comparison.numberToCompare + 1) , max: currentMaxValue})
                }
            }
            console.log(currentPathTrueCopy.possibleValues)
            
            let newVisitedArray = currentPathTrueCopy.visitedWorkflows.slice()
            newVisitedArray.push(currentPathTrueCopy.currentWorkflow + currentPathTrueCopy.ruleNumber)

            if (workflowRule.nextStep === 'A' && !acceptedPaths.includes(newVisitedArray.flat().toString())) {
                acceptedPaths.push(newVisitedArray.flat().toString())
                console.log('accepted paths', acceptedPaths)
                console.log('path', currentPathTrueCopy.visitedWorkflows)
                console.log('current workflow', currentPathTrueCopy.currentWorkflow)
                // Path leads to acceptance.  Figure out which combinations can get you there
                let pathCombinations: number = 1
                currentPathTrueCopy.possibleValues.forEach(value => {
                    console.log('value', value)
                    pathCombinations *= (value.max - value.min + 1)
                })
                numberOfCombinations += pathCombinations
                console.log(`***** Path ${newVisitedArray.flat().toString()} has ${pathCombinations} combinations`)
            } else {
                console.log(`at ${currentPath.currentWorkflow}, # ${currentPath.ruleNumber}. Going to ${workflowRule.nextStep}`)
                paths.push({currentWorkflow: workflowRule.nextStep, ruleNumber: 0, visitedWorkflows: newVisitedArray, possibleValues: currentPathTrueCopy.possibleValues})
            }
            console.log(paths)
        }

        
        



        
        // Add another path where it evaluates to false
        if (workflowRule.nextStep === 'R' || currentPathFalseCopy.visitedWorkflows.includes(workflowRule.nextStep)) {
            // Path leads to rejection or has already been visited
        } else {
            let currentMinValue = currentPathFalseCopy.possibleValues.get(workflowRule.comparison.property)?.min
            let currentMaxValue = currentPathFalseCopy.possibleValues.get(workflowRule.comparison.property)?.max
            if (!currentMaxValue) break  
            if (!currentMinValue) break

            if (workflowRule.comparison.numberToCompare !== 0) {
                switch(workflowRule.comparison.operator) {
                    case '<':
                        console.log('False path - adjusting min')
                        currentPathFalseCopy.possibleValues.set(workflowRule.comparison.property, {min: Math.max(currentMinValue, workflowRule.comparison.numberToCompare) , max: currentMaxValue})    
                        currentPath.possibleValues.set(workflowRule.comparison.property, {min: Math.max(currentMinValue, workflowRule.comparison.numberToCompare) , max: currentMaxValue})    
                        break
                    default:
                        console.log('False path - adjusting max')
                        currentPathFalseCopy.possibleValues.set(workflowRule.comparison.property, {min: currentMinValue, max: Math.min(currentMaxValue, workflowRule.comparison.numberToCompare)})
                        currentPath.possibleValues.set(workflowRule.comparison.property, {min: currentMinValue, max: Math.min(currentMaxValue, workflowRule.comparison.numberToCompare)})
                }
                console.log(currentPathFalseCopy.possibleValues)
            }
            

            let newVisitedArray = currentPathFalseCopy.visitedWorkflows.slice()
            newVisitedArray.push(currentPathFalseCopy.currentWorkflow + currentPathFalseCopy.ruleNumber)

            if (workflowRule.nextStep === 'A' && !acceptedPaths.includes(newVisitedArray.flat().toString())) {
                // Path leads to acceptance.  Figure out which combinations can get you there
                acceptedPaths.push(newVisitedArray.flat().toString())
                console.log('accepted paths', acceptedPaths)
                console.log('path', currentPathFalseCopy.visitedWorkflows)
                console.log('current workflow', currentPathFalseCopy.currentWorkflow)
                let pathCombinations: number = 1
                currentPathFalseCopy.possibleValues.forEach(value => {
                    console.log('value', value)
                    pathCombinations *= (value.max - value.min + 1)
                })
                console.log(`***** Path ${newVisitedArray.flat().toString()} has ${pathCombinations} combinations`)
                numberOfCombinations += pathCombinations 
            } else {
                console.log(`at ${currentPath.currentWorkflow}, # ${currentPath.ruleNumber}. Going to next rule number ${currentPath.ruleNumber + 1}`)
                console.log(paths)
                if (currentPath.ruleNumber < currentWorkflow.length - 1) {
                    paths.push({currentWorkflow: currentPath.currentWorkflow, ruleNumber: currentPath.ruleNumber + 1, visitedWorkflows: newVisitedArray, possibleValues: currentPathFalseCopy.possibleValues})
                }
            }
        }

            
    }



    // let parts: Array<{x: number; m: number; a: number; s: number; }> = []
    // for (lineNumber = lineNumber + 1; lineNumber < fileLines.length; lineNumber++) {
    //     console.log(`processing line number ${lineNumber}`)
    //     let splitString = fileLines[lineNumber].split(',')
    //     let partMap: Map<string, number> = new Map()
    //     splitString.map(instance => partMap.set(instance.split('=')[0].replace(/\{/g, ''), parseInt(instance.split('=')[1])))
    //     if (LOGGING) console.log('partMap', partMap)
    //     let workflowName = 'in'
    //     let isNextStep = true
    //     let visitedWorkflows: Array<string> = []
    //     while (isNextStep) {
    //         visitedWorkflows.push(workflowName)
    //         if (LOGGING) console.log(`On line number ${lineNumber} and workflow name ${workflowName}`)
    //         let currentWorkflow = workflows.get(workflowName)
    //         if (!currentWorkflow) throw new Error(`Workflow ${workflowName} was not found`)
    //         for (let workflowRuleNumber = 0; workflowRuleNumber < currentWorkflow.length || 0; workflowRuleNumber++) {
    //             let workflowRule = currentWorkflow[workflowRuleNumber]
    //             if (!comparisonMap.get(workflowRule.comparison.operator)) {
    //                 continue
    //             } else {
    //                 let operationFunction: Function = comparisonMap.get(workflowRule.comparison.operator) || function() { return false }
    //                 let result: boolean = operationFunction(partMap.get(workflowRule.comparison.property), workflowRule.comparison.numberToCompare)
    //                 if (result) {
    //                     workflowName = workflowRule.nextStep
    //                     if (LOGGING) console.log(`Have result, workflowName is: ${workflowName}`)
    //                     if (workflowName === 'R' || visitedWorkflows.includes(workflowName)) {
    //                         isNextStep = false
    //                     }
    //                     if (workflowName === 'A') {
    //                         sumOfAcceptedParts += (partMap.get('x') || 0) + (partMap.get('m') || 0) + (partMap.get('a') || 0) + (partMap.get('s') || 0)
    //                         isNextStep = false
    //                     }
    //                     break
    //                 }
    //             }
    //         }
            
    //     }
    // }
    return numberOfCombinations

}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/tests/data/input.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/input.txt')
    // .then(answer => console.log('answer:', answer))

solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/tests/data/input.txt')
// solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day19/input.txt')
.then(answer => console.log('answer:', answer))