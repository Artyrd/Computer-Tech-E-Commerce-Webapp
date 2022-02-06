import {React, useState} from 'react';
import {Card, CardContent, Button, TextField, IconButton} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../Header';
import { BACKEND_PORT } from '../../config.json';

/**
 * Allow users to enter their email and to send a password reset link, allowing users to reset their password
 * 
 * @returns ForgotPasswordPage 
 */
function ForgotPasswordPage() {
    // Load page themes
    const theme = ThemeColour();

    // Email state
    const [email, setEmail] = useState("");

    // Alert states
    const [open, setOpen] = useState(false);
    const [fail, setFail] = useState(false);

    // Backend call to submit email for the account that needs resetting
    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/accounts/forgot_password', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        })
        // Prompt user to check email to continue resetting password if email found
        if (response.status === 200) {
            setOpen(true);
        }
        // Else, email not found
        else {
            setFail(true);
        }
    }

    // Update email state on user input
    function handleChange(event) {
        setEmail(event.target.value);
    }

    return (
        <div>
            <Header />
            <ThemeProvider theme={theme}>
                <div style={{paddingTop: 50, display:'flex', justifyContent:'center'}}>
                    <Card id="card" style={{width:500}}>
                        <CardContent>
                            <h1 style={{color: "#173C5E"}}>Reset My Password</h1>
                            <p style={{color: "#173C5E"}}>Enter your email below to receive an password reset link.</p>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    type="text"
                                    onChange={handleChange}
                                    autoFocus
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <Button type="submit" color="yellow" fullWidth variant="contained">
                                    Send password reset code
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </ThemeProvider>
            <Snackbar open={open} anchorOrigin={{vertical: 'top', horizontal:'center'}} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="warning" sx={{ width: '100%' }}>
                    Please check your email to continue resetting your password
                </Alert>
            </Snackbar>
            <Snackbar open={fail} anchorOrigin={{vertical: 'top', horizontal:'center'}} autoHideDuration={6000} onClose={() => setFail(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setFail(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="warning" sx={{ width: '100%' }}>
                    Email not found
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ForgotPasswordPage;