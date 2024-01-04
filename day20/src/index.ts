
import { parseFileIntoArrayOfLines, findLowestCommonMultiple } from './utils'

const LOGGING = false

let highPulsesSentFromConjunction: Map<string, Array<number>> = new Map()
let all4HaveSentHigh = false

class Module {
    connectedModules: Map<string, boolean>
    destinationModules: Array<string>
    name: string
    constructor(name: string, destinationModules: Array<string>, connectedModules: Map<string, boolean> = new Map()) {
        this.name = name
        this.destinationModules = destinationModules
        this.connectedModules = connectedModules
    }
}

// Flip-flop modules (prefix %) are either on or off; they are initially off. 
// If a flip-flop module receives a high pulse, it is ignored and nothing happens. 
// However, if a flip-flop module receives a low pulse, it flips between on and off. 
// If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
class FlipFlopModule extends Module {
    state: boolean
    constructor(name: string, destinationModules: Array<string>) {
        super(name, destinationModules)
        this.state = false
    }

    public processPulse(pulseType: boolean, source: string, pulseArray: Array<{destination: string, source: string, pulseType: boolean}>, numberOfButtonPushes: number) : {lowPulsesSent: number, highPulsesSent: number} {
        let lowPulsesSent = 0
        let highPulsesSent = 0

        if (LOGGING) console.log(`${this.name} Processing pulse of type ${pulseType}`)
        // If receives a low pulse, flip between on and off
        if (!pulseType) {
            // If was on, send a low pulse.  If was off, send a high pulse.
            this.state = !this.state
            for (let destination of this.destinationModules) {
                pulseArray.push({destination: destination, source: this.name, pulseType: this.state})
                this.state ? highPulsesSent++ : lowPulsesSent++
            }
        }
        // Ignores if a high pulse comes in
        if (LOGGING) console.log(`new state is: ${this.state}`)
        return { lowPulsesSent, highPulsesSent }
    }
}

// Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules; 
// they initially default to remembering a low pulse for each input. 
// When a pulse is received, the conjunction module first updates its memory for that input. 
// Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
class ConjunctionModule extends Module {
    constructor(name: string, destinationModules: Array<string>) {
       super(name, destinationModules) 
    }

    public processPulse(pulseType: boolean, source: string, pulseArray: Array<{destination: string, source: string, pulseType: boolean}>, numberOfButtonPushes: number) : {lowPulsesSent: number, highPulsesSent: number} {
        if (LOGGING) console.log(`${this.name} Processing pulse of type ${pulseType}`)
        if (LOGGING) console.log('connectedModules', this.connectedModules)
        let lowPulsesSent = 0
        let highPulsesSent = 0
        // Need to know which module sent this pulse
        this.connectedModules.set(source, pulseType)
        let allHighPulses = true
        this.connectedModules.forEach((value, key) => {
            if (!value) allHighPulses = false
        })
        // for (let connectedModule of this.connectedModules) {
        //     console.log('connectedModule', connectedModule)
        //     if (!connectedModule[1]) allHighPulses = false
        //     break
        // }
        if (allHighPulses) {
            // Send low pulse
            if (LOGGING) console.log(`Conjunction module ${this.name} is sending low pulse`)
            for (let destination of this.destinationModules) {
                pulseArray.push({destination: destination, source: this.name, pulseType: false})
                lowPulsesSent++
            }
        } else {
            if (this.name === 'fm' || this.name === 'dk' || this.name === 'fg' || this.name === 'pq') {
                let highPulseArray: Array<number> = highPulsesSentFromConjunction.get(this.name) || []
                highPulseArray.push(numberOfButtonPushes)
                highPulsesSentFromConjunction.set(this.name, highPulseArray)
    
                let highPulseFM = highPulsesSentFromConjunction.get('fm') || []
                let highPulseDK = highPulsesSentFromConjunction.get('dk') || []
                let highPulseFQ = highPulsesSentFromConjunction.get('fg') || []
                let highPulsePQ = highPulsesSentFromConjunction.get('pq') || []
                const NUMBER_OF_OCCURENCES = 3
                if (highPulseFM.length >= NUMBER_OF_OCCURENCES && highPulseDK.length >= NUMBER_OF_OCCURENCES 
                    && highPulseFQ.length >= NUMBER_OF_OCCURENCES && highPulsePQ.length >= NUMBER_OF_OCCURENCES) {
                        all4HaveSentHigh = true
                    }
            }
            


            // Send high pulse
            // Track when the 4 send a high
            if (LOGGING) console.log(`Conjunction module ${this.name} is sending high pulse`)
            for (let destination of this.destinationModules) {
                pulseArray.push({destination: destination, source: this.name, pulseType: true})
                highPulsesSent++
            }
        }
        if (LOGGING) console.log(`high: ${highPulsesSent}, low: ${lowPulsesSent}`)
        return { lowPulsesSent, highPulsesSent }
    }
}

// There is a single broadcast module (named broadcaster). When it receives a pulse, it sends the same pulse to all of its destination modules.
class BroadcastModule extends Module {
    constructor(name: string, destinationModules: Array<string>) {
       super(name, destinationModules) 
    }

    public processPulse(pulseType: boolean, source: string, pulseArray: Array<{destination: string, source: string, pulseType: boolean}>, numberOfButtonPushes: number) : {lowPulsesSent: number, highPulsesSent: number}  {
        let lowPulsesSent = 0
        let highPulsesSent = 0

        if (LOGGING) console.log(`${this.name} Processing pulse of type ${pulseType}`)
        for (let destination of this.destinationModules) {
            pulseArray.push({destination: destination, source: this.name, pulseType})
            pulseType ? highPulsesSent++ : lowPulsesSent++
        }
        return { lowPulsesSent, highPulsesSent }
    }
}


export async function solvePartOne ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    let lowPulsesSent: number = 0
    let highPulsesSent: number = 0

    // Array to track pulses which need to be processed.  Store the destination and pulse frequency.
    // pulseType = false is low pulse, pulseType = true is high pulse
    let pulseArray: Array<{destination: string, source: string, pulseType: boolean}> = new Array()
    let modules: Map<string, BroadcastModule | ConjunctionModule | FlipFlopModule> = new Map()

    let conjunctionModules: Array<string> = []
    for (let line of fileLines) {
        let splitString = line.replace(/ /g, '').split('->')
        let destinationModules = splitString[1].split(',')
        if (splitString[0] === 'broadcaster') {
            // Handle broadcaster
            modules.set(splitString[0], new BroadcastModule(splitString[0], destinationModules))
        } else {
            // Find prefix
            let prefix = splitString[0].substring(0,1)
            switch (prefix) {
                case '%':
                    modules.set(splitString[0].substring(1), new FlipFlopModule(splitString[0].substring(1), destinationModules))
                    break
                default:
                    if (LOGGING) console.log(`using default case for ${splitString}`)
                    modules.set(splitString[0].substring(1), new ConjunctionModule(splitString[0].substring(1), destinationModules))
                    conjunctionModules.push(splitString[0].substring(1))
                    break
            }
        }
    }
    
    // Set initial state of conjunction modules
    console.log(conjunctionModules)
    modules.forEach((module) => { 
        for (let destination of module.destinationModules) {
            // If the destination is listed in the conjunction modules list, add this as a connected module to it.
            // console.log(`destination ${destination}, result: ${conjunctionModules.indexOf(destination)}`)
            if (conjunctionModules.indexOf(destination) !== -1) {
                let conjunctionModule = modules.get(destination)
                if (conjunctionModule) {
                    conjunctionModule.connectedModules.set(module.name, false)
                }
                
            }
        }
    })
    console.log('modules', modules)

    // remember the initial state and check if we loop back to it?

    for (let numberOfButtonPushes = 0; numberOfButtonPushes < 1000; numberOfButtonPushes++) {
        // Here at Desert Machine Headquarters, there is a module with a single button on it called, aptly, the button module. 
        // When you push the button, a single low pulse is sent directly to the broadcaster module.
        pulseArray.push({destination: 'broadcaster', source: 'button', pulseType: false})
        lowPulsesSent++
        while(pulseArray.length > 0) {
            let currentPulse = pulseArray.shift()
            // console.log('currentPulse', currentPulse)
            if (!currentPulse) continue
            let currentModule = modules.get(currentPulse.destination)
            if (currentModule) {
                let result = currentModule.processPulse(currentPulse.pulseType, currentPulse.source, pulseArray, numberOfButtonPushes)
                lowPulsesSent += result.lowPulsesSent
                highPulsesSent += result.highPulsesSent
            }
        } 
    }
    console.log('modules', modules)
    console.log('lowPulsesSent', lowPulsesSent)
    console.log('highPulsesSent', highPulsesSent)
    return lowPulsesSent * highPulsesSent

}

export async function solvePartTwo ( filename : string) {
    let fileLines : String[] = await parseFileIntoArrayOfLines(filename)

    let lowPulsesSent: number = 0
    let highPulsesSent: number = 0

    // Array to track pulses which need to be processed.  Store the destination and pulse frequency.
    // pulseType = false is low pulse, pulseType = true is high pulse
    let pulseArray: Array<{destination: string, source: string, pulseType: boolean}> = new Array()
    let modules: Map<string, BroadcastModule | ConjunctionModule | FlipFlopModule> = new Map()

    let conjunctionModules: Array<string> = []
    for (let line of fileLines) {
        let splitString = line.replace(/ /g, '').split('->')
        let destinationModules = splitString[1].split(',')
        if (splitString[0] === 'broadcaster') {
            // Handle broadcaster
            modules.set(splitString[0], new BroadcastModule(splitString[0], destinationModules))
        } else {
            // Find prefix
            let prefix = splitString[0].substring(0,1)
            switch (prefix) {
                case '%':
                    modules.set(splitString[0].substring(1), new FlipFlopModule(splitString[0].substring(1), destinationModules))
                    break
                default:
                    if (LOGGING) console.log(`using default case for ${splitString}`)
                    modules.set(splitString[0].substring(1), new ConjunctionModule(splitString[0].substring(1), destinationModules))
                    conjunctionModules.push(splitString[0].substring(1))
                    break
            }
        }
    }
    
    // Set initial state of conjunction modules
    console.log(conjunctionModules)
    modules.forEach((module) => { 
        for (let destination of module.destinationModules) {
            // If the destination is listed in the conjunction modules list, add this as a connected module to it.
            // console.log(`destination ${destination}, result: ${conjunctionModules.indexOf(destination)}`)
            if (conjunctionModules.indexOf(destination) !== -1) {
                let conjunctionModule = modules.get(destination)
                if (conjunctionModule) {
                    conjunctionModule.connectedModules.set(module.name, false)
                }
                
            }
        }
    })
    console.log('modules', modules)

    // remember the initial state and check if we loop back to it?

    // for (let numberOfButtonPushes = 0; numberOfButtonPushes < 1000; numberOfButtonPushes++) {
    let numberOfButtonPushes = 0
    while (!all4HaveSentHigh) {
        // Here at Desert Machine Headquarters, there is a module with a single button on it called, aptly, the button module. 
        // When you push the button, a single low pulse is sent directly to the broadcaster module.
        pulseArray.push({destination: 'broadcaster', source: 'button', pulseType: false})
        let currentTime: Date = new Date(Date.now())
        if (numberOfButtonPushes % 100000 === 0) {
            console.log(`${currentTime.toISOString()} Processing button push # ${numberOfButtonPushes}`)
            console.log('highPulsesSentFromConjunction', highPulsesSentFromConjunction)
        }
        numberOfButtonPushes++
        lowPulsesSent++
        while(pulseArray.length > 0) {
            let currentPulse = pulseArray.shift()
            // console.log('currentPulse', currentPulse)
            if (!currentPulse) continue
            let currentModule = modules.get(currentPulse.destination)
            if (currentModule) {
                let result = currentModule.processPulse(currentPulse.pulseType, currentPulse.source, pulseArray, numberOfButtonPushes)
                lowPulsesSent += result.lowPulsesSent
                highPulsesSent += result.highPulsesSent
            }
        } 
        
    }



    console.log('modules', modules)
    console.log('lowPulsesSent', lowPulsesSent)
    console.log('highPulsesSent', highPulsesSent)
    console.log('highPulsesSentFromConjunction', highPulsesSentFromConjunction)

    // Call findLowestCommonMultiple
    let highPulseFM = highPulsesSentFromConjunction.get('fm') || []
    let highPulseDK = highPulsesSentFromConjunction.get('dk') || []
    let highPulseFQ = highPulsesSentFromConjunction.get('fg') || []
    let highPulsePQ = highPulsesSentFromConjunction.get('pq') || []
    let lowestCommonMultiple = 0
    if (highPulseFM.length >= 1 && highPulseDK.length >= 1 && highPulseFQ.length >= 1 && highPulsePQ.length >= 1) {
        // The values are all prime.  This means the LCM is them multiplied together.
        lowestCommonMultiple = highPulseFM[0] * highPulseDK[0] * highPulseFQ[0] * highPulsePQ[0]
        // lowestCommonMultiple = await findLowestCommonMultiple([highPulseFM[0], highPulseDK[0], highPulseFQ[0], highPulsePQ[0]])
    }
    return lowestCommonMultiple

}

// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day20/tests/data/input2.txt')
// solvePartOne('/mnt/c/Users/joshs/code/advent-of-code-2023/day20/input.txt')
    // .then(answer => console.log('answer:', answer))

solvePartTwo('/mnt/c/Users/joshs/code/advent-of-code-2023/day20/input.txt')
.then(answer => console.log('answer:', answer))