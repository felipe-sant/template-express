import { describe, it, expect } from "vitest"
import AppError from "./AppError"

class TestError extends AppError {
    constructor(message: string) {
        super(message, 418, "TEST_ERROR")
    }
}

describe("AppError", () => {
    it("é declarada abstract — instanciar diretamente é um erro de compilação, não de runtime", () => {
        // @ts-expect-error AppError é abstract; só pode ser instanciada via subclasse
        const error = new AppError("message", 500, "CODE")

        expect(error).toBeInstanceOf(AppError)
    })

    it("armazena message, statusCode e code via uma subclasse concreta", () => {
        const error = new TestError("something went wrong")

        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
        expect(error.message).toBe("something went wrong")
        expect(error.statusCode).toBe(418)
        expect(error.code).toBe("TEST_ERROR")
    })
})
