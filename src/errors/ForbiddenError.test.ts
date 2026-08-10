import { describe, it, expect } from "vitest"
import ForbiddenError from "./ForbiddenError"

describe("ForbiddenError", () => {
    it("define statusCode 403 e code FORBIDDEN", () => {
        const error = new ForbiddenError("access denied")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(403)
        expect(error.code).toBe("FORBIDDEN")
        expect(error.message).toBe("access denied")
    })
})
