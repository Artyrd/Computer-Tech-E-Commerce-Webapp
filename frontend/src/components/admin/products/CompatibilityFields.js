import {BACKEND_PORT} from '../../../config.json'
import {React, useEffect} from 'react';
import {TextField} from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import Stack from '@mui/material/Stack';

/**
 * Returns the input fields required for compatibility checking products, given the product's category
 * @param category - category string of the product
 * @param categoryFields - the category fields to be inputted, cpu socket, ram module, mobo size etc... 
 * @param setCategoryFields - the useState setting function for categoryFields
 * @returns CompatibilityFields
 */
function CompatibilityFields({category, categoryFields, setCategoryFields}) {

  // Backend call to get compatability fields for a given category
  const handleGetFields = async (productCategory) => {
    console.log('frontend category is: ');
    console.log(productCategory);
    return fetch(`http://localhost:${BACKEND_PORT}/api/compatibility/${productCategory}/fields`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer '+ localStorage.getItem('token'),
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return data;
    })
  }

  // For changes in category, get compatability fields
  useEffect(() => {
    if (!category) {
      return;
    }
    // handleGetFields(category.label)
    handleGetFields(category)
    .then((fetchResults) => {
      const compatFields = fetchResults.fields;
      console.log(compatFields)
      let newFields = [];
      for (const field of compatFields) {
        newFields.push({label: field[0], options: field[1], value: ''});
      }
      setCategoryFields(newFields);
    })
  }, [category])

  // Set field values
  const handleSetFieldValues = (label, value) => {
    console.log('inside handlesetfield values');
    console.log(label, value);
    let newFields = categoryFields;
    for (let field of newFields) {
      if (field['label'] === label) {
        field['value'] = value;
        break;
      }
    }
    setCategoryFields(newFields)
    console.log(categoryFields);
  }

  return (
    <div>
      {categoryFields.map((field) => {
        return <Stack spacing={2} sx={{ width: 300 }} key={field['label']}>
          <Autocomplete
            freeSolo={true}
            options={
              field['options']
            }
            onChange={(e, v)=> {
              handleSetFieldValues(field['label'], v)
            }}
            onInputChange={(e, v) => {
              handleSetFieldValues(field['label'], v)
            }}

            renderInput={(params) => 
              <TextField 
                {...params} 
                label={field['label']}
                value={field['value']}
                required={true}
              />
            }
          />
        </Stack>
      })}
    </div>
  )
}

export default CompatibilityFields;

