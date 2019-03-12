module.exports = function(app, passport, radio) {
    app.get('/', function(req, res) {
        res.render('index.ejs', { user: req.session.lastfm });
    });

    app.get('/radio/:user/:type', function(req, res){
        radio.getTracks(req, res);
    });

    app.get('/auth/lastfm', passport.authenticate('lastfm'));

    app.get('/auth/lastfm/callback', function(req, res, next){
      passport.authenticate('lastfm', {failureRedirect:'/'}, function(err, sesh){
        res.redirect('/');
      })(req, {} );
    });
}
