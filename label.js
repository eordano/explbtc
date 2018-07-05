module.exports = function addLabel(graph, what, how) {
    if (graph.addresses[what]) graph.addresses[what].label = how
    if (graph.txs[what]) graph.txs[what].label = how
}
