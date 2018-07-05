const drawNode = require('./drawnode')

module.exports = function drawGraph(graph) {
    return `digraph G {\n${
        listAddresses(graph)
    }\n\n${
        listTxs(graph)
    }\n\n${
        drawEdges(graph)
    }}`
}

function listIt(graph, accessor, filter = _ => true) {
    return Object.values(accessor(graph))
        .filter(filter)
        .map(value => drawNode(value)).join('')
}

function listAddresses(graph) {
    return listIt(graph, (_) => _.addresses, _ => _.show || !_.hide)
}

function listTxs(graph) {
    return listIt(graph, (_) => _.txs)
}

function drawEdges(graph) {
    let res = ''
    for (let node in graph.txs) {
        const tx = graph.txs[node]
        for (let input in tx.inputs) {
            const addr = tx.inputs[input].prev_out.addr
            if (!graph.addresses[addr].show && graph.addresses[addr].hide) continue
            res += `\t${addrId(addr)} -> ${txId(tx.id)} [label="${tx.inputs[input].prev_out.value}"]\n`
        }
        for (let output in tx.out) {
            const addr = tx.out[output].addr
            if (!graph.addresses[addr].show && graph.addresses[addr].hide) continue
            res += `\t${txId(tx.id)} -> ${addrId(addr)} [label="${tx.out[output].value}"]\n`
        }
    }
    return res
}

function txId(tx) {
    return `tx${tx}`
}

function addrId(addr) {
    return `add${addr}`
}
