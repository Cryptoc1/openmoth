var express = require('express'),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    request = require('request'),
    Twitter = require('twitter'),
    fs = require('fs')

var app = express()

// var dotenv = require('dotenv').config()

var twit = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'))

app.engine('handlebars', handlebars({
    defaultLayout: 'default'
}))
app.set('view engine', 'handlebars')

app.get('/', function(req, res) {
    res.render('index')
})

app.post('/', function(req, res) {
    // This is a bloody fucking mess
    if (req.body.status) {
        if (req.body.status.length > 140) {
            res.render('index', {
                status: false,
                error: "Tweet must be less than 140 characters"
            })
        } else {
            var recaptchaURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RECAPTCHA_SECRET + "&response=" + req.body['g-recaptcha-response'] + "&remote=" + req.connection.remoteAddress
            request.post(recaptchaURL, function(error, response, body) {
                body = JSON.parse(body)
                if (body.success) {
                    twit.post('/statuses/update', {
                        status: req.body.status
                    }, function(err, tweet, response) {
                        if (err) {
                            res.render('index', {
                                success: false,
                                error: err[0].message
                            })
                            console.log(err)
                        } else {
                            logRequest(tweet.id, req.connection.remoteAddress)
                            res.render('index', {
                                success: true
                            })
                        }
                    })
                } else {
                    res.render('index', {
                        success: false,
                        error: "Unable to verify reCaptcha"
                    })
                }
            })
        }
    } else {
        res.render('index', {
            success: false,
            error: "Must provide status content"
        })
    }
})



function logRequest(tweetID, IP) {
    var str = Math.floor(new Date().getTime() / 1000) + ": [" + tweetID + ", \"" + "AN IP ADDRESS" + "\"]"
    fs.appendFile("tweets.log", str, function(err) {
        console.error(err)
    })
}

var server = app.listen(process.env.PORT || 5000, function() {
    console.log("Server running at http://0.0.0.0:%d", server.address().port)
    twit.stream('user', function(stream) {
        stream.on('follow', function(follow) {
            if (follow.source.screen_name.toLowerCase() != "openmoth") {
                twit.post('/friendships/create', {
                    screen_name: follow.source.screen_name,
                    follow: true
                }, function(err, res) {
                    if (err)
                        console.error(err)
                })
            }
        })
    })
})
