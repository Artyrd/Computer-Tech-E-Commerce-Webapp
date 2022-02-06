import {makeStyles} from '@material-ui/core';
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react';
import Logo from '../../pages/Logo.png'
import { Button, Drawer, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Card, CardContent} from '@mui/material';
import { grey } from '@mui/material/colors';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Radar } from 'react-chartjs-2';
import bronze from '../../img/BronzeMedium.png'
import silver from '../../img/SilverMedium.png'
import gold from '../../img/GoldMedium.png'
import platinum from '../../img/PlatinumMedium.png'
import diamond from '../../img/DiamondMedium.png'
import master from '../../img/MasterMedium.png'
import ThemeColour from '../../pages/ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { padding } from '@mui/material/node_modules/@mui/system';
import { BACKEND_PORT } from '../../config.json'

const theme = ThemeColour();

/**
 * Creates a visual representation of the quality of the current system in the 
 * cart
 * 
 * @returns RadarModal
 */
export const RadarModal = () => {
  const useStylesCart = makeStyles({
    root: {
      color: 'white',
      fontSize: '1vh',
    }
  })

  const stylesCart = useStylesCart();

  const [handleModal, setHandleModal] = useState(false)

  const handleModalClose = () => {
    setHandleModal(false)
  }

  /**
   * radar graph layout
   */
  const data = {
    labels: [
      'General Computing',
      'Gaming',
      'Video Editing',
      'Designing',
      '3D Modelling'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 90, 81, 25],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }, {
      label: 'My Second Dataset',
      data: [28, 48, 40, 19, 35],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
  }

  return (
    <div>
    <Dialog onClose={handleModalClose} open={handleModal}>
      <div style={{textAlign: 'center'}}>
        <DialogTitle>Computer Rating</DialogTitle>
      </div>
      <DialogContent>
        <Radar 
          data={data}
          width={600}
          height={600}
          options={{
            responsive:true
          }}
          />
      </DialogContent>
    </Dialog>
    <Button onClick={() => setHandleModal(true)} className={stylesCart.root} variant="outlined">Open Radar</Button>
    </div>
  )
}

/**
 * Adds the button at the bottom of the sidebar cart 
 * (cart, compatibility, benchmark)
 * 
 * @returns CartButtons
 */
export const CartButtons = () => {

  function getCartProductIds() {
    const products = JSON.parse(localStorage.getItem('cart'));
    let ids = []
    if (products !== null) {
      for (const product of products) {
        console.log('a');
        console.log(product);
        for (let i = 0; i < product.quantity; i++) {
          ids.push(product.id)
        }
      }
    }

    console.log(ids)
    return ids
  }

  const [modalType, setModalType] = useState('');

  const [compatability, setCompatibility] = useState({})
  const [handleModal, setHandleModal] = useState(false)

  const handleModalClose = () => setHandleModal(false)
  const handleModalOpen = () => setHandleModal(true)

  /**
   * Gets cart item comptatibility from the backend
   */
  async function compatablilityCheck() {
    await fetch('http://localhost:'+ BACKEND_PORT + '/api/compatibility/check', {
      headers:{
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        products: getCartProductIds()
      })
    }).then(res => res.text())
      .then(data => {
        setCompatibility(JSON.parse(data))
        console.log(JSON.parse(data))
      })
  }

  /**
   * Renders the comptatibility results
   * @returns Compatability results rendering
   */
  const CompatabilityResults = () => {
    
    console.log(compatability)
    if (compatability.incompatible !== undefined && compatability.incompatible.length !== 0) {
      return (
        <div style={{overflowX:'hidden', overflowY:'scroll'}}>
          <h4>The following product(s) are not compatible with other products:</h4>
          <br/>
          {compatability.incompatible.map((data, index) => {
            const products = JSON.parse(localStorage.getItem('cart'));
            let name = ''
            for (const product of products) {
              if (product.id === data) {
                name = product.name;
              }
            }
            return (<div key={index}>{name}</div>)
          })}
          <h4 style={{marginTop: "5px",marginBottom: "5px"}}>Incompatibility issues:</h4>

          {compatability.errorMessages.map((data, index) => {
            return(<div key={index}>{data}</div>)
          })}

          <h4 style={{marginTop: "5px",marginBottom: "5px"}}>Warnings:</h4>
          {compatability.warning.map((data, index) => {
            const products = JSON.parse(localStorage.getItem('cart'));
            let name = ''
            for (const product of products) {
              if (product.id === data) {
                name = product.name;
              }
            }
            return(<div key={index}>{name}</div>)
          })}

          <h4 style={{marginTop: "5px",marginBottom: "5px"}}>Warning messages:</h4>
          {compatability.warningMessages.map((data, index) => {
            return(<div key={index}>{data}</div>)
          })}

        </div>
      )
    }
    return (<div>
      Everything you have in the cart is compatible with each other
    </div>)
  }

  const [benchmark, setBenchmark] = useState({})

  /**
   * get benchmark results for items in cart from backend
   */
  async function runBenchmark() {
    await fetch('http://localhost:'+ BACKEND_PORT +'/api/benchmark', {
      headers:{
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        products: getCartProductIds()
      })
    })
    .then(res => res.text())
    .then(data => {
      setBenchmark(JSON.parse(data))
    })
  }

  /**
   * dataset is for rendering radar graph
   * @param {*} label 
   * @param {*} data 
   * @param {*} rgb 
   * @returns 
   */
  const createDatasetObject = (label, data, rgb) => ({
      label: label,
      data: data,
      fill: true,
      backgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`,
      borderColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`,
      pointBackgroundColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`,
  })

  /**
   * tier icons for benchmark
   * @param {*} tier 
   * @returns 
   */
  const getTierIcon = (tier) => {
    switch(tier) {
      case 'BRONZE':
        return (
          <img src={bronze}/>
        )
      case 'SILVER':
        return (
          <img src={silver}/>
        )
      case 'GOLD':
        return (
          <img src={gold}/>
        )
      case 'PLATINUM':
        return (
          <img src={platinum}/>
        )
      case 'DIAMOND':
        return (
          <img src={diamond}/>
        )
      case 'MASTER':
        return (
          <img src={master}/>
        )  
    }
  }

  /**
   * Renders benchmark results
   * @returns renders benchmark results
   */
  const BenchmarkResults = () => {
    console.log('benchmark is:')
    console.log(benchmark)
    console.log(compatability)
    if (benchmark === undefined || benchmark['data'] === undefined) {
      if (benchmark.error !== undefined) {
        return (
          <div>
            {benchmark.error}
          </div>
        )
      }
      return <div>Running benchmark...</div>
    }
    else if (compatability.incompatible === undefined) {
      return (
        <div>
          Please select some items to display benchmark
        </div>
      )
    }
    else {
      const data = {
        labels: benchmark['labels'],
        datasets: [
          createDatasetObject(
            benchmark['data'][0]['label'],
            benchmark['data'][0]['benchmark'],
            [237, 187, 70]
          ),
          createDatasetObject(
            benchmark['data'][1]['label'],
            benchmark['data'][1]['benchmark'],
            [6, 34, 65]
          ),
          createDatasetObject(
            benchmark['data'][2]['label'],
            benchmark['data'][2]['benchmark'],
            [23, 60, 94]
          ),
          createDatasetObject(
            benchmark['data'][3]['label'],
            benchmark['data'][3]['benchmark'],
            [92, 127, 161]
          ),
          createDatasetObject(
            benchmark['data'][4]['label'],
            benchmark['data'][4]['benchmark'],
            [209, 222, 236]
          )]
      }
      const options = {
        scales: {
          r: {
            beginAtZero: true
          }
        },
      };
      return (
        <div>
          <h4 style={{marginTop: "-1px",marginBottom: "-1px"}}>Here are your benchmark results:</h4>
          <div>
            <h4>{`${benchmark['tier']} TIER`}</h4>
            {getTierIcon(benchmark['tier'])}
          </div>
          <br/>
          <div >
            <Radar height={600} width={600} data={data} options={options}/>
          </div>
        </div>
      )
    }
  }

  return(
    <div>
        <Dialog onClose={handleModalClose} open={handleModal}>
        {(modalType === 'compatibility') ? <div>
          <DialogTitle>Compatibility Checker</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <CompatabilityResults/>
            </DialogContentText>
          </DialogContent>
        </div>
        : (modalType === 'benchmark') ? <div>
          <DialogTitle>Benchmark Results</DialogTitle>
          <DialogContent>
              <BenchmarkResults/>
          </DialogContent>
        </div>
        : <div></div>
      }
      </Dialog>
      <ThemeProvider theme={theme}>
          <Card id='card'>
            <CardContent>
        <div style={{display:'flex', justifyContent:'space-evenly'}}>
              <div style={{paddingRight: 10}}>
                <Button color='yellow' component={Link} to="/cart"  variant="contained"
                        onClick={() => {
                            localStorage.setItem("buynowflag", false)
                        }}>Cart</Button>
              </div>
              <div style={{paddingRight: 10}}>
                <Button color='lightblue' onClick={() => {
                      compatablilityCheck()
                      handleModalOpen()
                      // getCartProductIds()
                      setModalType('compatibility')
                      }} variant="contained">Compatability</Button>
              </div>
              <Button color='medblue' onClick={() => {
                    compatablilityCheck()
                    runBenchmark()
                    handleModalOpen()
                    setModalType('benchmark')
                    }} variant="contained">Benchmark</Button>
        </div>
            </CardContent>
          </Card>
      </ThemeProvider>
    </div>
  )
}

/**
 * Creates a cart sidebar that displays all the current item in your cart, it 
 * stays hidden until the user clicks the cart icon
 * 
 * @returns CartDrawer
 */
export const CartDrawer = () => {

  const [drawerState, setDrawerState] = useState(false);

  // const products = JSON.parse(localStorage.getItem("cart"));

  const [products, setProducts] = useState([])

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("cart")));
  }, [drawerState])

  const removeFromCart = (id) => {
    // let previousEntries = JSON.parse(localStorage.getItem("cart"))
    console.log(products);
    let previousEntries = products;
    // let iterator = 0;
    if (previousEntries.length === 1) {
      localStorage.removeItem("cart")
      setProducts([]);
    }
    else {
      const newProducts = previousEntries.filter((entry) => (entry.id !== id));
      localStorage.setItem("cart", JSON.stringify(newProducts))
      setProducts(newProducts)
    }
  }

  return (
    <div>
    <ThemeProvider theme={ theme }>
      <Drawer onClose={() => setDrawerState(false)} open={drawerState} anchor={"right"}>
        <div className={'sidebar'} style={{ margin: "10px" }}>
          <h2 id='header2'>Here are all the items in your cart</h2>
          {/* <h2 style={{marginLeft:"5px", marginRight:"5px"}}>Here are all the items in your cart</h2> */}
          {
            (products === null) 
            ? null
            : products.map((data, index) => {
              return (
                <Card id='card' key={ index } style={{marginBottom: 10}}>
                  <CardContent>
                    <div style={{display:"flex", justifyContent: "space-between"}}>
                      <div>
                        <h5 id='header2'>{data.name}</h5>
                        <h5>${data.price}</h5>
                        <h5 id='header2' style={{height: 25}}>Quantity: {data.quantity}</h5>
                        <Button color='lightblue' onClick={() => {
                          removeFromCart(data.id)
                          // setCart(data.id)
                          }} variant={"outlined"}>Remove</Button>
                      </div>
                      <Link to={"/products/" + data.id} onClick={() => {window.location.href=`/products/${data.id}`}}>
                        {<img style={{height:'100px', width: "100px", border:"1px solid"}} src={data.imgurl}/>}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          }
        </div>
        
        <div className={"drawerfooter"}>
          <CartButtons/>
        </div>
      </Drawer>
      <IconButton onClick={() => setDrawerState(true)}><ShoppingCartIcon sx={{ color: grey[50]}} fontSize='large'/></IconButton>
    </ThemeProvider>
    </div>
    
  )
}