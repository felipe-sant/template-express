import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "../app"

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
})

describe("DELETE /api/preview/:id", () => {
    it("retorna 204 sem corpo quando o id é válido", async () => {
        const response = await request(app).delete("/api/preview/1")

        expect(response.status).toBe(204)
        expect(response.text).toBe("")
    })
})
