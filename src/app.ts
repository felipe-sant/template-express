import express, { Request, Response } from 'express'
import cors from 'cors'
import requestLoggerMiddleware from './middleware/requestLogger.middleware'
import testRoutes from './routes/__test__.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLoggerMiddleware)

app.use("/api/test", testRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app