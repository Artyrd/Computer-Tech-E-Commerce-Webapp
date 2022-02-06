import {React, useState} from 'react';
import {Button, Card, CardContent, CardMedia, TextField, Checkbox, FormControl, InputLabel, MenuItem, Select, FormControlLabel} from '@mui/material';
// import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import './AdminPages.css';
import Alerts from '../../components/Alerts';
import CategoryOptions from '../../components/admin/products/CategoryOptions';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * This page is create for existing products, similar to the add new product
 * page but the fields are autofilled in and change be changed by the admin
 * 
 * @returns EditProductPage
 */
function EditProductPage() {
    // Load page themes
    const theme = ThemeColour();

    // Product information states
    const [input, setInput] = useState({
        id: localStorage.getItem('productid'),
        name: "",
        price: 0.0,
        description: "",
        imgurl: "",
        brand: "",
    })
    const [tags, setTags] = useState([]);
    const [tagString, setTagString] = useState([]);
    const [category, setCategory] = useState('');
    const [categoryString, setCategoryString] = useState("");
    const [available, setAvailable] = useState(false);

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [successText, setSuccessText] = useState(""); 
    const [failText, setFailText] = useState(""); 
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };

    // Backend call to edit the product with the given product information
    async function handleSubmit(event) {
        event.preventDefault()
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/admin/products/edit', {
            method: 'PUT',
            headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                id: input.id,
                name: input.name,
                brand: input.brand,
                price: input.price,
                description: input.description,
                imgurl: input.imgurl,
                tags: tagString,
                category: categoryString,
                available: available,
              })
        })
        console.log(response.json());
        // Alert
        if (response.status === 200) {
            handleSuccess();
            setSuccessText("Successfully editted Product " + input.id + "!");
        }
        else {
            handleFail();
            setFailText("Could not edit Product " + input.id);
        }
    }

    // Transform a file to data URL
    const fileToDataUrl = (file) => {
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
        const valid = validFileTypes.find(type => type === file.type);
        // Bad data, let's walk away.
        if (!valid) {
            handleFail();
            setFailText("Invalid file type");
            return null;
        }
        if (file.size > 100000) {
            handleFail();
            setFailText("File too large!");
            return null;
        }
        const reader = new FileReader();
        const dataUrlPromise = new Promise((resolve, reject) => {
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result);
        });
        reader.readAsDataURL(file);
        return dataUrlPromise;
    }

    // Upload an image
    const uploadDisplayImage = async (e) => {
        try {
            const files = e.target.files;
            // If invalid files
            if (!files) {
                return;
            }
            // Transform to data URL and store
            const dataImage = await fileToDataUrl(files[0])
            if (typeof dataImage === 'string' && dataImage.length > 0) {
                setInput({...input, ['imgurl']: dataImage})
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Backend call to get product information for a given productid
    async function getData() {
        const response = await fetch('http://localhost:' + BACKEND_PORT + '/products/' + input.id, {
            method: 'GET',
            headers: {
            'Content-type': 'application/json'
            },
        })
        const data = await response.json();
        console.log(data);

        // Alert if product cannot be found
        if (response.status !== 200) {
            handleFail();
            setFailText("Could not find Product " + input.id);
            setInput({...input,
                id: input.id,
                name: "",
                brand: "",
                price: 0,
                description: "",
                imgurl: "",
            })
            setCategory("");
            setTags([]);
        }
        // Prefill information if product is found
        else {
            setInput({...input,
                id: input.id,
                name: data.name,
                brand: data.brand,
                price: data.gross_price,
                description: data.description,
                imgurl: data.imgurl,
            })

            // const prevCategory = {value: data.category, label: data.category}
            // setCategory(prevCategory);
            setCategory(data.category)
            setCategoryString(data.category)
            setAvailable((data.available))

            // Create tags for given tag strings
            const prevTags = [];
            const prevTagString = [];
            if (data.tags !== undefined) {
                for (const tag of data.tags) {
                    const prevTag = {id: tag, text: tag};
                    prevTags.push(prevTag);
                    prevTagString.push(tag);
                }
            }
            setTags(prevTags);
            setTagString(prevTagString);
        }
    }

    // Handle changing inputs for product information
    const handleChange = name => event => {
        setInput({...input, [name]: event.target.value})
    }
    // Handle check for product availability
    function handleCheck(event) {
        setAvailable(event.target.checked);
    }
    // Handle product category changes
    function handleCategory(event) {
        // setCategory(event);
        // setCategoryString(event.label);
        setCategory(event.target.value);
        setCategoryString(event.target.value);
    }
    // Handle adding a new product tag
    function handleAddTag(tag) {
        var tempTagList = tags;
        tempTagList.push(tag);
        setTags(tempTagList);
        // Add tag as string for backend call
        tempTagList = tagString;
        tempTagList.push(tag.text);
        setTagString(tempTagList);
    }
    // Handle removing a product tag
    function handleDeleteTag(i) {
        var tempTagList = tags;
        tempTagList = tempTagList.filter(item => item !== tags[i]);
        setTags(tempTagList);
        // Remove tag as string for backend call
        tempTagList = tagString;
        tempTagList = tempTagList.filter(item => item !== tags[i].text);
        setTagString(tempTagList);
    }

    return(
        <div>
            <AdminHeader />
            <ThemeProvider theme={theme}>
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: 50}}>
                    <Card id="card" style={{width:500}}>
                        <CardContent>
                            <h1 id="header2">Edit a Product</h1>
                            <form onSubmit = {handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="id"
                                    label="UPC Identifier of Product to Edit"
                                    name="id"
                                    type="text"
                                    onChange={handleChange('id')}
                                    onBlur={getData}
                                    value={input.id}
                                    autoFocus
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={available} onChange={handleCheck} color="lightblue"/>} 
                                    label="Is Available"
                                />            
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="name"
                                    label="New Product Display Name"
                                    name="name"
                                    type="text"
                                    onChange={handleChange('name')}
                                    value={input.name}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="brand"
                                    label="New Product Brand"
                                    name="brand"
                                    type="text"
                                    onChange={handleChange('brand')}
                                    value={input.brand}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="price"
                                    label="New Retail Price"
                                    name="price"
                                    type="text"
                                    onChange={handleChange('price')}
                                    value={input.price}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <div style={{paddingTop: 10, paddingBottom: 5}}>
                                    {/* <Select 
                                        options={CategoryOptions()}
                                        value={category}
                                        onChange={handleCategory}
                                        defaultValue={{value: 'none', label:'Select a Category'}}
                                    />*/}
                                    <FormControl fullWidth>
                                        <InputLabel>{'Select a Category'}</InputLabel>
                                        <Select 
                                            options={CategoryOptions()}
                                            required
                                            value={category}
                                            onChange={handleCategory}
                                            sx={{backgroundColor: '#fff'}}
                                            // defaultValue={{value: 'none', label:'Select a Category'}}
                                            label='Select a Category'
                                        >
                                        {
                                        CategoryOptions().map((category, index) => {
                                            return (
                                                <MenuItem key={index} value={category.label}>{category.label}</MenuItem>
                                            )
                                        })
                                        }
                                        </Select>
                                    </FormControl>
                                </div>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="description"
                                    label="New Product Description"
                                    name="description"
                                    type="text"
                                    onChange={handleChange('description')}
                                    value={input.description}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="imgurl"
                                    label="Upload Image"
                                    name="imgurl"
                                    type="text"
                                    onChange={handleChange('imgurl')}
                                    value={input.imgurl}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <Button type='button' variant="contained" component="label">
                                    or Upload Different Image
                                    <input type="file" hidden onChange={ uploadDisplayImage }/>
                                </Button>
                                { input.imgurl === ''
                                    ? null
                                    : (
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 200, margin: '10px 0px', boxShadow: 3 }}
                                        image={ input.imgurl }
                                    />
                                    )
                                }
                                <ReactTags 
                                    tags={tags}
                                    handleDelete={handleDeleteTag}
                                    handleAddition={handleAddTag}
                                    inputFieldPosition="top"
                                    value={tags}
                                    autofocus={false}
                                />
                                <div style={{paddingTop: 15}}>
                                    <Button type="submit" color="yellow" fullWidth variant="contained">
                                        Change Product Details
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </ThemeProvider>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={successText}
                textFail={failText}
            />
        </div>
    );
}

export default EditProductPage;