const { Console } = require('node:console')
const fs = require('node:fs/promises')

async function solvePartOne ( filename) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let cardsInHand = []
    let handRanks = new Array(7)
    for (let i = 0; i < 7; i++) {
        handRanks[i] = []
    }

    let totalWinnings = 0

    for ( let handNumber = 0; handNumber < lines.length; handNumber++) {
        let cards = lines[handNumber].split(' ')[0]
        let wager = lines[handNumber].split(' ')[1]
        cardsInHand[handNumber] = { cards: cards, wager: wager, cardCount: [] }
        for (let card = 0; card < 5; card++) {
            let cardLabel = lines[handNumber][card]
            let cardIndexInHand = cardsInHand[handNumber].cardCount.findIndex(hand => hand.label === cardLabel)
            if (cardIndexInHand === -1) {
                cardsInHand[handNumber].cardCount.push( { label: cardLabel, count: 1 } )
            } else {
                cardsInHand[handNumber].cardCount[cardIndexInHand].count++
            }
        }
        
        cardsInHand[handNumber].cardCount.sort((a, b) => b.count - a.count)
        // console.log(JSON.stringify(cardsInHand, null, 2))
        // cardCount.count is in descending order

        // console.log(JSON.stringify(cardsInHand[handNumber].cardCount))
        if (await isFiveOfAKind(cardsInHand[handNumber].cardCount)) {
            handRanks[6].push(cardsInHand[handNumber])
            // console.log('5 of a kind')
            continue
        }

        if (await isFourOfAKind(cardsInHand[handNumber].cardCount)) {
            handRanks[5].push(cardsInHand[handNumber])
            // console.log('4 of a kind')
            continue
        }
        if (await isFullHouse(cardsInHand[handNumber].cardCount)) {
            handRanks[4].push(cardsInHand[handNumber])
            // console.log('full house')
            continue
        }
        if (await isThreeOfAKind(cardsInHand[handNumber].cardCount)) {
            handRanks[3].push(cardsInHand[handNumber])
            // console.log('3 of a kind')
            continue
        }
        if (await isTwoPair(cardsInHand[handNumber].cardCount)) {
            handRanks[2].push(cardsInHand[handNumber])
            // console.log('Two pair')
            continue
        }
        if (await isOnePair(cardsInHand[handNumber].cardCount)) {
            handRanks[1].push(cardsInHand[handNumber])
            // console.log('One pair')
            continue
        }
        handRanks[0].push(cardsInHand[handNumber])
        // console.log('High card')

    }

    // console.log(handRanks)

    for (let i = 0; i < handRanks.length; i++) {
        if (handRanks[i].length > 1) handRanks[i].sort(sortByStrongestCard)
    }

    // console.log(handRanks)

    let handRank = lines.length
    for (let i = handRanks.length - 1; i >= 0 ; i--) {
        for (let j = 0; j < handRanks[i].length; j++) {
            totalWinnings += handRanks[i][j].wager * handRank
            handRank--
        }
    }
    
    return totalWinnings
}

function sortByStrongestCard (a, b) {
    let cardRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
    let cardToCompare = 0
    let difference = cardRanks.indexOf(a.cards[0]) - cardRanks.indexOf(b.cards[0])
    while (difference === 0) {
        cardToCompare++
        difference = cardRanks.indexOf(a.cards[cardToCompare]) - cardRanks.indexOf(b.cards[cardToCompare])
    }
    return difference
}

function sortByStrongestCardWithJokers (a, b) {
    let cardRanks = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
    let cardToCompare = 0
    let difference = cardRanks.indexOf(a.cards[0]) - cardRanks.indexOf(b.cards[0])
    while (difference === 0) {
        cardToCompare++
        difference = cardRanks.indexOf(a.cards[cardToCompare]) - cardRanks.indexOf(b.cards[cardToCompare])
    }
    return difference
}

async function isFiveOfAKind ( hand, numberOfJokers ) {
    let matches = hand[0].count === 5
    if (numberOfJokers > 0 && !matches) {
        if (hand[0].label === 'J') {
            matches = (hand[1].count + numberOfJokers) === 5
        } else {
            matches = (hand[0].count + numberOfJokers) === 5
        }
    }
    return matches
}

async function isFourOfAKind ( hand, numberOfJokers ) {
    let matches = hand[0].count === 4
    if (numberOfJokers > 0 && !matches) {
        if (hand[0].label === 'J') {
            matches = (hand[1].count + numberOfJokers) === 4
        } else (
            matches = (hand[0].count + numberOfJokers) === 4 
        )
    }
    return matches
    
}

async function isFullHouse ( hand, numberOfJokers ) {
    let matches = hand[0].count === 3 && hand[1].count === 2
    // If you have 4 or 5 distinct cards, there is no way to make 3 of one and 2 of another.
    if (hand.length > 3 ) return false
    if (numberOfJokers > 0 && !matches) {
        // You have 3 cards, at least one of which is a joker
        matches = true
    }
    return matches
}   

async function isThreeOfAKind ( hand, numberOfJokers ) {
    let matches = hand[0].count === 3
    if (numberOfJokers > 0 && !matches) {
        for (let i = 0; i < hand.length; i++) {
            matches = (hand[i].count + numberOfJokers) === 3
            if (matches) break
        }
    }
    return matches
}

async function isTwoPair ( hand, numberOfJokers ) {
    let matches = hand[0].count === 2 && hand[1].count === 2
    // If you have at least 2 jokers, you can make two pair.
    if (numberOfJokers > 1) matches = true
    if (numberOfJokers === 1 && hand[0].count === 2) matches = true
    return matches
}  

async function isOnePair ( hand, numberOfJokers ) {
    let matches = hand[0].count === 2
    if (numberOfJokers > 0 && !matches) matches = true
    return matches
} 

async function solvePartTwo ( filename ) {
    let file = await fs.open(filename)
    let fileInput = await file.readFile({ encoding: 'utf8'})
    let lines = fileInput.trim().split('\n')
    file.close()

    let cardsInHand = []
    let handRanks = new Array(7)
    for (let i = 0; i < 7; i++) {
        handRanks[i] = []
    }

    let totalWinnings = 0

    for ( let handNumber = 0; handNumber < lines.length; handNumber++) {
        let cards = lines[handNumber].split(' ')[0]
        let wager = lines[handNumber].split(' ')[1]
        cardsInHand[handNumber] = { cards: cards, wager: wager, cardCount: [], jokerCount: 0}
        for (let card = 0; card < 5; card++) {
            let cardLabel = lines[handNumber][card]
            let cardIndexInHand = cardsInHand[handNumber].cardCount.findIndex(hand => hand.label === cardLabel)
            if (cardIndexInHand === -1) {
                cardsInHand[handNumber].cardCount.push( { label: cardLabel, count: 1 } )
            } else {
                cardsInHand[handNumber].cardCount[cardIndexInHand].count++
            }
        }
        let jokers = cardsInHand[handNumber].cardCount.find(card => card.label === 'J')
        if (jokers) cardsInHand[handNumber].jokerCount = jokers.count
        // console.log('number of jokers: ', cardsInHand[handNumber].jokerCount)
        
        cardsInHand[handNumber].cardCount.sort((a, b) => b.count - a.count)
        // console.log(JSON.stringify(cardsInHand, null, 2))
        // cardCount.count is in descending order

        // console.log(JSON.stringify(cardsInHand[handNumber].cardCount))
        if (await isFiveOfAKind(cardsInHand[handNumber].cardCount, cardsInHand[handNumber].jokerCount)) {
            handRanks[6].push(cardsInHand[handNumber])
            // console.log('5 of a kind')
            continue
        }

        if (await isFourOfAKind(cardsInHand[handNumber].cardCount, cardsInHand[handNumber].jokerCount)) {
            handRanks[5].push(cardsInHand[handNumber])
            // console.log('4 of a kind')
            continue
        }
        if (await isFullHouse(cardsInHand[handNumber].cardCount, cardsInHand[handNumber].jokerCount)) {
            handRanks[4].push(cardsInHand[handNumber])
            // console.log('full house')
            continue
        }
        if (await isThreeOfAKind(cardsInHand[handNumber].cardCount, cardsInHand[handNumber].jokerCount)) {
            handRanks[3].push(cardsInHand[handNumber])
            // console.log('3 of a kind')
            continue
        }
        if (await isTwoPair(cardsInHand[handNumber].cardCount, cardsInHand[handNumber].jokerCount)) {
            handRanks[2].push(cardsInHand[handNumber])
            // console.log('Two pair')
            continue
        }
        if (await isOnePair(cardsInHand[handNumber].cardCount, cardsInHand[handNumber].jokerCount)) {
            handRanks[1].push(cardsInHand[handNumber])
            // console.log('One pair')
            continue
        }
        handRanks[0].push(cardsInHand[handNumber])
        // console.log('High card')

    }

    // console.log(handRanks)

    for (let i = 0; i < handRanks.length; i++) {
        if (handRanks[i].length > 1) handRanks[i].sort(sortByStrongestCardWithJokers)
    }

    // console.log(handRanks)

    let handRank = lines.length
    for (let i = handRanks.length - 1; i >= 0 ; i--) {
        for (let j = 0; j < handRanks[i].length; j++) {
            totalWinnings += handRanks[i][j].wager * handRank
            handRank--
        }
    }
    
    return totalWinnings
}

// solvePartOne('./input.txt')
 //solvePartOne('./tests/data/input2.txt')
    // .then(answer => console.log('answer:', answer))

    // not 233699292 - too low

solvePartTwo('./input.txt')
// solvePartTwo('./tests/data/input.txt')
    .then(answer => console.log('answer:', answer))



module.exports = { solvePartOne, solvePartTwo, isFiveOfAKind, isFourOfAKind, isFullHouse, isThreeOfAKind, isTwoPair, isOnePair } 