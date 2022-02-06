import {Button, Card, CardContent, TextField} from '@mui/material';
import './HelpPages.css'
import { useState } from 'react';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../ThemeColour';
import Footer from '../Footer';
import Alerts from '../../components/Alerts';
import {BACKEND_PORT} from '../../config.json'

/**
 * A form for users to submit an inquiry about their order
 * 
 * @returns OrderHelp
 */
const OrderHelp = () => {

  const theme = ThemeColour();

  // Alert handlers
  const [openSuccess, setSuccess] = useState(false);
  const [openFail, setFail] = useState(false);
  const [failText, setFailText] = useState("");
  
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState("")
  const [number, setNumber] = useState("")
  const [description, setDescription] = useState("")


  /**
   * submit the form to the backend
   */
  async function sendForm() {
    const response = await fetch('http://localhost:'+ BACKEND_PORT + '/email/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          email: email,
          orderid: order,
          phone: number,
          description: description
      })
    })
    if (response.status === 200) {
      setSuccess(true);
    }
    else {
      setFail(true);
    }
  }

  /**
   * Check if the form is able to submitted 
   */
  function submitIssue() {
    if (email === "" || order === "" || number === "" || description === "") {
      setFailText("Please fill out of all the required details")
      setFail(true);
    }

    else if (isNaN(number)) {
      setFailText("Please provide a valid phone number")
      setFail(true);
    }

    else if (isNaN(order)) {
      setFailText("Please provide a valid order number")
      setFail(true);
    }
    else {
      sendForm()
    }
  }

  return (
    <div>
      <Header/>
      <ThemeProvider theme={theme}>
        <div style={{display:'flex', justifyContent:'center', paddingTop: 25, paddingBottom: 25}}>
          <Card id='card' style={{width: 500}}>
            <CardContent>
              <h2 id='header2'>Help Request</h2>
              <h3 id='header2' style={{height: 100}}>Please fill out this form there is an issue with your order</h3>
                <form>
                  <h3 id="header2">Email</h3>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="id"
                        label="Email"
                        name="id"
                        type="text"
                        autoFocus
                        onChange={event => setEmail(event.target.value)}
                        sx={{backgroundColor: '#fff'}}
                    />
                  <h3 id="header2">Phone number</h3>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="id"
                        label="Phone number"
                        name="id"
                        type="text"
                        onChange={event => setNumber(event.target.value)}
                        sx={{backgroundColor: '#fff'}}
                    />
                  <h3 id="header2">Order number</h3>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="id"
                        label="Order number"
                        name="id"
                        type="text"
                        onChange={event => setOrder(event.target.value)}
                        sx={{backgroundColor: '#fff'}}
                    />
                  <h3 id="header2">Issue description</h3>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="id"
                        label="Issue description"
                        name="id"
                        type="text"
                        onChange={event => setDescription(event.target.value)}
                        sx={{backgroundColor: '#fff'}}
                    />
                  <Button color='yellow' onClick={() => submitIssue()} fullWidth variant="contained">Submit</Button>
                </form>
            </CardContent>
          </Card>
        </div>
        <Alerts 
            openSuccess={openSuccess}
            openFail={openFail}
            setSuccess={setSuccess}
            setFail={setFail}
            textSuccess={"Form submitted!"}
            textFail={failText}
        />
      </ThemeProvider>
      <Footer />
    </div>
  )
}

export default OrderHelp