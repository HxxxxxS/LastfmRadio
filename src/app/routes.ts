const LastfmAPI = require('lastfmapi');

module.exports = function(app, passport, lastfm) {
    app.get('/', function(req, res) {
        res.render('index.ejs', { user: req.session.lastfm });
    });

    app.get('/radio/:user/:type', function(req, res){
        lastfm.getTracks(req, res);
    });

    app.get('/radio/trackinfo/(:user/)?:artist/:track', function(req, res){
        lastfm.trackInfo(req, res);
    });

    app.get('/radio/scrobble/:artist/:track/:done', function(req, res){
        if(!req.session.lastfm) throw('Not authenticated');

        let lfm = new LastfmAPI(lastfm.config);
        lfm.setSessionCredentials(req.session.lastfm.name, req.session.lastfm.key);

        let data = {
            'artist': decodeURIComponent(req.params.artist),
            'track': decodeURIComponent(req.params.track),
            'timestamp' : Math.floor((new Date()).getTime() / 1000) - (req.params.done == '1' ? 300 : 0)
        }
        let done = function (err, scrobbles) {
            if (err) { return console.log('We\'re in trouble', err); }
            res.end(JSON.stringify(scrobbles));
        }

        if (req.params.done == '1')
            lfm.track.scrobble(data, done);
        else
            lfm.track.updateNowPlaying(data, done);
    });

    app.get('/radio/love/:artist/:track', function(req, res){
        if(!req.session.lastfm) throw('Not authenticated');

        let lfm = new LastfmAPI(lastfm.config);
        lfm.setSessionCredentials(req.session.lastfm.name, req.session.lastfm.key);

        let data = {
            'artist': decodeURIComponent(req.params.artist),
            'track': decodeURIComponent(req.params.track),
            'timestamp' : Math.floor((new Date()).getTime() / 1000)
        }

        lfm.track.love(data, function (err, scrobbles) {
            if (err) { return console.log('We\'re in trouble', err); }
            res.end(JSON.stringify(scrobbles));
        });
    });

    app.get('/auth/lastfm', passport.authenticate('lastfm'));

    app.get('/auth/lastfm/callback', function(req, res, next){
      passport.authenticate('lastfm', {failureRedirect:'/'}, function(err, sesh){
        res.redirect('/');
      })(req, {} );
    });
}
