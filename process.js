const addNode = require('./addnode')
const drawGraph = require('./drawgraph')
const hideTx = require('./hidetx')
const addLabel = require('./label')

module.exports = async function process(instructions) {
    const graph = { addresses: {}, txs: {} }
    for (let instruction of instructions) {
        if (!instruction.length) continue
        if (instruction[0] === 'add') await addNode(graph, instruction[1])
        if (instruction[0] === 'hide') await hideTx(graph, instruction[1])
        if (instruction[0] === 'label') addLabel(graph, instruction[1], instruction.slice(2).join(' '))
    }
    console.error('/*', JSON.stringify(graph, null, 2), '*/')
    return drawGraph(graph)
}

if (!module.parent) {
    const fs = require('fs')
    const input = fs.readFileSync('./input', 'utf-8')
    module.exports(input.split('\n').map(input => input.split(' '))).then(console.log)
}
