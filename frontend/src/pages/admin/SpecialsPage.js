import {React, useState, useEffect} from 'react';
import './AdminPages.css';
import {Card, CardContent, Button, IconButton, Snackbar, Alert} from '@mui/material';
import RenderDiscountData from '../../components/admin/RenderDiscountData';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';
import Alerts from '../../components/Alerts';
import SearchBar from 'material-ui-search-bar';
import CloseIcon from '@mui/icons-material/Close';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page to manage all discounts displayed in a table providing its 
 * details. The discount details can be updated within the table and by default 
 * it shows all discounts users but is an option to display active discounts 
 * only. 
 * 
 * @returns SpecialsPage
 */
function SpecialsPage() {
    
    // Load page themes
    const theme = ThemeColour();
    // Use page history
    const history = useHistory();

    // Discount data states
    const [searchID, setSearchID] = useState("");
    const [discountList, setDiscountList] = useState([]);

    // Display sorting and ordering states
    const [sorted, setSorted] = useState("discountid");
    const [ordered, setOrdered] = useState("1")
    
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
    
    // Display sorting options
    const sortOptions = [
        {value: 'discountid', label: 'Discount ID'},
        {value: 'productid', label: 'Product ID'},
        {value: 'name', label: 'Product Name'},
        {value: 'gross_price', label: 'Gross Price'},
        {value: 'net_price', label: 'Net Price'},
        {value: 'start_date', label: 'Start Date'},
        {value: 'end_date', label: 'End Date'},
    ]
    // Display ordering options
    const orderOptions = [
        {value: '1', label: 'Ascending'},
        {value: '-1', label: 'Descending'}
    ]
    
    // Backend call to get all discount data and return data for given sorted and ordered parameters
    async function getAllData() {
        var response = {};
        if (sorted === "discountid") {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/discounts/view?order='+ordered, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        else {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/discounts/view?orderby='+sorted+'&order='+ordered, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        const data = await response.json();
        setDiscountList(data.discounts);
    }
    // Get all discount data on page load
    useEffect(() => {getAllData()}, []);

    // Get all active discounts and return data for given sorted and ordered parameters
    async function getActiveData() {
        var response = {};
        if (sorted === "discountid") {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/discounts/view/active?order='+ordered, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        else {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/discounts/view/active?orderby='+sorted+'&order='+ordered+'&date=2021-10-22', {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        const data = await response.json();
        setDiscountList(data.discounts);
    }

    // Get discounts for a given productid, returned in given sorted and ordered parameters
    async function getProductData() {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/discounts/view/id/'+searchID+'?order='+ordered, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        if (response.status !== 200) {
            setOpenSearch(true);
        }
        else {
            setDiscountList(data.discount);
        }
    }

    // Set the sorted order of data
    function handleSort(event) {
        setSorted(event.value);
    }
    // Set the ordering of data
    function handleOrder(event) {
        setOrdered(event.value);
    }
    // For changes in the sorting or ordering of data, reload the data
    useEffect(() => {getAllData()}, [sorted, ordered]);
    
    // Navigate to adding a new discount
    function handleAdd() {
        history.push('/admin/products/specials/add')
    }

    // Handle option to load all data
    function renderAllData() {
        setDiscountList([]);
        setSearchID("");
        getAllData();
    }
    // Handle option to load only active data
    function renderActiveData() {
        setDiscountList([]);
        setSearchID("");
        getActiveData();
    }
    // Handle searching for a specific product
    function search() {
        setDiscountList([]);
        getProductData();
    }
    // Render discount data for display for given list of discounts
    function renderSpecials() {
        var allDiscounts = [];

        for (var i = 0; i < discountList.length; i++) {
            var order = RenderDiscountData(discountList[i], {handleSuccess, handleFail});
            allDiscounts.push(order);
        }
        return (allDiscounts);
    }

    return(
        <div>
            <AdminHeader />
            <ThemeProvider theme={theme}>
                <div style={{paddingTop:50, paddingLeft: 50}}>
                    <Card id='card' style={{width:750, height:145}}>
                        <CardContent>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <SearchBar
                                    value={searchID}
                                    onChange={(newValue) => setSearchID(newValue)}
                                    onRequestSearch={() => search()}
                                    style={{width: "min(400px, 40vw)"}}
                                    placeholder='Search Product ID'
                                />
                                <div style={{paddingLeft: 20}}>
                                    <Select 
                                        options={sortOptions} 
                                        defaultValue={{value: 'discountid', label: 'Discount ID'}}
                                        onChange={handleSort}
                                    />
                                </div>
                                <div style={{paddingLeft: 20}}>
                                    <Select 
                                        options={orderOptions} 
                                        defaultValue={{value: '1', label: 'Ascending'}}
                                        onChange={handleOrder}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex', justifyContent:'space-between', paddingTop:25}}>
                                <Button color='medblue' variant = 'contained' onClick={renderAllData}>
                                    View All Discounts
                                </Button>
                                <Button color='medblue' variant = 'contained' onClick={renderActiveData}>
                                    View Active Discounts
                                </Button>
                                <Button color='yellow' variant = 'contained' onClick={handleAdd}>
                                    Add New Discount
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div style={{paddingTop: 15, paddingLeft: 50, paddingRight: 50}}>
                    <table id = "table">
                        <thead style={{backgroundColor:'#D1DEEC'}}>
                            <tr>
                                <th>Discount ID</th>
                                <th>Product Image</th>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Gross Price</th>
                                <th>Discounted Price</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderSpecials()}
                        </tbody>
                    </table>
                </div>
            </ThemeProvider>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully editted discount"}
                textFail={"Could not edit discount"}
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
                    Could not find discount for Product ID {searchID}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default SpecialsPage;