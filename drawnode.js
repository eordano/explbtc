const baseUrl = 'https://www.blockchain.com/en/btc/'

function draw(node, idFn, labelFn, linkFn, extraFn) {
    return `\t${
        idFn(node)
    } [href="${
        linkFn(node)
    }" label=<<font color="blue">${
        labelFn(node)
    }</font>${
        customLabel(node)
    }${
        extraFn(node)
    }>]\n`
}

function drawTx(node) {
    return draw(node, txId, txLabel, txLink, txDate)
}

function drawAddress(node) {
    return draw(node, addId, addLabel, addLink, () => '')
}

function customLabel(node) {
    if (!node.label) return ''
    return `<br/><br/>${node.label}`
}

function txId(node) {
    return `tx${node.id}`
}

function txLink(node) {
    return baseUrl + 'tx/' + node.id
}

function txDate(node) {
    return '<br/><br/>' + new Date(node.time * 1000).toISOString().replace('T', ' ').substr(0,16)
}

function txLabel(node) {
    return `TX: ${fourId(node.id)}`
}

function addId(node) {
    return `add${node.id}`
}

function addLink(node) {
    return baseUrl + 'address/' + node.id
}

function addLabel(node) {
    return fourId(node.id)
}

function fourId(str) {
    return `${str.substr(0, 4)}...${str.substr(str.length - 4, 4)}`
}
module.exports = function drawNode(node) {
    if (node.type == 'tx') return drawTx(node)
    if (node.type == 'add') return drawAddress(node)
}

