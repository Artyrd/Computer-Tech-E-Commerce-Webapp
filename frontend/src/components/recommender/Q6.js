import { React } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      What is your favorite colour?
 * Options:
 *      - Blue
 *      - Red
 *      - Yellow
 *      - Green
 *      - Purple
 *      - Orange
 *      - Black
 *      - White
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q6
 */
const Q6 = ({currQuestion, handleChange}) => {
    
    const theme = ThemeColour();
    
    // check if the current question is number 6
    if (currQuestion !== 6) {
        return null
    } 
    
    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width: "500px"}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Question 6. Do you want lights on your system? If so do you want them to be RGB?
                        </FormLabel>
                        <RadioGroup 
                            name="radio-buttons-group"
                            onChange={
                                (event) => {handleChange("q6", event.target.value)}
                            }
                        >
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="blue" 
                                />} 
                                label="Blue"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="red" 
                                />} 
                                label="Red"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue"
                                    value="yellow" 
                                />} 
                                label="Yellow"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="green" 
                                />} 
                                label="Green"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="orange" 
                                />} 
                                label="Orange"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue"
                                    value="purple" 
                                />} 
                                label="Purple"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="black" 
                                />} 
                                label="Black"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="white" 
                                />} 
                                label="White"
                            />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default Q6;
