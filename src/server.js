import { } from 'dotenv/config'
import app from './app'
import * as Contants from './constants'

const server = app.listen(process.env.PORT || Contants.PORT || 1337, () => console.log(`Running on port ${server.address().port}`))

export default server
