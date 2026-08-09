import { Router } from "express"
import PreviewController from "../controllers/preview.controller"

class PreviewRoutes {
    private previewController: PreviewController
    private router: Router = Router()

    private url: string = "/"
    private url_id: string = "/:id"
    private url_test: string = "/_"

    constructor() {
        this.previewController = new PreviewController()

        // `POST | http://0.0.0.0:0000/api/preview`
        this.router.post(this.url, this.previewController.create.bind(this.previewController))

        // `PUT | http://0.0.0.0:0000/api/preview/:id`
        this.router.put(this.url_id, this.previewController.update.bind(this.previewController))

        // `PATCH | http://0.0.0.0:0000/api/preview/:id`
        this.router.patch(this.url_id, this.previewController.patch.bind(this.previewController))

        // `GET | http://0.0.0.0:0000/api/preview`
        this.router.get(this.url, this.previewController.read.bind(this.previewController))

        // `GET | http://0.0.0.0:0000/api/preview/:id`
        this.router.get(this.url_id, this.previewController.readOne.bind(this.previewController))

        // `DELETE | http://0.0.0.0:0000/api/preview/:id`
        this.router.delete(this.url_id, this.previewController.delete.bind(this.previewController))

        // `GET | http://0.0.0.0:0000/api/preview/_`
        this.router.get(
            this.url_test,
            this.previewController.healthCheck.bind(this.previewController),
        )
    }

    public getRouter(): Router {
        return this.router
    }
}

const previewRoutes = new PreviewRoutes().getRouter()
export default previewRoutes
