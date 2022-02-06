import {React, useEffect, useState} from 'react';
import { BACKEND_PORT } from '../../config.json';

/**
 * Shows the 3 most recent order the customer made in the customer dashboard
 * 
 * @returns RecentOrder
 */
function RecentOrder() {
    
    // Order data state
    const [order, setOrder] = useState([]);

    // Backend call to get all orders for a customer
    async function getOrders(event) {
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
            setOrder(data.orders);
            console.log(data.orders);
        } else {
            const data = await response.json();
            console.log(data.error);
        }
    }
    // Get order history on page load
    useEffect(() => {getOrders()}, []);

    // Get the top 3 most recent orders
    function renderRecent() {
        let recent = [];
        let len = 3;
        // If the customer has made less than 3 orders
        if (order.length < 3) {
            len = order.length
        }
        // Render the top 3 orders as table rows
        for (let i = 1; i <= len; i++) {
            recent.push(
                <tr key={'order'+order[order.length - i].orderid}>
                    <td key={'id'+order[order.length - i].orderid}>{order[order.length - i].orderid}</td>
                    <td key={'date'+order[order.length - i].orderid}>{order[order.length - i].date}</td>
                    <td key={'name'+order[order.length - i].orderid}>{order[order.length - i].first_name} {order[order.length - i].last_name}</td>
                    <td key={'total'+order[order.length - i].orderid}>{order[order.length - i].total}</td>
                    <td key={'status'+order[order.length - i].orderid}>{order[order.length - i].status}</td>
                </tr>
            )
        }
        return recent;
    }

    // Return a table with the most recent order
    return(
        <div>
            <table id="table" style={{backgroundColor:'#fff'}}>
                <thead>
                    <tr style={{backgroundColor:'#D1DEEC'}}>
                        <th>Order #</th>
                        <th>Order Date</th>
                        <th>Ship To</th>
                        <th>Order Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRecent()}
                </tbody>
            </table>
        </div>
    )
}

export default RecentOrder;