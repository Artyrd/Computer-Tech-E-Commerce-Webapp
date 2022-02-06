// console.log('CURRENT directory: ' + process.cwd());
// Import database
const knex = require(`../database/compatibility`)


/**********************************************
 *             HELPER FUNCTIONS               *
 **********************************************/

/**
 * Extract the products whom belong to the associated category
 * @param {Array} products - an array of productids
 * (old) returns an array of products whom belong to the given category
 * @returns an object mapping product's id as a key to its category as a value
 */
const queryGetProductCategories = async (products, category) => 
    knex('products')
    // .select('id')
    .select('id', 'category')
    .whereIn('id', products)
    // .andWhere('category', 'like', category)
    .then((productsData) => {
        // console.log(`${category} parts are:`);
        console.log(`${productsData}`)
        let categoryDict = {};
        // map into object with {id: category}
        for (data of productsData) {
            categoryDict[`${data.id}`] = data.category;
        }
        return categoryDict;
    })
    .catch((err)=>{
        throw (`There was an error looking up the products on the database: ${err}`);
    })


const queryCompatibilityFields = async (table, testPayloadIds) =>
    knex(`${table}`)
    .select('*')
    .where('productid', 'in', testPayloadIds)
    .then((data) => {
        // console.log('queried data:')
        // console.log(data);
        const productInfo = data.map(entry => {
            const values = Object.values(entry);
            return {'id': values[0], 'field': values[1]};
        })
        console.log('queried data after mapping:')
        console.log(productInfo);
        return productInfo;
    })
    .catch((err) => {
        throw (`failed to access compatibility fields ${err}`)
    })

const queryCommonMotherBoard = async (memoryFields, cpuFields) => {
    console.log(memoryFields);
    console.log(cpuFields);
    return knex(`products`)
    .leftJoin('cptb_cpu', 'cptb_cpu.productid', 'products.id')
    .leftJoin('cptb_ram', 'cptb_ram.productid', 'products.id')
    .select('products.id')
    .where('products.category', 'like', 'motherboard')
    .andWhere('module', 'in', memoryFields)
    .andWhere('socket', 'in', cpuFields)
    .then((data) => {
        console.log('possible motherboards are:');
        console.log(data);
        return data.map((entry) => entry.id)
    })
    .catch((err) => {
        throw `there was an error with finding a common motherboard: ${err}`
    })
}
const queryCptbCpuOptions = async () => 
    knex('cptb_cpu')
    .distinct('socket')
    .catch((err) => {
        throw (`failed to find cpu compatability data: ${err}`)
    })

const queryCptbRamModulesOptions = async () => 
    knex('cptb_ram')
    .distinct('module')
    .catch((err) => {
        throw (`failed to find ram modules compatability data: ${err}`)
    })
const queryCptbRamSlotsOptions = async () => 
    knex('cptb_ram_slots')
    .distinct('slots')
    .catch((err) => {
        throw (`failed to find ram slots compatability data: ${err}`)
    })

const queryCptbMoboSizeOptions = async () => 
    knex('cptb_mobo_size')
    .distinct('size')
    .catch((err) => {
        throw (`failed to find mobo size compatability data: ${err}`)
    })

const queryCptbStorageOptions = async () => 
    knex('cptb_storage')
    .distinct('type')
    .catch((err) => {
        throw (`failed to find storage compatability data: ${err}`)
    })
const queryCptbStorageSizeOptions = async () => 
    knex('cptb_storage_size')
    .distinct('size')
    .catch((err) => {
        throw (`failed to find storage size data: ${err}`)
    })

/**
 * Queries the database for the storage type of the product's id
 * @param {String} productId 
 * @returns {} the storage type (HDD, SSD, M.2)
 */
const queryStorageTypeFromId = async (productId) =>  {
    return knex('cptb_storage')
    .select('type')
    .where('productid', '=', productId)
    .then((data) => {
        console.log('getting storage type...')
        console.log(data);
        const storageType = data[0]['type'];
        console.log(storageType);
        return storageType;
    })
    .catch((err) => {
        throw (`failed to find storage type of ${productId}: ${err}`);
    })
}

/**
 * Queries the database for the storage size in GB of the product's id
 * @param {String} productId 
 * @returns {} the storage size in Gigabytes
 */
const queryStorageSizeFromId = async (productId) => 
    knex('cptb_storage_size')
    .select('size')
    .where('productid', '=', productId)
    .then((data) => {
        const sizeString = data[0]['size'];
        return calculateStorageSizeFromString(sizeString);
    })
    .catch((err) => {
        throw (`failed to query storage size of ${productId}: ${err}`);
    })

/**
 * Given a Gives a storage size in Gigabytes from a string
 * @param {String} sizeString - a string ('5TB', '512 GB', '800MB', etc)
 * @returns storage size in Gigabytes (GB)
 */
const calculateStorageSizeFromString = (sizeString) => {
    console.log('converting to gigabytes: ' + sizeString)

    let size = sizeString.toUpperCase();

    if (size.includes('TB')) {
        size.replace('TB', '');
        const sizeTB = parseFloat(size);
        const sizeGB = 1000 * sizeTB;
        return sizeGB;
    }
    if (size.includes('GB')) {
        size.replace('GB', '');
        const sizeGB = parseFloat(size);
        return sizeGB;
    }
    if (size.includes('MB') ) {
        size.replace('MB', '');
        const sizeMB = parseFloat(size);
        const sizeGB = 0.001 * sizeMB;
        return sizeGB;
    }
}

/**
 * For a specified product and table, add the value
 * @param {} productid 
 * @param {*} table 
 * @param {*} value 
 * @returns 
 */
const queryAddProductCptb = async (productid, table, value) => {
    console.log('adding compatability data...')
    console.log(productid, table, value);
    return knex(table)
    .insert(knex.raw(`values ('${productid}', '${value}')`))
    .then(() => {
        console.log('inserted compatability data!');
    })
    .catch((err) => {
        console.log(`there was an eror updating the product's compatability: ${err}`);
        throw `there was an eror updating the product's compatability: ${err}`
    })
}


/*************************************
 *      CONTROLLER FUNCTIONS         *
 *************************************/

/**
 * For a given product cateogry,
 * returns an array of fields required to measure compatibility,
 * and the existing field options in the database.
 */
const getCompatibilityFields = async (req, res, next) => {
    const category = req.params['category'];
    console.log('category: ' + category)
    let fields = [];
    try {
        if (category === 'CPU' || category === 'Motherboard') {
            const cpuOptionsData = await queryCptbCpuOptions();
            const cpuOptions = cpuOptionsData.map((entry) => entry['socket']);
            console.log('cpu options:', cpuOptions);
            fields.push(['cpu socket', cpuOptions]);
        }
        if (category === 'Memory' || category === 'Motherboard') {
            const ramOptionsData = await queryCptbRamModulesOptions();
            const ramOptions = ramOptionsData.map((entry) => entry['module']);
            fields.push(['ram module', ramOptions]);
        }
        if (category === 'Memory' || category === 'Motherboard') {
            const ramSlotsOptionsData = await queryCptbRamSlotsOptions();
            const ramSlotsOptions = ramSlotsOptionsData.map((entry) => entry['slots']);
            fields.push(['ram slots', ramSlotsOptions]);
        }
        if (category === 'Case' || category === 'Motherboard') {
            const moboSizeOptionsData = await queryCptbMoboSizeOptions();
            const moboSizeOptions = moboSizeOptionsData.map((entry) => entry['size']);
            fields.push(['mobo size', moboSizeOptions]);
        }
        if (category === 'Storage') {
            const storageOptionsData = await queryCptbStorageOptions();
            const storageOptions = storageOptionsData.map((entry) => entry['type']);
            fields.push(['storage type', storageOptions]);
            const storageSizeOptionsData = await queryCptbStorageSizeOptions();
            const storageSizeOptions = storageSizeOptionsData.map((entry) => entry['size']);
            fields.push(['storage size', storageSizeOptions]);
        }

        console.log(fields);
        res.status(200).json({fields: fields});
    }
    catch (err) {
        res.status(400).json({error: `${err}`});
    }
}

/**
 * Inserts into the backend a product's compatibility fields
 */
const addCompatibilityFields = async (req, res, next) => {
    try {
        const category = req.body['category'];
        const productid = req.body['id'];
        const fields = req.body['fields'];
        console.log(category, productid, fields)
        if (category === 'CPU' || category === 'Motherboard') {
            await queryAddProductCptb(productid, 'cptb_cpu', fields['cpu socket']);
        }
        if (category === 'Memory' || category === 'Motherboard') {
            await queryAddProductCptb(productid, 'cptb_ram', fields['ram module']);
        }
        if (category === 'Memory' || category === 'Motherboard') {
            await queryAddProductCptb(productid, 'cptb_ram_slots', fields['ram slots']);
        }
        if (category === 'Case' || category === 'Motherboard') {
            await queryAddProductCptb(productid, 'cptb_mobo_size', fields['mobo size']);
        }
        if (category === 'Storage') {
            await queryAddProductCptb(productid, 'cptb_storage', fields['storage type']);
            await queryAddProductCptb(productid, 'cptb_storage_size', fields['storage size']);
        }
        res.status(200).json({message: `successfully added product's compatibility`});
    }
    catch (err) {
        res.status(400).json({error: `${err}`});
    }
}

/**
 * 
 * @param {*} allParts - all computer parts being analysed.
 * @param {*} result - the compatibility fields of the parts.
 * @param {*} inCompatibleParts - a list of parts which are incompatible, that may have already been added to by previous calls.
 * @returns true upon success, false if the function found incompatible items
 */
const getIncompatible = (allParts, result, inCompatibleParts) => {
    const oldCount = inCompatibleParts.length;
    let tally = {};
    for (entry of result) {
        // each tally entry has its compatability field as a key,
        // with an array of product ids which have the particular slot/ socket
        if (!tally[`${entry.field}`]) {
            tally[`${entry.field}`] = [entry.id]
        } else {
            tally[`${entry.field}`].push(entry.id);
        }
    }
    // if multiple keys (aka: compatability fields) exist, then find the one with the most components
    // and mark the non-majority as incompatible
    if (Object.keys(tally).length > 1) {
        const productsList = Object.values(tally);
        // get the longest array
        const compatible = productsList.reduce((prev, next) => prev.length < next.length ? next : prev);
        // whatevers not in the longest array is incompatible
        inCompatibleParts.push(...allParts.filter(item => !compatible.includes(item)));
    }
    const newCount = inCompatibleParts.length;

    if (newCount > oldCount) {
        return true;
    } else {
        return false;
    }
};

/**
 * Given a list of products, checks them for compatiility issues
 */
const checkCompatibility = async (req, res, next) => {
    const products = req.body['products'];
    try {
        // extract the parts
        const productCategories = await queryGetProductCategories(products);

        const cpuParts = products.filter(productid => productCategories[productid] === 'CPU')
        const moboParts = products.filter(productid => productCategories[productid] === 'Motherboard')
        const memoryParts = products.filter(productid => productCategories[productid] === 'Memory')
        const caseParts = products.filter(productid => productCategories[productid] === 'Case')

        let inCompatibleParts = [];
        let problemMessages = [];
        let warningParts = [];
        let warningMessages = [];

        let testPayloadIds = [];
        let result = [];
        let incompatibleBool = false;

        // check cpu-motherboard
        testPayloadIds = [...cpuParts, ...moboParts];
        result = await queryCompatibilityFields('cptb_cpu', testPayloadIds);
        incompatibleBool = getIncompatible(testPayloadIds, result, inCompatibleParts);
        if (incompatibleBool) {
            problemMessages.push('CPU(s) and Motherboard(s) are not compatible!')
        }
        // check same-ram
        if (memoryParts.length > 1) {
            testPayloadIds = [...memoryParts];
            result = await queryCompatibilityFields('cptb_ram', testPayloadIds);
            incompatibleBool = getIncompatible(testPayloadIds, result, inCompatibleParts);
            if (incompatibleBool) {
                problemMessages.push('Memory modules are not of the same type!')
            }
        }
        // check ram-motherboard
        testPayloadIds = [...memoryParts, ...moboParts];
        result = await queryCompatibilityFields('cptb_ram', testPayloadIds);
        incompatibleBool = getIncompatible(testPayloadIds, result, inCompatibleParts);
        if (incompatibleBool) {
            problemMessages.push('Memory module(s) and Motherboard(s) are not compatible!')
        }
        // check ram slots-motherboard
        if (moboParts.length === 1) {
            const moboRamSlots = await queryCompatibilityFields('cptb_ram_slots', moboParts);
            const moboRamSlotsCount = moboRamSlots[0].field;
            let ramSlotsTotal = 0;
            for (const memoryPart of memoryParts) {
                result = await queryCompatibilityFields('cptb_ram_slots', [memoryPart]);
                ramSlotsTotal += parseInt(result[0].field);
            }
            console.log('TOTAL RAM SLOTS: ' + ramSlotsTotal)
            if (ramSlotsTotal > moboRamSlotsCount) {
                inCompatibleParts.push(...memoryParts);
                problemMessages.push('Motherboard does not have enough memory slots!')
            }
        }
        // check case-motherboard
        testPayloadIds = [...caseParts, ...moboParts];
        result = await queryCompatibilityFields('cptb_mobo_size', testPayloadIds);
        incompatibleBool = getIncompatible(testPayloadIds, result, warningParts);
        if (incompatibleBool) {
            warningMessages.push('Warning: Motherboard(s) and Case(s) are of different sizes, be sure that the motherboard is not larger than the case!')
        }
        // check cpu-ram (if they can exist in the same system via any kind of motherboard)
        if (memoryParts.length > 0 && cpuParts.length > 0) {
            console.log(memoryParts)
            console.log(cpuParts)
            const memoryFields = await queryCompatibilityFields('cptb_ram', memoryParts)
            const cpuFields = await queryCompatibilityFields('cptb_cpu', cpuParts)
            result = await queryCommonMotherBoard(memoryFields.map((part)=> part.field), cpuFields.map((part)=> part.field));
            if (result.length === 0) {
                inCompatibleParts.push(testPayloadIds)
                problemMessages.push('CPU(s) are not compatible with the Memory module(s)');
            }
        }
        res.status(200).json({incompatible: inCompatibleParts, errorMessages: problemMessages, warning: warningParts, warningMessages: warningMessages});
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ error: `There was an error while processing products compatability ${err}` });
    }
}


module.exports = {
    getCompatibilityFields,
    addCompatibilityFields,
    checkCompatibility,
    queryGetProductCategories,
    queryCompatibilityFields,
    queryStorageSizeFromId,
    queryStorageTypeFromId
}