export class ExampleService {
    create(body: any, query: any) {
        return {
            message: "Resource created successfully!",
            query: query,
            body: body
        };
    }

    read(query: any) {
        return {
            message: "Retrieved resources successfully!",
            query: query
        };
    }

    readOne(id: string, query: any) {
        return {
            message: `Retrieved resource with ID ${id} successfully!`,
            query: query
        };
    }

    update(id: string, query: any, body: any) {
        return {
            message: `Updated resource with ID ${id} successfully!`,
            query: query,
            body: body
        };
    }

    patch(id: string, query: any, body: any) {
        return {
            message: `Patched resource with ID ${id} successfully!`,
            query: query,
            body: body
        };
    }

    delete(id: string, query: any) {
        return {
            message: `Deleted resource with ID ${id} successfully!`,
            query: query
        };
    }
}