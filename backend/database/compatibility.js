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

/**
 * cpu socket cptbibility
 * for cpu and motherboard
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => 
  knex.schema
  .hasTable('cptb_cpu')
  .then((exists) => {
    if (!exists) {
      console.log("creating cptb_cpu table")
      return knex.schema.createTable('cptb_cpu', (table)  => {
        table.string('productid');
        table.string('socket');
        table.foreign('productid').references('products.id').onDelete('CASCADE');
        table.primary(['productid', 'socket']);
      })
      .then(() => {
        console.log('Table \'cptb_cpu\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('cpu-mobo cptbability setup done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })
)

/**
 * ram cptbibility
 * for ram and motherboard
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => 
  knex.schema
  .hasTable('cptb_ram')
  .then((exists) => {
    if (!exists) {
      console.log("creating cptb_ram table")
      return knex.schema.createTable('cptb_ram', (table)  => {
        table.string('productid');
        table.string('module');
        table.foreign('productid').references('products.id').onDelete('CASCADE');
        table.primary(['productid', 'module']);
      })
      .then(() => {
        console.log('Table \'cptb_ram\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('ram-mobo cptbability setup done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })
)

/**
 * ram cptbibility
 * for ram and motherboard
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => 
  knex.schema
  .hasTable('cptb_ram_slots')
  .then((exists) => {
    if (!exists) {
      console.log("creating cptb_ram_slots table")
      return knex.schema.createTable('cptb_ram_slots', (table)  => {
        table.string('productid');
        table.string('slots');
        table.foreign('productid').references('products.id').onDelete('CASCADE');
        table.primary(['productid', 'slots']);
      })
      .then(() => {
        console.log('Table \'cptb_ram_slots\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('ram-mobo-sticks cptbability setup done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })
)

/**
 * motherboard size cptbibility
 * for motherboard and case
 */
knex.raw("PRAGMA foreign_keys = ON;").then(() => 
  knex.schema
  .hasTable('cptb_mobo_size')
  .then((exists) => {
    if (!exists) {
      console.log("creating cptb_mobo_size table")
      return knex.schema.createTable('cptb_mobo_size', (table)  => {
        table.string('productid');
        table.string('size');
        table.foreign('productid').references('products.id').onDelete('CASCADE');
        table.primary(['productid', 'size']);
      })
      .then(() => {
        console.log('Table \'cptb_mobo_size\' created')
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`)
      })
    }
  })
  .then(() => {
    // Log success message
    console.log('cpu-mobo cptbability setup done')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })
)

/**
 * storage type cptbibility
 */
 knex.raw("PRAGMA foreign_keys = ON;").then(() => 
    knex.schema
    .hasTable('cptb_storage')
    .then((exists) => {
        if (!exists) {
            console.log("creating cptb_storage table")
            return knex.schema.createTable('cptb_storage', (table)  => {
                table.string('productid');
                table.string('type');
                table.foreign('productid').references('products.id').onDelete('CASCADE');
                table.primary(['productid', 'type']);
            })
            .then(() => {
                console.log('Table \'cptb_storage\' created')
            })
            .catch((error) => {
                console.error(`There was an error creating table: ${error}`)
            })
        }
    })
    .then(() => {
        // Log success message
        console.log('storage type cptbability setup done')
    })
    .catch((error) => {
        console.error(`There was an error setting up the database: ${error}`)
    })
)
/**
 * storage size cptbibility
 */
 knex.raw("PRAGMA foreign_keys = ON;").then(() => 
    knex.schema
    .hasTable('cptb_storage_size')
    .then((exists) => {
        if (!exists) {
            console.log("creating cptb_storage_size table")
            return knex.schema.createTable('cptb_storage_size', (table)  => {
                table.string('productid');
                table.string('size');
                table.foreign('productid').references('products.id').onDelete('CASCADE');
                table.primary(['productid', 'size']);
            })
            .then(() => {
                console.log('Table \'cptb_storage_size\' created')
            })
            .catch((error) => {
                console.error(`There was an error creating table: ${error}`)
            })
        }
    })
    .then(() => {
        console.log('storage size cptbability setup done')
    })
    .catch((error) => {
        console.error(`There was an error setting up the database: ${error}`)
    })
)





module.exports = knex;