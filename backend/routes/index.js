const accounts = require('./accounts');
const products = require('./products');
const orders = require('./orders');
const stats = require('./statistics')
const admin = require ('./admin'); 
const compatability = require('./compatibility');
const benchmark = require('./benchmark');
const final = require('./final');
//... add more as needed


// collate all the route file's route exports
module.exports = [
    accounts,
    products,
    stats,
    orders,
    admin,
    compatability,
    benchmark,
    final // <- leave final as last export pls
]