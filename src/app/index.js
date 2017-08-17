import bodyParser from 'body-parser'
import express from 'express'
import handlebars from 'express-handlebars'
// import routes from './routes'
import shrink from 'shrink-ray'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(shrink())

app.use(express.static('./src/app/public'))

app.set('views', './src/app/views')
app.engine('handlebars', handlebars({
  defaultLayout: 'default',
  layoutsDir: './src/app/views/layouts'
}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => res.render('index'))

export default app
