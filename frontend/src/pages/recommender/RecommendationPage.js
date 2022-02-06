import { React, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';
import { BACKEND_PORT } from '../../config.json'

/**
 * Creates a recommendation pages that displays a list of products that fits 
 * the user's requirements by using the answers the user provided, the pages
 * also displays the total price of the suggested system and a button to add
 * all items to the cart
 * 
 * @returns RecommendationPage
 */
function RecommendationPage() {

    const history = useHistory();
    const theme = ThemeColour();
    const ans = JSON.parse(localStorage.getItem("answers"));

    const [gpu, setGPU]                 = useState([]);
    const [cpu, setCPU]                 = useState([]);
    const [mobo, setMOBO]               = useState([]);
    const [ram, setRAM]                 = useState([]);
    const [psu, setPSU]                 = useState([]);
    const [cool, setCool]               = useState([]);
    const [kase, setKase]               = useState([]);
    const [storage, setStorage]         = useState([]);

    const [fetchedProducts, setFetchedProducts]     = useState(false);
    const [budgetSplit, setBudgetSplit]             = useState([]);
    const [finalSystem, setSystem]                  = useState([]);
    const [insufficientFunds, setInsufficientFunds] = useState(false);
    const [missingComponents, setMissing]           = useState([]);

    // allow the budget to the different parts of the system and sort the 
    // products into their catalogies
    useEffect(async () => {
        try {
            await decideBudgetSplit();
            const products = await getProducts()
            await sortProducts(products);
        }
        catch(err) {
            console.log('There was an error setting up:' + err);
        }
    }, []);

    // decide which components fits best for the user's requirements
    useEffect(async () => {
        try {
            if (fetchedProducts === true) {
                await decideComponets();
            }
        }
        catch (err) {
            console.log('There was an error determining components:' + err);
        }
    }, [fetchedProducts])

    // gets all the products currently in the database
    const getProducts = async () => {
        return fetch('http://localhost:' + BACKEND_PORT + '/products/', {
            method: 'GET',
        })
        .then(res => res.text())
        .then(data => {
            let stuff = []
            let products = JSON.parse(data);
            products.products.forEach((value) => {
                let row = {
                    id: value.id,
                    name: value.name,
                    price: value.net_price,
                    imgurl: value.imgurl,
                    quantity: 1,
                    description: value.description,
                    category: value.category,
                    tags: value.tags,
                }
                stuff.push(row);
            })
            return stuff;
        })
        .then((stuff) => {
            return stuff;
        })
        .catch((err) => {
            console.log('THERE WAS AN ERROR GETTING PRODUCTS:' + err)
        })
    };

    // sorts the products by their categories
    const sortProducts = async (products) => {
        if (products.length === 0) {
            return;
        }

        for (let i = 0; i < products.length; i++) {
            let temp = products[i];
            switch (products[i].category) {
                case ("GPU") :
                    let currGPU = gpu;
                    currGPU.push(temp);
                    setGPU(currGPU);
                    break;
                case ("CPU") :
                    let currCPU = cpu;
                    currCPU.push(temp);
                    setCPU(currCPU);
                    break;
                case ("Motherboard") :
                    let currMOBO = mobo;
                    currMOBO.push(temp);
                    setMOBO(currMOBO);
                    break;
                case ("Memory") :
                    let currRAM = ram;
                    currRAM.push(temp);
                    setRAM(currRAM);
                    break;
                case ("PSU") :
                    let currPSU = psu;
                    currPSU.push(temp);
                    setPSU(currPSU);
                    break;
                case ("Cooling") :
                    let currCool = cool;
                    currCool.push(temp);
                    setCool(currCool);
                    break;
                case ("Case") :
                    let currKase = kase;
                    currKase.push(temp);
                    setKase(currKase);
                    break;
                case ("Storage") :
                    let currStorage = storage;
                    currStorage.push(temp);
                    setStorage(currStorage);
                    break;
                // case ("Peripherals") :
                //     let currPeripherals = peripherals;
                //     currPeripherals.push(temp);
                //     setPeripherals(currPeripherals);
                //     break;
                default:
                    break
            }
        }
        setFetchedProducts(true);
    }

    // calculate the budget split taking into consideration what it will be used for
    const decideBudgetSplit = async () => {
        if (ans.q1 === "gaming") {
            setBudgetSplit([27,22,9,4,5,5,8,20]);
        } else if (ans.q1 === "editing") {
            setBudgetSplit([22,25,9,6,5,5,8,20]);
        } else if (ans.q1 === "programming") {
            setBudgetSplit([25,25,10,8,5,8,9,10]);
        } else if (ans.q1 === "work") {
            setBudgetSplit([22,22,10,8,5,8,10,15]);
        }
        return budgetSplit;
    };
    
    // decide the best componets from least to most important, any excess of 
    // the budget is redistrubuted to the following items
    const decideComponets = async () => {
        let sys = [];
        let part = {};
        let excess = 0;

        // storage
        const storageBudget = ans.q2 * budgetSplit[7] / 100;
        part = bestProduct(storage, storageBudget);
        excess = storageBudget - part.price;
        sys.push(part);

        // case
        const caseBudget = ans.q2 * budgetSplit[6] / 100 + excess;
        part = bestProduct(kase, caseBudget);
        excess = caseBudget - part.price;
        sys.push(part);

        // cool
        const coolBudget = ans.q2 * budgetSplit[5] / 100 + excess;
        part = bestProduct(cool, coolBudget);
        excess = coolBudget - part.price;
        sys.push(part);

        // psu
        const psuBudget = ans.q2 * budgetSplit[4] / 100 + excess;
        part = bestProduct(psu, psuBudget);
        excess = psuBudget - part.price;
        sys.push(part);

        // ram
        const ramBudget = ans.q2 * budgetSplit[3] / 100 + excess;
        part = bestProduct(ram, ramBudget);
        excess = ramBudget - part.price;
        sys.push(part);

        // mobo
        const moboBudget = ans.q2 * budgetSplit[2] / 100 + excess;
        part = bestProduct(mobo, moboBudget);
        excess = moboBudget - part.price;
        sys.push(part);

        // cpu
        const cpuBudget = ans.q2 * budgetSplit[1] / 100 + excess;
        part = bestProduct(cpu, cpuBudget);
        excess = cpuBudget - part.price;
        sys.push(part);

        // gpu
        const gpuBudget = ans.q2 * budgetSplit[0] / 100 + excess;
        part = bestProduct(gpu, gpuBudget);
        excess = gpuBudget - part.price;
        sys.push(part);
        
        sys = sys.filter(x => x !== undefined);

        setSystem(sys);
    }

    // choose the best product from the catalogue by comparing item score 
    // (calculated in another function) and if no item fits the budget
    // then notify the user 
    function bestProduct(products, budget) {
        let bestItem = {name: null, price: 0};
        let currScore = -Infinity;

        for (const product of products) {
            if (product.price <= budget) {
                const score = itemScore(product, budget);
                
                if (score > currScore) {
                    bestItem = product;
                    currScore = score;
                }
            }
        }

        if (bestItem.name === null && products.length > 0 ) {
            setInsufficientFunds(true);
            const missing = missingComponents;
            missing.push(products[0].category);
            setMissing(missing);
        }

        return bestItem;
    }

    // calculates a number to rank the suitability of the item for the system,
    // considering how close it is to the item budget, if it has the 
    // functionality required by the user, and if the item has tags that the 
    // user desires
    function itemScore(item, budget) {
        let score = 0;

        // how close is the item is to the budget
        score -= (budget - item.price) / 50;

        // check for requirements
        // if the item is a motherboard and the customer requires wifi
        if (item.catalogue === 'mobo' && ans.q7 === 'wifi') {
            score += 100;
        }

        // check if the product has extra aestectic features (rgb, colours)
        if (ans.q4 === 'yes') {
            if (searchTag(ans.q5, item.tags)) {
                score++;
            }
            if (searchTag(ans.q6, item.tags)) {
                score++;
            }
        }
        
        return score;
    }

    // searches the tags of a product for a certain keyword
    function searchTag(keyword, tags) {
        for (const tag of tags) {
            if (keyword === tag) {
                return true;
            }
        }
        return false;
    }
    
    // adds the recommendation components to the cart
    function addToCart() {
        let addition = []

        // creates a list of products from the recommended components
        for (let i = 0; i < finalSystem.length; i++) {
            if (finalSystem[i].name !== null) {
                let product = {
                    id: finalSystem[i].id,
                    name: finalSystem[i].name,
                    price: finalSystem[i].price,
                    quantity: 1,
                    imgurl: finalSystem[i].imgurl,
                    description: finalSystem[i].description  
                }
                addition.push(product)
            }
        }

        // sets the recommendation system as the new cart
        localStorage.setItem("cart", JSON.stringify(addition));
        localStorage.setItem("buynowflag", false);
        history.push('/cart');
    }

    // calculates the cost of all the recommended components
    function totalCost() {
        let totalCost = 0;
        
        if (finalSystem != null) {
            for (const [key, value] of Object.entries(finalSystem)) {
                totalCost += value.price;
            }
        }

        return totalCost;
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Header />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        minHeight:'calc(100vh - 362px)', 
                        maxWidth: '90vw', 
                        marginBottom:'20pt'
                    }}>
                        <div id='item-list' style={{marginLeft:"100px", marginRight:"100px", marginBottom:"30px"}}>
                            <h1 style={{color: "#173c5e"}}>Recommendation Page</h1>
                            <div>
                                {finalSystem.length < 1 ? <h2>Getting your recommendations...</h2>: null}
                            </div>

                            {insufficientFunds ? 
                                <div>
                                    <h3 style={{color: 'red'}}>
                                        We could not build a complete system given your current needs and budget, please wait 
                                        for restock of cheaper components or reconsider and take the questionnaire again
                                    </h3> 
                                    <p>Missing components: {missingComponents.toString()}</p>
                                </div>
                            : ''}
                            {(finalSystem.length > 0) ? 
                                (<div>
                                    <Table aria-label="simple table">
                                        <TableHead key={'productTableHead'}>
                                        <TableRow>
                                            <TableCell width={150}>Name</TableCell>
                                            <TableCell width={300} align="left">Image</TableCell>
                                            <TableCell width={150} align="left">Price</TableCell>
                                            <TableCell width={150} align="left">Qty</TableCell>
                                            <TableCell width={800} align="left">Decription</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody key={'productRecs'}>
                                            {finalSystem.map((row) => {
                                                if (row.name !== null) {
                                                    return (
                                                    <TableRow key={row.name}>
                                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                                        <TableCell align="left"><img src={row.imgurl} style={{width:'100px', height:'100px'}}/></TableCell>
                                                        <TableCell align="left">{row.price}</TableCell>
                                                        <TableCell align="left">{row.quantity}</TableCell>
                                                        <TableCell align="left">{row.description}</TableCell>
                                                    </TableRow>
                                                    )
                                                }
                                                else {
                                                    return;
                                                }
                                            })}
                                        </TableBody>
                                    </Table>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        justifyContent: 'space-between',
                                        marginTop:"20px",
                                        width: '100%',
                                    }}>
                                        <h3 
                                            style={{
                                                marginTop:"15px",
                                                color:"#173c5e",
                                            }}>
                                            Cart Cost: ${totalCost().toFixed(2)}
                                        </h3>
                                        <Button 
                                            id="continue"
                                            color='yellow' 
                                            variant='contained'
                                            style={{
                                                width:"150px",
                                                height:"50px",
                                            }}
                                            onClick={() => addToCart()} 
                                        >Add to Cart
                                        </Button>
                                    </div>
                                </div>) 
                            : ''}
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        </ThemeProvider>
    )

}

export default RecommendationPage;