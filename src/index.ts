import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    const obj = {
        message: "Hello, World!"
    }
    res.status(200).json(obj);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});