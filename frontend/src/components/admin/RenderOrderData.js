import {React} from 'react';
import {Button, TextField} from '@material-ui/core';
import Select from 'react-select';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a table for all the orders that have been placed
 * 
 * @param {order} dictionary 
 * @param {handleSuccess} function 
 * @param {handleFail} function 
 * @returns RenderOrderData
 */
function RenderOrderData(order, {handleSuccess, handleFail}) {

    // Order status options
    var statusOptions = [
        {value: 'pending', label: 'Pending'},
        {value: 'dispatched', label: 'Dispatched'},
        {value: 'delivered', label: 'Delivered'},
        {value: 'cancel', label: 'Cancel'},
    ]
    // Store previous state
    var prevStatus = order.status;

    // Render product names as individual table items
    var product_names = [];
    for (var i = 0; i < order.products.length; i++) {
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

    // Backend call to update order for given order id and order information
    async function updateOrder(event) {
        // Update order if the order is pending
        if (prevStatus === "Pending") {
            const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/orders/edit', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '+ localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    'orderid': order.orderid,
                    'customerid': order.customerid,
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
            // Alert status
            if (response.status === 200) {
                handleSuccess();
            }
            else {
                handleFail();
            }
        }
        // If the order is dispatched
        else if (prevStatus === "Dispatched") {
            // Only action available is to change to delivered
            if (order.status === "Delivered") {
                const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/orders/edit', {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer '+ localStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        'orderid': order.orderid,
                        'customerid': order.customerid,
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
                // Alert status
                if (response.status === 200) {
                    handleSuccess();
                }
                else {
                    handleFail();
                }
            }
        }
        // The order should not be editable
        else {
            handleFail();
        }

    }

    // Handle changing the status of the order
    function handleStatus(event) {
        if (event.label === 'Cancel') {
            order.status = 'Cancelled';
        }
        else {
            order.status = event.label;
        }
    }
    
    // Conditionally render address input to only be editable while the order is pending (before dispatch)
    function renderAddress() {
        if (order.status === 'Pending') {
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
    // Handle changing order address
    function handleAddress(event) {
        order.delivery_address = event.target.value;
    }

    // Return table row of order data
    return (
        <tr key={order.orderid}>
            <td key={"orderid"+order.orderid}>{order.orderid}</td>
            <td key={"date"+order.date}>{order.date}</td>
            <td key={"customerid"+order.customerid}>{order.customerid}</td>
            <td key={"fname"+order.first_name}>{order.first_name}</td>
            <td key={"lname"+order.last_name}>{order.last_name}</td>
            <td key={"email"+order.email}>{order.email}</td>
            <td key={"number"+order.phone_number}>{order.phone_number}</td>
            <td key={"address"+order.delivery_address}>
                {renderAddress()}
            </td>
            <td key={"option"+order.delivery_option}>{order.delivery_option}</td>
            <td key={"items" + order.products.length}>{product_names}</td>
            <td key={"total"+order.total}>{order.total}</td>
            <td key={"status"+order.status}>
                <Select 
                    options={statusOptions}
                    onChange={handleStatus}
                    defaultValue={{value: order.status, label: order.status}}
                />
            </td>
            <td key={"action"+order.orderid}>
                <Button color='secondary' variant='outlined' onClick={() => {updateOrder()}}>
                    Update
                </Button>
            </td>
        </tr>
    )
}

export default RenderOrderData;