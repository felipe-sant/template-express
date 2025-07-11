import { Request, Response } from 'express';
import { ExampleService } from '../services/example.service';

class ExampleController {
    private exampleService: ExampleService;

    constructor() {
        this.exampleService = new ExampleService();
    }

    // POST api/example
    async create(req: Request, res: Response) {
        try {
            const query = req.query;
            const body = req.body;
            if (!body || Object.keys(body).length === 0) {
                return res.status(400).json({ message: 'Body is required' });
            }
            const result = this.exampleService.create(body, query);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET api/example
    async read(req: Request, res: Response) {
        try {
            const query = req.query;
            const result = this.exampleService.read(query);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // GET api/example/:id
    async readOne(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const query = req.query;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }
            const result = this.exampleService.readOne(id, query);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // PUT api/example/:id
    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const query = req.query;
            const body = req.body;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }
            if (!body || Object.keys(body).length === 0) {
                return res.status(400).json({ message: 'Body is required' });
            }
            const result = this.exampleService.update(id, query, body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // PATCH api/example/:id
    async patch(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const query = req.query;
            const body = req.body;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }
            if (!body || Object.keys(body).length === 0) {
                return res.status(400).json({ message: 'Body is required' });
            }
            const result = this.exampleService.patch(id, query, body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // DELETE api/example/:id
    async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const query = req.query;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }
            const result = this.exampleService.delete(id, query);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ExampleController;