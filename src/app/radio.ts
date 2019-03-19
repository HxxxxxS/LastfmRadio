const request = require('request');

module.exports = function(app, config) {

    this.config = config;

    this.getTracks = (req, res) => {
        request(`https://www.last.fm/player/station/user/${req.params.user}/${req.params.type}`, (err, resp, body) => {
            if (err) throw(err);

            if (resp && resp.statusCode == 200) {

                let json = JSON.parse(body);

                let list = [],
                item;

                for (let i = json.playlist.length - 1; i >= 0; i--) {
                    item = {
                        track: json.playlist[i].name,
                        track_url: json.playlist[i].url,
                        artist: json.playlist[i].artists[0].name,
                        artist_url: json.playlist[i].artists[0].url
                    }
                    for (let j = json.playlist[i].playlinks.length - 1; j >= 0; j--) {
                        if (json.playlist[i].playlinks[j].affiliate == 'youtube') {
                            item.youtube = json.playlist[i].playlinks[j].id;
                        }
                    }
                    list.push(item);
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(list));
            } else {
                console.log(resp.statusCode && resp.statusMessage)
                res.send('Error, most likely invalid username')
            }
        });
    }

    this.trackInfo = (req, res) => {
        let params = req.params;

        params.method = 'track.getInfo';
        params.api_key = this.config.api_key;
        params.format = 'json';

        request({url: 'http://ws.audioscrobbler.com/2.0/', qs: params}, (err, resp, body) => {
            if (err) throw(err);

            if (resp && resp.statusCode == 200) {
                res.setHeader('Content-Type', 'application/json');
                res.end(body);
            }
        });
    }

}
