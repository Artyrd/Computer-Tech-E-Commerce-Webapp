import {React, useState, useEffect} from 'react';
import { Card, CardContent, Button } from '@mui/material';
import {useHistory} from 'react-router-dom';
import RecentOrder from '../../components/customer/RecentOrder';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import styled from 'styled-components';
import { BACKEND_PORT } from '../../config.json';
import Footer from '../Footer';

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
 * Loads the customer dashboard showing customer actions, overview their details, recent orders and newsletter status
 * 
 * @returns CustomerProfilePage
 */
function CustomerProfilePage() {
    // Load page themes
    const theme = ThemeColour();
    // Use page history
    const history = useHistory();
    // Profile information states
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        mailing_list: false,
    })

    // Navigate to order history
    function handleHistory() {
        history.push("/profile/order_history");
    }
    // Navigate to wishlist
    function handleWishlist() {
        history.push("/profile/wishlist");
    }
    // Navigate to edit profile
    function handleEdit() {
        history.push("/profile/edit");
    }

    // Get profile information on page load
    useEffect(() => {getProfile()}, []);
    // Backend call to get customer profile for stored customerid
    async function getProfile() {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/profile/'+localStorage.getItem('customerid'), {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        console.log(data);
        setProfile({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            mailing_list: data.mailing_list
        })
    }

    // Conditionally render mailing list subscription status to promote subscription
    function renderSubscription() {
        if (profile.mailing_list === 0 || profile.mailing_list === false) {
            return(
                <div>
                    <h3 id='cheader3'>Inactive</h3>
                    <DividerHolder content={"Edit Preferences"} />
                    <Button color="yellow" variant="contained" fullWidth onClick={handleEdit}>
                        Edit Profile
                    </Button>
                </div>
            )
        }
        else {
            return(
                <h3 id='cheader3'>Active!</h3>
            )
        }
    }
    
    return(
        <div>
            <Header />
            <ThemeProvider theme={theme}>
                <div style={{display: 'flex', justifyContent: 'space-evenly', paddingLeft: 100, paddingRight: 100, paddingTop:50, paddingBottom: 50}}>
                        <Card sx={{width: 300, height: 280, backgroundColor:'#F2F5F8'}}>
                            <CardContent>
                                <h2 id='header2'> Actions </h2>
                                <div style={{paddingBottom: 12}}>
                                    <Button color="lightblue" variant="contained" fullWidth onClick={handleEdit}>
                                        Edit Profile
                                    </Button>
                                </div>
                                <div style={{paddingTop: 12, paddingBottom: 12}}>
                                    <Button color="lightblue" variant="contained" fullWidth onClick={handleHistory}>
                                        View Order History
                                    </Button>
                                </div>
                                <div style={{paddingTop: 12, paddingBottom: 12}}>
                                    <Button color="lightblue" variant="contained" fullWidth onClick={handleWishlist}>
                                        View Wishlists
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card sx={{width: 800, height: 700, backgroundColor:'#F2F5F8'}}>
                            <CardContent>
                                <h2 id='header2'> Recent Orders </h2>
                                <RecentOrder />
                                <DividerHolder content={"Contact Information"} />
                                <div style={{display: 'flex', justifyContent:'space-between'}}>
                                    <div>
                                        <h2 id='header2' style={{height:50}}>Contact Information</h2>
                                        <h3 id='cheader3'>{profile.first_name} {profile.last_name}</h3>
                                        <h3 id='cheader3'>{profile.email}</h3>
                                        <h3 id='cheader3' style={{height:50}}>{profile.phone}</h3>
                                        <h2 id='header2' style={{height:50}}>Main Shipping Address</h2>
                                        <h3 id='cheader3'>{profile.address}</h3>
                                    </div>
                                    <div>
                                        <h2 id='header2' style={{height:50}}>Newsletter Subscription</h2>
                                        {renderSubscription()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                </div>
                <Footer />
            </ThemeProvider>
        </div>
    );
}

export default CustomerProfilePage;