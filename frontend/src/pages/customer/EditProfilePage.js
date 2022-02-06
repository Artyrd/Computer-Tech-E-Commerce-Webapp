import {React, useEffect, useState} from 'react';
import { Card, CardContent, Button, TextField, FormControlLabel, IconButton} from '@mui/material';
import { Checkbox } from '@mui/material';
import Alerts from '../../components/Alerts';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Navigation from '../../components/customer/Navigation';
import { BACKEND_PORT } from '../../config.json';
import Footer from '../Footer';


function EditProfilePage() {
    // Load page themes
    const theme = ThemeColour();

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [openWarning, setWarning] = useState(false);
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };
    
    // Profile information states
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [mailing, setMailing] = useState(false); 
    
    // Backend call to get profile information
    async function getProfile(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/profile/'+localStorage.getItem('customerid'), {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        console.log(data);

        if (data.first_name === null) {data.first_name = ""};
        if (data.last_name === null) {data.last_name = ""};
        if (data.email === null) {data.email = ""};
        if (data.phone === null) {data.phone = ""};
        if (data.address === null) {data.address = ""};
        setProfile({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
        })
        if (data.mailing_list === 1) {
            setMailing(true);
        }
        else {
            setMailing(false);
        }
    }
    // Get profile information on page load
    useEffect(() => {getProfile()}, []);

    // Backend call to update profile information for given inputs
    async function handleSubmit(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/profile/edit/'+localStorage.getItem('customerid'), {
            method: 'PUT',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                phone_number: profile.phone,
                address: profile.address,
                mailing_list: mailing,
            })
        })
        console.log(profile);
        // Alert status 
        if (response.status === 200) {
            handleSuccess();
        }
        else {
            handleFail();
        }
    }
    // Backend call to initiate the change password process
    async function changePassword(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/accounts/forgot_password', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: profile.email,
            })
        })
        // Alert user to check email to continue changing password
        if (response.status === 200) {
            setWarning(true);
        }
    }

    // Handle changing inputs for profile information
    const handleChange = name => event => {
        setProfile({...profile, [name]: event.target.value})
    }
    function handleMailing(event) {
        setMailing(event.target.checked);
    }

    return(
        <div>
            <Header />
            <div style={{display: 'flex', justifyContent: 'space-evenly', paddingLeft: 100, paddingRight: 100, paddingTop:50, paddingBottom: 50}}>
                <ThemeProvider theme={theme} >
                    <Card id='card' sx={{width: 300, height: 350}}>
                        <CardContent>
                            <Navigation />
                        </CardContent>
                    </Card>
                    <Card id='card'>
                        <CardContent>
                            <h1 style={{color: "#173C5E"}}>Edit Profile Details</h1>
                            <h3 id="header2" style={{height: 20}}>Contact Details</h3>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="fname"
                                name="fname"
                                label='First Name'
                                type="text"
                                value={profile.first_name}
                                autoFocus
                                onChange={handleChange('first_name')}
                                sx={{backgroundColor:'#fff'}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label='Last Name'
                                id="lname"
                                name="lname"
                                type="text"
                                value={profile.last_name}
                                onChange={handleChange('last_name')}
                                sx={{backgroundColor:'#fff'}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                name="email"
                                type="text"
                                label='Email Address'
                                value={profile.email}
                                onChange={handleChange('email')}
                                sx={{backgroundColor:'#fff'}}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="phone"
                                name="phone"
                                type="text"
                                label='Phone Number'
                                value={profile.phone}
                                onChange={handleChange('phone')}
                                sx={{backgroundColor:'#fff'}}
                            />
                            <h3 id="header2" style={{height: 20}}>Shipping Details</h3>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                multiline
                                fullWidth
                                id="address"
                                name="address"
                                type="text"
                                label='Main Address'
                                value={profile.address}
                                onChange={handleChange('address')}
                                sx={{backgroundColor:'#fff'}}
                            />
                            <h3 id="header2" style={{height: 20}}>Mailing Preferences</h3>
                            <FormControlLabel control={<Checkbox onChange={handleMailing} checked={mailing}/>} label="Subscribed to Mailing List" />
                            <Button  onClick={handleSubmit} type="submit" color="medblue" fullWidth variant="contained">
                                Update Details
                            </Button>
                            <h3 id='header2' style={{height: 25}}>Update Password</h3>
                            <Button onClick={changePassword} color='yellow' variant='contained'>
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>
                </ThemeProvider>
            </div>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully editted your profile!"}
                textFail={"Could not edit your profile"}
            />
            <Snackbar open={openWarning} autoHideDuration={6000} onClose={() => setWarning(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setWarning(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="warning" sx={{ width: '100%' }}>
                    Please check your email to continue resetting your password
                </Alert>
            </Snackbar>
            <Footer />
        </div>
    )
}

export default EditProfilePage;