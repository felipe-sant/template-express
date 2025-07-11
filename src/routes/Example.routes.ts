import { Router } from 'express'
import ExampleController from '../controllers/Example.controller'

const router = Router()
const exampleController = new ExampleController()

router.post(
    '/example/post',
    exampleController.create.bind(exampleController)
)

router.get(
    '/example/get',
    exampleController.read.bind(exampleController)
)

router.get(
    '/example/get/:id',
    exampleController.readOne.bind(exampleController)
)

router.put(
    '/example/put/:id',
    exampleController.update.bind(exampleController)
)

router.patch(
    '/example/patch/:id',
    exampleController.patch.bind(exampleController)
)

router.delete(
    '/example/delete/:id',
    exampleController.delete.bind(exampleController)
)

router.get(
    '/example',
    exampleController.__test__.bind(exampleController)
)



export default router