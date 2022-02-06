import { React } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      Do you want lights on your system? If so, do you want them to be RGB?
 * Options:
 *      - RGB lights
 *      - Just lights
 *      - None
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q5
 */
const Q5 = ({currQuestion, handleChange}) => {
    
    const theme = ThemeColour();

    // check if the current question is number 5
    if (currQuestion !== 5) {
        return null
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width: "500px"}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Question 5. Do you want lights on your system? If so, do you want them to be RGB?
                        </FormLabel>
                        <RadioGroup 
                            name="radio-buttons-group"
                            onChange={
                                (event) => {handleChange("q5", event.target.value)}
                            }
                        >
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="rgb" 
                                />} 
                                label="RGB Lights"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="light" 
                                />} 
                                label="Just lights"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue"
                                    value="none" 
                                />} 
                                label="None"
                            />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default Q5;
