import { describe, it, expect } from "vitest"
import BadRequestError from "./BadRequestError"

describe("BadRequestError", () => {
    it("define statusCode 400 e code BAD_REQUEST", () => {
        const error = new BadRequestError("id is required!")

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(400)
        expect(error.code).toBe("BAD_REQUEST")
        expect(error.message).toBe("id is required!")
    })
})
