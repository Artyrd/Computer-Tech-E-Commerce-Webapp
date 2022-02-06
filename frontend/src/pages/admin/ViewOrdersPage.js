import {React, useState, useEffect} from 'react';
import { Card, CardContent, Snackbar, Alert, IconButton, Button } from '@mui/material';
import './AdminPages.css';
import RenderOrderData from '../../components/admin/RenderOrderData';
import Alerts from '../../components/Alerts';
import SearchBar from 'material-ui-search-bar';
import CloseIcon from '@mui/icons-material/Close';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page to view all orders in table displaying the customer and order 
 * details 
 * 
 * @returns ViewOrdersPage
 */
function ViewOrdersPage() {
    // Load page themes
    const theme = ThemeColour();

    // Order data states
    const [orderList, setOrderList] = useState([]);
    const [searchID, setSearchID] = useState("");

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };

    // Backend call to get all orders
    async function getOrders(event) {
        setSearchID("");
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/orders', {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        if (response.status == 200) {
            setOrderList(data.orders);
        }
    }
    // Backend call to get an order for specified orderid: searchID
    async function getSearch(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/orders/'+searchID, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        console.log(data);
        if (data.order.products.length === 0) {
            // if order is not found, alert
            setOpenSearch(true);
        }
        else {
            setOrderList([data.order]);
        }
    }
    // Get all orders on page load
    useEffect(() => {getOrders()}, []);

    // Render order data for display for given list of orders
    function renderAllData() {

        var allOrders = [];
    
        for (var i = 0; i < orderList.length; i++) {
            var order = RenderOrderData(orderList[i], {handleSuccess, handleFail});
            allOrders.push(order);
        }
        return (allOrders);
    }

    return(
        <div>
            <AdminHeader />
            <ThemeProvider theme={theme}>
                <div style={{paddingTop: 50, paddingBottom: 25, paddingLeft: 50}}>
                    <Card id='card' style={{width:750, height:80}}>
                        <CardContent>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <SearchBar
                                    value={searchID}
                                    onChange={(newValue) => setSearchID(newValue)}
                                    onRequestSearch={() => getSearch()}
                                    style={{width: "min(500px, 50vw)"}}
                                    placeholder='Search Order ID'
                                />
                                <div style={{paddingLeft: 50}}>
                                    <Button color='medblue' variant='contained' onClick={getOrders}>
                                        Show All
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div style={{paddingRight:50, paddingLeft: 50}}>
                    <table id = "table">
                        <thead style={{backgroundColor:'#D1DEEC'}}>
                            <tr>
                                <th>Order Number</th>
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
                </div>
            </ThemeProvider>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully editted order!"}
                textFail={"Could not edit order"}
            />
            <Snackbar open={openSearch} anchorOrigin={{vertical: 'top', horizontal:'center'}} autoHideDuration={6000} onClose={() => setOpenSearch(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpenSearch(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="error" sx={{ width: '100%' }}>
                    Could not find Order ID {searchID}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ViewOrdersPage;