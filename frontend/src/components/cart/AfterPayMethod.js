import { React } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';
import afterpayLogo from '../../img/afterpay.png'

/**
 * Creates a afterpay account login menu
 * 
 * @param {method} string 
 * @param {setMethod} function
 * @returns AfterPay
 */
const AfterPay = ({ method, setMethod }) => {

    const theme = ThemeColour();

    // check if the current question is number 1
    if (method !== "afterpay") {
        return null;
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width:"500px", height:"350px"}}>
                <CardContent>
                    <img src={afterpayLogo} style={{marginBottom:"20px", width:"200px"}}/>
                    <h2 style={{marginBottom:"10px"}}>Installments by afterpay</h2>
                    <TextField size="small" placeholder="Email" style={{marginBottom:"10px", width:"460px"}}></TextField>
                    <TextField type="password" size="small" placeholder="Password" style={{marginBottom:"10px", width:"460px"}}></TextField>
                    <Button size="large" onClick={() => {setMethod("")}} style={{width:"460px", color:"white", backgroundColor:"#0079C1"}}>Log In</Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default AfterPay;