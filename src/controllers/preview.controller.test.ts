import { Request, Response, NextFunction } from "express"
import { describe, it, expect, vi, afterEach } from "vitest"
import PreviewController from "./preview.controller"
import PreviewService from "../services/preview.service"

function makeRes(): Response {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn(),
    } as unknown as Response
}

afterEach(() => {
    vi.restoreAllMocks()
})

describe("PreviewController.create", () => {
    it("chama next com BadRequestError quando body está ausente", async () => {
        const controller = new PreviewController()
        const req = { query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("chama next com BadRequestError quando body está vazio", async () => {
        const controller = new PreviewController()
        const req = { query: {}, body: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("responde 201 com o envelope { data } quando body é válido", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "create").mockReturnValueOnce({ message: "ok" })
        const req = { query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.create(req, res, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ data: { message: "ok" } })
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "create").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = { query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.create(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})

describe("PreviewController.read", () => {
    it("responde 200 com o envelope { data }", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "read").mockReturnValueOnce({ message: "ok" })
        const req = { query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.read(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ data: { message: "ok" } })
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "read").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = { query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.read(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})

describe("PreviewController.readOne", () => {
    it("chama next com BadRequestError quando id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.readOne(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("responde 200 com o envelope { data } quando id é válido", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "readOne").mockReturnValueOnce({ message: "ok" })
        const req = { params: { id: "1" }, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.readOne(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ data: { message: "ok" } })
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "readOne").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = { params: { id: "1" }, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.readOne(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})

describe("PreviewController.update", () => {
    it("chama next com BadRequestError quando id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.update(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("chama next com BadRequestError quando body está ausente com id válido", async () => {
        const controller = new PreviewController()
        const req = { params: { id: "1" }, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.update(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("responde 200 com o envelope { data } quando id e body são válidos", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "update").mockReturnValueOnce({ message: "ok" })
        const req = { params: { id: "1" }, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.update(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ data: { message: "ok" } })
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "update").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = { params: { id: "1" }, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.update(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})

describe("PreviewController.patch", () => {
    it("chama next com BadRequestError quando id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.patch(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("chama next com BadRequestError quando body está ausente com id válido", async () => {
        const controller = new PreviewController()
        const req = { params: { id: "1" }, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.patch(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("responde 200 com o envelope { data } quando id e body são válidos", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "patch").mockReturnValueOnce({ message: "ok" })
        const req = { params: { id: "1" }, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.patch(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ data: { message: "ok" } })
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "patch").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = { params: { id: "1" }, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.patch(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})

describe("PreviewController.delete", () => {
    it("chama next com BadRequestError quando id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.delete(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })

    it("responde 204 sem corpo quando id é válido", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "delete").mockReturnValueOnce({ message: "ok" })
        const req = { params: { id: "1" }, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.delete(req, res, next)

        expect(res.sendStatus).toHaveBeenCalledWith(204)
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "delete").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = { params: { id: "1" }, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.delete(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})

describe("PreviewController.healthCheck", () => {
    it("responde 200 com o envelope { data } quando o serviço está disponível", async () => {
        const controller = new PreviewController()
        const req = {} as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.healthCheck(req, res, next)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ data: true })
    })

    it("chama next com AppError 500 quando o serviço está indisponível", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "healthCheck").mockReturnValueOnce(false)
        const req = {} as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.healthCheck(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 500, code: "INTERNAL_SERVER_ERROR" }),
        )
    })

    it("chama next com o erro quando o service lança exceção", async () => {
        const controller = new PreviewController()
        vi.spyOn(PreviewService.prototype, "healthCheck").mockImplementationOnce(() => {
            throw new Error("boom")
        })
        const req = {} as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.healthCheck(req, res, next)

        expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "boom" }))
    })
})
