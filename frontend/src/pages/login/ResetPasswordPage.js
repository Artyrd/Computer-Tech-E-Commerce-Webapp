import {React, useState} from 'react';
import {Button, Card, CardContent, TextField} from '@mui/material';
import {useHistory} from 'react-router-dom';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../Header';
import { BACKEND_PORT } from '../../config.json';

/**
 * Reset a users password, takes a new password and a securty code given from the url
 * 
 * @returns ResetPasswordPage
 */
function ResetPasswordPage() {
    // Load page themes
    const theme = ThemeColour();
    // Use page history
    const history = useHistory();

    // Password and confirm password states
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirm] = useState("");
    const [passwordMatch, setMatch] = useState(false);

    // Backend call to update new password
    async function handleSubmit(event) {
        event.preventDefault();
        let query = new URLSearchParams(window.location.search);
        console.log(query.get("security_code"));
        await fetch('http://localhost:' + BACKEND_PORT + '/accounts/reset_password', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                security_code: query.get("security_code")
            })
        }).then(res => res.text())
        .then(data => console.log(data))
        .then(history.push('/login'))
    }

    // Handle inputting new password
    function handlePassword(event) {
        setPassword(event.target.value)
    }
    // Check if passwords match 
    function confirmPassword(event) {
        if (password === event.target.value) {
            setConfirm("Passwords look good!");
            setMatch(true);
        }
        else {
            setConfirm("Passwords don't match!")
            setMatch(false);
        }
    }

    return (
        <div>
            <Header />
            <div style={{paddingTop: 50, display:'flex', justifyContent:'center'}}>
                <ThemeProvider theme={theme}>
                    <Card id="card" style={{width:500}}>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <h2 id='header2' style={{height: 20}}>Enter a New Password Below</h2>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="newPassword"
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    onChange={handlePassword}
                                    autoFocus
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    onChange={confirmPassword}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                {!passwordMatch && <div style={{color: "red", marginBottom: "0.5em"}}>{confirmPass}</div>}
                                <Button type="submit" color="yellow" fullWidth variant="contained" disabled={!passwordMatch}>
                                    Reset Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default ResetPasswordPage;