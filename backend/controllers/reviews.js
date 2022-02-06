// console.log('CURRENT directory: ' + process.cwd());
// const e = require('express');
// Import database
const knex = require('../database/products') // products.js
const dayjs = require('dayjs');
// note that this is all writing into stargate.db


/**********************************
 *       HELPER FUNCTIONS        *
 *********************************/

const queryAddReview = async (review, customerid, orderid) => 
  knex('product_reviews')
  .insert({
    'productid': review.productid,
    'orderid': orderid,
    'customerid': customerid,
    'review': review.review,
    'rating': review.rating,
    'date': dayjs().format('YYYY-MM-DD'),
  })
  .then(() => {
    console.log(`added review for ${review.productid}`);
  })
  .catch(err => {
    throw(`Error adding review entry: ${err}`);
  });


const queryEditReview = async (review, orderid) => 
  knex('product_reviews')
  .where('productid', '=', review.productid)
  .andWhere('orderid', '=', orderid)
  .update({
    // 'productid': review.productid,
    // 'orderid': review.orderid,
    // 'customerid': review.customerid,
    'review': review.review,
    'rating': review.rating,
    'date': dayjs().format('YYYY-MM-DD'),
  })
  .then(() => {
    console.log(`edited review for ${review.productid}`);
  })
  .catch(err => {
    throw(`Error editing review entry: ${err}`);
  });

/**
 * Get all the reviews associated with the product id
 * @param {String} productid 
 * @returns an array of reivews
 */
const queryGetReviewsFromProductId = async (productid) => 
  knex('product_reviews')
    .select('review', 'customerid', 'rating', 'date')
    .where('productid', productid)
    .then((reviewsData) => {
      console.log(reviewsData);
      return reviewsData;
    })
    .catch(err=>{
      throw (`There was an error looking up the order on the database: ${err}`);
    })

/**
 * Get all the reviews associate with the orderid
 * @param {number} orderid 
 * @returns an array of reviews
 */
const queryGetReviewsFromOrderId = async (orderid) => 
  knex('product_reviews')
    .select('productid', 'date', 'review', 'rating')
    .where('orderid', orderid)
    .then((reviewsData) => {
      console.log(reviewsData);
      return reviewsData;
    })
    .catch(err=>{
      throw (`There was an error looking up the order on the database: ${err}`);
    })



/*************************************
 *       CONTROLLER FUNCTIONS        *
 *************************************/
const addReview = async (req, res, next) => {
  const reviews = req.body['reviews'];
  const orderid = req.params['orderid']
  const customerid = req.body['customerid'] // cusomterid given by auth middleware
  if (!(reviews instanceof Array && reviews.length > 0)) {
    res.status(400).json({ error: `There are no products being reviewed ${req.body.products}` });
    return; // no ids given
  }
  try {
    let promiseList = [];
    reviews.forEach(review => {
      promiseList.push(queryAddReview(review, customerid, orderid));
    })
    await Promise.all(promiseList);
    res.status(200).json({message: 'all reviews successfully submitted'})
  }
  catch (err) {
    console.log(`There was an error adding the review(s): ${err}`);
    res.status(400).json({error: `There was an error adding the review(s): ${err}`});
    return
  }
};

const editReview = async (req, res, next) => {
  const reviews = req.body['reviews'];
  const orderid = req.params['orderid']
  if (!(reviews instanceof Array && reviews.length > 0)) {
    res.status(400).json({ error: `There are no products being reviewed ${req.body.products}` });
    return; // no ids given
  }
  try {
    let promiseList = [];
    reviews.forEach(review => {
      promiseList.push(queryEditReview(review, orderid));
    })
    await Promise.all(promiseList);
    res.status(200).json({message: 'all reviews successfully edited'})
  }
  catch (err) {
    console.log(`There was an error adding the review(s): ${err}`);
    res.status(400).json({error: `There was an error editing the review(s): ${err}`});
    return
  }
};



const getReviewsFromProductId = async (req, res, next) => {
  try {
    const productid = req.params['productid'];
    const reviews = await queryGetReviewsFromProductId(productid);
    console.log('reviews for: ', productid);
    console.log(reviews);
    // if no reviews, avg rating = 0
    if (reviews.length < 1) {
      res.status(200).json({reviews: reviews, avg_rating: 0});
      return;
    }
    const ratings = reviews.map(review => review.rating);
    const avgRating = ratings.reduce((a,b) => a + b, 0) / reviews.length;
    console.log('avg rating:', avgRating);
    res.status(200).json({reviews: reviews, avg_rating: avgRating});
  } catch (err) {
    res.status(400).json({error: `there was an error viewing reviews: ${err}`})
    return;
  }
};

const getReviewsFromOrderId = async (req, res, next) => {
  try {
    const { orderid, } = req.params;
    const reviews = await queryGetReviewsFromOrderId(orderid);
    console.log('reviews for: ', orderid);
    console.log(reviews);
    res.status(200).json({reviews: reviews});
  } catch (err) {
    res.status(400).json({error: `there was an error viewing reviews: ${err}`})
    return;
  }
};

module.exports = {
  addReview,
  editReview,
  getReviewsFromProductId,
  getReviewsFromOrderId
}