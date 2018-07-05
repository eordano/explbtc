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

if (!module.parent) {
    return console.log(module.exports({
        addresses: {
            "1MgGdrKQ1fgueLWjjis9XSgyJTiYtHiVkJ": {
                type: 'add',
                id: "1MgGdrKQ1fgueLWjjis9XSgyJTiYtHiVkJ"
            },
            "19K2Y4dbT29wxQuaTgbKqm6n1iodcvY7pe": {
                type: 'add',
                id: "19K2Y4dbT29wxQuaTgbKqm6n1iodcvY7pe"
            }
        },
        txs: {
            "956f5f769b69a3c66ac18bc03ba3749e2074ae9d0764d1e4e96d38a3293e2d7d": {
                type: 'tx',
                id: "956f5f769b69a3c66ac18bc03ba3749e2074ae9d0764d1e4e96d38a3293e2d7d",
                time: 1530826331,
                inputs: [
                    {
                        "prev_out": {
                            "addr": "1MgGdrKQ1fgueLWjjis9XSgyJTiYtHiVkJ"
                        }
                    }
                ],
                outputs: [
                    {
                        "addr": "19K2Y4dbT29wxQuaTgbKqm6n1iodcvY7pe",
                        "value": 195433896
                    },
                    {
                        "addr": "1Cigv2qFjPq6yuMtj5ysJbArWz46CBZWKi",
                        "value": 338462
                    }
                ]
            }
        }
    }))
}

function listIt(graph, accessor) {
    return Object.values(accessor(graph)).map((_, value) => drawNode(value)).join('')
}

function listAddresses(graph) {
    return listIt(graph, (_) => _.addresses)
}

function listTxs(graph) {
    return listIt(graph, (_) => _.txs)
}

function drawEdges(graph) {
    let res = ''
    for (let node in graph.txs) {
        const tx = graph.txs[node]
        for (let input in tx.inputs) {
            res += `\t${addrId(tx.inputs[input].prev_out.addr)} -> ${txId(tx.id)}\n`
        }
        for (let output in tx.out) {
            res += `\t${txId(tx.id)} -> ${addrId(tx.out[output].addr)}\n`
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
