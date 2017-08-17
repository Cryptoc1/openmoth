import { HttpError } from '../errors'

export default (req, res, next) => {
  res.error = (code = 500) => res.status(code).json(new HttpError(code))
  return next()
}
