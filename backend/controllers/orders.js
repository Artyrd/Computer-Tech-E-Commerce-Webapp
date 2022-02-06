// console.log('CURRENT directory: ' + process.cwd());
// const e = require('express');
// Import database
// note that this is all writing into stargate.db
const { queryProductFromId, queryAddSales, queryAddOrder, queryUpdateOrderAdmin, queryUpdateOrderUser, queryAddOrderSales, queryViewOrderDetailsAll, queryViewUserOrdersAll, queryViewOrderDetails, queryProductsFromOrderId } = require('./orders_queries')
const { sendEmailConfirm, sendEmailPriceMatch } = require('./send_email')

/*************************************
 *       CONTROLLER FUNCTIONS        *
 *************************************/

/**
 * Places a customer's order into the database
 */
const placeOrder = async (req, res, next) => {
  if (!(req.body.products instanceof Array && req.body.products.length > 0)) {
    res.status(400).json({ error: `There are no products being purchased ${req.body.products}` });
    return; // no ids given
  }

  try {
    let promiseList = []
    let productPriceMatch = []
    for (product of req.body.products) {
      promiseList.push(queryProductFromId(product.productid));
      if (product.url != undefined) {
        productPriceMatch.push({
          product: product.productid,
          url: product.url
        })
      }
    }

    const productsList = await Promise.all(promiseList);
    // const productsList = await queryProductsFromIds(req.body.products);
    const saleIdsList = await queryAddSales(productsList);
    const orderId = await queryAddOrder(req.body, productsList);
    await queryAddOrderSales(orderId, saleIdsList);
    await sendEmailConfirm(orderId);
    await sendEmailPriceMatch(orderId, productPriceMatch);
    res.status(200).json({order_id: orderId})
    // console.log('final order: orderId: ' + orderId + '; saleIds:' + saleIdsList.toString());
  }
  catch (err) {
    console.log(`There was an error placing the order: ${err}`);
    res.status(400).json({error: `There was an error placing the order: ${err}`});
    return
  }
}

/**
 * Get all past and present orders
 */
const ordersViewAll = async (req, res, next) => {
  try {
    const orderDetails = await queryViewOrderDetailsAll();
    let ordersList = [];
    for (order of orderDetails) {
      let orderEntry = {};
      let orderProducts = [];
      try {
        orderProducts = await queryProductsFromOrderId(order.orderid);
        Object.assign(orderEntry, order, {products: orderProducts});
        ordersList.push(orderEntry);
      }
      catch (err) {
        res.status(400).json({error: `Error trying to loop through order's products: ${err}`});
        return;
      }
    }    
    res.status(200).json({orders: ordersList});
  } catch (err) {
    res.status(400).json({error: `there was an error viewing orders: ${err}`})
    return;
  }
}

/**
 * Finds an order's details from its id
 */
const ordersView = async (req, res, next) => {
  try {
    const { orderid, } = req.params;
    // console.log('GET order id is: ' + orderid);
    let orderEntry = {};
    // note: order gives an array of one object
    const order = await queryViewOrderDetails(orderid);
    const orderProducts = await queryProductsFromOrderId(orderid);
    Object.assign(orderEntry, order[0], {products: orderProducts});
    res.status(200).json({order: orderEntry});
  }
  catch (err) {
    res.status(400).json({error: `Error trying to view order details: ${err}`});
    return;
  }
}

/**
 * edit/ update the details of an order with admin permissions (can change to 'dispatched' or 'delivered')
 */
const ordersEditDetailsAdmin = async (req, res, next) => {
  try {
    await queryUpdateOrderAdmin(req.body);
    res.status(200).json({ message: `Order \'${req.body.orderid}\' successfully updated`});
  }
  catch (err) {
    console.log(`There was an error editing the order: ${err}`);
    res.status(400).json({error: `There was an error editing the order: ${err}`});
  }
}

/**
 * edit/ update the details of an order with user permissions
 */
const ordersEditDetailsUser = async (req, res, next) => {
  try {
    await queryUpdateOrderUser(req.body);
    res.status(200).json({ message: `Order \'${req.body.orderid}\' successfully updated`});
  }
  catch (err) {
    console.log(`There was an error editing the order: ${err}`);
    res.status(400).json({error: `There was an error editing the order: ${err}`});
  }
}

/**
 * gets all past and present orders for a particular user
 */
const ordersUserViewAll = async (req, res, next) => {
  try {
    const { customerid, } = req.params;
    const orderDetails = await queryViewUserOrdersAll(customerid);
    console.log('orderDetails');
    console.log(orderDetails);
    let ordersList = [];
    for (order of orderDetails) {
      let orderEntry = {};
      let orderProducts = [];
      try {
        orderProducts = await queryProductsFromOrderId(order.orderid);
        Object.assign(orderEntry, order, {products: orderProducts});
        ordersList.push(orderEntry);
      }
      catch (err) {
        res.status(400).json({error: `Error trying to loop through order's products: ${err}`});
        return;
      }
    }    
    // res.status(200).json({orders: orderDetails});
    res.status(200).json({orders: ordersList});
  } catch (err) {
    res.status(400).json({error: `there was an error viewing orders: ${err}`})
    return;
  }
}

module.exports = {
  placeOrder,
  ordersViewAll,
  ordersView,
  ordersEditDetailsAdmin,
  ordersEditDetailsUser,
  ordersUserViewAll,
}