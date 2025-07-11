import request from "supertest"
import app from "../src/app"

describe("Testando rotas http://0.0.0.0:0000/api/example", () => {
    it("GET '/example' - Deve retornar 200.", async () => {
        const res = await request(app).get("/api/example")
        expect(res.status).toBe(200)
    })

    it("POST '/example/post' - Deve retornar 201.", async () => {
        const query = { test: true }
        const body = { name: "user_test", userType: "admin" }
        const res = await request(app).post("/api/example/post").query(query).send(body)
        expect(res.status).toBe(201)
    })

    it("GET '/example/get' - Deve retornar 200.", async () => {
        const query = { userType: "test" }
        const res = await request(app).get("/api/example/get").query(query)
        expect(res.status).toBe(200)
    })

    it("GET '/example/get/:id' - Deve retornar 200.", async () => {
        const id = 1
        const query = { userType: "test" }
        const res = await request(app).get("/api/example/get/" + id).query(query)
        expect(res.status).toBe(200)
    })

    it("PUT '/example/put/:id' - Deve retornar 200.", async () => {
        const id = 1
        const query = { userType: "test" }
        const body = { name: "test_user", userType: "developer" }
        const res = await request(app).put("/api/example/put/" + id).query(query).send(body)
        expect(res.status).toBe(200)
    })

    it("PATCH '/example/patch/:id' - Deve retornar 200.", async () => {
        const id = 1
        const query = { userType: "test" }
        const body = { name: "user_test" }
        const res = await request(app).patch("/api/example/patch/" + id).query(query).send(body)
        expect(res.status).toBe(200)
    })

    it("DELETE '/example/delete/:id' - Deve retornar 200.", async () => {
        const id = 1
        const query = { userType: "test" }
        const res = await request(app).delete("/api/example/delete/" + id).query(query)
        expect(res.status).toBe(200)
    })
})