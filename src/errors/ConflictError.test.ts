import { describe, it, expect } from "vitest"
import ConflictError from "./ConflictError"

describe("ConflictError", () => {
    it("define statusCode 409 e code CONFLICT", () => {
        const error = new ConflictError("resource already exists")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(409)
        expect(error.code).toBe("CONFLICT")
        expect(error.message).toBe("resource already exists")
    })
})
