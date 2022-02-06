import { React } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      Is aesthetics a factor you consider when buying products?
 * Options:
 *      - Yes
 *      - No
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q4
 */
const Q4 = ({currQuestion, handleChange}) => {
    
    const theme = ThemeColour();

    // check if the current question is number 4
    if (currQuestion !== 4) {
        return null
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width: "500px"}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Question 4. Is aesthetics a factor you consider when buying products?</FormLabel>
                        <RadioGroup 
                            name="radio-buttons-group"
                            onChange={
                                (event) => {handleChange("q4", event.target.value)}
                            }
                        >
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="yes" 
                                />} 
                                label="Yes"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue"
                                    value="no" 
                                />} 
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default Q4;
