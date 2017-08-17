import app from './app'
import * as Contants from './constants'

if (process.argv.find(arg => arg === '--debug') !== undefined) require('dotenv').config()

app.on('*', (req, res, next) => {
  console.log(req.originalUrl)
  return next()
})

const server = app.listen(process.env.PORT || Contants.PORT || 1337, () => console.log(`Running on port ${server.address().port}`))

export default server
