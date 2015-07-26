'use strict';

var Channel = require('sse-channel');

var channel = module.exports = new Channel({
    jsonEncode: true,
    cors: {
        origins: ['*'],
        credentials: true
    }
});
