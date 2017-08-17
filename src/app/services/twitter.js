import Service from './service'
import twit from 'twitter'

class TwitterService extends Service {
  updateStatus (status) {
    return new Promise((resolve, reject) => {
      twit.post('/statuses/update', { status: status }, (err, tweet, response) => {
        if (err) return reject(err[0])
      })
    })
  }
}

export default TwitterService
