import Service from './service'
import ReCaptchaService from './recaptcha'
import TwitterService from './twitter'

export const reCaptchaService = new ReCaptchaService()

export const twitterService = new TwitterService()

export { TwitterService }

export default Service
