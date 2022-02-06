import {React, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Card, CardContent, Button, TextField, FormControlLabel} from '@mui/material';
import { Checkbox } from '@mui/material';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import Header from '../Header';
import { BACKEND_PORT } from '../../config.json';

/**
 * Allow users to register for an account in Stargate using a name, email, phone and password
 * 
 * @returns RegisterPage
 */
function RegisterPage() {
    // Load page themes
    const theme = ThemeColour();
    // Use page history
    const history = useHistory();

    // New account data states
    const [input, setInput] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [mailing, setMailing] = useState(true);
    // States to check matching passwords
    const [confirmPass, setConfirm] = useState("");
    const [passwordMatch, setMatch] = useState(false);
    
    // Backend call to create a new account with the given details
    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/accounts/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                first_name: input.firstName,
                last_name: input.lastName,
                email: input.email,
                password: input.password,
                phone: input.phone,
                mailing_list: mailing,
            })
        }) 
        // If successful, navigate to login
        if (response.status === 200) {
            console.log(response.json());
            history.push('/login');
        }
        else if (response.status === 400) {
            alert('bad details');
        }
    }

    // Handle changing input details
    const handleChange = name => event =>{
        setInput({...input, [name]: event.target.value})
    }

    // Display to user when entering the password whether the passwords match or not
    function confirmPassword(event) {
        if (input.password === event.target.value) {
            setConfirm("Passwords look good!");
            setMatch(true);
        }
        else {
            setConfirm("Passwords don't match!")
            setMatch(false);
        }
    }

    // Handle checkbox for mailing list subscription
    function handleMailing(event) {
        setMailing(event.target.checked);
    }

    return (
        <div>
            <Header />
            <div style={{paddingTop: 50, display:'flex', justifyContent: 'center'}}>
                <ThemeProvider theme={theme}>
                    <Card id="card" style={{width:500}}>
                        <CardContent>
                            <h1 style={{color: "#173C5E"}}>Register for a New Account</h1>
                            <form onSubmit = {handleSubmit}>
                                <div style={{display:'flex'}}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="first name"
                                        label="First Name"
                                        name="first name"
                                        type="text"
                                        onChange={handleChange('firstName')}
                                        autoFocus
                                        sx={{backgroundColor: '#fff'}}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="last name"
                                        label="Last Name"
                                        name="last name"
                                        type="text"
                                        onChange={handleChange('lastName')}
                                        sx={{backgroundColor: '#fff'}}
                                    />
                                </div>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    type="text"
                                    onChange={handleChange('email')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    name="phone"
                                    type="text"
                                    onChange={handleChange('phone')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <div style={{display: 'flex'}}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="new password"
                                        label="New Password"
                                        type="password"
                                        id="new password"
                                        onChange={handleChange('password')}
                                        sx={{backgroundColor: '#fff'}}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirm password"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirm password"
                                        onChange={confirmPassword}
                                        sx={{backgroundColor: '#fff'}}
                                    />
                                </div>
                                {!passwordMatch && <div style={{color: "red", marginBottom: "0.5em"}}>{confirmPass}</div>}
                                <FormControlLabel control={<Checkbox onChange={handleMailing} checked={mailing}/>} label="Subscribe to Mailing List" />
                                <Button type = "submit" color="yellow" fullWidth variant="contained" disabled={!passwordMatch}>
                                    Register
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default RegisterPage;