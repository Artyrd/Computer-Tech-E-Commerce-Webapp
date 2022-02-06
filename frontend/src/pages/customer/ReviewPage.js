import {React, useEffect, useState} from 'react';
import {Card, CardContent, Button, TextField} from '@mui/material';
import { Rating } from '@mui/material';
import Alerts from '../../components/Alerts';
import Header from '../Header';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import Navigation from '../../components/customer/Navigation';
import { BACKEND_PORT } from '../../config.json';
import Footer from '../Footer';

function ReviewPage() {
    // Load page theme
    const theme = ThemeColour();

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [successText, setSuccessText] = useState("");
    const [failText, setFailText] = useState("");  

    // Get the products from the order found in local storage
    const order = JSON.parse(localStorage.getItem('order'));
    const unique = [...new Set(order.products.map(item => item.productid))];
    let tempProductList = []
    for (let item of unique) {
        for (let product of order.products) {
            if (item === product.productid) {
                tempProductList.push(product);
                break;
            }
        }
    }
    order.products = tempProductList;

    // Review data states
    const orderid = order.orderid;
    const [review, setReview] = useState([{
        productid: "",
        review: "",
        rating: 0,
    },]);

    // Previous data states
    const [prevData, setPrev] = useState();
    // Backend call to get previous order data (if any)
    async function getPrevReview() {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/orders/'+orderid+'/reviews', {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        setPrev(data.reviews);
        // Load any review data and match to corresponding products in the order
        let review_list = [];
        if (data.reviews.length !== 0) {
            for (let product of order.products) {
                for (let prev of data.reviews) {
                    if (prev.productid === product.productid) {
                        review_list.push({
                            'productid': product.productid,
                            'review': prev.review,
                            'rating': prev.rating,
                        });
                    }
                    }
                }
            setReview(review_list);
        }
        // Else, no previous review data
        else {
            for (let product of order.products) {
                review_list.push({
                    'productid': product.productid,
                    'review': "",
                    'rating': 0,
                });
            }
            setReview(review_list);
        }
    }
    // Get previous review data on page load
    useEffect(() => {getPrevReview()}, [])

    // Function to get the index of a value in an array arr with key prop
    function getIndex(value, arr, prop) {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i][prop] === value) {
                return i;
            }
        }
        return -1; //to handle the case where the value doesn't exist
    }

    // Render a review row for a given product to show its image and name, 
    // text review and star rating
    function Row({product}) {
        let index = getIndex(product.productid, review, 'productid');
        // If a previous review exists
        if (review[index] !== undefined) {
            return (
                <tr key={product.productid}>
                    <td key={'img'+product.productid}>
                        <img src={product.imgurl} alt={"Image: "+product.productid} style={{width:'150px', height:'150px'}}/>
                        <p>{product.name}</p>
                    </td>
                    <td key={'review'+product.productid}>
                        <TextField 
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            multiline
                            id={"id"+product.productid}
                            label="Write Review"
                            name={product.productid}
                            type="text"
                            onBlur={(e) => changeReview(e)}
                            defaultValue={review[index].review}
                        />
                    </td>
                    <td key={'rating'+product.productid}>
                        <Rating
                            name={product.productid}
                            defaultValue={review[index].rating}
                            onChange={(event, newValue) => changeRating(newValue, product.productid)}
                        />
                    </td>
                </tr>
            )
        }
        // else no previous review
        else {
            return (
                <tr key={product.productid}>
                    <td key={'img'+product.productid}>
                        <img src={product.imgurl} alt={"Image: "+product.productid} style={{width:'150px', height:'150px'}}/>
                        <p>{product.name}</p>
                    </td>
                    <td key={'review'+product.productid}>
                        <TextField 
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            multiline
                            id={"id"+product.productid}
                            label="Write Review"
                            name={product.productid}
                            type="text"
                            onBlur={(e) => changeReview(e)}
                        />
                    </td>
                    <td key={'rating'+product.productid}>
                        <Rating
                            name={product.productid}
                            onChange={(event, newValue) => changeRating(newValue, product.productid)}
                        />
                    </td>
                </tr>
            )
        }
    }
    // Map reviews for products from an order to rows
    function TableRows({data}) {
        return (
            <>
                {data && data.length && data.map(product => <Row product={product} />)}
            </>
        );
    }

    // Handle changing text review
    function changeReview(event) {
        let tempReviewList = review;
        console.log(tempReviewList);
        for (let product of tempReviewList) {
            if (product.productid === event.target.name) {
                product.review = event.target.value;
            }
        }
        setReview(tempReviewList);
    }
    // Handle changing star rating
    function changeRating(nextValue, name) {
        let tempReviewList = review;
        console.log(tempReviewList);
        for (let product of tempReviewList) {
            if (product.productid === name) {
                product.rating = nextValue;
            }
        }
        setReview(tempReviewList);
    }

    // Transform the date of review to string for display
    function renderDate() {
        // If there was a previous review date
        if (prevData !== undefined && prevData.length !== 0) {
            return prevData[0].date;
        }
        // If the review is new today
        else {
            let today = new Date();
            let numDate = today.getDate().toString();
            if (numDate.length === 1) {
                numDate = '0' + numDate;
            }
            let numMonth = today.getMonth().toString();
            numMonth = (parseInt(numMonth) + 1).toString();
            if (numMonth.length === 1) {
                numMonth = '0' + numMonth;
            }
            return(today.getFullYear() + '-' + numMonth + '-' + numDate);
        }
    }

    // Backend call to submit all reviews for the order
    async function submitReview() {
        let submission = {'products': review}
        console.log(submission);
        console.log(review);
        let response = {};
        // If there was no previous review, add a new review
        if (prevData !== undefined && prevData.length === 0) {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/orders/'+orderid+'/reviews/add', {
                method: 'POST',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    reviews: review,
                })
            })
            if (response.status === 200) {
                setSuccess(true);
                setSuccessText("Successfully added review!")
            }
            else {
                setFail(false);
                setFailText("Could not add review")
            }
        }
        // else if there was a previous review, update the review
        else if (prevData !== undefined && prevData.length !== 0) {
            response = await fetch('http://localhost:' + BACKEND_PORT + '/orders/'+orderid+'/reviews/edit', {
                method: 'PUT',
                headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    reviews: review,
                })
            })
            if (response.status === 200) {
                setSuccess(true);
                setSuccessText("Successfully editted review!")
            }
            else {
                setFail(false);
                setFailText("Could not edit review")
            }
        }
    }

    return(
        <div>
            <Header />
            <div style={{display: 'flex', justifyContent: 'space-around', paddingLeft: 100, paddingRight: 100, paddingTop:50, paddingBottom: 50}}>
                <ThemeProvider theme={theme} >
                    <Card sx={{width: 300, height: 350}}>
                        <CardContent>
                            <Navigation />
                        </CardContent>
                    </Card>
                    <div>
                        <h3>Order Number {orderid}, Date Reviewed {renderDate()}</h3>
                        <table id="table">
                            <thead style={{backgroundColor:'#D1DEEC'}}>
                                <tr>
                                    <th>Image</th>
                                    <th>Review</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRows data={order.products} />
                            </tbody>
                        </table>
                        <Button color='yellow' variant='contained' onClick={submitReview}>
                            Submit Review
                        </Button>
                    </div>
                </ThemeProvider>
            </div>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={successText}
                textFail={failText}
            />
            <Footer />
        </div>
    );
}

export default ReviewPage;