import { describe, it, expect } from "vitest"
import PreviewService from "./preview.service"

describe("PreviewService", () => {
    const service = new PreviewService()

    describe("create", () => {
        it("retorna a mensagem de criação com o body e a query recebidos", () => {
            const result = service.create({ foo: "bar" }, { page: "1" })

            expect(result).toEqual({
                message: "Resource created successfully!",
                query: { page: "1" },
                body: { foo: "bar" },
            })
        })

        it("retorna query undefined quando nenhuma query é passada", () => {
            const result = service.create({ foo: "bar" })

            expect(result.query).toBeUndefined()
        })
    })

    describe("read", () => {
        it("retorna a mensagem de listagem com a query recebida", () => {
            const result = service.read({ page: "1" })

            expect(result).toEqual({
                message: "Retrieved resources successfully!",
                query: { page: "1" },
            })
        })
    })

    describe("readOne", () => {
        it("retorna a mensagem com o id recebido", () => {
            const result = service.readOne("1", { page: "1" })

            expect(result).toEqual({
                message: "Retrieved resource with ID 1 successfully!",
                query: { page: "1" },
            })
        })
    })

    describe("update", () => {
        it("retorna a mensagem de atualização com id, body e query recebidos", () => {
            const result = service.update("1", { foo: "bar" }, { page: "1" })

            expect(result).toEqual({
                message: "Updated resource with ID 1 successfully!",
                query: { page: "1" },
                body: { foo: "bar" },
            })
        })
    })

    describe("patch", () => {
        it("retorna a mensagem de patch com id, body e query recebidos", () => {
            const result = service.patch("1", { foo: "bar" }, { page: "1" })

            expect(result).toEqual({
                message: "Patched resource with ID 1 successfully!",
                query: { page: "1" },
                body: { foo: "bar" },
            })
        })
    })

    describe("delete", () => {
        it("retorna a mensagem de remoção com o id recebido", () => {
            const result = service.delete("1", { page: "1" })

            expect(result).toEqual({
                message: "Deleted resource with ID 1 successfully!",
                query: { page: "1" },
            })
        })
    })

    describe("healthCheck", () => {
        it("retorna true", () => {
            expect(service.healthCheck()).toBe(true)
        })
    })
})
