var Twitter = require('twitter')

var dotenv = require('dotenv').config()

var twit = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

twit.stream('user', function(stream) {
    stream.on('follow', function(follow) {
        if (follow.source.screen_name.toLowerCase() != "openmoth") {
            twit.post('/friendships/create', {
                screen_name: follow.source.screen_name,
                follow: true
            }, function(err, res) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)
                }
            })
        }
    })
})
