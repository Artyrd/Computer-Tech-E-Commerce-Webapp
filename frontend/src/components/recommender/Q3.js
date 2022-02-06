import { React } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      How would you describe your knowledge and experience with computers?
 * Options:
 *      - Novice
 *      - Experienced
 *      - Expert
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q3
 */
const Q3 = ({currQuestion, handleChange}) => {
    
    const theme = ThemeColour();

    // check if the current question is number 3
    if (currQuestion !== 3) {
        return null
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width: "500px"}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Question 3. How would you describe your knowledge and experience with computers?
                        </FormLabel>
                        <RadioGroup 
                            name="radio-buttons-group"
                            onChange={
                                (event) => {handleChange("q3", event.target.value)}
                            }
                        >
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="novice" 
                                />} 
                                label="Novice"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="experienced" 
                                />} 
                                label="Experienced"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue"
                                    value="expert" 
                                />} 
                                label="Expert"
                            />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default Q3;