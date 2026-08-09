import { Request, Response, NextFunction } from "express"
import TestService from "../services/__test__.service"
import { TestResourceBody, TestResourceQuery } from "../types/testResource.types"
import { SuccessResponseBody } from "../types/successResponse.types"
import BadRequestError from "../errors/BadRequestError"

class TestController {
    private testService: TestService

    constructor() {
        this.testService = new TestService()
    }

    /**
     * `POST | http://0.0.0.0:0000/api/test`
     */
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as TestResourceQuery
            const body = req.body as TestResourceBody
            if (!body || Object.keys(body).length === 0) {
                next(new BadRequestError("body is required!"))
                return
            }
            const result = await this.testService.create(body, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(201).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `PUT | http://0.0.0.0:0000/api/test/:id`
     */
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as TestResourceQuery
            const body = req.body as TestResourceBody
            if (!body || Object.keys(body).length === 0) {
                next(new BadRequestError("body is required!"))
                return
            }
            const result = await this.testService.update(id, body, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `PATCH | http://0.0.0.0:0000/api/test/:id`
     */
    public async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as TestResourceQuery
            const body = req.body as TestResourceBody
            if (!body || Object.keys(body).length === 0) {
                next(new BadRequestError("body is required!"))
                return
            }
            const result = await this.testService.patch(id, body, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/test`
     */
    public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as TestResourceQuery
            const result = await this.testService.read(query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/test/:id`
     */
    public async readOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as TestResourceQuery
            const result = await this.testService.readOne(id, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `DELETE | http://0.0.0.0:0000/api/test/:id`
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as TestResourceQuery
            await this.testService.delete(id, query)
            res.sendStatus(204)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/test/_`
     */
    public async __test__(_: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const testService = this.testService.__test__()
            if (testService) {
                res.sendStatus(200)
                return
            } else {
                res.sendStatus(500)
                return
            }
        } catch (error: unknown) {
            next(error)
        }
    }
}

export default TestController
