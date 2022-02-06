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

const dayjs = require('dayjs');

/**
 * Create a table in the database called "products"
 */
knex.schema
  .hasTable('products')
    .then((exists) => {
      if (!exists) {
        console.log("creating products table")
        // If no "products" table exists, create it
        return knex.schema.createTable('products', (table)  => {
          table.string('id').primary();
          table.string('name');
          table.string('brand');
          table.decimal('price', 11,2);
          table.string('category');
          table.text('description'); 
          table.string('imgurl');
          table.boolean('available');
          table.integer('stock');
          table.boolean('mailing_list');
          table.date('date');
        })
        .then(() => {
          // Log success message
          console.log('Table \'Products\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('Products setup done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
    /*
    .then(() => {
      // Just for debugging purposes:
      // Log all data in "products" table
      knex.select('*').from('products')
        .then(data => console.log('products data:', data))
        .catch(err => console.log(err))
    })
    */

/**
 * Create a table in the database called "tags".
 * products-tags is a many-to-many relation, 
 * and thus should be in a separate table.
 * Table is de-normalised to make querying less of a headache.
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => {
  // console.log("Foreign Key Check activated.");

  knex.schema
  .hasTable('product_tags')
    .then((exists) => {
      if (!exists) {
        console.log("creating product_tags table")
        return knex.schema.createTable('product_tags', (table)  => {
          table.string('productid');
          table.string('tag');
          table.primary(['productid', 'tag']);
          table.foreign('productid').references('products.id').onDelete('CASCADE');
        })
        .then(() => {
          // Log success message
          console.log('Table \'Product Tags\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('Product Tags setup done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
    /*
    .then(() => {
      // Just for debugging purposes:
      // Log all data in "tags" table
      knex.select('*').from('product_tags')
        .then(data => console.log('tags data:', data))
        .catch(err => console.log(err))
    })
    */
});

knex.raw("PRAGMA foreign_keys = ON;").then(() => {
  // console.log("Foreign Key Check activated.");

  knex.schema
  .hasTable('wishlists')
    .then((exists) => {
      if (!exists) {
        console.log("creating wishlists table")
        return knex.schema.createTable('wishlists', (table)  => {
          table.string('productid');
          table.string('customerid');
          table.primary(['productid', 'customerid']);
          table.foreign('productid').references('products.id').onDelete('CASCADE');
          table.foreign('customerid').references('accounts.id').onDelete('CASCADE');
          
        })
        .then(() => {
          // Log success message
          console.log('Table \'Wishlists\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('Product Tags setup done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
    /*
    .then(() => {
      // Just for debugging purposes:
      // Log all data in "tags" table
      knex.select('*').from('wishlists')
        .then(data => console.log('tags data:', data))
        .catch(err => console.log(err))
    })
    */
});

/**
 * Create the product_reviews table.
 * Maps a customer and a product to a specific review and rating
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => {
  // console.log("Foreign Key Check activated.");
  knex.schema
  .hasTable('product_reviews')
    .then((exists) => {
      if (!exists) {
        console.log("creating product_reviews table")
        return knex.schema.createTable('product_reviews', (table)  => {
          table.string('productid');
          table.string('orderid');
          table.string('customerid');
          table.string('review');
          table.decimal('rating',2,1);
          table.date('date');
          table.primary(['productid', 'orderid']);
          table.foreign('orderid').references('orders.id').onDelete('CASCADE');
          table.foreign('productid').references('products.id').onDelete('CASCADE');
        })
        .then(() => {
          // Log success message
          console.log('Table \'Product Reviews\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('Product Reviews setup done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
    /*
    .then(() => {
      // Just for debugging purposes:
      // Log all data in "reviews" table
      knex.select('*').from('product_reviews')
        .then(data => console.log('review data:', data))
        .catch(err => console.log(err))
    })
    */
});

/**
 * Create the discounts table.
 * gives a net_price for a specific product within a set date range.
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => {
  // console.log("Foreign Key Check activated.");
  knex.schema
  .hasTable('discounts')
    .then((exists) => {
      if (!exists) {
        console.log("creating discounts table")
        return knex.schema.createTable('discounts', (table)  => {
          table.increments('id').primary();
          table.string('productid');
          table.decimal('net_price', 11,2);
          table.date('start');
          table.date('end');
          table.boolean('mailing_list');
          table.foreign('productid').references('products.id').onDelete('CASCADE');
        })
        .then(() => {
          // Log success message
          console.log('Table \'Discounts\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
      }
    })
    .then(() => {
      // Log success message
      console.log('Discounts setup done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })
    /*
    .then(() => {
      // debugging:
      // Log all data in "discounts" table
      knex.select('*').from('discounts')
        .then(data => console.log('discounts data:', data))
        .catch(err => console.log(err))
    })
    */
});


// export db as knex database
module.exports = knex;