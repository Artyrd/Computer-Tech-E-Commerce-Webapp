import { React, useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { useHistory } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';
import Alerts from '../../components/Alerts';
import starTrackLogo from '../../img/starTrack.jpg'
import ausPostLogo from '../../img/ausPost.jpg'
import stargateLogo from '../../img/stargate.png'

/**
 * Creates a shipping option page which displays the options the user has for 
 * shipping, these include StarTrack, Australian Post and Pickup at StarGate
 * 
 * @returns CheckoutShippingPage
 */
function CheckoutShippingPage() {
    
    const history = useHistory();
    const theme = ThemeColour();
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);

    // updates the customer order than hasn't been confirmed yet
    function updateOrder() {  

        // get the current order from the local storage
        let order = localStorage.getItem("order")
        order = JSON.parse(order)

        // check if one of the option is selected, if so then add the shipping
        // method to the order else alert the user to choose an option
        if (document.getElementById('starTrack').checked === true||
            document.getElementById('ausPost').checked === true ||
            document.getElementById('pickup').checked === true) {
            
            const shipping = document.querySelector('input[name="shipping"]:checked').value;
            order.delivery_option = shipping;
        } else {
            handleFail();
            return "fail";
        }

        // change the order field this page covers
        const shipping = document.querySelector('input[name="shipping"]:checked').value;
        order.delivery_option = shipping

        // add the order to the local storage
        localStorage.setItem("order", JSON.stringify(order))
        console.log(JSON.parse(localStorage.getItem("order")))
        return "success";
    }

    // handle the click event of the confirm button
    function handleSubmit() {
        if (updateOrder() == "success") {
            history.push('/cart/checkout_payment')
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
                            <h1 style={{color: "#173c5e"}}>Shipping Options</h1>
                        </div>

                        <FormControl component="fieldset" style={{paddingBottom:"20px"}}>
                            <FormLabel component="legend"></FormLabel>
                            <RadioGroup
                                aria-label="shipping"
                                name="radio-buttons-group"
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    justifyContent: 'space-between',
                                    width: '80%',
                                }}>
                                    <div>
                                        <img src={starTrackLogo} style={{width:'350px'}}/>
                                        <FormControlLabel 
                                            control={<Radio color="darkblue" id="starTrack" name="shipping" value="starTrack" />} 
                                            label="$25.00 (3 to 5 days)"
                                        />
                                    </div>
                                <div>
                                    <img src={ausPostLogo} style={{width:'350px'}}/>
                                    <FormControlLabel 
                                        control={<Radio color='darkblue' id="ausPost" name="shipping" value="ausPost" />} 
                                        label="$20.00 (7 to 12 days)"
                                    />
                                </div>
                                    <div>
                                        <img src={stargateLogo} style={{width:'300px'}}/>
                                        <FormControlLabel 
                                            control={<Radio color='darkblue' id="pickup" name="shipping" value="pickup" />} 
                                            label="$0.00 (when notificed via email)" 
                                        />
                                    </div>
                                </div>
                            </RadioGroup>

                        </FormControl>
                        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
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
                    textFail={"No option chosen: Please pick one of the shipping options"}
                />
                
                <Footer/>
            </div>
        </ThemeProvider>
    )
}

export default CheckoutShippingPage;