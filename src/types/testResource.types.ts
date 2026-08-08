export interface TestResourceBody {
    [key: string]: unknown
}

export interface TestResourceQuery {
    [key: string]: string
}

export interface TestResourceResponse {
    message: string
    query?: TestResourceQuery
    body?: TestResourceBody
}
