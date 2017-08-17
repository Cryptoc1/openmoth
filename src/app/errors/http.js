const HTTP_MESSAGE = {
  404: 'Not Found Error',
  500: 'Internal Server Error'
}

class HttpError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    if (message == null || message === undefined) this.message = HttpError.getMessage(code)
  }

  static getMessage (code = 500) {
    return HTTP_MESSAGE[code]
  }
}

export default HttpError
