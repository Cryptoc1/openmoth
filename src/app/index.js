import bodyParser from 'body-parser'
import { DEBUG } from '../constants'
import { dingo, error } from './middleware'
import express from 'express'
import handlebars from 'express-handlebars'
import routes from './routes'
import shrink from 'shrink-ray'
// import { twitterService } from './services'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(dingo)
app.use(error)
app.use(shrink())

app.use(express.static('./src/app/public'))

app.set('views', './src/app/views')
app.engine('handlebars', handlebars({
  defaultLayout: 'default',
  layoutsDir: './src/app/views/layouts'
}))
app.set('view engine', 'handlebars')

app.use((err, req, res, next) => {
  if (err.code !== undefined) res.error(err.code)
  else res.error(500)
})

// log requests in debug mode
if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`Hit: ${req.originalUrl}`)
    return next()
  })
}

// import routes
app.use(routes)

/* twitterService.stream('user', stream => {
  stream.on('follow', )
}) */

export default app
