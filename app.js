'use strict';

var bookshelf = require('./bookshelf');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');
var auth = require('./auth');
var api = require('./api');

var KnexStore = require('connect-session-knex')(session);

var app = module.exports = express();

app.set('trust proxy', 1);

// heroku already logs every incoming request
// we don't want log messages during tests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));
app.use(session({
    store: new KnexStore({knex: bookshelf.knex, tablename: 'user_sessions'}),
    secret: process.env.SECRET,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', auth);
app.use('/api', api);

if (process.env.NODE_ENV !== 'test') {
    app.use(function(err, req, res, next) {
        console.error(err.stack);

        if (req.user && req.user.isAdmin()) {
            res.status(500).send(err.stack);
        } else {
            res.sendStatus(500);
        }
    });
} else {
    app.use(function(err, req, res, next) {
        process.nextTick(function() {
            throw err;
        });
    });
}

app.use(function(req, res) {
    res.sendStatus(404);
});
