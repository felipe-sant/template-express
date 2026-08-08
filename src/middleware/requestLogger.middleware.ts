import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import appendFile from "../utils/appendFile";

async function createLogger(log: {date: string, method: string, url: string, status: number, duration: string, ip: string | undefined, userAgent: string | undefined, requestId: string}) {
    const path = "request.log"
    const content = JSON.stringify(log) + "\n"
    appendFile(path, content)
}

function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const requestId = randomUUID();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const now = new Date()
        const log = {
            date: now.toLocaleString("pt-br"),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            requestId
        }
        createLogger(log)
    });

    next();
}

export default requestLoggerMiddleware
