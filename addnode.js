const getData = require('./getData')

module.exports = async function addNode(graph, address) {
    const data = await getData.address(address)
    if (!graph.addresses[address]) graph.addresses[address] = {
        id: address,
        type: 'add',
        show: true
    }
    if (!graph.addresses[address].show) graph.addresses[address].show = true
    for (let tx of data.txs) {
        if (!graph.txs[tx.hash]) graph.txs[tx.hash] = { ...tx, id: tx.hash, type: 'tx' }
        for (let input in tx.inputs) {
            const addr = tx.inputs[input].prev_out.addr
            addWeak(graph, addr)
        }
        for (let output in tx.out) {
            const addr = tx.out[output].addr
            addWeak(graph, addr)
        }
    }
}

function addWeak(graph, addr) {
    if (!graph.addresses[addr]) graph.addresses[addr] = {
        id: addr,
        type: 'add',
        weak: 1
    }
    else graph.addresses[addr].weak += 1
}
