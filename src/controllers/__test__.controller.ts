import { Request, Response } from "express";
import TestService from "../services/__test__.service";

class TestController {
    private testService: TestService

    constructor() {
        this.testService = new TestService()
    }

    /**
     * `POST | http://0.0.0.0:0000/api/test`
     */
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const body = req.body
            if (!body || Object.keys(body).length === 0) {
                res.status(400).json({ message: "body is required!" })
                return
            }
            const result = this.testService.create(body, query)
            res.status(201).json(result)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    /**
     * `PUT | http://0.0.0.0:0000/api/test/:id`
     */
    public async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            const body = req.body
            if (!body || Object.keys(body).length === 0) {
                res.status(400).json({ message: "body is required!" })
                return
            }
            const result = this.testService.update(id, body, query)
            res.status(200).json(result)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/test`
     */
    public async read(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const result = this.testService.read(query)
            res.status(200).json(result)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/test/:id`
     */
    public async readOne(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            const result = this.testService.readOne(id, query)
            res.status(200).json(result)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    /**
     * `DELETE | http://0.0.0.0:0000/api/test/:id`
     */
    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            const result = this.testService.delete(id, query)
            res.status(204).json(result)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/test/_`
     */
    public async __test__(_: Request, res: Response) {
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
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default TestController