export interface PreviewBody {
    [key: string]: unknown
}

export interface PreviewQuery {
    [key: string]: string
}

export interface PreviewResponse {
    message: string
    query?: PreviewQuery
    body?: PreviewBody
}
