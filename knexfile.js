'use strict';

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: 'local.db'
        }
    },

    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        }
    },

    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
        pool: {
            min: 1,
            max: 1
        }
    }
};
