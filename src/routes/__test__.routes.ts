import { Router } from 'express'
import TestController from "../controllers/__test__.controller";

class TestRoutes {
    private testController: TestController
    private router: Router = Router()

    private url: string = "/"
    private url_id: string = "/:id"
    private url_test: string = "/_"

    constructor() {
        this.testController = new TestController()

        // `POST | http://0.0.0.0:0000/api/test`
        this.router.post(
            this.url,
            this.testController.create.bind(this.testController)
        )

        // `PUT | http://0.0.0.0:0000/api/test/:id`
        this.router.put(
            this.url_id,
            this.testController.update.bind(this.testController)
        )

        // `GET | http://0.0.0.0:0000/api/test`
        this.router.get(
            this.url,
            this.testController.read.bind(this.testController)
        )

        // `GET | http://0.0.0.0:0000/api/test/:id`
        this.router.get(
            this.url_id,
            this.testController.readOne.bind(this.testController)
        )

        // `DELETE | http://0.0.0.0:0000/api/test/:id`
        this.router.delete(
            this.url_id,
            this.testController.delete.bind(this.testController)
        )

        // `GET | http://0.0.0.0:0000/api/test/_`
        this.router.propfind(
            this.url_test,
            this.testController.__test__.bind(this.testController)
        )
    }

    public getRouter() {
        return this.router
    }
}

const testRoutes = new TestRoutes().getRouter()
export default testRoutes