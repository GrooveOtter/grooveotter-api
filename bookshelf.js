'use strict';

var knex = require('knex')(require('./knexfile')[process.env.NODE_ENV]);

var bookshelf = module.exports = require('bookshelf')(knex);
