'use strict';

var bookshelf = require('../bookshelf');
var passport = require('passport');
var channel = require('../channel');
var uuid = require('uuid');

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
            email: attrs.email,
            picture: attrs.picture,
            role: attrs.role,
            introduced: Boolean(attrs.introduced),
            provider: attrs.provider,
            foreign_id: attrs.foreign_id,
            created_at: new Date(attrs.created_at),
            updated_at: new Date(attrs.updated_at)
        };
    },

    like: function(notification) {
        return this.liked().attach(notification).then(function() {
            console.log(notification.id);
            channel.send({
                data: {
                    type: 'NOTIFY_LIKED_ITEM',
                    payload: {
                        itemId: notification.id,
                        userId: this.id
                    }
                }
            });
            return notification
        }.bind(this)).catch(function(err) {
            if (/constraint failed/i.test(err.message)) {
                return notification;
            } else {
                throw err;
            }
        });
    },

    liked: function() {
        return this.belongsToMany(Notification, 'notification_likes');
    }
}, {
    TempTwitterProfile: bookshelf.Model.extend(),

    create: function(attrs, opts) {
        return new User(attrs, opts).save().tap(function(user) {
            return user.tasks().create({
                title: 'Writing the next great American novel'
            });
        });
    },

    fetchById: function(id) {
        return User.queryById(id).fetch({require: true});
    },

    queryById: function(id) {
        return User.where({id: id});
    },

    fetchByGoogleId: function(googleId) {
        return User.where({
            provider: 'google',
            foreign_id: googleId
        }).fetch({require: true});
    },

    fetchByTwitterId: function(twitterId) {
        return User.where({
            provider: 'twitter',
            foreign_id: twitterId
        }).fetch({require: true});
    },

    publicInfo: {
        user: function(qb) {
            qb.column('id', 'full_name', 'picture', 'created_at', 'updated_at');
        }
    }

});

passport.serializeUser(function(user, done) {
    if (user instanceof User.TempTwitterProfile) {
        done(null, user.toJSON());
    } else {
        done(null, user.id);
    }
});

passport.deserializeUser(function(userId, done) {
    if (typeof userId === 'string') {
        return new User({id: userId}).fetch({require: true}).then(function(user) {
            done(null, user);
        }).catch(done);
    } else {
        done(null, new User.TempTwitterProfile(userId));
    }
});

// because node
var Task = require('./task');
var Notification = require('./notification');
