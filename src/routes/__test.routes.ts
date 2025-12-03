import { Router } from 'express'
import TestController from "../controllers/__test.controller";

class TestRoutes {
    private testController: TestController
    private router: Router = Router()

    private url_test: string = "/"

    constructor() {
        this.testController = new TestController()

        // adicionar rotas aqui

        this.router.get(
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