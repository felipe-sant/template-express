import { describe, it, expect } from "vitest"
import NotFoundError from "./NotFoundError"

describe("NotFoundError", () => {
    it("define statusCode 404 e code NOT_FOUND", () => {
        const error = new NotFoundError("Route not found")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(404)
        expect(error.code).toBe("NOT_FOUND")
        expect(error.message).toBe("Route not found")
    })
})
