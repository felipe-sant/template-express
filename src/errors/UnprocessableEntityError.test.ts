import { describe, it, expect } from "vitest"
import UnprocessableEntityError from "./UnprocessableEntityError"

describe("UnprocessableEntityError", () => {
    it("define statusCode 422 e code UNPROCESSABLE_ENTITY", () => {
        const error = new UnprocessableEntityError("invalid semantics")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(422)
        expect(error.code).toBe("UNPROCESSABLE_ENTITY")
        expect(error.message).toBe("invalid semantics")
    })
})
