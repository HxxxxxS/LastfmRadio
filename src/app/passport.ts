// config/passport.ts

// load all the things we need
var LastFmStrategy = require('passport-lastfm')

// expose this function to our app using module.exports
module.exports = function(passport, lastfmConfig, port) {
    passport.use(new LastFmStrategy({
        'api_key': lastfmConfig.api_key,
        'secret': lastfmConfig.secret,
        'callbackURL': 'https://localhost:' + port + '/auth/lastfm/callback'
    }, function(req, sessionKey, done) {
        if(!req.session.lastfm) req.session.lastfm = sessionKey;
        return done(false, sessionKey);
    }));
};
