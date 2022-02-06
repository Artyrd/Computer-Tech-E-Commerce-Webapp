import { Box, Card, CardContent, CardMedia } from '@mui/material';
import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import ThemeColour from '../../pages/ThemeColour';
import {BACKEND_PORT} from '../../config.json'

/**
 * A horizontal-scrolling list of products which are suggested to the user based on their history.
 * Pulls data from localStorage('recentItems).
 * @param {*} currentItemId - the id of the current product page, such that the products suggested does not include it as a suggesion. 
 * @returns a horizontally-scrollable div with a list of products recommended to the user
 */
const SuggestedProducts = ({ currentItemId }) => {
  const theme = ThemeColour();
  // const history = useHistory();

  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(async () => {
    setSuggestedProducts(await fetchSuggested());
  }, [])

  /**
   * Returns the user's recently viewed items from local storage
   */
  const getRecentItems = () => {
    let recentItems = JSON.parse(localStorage.getItem('recentItems'));
    console.log('getting recentItems');
    console.log(recentItems);
    if (recentItems === null) {
      recentItems = [];
    }
    if (currentItemId) {
      recentItems.unshift(currentItemId);
    }
    return recentItems;
  }

  /**
   * Makes the fetch request to obtain the user's suggested products.
   * @returns an array of products, or [] if no suggestions exist or an error occurs.
   */
  const fetchSuggested = async () => {
    try {
      const response = await fetch('http://localhost:'+ BACKEND_PORT +'/products/suggested/', {
        headers:{
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          products: getRecentItems(),
          num: 10
        })
      });
      const data = await response.json();
      // console.log(data);
      // Could not log in alert
      if (response.status !== 200 || !Array.isArray(data.products) || data.products.length < 1) {
        return []
      }
      else {
        // console.log('SUGGESTED PRODUCTS:')
        // console.log(data.products);
        return data.products;
      }
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // Style to make the container fit the available width, and make its contents horizontally-scrollable
  const boxStyle = {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    width: '100%',
    marginBottom: '25px'
  }

  return (
    <ThemeProvider theme={theme}>
    <div>
      {(suggestedProducts.length === 0)
        ? null
        : (
          <div>
            <h2 id='header2'>Suggested for you</h2>
            <Box sx={ boxStyle }>
              { suggestedProducts.map((product, index) => (
                  <div key={ index } >
                    <Link to={`/products/${product.id}`} onClick={() => {window.location.href=`/products/${product.id}`}}>
                      <Card id='card' style={{width: 200, height: 300, marginRight: 25}} sx={{ boxShadow: 3 }}>
                        <CardContent>
                          <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Box style={{height: 170}}>
                              <CardMedia
                                component="img"
                                sx={{ width: 150, height: 150, boxShadow: 3 }}
                                image={ product.imgurl }
                              />
                            </Box>
                            <div>
                              <h5>{product.name}</h5>
                              <h6>${product.net_price}</h6>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))
              }
            </Box>
          </div>
        )
      }
    </div>
    </ThemeProvider>
  );
}

export default SuggestedProducts;