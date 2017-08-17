import Service from './service'
import Twitter from 'twitter'

class TwitterService extends Service {
  constructor () {
    super()

    this.twit = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })

    this.stream = this.twit.stream.bind(this.twit)
  }

  updateStatus (status) {
    return new Promise((resolve, reject) => {
      this.twit.post('/statuses/update', { status: status }, (err, tweet, response) => {
        if (err) return reject(err[0])
        return resolve(tweet)
      })
    })
  }
}

export default TwitterService
