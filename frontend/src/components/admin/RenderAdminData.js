import {React, useEffect, useState} from 'react';
import {Button, TextField} from '@material-ui/core';
import Select from 'react-select';
import { BACKEND_PORT } from '../../config.json';

/**
 * Render data to display users for managing administrators
 * 
 * @param {admin} dictionary 
 * @param {handleSuccess} function 
 * @param {handleFail} function 
 * @returns RenderAdminData
 */
function RenderAdminData({admin, handleSuccess, handleFail}) {

    // Administration data states
    const [status, setStatus] = useState("");
    useEffect(() => {
        if (admin.permissions === 'user') {
            setStatus("Not Admin");
        }
        else if (admin.permissions === 'admin') {
            setStatus("Active");
        }
        else {
            setStatus("Terminate");
        }
    }, []);
    
    // Termination date states
    const [termDate, setTermDate] = useState(admin.termination_date);
    function handleTermination(event) {
        setTermDate(event.target.value);
    }
    // Render termination input conditionally on being an admin
    function renderTermination() {
        if (admin.permissions === 'user' && status === 'Not Admin') {
            return(
                ""
            );
        }
        if (admin.permissions === 'user' && status === 'Active') {
            return(
                <TextField
                id={"termination"+admin.id}
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={handleTermination}
                />
            );
        }
        else {
            return(
                <TextField
                id={"termination"+admin.id}
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
                value={termDate}
                onChange={handleTermination}
                />
            );
        }
    }
    
    // Show editable user status for below options
    function renderStatus() {
        return (
            <Select 
                options={statusOptions}
                value={{value: status, label: status}}
                onChange={handleStatus}
            />
        );
    }
    const statusOptions = [
        {value: 'notAdmin', label: 'Not Admin'},
        {value: 'active', label: 'Active'},
        {value: 'terminate', label: 'Terminate'},
    ]
    // Handle changes in user account status      
    function handleStatus(event) {
        if (admin.permissions === 'user' && event.label === 'Active') {
            setStatus("Active");
        }
        else if (admin.permissions === 'admin' && event.label === 'Not Admin') {
            setStatus("Not Admin");
        }
        else if (event.label === 'Terminate') {
            setStatus("Terminate");
        }
        else {
            setStatus(event.label);
        }
    }

    // Backend call to update the given admin for a new status 
    async function updateAdmin(event) {
        if (admin.status !== 'Active') {
            admin.permissions = 'user';
        }
        else {
            admin.permissions = 'admin';
        }
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/update', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                customer_id: admin.customer_id,
                termination_date: termDate,
                status: status,
            })
        })
        const data = await response.json();
        // Alert status
        if (response.status === 200) {
            handleSuccess();
        }
        else {
            handleFail();
        }
    }
    
    // Return a table displaying admin data
    return (
        <tr key={admin.id}>
            <td key={"adminid"+admin.id}>{admin.customer_id}</td>
            <td key={"fname"+admin.id}>{admin.first_name}</td>
            <td key={"lname"+admin.id}>{admin.last_name}</td>
            <td key={"email"+admin.id}>{admin.email}</td>
            <td key={"number"+admin.id}>{admin.phone}</td>
            <td key={"r_date"+admin.id}>{admin.registration_date}</td>
            <td key={"t_date"+admin.id}>{renderTermination()}</td>
            <td key={"position"+admin.id}>{admin.permissions}</td>
            <td key={"status"+admin.id}>{renderStatus()}</td>
            <td key={"action"+admin.id}>
                <Button color='secondary' variant='outlined' onClick={updateAdmin}>
                    Update Admin
                </Button>
            </td>
        </tr>
    )
}

export default RenderAdminData;