import { Request, Response, NextFunction } from "express"
import request from "supertest"
import { describe, it, expect, vi } from "vitest"
import app from "../app"
import PreviewController from "../controllers/preview.controller"
import PreviewService from "../services/preview.service"

function makeRes(): Response {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        sendStatus: vi.fn(),
    } as unknown as Response
}

describe("POST /api/preview", () => {
    it("retorna 400 quando o body está ausente", async () => {
        const response = await request(app).post("/api/preview").send()

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ error: { code: "BAD_REQUEST" } })
    })

    it("retorna 400 quando o body está vazio", async () => {
        const response = await request(app).post("/api/preview").send({})

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ error: { code: "BAD_REQUEST" } })
    })

    it("retorna 201 com o envelope { data } quando o body é válido", async () => {
        const response = await request(app).post("/api/preview").send({ foo: "bar" })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({ data: { message: "Resource created successfully!" } })
    })
})

describe("GET /api/preview", () => {
    it("retorna 200 com o envelope { data }", async () => {
        const response = await request(app).get("/api/preview")

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            data: { message: "Retrieved resources successfully!" },
        })
    })
})

describe("GET /api/preview/:id", () => {
    it("retorna 200 com o envelope { data } quando o id é válido", async () => {
        const response = await request(app).get("/api/preview/1")

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            data: { message: "Retrieved resource with ID 1 successfully!" },
        })
    })

    it("chama next com BadRequestError quando o id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.readOne(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })
})

describe("PUT /api/preview/:id", () => {
    it("retorna 200 com o envelope { data } quando id e body são válidos", async () => {
        const response = await request(app).put("/api/preview/1").send({ foo: "bar" })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            data: { message: "Updated resource with ID 1 successfully!" },
        })
    })

    it("retorna 400 quando o body está ausente com id válido", async () => {
        const response = await request(app).put("/api/preview/1").send()

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ error: { code: "BAD_REQUEST" } })
    })

    it("chama next com BadRequestError quando o id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.update(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })
})

describe("PATCH /api/preview/:id", () => {
    it("retorna 200 com o envelope { data } quando id e body são válidos", async () => {
        const response = await request(app).patch("/api/preview/1").send({ foo: "bar" })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            data: { message: "Patched resource with ID 1 successfully!" },
        })
    })

    it("retorna 400 quando o body está ausente com id válido", async () => {
        const response = await request(app).patch("/api/preview/1").send()

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ error: { code: "BAD_REQUEST" } })
    })

    it("chama next com BadRequestError quando o id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {}, body: { foo: "bar" } } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.patch(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })
})

describe("DELETE /api/preview/:id", () => {
    it("retorna 204 sem corpo quando o id é válido", async () => {
        const response = await request(app).delete("/api/preview/1")

        expect(response.status).toBe(204)
        expect(response.text).toBe("")
    })

    it("chama next com BadRequestError quando o id está ausente", async () => {
        const controller = new PreviewController()
        const req = { params: {}, query: {} } as unknown as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await controller.delete(req, res, next)

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400, code: "BAD_REQUEST" }),
        )
    })
})

describe("PreviewController.healthCheck", () => {
    it("retorna 200 com o envelope { data } quando o serviço está disponível", async () => {
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
})
