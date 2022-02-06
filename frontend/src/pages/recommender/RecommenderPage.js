import { React } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Header from '../Header';
import Footer from '../Footer';

/**
 * Creates a page that introduces the purpose of the recommender quiz
 * 
 * @returns RecommenderPage
 */
function RecommenderPage() {

    const theme = ThemeColour();
    const history = useHistory();

    // creates / clears the answers from the recommendation quiz
    function handleClick() {
        const ans = {
            q1: '',
            q2: '',
            q3: '', 
            q4: '',
            q5: '',
            q6: '', 
            q7: '',
        }
        localStorage.setItem("answers", JSON.stringify(ans))
        history.push('recommender/questions');
    }

    return (
        <ThemeProvider theme={theme}>
            <Header />
            <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    minHeight:'calc(100vh - 362px)', 
                    maxWidth: '90vw', 
                    marginBottom:'20pt'
                }}>
                <h1 style={{marginLeft:"100px", color: "#173c5e"}}>Recommender Survey</h1>
                
                <p style={{marginLeft:"100px", marginRight:"100px"}}>
                    You want a new computer but have no idea where to start? Well
                    you've come to the right place, with a simple survey we can 
                    tailor a system just for you.
                </p>
                
                <Button 
                    id="continue"
                    color='yellow' 
                    variant='contained'
                    style={{
                        marginLeft:"100px", 
                        marginRight:"100px", 
                        width:"150px",
                        height:"50px",
                        padding:"10px",
                        float:"left"
                    }}
                    onClick={handleClick} 
                >Begin Survey
                </Button>
            </div>
            <Footer />
        </ThemeProvider>
    )

}

export default RecommenderPage;