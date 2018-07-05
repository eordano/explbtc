const fs = require('fs')
const fetch = require('isomorphic-fetch')

const memCache = {}
const baseUrl = 'https://blockchain.info/'

module.exports = {
    address: addr => ensureData(addr, addressUrl),
    tx: tx => ensureData(tx, txUrl)
}

async function ensureData(address, url) {
    if (memCache[address]) return memCache[address]
    if (cacheHit(address)) return memCache[address] = readCache(address)
    let data
    let offset = 0
    let lastData
    while (!lastData || (lastData.txs && lastData.txs.length == 50)) {
        lastData = await (await fetch(url(address, offset))).json()
        if (!data) data = lastData
        else if (data.txs) data.txs = data.txs.concat(lastData.txs)
        offset += 50
    }
    writeCache(address, data)
    memCache[address] = data
    return data
}

function writeCache(name, data) {
    fs.writeFileSync(cacheFile(name), JSON.stringify(data))
}

function cacheHit(name) {
    return fs.existsSync(cacheFile(name))
}

function readCache(name) {
    return JSON.parse(fs.readFileSync(cacheFile(name)))
}

function cacheFile(name) {
    return '.cache/' + name
}

function addressUrl(address, offset) {
    return baseUrl + 'rawaddr/' + address + '?offset=' + offset
}

function txUrl(tx) {
    return baseUrl + 'rawtx/' + tx
}
