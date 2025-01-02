import { Router } from 'express';
import ExampleController from '../controllers/example.controller';

const router = Router();
const exampleController = new ExampleController();

router.post('/example', exampleController.create.bind(exampleController));
router.get('/example', exampleController.read.bind(exampleController));
router.get('/example/:id', exampleController.readOne.bind(exampleController));
router.put('/example/:id', exampleController.update.bind(exampleController));
router.patch('/example/:id', exampleController.patch.bind(exampleController));
router.delete('/example/:id', exampleController.delete.bind(exampleController));

export default router;