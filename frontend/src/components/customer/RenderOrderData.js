import {React} from 'react';
import {Button, TextField} from '@material-ui/core';
import Select from 'react-select';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a table of all orders of the user where each columns are the order 
 * details (order #, order date, customer id, first name, last name, email, 
 * phone number, delivery address, delivery option, order details, order total
 * status action)
 * 
 * @param {order} order 
 * @param {handleSuccess} function 
 * @param {handleFail} function 
 * @returns RenderOrderData
 */
function RenderOrderData(order, {handleSuccess, handleFail}) {

    // Get previous order status
    let prevStatus = order.status;

    // Get the names of all products in the order as a table
    let product_names = [];
    for (let i = 0; i < order.products.length; i++) {
        product_names.push(<table key={"productid"+order.products[i].productid}>
            <tbody>
                <tr>
                    <td>
                        {order.products[i].name}
                    </td>
                </tr>
            </tbody>
        </table>
        )
    }

    // Handle changing name on the order
    function handleFirstName(event) {
        order.first_name = event.target.value;
    }
    function handleLastName(event) {
        order.last_name = event.target.value;
    }

    // Conditionally render name to be editable only if the order status is pending
    function renderFirstName() {
        if (order.status === 'pending' || order.status === 'Pending') {
            return(
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    id={order.orderid +"fname"}
                    name="first_name"
                    type="text"
                    onBlur={handleFirstName}
                    defaultValue={order.first_name}
                />

            )
        }
        else {
            return(order.first_name);
        }
    }
    function renderLastName() {
        if (order.status === 'pending' || order.status === 'Pending') {
            return(
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    id={order.orderid +"lname"}
                    name="last_name"
                    type="text"
                    onBlur={handleLastName}
                    defaultValue={order.last_name}
                />

            )
        }
        else {
            return(order.last_name);
        }
    }

    // Handle changing order address
    function handleAddress(event) {
        order.delivery_address = event.target.value;
    }
    // Conditionally render address to be editable only if the order status is pending
    function renderAddress() {
        if (order.status === 'pending' || order.status === 'Pending') {
            return(
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    multiline
                    id={order.orderid +"address"}
                    name="address"
                    type="text"
                    onBlur={handleAddress}
                    defaultValue={order.delivery_address}
                />
            );
        }
        else {
            return(order.delivery_address);
        }
    }

    // Handle changing the order status 
    function handleStatus(event) {
        // If user cancels order, display cancelled
        if (event.label === 'Cancel') {
            order.status = 'Cancelled';
        }
        else {
            order.status = event.label;
        }
    }
    // Conditionally render status to only allow changing status if the order is pending
    function renderStatus() {
        if (order.status === 'Pending') {
            return(
                <Select 
                    options={[{value:'pending', label:'Pending'}, {value:'cancel', label:'Cancel'}]}
                    onChange={handleStatus}
                    defaultValue={{value: order.status, label: order.status}}
                />
            );
        }
        else {
            return (
                order.status
            );
        }
    }

    // Allow the user to leave a review if the order is delivered
    function renderReviewButton() {
        if (order.status === 'Delivered') {
            return(
                <Button color='primary' variant='outlined' href={'/profile/add_review/'} onClick={() => {localStorage.setItem("order", JSON.stringify(order))}}>
                    Leave/Edit a Review
                </Button>
            )
        }
    }
    // Allow the user to edit the order if the order is pending
    function renderUpdateButton() {
        if (order.status === 'Pending') {
            return(
                <Button color='secondary' variant='outlined' onClick={updateOrder}>
                    Update Order
                </Button>
            )
        }
    }

    // Backend call to update the order for a given orderid and new information
    async function updateOrder() {
        // alert if order is not pending
        if (prevStatus !== "Pending") {
            handleFail();
            return;
        }
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/orders/edit/'+order.orderid, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                'orderid': order.orderid, // remove 
                'customerid': order.customerid, // remove 
                'first_name': order.first_name,
                'last_name': order.last_name,
                'email': order.email,
                'phone_number': order.phone_number,
                'delivery_address': order.delivery_address,
                'delivery_option': order.delivery_option,
                'date': order.date,
                'status': order.status,
            })
        })
        // Status response
        if (response.status === 200) {
            handleSuccess();
        }
        else {
            handleFail();
        }
    }

    return (
        <tr key={order.orderid}>
            <td key={"orderid"+order.orderid}>{order.orderid}</td>
            <td key={"date"+order.date}>{order.date}</td>
            <td key={"customerid"+order.customerid}>{order.customerid}</td>
            <td key={"fname"+order.first_name}>{renderFirstName()}</td>
            <td key={"lname"+order.last_name}>{renderLastName()}</td>
            <td key={"email"+order.email}>{order.email}</td>
            <td key={"number"+order.phone_number}>{order.phone_number}</td>
            <td key={"address"+order.delivery_address}>{renderAddress()}</td>
            <td key={"option"+order.delivery_option}>{order.delivery_option}</td>
            <td key={"items" + order.products.length}>{product_names}</td>
            <td key={"total"+order.total}>{order.total}</td>
            <td key={"status"+order.status}>{renderStatus()}</td>
            <td key={"action"+order.orderid}>
                {renderReviewButton()}
                {renderUpdateButton()}
            </td>
        </tr>
    )
}

export default RenderOrderData;