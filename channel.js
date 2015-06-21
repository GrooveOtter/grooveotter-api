'use strict';

var Channel = require('sse-channel');

var channel = module.exports = new Channel({
    jsonEncode: true,
    cors: {
        origins: ['https://grooveotter-demo.herokuapp.com', 'http://localhost', 'http://localhost:8000']
    }
});
