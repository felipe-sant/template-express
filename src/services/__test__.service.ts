import {
    TestResourceBody,
    TestResourceQuery,
    TestResourceResponse,
} from "../types/testResource.types"

class TestService {
    create(body: TestResourceBody, query?: TestResourceQuery): TestResourceResponse {
        return {
            message: "Resource created successfully!",
            query: query,
            body: body,
        }
    }

    read(query?: TestResourceQuery): TestResourceResponse {
        return {
            message: "Retrieved resources successfully!",
            query: query,
        }
    }

    readOne(id: string, query?: TestResourceQuery): TestResourceResponse {
        return {
            message: `Retrieved resource with ID ${id} successfully!`,
            query: query,
        }
    }

    update(id: string, body: TestResourceBody, query?: TestResourceQuery): TestResourceResponse {
        return {
            message: `Updated resource with ID ${id} successfully!`,
            query: query,
            body: body,
        }
    }

    patch(id: string, body: TestResourceBody, query?: TestResourceQuery): TestResourceResponse {
        return {
            message: `Patched resource with ID ${id} successfully!`,
            query: query,
            body: body,
        }
    }

    delete(id: string, query?: TestResourceQuery): TestResourceResponse {
        return {
            message: `Deleted resource with ID ${id} successfully!`,
            query: query,
        }
    }

    public __test__(): boolean {
        return true
    }
}

export default TestService
