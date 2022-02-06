import {React, useState, useEffect} from 'react';
import {Card, CardContent, Button} from '@mui/material';
import {useHistory} from 'react-router-dom';
import SalesOverviewLineGraph from '../../components/admin/sales-stats/SalesOverviewLineGraph';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates the home page for admin accounts, displays the daily sales and a
 * side bar with other menu available to the admin
 * 
 * @returns AdminHomePage
 */
function AdminHomePage() {
    // Use page history
    const history = useHistory();

    // If the administrator is not logged in, log in
    if (localStorage.getItem('token') === undefined || 
    localStorage.getItem('token') === null) {
        history.push('/admin/login');
    }

    // Load page themes
    const theme = ThemeColour();
    // Sales data state
    const [data, setData] = useState();
    
    // Navigation to adding a product
    function handleAdd() {
        history.push("/admin/products/add");
    }
    // Navigation to viewing all products
    function handleView() {
        history.push("/admin/products/view");
    }
    // Navigation to viewing product specials and discounts
    function handleManageSpecials() {
        history.push("/admin/products/specials");
    }
    // Navigation to view all orders
    function handleViewOrders() {
        history.push("/admin/view_orders");
    }
    // Navigation to view sales statistics
    function handleViewStats() {
        history.push("/admin/view_statistics/sales");
    }
    // Navigation to view administrators
    function handleManageAdmins() {
        history.push("/admin/manage/admins");
    }

    // Load overall sales data on page load
    useEffect(() => {getSales('overall')}, [])
    // Backend call to get overall sales data
    async function getSales(type) {
        // Get date today
        var today = new Date();
        // Calculate default start date 1 month from today and transform to string
        var milliseconds = 30 * 1000 * 3600 * 24;
        var startSeconds = today.getTime() - milliseconds;
        var startDate = new Date();
        startDate.setTime(startSeconds);
        var numDate = startDate.getDate().toString();
        if (numDate.length === 1) {
            numDate = '0' + numDate;
        }
        var numMonth = startDate.getMonth().toString();
        numMonth = (parseInt(numMonth) + 1).toString();
        if (numMonth.length === 1) {
            numMonth = '0' + numMonth;
        }
        var defaultStart = startDate.getFullYear() + '-' + numMonth + '-' + numDate;

        // Transform todays date to string format
        numDate = today.getDate().toString();
        if (numDate.length === 1) {
            numDate = '0' + numDate;
        }
        numMonth = today.getMonth().toString();
        numMonth = (parseInt(numMonth) + 1).toString();
        if (numMonth.length === 1) {
            numMonth = '0' + numMonth;
        }
        var dateToday = today.getFullYear() + '-' + numMonth + '-' + numDate;

        const response = await fetch('http://localhost:'+ BACKEND_PORT + '/admin/sales/statistics/overall?start='+defaultStart+'&end='+dateToday, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        setData(data.sales);
    }
    
    return(
        <div>
            <AdminHeader />
            <div style={{display:'flex', paddingTop: 50, justifyContent: 'space-evenly'}}>
                <ThemeProvider theme={theme}>
                    <Card sx={{width: 300}} id='card'>
                        <CardContent>
                            <h2 style={{color: '#173C5E'}}>Select an Action</h2>
                            <div style={{paddingTop: 15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleAdd}>
                                    Add a Product
                                </Button>
                            </div>
                            <div style={{paddingTop: 15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleView}>
                                    View All Products
                                </Button>
                            </div>
                            <div style={{paddingTop: 15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleManageSpecials}>
                                    Manage Sale Specials
                                </Button>
                            </div>
                            <div style={{paddingTop: 15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleViewOrders}>
                                    View Order Details
                                </Button>
                            </div>
                            <div style={{paddingTop: 15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleViewStats}>
                                    View Sales Statistics
                                </Button>
                            </div>
                            <div style={{paddingTop: 15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleManageAdmins}>
                                    Manage Admins
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card id='card' style={{width:1380}}>
                        <CardContent>
                            <SalesOverviewLineGraph incoming={data}/>
                        </CardContent>
                    </Card>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default AdminHomePage;