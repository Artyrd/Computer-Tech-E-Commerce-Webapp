import { React } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';
import paypalLogo from '../../img/paypal.png'

/**
 * Creates a paypal account login menu
 * 
 * @param {method} string 
 * @param {setMethod} function
 * @returns PayPal
 */
const PayPal = ({ method, setMethod }) => {

    const theme = ThemeColour();

    // if the payment method is using paypal
    if (method !== "paypal") {
        return null;
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width:"500px", height:"350px"}}>
                <CardContent>
                    <img src={paypalLogo} style={{marginBottom:"20px", width:"200px"}}/>
                    <h2 style={{marginBottom:"10px"}}>Pay with PayPal</h2>
                    <TextField size="small" placeholder="Email" style={{marginBottom:"10px", width:"460px"}}></TextField>
                    <TextField type="password" size="small" placeholder="Password" style={{marginBottom:"10px", width:"460px"}}></TextField>
                    <Button size="large" onClick={() => {setMethod("")}} style={{width:"460px", color:"white", backgroundColor:"#0079C1"}}>Log In</Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default PayPal;