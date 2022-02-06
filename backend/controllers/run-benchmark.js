const {calculateBenchmark} = require('./benchmark');

let res = {}
calculateBenchmark({body: {products: ['730143312745']}}, res);