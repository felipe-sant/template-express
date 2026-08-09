import express, { Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import requestLoggerMiddleware from "./middleware/requestLogger.middleware"
import errorHandler from "./middleware/errorHandler.middleware"
import testRoutes from "./routes/__test__.routes"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN ?? "").split(",").filter((origin) => origin !== "")

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use(requestLoggerMiddleware)

app.use("/api/test", testRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

app.use(errorHandler)

export default app
