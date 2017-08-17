import { Router } from 'express'
import { reCaptchaService, twitterService } from '../services'

const router = Router()

router.get('/', (req, res) => res.render('index'))

router.post('/', (req, res) => {
  if (req.body.status != null && req.body.status !== undefined && req.body.status !== '') {
    if (req.body.status.length > 140) {
      return res.render('index', {
        status: false,
        error: 'Tweet must be less than 140 characters'
      })
    }

    const address = req.connection.address().address
    reCaptchaService.verify(req.body['g-recaptcha-response'], address)
      .then(verified => {
        if (verified !== true) {
          return res.render('index', {
            success: false,
            error: 'Unable to verify reCaptcha response'
          })
        }

        twitterService.updateStatus(req.body.status)
          .then(tweet => {
            // @TODO: log to Dingo

            res.render('index', {
              success: true
            })
          })
          .catch(err => res.render('index', {
            success: false,
            error: err.message
          }))
      })
      .catch(() => res.render('index', {
        success: false,
        error: 'Unable to verify reCaptcha response'
      }))
  } else {
    res.render('index', {
      success: false,
      error: 'Must provide status content'
    })
  }
})

router.all('*', (req, res) => res.error(404))

export default router
