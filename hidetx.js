const getData = require('./getdata')

module.exports = async function hideTx(graph, txId) {
    const tx = await getData.tx(txId)
    for (let input in tx.inputs) {
        const addr = tx.inputs[input].prev_out.addr
        setHide(graph, addr)
    }
    for (let output in tx.out) {
        const addr = tx.out[output].addr
        setHide(graph, addr)
    }
}

function setHide(graph, addr) {
    if (graph.addresses[addr]) graph.addresses[addr].hide = (graph.addresses[addr].hide || 0) + 1
    else graph.addresses[addr] = {
        id: addr,
        type: 'addr',
        hide: 1
    }
}
