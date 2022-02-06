// const sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "./database/stargate.db";
// const md5 = require('md5')
const knex = require('knex') ({
    client: 'sqlite3',
    connection: {
      filename: DBSOURCE,
    },
    useNullAsDefault: true
})

// Create a table in the database called "sales"
// details the 'sale' of an individual 'product'
// one 'order' may contain many 'sales'
//   eg: order #12 contains the sales of {cpu1, gpu2, gpu3, mouse4, keyboard3}
//       all of which have separate prices and discounts
knex.schema
  .hasTable('sales')
    .then((exists) => {
      if (!exists) {
        // If no "sales" table exists, create it
        return knex.schema.createTable('sales', (table)  => {
          table.increments('id').primary();
          table.string('productid');
          table.decimal('gross_price', 11,2);
          table.decimal('net_price', 11,2);
          table.date('date') // added redundancy here for easy stats lookup
          table.string('discountid');
        })
        .then(() => {
          // Log success message
          console.log('Table \'Sales\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('Sales setup done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
    /*
    .then(() => {
      // Just for debugging purposes:
      // Log all data in "sales" table
      knex.select('*').from('sales')
        .then(data => console.log('sales data:', data))
        .catch(err => console.log(err))
    })
    */

// Create a table in the database called "orders"
// documents the overall order details
knex.schema
.hasTable('orders')
  .then((exists) => {
    if (!exists) {
      console.log("creating orders table")
      // If no "orders" table exists, create it
      return knex.schema.createTable('orders', (table)  => {
        table.increments('id').primary();
        table.string('customerid'); // customerid may be diff from the person purchased for
        table.string('first_name'); // e.g. Jimmy's account places an order delivered for Timmy
        table.string('last_name');
        table.string('email');
        table.string('phone_number')
        table.string('address');
        table.string('delivery_option');
        table.string('discount_code');
        table.decimal('total', 11,2);
        table.date('date');
        table.string('payment_method');
        table.boolean('insured');
        table.string('status');
        // table.primary('orderid');
      })
      .then(() => {
        // Log success message
        console.log('Table \'Orders\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('Orders setup done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })
  /*
  .then(() => {
    // Just for debugging purposes:
    // Log all data in "orders" table
    knex.select('*').from('orders')
      .then(data => console.log('orders data:', data))
      .catch(err => console.log(err))
  });
  */

// enable foreign keys in sqlite3
knex.raw("PRAGMA foreign_keys = ON;").then(() => {
  // console.log("Foreign Key Check activated.");

  // maps which sales belong to which orders
  //   e.g. order#99 involved {sale#22, sale#23, sale#24} resulting in 3 entries:
  // order| sale
  //   99 | 22
  //   99 | 23
  //   99 | 24
  knex.schema
  .hasTable('order_sales')
  .then((exists) => {
    if (!exists) {
      // If no "sales" table exists, create it
      return knex.schema.createTable('order_sales', (table)  => {
        table.integer('orderid').references('orders.id');
        table.integer('saleid').references('sales.id');
        table.primary(['orderid', 'saleid'])
      })
      .then(() => {
        // Log success message
        console.log('Table \'Order_Sales\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('Order Sales setup done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })
  /*
  .then(() => {
    // Just for debugging purposes:
    // Log all data in "sales" table
    knex.select('*').from('order_sales')
      .then(data => console.log('order_sales data:', data))
      .catch(err => console.log(err))
  });
  */
});



// export db as knex database
module.exports = knex;