import { Card, CardContent, Button, IconButton } from '@mui/material';
import {React, useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import './CustomerPages.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Navigation from '../../components/customer/Navigation';
import { BACKEND_PORT } from '../../config.json';
import Footer from '../Footer';

function WishlistPage() {
    // Load page themes
    const theme = ThemeColour();
    // Use page history 
    const history = useHistory();

    // If there is no user currently logged in, redirect to login
    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
        history.push('/login');
    }

    // Wishlist data state
    const [wishlist, setWishlist] = useState([]);
    // Backend call to get wishlist data for a stored customerid
    async function getWishlist() {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/wishlist/' + localStorage.getItem('customerid'), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        if (response.status === 200) {
            setWishlist(data.products);
        }
    }
    // Get wishlist data on page load
    useEffect(() => {getWishlist()}, []);

    // Go to product page when image is clicked
    function goToProduct(event, productid) {
        history.push('/products/'+productid);
    }
    // Backend call to remove an item from wishlist for given productid
    async function handleRemove(event, productid) {
        console.log(productid);
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/wishlist/edit/' + localStorage.getItem('customerid'), {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                products: [productid],
            }),
        })
        getWishlist();
    }
    // Backend call to clear whole wishlist for a user
    async function handleClear(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/wishlist/clear/' + localStorage.getItem('customerid'), {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        setWishlist([]);
    }

    // Conditionally render the sale price of a product
    function netPrice(net_price) {
        // If the product is not on sale
        if (net_price === null || net_price === undefined) {
            return ("Item Not on Sale");
        }
        // If the product is on sale, show sale price
        else {
            return net_price;
        }
    }

    // Render product data as a row for given product
    function Row({product}) {
        return (
            <tr key={product.productid}>
                <td key={'img'+product.productid}>
                    <Button onClick={(e) => goToProduct(e, product.productid)}>
                        <img src={product.imgurl} alt={"Image: "+product.productid} style={{width:'150px', height:'150px'}}/>
                    </Button>
                    <p>
                        {product.name}
                    </p>
                </td>
                <td key={'name'+product.productid}>
                    {product.name}
                </td>
                <td key={'gprice'+product.productid}>
                    {product.gross_price}
                </td>
                <td key={'nprice'+product.productid}>
                    {netPrice(product.net_price)}
                </td>
                <td>
                    <Button color='warning' variant='outlined' onClick={(e) => handleRemove(e, product.productid)}>
                        Remove
                    </Button>
                </td>
            </tr>
        )
    }
    
    // Map products in wishlists to table rows
    function TableRows({data}) {
        return (
            <>
                {data && data.length && data.map(product => <Row product={product} />)}
            </>
        );
    }

    // Conditionally render wishlist display to promote having a wishlist
    function renderContent() {
        // If there are no items in wishlist, prompt user to browse
        if (wishlist.length === 0) {
            return(
                <Card style={{width: 450, backgroundColor:'#F2F5F8'}}>
                    <CardContent>
                        <div style={{display: 'flex', justifyContent: 'center', paddingTop: 100}}>
                            <IconButton onClick={() => {history.push('/products')}}>
                                <ShoppingCartIcon sx={{fontSize:100, color:'#edd071'}}/>
                            </IconButton>
                        <h2 id='header2'>
                            No items on your wishlist, go browse our catalogue!
                        </h2>
                        </div>
                    </CardContent>
                </Card>
            )
        }
        // else, show wishlist
        else {
            return(
                <table id="table">
                    <thead>
                        <tr style={{backgroundColor:'#D1DEEC'}}>
                            <th>Item</th>
                            <th>Image</th>
                            <th>Gross Price</th>
                            <th>Sale Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableRows data={wishlist} />
                    </tbody>
                </table>
            )
        }
    }
    
    return(
        <div>
            <Header />
            <div style={{display: 'flex', justifyContent:'space-evenly', paddingTop: 50, paddingBottom: 50}}>
                <ThemeProvider theme={theme}>
                    <Card sx={{width: 300, height: 400, backgroundColor:'#F2F5F8'}}>
                        <CardContent>
                            <Navigation />
                            <div style={{paddingTop: 12, paddingBottom: 12}}>
                                <Button color="yellow" variant="contained" fullWidth onClick={handleClear}>
                                    Clear Wishlist
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div>
                        {renderContent()}
                    </div>
                </ThemeProvider>
            </div>
            <Footer />
        </div>
    )
    
}

export default WishlistPage;