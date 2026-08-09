import { PreviewBody, PreviewQuery, PreviewResponse } from "../types/preview.types"

class PreviewService {
    create(body: PreviewBody, query?: PreviewQuery): PreviewResponse {
        return {
            message: "Resource created successfully!",
            query: query,
            body: body,
        }
    }

    read(query?: PreviewQuery): PreviewResponse {
        return {
            message: "Retrieved resources successfully!",
            query: query,
        }
    }

    readOne(id: string, query?: PreviewQuery): PreviewResponse {
        return {
            message: `Retrieved resource with ID ${id} successfully!`,
            query: query,
        }
    }

    update(id: string, body: PreviewBody, query?: PreviewQuery): PreviewResponse {
        return {
            message: `Updated resource with ID ${id} successfully!`,
            query: query,
            body: body,
        }
    }

    patch(id: string, body: PreviewBody, query?: PreviewQuery): PreviewResponse {
        return {
            message: `Patched resource with ID ${id} successfully!`,
            query: query,
            body: body,
        }
    }

    delete(id: string, query?: PreviewQuery): PreviewResponse {
        return {
            message: `Deleted resource with ID ${id} successfully!`,
            query: query,
        }
    }

    public healthCheck(): boolean {
        return true
    }
}

export default PreviewService
