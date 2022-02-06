import { React } from 'react';
import { Card, CardContent, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../pages/ThemeColour';

/**
 * Creates a quesetions page with the question:
 *      Will you be using wifi or ethernet?
 * Options:
 *      - Wifi is required
 *      - I rather use ethernet
 * 
 * @param {currQuestion} int 
 * @param {handleChange} function  
 * @returns Q7
 */
const Q7 = ({currQuestion, handleChange}) => {

    const theme = ThemeColour();

    // check if the current question is number 7
    if (currQuestion !== 7) {
        return null
    } 

    function checkQuestion() {
        const ans = JSON.parse(localStorage.getItem("answers"));
        console.log(ans)
        if (ans.q4 === "no") {
            return 5;
        } else {
            return 7;
        }
    }

    return (
        
        <ThemeProvider theme={theme}>
        <Card id="card" style={{width: "500px"}}>
            <CardContent>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        Question {checkQuestion()}. Will you be using wifi or ethernet?
                    </FormLabel>
                    <RadioGroup 
                        name="radio-buttons-group"
                        onChange={
                            (event) => {handleChange("q7", event.target.value)}
                        }
                    >
                        <FormControlLabel 
                            control={<Radio 
                                color="darkblue" 
                                value="wifi" 
                            />} 
                            label="Wifi is required"
                        />
                        <FormControlLabel 
                            control={<Radio 
                                color="darkblue" 
                                value="ethernet" 
                            />} 
                            label="I rather use ethernet"
                        />
                    </RadioGroup>
                </FormControl>
            </CardContent>
        </Card>
    </ThemeProvider>
    )
}

export default Q7;
