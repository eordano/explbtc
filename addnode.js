const fs = require('fs')
const fetch = require('isomorphic-fetch')

const memCache = {}
const baseUrl = 'https://blockchain.info/'

module.exports = async function addAddress(address) {
    return await ensureAddress(address)
}

if (!module.parent) {
    module.exports('19K2Y4dbT29wxQuaTgbKqm6n1iodcvY7pe').then(e => console.log(JSON.stringify(e, null, 2)))
}

async function ensureAddress(address) {
    if (memCache[address]) return memCache[address]
    if (cacheHit(address)) return memCache[address] = readCache(address)
    console.log(`Cache miss: ${address}.`)
    let data
    let offset = 0
    let lastData
    while (!lastData || lastData.txs.length == 50) {
        console.log((offset === 0) ? 'Fetching...' : 'Fetching next page...')
        lastData = await (await fetch(addressUrl(address, offset))).json()
        if (!data) data = lastData
        else data.txs.append(lastData.txs)
        console.log(lastData)
        offset += 50
    }
    console.log(`Fetched ${data.txs.length} txs for ${address}`)
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
