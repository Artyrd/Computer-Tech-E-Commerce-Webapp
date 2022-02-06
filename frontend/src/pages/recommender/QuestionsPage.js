import { React, Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Q1, Q2, Q3, Q4, Q5, Q6, Q7, } from '../../components/recommender'
import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Alerts from '../../components/Alerts';
import Footer from '../Footer';

/**
 * Creates a questions pages that displays the current question the 
 * 
 * @returns QuestionsPage
 */
function QuestionsPage() {
    
    // varables to keep track of the question and answers
    const history = useHistory();
    const theme = ThemeColour();
    const [openSuccess, setSuccess] = useState(false);
    const [openFail, setFail] = useState(false);
    const [qNum, setQNum] = useState(1);
    const [ans, setAns] = useState(JSON.parse(localStorage.getItem("answers")));

    // changes the answers when form is editted
    function handleChange(name, value) {
        let currAns = ans;
        currAns[name] = value;
        setAns(currAns);
        localStorage.setItem("answers", JSON.stringify(ans))
    }
    
    // store the answers in the local storage and go to the recommendation page
    function handleSubmit(event) {
        if (ans.q7 == '') {
            handleFail();
            return;
        }
        
        localStorage.setItem("answers", JSON.stringify(ans))
        history.push('recommendation')
    }

    // alert handlers
    const handleFail = () => {
        setFail(true);
    };

    // increases the question number by 1
    function _next() {
        let temp = parseInt(qNum);

        const question = "q" + temp;
        if (ans[question] == '') {
            handleFail();
            return;
        }

        if (temp < 10) {
            if (temp == 4 && ans.q4 == "no") {
                temp += 3;
            } else {
                temp += 1;
            }
        }

        
        setQNum(temp);
    }
    
    // decreases the question number by 1
    function _prev() {
        let temp = parseInt(qNum);
        
        if (temp > 1) {
            if (temp == 7 && ans.q4 == "no") {
                temp -= 3;
            } else {
                temp -= 1;
            }
        }

        const question = "q" + temp;
        ans[question] = '';
        setQNum(temp);
    }
  
    // creates the "NEXT" buttom to navigate to the next question of the quiz
    function nextButton() {
        let temp = qNum;
        if (temp < 7) {
            return (
                <Button 
                id="next"
                color='yellow' 
                variant='contained'
                style={{
                    marginRight:"10px", 
                    width:"150px",
                    height:"50px",
                    padding:"10px",
                    float:"left"
                }}
                onClick={_next} 
                >next
                </Button>      
            )
        }
        return null;
    }
    
    // creates the "PREV" buttom to navigate to the previous question of the 
    // quiz
    function previousButton() {
        let temp = parseInt(qNum);
        if (temp > 1) {
            return (
                <Button 
                    id="prev"
                    color='yellow' 
                    variant='contained'
                    style={{
                        marginRight:"10px", 
                        width:"150px",
                        height:"50px",
                        padding:"10px",
                        float:"left"
                    }}
                    onClick={_prev} 
                >prev
                </Button>
            )
        }
        return null;
    }

    // creates the "SUBMIT" buttom to navigate to the recommendation page
    function submitButton() {
        let temp = parseInt(qNum);
        if(temp === 7) {
            return (
                <Button 
                    id="submit"
                    color='yellow' 
                    variant='contained'
                    style={{
                        width:"150px",
                        height:"50px",
                        padding:"10px",
                        float:"left"
                    }}
                    onClick={handleSubmit} 
                >Submit
                </Button>     
            )
        }
        return null;
    }
  
    return (
        <ThemeProvider theme={theme}>
            <Fragment>
                <Header />
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    minHeight:'calc(100vh - 362px)', 
                    maxWidth: '90vw', 
                    marginBottom:'20pt'
                }}>

                    <div style={{marginLeft:"100px"}}>
                        <h1 style={{color: "#173c5e"}}>Recommender Survey</h1>
                        <Q1 
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <Q2 
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <Q3
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <Q4
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <Q5
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <Q6
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <Q7
                            currQuestion={qNum} 
                            handleChange={handleChange}
                        />
                        <br/>
                        {previousButton()}
                        {nextButton()}
                        {submitButton()}
                    </div>
                </div>
            </Fragment>
            <Alerts 
                openSuccess={openSuccess}
                openFail={openFail}
                setSuccess={setSuccess}
                setFail={setFail}
                textSuccess={""}
                textFail={"Please answer the question"}
            />
            <Footer />
        </ThemeProvider>
    )

}
  
  export default QuestionsPage;