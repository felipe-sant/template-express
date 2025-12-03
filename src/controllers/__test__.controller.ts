import { Request, Response } from "express";
import TestService from "../services/__test__.service";

class TestController {
    private testService: TestService

    constructor() {
        this.testService = new TestService()
    }

    public __test__(_: Request, res: Response) {
        try {
            const testService = this.testService.__test__()
            if (testService) {
                res.sendStatus(200)
                return
            } else {
                res.sendStatus(500)
                return
            }
        } catch (error) {
            console.error("Erro no teste controller:", error)
            res.sendStatus(500)
        }
    }
}

export default TestController