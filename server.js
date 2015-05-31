'use strict';

var http = require('http');
var app = require('./app');

var server = module.exports = http.createServer(app);

server.listen(process.env.PORT || 9000, function() {
    console.info('Listening...');
});
