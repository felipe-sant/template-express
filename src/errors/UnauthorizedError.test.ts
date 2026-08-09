import { describe, it, expect } from "vitest"
import UnauthorizedError from "./UnauthorizedError"

describe("UnauthorizedError", () => {
    it("define statusCode 401 e code UNAUTHORIZED", () => {
        const error = new UnauthorizedError("missing credentials")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(401)
        expect(error.code).toBe("UNAUTHORIZED")
        expect(error.message).toBe("missing credentials")
    })
})
