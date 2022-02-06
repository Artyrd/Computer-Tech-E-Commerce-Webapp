import React from 'react';
import '../../../pages/admin/AdminPages.css';

/**
 * Display product information in row format
 * 
 * @param {product} dictionary 
 * @returns Row
 */
function Row({product}) {
    return (
        <tr key={product.id}>
            <td key={'img'+product.id}>
                <img src={product.img} alt={"Image: "+product.id} style={{width:'150px', height:'150px'}}/>
            </td>
            <td key={'id'+product.id}>{product.id}</td>
            <td key={'name'+product.id}>{product.name}</td>
            <td key={'sale'+product.id}>{product.totalsales}</td>
            <td key={'desc'+product.id}>{product.description}</td>
        </tr>
    );
}

// Map product data in rows
function TableRows({data}) {
    return (
        <>
            {data && data.length && data.map(product => <Row product={product} />)}
        </>
    );
}

// Render a table showing the least popular items
function UnpopularTable({data}) {
    return (
        <div>
            <table id='table'>
                <thead style={{backgroundColor:'#D1DEEC'}}>
                    <tr>
                        <th>Image</th>
                        <th>UPC Identifier</th>
                        <th>Display Name</th>
                        <th>Sales</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody style={{backgroundColor:'#fff'}}>
                    <TableRows data={data} />
                </tbody>
            </table>
        </div>
    );
}

export default UnpopularTable;