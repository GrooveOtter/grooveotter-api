/* global describe, it */

'use strict';

var assert = require('assert');
var request = require('supertest');
var app = require('../app');

describe('api', function() {
    it('works', function(done) {
        request(app)
            .get('/api/users')
            .expect(401, 'Unauthorized', done);
    });
});
