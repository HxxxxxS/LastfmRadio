const request = require('request');

module.exports = function(app) {
    this._request = (user, type) => {

    }
    this.getTracks = (req, res) => {
        request(`https://www.last.fm/player/station/user/${req.params.user}/${req.params.type}`, function(err, resp, body){
            if (err) throw(err);

            if (resp && resp.statusCode == 200) {

                var json = JSON.parse(body);

                var list = [];

                for (var i = json.playlist.length - 1; i >= 0; i--) {
                    for (var j = json.playlist[i].playlinks.length - 1; j >= 0; j--) {
                        if (json.playlist[i].playlinks[j].affiliate == 'youtube') {
                            list.push(json.playlist[i].playlinks[j].id);
                        }
                    }
                }

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(list));
            } else {
                console.log(resp.statusCode && resp.statusMessage)
                res.send('Error, most likely invalid username')
            }
        });
    }
}
