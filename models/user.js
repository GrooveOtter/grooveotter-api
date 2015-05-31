'use strict';

var bookshelf = require('../bookshelf');
var passport = require('passport');
var uuid = require('uuid');
var Task = require('./task');

var User = module.exports = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,

    defaults: function() {
        return {
            id: uuid.v4()
        };
    },


    tasks: function() {
        return this.hasMany(Task);
    },

    isAdmin: function() {
        return this.get('role') === 'admin';
    },

    parse: function(attrs) {
        return {
            id: attrs.id,
            full_name: attrs.full_name,
            picture: attrs.picture,
            role: attrs.role,
            provider: attrs.provider,
            foreign_id: attrs.foreign_id,
            created_at: new Date(attrs.created_at),
            updated_at: new Date(attrs.updated_at)
        };
    }
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
    new User({id: userId}).fetch({require: true}).then(function(user) {
        done(null, user);
    }).catch(done);
});
