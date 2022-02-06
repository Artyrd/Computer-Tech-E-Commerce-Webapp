import {React, useEffect, useState} from "react";
import ThemeColour from "../ThemeColour";
import { ThemeProvider } from "@mui/material/styles";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button, Card, CardContent, Snackbar, Alert, IconButton } from "@mui/material";
import SearchBar from "material-ui-search-bar";
import Alerts from "../../components/Alerts";
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from "react-router-dom";
import RemoveProduct from "../../components/admin/products/RemoveProduct";
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page that displays all products currently in the data base in
 * table displaying data such as UPC, image, name, brand catagory, description
 * gross and sale price, tags, availability. Also provides buttons to either 
 * remove the product or edit its details
 * 
 * @returns AdminViewProductPage
 */
function AdminViewProductPage() {

    // Load page themes
    const theme = ThemeColour();
    // Use page history
    const history = useHistory();

    // Product information states
    const [productList, setProductList] = useState([]);
    const [searchID, setSearchID] = useState("");
    
    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const handleSuccess = () => {
        setSuccess(true);
    };
    const handleFail = () => {
        setFail(true);
    };

    // Get all products to display on page load
    useEffect(() => {getProducts()}, []);
    // Backend call to get all products
    async function getProducts(event) {
        setSearchID("");
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/products', {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        setProductList(data.products);
    }
    // Backend call to get a specific product for given id: searchID
    async function getSearch(event) {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/products/'+searchID, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
        })
        const data = await response.json();
        console.log(data);
        if (response.status !== 200) {
            // If unable to find product with id, open warning
            setOpenSearch(true);
        }
        else {
            setProductList([data]);
        }
    }

    // Render to show availability of product
    function showAvailable(available) {
        if (available === 1 || available === true) {
            return "true";
        }
        else {
            return "false";
        }
    }

    // Render a row of information for a product
    function Row({product}) {
        return (
            <tr key={product.id}>
                <td key={'id'+product.id}> 
                    {product.id}
                </td>
                <td key={'img'+product.id}> 
                    <img src={product.imgurl} alt={"Image: "+product.id} style={{width:'150px', height:'150px'}}/>
                </td>
                <td key={'name'+product.id}>
                    {product.name}
                </td>
                <td key={'brand'+product.id}>
                    {product.brand}
                </td>
                <td key={'category'+product.id}>
                    {product.category}
                </td>
                <td key={'description'+product.id}>
                    {product.description}
                </td>
                <td key={'gprice'+product.id}>
                    {product.gross_price}
                </td>
                <td key={'nprice'+product.id}>
                    {product.net_price}
                </td>
                <td key={'tags'+product.id}>
                    {product.tags.map((tag) => `${tag} `)}
                </td>
                <td key={'avail'+product.id}>
                    {showAvailable(product.available)}
                </td>
                <td key={'action'+product.id}>
                    <Button 
                        color='medblue' variant='outlined' 
                        onClick={()=>{
                            localStorage.setItem('productid', product.id);
                            history.push('edit')}}>
                        Edit Product
                    </Button>
                    <div style={{paddingTop: 15}}>
                        <RemoveProduct 
                            productid={product.id}
                            handleSuccess={handleSuccess}
                            handleFail={handleFail}
                            />
                    </div>
                </td>
            </tr>
        )
    }
    // Map product data to rows
    function TableRows({data}) {
        return (
            <>
                {data && data.length && data.map(product => <Row product={product} />)}
            </>
        );
    }

    return(
        <div>
            <AdminHeader />
            <ThemeProvider theme={theme}>
                <div style={{paddingTop: 50, paddingLeft: 50}}>
                    <Card id='card' style={{width:535, height:150}}>
                        <CardContent>
                            <SearchBar
                                value={searchID}
                                onChange={(newValue) => setSearchID(newValue)}
                                onRequestSearch={() => getSearch()}
                                style={{width: "min(500px, 50vw)"}}
                                placeholder='Search Product UPC'
                            />
                            <div style={{paddingTop: 25, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Button color='medblue' variant='contained' onClick={() =>{getProducts()}}>
                                    Show All
                                </Button>
                                <Button color='yellow' variant='contained' onClick={() =>{history.push('/admin/products/add')}}>
                                    Add New Product
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                    <div style={{paddingRight:50, paddingLeft: 50, paddingTop: 15}}>
                        <table id = "table">
                            <thead style={{backgroundColor:'#D1DEEC'}}>
                                <tr>
                                    <th>Product UPC</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Gross Price</th>
                                    <th>Sale Price</th>
                                    <th>Tags</th>
                                    <th>Available</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRows data={productList} />
                            </tbody>
                        </table>
                    </div>
            </ThemeProvider>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={"Successfully removed product!"}
                textFail={"Could not remove product"}
            />
            <Snackbar open={openSearch} anchorOrigin={{vertical: 'top', horizontal:'center'}} autoHideDuration={6000} onClose={() => setOpenSearch(false)}>
                <Alert action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpenSearch(false);
                        }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    variant="filled" severity="error" sx={{ width: '100%' }}>
                    Could not find Product ID {searchID}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AdminViewProductPage;