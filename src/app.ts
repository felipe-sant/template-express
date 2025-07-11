import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerDarkThemeCss } from './config/swagger.config'
import exampleRoutes from './routes/Example.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => { res.redirect('/docs') })
app.use('/api', exampleRoutes)

export default app