// console.log('CURRENT directory: ' + process.cwd());
// const e = require('express');
// Import database
const knex = require('./../database/orders') // orders.js
const dayjs = require('dayjs');
const { dateNowInIsoString } = require('./helper');
// note that this is all writing into stargate.db


/**********************************
 *       HELPER FUNCTIONS        *
 *********************************/

/**
 * Queries the database for products and their price
 * In future, can return gross and net prices from discounts
 * @param {*} productids - and array of id strings
 * @returns an array of json pairs {productid: id, price: float}
 */
 const queryProductFromId = async (productid) => {
  // console.assert(productids instanceof Array && productids.length > 0);
  return knex('products') // 'products' is the TABLE name, NOT the products.js file name
  .leftJoin('discounts', function() {
    this.on('products.id', '=', 'discounts.productid')
    // validate the discount is active today
    this.andOnVal('discounts.start', '<=', dateNowInIsoString())
    this.andOnVal('discounts.end', '>=', dateNowInIsoString())
  })
  .select('products.id', 'products.price as gross_price', 'discounts.net_price')
  .where('products.id', '=', productid)
  .then((productData) => {
    if (productData.length == 0) {
      throw(`productids ${productid} not found`);
    } else {
      // console.log(productData);
      return productData[0];
    }
  })
  .then((product)=> {
    // for (const product of productsData) {
      // if discount's net_price didnt give anything, net = gross
      if (!product['net_price']) {
        product['net_price'] = product['gross_price'];
      }
    // }
    return product;
  })
  .catch(err => {
    throw(`There was an error finding product ${productid} in the database: ${err}`);
  });
}


const queryAddSales = async (products) => {
  // map products to rows to insert
  const saleRows = products.map((product) => ({
    'productid': product.id,
    'gross_price': product.gross_price,
    'net_price': product.net_price,
    'date': dayjs().format('YYYY-MM-DD'),
    'discountid': ''
  }));

  let saleIds = [];
  for (row of saleRows) {
    let saleId = await knex('sales')
      .insert(row)
      .then((salesData) => {
        if (salesData.length == 0) {
          throw(`saleid not found`);
        } else {
          return salesData[0];
        }
      })
      .catch(err => {
        throw(`Error adding sale entries: ${err}`);
      });
    saleIds.push(saleId);
  }
return saleIds;
}

/**
 * Add new order to database's order table
 */
const queryAddOrder = async(orderDetails, products) => {
  // get the total price
  const totalPrice = products.reduce((total, product) => (total + product.net_price), 0);
  const orderEntry = ({
    customerid: orderDetails.customerid,
    first_name: orderDetails.first_name,
    last_name: orderDetails.last_name,
    email: orderDetails.email,
    phone_number: orderDetails.phone_number,
    address: orderDetails.delivery_address,
    delivery_option: orderDetails.delivery_option,
    discount_code: orderDetails.discount_code,
    total: totalPrice,
    date: dayjs().format('YYYY-MM-DD'),
    payment_method: orderDetails.payment_method,
    insured: orderDetails.insured,
    status: 'Pending'
  });

  return await knex('orders')
    .insert(orderEntry) // insert the order entry, and get the db generated orderid
    .then((orderData) => {
        if (isNaN(orderData)) {
          throw (`The created order has no order id: ${orderData}`);
        }
        return orderData[0]; //order id is wrapped in an array
    })
    .catch(err => {
      throw (`There was an error creating the order entry: ${err}` );
    })
};

/**
 *  Update new order to database's order table
 */
const queryUpdateOrderAdmin = async(orderDetails) => {
  const orderEntry = ({
    customerid: orderDetails.customerid,
    first_name: orderDetails.first_name,
    last_name: orderDetails.last_name,
    email: orderDetails.email,
    phone_number: orderDetails.phone_number,
    address: orderDetails.delivery_address,
    delivery_option: orderDetails.delivery_option,
    discount_code: orderDetails.discount_code,
    // total: totalPrice,
    date: orderDetails.date,
    payment_method: orderDetails.payment_method,
    insured: orderDetails.insured,
    status: orderDetails.status
  });

  return await knex('orders')
    .where('id', orderDetails.orderid)
    .update(orderEntry) // insert the order entry, and get the db generated orderid
    .then((orderData) => {
        console.log(`Order \'${orderDetails.orderid}\' successfully updated`);
        return orderData;
    })
    .catch(err => {
      throw (`There was an error updating the order entry: ${err}` );
    })
};

/** 
 * Add new order to database's products table
 */
const queryUpdateOrderUser = async(orderDetails) => {
  const orderEntry = ({
    // customerid: orderDetails.customerid,
    first_name: orderDetails.first_name,
    last_name: orderDetails.last_name,
    email: orderDetails.email,
    phone_number: orderDetails.phone_number,
    address: orderDetails.delivery_address,
    delivery_option: orderDetails.delivery_option,
    // discount_code: orderDetails.discount_code,
    // date: orderDetails.date,
    // total: totalPrice,
    // payment_method: orderDetails.payment_method,
    // insured: orderDetails.insured,
    status: orderDetails.status
  });
  if (!(['Cancelled', 'Pending'].includes(orderDetails.status))) {
      console.log(`orderDetail is: ${orderDetails.status}`);
      throw (`There was an error updating the order entry: User can only cancel an Order Status` );
  }
  await knex('orders')
    .where('id', orderDetails.orderid)
    .then((orderEntry)=>{
      if (orderEntry[0].status !== 'Pending') {
        throw `Order can't be edited! No longer 'Pending'`;
      }
    });
 
  return await knex('orders')
    .where('id', orderDetails.orderid)
    .update(orderEntry) // insert the order entry, and get the db generated orderid
    .then((orderData) => {
        console.log(`Order \'${orderDetails.orderid}\' successfully updated`);
        return orderData;
    })
    .catch(err => {
      throw (`There was an error updating the order entry: ${err}` );
    })
};

/** 
 * link the sales to the orders in the database's order_sales table
 */
const queryAddOrderSales = async(orderId, saleIds) => {
  // map each saleid to a row detailing the order it belonged to
  if (isNaN(orderId)) {
    throw (`The created order has no order id ${orderId}`);
  }
  const pairEntry = saleIds.map((saleid) => ({
    'orderid': orderId,
    'saleid': saleid
  }))

  return await knex('order_sales')
  .insert(pairEntry) // insert the order entry, and get the db generated orderid
  .then(() => {
    console.log('successfully inserted sales, orders, and registered the pairs');
  })
  .catch(err => {
    throw (`There was an error creating the order-product entry: ${err}` );
  })
  .then(()=> {
    knex('order_sales')
      .select('*')
      .then(data=>{
        console.log('order-sales pairs:');
        console.log(data);
      })
  })
};


/**
 * get details of all orders database's orders table
 */
const queryViewOrderDetailsAll = async () => 
  knex('orders')
    .select('id as orderid', 'customerid', 'first_name', 'last_name', 'email', 'phone_number', 
            'address as delivery_address', 'delivery_option', 'date', 'payment_method', 'insured', 'status', 'total')
    .then((ordersData) => {
      // console.log(ordersData);
      return ordersData;
    })
    .catch(err=>{
      throw (`There was an error looking up the orders on the database: ${err}`);
    })


/** 
 * get details of all orders associated to a customer's customerid
 */
const queryViewUserOrdersAll = async (customerid) => 
  knex('orders')
    .select('id as orderid', 'customerid', 'first_name', 'last_name', 'email', 'phone_number', 
            'address as delivery_address', 'delivery_option', 'date', 'payment_method', 'insured', 'status', 'total')
    .where('customerid', customerid)
    .then((ordersData) => {
      // console.log(ordersData);
      return ordersData;
    })
    .catch(err=>{
      throw (`There was an error looking up the orders on the database: ${err}`);
    })

/** 
  * get details of a specific order from orderid
  */
const queryViewOrderDetails = async (orderid) => 
  knex('orders')
    .select('id as orderid', 'customerid', 'first_name', 'last_name', 'email', 'phone_number', 
            'address as delivery_address', 'delivery_option', 'date', 'payment_method', 'insured', 'status', 'total')
    .where('orders.id', orderid)
    .then((ordersData) => {
      // console.log(ordersData);
      return ordersData;
    })
    .catch(err=>{
      throw (`There was an error looking up the order on the database: ${err}`);
    })

/**
 * Get the products and sales associated with the orderid
 */
const queryProductsFromOrderId = async(orderid) => 
  knex('sales')
  .join('products', 'sales.productid', '=','products.id')
  .join('order_sales', 'sales.id', '=', 'order_sales.saleid')
  .select('products.id as productid','products.name', 'imgurl', 'sales.gross_price', 'sales.net_price','sales.id as saleid')
  .where('order_sales.orderid', orderid)
  .then(orderProductsData => {
    return orderProductsData;
  })
  .catch((err)=>{
    console.log(`Error obtaining linked sales products to order ${orderid}: ${err}`);
    throw(`Error obtaining linked sales products to order ${orderid}: ${err}`);
  });


module.exports = {
  queryProductFromId,
  queryAddSales,
  queryAddOrder,
  queryUpdateOrderAdmin,
  queryUpdateOrderUser,
  queryAddOrderSales,
  queryViewOrderDetailsAll,
  queryViewUserOrdersAll,
  queryViewOrderDetails,
  queryProductsFromOrderId
}