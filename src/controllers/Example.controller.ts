import { Request, Response } from 'express'
import { ExampleService } from '../services/Example.service'
import getErrorMessage from '../utils/getMessageError'

class ExampleController {
    private exampleService: ExampleService

    constructor() {
        this.exampleService = new ExampleService()
    }

    /**
     * `POST | http://0.0.0.0:0000/api/example/post`
     * @param req Possui parametros de Query e Body.
     * @returns Retorna se o objeto foi criado com sucesso.
     * @description Rota de exemplo para criar objetos.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const body = req.body as unknown
            if (!body || Object.keys(body).length === 0) {
                res.status(400).json({ message: req.t("body_is_required") })
                return
            }
            const result = this.exampleService.create(body, query)
            res.status(201).json(result)
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/example/get`
     * @param req Possui parametros de Query.
     * @returns Retorna todos os objetos.
     * @description Rota de exemplo para pegar varios os objetos.
     */
    async read(req: Request, res: Response): Promise<void> {
        try {
            const query = req.query
            const result = this.exampleService.read(query)
            res.status(200).json(result)
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/example/get/:id`
     * @param req Possui parametros de ID e Query.
     * @returns Retorna o objeto referente ao ID.
     * @description Rota de exemplo para pegar um objeto especifico.
     */
    async readOne(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            if (!id) {
                res.status(400).json({ message: req.t("body_is_required") })
                return
            }
            const result = this.exampleService.readOne(id, query)
            if (!result) {
                res.status(404).json({ message: req.t("object_not_found") })
                return
            }
            res.status(200).json(result)
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }

    /**
     * `PUT | http://0.0.0.0:0000/api/example/put/:id`
     * @param req Possui parametros de ID, Query e Body.
     * @returns Retorna se o objeto foi atualizado com sucesso ou erro.
     * @description Rota de exemplo para atualizar um objeto.
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            const body = req.body as unknown
            if (!id) {
                res.status(400).json({ message: req.t("id_is_required") })
                return
            }
            if (!body || Object.keys(body).length === 0) {
                res.status(400).json({ message: req.t("body_is_required") })
                return
            }
            const result = this.exampleService.update(id, body, query)
            if (!result) {
                res.status(404).json({ message: req.t("object_not_found") })
                return
            }
            res.status(200).json(result)
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }

    /**
     * `PATCH | http://0.0.0.0:0000/api/example/patch/:id`
     * @param req Possui paramentos de ID, Query e Body.
     * @returns Retorna se o objeto foi atualizado com sucesso ou erro.
     * @description Rota de exemplo para atualizar uma pequena parte do objeto.
     */
    async patch(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            const body = req.body as unknown
            if (!id) {
                res.status(400).json({ message: req.t("id_is_required") })
                return
            }
            if (!body || Object.keys(body).length === 0) {
                res.status(400).json({ message: req.t("body_is_required") })
                return
            }
            const result = this.exampleService.patch(id, body, query)
            if (!result) {
                res.status(404).json({ message: req.t("object_not_found") })
                return
            }
            res.status(200).json(result)
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }

    /**
     * `DELETE | http://0.0.0.0:0000/api/example/delete/:id`
     * @param req Possui paramentros de ID e Query.
     * @returns Retorna se o objeto foi deletado com sucesso ou erro.
     * @description Rota de exemplo para deletar um objeto.
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const query = req.query
            if (!id) {
                res.status(400).json({ message: req.t("id_is_required") })
                return
            }
            const result = this.exampleService.delete(id, query)
            if (!result) {
                res.status(404).json({ message: req.t("object_not_found") })
                return
            }
            res.status(204).json(result)
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }

    /**
     * `GET | http://0.0.0.0:0000/api/example`
     * @description Teste de funcionamento da rota.
     */
    async __test__(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json({
                message: req.t("successful_route_connection")
            })
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error)
            res.status(500).json({ message: errorMessage })
        }
    }
}

export default ExampleController