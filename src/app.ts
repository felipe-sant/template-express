import express from 'express'
import cors from 'cors'
import exampleRoutes from './routes/Example.routes'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => { res.redirect('/docs/routes.html')})
app.use('/api', exampleRoutes)
app.use('/docs', express.static(path.join(__dirname, "../public")))

export default app