import {React, useEffect, useState} from 'react';
import {Card, CardContent, Button, Typography} from '@mui/material';
import SalesOverviewLineGraph from '../../components/admin/sales-stats/SalesOverviewLineGraph';
import PopularTable from '../../components/admin/sales-stats/PopularTable';
import SalesProductGraph from '../../components/admin/sales-stats/SalesProductGraph';
import SalesCategoryGraph from '../../components/admin/sales-stats/SalesCategoryGraph';
import UnpopularTable from '../../components/admin/sales-stats/UnpopularTable';
import TimeRange from '../../components/admin/sales-stats/TimeRange';
import Select from 'react-select';
import CategoryOptions from '../../components/admin/products/CategoryOptions';
import SearchBar from 'material-ui-search-bar';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page that display how many products was sold, the sale statistic 
 * period can be either a spectic date set by the admin or a set period 
 * (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year, and 2 years).
 * 
 * @returns ViewSalesStatisticsPage
 */
function ViewSalesStatisticsPage() {

    // Load page themes
    const theme = ThemeColour();
    
    // State handling graph type to display
    const [display, setDisplay] = useState("overall");
    // Search states
    const [searchID, setSearchID] = useState("");
    const [searchName, setSearchName] = useState("");

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
    const [start, setStart] = useState(defaultStart);
    const [end, setEnd] = useState(dateToday);
    const [timeSpan, setTimeSpan] = useState("1M");
    const [days, setDays] = useState(30);
    const [data, setData] = useState();

    // Category states
    const [category, setCategory] = useState({value:'CPU', label:'CPU'});
    const [popCategory, setPopCategory] = useState({value:'Overall', label:'Overall'});
    var popCategoryOptions = CategoryOptions();
    popCategoryOptions.push({value:'Overall', label:'Overall'});
    
    // For changes in a selected category, redisplay category sales statistics
    useEffect(() => {setData(); getSales('category');}, [category]);
    // For changes in a selected category, redisplay most/least popular sales statistics for a category
    useEffect(() => {setData(); if(display === 'popular') {getPopular(1);} else {getPopular(-1);}}, [popCategory]);
    // For changes in the start date to display, redisplay data
    useEffect(() => {setData(); if(display === 'popular') {getPopular(1);} 
    else if (display==='unpopular') {getPopular(-1);} else {getSales(display)}}, [start]);
    // Get overall sales data on page load
    useEffect(() => {getSales('overall')}, [])

    // Backend call to get sales data for a given display type, start and end date
    async function getSales(type) {
        var response = {};
        // Overall sales data
        if (type === 'overall') {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/statistics/overall?start='+start+'&end='+end, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        // Sales for a specific product
        else if (type === 'product') {
            if (searchID === "" && searchName === "") {
                response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/statistics/overall?start='+start+'&end='+end, {
                    method: 'GET',
                    headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                    },
                })
            }
            // Search product id
            else if (searchID !== "") {
                response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/statistics/product/id/'+searchID+'?start='+start+'&end='+end, {
                    method: 'GET',
                    headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                    },
                })
            }
            // Search product name
            else if (searchName !== "") {
                response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/statistics/product/name/'+searchName+'?start='+start+'&end='+end, {
                    method: 'GET',
                    headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                    },
                })
            }
        }
        // Sales for a specific category
        else if (type === 'category') {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/statistics/category/'+category.label+'?start='+start+'&end='+end, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        const data = await response.json();
        setData(data.sales);
    }
    // Backend call to get most/least popular items for a start and end date
    async function getPopular(popular) {
        var response = {};
        if (popCategory.label === 'Overall') {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/popular?start='+start+'&end='+end+'&num='+days+'&order='+popular, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        // Display most/least popular for a specific category
        else {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/sales/popular/category/'+popCategory.label+'?start='+start+'&end='+end+'&num='+days+'&order='+popular, {
                method: 'GET',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
            })
        }
        const data = await response.json();
        setData(data.products);
    }

    // Set the display to show overall sales
    function handleOverallView() {
        setDisplay("overall");
        setData();
        getSales('overall');
    }
    // Set the display to show most popular products
    function handlePopularView() {
        setDisplay("popular");
        setData();
        getPopular(1);
    }
    // Set the display to show least popular products
    function handleUnpopularView() {
        setDisplay("unpopular");
        setData();
        getPopular(-1);
    }
    // Set specific category
    function handlePopCategory(event) {
        setPopCategory(event);
    }
    // Set the display to show sales for a specific product
    function handleProductView() {
        setDisplay("product");
        setData();
        getSales('product');
    }
    // Search for a specific product
    function search() {
        setData();
        getSales('product');
    }   
    // Set the display to show sales for a specific category
    function handleCategoryView() {
        setDisplay("category");
    }
    // Set specific category
    function handleCategory(event) {
        // get category stats
        setCategory(event)
    }
    
    // Render statistics display for given display parameter
    function renderDisplay() {
        if (display === 'overall') {
            return(
                <div>
                    <Card id='card' style={{width:1380}}>
                        <CardContent>
                            <TimeRange 
                                start={start} 
                                end={end} 
                                timeSpan={timeSpan}
                                setStart={setStart} 
                                setEnd={setEnd} 
                                setTimeSpan={setTimeSpan}
                                setDays={setDays}
                            />
                            <SalesOverviewLineGraph incoming={data}/>
                        </CardContent>
                    </Card>
                </div>
            )
        }
        if (display === 'popular') {
            return(
                <div>
                    <Card id='card' style={{display:'flex', justifyContent: 'space-evenly', width:1380}}>
                        <CardContent>
                            <div style={{display:'flex', alignItems:'center', justifyContent: 'space-evenly'}}>
                                <Select 
                                    isMulti={false}
                                    options={popCategoryOptions}
                                    value={popCategory}
                                    onChange={handlePopCategory}
                                />
                                <TimeRange 
                                    start={start} 
                                    end={end} 
                                    timeSpan={timeSpan}
                                    setStart={setStart} 
                                    setEnd={setEnd} 
                                    setTimeSpan={setTimeSpan}
                                    setDays={setDays} />
                            </div>
                            <PopularTable data={data} />
                        </CardContent>
                    </Card>
                </div>
            )
        }
        if (display === 'unpopular') {
            return(
                <div>
                    <Card id='card' style={{display:'flex', justifyContent: 'space-evenly', width:1380}}>
                        <CardContent>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-evenly'}}>
                                <Select 
                                    isMulti={false}
                                    options={popCategoryOptions}
                                    value={popCategory}
                                    onChange={handlePopCategory}
                                />
                            <TimeRange 
                                start={start} 
                                end={end} 
                                timeSpan={timeSpan}
                                setStart={setStart} 
                                setEnd={setEnd} 
                                setTimeSpan={setTimeSpan}
                                setDays={setDays} />
                            </div>
                            <UnpopularTable data={data}/>
                        </CardContent>
                    </Card>
                </div>
            )
        }
        if (display === 'product') {
            return (
                <div>
                    <Card id='card' style={{width:1380}}>
                        <CardContent>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-evenly'}}>
                                <SearchBar
                                    value={searchName}
                                    onChange={(newValue) => setSearchName(newValue)}
                                    onRequestSearch={() => search()}
                                    style={{width: "min(180px, 18vw)"}}
                                    placeholder='Search Name'
                                />
                                <div>
                                    <Typography align='center' sx={{width:50}}>
                                        OR
                                    </Typography>
                                </div>
                                <SearchBar
                                    value={searchID}
                                    onChange={(newValue) => setSearchID(newValue)}
                                    onRequestSearch={() => search()}
                                    style={{width: "min(160px, 16vw)"}}
                                    placeholder='Search ID'
                                />
                                <TimeRange 
                                    start={start} 
                                    end={end} 
                                    timeSpan={timeSpan}
                                    setStart={setStart} 
                                    setEnd={setEnd} 
                                    setTimeSpan={setTimeSpan}
                                    setDays={setDays}
                                />
                            </div>
                            <SalesProductGraph incoming={data}/>
                        </CardContent>
                    </Card>
                </div>
            )
        }
        if (display === 'category') {
            return (
                <div>
                    <Card id='card' style={{width:1380}}>
                        <CardContent>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-evenly'}}>
                                <Select 
                                    isMulti={false}
                                    options={CategoryOptions()}
                                    value={category}
                                    onChange={handleCategory}
                                />
                                <TimeRange 
                                    start={start} 
                                    end={end} 
                                    timeSpan={timeSpan}
                                    setStart={setStart} 
                                    setEnd={setEnd} 
                                    setTimeSpan={setTimeSpan}
                                    setDays={setDays} />
                            </div>
                            <SalesCategoryGraph incoming={data}/>
                        </CardContent>
                    </Card>
                </div>
            )
        }
    }

    return(
        <div>
            <AdminHeader />
            <div style={{display:'flex', justifyContent:'space-evenly', paddingTop:50}}>
                <ThemeProvider theme={theme}>
                    <Card id='card' style={{width: 300}}>
                        <CardContent>
                            <h2 id='header2'>Select a Display</h2>
                            <div style={{paddingTop:15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleOverallView}>
                                    Overall Sales
                                </Button>
                            </div>
                            <div style={{paddingTop:15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handlePopularView}>
                                    Most Popular Products
                                </Button>
                            </div>
                            <div style={{paddingTop:15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleUnpopularView}>
                                    Least Popular Products
                                </Button>
                            </div>
                            <div style={{paddingTop:15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleProductView}>
                                    Sales by Product
                                </Button>
                            </div>
                            <div style={{paddingTop:15, paddingBottom:15}}>
                                <Button color="medblue" fullWidth variant="contained" onClick={handleCategoryView}>
                                    Sales by Category
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div>
                        {renderDisplay()}
                    </div>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default ViewSalesStatisticsPage;