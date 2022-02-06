import {React, useState} from 'react';
import {Card, CardContent, Button, Link, TextField, IconButton} from '@mui/material';
import {useHistory} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';
import ThemeColour from '../ThemeColour';
import { ThemeProvider} from '@mui/material/styles';
import Header from '../Header';
import { BACKEND_PORT } from '../../config.json';

// Display register section with flex
const RegisterGuest = styled.div`
display: flex;
flex-direction: column;
padding: 1em;
`;

// Make a divider line
const DividerHolderDiv = styled.div`
text-align: center; 
border-bottom: 1px solid #a1a1a1; 
line-height: 0.1em;
margin: 20px 0 20px;
`;
const DividerHolderSpan = styled.span`
    background:#F2F5F8; 
    padding:0 10px; 
    color: #a1a1a1;
`;
// Divider line with text
function DividerHolder({ content }) {
    return (
        <DividerHolderDiv>
            <DividerHolderSpan>
                { content }
            </DividerHolderSpan>
        </DividerHolderDiv>
    );
} 

/**
 * General login page for users to access their profile in Stargate
 * 
 * @returns LoginPage
 */
function LoginPage() {
    // Load page themes
    const theme = ThemeColour();
    // Use page history
    const history = useHistory();

    // Login details states
    const [input, setInput] = useState({
        email: "",
        password: "",
    })
    // Alert handler for failed login
    const [open, setOpen] = useState(false);

    // Backend call to log the user in for a given email and password
    async function handleSubmit(event) {
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
        const data = await response.json();
        console.log(data);
        // Could not log in alert
        if (response.status === 400) {
          setOpen(true);
        }
        // Log in and store token and customerid in local storage
        else {
          console.log(data.access_token);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("customerid", data.customer_id);
          history.push('/');
        }
    }

    // Navigate to registration page
    function handleRegister() {
        history.push("/register");
    }
    // Update email and password for changing inputs
    const handleChange = name => event => {
        setInput({...input, [name]: event.target.value})
    }

    return (
        <div>
            <Header />
            <ThemeProvider theme={theme}>
                <div style={{paddingTop: 50, display:'flex', justifyContent:'center'}}>
                    <Card id="card" style={{width: 500}}>
                        <CardContent>
                            <h1 style={{color: "#173c5e"}}>Login</h1>
                            <form onSubmit = {handleSubmit}>
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
                                    autoFocus
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={handleChange('password')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <div style={{paddingBottom: 10}}>
                                    <Link href="/forgot_password">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <Button type="submit" color="medblue" fullWidth variant="contained" onClick={handleSubmit}>
                                    Sign In
                                </Button>
                            </form>
                        </CardContent>
                        <RegisterGuest>
                            <DividerHolder content={"New to Stargate?"} />
                            <Button color="yellow" fullWidth variant="contained" onClick={handleRegister}>
                                Register for an account
                            </Button>
                        </RegisterGuest>
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
                    Could not sign in: details not found in system
                </Alert>
            </Snackbar>
        </div>
    );
}

export default LoginPage;