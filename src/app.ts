import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app