import {React, useEffect, useState} from 'react';
import {Button, Card, CardContent, CardMedia, Checkbox, FormControlLabel, TextField, FormControl, Select, MenuItem, InputLabel} from '@mui/material';
// import Select from 'react-select';
import { WithContext as ReactTags } from 'react-tag-input';
import './AdminPages.css';
import CategoryOptions from '../../components/admin/products/CategoryOptions';
import Compatabilityfields from '../../components/admin/products/CompatibilityFields';
import Alerts from '../../components/Alerts';
import AdminHeader from '../../components/admin/AdminHeader';
import ThemeColour from '../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { BACKEND_PORT } from '../../config.json';

/**
 * Creates a page for the admin to add a new product given the products details
 * 
 * @returns AddProductPage
 */
function AddProductPage() {

    // Load page theme
    const theme = ThemeColour();
    // Product information States
    const [input, setInput] = useState({
        id: "",
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
    const [categoryFields, setCategoryFields] = useState([]);

    // Alert handlers
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [failText, setFailText] = useState(""); 
    const handleSuccess = () => {
      setSuccess(true);
    };
    const handleFail = () => {
      setFail(true);
    };

    useEffect(() => {
        console.log('category is:');
        console.log(category);
        console.log('category String:');
        console.log(categoryString);
    }, [category])

    // Get compatability fields 
    const getFields = () => {
        let fields = {};
        for (const entry of categoryFields) {
            fields[entry.label] = entry.value;
        }
        return fields;
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
    
    // Backend call to add a product of the provided information to the database
    async function handleSubmit(event) {
      event.preventDefault()
      console.log(getFields());
      const responseAdd = await fetch('http://localhost:'+ BACKEND_PORT + '/admin/products/add', {
        method: 'POST',
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
            fields: getFields()
            })
        })
        // Alert
        if (responseAdd.status === 200) {
            handleSuccess();
        }
        else {
            handleFail();
            setFailText("Could not add Product "+ input.id);
        }
        
        // Backend call to add a product's compatability information to the database
        const responseComp = await fetch('http://localhost:'+ BACKEND_PORT + '/admin/compatability/add', {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            body: JSON.stringify({
                id: input.id,
                name: input.name,
                price: input.price,
                description: input.description,
                imgurl: input.imgurl,
                tags: tagString,
                category: categoryString,
                available: available,
                fields: getFields()
                })
            })
    }

    // Handle input information changes
    const handleChange = name => event => {
        setInput({...input, [name]: event.target.value})
    }
    // Handle the checker indicating the availability of the product
    function handleCheck(event) {
        setAvailable(event.target.checked);
    }
    // Handle setting the category of the product
    function handleCategory(event) {
        // setCategory(event);
        // setCategoryString(event.label);
        setCategory(event.target.value);
        setCategoryString(event.target.value);
    }
    // Handle adding product tags
    function handleAddTag(tag) {
        var tempTagList = tags;
        tempTagList.push(tag);
        setTags(tempTagList);
        // Add the tag as a string to send to backend
        tempTagList = tagString;
        tempTagList.push(tag.text);
        setTagString(tempTagList);
    }
    // Handle removing product tags
    function handleDeleteTag(i) {
        var tempTagList = tags;
        tempTagList = tempTagList.filter(item => item !== tags[i]);
        setTags(tempTagList);
        // Remove the tag as a string to send to the backend
        tempTagList = tagString;
        tempTagList = tempTagList.filter(item => item !== tags[i].text);
        setTagString(tempTagList);
    }

    return(
        <div>
            <AdminHeader />
            <ThemeProvider theme={theme}>
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: 50}}>
                    <Card id="card" style={{width: 500}}>
                        <CardContent>
                            <h1 id='header2'> Add a New Product</h1>
                            <form onSubmit = {handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="id"
                                    label="UPC Identifier"
                                    name="id"
                                    type="text"
                                    onChange={handleChange('id')}
                                    sx={{backgroundColor: '#fff'}}
                                    autoFocus
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={available} onChange={handleCheck} color="lightblue"/>} 
                                    label="Is Available"
                                /> 
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Product Display Name"
                                    name="name"
                                    type="text"
                                    onChange={handleChange('name')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="brand"
                                    label="Product Brand"
                                    name="brand"
                                    type="text"
                                    onChange={handleChange('brand')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="price"
                                    label="Retail Price"
                                    name="price"
                                    type="text"
                                    onChange={handleChange('price')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <div style={{paddingTop: 10, paddingBottom: 5}}>
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
                                <Compatabilityfields 
                                    category={category}
                                    categoryFields={categoryFields}
                                    setCategoryFields={setCategoryFields}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="description"
                                    label="Product Description"
                                    name="description"
                                    type="text"
                                    onChange={handleChange('description')}
                                    sx={{backgroundColor: '#fff'}}
                                />

                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="imgurl"
                                    label="Link Display Image"
                                    name="imgurl"
                                    type="text"
                                    onChange={handleChange('imgurl')}
                                    sx={{backgroundColor: '#fff'}}
                                />
                                <Button type='button' variant="contained" component="label">
                                    or... Upload Display Image
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
                                <div style={{ marginBottom: '20px' }}></div>
                                <ReactTags 
                                    tags={tags}
                                    handleDelete={handleDeleteTag}
                                    handleAddition={handleAddTag}
                                    inputFieldPosition="top"
                                    autofocus={false}
                                />
                                <div style={{paddingTop: 15}}>
                                    <Button  onClick={handleSubmit} type="submit" color="yellow" fullWidth variant="contained">
                                        Add new product
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
                textSuccess={"Successfully added Product " + input.id + "!"}
                textFail={failText}
            />
        </div>
    );
}

export default AddProductPage;