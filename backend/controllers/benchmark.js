// console.log('CURRENT directory: ' + process.cwd());
// Import database
const knex = require(`../database/products`)

const {queryGetProductCategories, queryCompatibilityFields, queryStorageTypeFromId, queryStorageSizeFromId} = require('./compatibility')


/**********************************************
 *             HELPER FUNCTIONS               *
 **********************************************/

/**
 * query database for a product's name from its id
 */
const queryProductName = (productId) =>
    knex('products')
    .select('name')
    .where('id', '=', productId)
    .then ((data) => {
        if (data.length === 1) {
            // console.log(data[0].name);
            return data[0].name;
        } else {
            throw ('invalid productid')
        }
    })
    .catch((err) => {
        throw (`Problem querying product name from id \'${productId}}\'` + err);
    })

/** 
 * Queries the data_XXX tables for scraped product data, given the appropriate tableName and a product name.
 * e.g: a product 'XXXX 1070Ti' may match to gpus created by gigabyte, msi, etc... and hence the method
 * must slowly search for the name word-by-word until it gets a perfect match.
 * */
const queryProductDataFromName = async (tableName, productName) => {
    let name = productName.toUpperCase();
    // make the name more search friendly
    // name = name.replaceAll('GB', ' GB');
    // name = name.replaceAll('MHZ', ' MHZ');
    name = name.replace(/GB/g, ' GB');
    name = name.replace(/MHZ/g, ' MHZ');

    // search for a singular product name match (or the closest to), starting with the very first word of the product name
    console.log('querying data for : ' + name)
    let nameArray = name.split(' ');
    let matches = 999;
    let increment = 1;
    let lastResult = null;

    let result;
    //while (matches !== 1 || nameArray.length > 0) {
    while (matches > 1 && nameArray.length > increment) {
        let query = `select distinct * from ${tableName} where name like \'%${nameArray[0]}%\'`;
        //for (word of nameArray) {
        for (let index = 1; index < increment; index++) {
            query += ` and name like \'%${nameArray[index]}%\'`
        }
        result = await knex.raw(query);
        increment = increment + 1;
        matches = result.length;
        // console.log('matches: ', matches)
        // console.log('increment: ', increment)
        if (matches > 0) {
            lastResult = result[0];
        }
    }
    return lastResult;
}

/** 
 * Queries the data_XXX tables for scraped GPU data, given the appropriate chipset and brand 
 */
const queryGpuData = async (chipset, brand) => {
    // search for a singular product name match, starting with the very first word of the product name
    console.log('querying data for : ' + brand + ' ' + chipset);
    let searchArray = chipset.split(' ');
    let matches = 0;
    let increment = searchArray.length;

    let result;
    while (matches === 0 && increment > 0) {
        let query = `select distinct * from data_gpu where name like \'%${brand}%\'`;
        //for (word of searchArray) {
        for (let index = 0; index < increment; index++) {
            query += ` and chipset like \'%${searchArray[index]}%\'`
        }
        result = await knex.raw(query);
        increment = increment - 1;
        matches = result.length;
        // console.log('matches: ', matches)
        // console.log('increment: ', increment)
    }
    if (matches > 0) {
        // console.log(result)
        return result[0];
    } else {
        return null;
    }
}


/** Creates a fraction value based on logging the numberator and denominator first,
 *  and averages it with the linear fraction,
 *  so that higher values have slightly diminishing returns
 */
const logScaleScore = (value, max) => {
    if (value > max) {
        return 100;
    } else {
        let logScore = 100 * (Math.log(value) / Math.log(max));
        if (logScore < 0) logScore = 0;
        const linearScore = 100 * (value / max);
        return (0.7 * logScore + 0.3 * linearScore);
    }
}



const calcCpuBenchmark = async (products, benchmarkLabels) => {
    try {
        let benchmark = [];
        const cpuId = products[0];
        const cpuName = await queryProductName(cpuId);
        const performanceData = await queryProductDataFromName('data_cpu', cpuName);
        if (performanceData === null) {
            throw ('failed to find performance data for specified CPU');
            //return [];
        }
        // console.log('performanceData', performanceData)
        const baseClock = parseFloat(performanceData['core_clock'].split(' ')[0]);
        const boostClock = parseFloat(performanceData['boost_clock'].split(' ')[0]);
        const coreCount = parseFloat(performanceData['core_count']);

        const basePower = baseClock * coreCount; // highest is 185.6, nonThreadRipper: 54.4
        const boostPower = boostClock * coreCount; // highest is 275.2, nonThreadRipper: 78.4

        // labels:     ['General', 'Gaming', 'Graphic Design', '3D Modelling', 'Video Editing'], 
        benchmark = [
            logScaleScore(basePower,   8 * 3.0), // general: least cpu intensive
            logScaleScore(boostPower, 16 * 3.2), // gaming: moderately cpu intensive (depends on the game)
            logScaleScore(boostPower, 16 * 3.4), // graphic: moderately cpu intensive
            logScaleScore(boostPower, 16 * 4.0), // 3d model: cpu intensive
            logScaleScore(boostPower, 16 * 4.0)  // vid edit: cpu intensive (sometimes)
        ];
        // console.log(benchmark);
        return benchmark
    }
    catch (err) {
        console.log('There was an error calcuating cpu benchmark:')
        console.log(err);
    }
}

const calcGpuBenchmark = async (products, benchmarkLabels) => {
    // let benchmark = [];

    // return benchmark
    try {
        let benchmark = [];
        const gpuId = products[0];
        const gpuName = await queryProductName(gpuId);
        // extract brand name
        const brand = gpuName.split(' ')[0];
        // extract chipset
        let gpuChipset = '';
        if (gpuName.includes('GeForce'))
            gpuChipset = 'GeForce' + gpuName.split('GeForce')[1];
        else if (gpuName.includes('Radeon')) {
            gpuChipset = 'Radeon' + gpuName.split('Radeon')[1];
        } else {
            throw ('failed to find performance data for specified GPU');
        }
        const performanceData = await queryGpuData(gpuChipset, brand);
        if (performanceData === null) {
            throw ('failed to find performance data for specified GPU');
            //return [];
        }
        // console.log('performanceData', performanceData)
        const baseClock = parseFloat(performanceData['core_clock'].split(' ')[0]); // highest: 1400MHz (consumer) @RTX 3090
        let boostClock;
        if (performanceData['boost_clock'] !== null) {
            boostClock = parseFloat(performanceData['boost_clock'].split(' ')[0]); // highest: 1890 MHz (consumer)
        } else {
            boostClock = baseClock;
        }
        const memory = parseFloat(performanceData['memory'].split(' ')[0]); // highest: 24GB (3090), 12GB (3080)

        const performance = boostClock * memory; // this is the benchmark that logical increments uses

        // console.log(`${boostClock}|${memory}|${performance}`);

        // labels:     ['General', 'Gaming', 'Graphic Design', '3D Modelling', 'Video Editing'], 
        benchmark = [
            logScaleScore(performance, 1600 * 4), // general: least gpu intensive
            logScaleScore(performance, 1900 * 12), // gaming: very gpu intensive
            logScaleScore(performance, 1900 * 6), // graphic: somewhat gpu intensive
            logScaleScore(performance, 1900 * 8), // 3d model: moderately gpu intensive
            logScaleScore(performance, 1900 * 12)  // vid edit: very gpu intensive
        ];
        // console.log(benchmark);
        return benchmark
    }
    catch (err) {
        console.log('There was an error calcuating gpu benchmark:')
        console.log(err);
    }
}

const calcMemoryBenchmark = async (products, benchmarkLabels) => {
    let benchmark = [];
    let totalRam = 0;
    for (const product of products) {
        const name = await queryProductName(product);
        // be sure to separate numbers from GB: 16GB -> 16 GB;
        const performanceData = await queryProductDataFromName('data_memory', name);
        // console.log(performanceData);
        const modules = performanceData['modules']; // '2 x 16GB'
        const data = modules.replace('GB', '').split('x'); // [2, 16]
        const partRam = parseInt(data[0]) * parseInt(data[1]); // 2 * 16
        // console.log('part ram:' + partRam);
        totalRam += partRam;
    }
    // console.log('total ram:' + totalRam);

    benchmark = [
        logScaleScore(totalRam, 16), // general: not memory intensive
        logScaleScore(totalRam, 48), // gaming:  moderately memory intensive
        logScaleScore(totalRam, 24), // graphic: somewhat memory intensive where 16 is rly good, 32 overkill
        logScaleScore(totalRam, 48), // 3d model: moderately memory intensive
        logScaleScore(totalRam, 64)  // vid edit: very memory intensive
    ];
    // console.log(benchmark);
    return benchmark;
}

const calcStorageBenchmark = async (products, benchmarkLabels) => {
    let benchmark = [];
    let solidStateStorage = 0;
    let diskStorage = 0;
    for (const product of products) {
        const name = await queryProductName(product);
        let type = await queryStorageTypeFromId(product);
        type.toUpperCase();
        const size = await queryStorageSizeFromId(product);
        if (type.includes('SSD') || type.includes('M2') || type.includes('M.2')) {
            solidStateStorage += size;
        } else {
            diskStorage += size;
        }
    }

    const totalStorage = solidStateStorage + diskStorage;

    // console.log(`solid: ${solidStateStorage}, disk: ${diskStorage}, total: ${totalStorage}`);

    // storage benchmark is a mix of weights between fast storage and disk/ total storage
    benchmark = [
        (logScaleScore(solidStateStorage, 256)*0.40 + logScaleScore(totalStorage, 1000)*0.60), // general: 128gb ssd is a MUST
        (logScaleScore(solidStateStorage, 256)*0.67 + Math.max(logScaleScore(totalStorage, 3000), logScaleScore(solidStateStorage, 1000))*0.33), // gaming: 256ssd & lots of general storage
        (logScaleScore(solidStateStorage, 256)*0.60 + logScaleScore(totalStorage, 1500)*0.40), // graphics: not very storage intensive
        (logScaleScore(solidStateStorage, 256)*0.60 + logScaleScore(totalStorage, 3000)*0.40), // 3d model: moderately storage intensive
        (logScaleScore(solidStateStorage, 1000)*0.50 + logScaleScore(totalStorage, 5000)*0.50), // vid edit: extremely storage intensive
    ];

    // console.log(benchmark);
    return benchmark;
}

const calcOverallBenchmark = (cpuBenchmark, gpuBenchmark, memoryBenchmark, storageBenchmark, benchmarkLabels) => {
    let benchmark = [];
    // weighted average of all the component benchmarks
    benchmark = [
        // General: cpu + memory + storage intensive
        (cpuBenchmark[0]*40 + gpuBenchmark[0]*10 + memoryBenchmark[0]*30 + storageBenchmark[0]*20) / (100),
        // Gaming: gpu + memory intensive
        (cpuBenchmark[1]*20 + gpuBenchmark[1]*50 + memoryBenchmark[1]*20 + storageBenchmark[1]*10) / (100),
        // Graphic Design: cpu + memory intensive
        (cpuBenchmark[2]*40 + gpuBenchmark[2]*20 + memoryBenchmark[2]*30 + storageBenchmark[2]*10) / (100),
        // 3D Modelling: cpu + gpu + memory intensive
        (cpuBenchmark[3]*32 + gpuBenchmark[3]*32 + memoryBenchmark[3]*26 + storageBenchmark[3]*10) / (100),
        // Video Editing: gpu + memory + storage intensive
        (cpuBenchmark[4]*10 + gpuBenchmark[4]*40 + memoryBenchmark[4]*30 + storageBenchmark[4]*20) / (100)
    ]


    return benchmark
}


const calcBenchmarkTier = (overallBenchmark) => {
    // best score is 5 * 100 = 500
    const totalScore = overallBenchmark.reduce((prev, next) => prev + next, 0)
    // console.log('calc tier for benchmark of: ');
    // console.log(overallBenchmark);
    // console.log(totalScore);
    let benchmarkTier = 'BRONZE';
    if (totalScore > 0)   benchmarkTier = 'BRONZE';
    if (totalScore > 250) benchmarkTier = 'SILVER';
    if (totalScore > 350) benchmarkTier = 'GOLD';
    if (totalScore > 400) benchmarkTier = 'PLATINUM';
    if (totalScore > 450) benchmarkTier = 'DIAMOND';
    if (totalScore > 480) benchmarkTier = 'MASTER'

    // console.log(benchmarkTier);
    return benchmarkTier
}

/*************************************
 *      CONTROLLER FUNCTIONS         *
 *************************************/

/**
 * Given a system's products, calculates benchmark scores and a tier
 */
const calculateBenchmark = async (req, res, next) => {
    const products = req.body['products'];
    // console.log(products)
    try {
        // extract the parts
        const productCategories = await queryGetProductCategories(products);

        const cpuParts = products.filter(productid => productCategories[productid] === 'CPU')
        const gpuParts = products.filter(productid => productCategories[productid] === 'GPU')
        const memoryParts = products.filter(productid => productCategories[productid] === 'Memory')
        const storageParts = products.filter(productid => productCategories[productid] === 'Storage')

        if (cpuParts.length > 1 || gpuParts.length > 1) {
            res.status(400).json({ error: `Your cart has too many CPUs or Video Cards` });
            return;
        }

        const benchmarkLabels = ['General', 'Gaming', 'Graphic Design', '3D Modelling', 'Video Editing']; 
        const emptyBenchmark = [0, 0, 0, 0, 0];

        const cpuBenchmark     = (cpuParts.length > 0     ? await calcCpuBenchmark(cpuParts, benchmarkLabels) : emptyBenchmark);
        const gpuBenchmark     = (gpuParts.length > 0     ? await calcGpuBenchmark(gpuParts, benchmarkLabels) : emptyBenchmark);
        const memoryBenchmark  = (memoryParts.length > 0  ? await calcMemoryBenchmark(memoryParts, benchmarkLabels) : emptyBenchmark);
        const storageBenchmark = (storageParts.length > 0 ? await calcStorageBenchmark(storageParts, benchmarkLabels) : emptyBenchmark);
        const overallBenchmark = calcOverallBenchmark(cpuBenchmark, gpuBenchmark, memoryBenchmark, storageBenchmark, benchmarkLabels);
        // tiers: Bronze, Silver, Gold, Platinum, Diamond, Master
        const benchMarkTier    = calcBenchmarkTier(overallBenchmark);



        res.status(200).json({
            // labels: ['General', 'Gaming', 'Graphic Design', '3D Modelling', 'Video Editing'], 
            labels: benchmarkLabels,
            data: [
                {label: 'Overall', benchmark: overallBenchmark},
                {label: 'Cpu', benchmark: cpuBenchmark},
                {label: 'Gpu', benchmark: gpuBenchmark},
                {label: 'Memory', benchmark: memoryBenchmark},
                {label: 'Storage', benchmark: storageBenchmark}
            ],
            tier: benchMarkTier
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ error: `There was an error while processing products compatability ${err}` });
    }
}


module.exports = {
    calculateBenchmark
}
