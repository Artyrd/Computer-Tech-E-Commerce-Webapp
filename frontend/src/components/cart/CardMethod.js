import { React } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';
import mastercardLogo from '../../img/mastercard.png'

/**
 * Creates a credit card detail collection menu
 * 
 * @param {method} string 
 * @param {setMethod} function
 * @returns CreditCard
 */
const CreditCard = ({ method, setMethod}) => {

    const theme = ThemeColour();

    // if the payment method is using paypal
    if (method !== "card") {
        return null;
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width:"500px", height:"410px"}}>
                <CardContent>
                    <img src={mastercardLogo} style={{marginBottom:"20px", width:"290px"}}/><br/>
                    <div style={{marginLeft:"8px", marginBottom:"10px", lineHeight:"35px"}}>
                        Name on card: 
                        <TextField size="small" style={{marginLeft:"5px", width:"300px"}}></TextField><br/>
                    </div>
                    <div style={{marginLeft:"13px", marginBottom:"10px", lineHeight:"35px"}}>
                        Card Number: 
                        <TextField size="small" style={{marginLeft:"5px", width:"300px"}}></TextField><br/>
                    </div>
                    <div style={{marginBottom:"10px", lineHeight:"35px"}}>
                        Expiration Date: 
                        <TextField size="small" placeholder="month" style={{marginLeft:"5px", width:"150px"}}></TextField>
                        <TextField size="small" placeholder="year" style={{marginLeft:"5px", width:"100px"}}></TextField><br/>
                    </div>
                    <div style={{marginLeft:"12px", marginBottom:"10px", lineHeight:"35px"}}>
                        Security Code: 
                        <TextField size="small" style={{marginLeft:"5px", width:"66px"}}></TextField>
                    </div>
                    <Button size="large" onClick={() => {setMethod("")}} variant="contained" color="yellow" style={{width:"460px"}}>Log In</Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default CreditCard;