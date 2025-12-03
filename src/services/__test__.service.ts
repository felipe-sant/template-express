class TestService {
    create(body: unknown, query?: unknown) {
        return {
            message: "Resource created successfully!",
            query: query,
            body: body
        }
    }

    read(query?: unknown) {
        return {
            message: "Retrieved resources successfully!",
            query: query
        }
    }

    readOne(id: string, query?: unknown) {
        return {
            message: `Retrieved resource with ID ${id} successfully!`,
            query: query
        }
    }

    update(id: string, body: unknown, query?: unknown) {
        return {
            message: `Updated resource with ID ${id} successfully!`,
            query: query,
            body: body
        }
    }

    patch(id: string, body: unknown, query?: unknown) {
        return {
            message: `Patched resource with ID ${id} successfully!`,
            query: query,
            body: body
        }
    }

    delete(id: string, query?: unknown) {
        return {
            message: `Deleted resource with ID ${id} successfully!`,
            query: query
        }
    }

    public __test__() {
        return true
    }
}

export default TestService