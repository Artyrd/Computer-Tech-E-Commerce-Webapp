import { React, useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { useHistory } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';
import Alerts from '../../components/Alerts';
import mastercardLogo from '../../img/mastercard.png'
import paypalLogo from '../../img/paypal.png'
import afterpayLogo from '../../img/afterpay.png'
import CreditCard from '../../components/cart/CardMethod'
import PayPal from '../../components/cart/PayPayMethod'
import AfterPay from '../../components/cart/AfterPayMethod'

/**
 * Creates a payment option page which displays the options the user has for 
 * paying, these include Card, PayPal and AfterPay
 * 
 * @returns CheckoutPaymentPage
 */
function CheckoutPaymentPage() {

    const history = useHistory();
    const theme = ThemeColour();
    const [method, setMethod] = useState("");
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);

    // updates the customer order than hasn't been confirmed yet
    function updateOrder() {  

        // get the current order from the local storage
        let order = localStorage.getItem("order")
        order = JSON.parse(order)

        // check if one of the option is selected, if so then add the payment
        // method to the order else alert the user to choose an option
        if (document.getElementById('card').checked === true||
            document.getElementById('paypal').checked === true ||
            document.getElementById('afterpay').checked === true) {
            
            const payment = document.querySelector('input[name="payment"]:checked').value;
            order.payment_method = payment
        } else {
            handleFail();
            return "fail";
        }

        // add the order to the local storage
        localStorage.setItem("order", JSON.stringify(order));
        return "success";
    }

    // change the method the user has selected
    function handleChange(method) {
        setMethod(method);
    }

    // handle the click event of the confirm button
    function handleSubmit() {
        if (updateOrder() == "success") {
            history.push('/cart/checkout_review')
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
                            <h1 style={{color: "#173c5e"}}>Payment Options</h1>
                        </div>

                        <FormControl component="fieldset" style={{paddingBottom:"20px"}}>
                            <FormLabel component="legend"></FormLabel>
                            <RadioGroup
                                aria-label="payment"
                                name="radio-buttons-group"
                                onChange={
                                    (event) => {handleChange(event.target.value)}
                                }
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    justifyContent: 'space-between',
                                    width: '50%',
                                    marginRight: '118px'
                                }}>
                                    <div>
                                        <img src={mastercardLogo} style={{width:'350px', height:'70'}}/>
                                        <FormControlLabel 
                                            control={<Radio color="darkblue" id="card" name="payment" value="card"/>} 
                                            label="Card"
                                        />
                                        <CreditCard method={method} setMethod={setMethod}/>
                                    </div>
                                    <div style={{marginTop:'20px'}}>
                                        <img src={paypalLogo} style={{width:'350px', height:'70'}}/>
                                        <FormControlLabel 
                                            control={<Radio color='darkblue' id="paypal" name="payment" value="paypal" />} 
                                            label="PayPal"
                                        />
                                        <PayPal method={method} setMethod={setMethod}/>
                                    </div>
                                    <div>
                                        <img src={afterpayLogo} style={{width:'350px', height:'70'}}/>
                                        <FormControlLabel 
                                            control={<Radio color='darkblue' id="afterpay" name="payment" value="afterpay" />} 
                                            label="AfterPay" 
                                        />
                                        <AfterPay method={method} setMethod={setMethod}/>
                                    </div>
                                </div>
                            </RadioGroup>
                        </FormControl>

                        <div>
                            <Button 
                                id="continue"
                                color='yellow' 
                                variant='contained'
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
                    textFail={"No option chosen: Please pick one of the payment options"}
                />
                
                <Footer/>
            </div>
        </ThemeProvider>
    )
}

export default CheckoutPaymentPage;