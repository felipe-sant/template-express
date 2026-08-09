import { Request, Response, NextFunction } from "express"
import { describe, it, expect, vi } from "vitest"
import errorHandler from "./errorHandler.middleware"
import NotFoundError from "../errors/NotFoundError"

function makeRes(headersSent: boolean): Response {
    return {
        headersSent,
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as unknown as Response
}

describe("errorHandler", () => {
    it("delega ao error handler padrão do Express quando os headers já foram enviados", () => {
        const res = makeRes(true)
        const next = vi.fn() as NextFunction
        const err = new Error("boom")

        errorHandler(err, {} as Request, res, next)

        expect(next).toHaveBeenCalledWith(err)
        expect(res.status).not.toHaveBeenCalled()
    })

    it("responde com statusCode/code do AppError quando o erro é conhecido", () => {
        const res = makeRes(false)
        const next = vi.fn() as NextFunction
        const err = new NotFoundError("not found")

        errorHandler(err, {} as Request, res, next)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            error: { code: "NOT_FOUND", message: "not found" },
        })
    })

    it("responde 500 genérico quando o erro não é um AppError", () => {
        const res = makeRes(false)
        const next = vi.fn() as NextFunction
        const err = new Error("boom")
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined)

        errorHandler(err, {} as Request, res, next)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            error: { code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
        })

        consoleSpy.mockRestore()
    })
})
