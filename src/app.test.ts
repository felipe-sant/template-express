import request from "supertest"
import { describe, it, expect } from "vitest"
import app from "./app"

describe("catch-all de rota não mapeada", () => {
    it("retorna 404 com o envelope de erro { error: { code: NOT_FOUND } }", async () => {
        const response = await request(app).get("/rota-inexistente")

        expect(response.status).toBe(404)
        expect(response.body).toMatchObject({ error: { code: "NOT_FOUND" } })
    })
})
