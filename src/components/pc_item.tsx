import { PingResult, Server } from "@/types/server"
import { invoke } from "@tauri-apps/api/core"
import { error, info } from "@tauri-apps/plugin-log"
import { useEffect, useState } from "react"

interface Props {
    server: Server
}

// export type Server = {
//     serverName: string
//     ip_domain: string
//     protocol: string
//     port: number
//     timeMilliseconds: number
//     notify: boolean
// }

export default function ItemPC(props: Props) {
    const { server } = props
    const [online, setOnline] = useState<boolean>(false)

    useEffect(() => {
        const checkOnline = async () => {
            try {
                const result = await invoke<PingResult>("ping_server", {
                    domain: server.serverName,
                    ip: server.ip_domain,
                    protocol: server.protocol,
                    port: server.port
                })
                setOnline(result.success)
                info(`success: ${result.success} result : ${result.rtt}`)
            } catch (err) {
                error("Error trying to get results ")
                setOnline(false)
            }
        }
        checkOnline()
        const interval = setInterval(checkOnline, server.timeMilliseconds)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div>
                <span>{server.serverName}</span>
                <span
                    aria-label={online ? "online" : "offline"}
                    className={`inline-block h-3 w-3 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`}
                />
            </div>
        </>
    )
}
