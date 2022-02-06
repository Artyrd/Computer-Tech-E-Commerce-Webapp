const fs = require('fs');
// creating the app
const express = require('express');
const cors = require('cors');
const cron = require('node-cron')

const { checkAdminDates } = require('./controllers/admin')
const { sendEmailMailingList } = require("./controllers/send_email")

require('dotenv').config()
// other imports here

// index.js collates all the route files
const routes = require('./routes/index.js');

const app = express();

// server port
//const port = 6531;
// const port = parseInt(process.env.PORT, 10);
const configData = JSON.parse(fs.readFileSync('../frontend/src/config.json'));
const port = 'BACKEND_PORT' in configData ? configData.BACKEND_PORT : 6531;
app.use(cors()) // enable CORS
app.use(express.json()); // allow expr to parse JSON's from frontend

// import the routes
app.use(routes);

// !!!!!!!!!!!!!!!!!!! NOTE !!!!!!!!!!!!!!!!!!!!!!!!!
// !!! PUT MAIN ROUTES INTO the './routes/' FOLDER!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Task schedulers
// Checks the termination dates for admins
cron.schedule('0 */1 * * * *', () => {
  console.log(`Checking Admin termination dates...`)
  try {
    checkAdminDates()
  } catch (error) {
    console.log(`There was an error trying to check the admin dates: ${error}`)
  }
})

// Sends emails to the mailing lists with the new arrivals and discounts
cron.schedule('0 */5 * * * *', () => {
  console.log("Sending emails to the mailing lists...")
  try {
    sendEmailMailingList();
  } catch (error) {
    console.log(`There was an error trying to send the email to the mailing lists: ${error}`)
  }
})

// start the server
app.listen(port, () => {
  const message = `Stargate backend app listening at http://localhost:${port}`;
  const message2 = 'Please wait for all routes to load'
  console.log(`\x1b[93m${message}\x1b[39m`)
  console.log(`\x1b[34m${message2}\x1b[39m`)
});
