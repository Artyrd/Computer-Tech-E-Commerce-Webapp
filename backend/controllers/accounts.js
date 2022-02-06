const knex = require('./../database/accounts_db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const uuidv1 = require('uuidv1')
const { dateNowInIsoString } = require('./helper')
const { sendEmailReset } = require('./send_email')

require('dotenv').config()

/**
 * Registers an account into the database 
 * @param req.body : {first_name, last_name, email, password, phone, mailing_list, address}
 */
const register_account = async (req, res, next) => {

  if (req.body.password === undefined) {
    res.status(400).json({
      error: "Invalid password"
    })
  }

  // Encrypt password
  const salt = await bcrypt.genSalt();
  const hashed_password = await bcrypt.hash(req.body.password, salt);

  // Add account to database table "accounts"
  knex('accounts')
  .insert({
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'email': req.body.email,
    'password': hashed_password,
    'phone': req.body.phone,
    'permissions': 'user', // no making admin accounts from the backened
    'registration_date': dateNowInIsoString(),
    'mailing_list': req.body.mailing_list,
    'address': req.body.address
  })
  .then(() => {
    res.status(200).json({
      success: "Account with email: " + req.body.email + "created."
    })
  })
  .catch(err => {
    res.status(400).json({
      error: "There was an error creating an account with email: " + req.body.email
    })
    console.log(err)
  })
}

/**
 * Searches the database if the account exists and logs that account in.
 * @param req.body : {email, password}
 * @returns a JWT token used for authorisation and authentication
 */
const login_account = async (req, res, next) => {
  // console.log(req.body.email)

  knex('accounts')
  .where('email', req.body.email)
  .then(async (result) => {

    console.log(result)
    // No email found in database
    if (result.length == 0) {
      throw "Cannot find email";
    }
    // Compare passwords to see if they match
    const valid_password = await bcrypt.compare(req.body.password, result[0].password)
    if (!valid_password) { 
      throw "Incorrect password";
    } else {
      // Authenticated user... Create JWT
      const email = req.body.email;
      const customer_id = result[0].id;
      const account = { "email": email , "customer_id": customer_id};
      const access_token = jwt.sign(account, process.env.JWT_SECRET);
      res.status(200).json({ "access_token": access_token , "customer_id": customer_id});
    }
  })
  .catch(err => {
    // Other error
    res.status(400).json({
      error: err
    })
  })
}

/**
 * Sends an email with a unique link to reset the password
 * @param req.body : {email}
 */
const forgot_password = async (req, res, next) => {
  console.log(req.body.email)

  knex('accounts')
  .where('email', req.body.email)
  .then((result) => {
    // No email found in database
    if (result.length == 0) {
      throw "Email does not exist";
    }

    // Generate universally unique identifier
    const uuid = uuidv1()

    knex('reset_requests')
    .insert({
      // Store security code in database for future lookup
      'security_code': uuid,
      'email': req.body.email,
    })
    .then(() => {
      console.log("security code: ", uuid)
      //send email to user with security code
      sendEmailReset(uuid, req.body.email)
      res.status(200).json({
        success: ("Email sent to: ", req.body.email)
      })
    })
  })
  .catch(err => {
    // Error
    res.status(400).json({
      error: err
    })
    console.log(err)
  })
}

/**
 * Updates a user's password given a unique security code unique identifier
 * @param req.body : {security_code, password}
 */
const reset_password =  async (req, res, next) => {
  console.log(req.body.security_code)

  // Find reset request in the database
  knex('reset_requests')
  .where('security_code', req.body.security_code)
  .then(async (result) => {

    console.log(result)

    if (result.length == 0) {
      throw "Invalid security code"
    }

    if (req.body.password === undefined) {
      throw "Invalid password"
    }

    // Request found... Generate new encrypted password
    const salt = await bcrypt.genSalt();
    const new_hashed_password = await bcrypt.hash(req.body.password, salt);

    // Find the email in the accounts database
    knex('accounts')
    .where('email', result[0].email)
    .update({
      'password': new_hashed_password // update with new hashed password
    })
    .then(() => {
      // Find and delete the old request
      knex('reset_requests')
      .where('security_code', req.body.security_code)
      .del()
      .then(() => {
        res.status(200).json({
          "success": "Successfully updated password"
        })
      })
      .catch(err => {
        throw ("Failed to delete reset password request: ", err)
      })
    })
  })
  .catch(err => {
    res.status(400).json({
      error: err
    })
    console.log(err)
  })
}

/**
 * Obtains a user's personal details from the accounts database
 * @returns The user's details
 */
const get_profile = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (header == undefined) throw "No Authorization header found";
    
    const access_token = header.split(' ')[1]
    if (access_token == undefined) throw "Token does no exist";
    jwt.verify(access_token, process.env.JWT_SECRET, (err, account) => {
      if (err) {
        throw "Invalid token"
      }
  
      knex('accounts')
      .select('first_name', 'last_name', 'phone', 'mailing_list', 'address')
      .where('email', account.email)
      .then((result) => {
        res.status(200).json({
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          email: account.email,
          phone: result[0].phone,
          mailing_list: result[0].mailing_list,
          address: result[0].address
        })
      })
      .catch(err => {
        console.log(err)
        res.status(400).json({
          error: err
        })
      })
    })
  } catch (error) {
    res.status(400).json({ error: error })
    return
  }
}

/**
 * Edits a user's personal details from the accounts database
 * @param req.body : {first_name, last_name, email, phone, address, mailing_list}
 * @param res.locals : {customerid}
 */
const edit_profile = async (req, res, next) => {
  // Obtain the customerid
  customerid = res.locals.customerid

  updated_details = ({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    mailing_list: req.body.mailing_list
  })

  // Update the user's information
  knex('accounts')
  .where('id', customerid)
  .update(updated_details)
  .then(() => {
    console.log(`Customer with id: ${customerid} updated!`)
    res.status(200).json({
      success: `Customer with id: ${customerid} updated!`
    })
  })
  .catch((err) => {
    console.log(`There was an error: ${err}`)
    res.status(400).json({
      error: `There was an error: ${err}`
    })
  })
}

/**
 * Obtains the customerid either through the url or through searching the matching customerid from an orderid
 * @param req.params : {customerid, orderid}
 * @returns The customerid of the user
 */
const get_customerid_from_url = async (req) => {
  if (req.params.customerid != undefined) {
    // If params.customerid exists
    return req.params.customerid
  } else if (req.params.orderid != undefined) {
    // If params.orderid exists
    // Get customerid from order id
    return await knex('orders')
    .select('customerid')
    .where('id', req.params.orderid)
    .then((customerid) => {
      if (customerid.length == 0) return undefined;
      return customerid[0].customerid;
    })
    .catch((err) => {
      console.log(`Caught error: ${err}`)
      return undefined
    });
  }
}

/**
 * Obtains the user's permissions given a customerid
 * @param customer_id The customerid of the user
 * @returns The permissions of the user
 */
const get_permissions = async (customer_id) => {
  // Find the account given the customerid and return the permissions
  return await knex('accounts')
  .select('permissions')
  .where('id', customer_id)
  .then((result) => {
    return result[0].permissions
  })
  .catch((err) => {
    throw `Error occurred when trying to find id ${customer_id}: ${err}`
  });
}

/**
 * Verifies and obtains the customerid from a JWT token
 * @param access_token the JWT Token to be parsed
 * @returns The customerid obtained from the JWT Token
 */
const get_customerid_from_token = async (access_token) => {
  // Verify the integrity of the JWT Token
  return await jwt.verify(access_token, process.env.JWT_SECRET, async (err, account) => {
    if (err) throw "Invalid token";
    return account.customer_id;
  })
  .catch((err) => {
    throw `There was an error verifying the token: ${err}`
  });
}

/**
 * Checks whether an account has access.
 * Admins have full access. 
 * Users have limited access - They only have access to parts of the website with their own customerid
 * @param {*} permissions Permissions of the user. Either Admin or User
 * @param {*} req The request
 * @param {*} customer_id The customerid of the user
 * @returns 'granted' if the user has access 
 * @returns 'denied' if the user does not have access
 */
const determine_access = async (permissions, req, customer_id) => {
  if (permissions == 'admin') {
    console.log('Admin Account...')
    return 'granted'
  } else if (permissions == 'user') {
    // Obtain the customerid from the url
    return await get_customerid_from_url(req)
    .then((customerid) => {
      if (customerid == undefined) {
        console.log("Could not obtain a customerid")
        throw "Could not obtain a customerid"
      }

      if (customerid == customer_id) {
        console.log("You have access...")
        return 'granted'
      } else {
        console.log("You are trying to access someone elses customerid")
        return 'denied'
      }
    })
    .catch((err) => {
      throw err
    })
  } else {
    console.log("You have a valid token, but no permissions")
    return 'denied'
  }
}

/**
 * Middleware function used to check the whether a user has access to a particular part of the website
 */ 
 const check_user_customerid = async (req, res, next) => {
  try {
    // Parse JWT token
    console.log("Determining user privileges in check_user_customerid")
    const header = req.header('Authorization');
    if (header == undefined) throw "No Authorization header found";
    
    const access_token = header.split(' ')[1]
    if (access_token == undefined) throw "Token does no exist";

    const customerid = await get_customerid_from_token(access_token);
    const permissions = await get_permissions(customerid);
    const access = await determine_access(permissions, req, customerid);

    console.log(
      `\x1b[${(access == 'granted') ? 32 : 31}m%s\x1b[0m`,
      `Customerid: ${customerid} -- Permissions: ${permissions} -- Access: ${access}`
    );

    if (access == 'granted') {
      res.locals.customerid = customerid;
      next()
    } else {
      throw "You do not have permission"
    }

  } catch (error) {
    res.status(400).json({
      error: error
    })
    return;
  }
}

/**
 * Middleware function used to authenticate users that have admin privelages
 *  */ 
const authenticate_admin = async (req, res, next) => {
  try {
    // Parse JWT token
    console.log("Determining user privileges in authenticate_admin")
    const header = req.header('Authorization');
    if (header == undefined) throw "No Authorization header found";
    
    const access_token = header.split(' ')[1]
    if (access_token == undefined) throw "Token does no exist";

    const customerid = await get_customerid_from_token(access_token);
    const permissions = await get_permissions(customerid);

    if (permissions == 'admin') {
      console.log("Admin account...")
      next()
    } else {
      throw "You do not have permission"
    }

  } catch (error) {
    res.status(400).json({
      error: error
    })
    return;
  }
}

module.exports = {
    register_account,
    login_account,
    forgot_password,
    reset_password,
    edit_profile,
    get_profile,
    check_user_customerid,
    authenticate_admin
}
