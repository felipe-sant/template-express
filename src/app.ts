import express, { Request, Response } from 'express'
import cors from 'cors'
import requestLoggerMiddleware from './middleware/requestLogger.middleware'
import testRoutes from './routes/__test__.routes'
import dotenv from "dotenv"

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .filter((origin) => origin !== "")

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use(requestLoggerMiddleware)

app.use("/api/test", testRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app