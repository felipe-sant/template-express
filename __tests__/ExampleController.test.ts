import request from "supertest"
import app from "../src/app"

describe("Testando rotas http://0.0.0.0:0000/api/example", () => {
    it("GET '/example' - Deve retornar 200.", async () => {
        const res = await request(app).get("/api/example")
        expect(res.status).toBe(200)
    })

    it("POST '/example/post' - Deve retornar 201.", async () => {
        const body = { name: "user_test", example: "test1" }
        const res = await request(app).post("/api/example/post").send(body)
        expect(res.status).toBe(201)
    })

    it("GET '/example/get' - Deve retornar 200.", async () => {
        const query = { amount: 10 }
        const res = await request(app).get("/api/example/get").query(query)
        expect(res.status).toBe(200)
    })

    it("GET '/example/get/:id' - Deve retornar 200.", async () => {
        const id = 1
        const res = await request(app).get("/api/example/get/" + id)
        expect(res.status).toBe(200)
    })

    it("PUT '/example/put/:id' - Deve retornar 200.", async () => {
        const id = 1
        const body = { name: "test_user", example: "test2" }
        const res = await request(app).put("/api/example/put/" + id).send(body)
        expect(res.status).toBe(200)
    })

    it("PATCH '/example/patch/:id' - Deve retornar 200.", async () => {
        const id = 1
        const body = { exaple: "test3" }
        const res = await request(app).patch("/api/example/patch/" + id).send(body)
        expect(res.status).toBe(200)
    })

    it("DELETE '/example/delete/:id' - Deve retornar 204.", async () => {
        const id = 1
        const res = await request(app).delete("/api/example/delete/" + id)
        expect(res.status).toBe(204)
    })
})