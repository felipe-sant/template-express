import { describe, it, expect } from "vitest"
import InternalServerError from "./InternalServerError"

describe("InternalServerError", () => {
    it("define statusCode 500 e code INTERNAL_SERVER_ERROR", () => {
        const error = new InternalServerError("unexpected failure")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(500)
        expect(error.code).toBe("INTERNAL_SERVER_ERROR")
        expect(error.message).toBe("unexpected failure")
    })
})
