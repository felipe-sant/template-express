import { Router } from 'express'
import ExampleController from '../controllers/Example.controller'

const router = Router()
const exampleController = new ExampleController()

/**
 * /api/example/post:
 *      post:
 *          summary: Cria um objeto.
 *          description: Rota de exemplo de POST para criar um objeto.
 *          tags:
 *              - Exemplos
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              example:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Objeto atualizado com sucesso
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: 'Resource created successfully!'
 *              500:
 *                  description: Erro
 */
router.post(
    '/example/post',
    exampleController.create.bind(exampleController)
)

/**
 * @openapi
 * /api/example/get:
 *      get:
 *          summary: Pega varios objetos.
 *          description: Rota de exemplo de GET para pegar varios objetos.
 *          tags:
 *              - Exemplos
 *          parameters:
 *              - in: query
 *                name: amount
 *                required: false
 *                schema:
 *                  type: number
 *          responses:
 *              200:
 *                  description: Objetos encontrados com sucesso
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                          example: 'user123'
 *                                      example: 
 *                                          type: string
 *                                          example: 'test'
 *              404:
 *                  description: Objetos não encontrados
 *              500:
 *                  description: Erro
 */
router.get(
    '/example/get',
    exampleController.read.bind(exampleController)
)

/**
 * @openapi
 * /api/example/get/{id}:
 *      get:
 *          summary: Pega um objeto.
 *          description: Rota de exemplo de GET para pegar um objeto especifico.
 *          tags:
 *              - Exemplos
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: Objeto encontrado com sucesso
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                      example: 'user123'
 *                                  example: 
 *                                      type: string
 *                                      example: 'test'
 *              400:
 *                  description: ID é obrigatório
 *              404:
 *                  description: Objeto não encontrado
 *              500:
 *                  description: Erro
 */
router.get(
    '/example/get/:id',
    exampleController.readOne.bind(exampleController)
)

/**
 * @openapi
 * /api/example/put/{id}:
 *      put:
 *          summary: Atualiza um objeto.
 *          description: Rota de exemplo de PUT para atualizar um objeto.
 *          tags:
 *              - Exemplos
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              example:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Objeto atualizado com sucesso
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: 'Updated resource with ID 8 successfully!'
 *              400:
 *                  description: ID e Body é obrigatório
 *              404:
 *                  description: Objeto não encontrado
 *              500:
 *                  description: Erro
 */
router.put(
    '/example/put/:id',
    exampleController.update.bind(exampleController)
)

/**
 * @openapi
 * /api/example/patch/{id}:
 *      patch:
 *          summary: Atualiza uma pequena parte do objeto.
 *          description: Rota de exemplo de PATCH para atualizar uma pequena parte de objeto.
 *          tags:
 *              - Exemplos
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              example:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Objeto atualizado com sucesso
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: 'Patched resource with ID 12 successfully!'
 *              400:
 *                  description: ID e Body é obrigatório
 *              404:
 *                  description: Objeto não encontrado
 *              500:
 *                  description: Erro
 */
router.patch(
    '/example/patch/:id',
    exampleController.patch.bind(exampleController)
)

/**
 * @openapi
 * /api/example/delete/{id}:
 *      delete:
 *          summary: Deleta um objeto.
 *          description: Rota de exemplo de DELETE para apagar um algum objeto.
 *          tags: 
 *              - Exemplos
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                  type: string
 *          responses:
 *              204:
 *                  description: Objeto deletado com sucesso
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: 'Deleted resource with ID 42 successfully!'
 */
router.delete(
    '/example/delete/:id',
    exampleController.delete.bind(exampleController)
)

/**
 * @openapi
 * /api/example:
 *      get:
 *          summary: Teste de conectividade
 *          description: Rota para testar se as rotas `/example` estão funcionando.
 *          tags:
 *              - Exemplos
 *          responses:
 *              200:
 *                  description: Sucesso ao conectar com a rota
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      example: 'Rota funcionando!'
 *              500:
 *                  description: Erro
 */
router.get(
    '/example',
    exampleController.__test__.bind(exampleController)
)



export default router