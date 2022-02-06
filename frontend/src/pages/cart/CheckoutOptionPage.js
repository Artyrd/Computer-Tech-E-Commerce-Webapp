import { React, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { Card, CardContent, Button, TextField } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';
import Alerts from '../../components/Alerts';
import { BACKEND_PORT } from '../../config.json'

/**
 * Creates a checkout option page which is displayed to the user if they want
 * to proceed checking out and they are not logged in. They receive 2 options,
 * either to login (if they have a account) or to continue as a guest.
 * 
 * @returns CheckoutOptionsPage
 */
function CheckoutOptionsPage() {
    
    const history = useHistory();
    const theme = ThemeColour();
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [input, setInput] = useState({
        email: "",
        password: "",
    })

    // logs the user in if correct details are given
    async function handleSubmit(event) {
        
        // given the user details, call the backend to check if there exist a 
        // account if the user's details
        event.preventDefault();
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/accounts/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: input.email,
                password: input.password,
            })
        }) 

        // if the account doesn't exist then alert the user, else log the user
        // in then set the user's token and user id
        const data = await response.json();
        if (response.status === 400) {
            handleFail();
        } else {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("customerid", data.customer_id.id);
            history.push('checkout_address');
        }
        
    }

    // changes the input variable whenever the user changes the text in the
    // textfields of the login menu
    const handleChange = name => event => {
        setInput({...input, [name]: event.target.value})
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
                        alignItems: 'center', 
                        minHeight:'calc(100vh - 362px)', 
                        maxWidth: '90vw', 
                        marginBottom:'20pt'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                            <h1 style={{color: "#173c5e"}}>Checkout Options</h1>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}> 
                            <Card id="card" style={{width:"500px", height:"300px", marginRight:"20px"}}>
                                <CardContent>
                                    <h2 style={{marginLeft:"30px", color: "#173c5e"}}>Login</h2>
                                    <TextField
                                        required
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        style={{marginLeft:"30px", width:300}}
                                        id="EmailAddress"
                                        label="Email"
                                        type="text"
                                        sx={{backgroundColor: '#fff'}}
                                        onChange={handleChange('email')}
                                    />
                                    <TextField
                                        required
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        style={{marginLeft:"30px", width:300}}
                                        id="Password"
                                        label="Password"
                                        type="password"
                                        sx={{backgroundColor: '#fff'}}
                                        onChange={handleChange('password')}
                                    />
                                    <br/>
                                    <Button 
                                        id="login"
                                        color="yellow" 
                                        variant="contained"
                                        style={{
                                            marginTop:"20px", 
                                            marginLeft:"30px", 
                                            width:"150px",
                                            height:"50px",
                                        }}
                                        onClick={handleSubmit} 
                                    >Login
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card id="card" style={{width: "500px", height: "300px"}}>
                                <CardContent>
                                    <h2 style={{marginLeft:"30px", color: "#173c5e"}}>
                                        New Customers
                                    </h2>
                                    <p style={{marginLeft:"30px", color: "#062241"}}>
                                        Consider signing up and never miss a sale again
                                    </p> 
                                    <br/>
                                    <Button 
                                        id="guest"
                                        color="yellow" 
                                        variant="contained"
                                        style={{
                                            marginTop:"80px", 
                                            marginLeft:"30px", 
                                            width:"150px",
                                            height:"50px",
                                            textAlign: "center"
                                        }}
                                        component={Link} 
                                        to="/cart/checkout_details"
                                    >Continue as Guest
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <Alerts 
                    openSuccess={openSuccess}
                    openFail={openFail}
                    setSuccess={setSuccess}
                    setFail={setFail}
                    textSuccess={""}
                    textFail={"Could not sign in: details not found in system"}
                />
                <Footer/>
            </div>
        </ThemeProvider>
        
    )
}

export default CheckoutOptionsPage;