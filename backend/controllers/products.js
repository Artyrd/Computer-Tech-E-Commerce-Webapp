const knex = require('./../database/products'); // products.js
const { dateNowInIsoString, isValidDate } = require('./helper');
// note that this is all writing into stargate.db


/*****************************************
 *       HELPER METHODS & QUERIES        *
 *****************************************/

/**
 * Helper method to find product info
 */
const productInfoAllQuery = () => 
  knex('products') // 'products' is the TABLE name, NOT the products.js file name
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id', 'products.name', 'products.brand', 'products.price as gross_price', 'discounts.net_price', 'products.category', 'products.description', 'products.imgurl', 'products.available')
  .orderBy('date', 'desc')
  .then((productData) => {
    // if (productData.length == 0) {
    //   throw(`products not found`);
    // }
    return productData;
  })
  .then((productInfo)=>{
    // if no discount found, net = gross
    for (let product of productInfo) {
      if (product['net_price'] === null) {
      // if (productInfo['net_price'] === null) {
        product['net_price'] = product['gross_price'];
      } 
    }
    return productInfo;
  })
  .catch(err => {
    throw(`${err}`);
    // throw(`There was an error finding product ${productid} in the database: ${err}`);
  });

/**
 * Helper method to find product info
 */
const productInfoFromCategoryQuery = (category) => 
  knex('products') // 'products' is the TABLE name, NOT the products.js file name
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id', 'products.name', 'products.brand', 'products.price as gross_price', 'discounts.net_price', 'products.category', 'products.description', 'products.imgurl', 'products.available')
  .where('products.category', 'like', category)
  .orderBy('date', 'desc')
  .then((productData) => {
    // if (productData.length == 0) {
    //   throw(`products not found`);
    // }
    return productData;
  })
  .then((productInfo)=>{
    // if no discount found, net = gross
    for (let product of productInfo) {
      if (product['net_price'] === null) {
        product['net_price'] = product['gross_price'];
      } 
    }
    return productInfo;
  })
  .catch(err => {
    throw(`${err}`);
    // throw(`There was an error finding product ${productid} in the database: ${err}`);
  });



/**
 * Helper method to query database and find product info
 */
const productInfoQuery = (productid) => 
  knex('products') // 'products' is the TABLE name, NOT the products.js file name
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id', 'products.name', 'products.brand', 'products.price as gross_price', 'discounts.net_price', 'products.category', 'products.description', 'products.imgurl', 'products.available')
  .where('products.id', productid)
  .then((productData) => {
    if (productData.length == 0) {
      throw(`productid not found`);
    }
    return productData[0];
  })
  .then((productInfo)=>{
    // if no discount found, net = gross
    if (productInfo['net_price'] === null) {
      productInfo['net_price'] = productInfo['gross_price'];
    } 
    return productInfo;
  })
  .catch(err => {
    throw(`${err}`);
    // throw(`There was an error finding product ${productid} in the database: ${err}`);
  });

/**
 * Helper promise to find products tags, assuming product id is correct
 * returns empty array if no tags for the specified productid are found.
 */
const productTagsQuery = (productid) => 
  knex('product_tags')
  .select('tag')
  .where('productid', productid)
  .then((tags)=> {
    // convert [{tag: a}, {tag: b}, {tag: c}] to => [a, b, c]
    return tags.map(row=>row.tag);
  })
  .catch(err=>{
    throw(`There was an error finding product tags for ${productid} in the database: ${err}`);
  });
 
 /**
 * Helper promise to find all existing products ids.
 */
const productAllIdsQuery = () => 
  knex('products')
  .select('id')
  .then((ids)=> {
    console.log('ids are: ' + JSON.stringify(ids));
    // convert [{tag: a}, {tag: b}, {tag: c}] to => [a, b, c]
    return ids.map(row=>row.id);
  })
  .catch(err=>{
    throw(`There was an error finding all product ids in the database: ${err}`);
  });


/**
 * Queries the db for all discounts entered in the system
 * @param orderColumn - the specific column to sort the data by
 * @param order - 'asc' or 'desc' order
 */
const discountsAllQuery = (orderColumn, order) =>
  knex('discounts')
  .join('products', 'products.id', '=', 'discounts.productid')
  .select('discounts.id', 'discounts.productid', 'products.name', 'products.imgurl', 'products.price as gross_price', 'discounts.net_price', 'discounts.start as start_date', 'discounts.end as end_date')
  .orderBy(orderColumn, order)
  .then((data) => {
    console.log(data);
    return data;
  })
  .catch((err) => {
    throw(`There was an error querying discounts: ${err}`);
  })
   
/**
 * Queries the db for all discounts entered in the system
 * @param orderColumn - the specific column to sort the data by
 * @param order - 'asc' or 'desc' order
 * @param date - the date you wish to view active discounts
 */
const discountsActiveQuery = (orderColumn, order, date) =>
  knex('discounts')
  .join('products', 'products.id', '=', 'discounts.productid')
  .select('discounts.id', 'discounts.productid', 'products.name', 'products.brand', 'products.imgurl', 'products.price as gross_price', 'discounts.net_price', 'discounts.start as start_date', 'discounts.end as end_date')
  .where('discounts.start','<=', date)
  .andWhere('discounts.end', '>=', date)
  .orderBy(orderColumn, order)
  .then((data) => {
    return data;
  })
  .catch((err) => {
    throw(`There was an error querying discounts: ${err}`);
  })

/**
 * Given a discountid, queries the db for the specific discount
 */
const discountFromIdQuery = (productid, order) =>
  knex('discounts')
  .join('products', 'products.id', '=', 'discounts.productid')
  .select('discounts.id', 'discounts.productid', 'products.name', 'products.brand', 'products.imgurl', 'products.price as gross_price', 'discounts.net_price', 'discounts.start as start_date', 'discounts.end as end_date')
  .where('products.id', '=', productid)
  .orderBy('discounts.start', order)
  .then((data) => {
    console.log(data);
    if (data.length === 0) {
      throw('No discounts exist for the productid');
    }
    return data;
  })
  .catch((err) => {
    console.log(`There was an error querying discounts for the product id\'${productid}\': ${err}`);
    throw(`There was an error querying discounts for the product id\'${productid}\': ${err}`);
  })

/**
 * Searches the database for products that match the search query using keywords
 * @param productInfo The 
 * @param productTags 
 * @param word 
 * @param score 
 * @returns 
 */
const searchContains = async (productInfo, productTags, word, score) => {
  const name = productInfo.name.toLowerCase()
  const description = productInfo.description.toLowerCase()
  const category = productInfo.category.toLowerCase()
  let flag = false

  // Search if the name includes the word
  if (name.includes(word.toLowerCase())) {
    flag = true
  }

  // Search if the category includes the word
  if (category.includes(word.toLowerCase())) {
    flag = true
  }
  // Search if the description includes the word
  if (description.includes(word.toLowerCase())) {
    flag = true
  }

  // Search the tags if it includes the word
  for (const tag of productTags) {
    if (tag.toLowerCase().includes(word.toLowerCase())) {
      flag = true
    }
  }

  // If a match has been found, increment the product score
  if (flag) {
    if (score[`${productInfo.id}`]) {
      score[`${productInfo.id}`]++;
    } else {
      score[`${productInfo.id}`] = 1;
    }
  }
  return flag
}

/**
 * Adds an item to a customer's wishlist
 * @param customerid The customerid of the user
 * @param productid The product id of the product
 */
const addWishlistCustomerid = async (customerid, productid) => {
  return await knex('wishlists')
  .insert({
    'customerid': customerid,
    'productid': productid 
  })
  .then(() => {
    return
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
    throw `Error: ${err}`
  })
}

/**
 * Obtains all the items in the wishlist for a user
 * @param customerid The customerid of the user
 * @returns All the products in the wishlist for a user
 */
const getWishlistCustomerid = async (customerid) => {
  // Search wishlist database for matching customerid
  return await knex('wishlists')
  .join('products', 'wishlists.productid', '=', 'products.id')
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id as productid', 'products.name as name', 'products.brand', 'products.imgurl as imgurl', 'products.price as gross_price', 'discounts.net_price as net_price')
  .where('wishlists.customerid', customerid)
  .then((result) => {
    console.log(result)
    return result
  })
  .catch((err) => {
    throw `There was an error querying the wishlists: ${err}`
  })
}

/**
 * Clears the entire wishlist for a customer
 * @param customerid The customerid for the user
 */
const clearWishlistCustomerid = async (customerid) => {
  // Search for the customerid in the wishlists database, then delete
  return await knex('wishlists')
  .where('customerid', customerid)
  .del()
  .then(() => {
    return
  })
  .catch((err) => {
    throw `There was an error deleting the wishlist: ${err}`
  })
}

/**
 * Deletes a single product from the user's wishlist
 * @param customerid The customerid for the user
 * @param productid The productid for the product
 */
const deleteSingleWishlistCustomerid = async (customerid, productid) => {
  // Search the wishlists database for customerid and productid and delete if found
  return await knex('wishlists')
  .where('customerid', customerid)
  .andWhere('productid', productid)
  .del()
  .then(() => {
    return
  })
  .catch((err) => {
    throw `There was an error deleting the single item: ${err}`
  })
}

/*************************************
 *         MAIN CONTROLLERS          *
 *************************************/

/**
 * Obtains all the products in the database that match the description found in the search box.
 * Returns items found in order of most matches
 * @param req.query : {query}
 * @returns All the products that match the keywords in the search
 */
const productsViewSearch = async (req, res, next) => {
  const search = req.query.query;

  let promiseList = []
  let searchList = []
  try {
    if (search == undefined) {
      throw "There was no input"
    }
    console.log(`Searching product with keyword: ${search}`)
    const queryArray = search.split(' ')
    const productsInfo = await productInfoAllQuery();
    for (const product of productsInfo) {
      promiseList.push(productTagsQuery(product['id']));
    }
    
    const productTags = await Promise.all(promiseList);
    
    let score = {};
    
    for (const index in productsInfo) {
      productInfo = {
        id: productsInfo[index].id,
        name: productsInfo[index].name,
        gross_price: productsInfo[index].gross_price,
        net_price: productsInfo[index].net_price,
        category: productsInfo[index].category,
        description: productsInfo[index].description,
        imgurl: productsInfo[index].imgurl,
        available: productsInfo[index].available,
        stock: productsInfo[index].stock,
        tags: productTags[index]
      }
      for (const word of queryArray) {
        // console.log(productsInfo[index])
        if (await searchContains(productInfo, productTags[index], word, score)) {
          if (searchList.indexOf(productInfo) === -1) {
            searchList.push(productInfo)
          }
        }
      }
    }

    // searchList sort by the score dict
    searchList.sort((a,b) => score[`${b.id}`] - score[`${a.id}`])
    console.log(searchList)
    console.log(score)
    
    res.status(200).json({products: searchList})

  } catch (error) {
    console.log(`There was an error finding product with query: ${search}: ${error}` );
    res.status(400).json({ error: `There was an error finding product with query: ${search}: ${error}` });
  }
}

/**
 * Adds an item to the wishlist database
 * @param req.body : {product_id}
 * @param req.params : {customerid}
 */
const addWishlist = async (req, res, next) => {
  try {
    const productid = req.body.product_id
    const customerid = req.params.customerid
    if (productid == undefined || customerid == undefined) throw 'No Customerid or Productid given'
    await addWishlistCustomerid(customerid, productid)
    console.log(`Added ${productid} to wishlist.`)
    res.status(200).json({ message: `Added ${productid} to wishlist.`})
    
  } catch (error) {
    console.log(`There was an error adding to the wishlist: ${error}`)
    res.status(400).json({ error: `There was an error adding to the wishlist: ${error}` })
  }
}

/**
 * Obtains the whole wishlist for a customer
 * @param req.params : {customerid}
 */
const getWishlist = async (req, res, next) => {
  try {
    const customerid = req.params.customerid
    if (customerid == undefined) throw 'No customerid given'
    const products = await getWishlistCustomerid(customerid)
    res.status(200).json({ products: products })

  } catch (error) {
    console.log(`There was an error getting the wishlist: ${error}`)
    res.status(400).json({ error: `There was an error getting the wishlist: ${error}` })
  }
}

/**
 * Deletes a single item from the wishlist for a customer
 * @param req.body : {products}
 * @param req.params : {customerid}
 */
const editWishlist = async (req, res, next) => {
  try {
    const customerid = req.params.customerid
    const products = req.body.products
    if (products == undefined || customerid == undefined) throw 'No Customerid or Products given'
    for (product of products) {
      await deleteSingleWishlistCustomerid(customerid, product)
      console.log(`Deleted: ${product}`)
    }
    console.log(`Successfully deleted items from wishlist`)
    res.status(200).json({ message: `Successfully deleted items from wishlist`})
  } catch (error) {
    console.log(`There was an error trying to edit the wishlist: ${error}` )
    res.status(400).json({ error: `There was an error trying to edit the wishlist: ${error}` })
  }
}

/**
 * Clears the whole wishlist for a customer
 * @param req.params : {customerid}
 */
const clearWishlist = async (req, res, next) => {
  try {
    const customerid = req.params.customerid
    if (customerid == undefined) throw 'No customerid given'
    await clearWishlistCustomerid(customerid)
    res.status(200).json({ message: `Successfully cleared wishlist from customerid: ${customerid}` })
    
  } catch (error) {
    console.log(`There was an error clearing the wishlist: ${error}`)
    res.status(400).json({ error: `There was an error clearing the wishlist: ${error}` })
  }

}

/**
 * Finds a product's details from its id
 */
const productsView = async (req, res, next) => {
  const { productid, } = req.params;
  console.log('GET product id is: ' + productid);

  let productInfo, productTags;
  try {
    productInfo = await productInfoQuery(productid);
  }
  catch (err) {
    console.log(`There was an error finding product ${productid}: ${err}` );
    res.status(400).json({ error: `There was an error finding product ${productid} : ${err}` });
    return;
  }
  try {
    productTags = await productTagsQuery(productid);
  }
  catch (err) {
    console.log(`There was an error finding product ${productid} tags: ${err}` );
    res.status(400).json({ error: `There was an error finding product tags for ${productid} : ${err}` });
    return;
  }

  console.log("making product view payload");
  res.status(200).json({
    id: productInfo.id,
    name: productInfo.name,
    brand: productInfo.brand,
    gross_price: productInfo.gross_price,
    net_price: productInfo.net_price,
    category: productInfo.category,
    description: productInfo.description,
    imgurl: productInfo.imgurl,
    available: productInfo.available,
    stock: productInfo.stock,
    tags: productTags
  })
  console.log(productInfo);
}


/**
 * Get the details of all products,
 * makes better use of async functions for a faster response
 */
const productsViewAllFaster = async (req, res, next) => {
  // let productids, productInfo, productTags;
  let productsList = [];
  try {
    const productsInfo = await productInfoAllQuery();
    let promiseList = [];
    for (const product of productsInfo) {
      promiseList.push(productTagsQuery(product['id']));
    }
    const productTags = await Promise.all(promiseList);
    for (const index in productsInfo) {
      productsList.push({
        'id': productsInfo[index].id,
        'name': productsInfo[index].name,
        'brand': productsInfo[index].brand,
        'gross_price': productsInfo[index].gross_price,
        'net_price': productsInfo[index].net_price,
        'category': productsInfo[index].category,
        'description': productsInfo[index].description,
        'imgurl': productsInfo[index].imgurl,
        'available': productsInfo[index].available,
        'stock': productsInfo[index].stock,
        'tags': productTags[index]
      })
    }
    res.status(200).json({products: productsList})
  }
  catch (err) {
    console.log(`There was an error finding all products: ${err}` );
    res.status(400).json({ error: `There was an error finding all products: ${err}` });
  }
};

const productsViewByCategory = async (req, res, next) => {
    const category = req.params['category'];
    let productsList = [];
    try {
        const productsInfo = await productInfoFromCategoryQuery(category);
        let promiseList = [];
        for (const product of productsInfo) {
        promiseList.push(productTagsQuery(product['id']));
        }
        const productTags = await Promise.all(promiseList);
        for (const index in productsInfo) {
        productsList.push({
            'id': productsInfo[index].id,
            'name': productsInfo[index].name,
            'brand': productsInfo[index].brand,
            'gross_price': productsInfo[index].gross_price,
            'net_price': productsInfo[index].net_price,
            'category': productsInfo[index].category,
            'description': productsInfo[index].description,
            'imgurl': productsInfo[index].imgurl,
            'available': productsInfo[index].available,
            'stock': productsInfo[index].stock,
            'tags': productTags[index]
        })
        }
        res.status(200).json({products: productsList})
    }
    catch (err) {
        console.log(`There was an error finding products for category ${category}: ${err}` );
        res.status(400).json({ error: `There was an error finding all products: ${err}` });
    }
};

/**
 * Get the details of all products
 * @deprecated - awaiting promises & querying in a loop is inefficient, 
 * see productsViewAllFaster()
 */
const productsViewAll = async (req, res, next) => {
  let productids, productInfo, productTags;
  let productsList = [];
  try {
    productids = await productAllIdsQuery();
  }
  catch (err) {
    console.log(`There was an error finding all products: ${err}` );
    res.status(400).json({ error: `There was an error finding all products: ${err}` });
    return;
  }
  for (const productid of productids) {
    try {
      productInfo = await productInfoQuery(productid);
      productTags = await productTagsQuery(productid);
    }
    catch (err) {
      console.log(`There was an error finding product ${productid} tags: ${err}` );
      res.status(400).json({ error: `There was an error finding product information for ${productid} : ${err}` });
      return;
    }
    console.log(`making product view payload for ${productid}`);
    productsList.push({
      id: productInfo.id,
      name: productInfo.name,
      brand: productInfo.brand,
      gross_price: productInfo.gross_price,
      net_price: productInfo.net_price,
      category: productInfo.category,
      description: productInfo.description,
      imgurl: productInfo.imgurl,
      available: productInfo.available,
      stock: productInfo.stock,
      tags: productTags
    })
  }
  res.status(200).json({products: productsList})
}

/**
 * Gets all discounts registered in the database.
 * @param: req.query.orderBy - the specified column to order results by, defaults to discount id (aka, order the discount was created).
 * @param: req.query.order - int, < 0 for descending order, ascending otherwise (and by default)
 */
const discountsViewAll = async (req, res, next) => {
  let orderColumn = req.query.orderby;
  let order = req.query.order;
  console.log(orderColumn, order);

  if (orderColumn == undefined) {
    orderColumn = 'discounts.id';
  }
  if (parseInt(order) < 0) {
    order = 'desc'
  } else {
    order = 'asc'
  }
  try {
    const discountsList = await discountsAllQuery(orderColumn, order);
    res.status(200).json({discounts: discountsList})
    return;
  }
  catch (err) {
    res.status(400).json({ error: `${err}` });
  }
}

/**
 * Gets all discounts registered in the database.
 * @param: req.query.orderBy - the specified column to order results by, defaults to discount id (aka, order the discount was created).
 * @param: req.query.order - int, < 0 for descending order, ascending otherwise (and by default)
 */
const discountsViewActive = async (req, res, next) => {
  let orderColumn = req.query.orderby;
  let order = req.query.order;
  let date = req.query.date;
  console.log(orderColumn, order);
  if (!isValidDate(date)) {
    date = dateNowInIsoString();
  }
  if (orderColumn == undefined) {
    orderColumn = 'discounts.id';
  }
  if (parseInt(order) < 0) {
    order = 'desc'
  } else {
    order = 'asc'
  }
  try {
    const discountsList = await discountsActiveQuery(orderColumn, order, date);
    console.log('active disounts:')
    console.log(discountsList);
    res.status(200).json({discounts: discountsList})
    return;
  }
  catch (err) {
    res.status(400).json({ error: `${err}` });
  }
}

/**
 * Gets all discounts registered in the database associated with the productid
 * @param: req.query.orderBy - the specified column to order results by, defaults to discount id (aka, order the discount was created).
 * @param: req.query.order - int, < 0 for descending order, ascending otherwise (and by default)
 */
const discountsViewFromId = async (req, res, next) => {
  const productid = req.params.productid;
  let order = req.query.order;
  console.log(productid, order);
  if (parseInt(order) < 0) {
    order = 'desc'
  } else {
    order = 'asc'
  }
  try {
    const discountData = await discountFromIdQuery(productid, order);
    res.status(200).json({discount: discountData})
    return;
  }
  catch (err) {
    res.status(400).json({ error: `${err}` });
  }
}


module.exports = {
  productInfoQuery,
  productInfoAllQuery,
  productTagsQuery,
  productsView,
  productsViewAll,
  productsViewAllFaster,
  productsViewByCategory,
  discountsViewActive,
  discountsViewAll,
  discountsViewFromId,
  addWishlist,
  editWishlist,
  clearWishlist,
  getWishlist,
  productsViewSearch,
}
