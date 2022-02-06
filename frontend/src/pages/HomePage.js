import {React, useEffect, useState} from 'react';
import '../App.css';
import {Link} from 'react-router-dom'
import Header from './Header'
import dayjs from "dayjs";
import Footer from './Footer';
import { Box, Button, Card, CardMedia, CardContent } from '@mui/material';
import SuggestedProducts from '../components/products/SuggestedProducts';
import {BACKEND_PORT} from '../config.json'

/**
 * Creates the landing page of Stargate, displays Popular Products, Discounts,
 * and Suggested Items
 * 
 * @returns HomePage
 */
function HomePage() {

  const [popularItems, setPopularItems] = useState([]);
  const [discountedItems, setDiscountedItems] = useState([]);

  useEffect(() => {
    getPopularProducts()
    getDiscountedProducts()
  }, [])

  // Style to make the container fit the available width, and make its contents horizontally-scrollable
  const horizScrollListStyle = {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    width: '100%'
  }

  /**
   * gets popular items from the backend
   */
  async function getPopularProducts() {
    await fetch('http://localhost:'+ BACKEND_PORT +'/api/sales/popular/?start=2021-09-13&end=2021-12-30&num=5', {
      method: 'GET',
    }).then(res => res.text())
      .then(data => {
        setPopularItems(JSON.parse(data).products)
      })
  }

  /**
   * renders the popular items onto the homepage or displays message that there are none
   * @returns popular items or message that there are none
   */
  const PopularItems = () => {
    if (popularItems.length === 0) {
      return (
        <div>
          There are no popular items right now
        </div>
      )
    }
    else {
      return (
        popularItems.map((data, index) => {
          return (
            <div key={ index }> 
              <Card id='card' style={{width: 200, height: 290, marginRight: 25}}>
                <CardContent>
                  <Link to={"/products/" + data.id}>
                    <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <Box style={{height: 170}}>
                        <CardMedia
                          component="img"
                          sx={{ width: 150, height: 150, boxShadow: 3 }}
                          image={ data.img }
                        />
                      </Box>
                      <div>
                        <h5>{data.name}</h5>
                        <h6>${data.net_price}</h6>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )
        })
      )
    }
  }

  /**
   * gets the discounted products from the backend
   */
  async function getDiscountedProducts() {
    try {
      const res = await fetch('http://localhost:'+ BACKEND_PORT +'/discounts/view/active', {
        method: 'GET',
      })
      console.log(res);
      if (res.status === 200) {
        const data = await res.json();
        console.log('active discounts:')
        console.log(data)
        const discountProducts = data.discounts
        if (Array.isArray(discountProducts) && discountProducts.length > 0) {
          setDiscountedItems(discountProducts)
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * this components renders the discounted products from the backend
   * @returns discounted products
   */
  const DiscountedItems = () => {
    if (discountedItems.length === 0) {
      return (
        <div>
          There are no product discounts as of right now
        </div>
      )
    }
    else {
      // if (discountedItems.length <= 5) {
        return (
          discountedItems.map((data, index) => {
            return (
              <div key={index} >
                <Card id = 'card' style={{width: 200, height: 290, marginRight: 25}}>
                  <CardContent>
                    <Link to={"/products/" + data.productid}>
                    <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <Box style={{height: 170}}>
                        <CardMedia
                          component="img"
                          sx={{ width: 150, height: 150, boxShadow: 3 }}
                          image={ data.imgurl }
                        />
                      </Box>
                      <div>
                        <h5>{data.name}</h5>
                        <h6>${data.net_price}</h6>
                      </div>
                    </div>
                    </Link>
                  </CardContent>
                </Card>
                
              </div>
            )
          })
        )
      // }
      // else {
      //   discountedItems.slice(0, 5).map((data, index) => {
      //     return (
      //       <div key={ index }>
      //         <div className={'product-div'}>
      //           <Link to={"/products/" + data.productid}>
      //             <img src={data.imgurl}/>
      //             <h5>{data.name}</h5>
      //             {/* <h5 style={{marginBottom: '-20px'}}>{data.name}</h5> */}
      //             <h6>${data.net_price}</h6>
      //           </Link>
      //         </div>
      //       </div>
      //     )
      //   })
      // }
    }
  }

  return (
    <div>
      <Header/>
      <div className={'mainFlex'}>
        <div className={'pagediv'}>
          <div className={"componentmargin"}>
            <h1 id='header2' style={{fontFamily: 'Trebuchet MS'}}>Popular Products</h1>
            <div className={'pageflex'}>
              <Box sx={ horizScrollListStyle }>
                <PopularItems/>
              </Box>
            </div>
            <h1 id='header2' style={{marginTop:'50px', fontFamily: 'Trebuchet MS'}}>Discounts</h1>
            <div className={'pageflex'}>
              <Box sx={ horizScrollListStyle }>
                <DiscountedItems/>
              </Box>
            </div>
            <br/>
            <div>
              <SuggestedProducts/>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer/>
    </div>
  );
}




export default HomePage;