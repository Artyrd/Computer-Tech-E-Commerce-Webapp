import {React, useState, useEffect} from 'react';
import { Card, CardContent, IconButton } from '@mui/material';
import './CustomerPages.css';
import RenderOrderData from '../../components/customer/RenderOrderData';
import Alerts from '../../components/Alerts';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import { useHistory } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Navigation from '../../components/customer/Navigation';
import { BACKEND_PORT } from '../../config.json';
import Footer from '../Footer';

function OrderHistoryPage() {
    // Load page themes
    const theme = ThemeColour();
    // Use page history 
    const history = useHistory();

    // Order data states
    const [orderList, setOrderList] = useState([]);

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };

    // Backend call to get past order history for a user in storage
    async function getHistory(event) {
        console.log(localStorage.getItem('customerid'))
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/orders/user/' +localStorage.getItem('customerid'), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        if (response.status === 200) {
            const data = await response.json();
            setOrderList(data.orders);
        }
    }
    // Get order history on page load
    useEffect(() => {getHistory()}, []);

    // Render all order data for individual rows of order data
    function renderAllData() {
        let allOrders = [];
        console.log()
        for (let i = 0; i < orderList.length; i++) {
            let order = RenderOrderData(orderList[i], {handleSuccess, handleFail});
            allOrders.push(order);
        }
        return (allOrders);        
    } 

    // Conditionally render order data
    function renderContent() {
        // If there are no past orders, prompt user to shop
        if (orderList.length === 0) {
            return(
                <Card style={{width: 450, backgroundColor:'#F2F5F8'}}>
                    <CardContent>
                        <div style={{display: 'flex', justifyContent: 'center', paddingTop: 100}}>
                            <IconButton onClick={() => {history.push('/products')}}>
                                <ShoppingCartIcon sx={{fontSize:100, color:'#edd071'}}/>
                            </IconButton>
                        <div>
                            <h2 id='header2'>
                                No past orders, 
                            </h2>
                            <h2 id='header2'>
                                go browse our catalogue!
                            </h2>
                        </div>
                        </div>
                    </CardContent>
                </Card>
            )
        }
        // Else, show orders
        else {
            return(
                <table id = "table" >
                    <thead style={{backgroundColor:'#D1DEEC'}}>
                        <tr>
                            <th>Order #</th>
                            <th>Order Date</th>
                            <th>Customer ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Delivery Address</th>
                            <th>Delivery Option</th>
                            <th>Order Details</th>
                            <th>Order Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderAllData()}
                    </tbody>
                </table>
            )
        }
    }

    return(
        <div>
            <Header />
            <ThemeProvider theme={theme}>
                <div style={{
                    display: 'flex', 
                    justifyContent: 'space-evenly', 
                    paddingLeft: 50, 
                    paddingRight: 50, 
                    paddingTop:50, 
                    paddingBottom: 50, 
                    minHeight:'calc(100vh - 480px)'
                }}>
                    <Card sx={{width: 300, height: 400, backgroundColor:'#F2F5F8'}}>
                        <CardContent>
                            <Navigation />
                        </CardContent>
                    </Card>
                    <div style={{maxWidth: '100%'}}>
                        {renderContent()}
                    </div>
                    
                </div>
            </ThemeProvider>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully editted this order!"}
                textFail={"Could not edit this order"}
            />
            <Footer />
        </div>
    );
}

export default OrderHistoryPage;