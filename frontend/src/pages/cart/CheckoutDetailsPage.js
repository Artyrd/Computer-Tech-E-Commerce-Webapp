import { React, useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material/';
import { useHistory } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import ThemeColour from '../ThemeColour'
import Header from '../Header';
import Footer from '../Footer';
import Alerts from '../../components/Alerts';
import { BACKEND_PORT } from '../../config.json'

/**
 * Creates a shipping address page which displays textfields to prompt the user
 * to provide their details. Information collect will be first name, last name,
 * email, phone number, and address
 * 
 * @returns CheckoutDetailsPage
 */
function CheckoutDetailsPage() {

    const history = useHistory();
    const theme = ThemeColour();
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [input, setInput] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    })

    // auto fill details if they are logged in
    useEffect(async () => {
        try {
            console.log(localStorage.getItem('token'));
            if (localStorage.getItem('token') !== null && 
                localStorage.getItem('token') !== undefined) {
                
                await getDetails()
            }
        }
        catch(err) {
            console.log('There was an error setting up:' + err);
        }
    }, []);
    
    // calls a fetch to the backend to get the details of the customer 
    const getDetails = async () => {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/profile/'+localStorage.getItem('customerid'), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        setInput(data);
    }

    // updates the customer order than hasn't been confirmed yet
    function updateOrder() {  

        // get the current order from the local storage
        let order = JSON.parse(localStorage.getItem("order"));

        // check if all details have been filled in
        for (const [key, value] of Object.entries(input)) {
            console.log(key + ':' + value);
            if (key !== "mailing_list" && (value === null || value === "")) {
                return "fail";
            }
        }

        // change the order field this page covers
        order.first_name = input.first_name
        order.last_name = input.last_name
        order.email = input.email
        order.phone_number = input.phone
        order.delivery_address = input.address
        order.customerid = localStorage.getItem("customerid");

        // add the order to the local storage
        localStorage.setItem("order", JSON.stringify(order));
        return "success";
    }

    // check if a certain field in the input variable is null or not
    function checkValue(name) {
        if (input[name] !== null) {
            return input[name];
        }
        return '';
    }
    
    // changes the input variable whenever the user changes the text in the
    // textfields of the details menu
    const handleChange = name => event => {
        console.log(input);
        setInput({...input, [name]: event.target.value})
    }

    // handle the click event of the confirm button
    function handleSubmit() {
        // try to update the order, if any fields are empty then alert the user
        if (updateOrder() == "success") {
            history.push('checkout_shipping')
        } else {
            handleFail();
        }
    }

    // alert handlers
    const handleFail = () => {
        setFail(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Header />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'left', 
                        minHeight:'calc(100vh - 362px)', 
                        maxWidth: '90vw', 
                        marginBottom:'20pt'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                            <h1 style={{color: "#173c5e"}}>Shipping Address</h1>
                        </div>

                        <form onSubmit = {handleSubmit}>
                            <TextField
                                value = {checkValue('first_name')}
                                variant="outlined"
                                margin="normal"
                                required
                                style={{width:300}}
                                id="first_name"
                                label="First Name"
                                type="text"
                                onChange={handleChange('first_name')}
                            />
                            <TextField
                                value = {checkValue('last_name')}
                                variant="outlined"
                                margin="normal"
                                required
                                style={{width:300}}
                                id="last name"
                                label="Last Name"
                                type="text"
                                onChange={handleChange('last_name')}
                            /><br />
                            <TextField
                                value = {checkValue('email')}
                                variant="outlined"
                                margin="normal"
                                required
                                style={{width:600}}
                                id="email"
                                label="Email"
                                type="text"
                                onChange={handleChange('email')}
                            /><br />
                            <TextField
                                value = {checkValue('phone')}
                                variant="outlined"
                                margin="normal"
                                required
                                style={{width:600}}
                                id="phone_number"
                                label="Phone Number"
                                type="text"
                                onChange={handleChange('phone')}
                            /><br />
                            <TextField
                                value = {checkValue('address')}
                                variant="outlined"
                                margin="normal"
                                required
                                style={{width:600}}
                                id="delivery_address"
                                label="Address"
                                type="text"
                                onChange={handleChange('address')}
                            />
                        </form><br/>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                            <Button 
                                id="continue"
                                color="yellow" 
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                            >continue
                            </Button>
                        </div>
                    </div>
                </div>
                <Alerts 
                    openSuccess={openSuccess}
                    openFail={openFail}
                    setSuccess={setSuccess}
                    setFail={setFail}
                    textSuccess={""}
                    textFail={"Not all details are filled: Please check again carefully"}
                />
                <Footer/>
            </div>

        </ThemeProvider>
    )
}

export default CheckoutDetailsPage;