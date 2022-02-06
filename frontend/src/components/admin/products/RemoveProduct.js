import React from "react";
import {Button} from '@mui/material';
import { BACKEND_PORT } from '../../../config.json'

/**
 * Adds a button called "REMOVE PRODUCT" which removes a product from the 
 * database
 * 
 * @param {productid} int 
 * @param {handleSuccess} function 
 * @param {handleFail} function 
 * @returns 
 */
function RemoveProduct({productid, handleSuccess, handleFail}) {

    // Backend call to remove a product for given productid from database
    async function handleRemove() {
        const response = await fetch('http://localhost:'+ BACKEND_PORT +'/admin/products/delete', {
            method: 'DELETE',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
            id: productid,
            })
        })
        console.log(response.json());
        // Alert status
        if (response.status === 200) {
            handleSuccess();
        }
        else {
            handleFail();
        }
    }

    return(
        <Button color='warning' variant='outlined' onClick={handleRemove}>
            Remove product
        </Button>
    )
}

export default RemoveProduct;