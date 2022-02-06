import { React } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      What will you be doing on the computer?
 * Options:
 *      - Gaming
 *      - Editing photos / videos
 *      - Program development
 *      - Work
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q1
 */
const Q1 = ({currQuestion, handleChange}) => {

    const theme = ThemeColour();

    // check if the current question is number 1
    if (currQuestion !== 1) {
        return null
    } 

    return (
        <ThemeProvider theme={theme}>
            <Card id="card" style={{width: "500px"}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            Question 1. What will you be doing on the computer?
                        </FormLabel>
                        <RadioGroup 
                            name="radio-buttons-group" 
                            onChange={
                                (event) => {handleChange("q1", event.target.value)}
                            }
                        >
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="gaming" 
                                />} 
                                label="Playing games"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="editing" 
                                />} 
                                label="Editing photos / videos"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue"
                                    value="programming" 
                                />} 
                                label="Program development"
                            />
                            <FormControlLabel 
                                control={<Radio 
                                    color="darkblue" 
                                    value="work" 
                                />} 
                                label="Work"
                            />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default Q1;