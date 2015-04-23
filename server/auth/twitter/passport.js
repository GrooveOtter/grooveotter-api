exports.setup = function (User, config) {
  var passport = require('passport');
  var TwitterStrategy = require('passport-twitter').Strategy;
  var storage = require('node-persist');

  passport.use(new TwitterStrategy({
    consumerKey: 'o4Vg5Q4D8iZ6RsBssEQf1MYwB',
    consumerSecret: 'K9EB32wURCbYElXtvpKP8usqrtJ4hoPhrv7fVcK5HrCn11db3w',
    callbackURL: 'http://localhost:9000/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'twitter.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'twitter',
          twitter: profile._json
        });
        user.save(function(err) {
          storage.setItem('userId', user._id);
          if (err) return done(err);
          return done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
    }
  ));
};