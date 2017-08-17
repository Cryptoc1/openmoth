import request from 'request'
import Service from './service'

// "&response=" + req.body['g-recaptcha-response'] + "&remote=" + req.connection.remoteAddress

class ReCaptchaService extends Service {
  verify (response, ipAddress = null) {
    return new Promise((resolve, reject) => {
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${response}${ipAddress != null ? `&remote=${ipAddress}` : ''}`
      request.post(url, (err, res, body) => {
        if (err) return reject(err)

        body = JSON.parse(body)
        if (body.success === true) return resolve(true)
        else return resolve(false)

        reject(body['invalid-error-codes'])
      })
    })
  }
}

export default ReCaptchaService
