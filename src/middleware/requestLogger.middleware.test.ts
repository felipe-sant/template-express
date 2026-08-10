import { EventEmitter } from "node:events"
import { Request, Response, NextFunction } from "express"
import { describe, it, expect, vi } from "vitest"
import requestLoggerMiddleware from "./requestLogger.middleware"

function makeReq(): Request {
    return {
        method: "GET",
        originalUrl: "/api/preview",
        headers: { "user-agent": "vitest" },
        ip: "127.0.0.1",
    } as unknown as Request
}

function makeRes(): Response & EventEmitter {
    const res = new EventEmitter() as Response & EventEmitter
    Object.assign(res, { statusCode: 200 })
    return res
}

describe("requestLoggerMiddleware", () => {
    it("chama next imediatamente", () => {
        const req = makeReq()
        const res = makeRes()
        const next = vi.fn() as NextFunction

        requestLoggerMiddleware(req, res, next)

        expect(next).toHaveBeenCalledTimes(1)
    })

    it("registra a linha de log quando a resposta termina (evento finish)", async () => {
        const req = makeReq()
        const res = makeRes()
        const next = vi.fn() as NextFunction

        requestLoggerMiddleware(req, res, next)
        res.emit("finish")

        await new Promise((resolve) => setImmediate(resolve))

        expect(next).toHaveBeenCalledTimes(1)
    })
})
