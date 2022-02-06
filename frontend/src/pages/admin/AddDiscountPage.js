import {React, useState, useEffect} from 'react';
import {Button, Card, CardContent, FormControlLabel, TextField, RadioGroup, Radio} from '@mui/material';
import './AdminPages.css';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import Alerts from '../../components/Alerts';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page for the admin to add a new discount to an existing product
 * 
 * @returns AddDiscountPage
 */
function AddDiscountPage() {

    // Load page theme
    const theme = ThemeColour();
    // Alert box handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };

    // Transform todays date to string format
    var today = new Date();
    var numDate = today.getDate().toString();
    if (numDate.length === 1) {
        numDate = '0' + numDate;
    }
    var numMonth = today.getMonth().toString();
    numMonth = (parseInt(numMonth) + 1).toString();
    if (numMonth.length === 1) {
        numMonth = '0' + numMonth;
    }
    var dateToday = today.getFullYear() + '-' + numMonth + '-' + numDate;
    
    // Discount data states
    const [currPrice, setCurr] = useState("");
    const [discountPreset, setPreset] = useState("");
    const [discount, setDiscount] = useState(0.0);
    const [input, setInput] = useState({
        productid: "",
        start: dateToday,
        end: dateToday,
    })

    // Backend call to create a new discount for productid at discount price
    // starting date at start and ending date at end
    async function handleSubmit(event) {
      event.preventDefault()
      const response = await fetch('http://localhost:'+ BACKEND_PORT + '/admin/discounts/add', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer '+ localStorage.getItem('token'),
        },
        body: JSON.stringify({
            productid: input.productid,
            net_price: discount,
            start: input.start,
            end: input.end,
        })
      })
      // Alert
      if (response.status === 200) {
          handleSuccess();
      }
      else {
          handleFail();
      }
    }

    // Backend call to get product information for productid
    async function getProduct() {
        const response = await fetch('http://localhost:'+ BACKEND_PORT + '/products/' + input.productid, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json'
            },
        })

        const data = await response.json();
        console.log(data);
        setCurr(data.gross_price);
        setDiscount(data.gross_price);
    }

    // Change inputs for id, start date and end date
    const handleChange = name => event => {
        setInput({...input, [name]: event.target.value})
        if (name === 'start') {
            console.log(event.target.value);
        }
    }
    // Get product for changes in productid input
    useEffect(() => {getProduct()}, [input.productid]);

    // Handle preset discount levels to set the new amount to include the discounted amount
    function handleRadio(event) {
        if (event.target.value === discountPreset) {
            setPreset("");
        }
        else {
            if (event.target.value === '90%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.10) * 100) / 100).toString());
                setPreset("90%");
            }
            else if (event.target.value === '80%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.20) * 100) / 100).toString());
                setPreset("80%");
            }
            else if (event.target.value === '75%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.25) * 100) / 100).toString());
                setPreset("75%");
            }
            else if (event.target.value === '70%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.30) * 100) / 100).toString());
                setPreset("70%");
            }
            else if (event.target.value === '60%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.40) * 100) / 100).toString());
                setPreset("60%");
            }
            else if (event.target.value === '50%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.50) * 100) / 100).toString());
                setPreset("50%");
            }
            else if (event.target.value === '40%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.60) * 100) / 100).toString());
                setPreset("40%");
            }
            else if (event.target.value === '30%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.70) * 100) / 100).toString());
                setPreset("30%");
            }
            else if (event.target.value === '25%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.75) * 100) / 100).toString());
                setPreset("25%");
            }
            else if (event.target.value === '20%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.80) * 100) / 100).toString());
                setPreset("20%");
            }
            else if (event.target.value === '10%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.90) * 100) / 100).toString());
                setPreset("10%");
            }
            else if (event.target.value === '5%') {
                setDiscount((Math.round((parseFloat(currPrice) * 0.95) * 100) / 100).toString());
                setPreset("5%");
            }
        }
    }

    return(
        <div>
            <AdminHeader />
            <ThemeProvider theme={theme}>
                <div style={{display:'flex', justifyContent:'center', paddingTop:50}}>
                    <Card id="card" style={{width:500}}>
                        <CardContent>
                            <h1 id='header2'>Add a New Discount</h1>
                            <form onSubmit = {handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="id"
                                    label="Product UPC Identifier"
                                    name="id"
                                    type="text"
                                    onBlur={handleChange('productid')}
                                    autoFocus
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <h3 id='header2'> Current Retail Price: {currPrice}</h3>
                                <RadioGroup row value={discountPreset}>
                                    <FormControlLabel value ='90%' control={<Radio onClick={handleRadio} />} label='90%' />
                                    <FormControlLabel value ='80%' control={<Radio onClick={handleRadio} />} label='80%' />
                                    <FormControlLabel value ='75%' control={<Radio onClick={handleRadio} />} label='75%' />
                                    <FormControlLabel value ='70%' control={<Radio onClick={handleRadio} />} label='70%' />
                                    <FormControlLabel value ='60%' control={<Radio onClick={handleRadio} />} label='60%' />
                                    <FormControlLabel value ='50%' control={<Radio onClick={handleRadio} />} label='50%' />
                                    <FormControlLabel value ='40%' control={<Radio onClick={handleRadio} />} label='40%' />
                                    <FormControlLabel value ='30%' control={<Radio onClick={handleRadio} />} label='30%' />
                                    <FormControlLabel value ='25%' control={<Radio onClick={handleRadio} />} label='25%' />
                                    <FormControlLabel value ='20%' control={<Radio onClick={handleRadio} />} label='20%' />
                                    <FormControlLabel value ='10%' control={<Radio onClick={handleRadio} />} label='10%' />
                                    <FormControlLabel value ='5%' control={<Radio onClick={handleRadio} />} label='5%' />
                                </RadioGroup>
                                <h3 id="header2" style={{height: 2}}>New Discounted Price</h3>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="price"
                                    name="price"
                                    type="text"
                                    onChange={(e) => {setDiscount(e.target.value)}}
                                    value={discount}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <h3 id='header2' style={{height: 2}}>Discount Start Date</h3>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="start"
                                    name="start"
                                    type="date"
                                    defaultValue={dateToday}
                                    onChange={handleChange('start')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <h3 id='header2' style={{height: 2}}>Discount End Date</h3>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="end"
                                    name="end"
                                    type="date"
                                    defaultValue={dateToday}
                                    onChange={handleChange('end')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <Button  onClick={handleSubmit} type="submit" color="yellow" fullWidth variant="contained">
                                    Add new discount
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </ThemeProvider>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully added discount for Product " + input.productid + "!"}
                textFail={"Could not add discount for Product "+ input.productid}
            />
        </div>
    );
}

export default AddDiscountPage;