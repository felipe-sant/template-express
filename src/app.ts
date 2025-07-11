import express from 'express';
import cors from 'cors';
import exampleRoutes from './routes/Example.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', exampleRoutes)

export default app