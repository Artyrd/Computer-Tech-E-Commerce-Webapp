import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';
import { BACKEND_PORT } from '../../config.json'

/**
 * Creates a final review pages that displays everything the user is buying,
 * the user's details, shipping and payment information, and a summary of their
 * expenses
 * 
 * @returns CheckoutReviewPage
 */
function CheckoutReviewPage() {
    
    const history = useHistory();
    const theme = ThemeColour();
    const [products, setProducts] = useState([]);
    const order = JSON.parse(localStorage.getItem("order"));

    // gets the cart / backnow from the local storage
    const getInventory = () => {
        let cart = [];

        if (localStorage.getItem('buynowflag') === "true") {
            cart.push(JSON.parse(localStorage.getItem('buynow')));
            
        } else {
            const newCart = localStorage.getItem('cart');
            if (newCart != null) {
                cart = JSON.parse(newCart); 
            }
            
        }

        setProducts(cart);
    }

    // calculates the cost of the cart
    const cartCost = () => {
        let cartCost = 0;
        
        for (const [key, value] of Object.entries(products)) {
            console.log(key);
            cartCost += value.price * value.quantity;
        }

        return cartCost;
    }

    // checks if the user included insurance with their order
    const insuranceCost = () => {
        if (order.insured === true) {
            return 10;
        } else {
            return 0;
        }
    }

    // checks the shipping cost of the user's chosen shipping method
    const shippingCost = () => {
        if (order.delivery_option === "starTrack") {
            return 25;
        } else if (order.delivery_option === "ausPost") {
            return 20;
        } else {
            return 0;
        }
    }

    // calculates the total cost by adding all the user's expenses
    function totalCost() {
        let totalCost = 0;

        totalCost += cartCost() + insuranceCost() + shippingCost();

        return totalCost;
    }

    // checks the shipping method the user chose and returns a corresponding 
    // string 
    const shippingMethod = () => {
        if (order.delivery_option === "starTrack") {
            return "Star Track";
        } else if (order.delivery_option === "ausPost") {
            return "Australian Post";
        } else if (order.delivery_option === "pickup") {
            return "Pick-up at Star Gate";
        }
    }

    // checks the payment method the user chose and returns a corresponding 
    // string 
    function paymentMethod() {
        if (order.payment_method === "card") {
            return "Credit / Debit card";
        } else if (order.payment_method === "paypal") {
            return "PayPal";
        } else if (order.payment_method === "afterpay") {
            return "AfterPay";
        }
    }

    // send the backend the final order when the user confirms it
    async function handleSubmit(event) {
        event.preventDefault();

        // sends the backend the order of the user
        await fetch('http://localhost:' + BACKEND_PORT + '/checkout/place_order', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                customerid: order.customerid,
                first_name: order.first_name,
                last_name: order.last_name,
                email: order.email,
                phone_number: order.phone_number,
                delivery_address: order.delivery_address,
                delivery_option: order.delivery_option,
                payment_method: order.payment_method,
                products: order.products,
                insured: order.insured
            })
        }).then(res => res.text())
          .then(data => console.log(data))
        
        localStorage.removeItem("cart");
        history.push('/');
    }

    // run these functions at the when loading the page
    useEffect(() => {
        getInventory();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Header />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        minHeight:'calc(100vh - 362px)', 
                        maxWidth: '90vw', 
                        marginBottom:'20pt'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                            <h1 style={{marginLeft:"100px", color: "#173c5e"}}>Checkout Review</h1>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                            <h2 style={{marginLeft:"100px", color: "#173c5e"}}>What you're buying:</h2>  
                        </div>
                        
                        <div id='item-list' style={{marginLeft:"100px", marginRight:"100px", marginBottom:"30px"}}>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell width={250}>Name</TableCell>
                                    <TableCell width={200} align="left">Image</TableCell>
                                    <TableCell width={150} align="left">Price</TableCell>
                                    <TableCell width={150} align="left">Quantity</TableCell>
                                    <TableCell width={800} align="left">Description</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {products.map((row) => (
                                    <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left"><img src={row.imgurl} style={{width:'100px', height:'100px'}}/></TableCell>
                                    <TableCell align="left">${row.price.toFixed(2)}</TableCell>
                                    <TableCell align="left">{row.quantity}</TableCell>
                                    <TableCell align="left">{row.description}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignContent: 'left',
                                width: '100%',
                            }}>
                                <div style={{marginLeft:"100px", color: "#062241"}}>
                                    <h2 style={{color: "#173c5e"}}>Delivery Address:</h2>   
                                    <div style={{marginTop:"10px"}}>
                                        <text>{order.first_name} {order.last_name}</text>
                                    </div>
                                    <div style={{marginTop:"10px"}}>
                                        <text>{order.delivery_address}</text>
                                    </div>
                                    <div style={{marginTop:"10px"}}>
                                        <text style={{fontWeight: "bold"}}>Email: </text><text>{order.email}</text>
                                    </div>
                                    <div style={{marginTop:"10px"}}>
                                    <text style={{fontWeight: "bold"}}>Phone: </text><text>{order.phone_number}</text>
                                    </div>
                                </div>

                                <div style={{marginLeft:"100px", color: "#062241"}}>
                                    <h2 style={{color: "#173c5e"}}>Shipping Information:</h2>    
                                    <p>{shippingMethod()}</p>
                                    <h2 style={{color: "#173c5e"}}>Payment Information:</h2>    
                                    <p>{paymentMethod()}</p>
                                </div>

                                <div style={{marginLeft:"100px", color: "#062241"}}>
                                    <h2 style={{color: "#173c5e"}}>Order Summary:</h2>
                                    
                                    <div style={{width:"200px"}}>
                                        <div style={{float:"left", lineHeight:"0px", height:"30px"}}>
                                            <p>Cart cost:</p>
                                        </div>
                                        <div style={{float:"right", lineHeight:"0px", height:"30px"}}>
                                            <p>${cartCost().toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div style={{width:"200px"}}>
                                        <div style={{float:"left", lineHeight:"0px", height:"30px"}}>
                                            <p>Insurance cost:</p>
                                        </div>
                                        <div style={{float:"right", lineHeight:"0px", height:"30px"}}>
                                            <p>${insuranceCost().toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div style={{width:"200px"}}>
                                        <div style={{float:"left", lineHeight:"0px", height:"30px"}}>
                                            <p>Shipping cost:</p>
                                        </div>
                                        <div style={{float:"right", lineHeight:"0px", height:"30px"}}>
                                            <p>${shippingCost().toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div style={{width:"200px"}}>
                                        <div style={{float:"left", lineHeight:"0px", height:"30px"}}>
                                            <p style={{fontWeight: "bold"}}>Total cost:</p>
                                        </div>
                                        <div style={{float:"right", lineHeight:"0px", height:"30px"}}>
                                            <p style={{fontWeight: "bold"}}>${totalCost().toFixed(2)}</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>

                            <Button 
                                id="continue"
                                color='yellow' 
                                variant='contained'
                                style={{
                                    marginRight:"100px", 
                                    width:"150px",
                                    height:"50px",
                                    padding:"10px",
                                }}
                                onClick={handleSubmit} 
                            >
                                Place Order!
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </ThemeProvider>
    )
}

export default CheckoutReviewPage;