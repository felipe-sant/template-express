import express from 'express'
import cors from 'cors'
import exampleRoutes from './routes/Example.routes'
import path from 'path'
import i18next from "./configs/i18n.config"
import i18nextMiddleware from "i18next-http-middleware"
import requestLogger from './middlewares/requestLogger.middleware'

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(i18nextMiddleware.handle(i18next))

app.get('/', (_, res) => { res.redirect('/docs/routes.html')})
app.use('/api', exampleRoutes)
app.use('/docs', express.static(path.join(__dirname, "../__docs__")))

export default app