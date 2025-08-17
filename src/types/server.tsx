export type ServerCall = {
    domain: string
    ip: string
    protocol: string
    port: number
}

export type PingResult = {
    success: boolean
    rtt: number
}
