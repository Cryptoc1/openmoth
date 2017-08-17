import bodyParser from 'body-parser'
import { error } from './middleware'
import express from 'express'
import handlebars from 'express-handlebars'
import routes from './routes'
import shrink from 'shrink-ray'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
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

app.use((req, res, next) => {
  console.log(`Hit: ${req.originalUrl}`)
  return next()
})

// import routes
app.use(routes)

export default app
