import AppError from "./AppError"

class UnprocessableEntityError extends AppError {
    constructor(message: string) {
        super(message, 422, "UNPROCESSABLE_ENTITY")
    }
}

export default UnprocessableEntityError
