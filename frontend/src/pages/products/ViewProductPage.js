import {React, useEffect, useState} from 'react';
import '../../App.css';
import { Button, Card, CardContent } from '@mui/material';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import { useParams, useHistory } from "react-router-dom";
import Header from '../Header'
import './ProductPages.css'
import StarRatingComponent from 'react-star-rating-component';
import SuggestedProducts from '../../components/products/SuggestedProducts';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import Footer from '../Footer';
import Alerts from '../../components/Alerts';
import {BACKEND_PORT} from '../../config.json'

/**
 * Creates page that shows all a single product providing its details (name, 
 * description, price, reviews) and also giving options to add the item to the 
 * cart, buy it now or add to wishlist
 * 
 * @returns ViewProductPage
 */
function ViewProductPage() {
  const theme = ThemeColour();
  let history = useHistory();

  useEffect(() => {
    getProduct()
    getReviews()
  }, [])
  
  const [open, setOpen] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [available, setAvailable] = useState(true)

  const handleBuyNowOpen = () => setBuyNowOpen(true);
  const handleBuyNowClose = () => setBuyNowOpen(false);
  
  const {id} = useParams();

  const [productData, setProductData] = useState([])
  const [orderNum, setOrderNum] = useState(1);
  const [buyNowNum, setBuyNowNum] = useState(1);

  // Alert handlers
  const [openSuccess, setSuccess] = useState(false);
  const [openFail, setFail] = useState(false);
  const handleSuccess = () => {
    setSuccess(true);
  };
  const handleFail = () => {
    setFail(true);
  };

  /**
   * get the product from the backend as dictated by the product id
   */
  async function getProduct() {
    console.log('id is: ' + id)
    // const productid = id.substring(1);
    const productid = id;

    let recentItems = localStorage.getItem('recentItems');
    let recentItemsArray = [];
    if (recentItems !== null) {
      recentItemsArray = JSON.parse(recentItems)  
    }
    recentItemsArray.splice(9);
    // prepend the currently viewed item
    recentItemsArray.unshift(productid);
    localStorage.setItem('recentItems', JSON.stringify(recentItemsArray));

    const url = 'http://localhost:' + BACKEND_PORT + '/products/' + productid;
    await fetch(url, {
      method: 'GET',
    }).then(res => res.text())
      .then(res => JSON.parse(res))
      .then(data => {
        setProductData(data);
        if (!data.available) {
          setAvailable(false);
        }
      })
  }
  
  const [reviews, setReviews] = useState({
    avg_rating: 'n/a',
    reviews: [
      {
        review: '',
        rating: 0,
        date: 0
      }
    ]
  });

  /**
   * get the reviews of the product
   */
  async function getReviews() {
    await fetch('http://localhost:'+ BACKEND_PORT + '/products/'+ id +'/reviews', {
      method: 'GET',
    }).then(res => res.text())
      .then(data => {
        const jsonData = JSON.parse(data);

        if (typeof(jsonData.reviews) !== "undefined") {
          setReviews(JSON.parse(data))
        }
      })
  }

  /**
   * render the reviews onto the page
   */
  const reviewRender = reviews.reviews.map((entry, index) => {
    if (reviews.avg_rating === 'n/a') {
      return (
        <div key={index}>
          No reviews for product
        </div>
        )
    }
    return(
      <div key={index} style={{marginBottom: '12pt'}}>
        Date: {entry.date}
        <br/>
        Rating: {entry.rating}
        <br/>
        Review: {entry.review}
      </div>
    )
  })

  // render the price and slash the previous price if there is a discount
  const PriceRender = () => {
    if (productData.net_price === productData.gross_price) {
      return (
        <div>
        <h4 style={{marginBottom: "-3px"}}>Price:</h4>
          {'$' + productData.gross_price}
        </div>
      )
    }
    else {
      return (
        <div>
          <h4 style={{marginBottom: "-3px"}}>Price:</h4>
          <text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}> {'$' + productData.gross_price} </text>
          <br/>
          {'$' + productData.net_price}
        </div>
      )
    }
  }

  //this function adds more stuff to cart wow
  function addToCart() {  
    // So like for some reason localstorage decides it like to save everything as strings so that 
    // is why you gotta stringify stuff when u put it in and then parse it when u take it out.
    let editedProductData = {
      id: productData.id,
      name: productData.name,
      price: productData.net_price,
      quantity: orderNum,
      imgurl: productData.imgurl,
      description: productData.description  
    }
    let addition = []
    addition.push(editedProductData)
    if (localStorage.getItem("cart")  === null) {
      localStorage.setItem("cart", JSON.stringify(addition))
    }
    else {
      let previousEntries = JSON.parse(localStorage.getItem("cart"))
      // flag is to check if cart already has the item
      let flag = false;
      for (const cartEntry of previousEntries) {
        if (cartEntry.id === productData.id) {
          cartEntry.quantity = parseInt(cartEntry.quantity) + parseInt(orderNum);
          flag = true;
        }
      }
      if (!flag) {
        previousEntries.push(editedProductData)
      }
      localStorage.setItem("cart", JSON.stringify(previousEntries))
    }
    console.log(JSON.parse(localStorage.getItem("cart")))
  }

  // updates the customer order than hasn't been confirmed yet
  function updateOrder() {

    // create a order stored in the local storage until confirmation
    const order = {
      id: productData.id,
      name: productData.name,
      price: productData.net_price,
      quantity: buyNowNum,
      imgurl: productData.imgurl,
      description: productData.description  
    }

    // add the order to the local storage
    localStorage.setItem("buynow", JSON.stringify(order))
    console.log(JSON.parse(localStorage.getItem("buynow")))
  }

  // handle the click event of the confirm button
  function handleSubmit() {
      updateOrder();
      localStorage.setItem("buynowflag", true)
      history.push('/cart');
  }

  async function addToWishlist() {
    if (localStorage.getItem('customerid') === null) {
      handleFail()
    }
    else {
      await fetch('http://localhost:' + BACKEND_PORT + '/wishlist/add/' + localStorage.getItem('customerid'), {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer '+ localStorage.getItem('token'),
        },
        body: JSON.stringify({
          product_id: productData.id
        })
      })
      handleSuccess()
    }
  }

  return (
    <div>
      <ThemeProvider theme={ theme }>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle color='darkblue'>Add to Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How many do you want to add to cart?
          </DialogContentText>
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <input defaultValue='1' min='1' style={{marginRight: '20px'}} value={orderNum} onChange={num => setOrderNum(num.target.value)} type='number'/>
          <Button type='submit' variant='contained' color='medblue' onClick={() => {
            addToCart()
            handleClose()
            localStorage.setItem("buynowflag", false) 
          }}>
            ADD
          </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog onClose={handleBuyNowClose} open={buyNowOpen}>
        <DialogTitle>Buy now</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How many do you want to buy now?
          </DialogContentText>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <input defaultValue='1' min='1' style={{marginRight: '20px'}} value={orderNum} onChange={num => setBuyNowNum(num.target.value)} type='number'/>
            {/* <input onClick={() => {
              handleSubmit()
            }}value='submit' type='submit'/> */}
            <Button type='submit' variant='contained' color='medblue' onClick={() => {
              handleSubmit()
            }}>
              BUY
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    <Header/>
      <ThemeProvider theme={theme}>
        <div className={'mainFlex'}>
          <div className={'pagediv'}>
            <div className={'componentmargin'}>
              <h1 id='header2'>{productData.name}</h1>
              <div className="productflex"> 
                <div className="productimage">
                <img src={productData.imgurl} style={{width:'250px', height:'250px'}}/>
                  <PriceRender/>
                </div>
                <div className="descriptionbox">
                  <h3 id='cheader3'>Description: </h3> 
                  <p>UPC: {productData.id}</p>
                  { available 
                    ? ''
                    : <p style={{color: theme.palette.warning.main}}> THIS PRODUCT IS NOT CURRENTLY AVAILABLE</p>

                  }
                  {productData.description}<br/>
                </div>
              </div>
              <div style={{display:'flex', paddingRight: 25, paddingBottom: 25}}>
                { !available 
                  ? null
                  :  <div style={{display: 'flex'}}>
                      <div style={{paddingRight: 10}}>
                        <Button color='medblue' variant='contained' onClick={handleOpen}>Add to cart</Button>
                      </div>
                      <div style={{paddingRight: 10}}>
                        <Button color='lightblue' onClick={handleBuyNowOpen} variant="contained">Buy now</Button>
                      </div>
                    </div>
                  }
                <Button color='yellow' onClick={() => {
                  addToWishlist()
                }} variant="contained">Add to wishlist</Button>
              </div>
              <div style={{paddingBottom: 10}}>
                <Card id='card'>
                  <CardContent>
                    <h3 id='header2'>Product Reviews</h3>
                    <h4 id='header2'>Average rating: <StarRatingComponent name={'star_rating'} value={parseFloat(reviews.avg_rating)} starCount={5} editing={false}/></h4>
                    <div className={'productreviewdiv'}>
                      {reviewRender}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <SuggestedProducts currentItemId={ id } />
            </div>
          </div>
        </div>
        <Footer />
      </ThemeProvider>
      <Alerts
        openSuccess={openSuccess}
        openFail={openFail}
        setSuccess={setSuccess}
        setFail={setFail}
        textSuccess={"Product is added to your wishlist"}
        textFail={"Please log in in order to add to wishlist"}
      />
      </ThemeProvider>
    </div>
  );
}

export default ViewProductPage;