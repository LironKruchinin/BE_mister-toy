const fs = require('fs')
// const PAGE_SIZE = 10
var toys = require('../data/toy.json')

module.exports = {
    query,
    get,
    save,
    remove
}

function query() {
    let filteredToys = toys
    return Promise.resolve(filteredToys)
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('No such toy')
    return Promise.resolve(toy)
}

function save(toy) {
    // console.log('service', toy);
    // console.log('service', toy._id);
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        if (!toyToUpdate) return Promise.reject('No such toy')

        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.inStock = toy.inStock
        toyToUpdate.img = toy.img
        toyToUpdate.labels = toy.labels
        toyToUpdate.createdAt = new Date().getTime()
    } else {
        toy._id = _makeId()
        toy.createdAt = new Date().getTime()
        toys.unshift(toy)
    }
    return _writeToysToFile().then(() => toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
    // const toy = toys[idx]
    toys.splice(idx, 1)
    return _writeToysToFile()
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}



function _writeToysToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        });
    })
}