import { React, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';
import ItemList from '../../components/cart/ItemList';
import Alerts from '../../components/Alerts';

/**
 * Creates a cart page that displays all the current items in the cart, 
 * includes the item list, total cart cost, option for insurance
 * 
 * @returns CartPage
 */
function CartPage() {

    const theme = ThemeColour();
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [insurance, setInsurance] = useState(false);
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);

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
        
        // loops through the product list and adds together all product prices,
        // also considers the quantity of items
        if (products != null) {
            for (const [key, value] of Object.entries(products)) {
                console.log(key);
                cartCost += value.price * value.quantity;
            }
        }
        
        // checks if the user also wants to include insurance with their items
        const cb = document.getElementById("insurance");
        if (cb !== null && cb.checked === true) {
            cartCost += 10;
        }

        return cartCost;
    }

    // updates the customer order than hasn't been confirmed yet
    function updateOrder() {  
        let product_list = []

        // adds all current items in the cart to the product list
        for (const product of products) {
            for (let j = 0; j < product.quantity; j++) {
                const item = {
                    productid: product.id, 
                    url: document.getElementById(product.name + "webURL").value
                }
                product_list.push(item);
            }
        }

        // create a order stored in the local storage until confirmation
        const order = {
            customerid: null,
            first_name: null,
            last_name: null,
            email: null,
            phone_number: null,
            payment_method: null,
            delivery_address: null,
            delivery_option: null, 
            discount_code: null,
            products: product_list,
            insured: insurance
        }

        // add the order to the local storage
        localStorage.setItem("order", JSON.stringify(order))
        console.log(JSON.parse(localStorage.getItem("order")))
    }

    // handles the delete button next to every item on the cart which removes
    // the item from the item list display and the local storage cart
    const handleDelete = (name) => {
        const newProducts = products.filter(products => products.name !== name);
        
        if (JSON.parse(localStorage.getItem("buynowflag")) == "true") {
            localStorage.setItem('buynow', JSON.stringify(newProducts));
        } else {
            localStorage.setItem('cart', JSON.stringify(newProducts));
        }

        handleSuccess();
        setProducts(newProducts);
    }

    // checks if the user wants to include insurance with their items
    function handleChange() {
        if (insurance === true) {
            setInsurance(false);
        } else {
            setInsurance(true);
        }
    }

    // when the user clicks the "CONTINUE" button, they update the local 
    // storage order and are navigated to the next step in checking out
    function handleSubmit() {
        
        // check if there is anything in the cart
        if (products.length < 1) {
            handleFail();
        } else {
            updateOrder();

            // check if the user is logged in and takes them to either the 
            // login options or the details page
            if (localStorage.getItem('token') === null || 
                localStorage.getItem('token') === undefined) {
                
                    history.push('/cart/checkout_option')
            } else {
                history.push('/cart/checkout_details');
            }
        }

    }

    // alert handlers
    const handleFail = () => {
        setFail(true);
      };
      const handleSuccess = () => {
          setSuccess(true);
      };

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
                            <h1 style={{color: "#173c5e"}}>What you're buying</h1>
                        </div>
                        <ItemList 
                            products={products} 
                            handleDelete={handleDelete} 
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                            <div>
                                <h3 style={{color: "#173c5e",}}>
                                    Cart Cost: ${cartCost().toFixed(2)}
                                </h3>
                                    
                                <FormControlLabel control={
                                    <Checkbox 
                                        id="insurance"
                                        label="Include insurance for all ItemList (+$10)"
                                        color='darkblue'
                                        onChange={handleChange} 
                                    />
                                } label="Include insurance for items (+$10)" color='darkblue'/>
                            </div>
                            <Button 
                                id="continue"
                                color='yellow' 
                                variant='contained'
                                style={{
                                    width:"150px",
                                    height:"50px",
                                    padding:"10px",
                                }}
                                onClick={handleSubmit} 
                            >Continue
                            </Button>
                        </div>
                    </div>
                </div>
                <Alerts 
                    openSuccess={openSuccess}
                    openFail={openFail}
                    setSuccess={setSuccess}
                    setFail={setFail}
                    textSuccess={"Removed item cart"}
                    textFail={"Cart empty: Please add items to the cart before proceeding"}
                />
                <Footer/>
            </div>
        </ThemeProvider>
    )

}

export default CartPage;