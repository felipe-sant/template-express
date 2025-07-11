import express from 'express';
import cors from 'cors';
import exampleRoutes from './routes/example.routes';

const app = express();
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json());

app.use('/api', exampleRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});