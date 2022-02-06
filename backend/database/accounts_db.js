const DBSOURCE = './database/stargate.db';

const knex = require('knex') ({
    client: 'sqlite3',
    connection: {
        filename: DBSOURCE,
    },
    useNullAsDefault: true
})
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

knex.schema
    .hasTable('accounts')
    .then((exists) => {
        if (!exists) {
            return knex.schema.createTable('accounts', (table) => {
                table.increments('id').primary();
                table.string('first_name');
                table.string('last_name');
                table.string('email');
                table.string('password');
                table.string('phone');
                table.string('permissions');
                table.string('address')
                table.date('registration_date')
                table.date('termination_date')
                table.boolean('mailing_list');
            })
            .then(() => {
                console.log('Table \'Accounts\' created')
            })
            .catch((error) => {
                console.error('There was an error creating table: ', error)
            })
        }
    })
    .then(async()=> {
        // .insert('Artanis', )
        const salt = await bcrypt.genSalt();
        const eternalAdminAccount = {
            first_name: 'Artanis',
            email: 'admin@stargate.com',
            password: await bcrypt.hash('admin', salt),
            phone: '9999999999',
            permissions: 'admin',
            registration_date: '2000-01-01',
            termination_date: '9999-09-09',
            address: 'somewhere'
        }
        return knex('accounts')
            .select()
            .where({email: eternalAdminAccount.email})
            .then((result) => {
                if (result.length === 0) {
                    // no matching records found
                    console.log('Registering Eternal Admin')
                    return knex('accounts').insert(eternalAdminAccount)
                } else {
                    console.log('Eternal Admin verified')
                }
            })
            .catch((error) => {
                console.error('There was an error verifying the eternal admin: ', error)
            })
    })
    .then(() => {
        console.log('Accounts setup done')
    })
    .catch((error) => {
        console.error('There was an error setting up the database: ', error)
    })


knex.schema
    .hasTable('reset_requests')
    .then((exists) => {
        if (!exists) {
            return knex.schema.createTable('reset_requests', (table) => {
                table.string('security_code').primary();
                table.string('email');
            })
            .then(() => {
                console.log("Table \'Reset Requests\' created")
            })
            .catch((error) => {
                console.error("There was an error creating table: ", error)
            })
        }
    })
    .then(() => {
        console.log("Reset Requests setup done")
    })
    .catch((error) => {
        console.error("There was an error setting up the database: ", error)
    })

module.exports = knex
