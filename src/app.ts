import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import exampleRoutes from './routes/Example.routes'
import swaggerSpec, { swaggerDarkThemeCss } from './config/swagger.config'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => { res.redirect('/docs') })
app.use('/api', exampleRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
    customCss: swaggerDarkThemeCss,
    customSiteTitle: 'Documentação',
    swaggerOptions: {
        spec: swaggerSpec
    },
}))

export default app