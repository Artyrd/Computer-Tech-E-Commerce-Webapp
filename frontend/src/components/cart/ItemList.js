import { React } from 'react';
import { Button, TextField , Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { maxWidth } from '@material-ui/system';

/**
 * Creates a table from the list of product items provided, displaying the 
 * product name, image, price, quantity. It also include a textbook for a
 * URL string and a button to delete the item.
 * 
 * @param {products} list[dictionaries]
 * @param {handleDelete} function 
 * @returns ItemList
 */
const ItemList = ({ products, handleDelete }) => {

    return (
        <div id='item-list' style={{marginBottom:"30px", maxWidth: `min(1000px, 90vw)`}}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell width={250}>Name</TableCell>
                        <TableCell width={200} align="left">Image</TableCell>
                        <TableCell width={100} align="left">Price</TableCell>
                        <TableCell width={100} align="left">Quantity</TableCell>
                        <TableCell width={400} align="left"> </TableCell>
                        <TableCell width={5} align="left"> </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                {products.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell align="left"><img src={row.imgurl} style={{width:'100px', height:'100px'}}/></TableCell>
                        <TableCell align="left">${row.price.toFixed(2)}</TableCell>
                        <TableCell align="left">{row.quantity}</TableCell>
                        <TableCell align="left">
                            <TextField  
                                id={row.name + "webURL"} 
                                name="priceMatch" 
                                varient="outlined"
                                size="small"
                                placeholder="Price match URL"
                                
                            />
                        </TableCell>
                        <TableCell align="right">
                            <Button color="warning" variant='contained' onClick={() => { handleDelete(row.name) }}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ItemList