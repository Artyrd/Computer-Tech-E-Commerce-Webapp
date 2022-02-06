const knex = require('./../database/accounts_db');
const nodemailer = require('nodemailer')

const {
  queryProductsFromOrderId,
  queryViewOrderDetails,
} = require('./orders_queries')


/**
 * Generates the text message to be sent to email
 * @param orderDetails The order details for a customer
 * @param orderProducts The products that have been purchased
 * @returns The generated message for the body of the email
 */
const generateTextEmailConfirm = async (orderDetails, orderProducts) => {

  console.log("orderDetails")
  console.log(orderDetails)
  console.log("orderProducts")
  console.log(orderProducts)

  let message = `Hello ${orderDetails.first_name}, Thank you for your recent purchase!
  Here is a your order confirmation..
  You have purchased:\n`;

  for (let product of orderProducts) {
    message += `${product.name} ----- $${product.net_price}\n`
  }

  message += `Total cost is: $${orderDetails.total}`
  
  message += '\n\nThank you!'

  return message;
}

/**
 * Searches for new arrivals and new discounts to be added to the message.
 * @returns The generated message to be sent to the mailing list for new arrivals and discounts
 */
const generateTextMailingList = async () => {
  const arrivals = await getArrivals();
  const discounts = await getDiscounts();

  console.log("arrivals")
  console.log(arrivals)
  console.log("discounts")
  console.log(discounts)

  let message = `Hello,\n
Please have a look at our latest arrivals and discounts!\n`;

  if (arrivals.length != 0) {
    message += `Today, we have ${arrivals.length} new item/s:\n`
    for (let product of arrivals) {
      message += `${product.name} ----- $${product.price}\n`
    }
  } else {
    message += "\nWe do not have any new arrivals...\n"
  }

  if (discounts.length != 0) {
    message += `Today, we have ${discounts.length} new discount/s:\n`
    for (let product of discounts) {
      message += `${product.name} ----- $${product.net_price}\n`
    }
  } else {
    message += "\nWe do not have any new discounts...\n"
  }

  message += "\n\nThank you!"
  return message;

}

/**
 * Generates the message to be sent to the inbox account about the price matches
 * @param priceMatches 
 * @returns The generated message for price matches
 */
const generatePriceMatch = async (priceMatches) => {
  message = "Price Matches: \n"
  
  for (let product of priceMatches) {
    if (product.url == "") {
      continue
    } 
    message += `Product id: ${product.product} - Price Match url: ${product.url}\n`
  }
  
  return message
}

/**
 * Obtains all the email addresses currently subscribed to the mailing list
 * @returns All the emails that are subscribed to the mailing list
 */
const getMailers = async () => {
  try {
    const mailing_list = []
    const emails = await knex('accounts')
    .select('email')
    .where('mailing_list', true)
    .then((mailers) => {
      if (mailers.length === 0) {
        throw "No emails in the mailing list to send to :c"
      }
      return mailers
    })
    .catch((err) => {
      console.log(`Error in trying to obtain the email: ${err}`)
      throw err
    })
  
    console.log('getMailers')
    
    for (let email of emails) {
      mailing_list.push(email.email)
    }
    
    
    console.log(mailing_list)
    return mailing_list

  } catch (error) {
    throw `There was an error in getMailers: ${error}`
  }
}

/**
 * Obtains all the new arrivals for the mailing list
 * @returns All the new arrivals
 */
const getArrivals = async () => {
  return await knex('products')
  .select('name', 'price')
  .where('mailing_list', true)
  .then((product) => {
    console.log(`New product arrivals`)
    console.log(product)
    return product
  })
  .catch((err) => {
    console.log(`There was an error in getting the new product arrivals: ${err}`)
    throw `There was an error in getting the new product arrivals: ${err}`
  })
}

/**
 * Obtains all the new discounts for the mialing list
 * @returns All the new discounts
 */
const getDiscounts = async() => {
  return await knex('discounts')
  .join('products', 'products.id', '=', 'discounts.productid')
  .select('products.name', 'discounts.net_price')
  .where('discounts.mailing_list', true)
  .then((product) => {
    console.log(`New Discounts:`)
    console.log(product)
    return product
  })
  .catch((err) => {
    console.log(`There was an error in getting the new discounts: ${err}`)
    throw `There was an error in getting the new discounts: ${err}`
  })
}

/**
 * Updates the products in the database to not be sent in the next newsletter email for the mailing list
 */
const updateArrivals = async () => {
  knex('products')
  .where('mailing_list', true)
  .update({
    'mailing_list': false
  })
  .then(() => {
    console.log("Updated arrivals")
  })
  .catch((err) => {
    console.log("There was an error with updating the arrivals table")
    throw `There was an error with updating the arrivals table ${err}`
  })
}

/**
 * Updates the products in the database to not be sent in the next newsletter email for the mailing list
 */
const updateDiscounts = async () => {
  knex('discounts')
  .where('mailing_list', true)
  .update({
    'mailing_list': false
  })
  .then(() => {
    console.log("Updated discounts")
  })
  .catch((err) => {
    console.log("There was an error with updating the discounts table")
    throw `There was an error with updating the discounts table ${err}`
  })
}

/**
 * Sends the newsletter to the emails currently subscribed to the mailing list
 */
const sendEmailMailingList = async () => {
  try {
    const emails = await getMailers();
    const message = await generateTextMailingList()

    console.log(`emailing list: ${emails}`)

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    let mail_options = {
      from: process.env.EMAIL_USER,
      to: emails,
      subject: `New Arrivals and Discounts`,
      text: message
    }

    transporter.sendMail(mail_options, (err, data) => {
      if (err) throw (`Could not send email: ${err}`);
    })

    await updateArrivals();
    await updateDiscounts();


  } catch (error) {
    console.log(`There was an error sending the email to the mailing list: ${error}`)
    return
  }
}

/**
 * Sends the order confirmation to the user that just placed an order
 * @param orderid The orderid of the purchase
 */
const sendEmailConfirm = async (orderid) => {
  try {
    const orderDetails = await queryViewOrderDetails(orderid);
    const orderProducts = await queryProductsFromOrderId(orderid);
    const customerEmail = await orderDetails[0].email;
    const message = await generateTextEmailConfirm(orderDetails[0], orderProducts);

    console.log(`Email confirmation:\n${message}`)
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    let mail_options = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order confirmation for Order number: ${orderid}`,
      text: message
    }
  
    transporter.sendMail(mail_options, (err, data) => {
      if (err) console.log(`There was an error sending the confirmation email: ${err}`);
    })

  } catch (error) {
    console.log(`There was an error sending the confirmation email: ${error}`)
    return
  }
}

/**
 * Sends a link to the email with the link to the reset password
 * @param security_code A universally unique id
 * @param email The email of the user
 */
 const sendEmailReset = async (security_code, email) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  let mail_options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Stargate Reset Password Request',
    text: `You have requested a password reset... Click on this link to reset your password: http://localhost:3000/reset_password?security_code=${security_code}`
  }

  transporter.sendMail(mail_options, (err, data) => {
    if (err) {
      throw ("Could not send email: ", err)
    }
  })
}

/**
 * Sends the price drop email to the website inbox
 * @param req : {email, orderid, phone, product_name}
 */
const sendEmailPriceDrop = async (req, res, next) => {
  try {
    const { email, orderid, phone, product_name } = req.body
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  
    let mail_options = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_INBOX,
      subject: `Price drop for Order ID: ${orderid}`,
      text: `From: ${email}\nPhone: ${phone}\nProduct Name: ${product_name}`
    }
  
    transporter.sendMail(mail_options, (err, data) => {
      if (err) {
        throw ("Could not send email: ", err)
      }
    })

    res.status(200).json({ message: `Successfully submitted a price drop request with orderid: ${orderid}` })
    
  } catch (error) {
    console.log(`There was an error sending the email for Price drop: ${error}`)
    res.status(400).json({ error: `There was an error sending the email for Price drop: ${error}` })
  }
}

/**
 * Sends the issues email to the website inbox
 * @param req : {email, orderid, phone, description}
 */
const sendEmailIssues = async (req, res, next) => {
  try{
    const { email, orderid, phone, description } = req.body
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    let mail_options = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_INBOX,
      subject: `Issues for Order ID: ${orderid}`,
      text: `From: ${email}\nPhone: ${phone}\nDescription: ${description}`
    }

    transporter.sendMail(mail_options, (err, data) => {
      if (err) {
        throw ("Could not send email: ", err)
      }
    })
  
    res.status(200).json({ message: `Successfully submitted a price drop request with orderid: ${orderid}` })

  } catch (error) {
    console.log(`There was an error sending the email for Price drop: ${error}`)
    res.status(400).json({ error: `There was an error sending the email for Price drop: ${error}` })
  }
}

const sendEmailPriceMatch = async (orderid, priceMatches) => {
  try{

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const message = await generatePriceMatch(priceMatches)
    
    let mail_options = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_INBOX,
      subject: `Price Matches for Order ID: ${orderid}`,
      text: message
    }

    transporter.sendMail(mail_options, (err, data) => {
      if (err) {
        throw ("Could not send email: ", err)
      }
    })
  
  } catch (error) {
    console.log(`There was an error sending the email for Price Match: ${error}`)
    throw `There was an error sending the email for Price Match: ${error}`
  }
}

module.exports = {
  sendEmailReset,
  sendEmailConfirm,
  sendEmailMailingList,
  sendEmailPriceDrop,
  sendEmailPriceMatch,
  sendEmailIssues
}