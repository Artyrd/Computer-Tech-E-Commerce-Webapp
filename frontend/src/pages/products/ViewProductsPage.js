import {React, useState, useEffect} from 'react';
import '../../App.css';
import {Button, Drawer, Select, MenuItem, FormControl, InputLabel, Box, Checkbox } from '@material-ui/core';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Link} from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid'
import { productBrands } from './helper';
import Header from '../Header'
import { ProductsRender } from '../../components/products/BuyingComponents'
import Footer from '../Footer';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates page that shows all products current in the database to the user, 
 * also provides options to change the view setting and ways to sort the 
 * catalogue
 * 
 * @returns ViewProductsPage
 */
function ViewProductsPage() {

  useEffect(() => {
    getProducts()
  },[])

  /**
   * used to set up the datagrid
   */
  const columns = [
    { field: 'id', 
      headerName: 'ID', 
      width: 200,
      renderCell: (params) => {
        return(
          <Link to={"/products/" + params.value}>{params.value}</Link>
        )
      }
    },
    { 
      field: 'pic',
      headerName: 'Picture',
      width: 150,
      renderCell: (params) => {
        return (
          <img src={params.value} style={{width: '45px', height: '45px'}}/>
        )
      }
    },
    { field: 'name', 
      headerName: 'Name', 
      width: 400,
    },
    {
      field: 'brand', 
      headerName: 'Brand', 
      width: 150,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
    },
    {
      field: 'description',
      headerName: 'Description',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1
    },
  ]

  const [rows, updateRows] = useState([])
  // This variable will not be changed unlike rows
  const [allproducts, setAllProducts] = useState([])

  /**
   * gets all the products in the database
   */
  async function getProducts() {
    let stuff = []
    await fetch('http://localhost:'+ BACKEND_PORT +'/products', {
      method: 'GET',
    }).then(res => res.text())
      .then(data => {
        let products = JSON.parse(data)
        
        products.products.forEach(BuildDetails);
        
        function BuildDetails(value) {

          let row = {
            id: value.id,
            brand: value.brand,
            name: value.name,
            pic: value.imgurl,
            price: value.net_price,
            description: value.description
          }

          stuff.push(row)
        }
        console.log(stuff)
        updateRows(stuff)
        setAllProducts(stuff)
      })
    }

    const [drawerState, setDrawerState] = useState(false);

    const handleDrawer = (open) => (event) => {
      setDrawerState(open)
    }

    /**
     * Get the most popular items from the database
     */
    async function getPopular() {
      await fetch('http://localhost:'+ BACKEND_PORT +'/api/sales/popular?start=2021-10-13&end=2022-11-31', {
        method: 'GET',
      }).then(res => res.text())
        .then(data => {
          let details = []
          let products = JSON.parse(data)
          
          products.products.forEach(BuildDetails);
          
          function BuildDetails(value) {
            console.log(value.brand)
            let row = {
              id: value.id,
              name: value.name,
              pic: value.img,
              brand: value.brand,
              price: value.net_price,
              description: value.description
            }

            details.push(row)
          }

          console.log(details)
        updateRows(details)
        })
    }

    /**
     * filters products by brand
     * @param {*} brand 
     */
    function filterBrand(brand) {
      let brandList = []
      if (brand === 'All items') {
        updateRows(allproducts)
      }
      else {
        for (const product of allproducts) {
          console.log(product)
          if (product.brand === brand) {
            brandList.push(product)
            continue
          }
        }
        updateRows(brandList)
      }
      
    }

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)

    /**
     * updates the row variable with filtered products
     */
    function filterByPrice() {
      let filteredPrices = []

      for (const product of allproducts) {
        if (product.price >= minPrice && product.price <= maxPrice) {
          console.log(product)
          filteredPrices.push(product)
        }
      }
      updateRows(filteredPrices)
    }

    const [gridView, setGridView] = useState(true)

    /**
     * toggle grid view
     */
    function handleGridChange() {
      if (gridView) {
        setGridView(false)
      }
      else {
        setGridView(true)
      }
    }

  return (
    <div>

    <Drawer style={{width: '400px'}} onClose={handleDrawer(false)} open={drawerState} anchor={'left'}>
      <h1 style={{fontFamily: 'Trebuchet MS', marginRight: '20px',marginLeft: '20px'}}>Categories</h1>
      <Button component={Link} to="/product/category/CPU">CPU</Button>
      <Button component={Link} to="/product/category/GPU">GPU</Button>
      <Button component={Link} to="/product/category/Memory">RAM</Button>
      <Button component={Link} to="/product/category/Storage">Storage</Button>
      <Button component={Link} to="/product/category/Case">Case</Button>
      <Button component={Link} to="/product/category/PSU">PSU</Button>
      <Button component={Link} to="/product/category/Motherboard">Motherboard</Button>
      <Button component={Link} to="/product/category/Monitor">Monitor</Button>
      <Button component={Link} to="/product/category/Mice">Mice</Button>
      <Button component={Link} to="/product/category/Keyboard">Keyboard</Button>
      <Button component={Link} to="/product/category/Peripherals">Peripheral</Button>
    </Drawer>
    
    <Header/>

    <div className={'mainFlex'}>
      <div className={'pagediv'}>
        <div className={'componentmargin'}>
          <div className={'productstitlediv'}>
            <h1 style={{height:'3vh', fontFamily: 'Trebuchet MS', marginTop: 0, marginBottom: 10}}>All Products</h1>
            <Button onClick={handleDrawer(true)} variant="outlined" style={{height:'3vh', marginLeft:"10px",marginTop:"25px"}}>Categories</Button>
            <Button onClick={() => {
              getPopular()
              }} variant="outlined" style={{height:'3vh', marginLeft:"10px",marginTop:"25px"}}>Sort by popular</Button>

            <Box sx={{ m: 1, minWidth: 120, marginBottom: 0 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Filter brand</InputLabel>
                <Select 
                  onChange={event => {
                    filterBrand(event.target.value)
                  }}
                  label="Filter brand"
                  >
                  <MenuItem value="All items">All items</MenuItem>
                  {productBrands.map((data, index) => {
                    return (
                      <MenuItem value={data} key={index}>{data}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
            <span style={{display: 'flex', alignItems: 'flex-end'}}>
              <input onChange={event => setMinPrice(event.target.value)} className={'formbox'} type="number" placeholder="Min price"/>
                {/* <div style={{marginBottom:"auto", marginTop:"auto"}}> */}
              <CompareArrowsIcon/>         
                {/* </div> */}
              <input onChange={event => setMaxPrice(event.target.value)} className={'formbox'} type="number" placeholder="Max price"/>
            <Button style={{height:'3vh', marginLeft:"10px", marginRight:"10px"}} variant="outlined" onClick={() => filterByPrice()}>Filter by price</Button>
            </span>
            <FormControlLabel control={<Checkbox color="primary" checked={gridView} onChange={() => handleGridChange()}/>} label="Grid view" />
          </div>
          <div style={{ minHeight:'80vh',maxHeight:'80vh', height: '80vh', overflow: 'auto', marginBottom: '20px' }}>
            {
              (!gridView) ? 
              <div style={{ minHeight:'80vh',maxHeight:'80vh', height: '80vh'}}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                />
              </div>
              : (gridView) ?
              <div className={"gridboxproducts"}>
                <ProductsRender rows={rows}/>
              </div>
              :<div></div>
            }
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default ViewProductsPage;