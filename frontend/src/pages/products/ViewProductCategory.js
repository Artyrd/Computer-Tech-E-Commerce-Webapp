import {React, useState, useEffect,} from 'react';
import {Link, useParams} from 'react-router-dom'
import '../../App.css';
import { productBrands } from './helper';
import {Button, Drawer, Select, MenuItem, FormControl, InputLabel, Box, Checkbox } from '@material-ui/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ProductsRender } from '../../components/products/BuyingComponents'
import { DataGrid } from '@mui/x-data-grid'
import Header from '../Header'
import Footer from '../Footer';
import CompareArrows from '@mui/icons-material/CompareArrows';
import {BACKEND_PORT} from '../../config.json'

/**
 * Creates page that shows all products in a certain catagory
 * 
 * @returns ViewProductsPage
 */
function ViewProductCategoryPage() {
  const {part} = useParams();

  useEffect(() => {
    getCategoryProducts();
  },[part])

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

  const [products, updateProducts] = useState([])


  /**
   * get products based on category
   */
  async function getCategoryProducts() {
    let stuff = []
    await fetch('http://localhost:'+ BACKEND_PORT +'/products/category/' + part, {
      method: 'GET',
    }).then(res => res.text())
      .then(data => {
        let products = JSON.parse(data)
        console.log(products)
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
        updateRows(stuff)
        updateProducts(stuff)
      })
    }

    const [drawerState, setDrawerState] = useState(false);

    const handleDrawer = (open) => (event) => {
      setDrawerState(open)
    }
  
    /**
     * get popular products from backend
     */
    async function getPopular() {
      await fetch('http://localhost:'+ BACKEND_PORT +'/api/sales/popular/category/' + part +'?start=2020-09-13&end=2022-12-30', {
        method: 'GET',
      }).then(res => res.text())
        .then(data => {
          let details = []
          let products = JSON.parse(data)

          products.products.forEach(BuildDetails);

          function BuildDetails(value) {
            console.log(value)
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
        updateRows(products)
      }
      else {
        for (const product of products) {
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
     * filter products by price
     */
    function filterByPrice() {
      let filteredPrices = []

      for (const product of products) {
        if (product.price >= minPrice && product.price <= maxPrice) {
          console.log(product)
          filteredPrices.push(product)
        }
      }
      updateRows(filteredPrices)
    }

    const [gridView, setGridView] = useState(true)

    /**
     * toggle datagrid to grid view
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
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/CPU">CPU</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/GPU">GPU</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Memory">RAM</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Storage">Storage</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Case">Case</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/PSU">PSU</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Motherboard">Motherboard</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Monitor">Monitor</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Mice">Mice</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Keyboard">Keyboard</Button>
      <Button onClick={handleDrawer(false)} component={Link} to="/product/category/Peripherals">Peripheral</Button>
    </Drawer>
    <Header/>

    <div className={'mainFlex'}>
      <div className={'pagediv'}>

        <div className={'componentmargin'}>
          <div className={'productstitlediv'}>
            <h1 style={{height:'3vh', fontFamily: 'Trebuchet MS', marginBottom: 10, marginTop: 0}}>All {part}s</h1>
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
                  {productBrands.map((data) => {
                    return (
                      <MenuItem value={data}>{data}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
            <span style={{display: 'flex', alignItems: 'flex-end'}}>
              <input onChange={event => setMinPrice(event.target.value)} className={'formbox'} type="number" placeholder="Min price"/>
              <CompareArrows/>
              <input onChange={event => setMaxPrice(event.target.value)} className={'formbox'} type="number" placeholder="max price"/>
            <Button style={{height:'3vh', marginLeft:"10px", marginRight:"10px"}} variant = "outlined" onClick={() => filterByPrice()}>Filter by price</Button>
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

export default ViewProductCategoryPage