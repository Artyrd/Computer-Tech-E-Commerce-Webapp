import React from 'react';
import {Button, TextField} from '@material-ui/core';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a table for all discounts, default view are all options but has 
 * option to show 'active' discounts
 * 
 * @param {discount} dictionary
 * @param {handleSuccess} function 
 * @param {handleFail} function 
 * @returns RenderDiscountData
 */
/**
 * Creates a table for all the orders that have been placed
 * 
 * @param {order}  

 * @returns 
 */
function RenderDiscountData(discount, {handleSuccess, handleFail}) {

    // Calculate current discount status using time difference between today
    // and start and end dates
    var today = new Date();
    var milli_start = today.getTime() - new Date(discount.start_date).getTime();
    var milli_end = today.getTime() - new Date(discount.end_date).getTime();
    var status = ""
    // If today is between start and end, "Active"
    if (milli_end < 0 && milli_start > 0) {
        status = "Active";
    }
    // If today is after end, "Expired"
    else if (milli_end > 0 && milli_start > 0) {
        status = "Expired";
    }
    // If today is before start, "Pending"
    else if (milli_end < 0 && milli_start < 0) {
        status = "Pending";
    }

    // Backend call to edit discount for given id and details
    async function editDiscount() {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/discounts/edit', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                discountid: discount.id,
                productid: discount.productid,
                net_price: discount.net_price,
                start: discount.start_date,
                end: discount.end_date,
            })
        })
        // Alert status
        if (response.status === 200) {
            handleSuccess();
        }
        else {
            handleFail();
        }
    }

    // Conditionally render net price input only if the discount has not started yet
    function renderNet() {
        if (status === "Pending") {
            return(
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id={discount.id +"net"}
                    name="netprice"
                    type="text"
                    onBlur={handleNetPrice}
                    defaultValue={discount.net_price}
                />
            );
        }
        else {
            return(discount.net_price);
        }
    }
    // Handle input changes in the net price
    function handleNetPrice(event) {
        discount.net_price = event.target.value;
    }
    // Conditionally render start date input only if the discount has not started yet
    function renderStart() {
        if (status === "Pending") {
            return(
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id={discount.id +"start"}
                    name="start"
                    type="date"
                    onBlur={handleStart}
                    defaultValue={discount.start_date}
                />
            );
        }
        else {
            return(discount.start_date);
        }
    }
    // Handle input changes in discount start date
    function handleStart(event) {
        discount.start_date = event.target.value;
    }
    // Conditionally render end date input only if the discount has not started yet
    function renderEnd() {
        if (status === "Pending") {
            return(
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id={discount.id +"end"}
                    name="end"
                    type="date"
                    onBlur={handleEnd}
                    defaultValue={discount.end_date}
                />
            );
        }
        else {
            return(discount.end_date);
        }
    }
    // Handle input changes in discount end date
    function handleEnd(event) {
        discount.end_date = event.target.value;
    }
    // Conditionally render edit submit button only if the discount has not started yet
    function renderActions() {
        if (status === "Pending") {
            return(
                <Button color='primary' variant='outlined' onClick={editDiscount}>
                    Edit
                </Button>
            )
        }
    }

    // Return row of discount data
    return(
        <tr key={discount.id}>
            <td key={"discid"+discount.id}>{discount.id}</td>
            <td key={"img"+discount.id}>
                <img src={discount.imgurl} alt={"Image: " +discount.productid} style={{width:'150px', height:'150px'}}/>
            </td>
            <td key={"prodid"+discount.id}>{discount.productid}</td>
            <td key={"prodnam"+discount.id}>{discount.name}</td>
            <td key={"gprice"+discount.id}>{discount.gross_price}</td>
            <td key={"nprice"+discount.id}>{renderNet()}</td>
            <td key={"start"+discount.id}>{renderStart()}</td>
            <td key={"end"+discount.id}>{renderEnd()}</td>
            <td key={"status"+discount.id}>{status}</td>
            <td key={"actions"+discount.id}>
                {renderActions()}
            </td>
        </tr>
    )
}

export default RenderDiscountData;