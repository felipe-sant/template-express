export interface RequestLogEntry {
    date: string
    method: string
    url: string
    status: number
    duration: string
    ip: string | undefined
    userAgent: string | undefined
    requestId: string
}
