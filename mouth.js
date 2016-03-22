var express = require('express'),
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    request = require('request'),
    Twitter = require('twitter')

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
    if (req.body.status) {
        var recaptchaURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RECAPTCHA_SECRET + "&response=" + req.body['g-recaptcha-response'] + "&remote=" + req.connection.remoteAddress
        console.log(recaptchaURL)
        request.post(recaptchaURL, function(err, response, body) {
            console.log(response)
            console.log(body)
            if (response.success) {
                twit.post('/statuses/update', {
                    status: req.body.status
                }, function(err, tweet, response) {
                    if (err) {
                        res.render('index', {
                            success: false,
                            error: err[0]
                        })
                        console.log(err)
                    } else {
                        res.render('index', {
                            success: true
                        })
                    }
                })
            } else {
                res.render('index', {
                    success: false,
                    error: "Internal Server Error"
                })
            }
        })
    } else {
        res.render('index', {
            success: false,
            error: "Internal Server Error"
        })
    }
})


var server = app.listen(process.env.PORT || 5000, function() {
    console.log("Server running at http://0.0.0.0:%d", server.address().port)
})
