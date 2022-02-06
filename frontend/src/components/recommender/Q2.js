import { React } from 'react';
import { Card, CardContent, TextField, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      What is your budget for the computer?
 * Options:
 *      - Any value you want to put in
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q2
 */
const Q2 = ({currQuestion, handleChange}) => {
    
    const theme = ThemeColour();

    // check if the current question is number 2
    if (currQuestion !== 2) {
        return null
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width: "500px"}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Question 2. What is your budget for the computer?</FormLabel>
                            <FormControlLabel 
                                control={<TextField 
                                    color="darkblue" 
                                    varient="outlined"
                                    size="small"
                                    style={{marginLeft:"10px", marginTop:"10px"}}
                                    onChange={
                                        (event) => {handleChange("q2", event.target.value)}
                                    }
                                />} 
                                label=""
                            />
                    </FormControl>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default Q2;