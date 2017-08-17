import { Router } from 'express'
import { reCaptchaService, twitterService } from '../services'

const router = Router()

router.get('/', (req, res) => res.render('index'))

router.post('/', (req, res) => {
  if (req.body.status != null && req.body.status !== undefined && req.body.status !== '') {
    if (req.body.status.length > 170) {
      return res.render('index', {
        status: false,
        error: 'Tweet must be less than 140 characters'
      })
    }

    reCaptchaService.verify(req.body['g-recaptcha-response'], req.connection.remoteAddress)
      .then(verified => {
        if (verified !== true) {
          return res.render('index', {
            success: false,
            error: 'Unable to verify reCaptcha response'
          })
        }

        twitterService.updateStatus(req.body.status)
          .then(() => res.render('index', {
            success: true
          }))
          .catch(err => res.render('index', {
            success: false,
            error: err.message
          }))
      })
      .catch(() => res.render('index', {
        success: false,
        error: 'Unable to verify reCaptcha response'
      }))
  }

  return res.render('index', {
    success: false,
    error: 'Must provide status content'
  })
})

router.all('*', (req, res) => res.error(404))

export default router
