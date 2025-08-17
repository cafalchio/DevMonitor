import { PingResult, ServerCall } from "@/types/server"
import { invoke } from "@tauri-apps/api/core"
import { error, info } from "@tauri-apps/plugin-log"
import { useEffect, useState } from "react"

interface Props {
    serverName: string
    timePingMs: number
    Call: ServerCall
}

export default function ItemPC(props: Props) {
    const { serverName, timePingMs: timeToPing, Call } = props
    const [online, setOnline] = useState<boolean>(false)

    useEffect(() => {
        const checkOnline = async () => {
            try {
                const result = await invoke<PingResult>("ping_server", {
                    domain: Call.domain,
                    ip: Call.ip,
                    protocol: Call.protocol,
                    port: Call.port
                })
                setOnline(result.success)
                info(`success: ${result.success} result : ${result.rtt}`)
            } catch (err) {
                error("Error trying to get results ")
                setOnline(false)
            }
        }
        checkOnline()
        const interval = setInterval(checkOnline, timeToPing)
        return () => clearInterval(interval) // cleanup on unmount
    }, [])

    return (
        <>
            <div>
                <span>{serverName}</span>
                <span
                    aria-label={online ? "online" : "offline"}
                    className={`inline-block h-3 w-3 rounded-full ${online ? "bg-green-500" : "bg-red-500"}`}
                />
            </div>
        </>
    )
}
