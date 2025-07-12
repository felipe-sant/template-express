import express from 'express'
import cors from 'cors'
import exampleRoutes from './routes/Example.routes'
import path from 'path'
import i18next from "./config/i18n.config"
import i18nextMiddleware from "i18next-http-middleware"

const app = express()

app.use(cors())
app.use(express.json())
app.use(i18nextMiddleware.handle(i18next))

app.get('/', (_, res) => { res.redirect('/docs/routes.html')})
app.use('/api', exampleRoutes)
app.use('/docs', express.static(path.join(__dirname, "../__docs__")))

export default app