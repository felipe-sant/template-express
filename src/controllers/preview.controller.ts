import { Request, Response, NextFunction } from "express"
import PreviewService from "../services/preview.service"
import { PreviewBody, PreviewQuery } from "../types/preview.types"
import { SuccessResponseBody } from "../types/successResponse.types"
import BadRequestError from "../errors/BadRequestError"
import AppError from "../errors/AppError"

class PreviewController {
    private previewService: PreviewService

    constructor() {
        this.previewService = new PreviewService()
    }

    /**
     * `POST | http://0.0.0.0:0000/api/preview`
     */
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as PreviewQuery
            const body = req.body as PreviewBody
            if (!body || Object.keys(body).length === 0) {
                next(new BadRequestError("body is required!"))
                return
            }
            const result = await this.previewService.create(body, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(201).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `PUT | http://0.0.0.0:0000/api/preview/:id`
     */
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as PreviewQuery
            const body = req.body as PreviewBody
            if (!body || Object.keys(body).length === 0) {
                next(new BadRequestError("body is required!"))
                return
            }
            const result = await this.previewService.update(id, body, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `PATCH | http://0.0.0.0:0000/api/preview/:id`
     */
    public async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as PreviewQuery
            const body = req.body as PreviewBody
            if (!body || Object.keys(body).length === 0) {
                next(new BadRequestError("body is required!"))
                return
            }
            const result = await this.previewService.patch(id, body, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/preview`
     */
    public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as PreviewQuery
            const result = await this.previewService.read(query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/preview/:id`
     */
    public async readOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as PreviewQuery
            const result = await this.previewService.readOne(id, query)
            const response: SuccessResponseBody<typeof result> = { data: result }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `DELETE | http://0.0.0.0:0000/api/preview/:id`
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if (!id) {
                next(new BadRequestError("id is required!"))
                return
            }

            const query = req.query as PreviewQuery
            await this.previewService.delete(id, query)
            res.sendStatus(204)
        } catch (error: unknown) {
            next(error)
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/preview/_`
     */
    public async healthCheck(_: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const previewService = this.previewService.healthCheck()
            if (!previewService) {
                next(new AppError("Preview service is unavailable", 500, "INTERNAL_SERVER_ERROR"))
                return
            }
            const response: SuccessResponseBody<typeof previewService> = { data: previewService }
            res.status(200).json(response)
        } catch (error: unknown) {
            next(error)
        }
    }
}

export default PreviewController
