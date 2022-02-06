// console.log('CURRENT directory: ' + process.cwd());
// const e = require('express');
// Import database
const knex = require('./../database/products') // products.js

const { isValidDate, dateNowInIsoString } = require('./helper');

// helper method converts an array of separate tag JSONs into an array of JSONs ready to be injected into database
// returns 0 if no tags given
const tagsToRows = (id, tags) => {
  if (tags instanceof Array && tags.length > 0) {
    // now extract tags into rows
    rowsToInsert = tags.map((tag) => (
      {
      'productid': id, 
      'tag': tag
      }
    ));
    return rowsToInsert;
  } else {
    return 0;
  }
}

/**
 * Adds a product to the database, with the option to exclude tags.
 * Takes from the req.body: 
 * {id, name, price, category, description, imgurl, available, stock, tags}
 */
const adminAddProduct = async (req, res, next) => 
  // Add new product to database's products table
  knex('products') // 'products' is the TABLE name, NOT the products.js file name
  .insert({ // insert new record, a product
    'id': req.body.id,
    'name': req.body.name,
    'brand': req.body.brand,
    'price': req.body.price,
    'category': req.body.category,
    'description': req.body.description,
    'imgurl': req.body.imgurl,
    'available': req.body.available,
    'stock': req.body.stock,
    'mailing_list': true,
    'date': dateNowInIsoString()
  })
  .then(() => {
    return tagsToRows(req.body.id, req.body.tags);
  })
  .then((tagEntries) => {
    if (tagEntries == 0) {
      return 0;
    } else {
      return knex('product_tags').insert(tagEntries);
    }
  })
  .then((insResult) => {
    if (insResult == 0) {
      console.log(`Product \'${req.body.name}\' created with no tags.`);
      res.status(200).json({ message: `Product \'${req.body.name}\' created with no tags.`});
    } else {
      console.log(`Product \'${req.body.name}\' created with ${req.body.tags.length} tags.`);
      res.status(200).json({ message: `Product \'${req.body.name}\' created with ${req.body.tags.length} tags.`})
    } 
  })
  .catch(err => {
    console.log('CAUGHT ERROR:\n' + err);
    res.status(400).json({ error: `There was an error creating ${req.body.name} product: ${err}` });
  })
  // debugging prints:
  /*
  .then(() => {
    knex.select('*').from('products')
      .then(data => console.log('new data:', data))
      .catch(err => console.log(err))
  })
  .then(() => {
    knex.select('*').from('product_tags')
      .then(data => console.log('new data:', data))
      .catch(err => console.log(err))
  })
  */

/**
 * Edits an existing product's details 
 * Takes from the req.body: 
 * {id, name, price, category, description, imgurl, available, stock, tags}
 */
const adminEditProduct = async (req, res, next) => {
  try {
    await knex('products') // 'products' is the TABLE name, NOT the file name
      .where('id', req.body.id)
      .update({
        'name': req.body.name,
        'brand': req.body.brand,
        'price': req.body.price,
        'category': req.body.category,
        'description': req.body.description,
        'imgurl': req.body.imgurl,
        'available': req.body.available,
        'stock': req.body.stock
      })
      .then(() => {
        console.log(`Product \'${req.body.id}\' successfully updated`);
      })
      .catch(err => {
        throw (`Error updating product ${req.body.id} details: ${err}`);
      })

    // now edit tags
    await knex('product_tags')
      .where('productid', req.body.id)
      .del()
      .then(() => {
        return tagsToRows(req.body.id, req.body.tags);
      })
      .then((tagEntries) => {
        if (tagEntries == 0) {
          return 0;
        } else {
          return knex('product_tags').insert(tagEntries);
        }
      })
      .then(() => {
        res.status(200).json({ message: `Product tags of \'${req.body.id}\' successfully updated`});
      })
      .catch(err => {
        throw (`There was an error updating tags for product ${req.body.id}: ${err}`);
      })
  }
  catch (err) {
    console.log('CAUGHT ERROR: ' + err);
    res.status(400).json({ error: `${err}` });
  }
}


/**
 * Permanently deletes a product from the database
 * req.body: {id: "productid"}
 */
const adminDeleteProduct = async (req,res,next) => 
  knex('products')
  .where('id', req.body.id)
  .del()
  .then(()=> {
    console.log(`deleted ${req.body.id}`)
    res.status(200).json({ message: `Product ${req.body.id} successfully deleted.` });
  })
  .catch((err)=>{
    console.log(err);
    res.status(400).json({ error: `There was an error deleting product ${req.body.id}: ${err}` });
  })
  // debugging prints:
  /*
  .then(() => {
    knex.select('*').from('products')
      .then(data => console.log('new data:', data))
      .catch(err => console.log(err))
  })
  .then(() => {
    knex.select('*').from('product_tags')
      .then(data => console.log('new data:', data))
      .catch(err => console.log(err))
  })
  */

/**
 * Adds a discount into the database, which is active from within its given date range
 * @param - req.body: {productid, net_price, start, end}
 */
const adminAddDiscount = async (req, res, next) => {
  const startDate = req.body.start;
  const endDate = req.body.end;
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  } else if (startDate > endDate) {
    res.status(400).json({error: `start date must be before end date`});
    return;
  }
  return knex('discounts') // 'products' is the TABLE name, NOT the products.js file name
  .insert({ // insert new record, a product
    'productid': req.body.productid,
    'net_price': req.body.net_price,
    'start': startDate,
    'end': endDate,
    'mailing_list': true,
  })
  .then(()=> {
    console.log(`Discount added for product \'${req.body.productid}\' at net_price: ${req.body.net_price}, from ${startDate} to ${endDate}.`);
    res.status(200).json({ message: `Discount added for product \'${req.body.productid}\' at net_price: ${req.body.net_price}, from ${startDate} to ${endDate}.`});
  })
  .catch(err => {
    console.log('CAUGHT ERROR:\n' + err);
    res.status(400).json({ error: `There was an error creating the discount: ${err}` });
  })
  // debugging prints:
  /*
  .then(() => {
    knex.select('*').from('discounts')
      .then(data => console.log('new data:', data))
      .catch(err => console.log(err))
  })
  */
}



/**
 * Adds a discount into the database, which is active from within its given date range
 * @param - req.body: {productid, net_price, start, end}
 */
const adminEditDiscount = async (req, res, next) => {
  const startDate = req.body.start;
  const endDate = req.body.end;
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    res.status(400).json({error: `start or end date must be in the format 'YYYY-MM-DD'`});
    return;
  } else if (startDate > endDate) {
    res.status(400).json({error: `start date must be before end date`});
    return;
  }
  return knex('discounts') // 'products' is the TABLE name, NOT the products.js file name
  .where('discounts.id', req.body.discountid)
  .update({ // insert new record, a product
    'productid': req.body.productid,
    'net_price': req.body.net_price,
    'start': startDate,
    'end': endDate,
    'mailing_list': true,
  })
  .then(()=> {
    console.log(`Discount updated for product \'${req.body.productid}\' at net_price: ${req.body.net_price}, from ${startDate} to ${endDate}.`);
    res.status(200).json({ message: `Discount added for product \'${req.body.productid}\' at net_price: ${req.body.net_price}, from ${startDate} to ${endDate}.`});
  })
  .catch(err => {
    console.log('CAUGHT ERROR:\n' + err);
    res.status(400).json({ error: `There was an error creating ${req.body.name} product: ${err}` });
  })
}

/**
 * Obtains all the users in the database
 * @returns All of the users in the database
 */
const adminGetAllUsers = async (req, res, next) => {
  // Select all the accounts
  knex('accounts')
  .select('id as customer_id',  'first_name', 'last_name', 'email', 'phone', 'registration_date', 'termination_date', 'permissions')
  .then((accounts) => {
    res.status(200).json({
      users: accounts
    })
  })
  .catch((err) => {
    res.status(400).json({ error: 'There was an error searching up the database for all users'})
  })
}

/**
 * Obtains all of the admins in the database
 * @returns All of the admins in the database
 */
const adminGetAllAdmins = async (req, res, next) => {
  // Select all the accounts which have admin privileges
  knex('accounts')
  .select('id as customer_id', 'first_name', 'last_name', 'email', 'phone', 'registration_date', 'termination_date', 'permissions')
  .where('permissions', 'admin')
  .then((accounts) => {
    res.status(200).json({
      admin: accounts
    })
  })
  .catch((err) => {
    res.status(400).json({ error: 'There was an error searching up the database for admins'})
  })
}

/**
 * Obtains a single admin in the database given a customer id
 * @returns A single admin in the database
 */
const adminGetSingleUser = async (req, res, next) => {
  const customer_id = req.params.customer_id;

  knex('accounts')
  .select('first_name', 'last_name', 'email', 'phone', 'registration_date', 'termination_date', 'permissions')
  .where ('id', customer_id)
  .then((account) => {
    if (account.length == 0) throw "User does not exist"
    console.log(`Account with id: ${customer_id} found: \n`)
    console.log(account)
    res.status(200).json({
      customer_id: customer_id,
      first_name: account[0].first_name,
      last_name: account[0].last_name,
      email: account[0].email,
      phone: account[0].phone,
      registration_date: account[0].registration_date,
      termination_date: account[0].termination_date,
      permissions: account[0].permissions
    })
  })
  .catch((err) => {
    res.status(400).json({ error: `There was an error finding the user: ${err}` })
  })
}

/**
 * Turns an account with user privileges into admin
 * @param req.body : {termination_date, customer_id, status}
 */
const adminSet = async (req, res, next) => {
  let termination = req.body.termination_date;
  
  if (!isValidDate(termination)) {
    res.status(400).json({error: `termination date must be in the format 'YYYY-MM-DD'`});
    return;
  }
  
  // check status
  const today = dateNowInIsoString();
  if (termination <= today) {
    res.status(400).json({error: "termination date must be a future date"})
  }
  
  const customer_id = req.body.customer_id
  const permissions = (req.body.status == 'Active') ? 'admin' : 'user';
  termination = (permissions == 'admin') ? termination : null;
  
  knex('accounts')
  .where('id', customer_id)
  .update({
    permissions: permissions,
    termination_date: termination
  })
  .then(() => {
    console.log(`Updated the account with id: ${customer_id}...`)
    res.status(200).json({ message: `Updated the account with id: ${customer_id}`})
  })
  .catch((err) => {
    res.status(400).json({ error: `There was an error updating the account id: ${customer_id}...:${err}`})
  })
}

/**
 * Checks the termination dates and updates admins to users if the termination date has passed
 */
const checkAdminDates = async () => {
  knex('accounts')
  .where('termination_date', '<', dateNowInIsoString())
  .update({
    permissions: 'user',
    termination_date: null
  })
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    throw `Therw was an error with checking termination_dates: ${err}`
  })
}


module.exports = {
    adminAddProduct,
    adminEditProduct,
    adminDeleteProduct,
    adminAddDiscount,
    adminEditDiscount,
    adminGetAllUsers,
    adminGetAllAdmins,
    adminGetSingleUser,
    adminSet,
    checkAdminDates
}