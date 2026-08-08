import { Request, Response, NextFunction } from "express"
import { randomUUID } from "node:crypto"
import appendFile from "../utils/appendFile"
import { RequestLogEntry } from "../types/requestLog.types"

async function createLogger(log: RequestLogEntry): Promise<void> {
    const path = "request.log"
    const content = JSON.stringify(log) + "\n"
    appendFile(path, content)
}

function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()
    const requestId = randomUUID()

    res.on("finish", () => {
        const duration = Date.now() - start
        const now = new Date()
        const log: RequestLogEntry = {
            date: now.toLocaleString("pt-br"),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            requestId,
        }
        createLogger(log)
    })

    next()
}

export default requestLoggerMiddleware
