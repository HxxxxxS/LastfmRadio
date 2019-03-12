// config/passport.ts

// load all the things we need
var LastFmStrategy = require('passport-lastfm')

// expose this function to our app using module.exports
module.exports = function(passport, lastfmConfig, port) {
    passport.use(new LastFmStrategy({
        'api_key': lastfmConfig.api_key,
        'secret': lastfmConfig.secret,
        'callbackURL': 'http://localhost:' + port + '/auth/lastfm/callback'
    }, function(req, sessionKey, done) {
        // Find/Update user's lastfm session
        console.log(sessionKey);
        if(!req.session.lastfm) req.session.lastfm = sessionKey;
        return done(false, sessionKey);
        // If user logged in
        /*if (req.session.lastfm) {
            if (req.session.lastfm.creds)
            User.findById(req.user.id, (err, user) => {
                if (err) return done(err);

                var creds = _.find(req.user.tokens, {type:'lastfm'});
                // if creds already present
                if (user.lastfm && creds){
                    req.flash('info', {msg:'Account already linked'});

                    return done(err, user, {msg:'Account already linked'})
                }

                else{
                    user.tokens.push({type:'lastfm', username:sessionKey.username, key:sessionKey.key });
                    user.lastfm = sessionKey.key;

                    user.save(function(err){
                        if (err) return done(err);
                        req.flash('success', {msg:"Last.fm authentication success"});
                        return done(err, user, sessionKey);
                    });
                }
            });
        }
        else{
            return done(null, false, {message:'Must be logged in'});
        }*/
    }));
};
