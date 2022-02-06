const knex = require('../database/orders') // orders.js
const dayjs = require('dayjs');

const { isValidDate, dateNowInIsoString } = require('./helper');



/**********************************
 *        Query FUNCTIONS         *
 *********************************/

/**
 * Queries the database for the most/ least popular products for sale within a date range
 * @param {String} startDate in YYYY-MM-DD
 * @param {String} endDate in YYYY-MM-DD
 * @param {number} num - the number of results
 * @param {String} sort - 'asc' or 'desc' order
 * @returns 
 */
const queryPopularItems = async (startDate, endDate, num, sort, category) => {
  if (!category) {
  category = '%%';
  }
  return knex('products')
  .leftJoin('sales', 'sales.productid', '=','products.id')
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id','products.name', 'products.brand', 'products.category', 'products.imgurl as img', 'products.description', 'products.price as gross_price', 'discounts.net_price')
  .whereIn('sales.id', function() {
    this.select('id').from('sales').whereBetween('date', [startDate, endDate])
  })
  .andWhere('products.category', 'LIKE', category)
  .count('sales.productid as totalsales')
  .groupBy('sales.productid')
  .orderBy('totalsales', sort)
  .limit(num)
  .then(popularItems => {
    console.log('popularItems')
    for (let item of popularItems) {
      if (item['net_price'] === null) {
        item['net_price'] = item['gross_price'];
      }
    }
    return popularItems;
  })
  .catch((err)=>{
    console.log(`Error obtaining popular sale items: ${err}`);
    throw(`Error obtaining popular sale items: ${err}`);
  });
}

const queryOtherItems = (num, productIds, category) => {
  console.log('querying other items for:' + category);
  if (!category) {
  category = '%%';
  }
  return knex('products')
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id','products.name', 'products.brand', 'products.category', 'products.imgurl as img', 'products.description', 'products.price as gross_price', 'discounts.net_price')
  .whereNotIn('products.id', productIds)
  .andWhere('products.category', 'LIKE', category)
  .limit(num)
  .then(otherItems => {
    console.log('other Items:')
    for (let item of otherItems) {
      if (item['net_price'] === null) {
        item['net_price'] = item['gross_price'];
      }
    }
    return otherItems;
  })
  .catch((err)=>{
    console.log(`Error obtaining other items: ${err}`);
    throw(`Error obtaining other items: ${err}`);
  });
}

const querySalesStatsOverall = async (startDate, endDate) => 
  knex('sales')
  .select('sales.date')
  .whereIn('sales.id', function() {
    this.select('id').from('sales').whereBetween('date', [startDate, endDate])
  })
  .count('id as totalsales')
  .sum('sales.net_price as revenue')
  .groupBy('sales.date')
  .orderBy('sales.date', 'asc')
  .then(salesStats => {
    console.log(salesStats)
    return salesStats;
  })
  .catch((err)=>{
    console.log(`Error obtaining sales statistics: ${err}`);
    throw(`Error obtaining sales statistics: ${err}`);
  });

const querySalesStatsByCategory = async (startDate, endDate, category) => 
  knex('sales')
  .join('products', 'products.id', '=','sales.productid')
  .select('sales.date')
  .whereIn('sales.id', function() {
    this.select('id').from('sales')
      .whereBetween('date', [startDate, endDate])
      .andWhere('category', category)
  })
  .count('sales.id as totalsales')
  .sum('sales.net_price as revenue')
  .groupBy('sales.date')
  .orderBy('sales.date', 'asc')
  .then(salesStats => {
    console.log(salesStats)
    return salesStats;
  })
  .catch((err)=>{
    console.log(`Error obtaining sales statistics: ${err}`);
    throw(`Error obtaining sales statistics: ${err}`);
  });



const querySalesStatsByProductId = async (startDate, endDate, productId) => 
  knex('sales')
  .join('products', 'products.id', '=','sales.productid')
  .select('sales.date')
  .whereIn('sales.id', function() {
    this.select('id').from('sales')
      .whereBetween('date', [startDate, endDate])
      .andWhere('sales.productid', productId)
  })
  .count('sales.id as totalsales')
  .sum('sales.net_price as revenue')
  .groupBy('sales.date')
  .orderBy('sales.date', 'asc')
  .then(salesStats => {
    console.log(salesStats)
    return salesStats;
  })
  .catch((err)=>{
    console.log(`Error obtaining sales statistics: ${err}`);
    throw(`Error obtaining sales statistics: ${err}`);
  });

const querySalesStatsByProductName = async (startDate, endDate, productName) => 
  knex('sales')
  .join('products', 'products.id', '=','sales.productid')
  .select('sales.date')
  .whereIn('sales.id', function() {
    this.select('id').from('sales')
      .whereBetween('sales.date', [startDate, endDate])
      .andWhere('products.name', 'like',  `%${productName}%`)
  })
  .count('sales.id as totalsales')
  .sum('sales.net_price as revenue')
  .groupBy('sales.date')
  .orderBy('sales.date', 'asc')
  .then(salesStats => {
    console.log(salesStats)
    return salesStats;
  })
  .catch((err)=>{
    console.log(`Error obtaining sales statistics: ${err}`);
    throw(`Error obtaining sales statistics: ${err}`);
  });


/**********************************
 *        HELPER FUNCTIONS        *
 **********************************/
/*
const isValidDate = (dateString) => {
  const regex = /^\d{4}\-\d{2}\-\d{2}$/;
  if (dateString.match(regex)) {
    return true;
  } else {
    return false;
  }
}
*/
const graphPlotsFromSalesData = (salesData, startDate, endDate) => {
  const salesStats = salesData.map((entry) => [entry.date, entry.totalsales, entry.revenue]);
  let dateLabels = [];
  let sales = [];
  let revenue = [];
  // make an array of dates from start to end
  let currDate = startDate;
  let currStat = 0;
  while (dayjs(currDate).isBefore(dayjs(endDate).add(1, 'day'), 'day')) {
    dateLabels.push(currDate);
    if (currStat < salesStats.length && salesStats[currStat][0] === currDate) {
      sales.push(salesStats[currStat][1]);
      revenue.push(salesStats[currStat][2]);
      currStat++;
    } else {
      sales.push(0);
      revenue.push(0);
    }
    currDate = dayjs(currDate).add(1, 'day').format('YYYY-MM-DD');
  }
  // console.log('stats:')
  // console.log({labels: dateLabels, data: sales, revenue: revenue})
  return {labels: dateLabels, data: sales, revenue: revenue};
};

/*************************************
 *       CONTROLLER FUNCTIONS        *
 *************************************/

/** 
 * Queries the database for the most/ least popular products for sale,
 * within a date range. 
 * Least popular is specified by a negative number in the 'order' query.
 * */
const salesGetPopularAdmin = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const num = req.query.num;
  const order = req.query.order;
  console.log(`start: ${startDate}, end: ${endDate}, num: ${num}, order: ${order}`);
  let sort = '';
  if (parseInt(order) < 0) {
    sort = 'asc' // least popular first
  } else {
    sort = 'desc' // most popular first (default)
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    let popularItems = await queryPopularItems(startDate, endDate, num, sort);
    const populatItemsId = popularItems.map((product) => product.id)
    const otherItems = await queryOtherItems(num - popularItems.length, populatItemsId);
    if (sort === 'desc') {
      popularItems.push(...otherItems);
    } else {
      popularItems.unshift(...otherItems);
    }
    // popularItems.push(...otherItems);
    res.status(200).json({products: popularItems});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get popular products: ${err}`});
    return;
  }
}

/** 
 * Queries the database for the most/ least popular products for sale,
 * within a date range. 
 * Least popular is specified by a negative number in the 'order' query.
 * */
const salesGetPopularByCategoryAdmin = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const num = req.query.num;
  const order = req.query.order;
  const category = req.params.category;
  console.log(`start: ${startDate}, end: ${endDate}, num: ${num}, order: ${order}, category: ${category}`);
  let sort = '';
  if (parseInt(order) < 0) {
    sort = 'asc' // least popular first
  } else {
    sort = 'desc' // most popular first (default)
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    const popularItems = await queryPopularItems(startDate, endDate, num, sort, category);
    const populatItemsId = popularItems.map((product) => product.id)
    const otherItems = await queryOtherItems(num - popularItems.length, populatItemsId, category);
    if (sort === 'desc') {
      popularItems.push(...otherItems);
    } else {
      popularItems.unshift(...otherItems);
    }
    // popularItems.push(...otherItems);

    res.status(200).json({products: popularItems});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get popular products: ${err}`});
    return;
  }
}

const salesStatsOverall = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  console.log(`start: ${startDate}, end: ${endDate}`);
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    const salesData = await querySalesStatsOverall(startDate, endDate);
    const graphPlots = graphPlotsFromSalesData(salesData, startDate, endDate);

    // res.status(200).json({sales: graphPlots});
    res.status(200).json({sales: {labels: graphPlots.labels, data: graphPlots.revenue}});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get sales statistics: ${err}`});
    return;
  }
}

const salesStatsByCategory = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const category = req.params.category;
  console.log(`start: ${startDate}, end: ${endDate}`);
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    const salesData = await querySalesStatsByCategory(startDate, endDate, category);
    const graphPlots = graphPlotsFromSalesData(salesData, startDate, endDate);
    // res.status(200).json({sales: graphPlots});
    res.status(200).json({sales: {labels: graphPlots.labels, data: graphPlots.data}});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get sales statistics by category: ${err}`});
    return;
  }
}

const salesStatsByProductId = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const productid = req.params.productid;
  console.log(`start: ${startDate}, end: ${endDate}`);
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    const salesData = await querySalesStatsByProductId(startDate, endDate, productid);
    const graphPlots = graphPlotsFromSalesData(salesData, startDate, endDate);
    res.status(200).json({sales: graphPlots});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get sales statistics by category: ${err}`});
    return;
  }
}

/**
 * gets the sales stastics of products whose names contain the given req.params.name
 */
const salesStatsByProductName = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const productName = req.params.name;
  console.log(`start: ${startDate}, end: ${endDate}`);
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    const salesData = await querySalesStatsByProductName(startDate, endDate, productName);
    const graphPlots = graphPlotsFromSalesData(salesData, startDate, endDate);
    res.status(200).json({sales: graphPlots});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get sales statistics by category: ${err}`});
    return;
  }
}

/** 
 * Queries the database for the most/ least popular products for sale,
 * within a date range. 
 * Least popular is specified by a negative number in the 'order' query.
 * Does not expose the explicit sales number
 * */
const salesGetPopular = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const num = parseInt(req.query.num);
  const order = req.query.order;
  console.log(`start: ${startDate}, end: ${endDate}, num: ${num}, order: ${order}`);
  let sort = '';
  if (parseInt(order) < 0) {
    sort = 'asc' // least popular first
  } else {
    sort = 'desc' // most popular first (default)
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    let popularItems = await queryPopularItems(startDate, endDate, num, sort);
    // hide the exact sales stats from the client
    const populatItemsId = popularItems.map((product) => product.id)
    const otherItems = await queryOtherItems(num - popularItems.length, populatItemsId);
    if (sort === 'desc') {
      popularItems.push(...otherItems);
    } else {
      popularItems.unshift(...otherItems);
    }
    popularItems.forEach(product => {
        delete product['totalsales']
    });
    res.status(200).json({products: popularItems});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get popular products: ${err}`});
    return;
  }
}
/** 
 * Queries the database for the most/ least popular products for sale,
 * within a date range. 
 * Least popular is specified by a negative number in the 'order' query.
 * Does not expose the explicit sales number
 * */
const salesGetPopularByCategory = async (req, res, next) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const num = req.query.num;
  const order = req.query.order;
  const category = req.params.category;
  console.log(`start: ${startDate}, end: ${endDate}, num: ${num}, order: ${order}`);
  let sort = '';
  if (parseInt(order) < 0) {
    sort = 'asc' // least popular first
  } else {
    sort = 'desc' // most popular first (default)
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  try {
    let popularItems = await queryPopularItems(startDate, endDate, num, sort, category);
    const populatItemsId = popularItems.map((product) => product.id)
    const otherItems = await queryOtherItems(num - popularItems.length, populatItemsId, category);
    if (sort === 'desc') {
      popularItems.push(...otherItems);
    } else {
      popularItems.unshift(...otherItems);
    }
    // hide the exact sales stats from the client
    popularItems.forEach(product => {
        delete product['totalsales']
    });
    res.status(200).json({products: popularItems});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to get popular products: ${err}`});
    return;
  }
}

module.exports = {
  salesGetPopularAdmin,
  salesGetPopularByCategoryAdmin,
  salesStatsOverall,
  salesStatsByCategory,
  salesStatsByProductId,
  salesStatsByProductName,
  salesGetPopular,
  salesGetPopularByCategory
}