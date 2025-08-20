export type ServerCall = {
    domain: string
    ip: string
    protocol: string
    port: number
}

export type Server = {
    serverName: string
    ip: string
    protocol: string
    port: number
    timeMilliseconds: number
    notify: boolean
}

export type PingResult = {
    success: boolean
    rtt: number
}
