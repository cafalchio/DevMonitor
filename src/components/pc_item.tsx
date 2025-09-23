import { PingResult, ServerPC } from "@/types/server"
import { ComputerDesktopIcon } from "@heroicons/react/24/outline"
import { invoke } from "@tauri-apps/api/core"
import { error, info } from "@tauri-apps/plugin-log"
import { useEffect, useState } from "react"

interface Props {
    server: ServerPC
}

export default function ItemPC(props: Props) {
    const { server } = props
    const [online, setOnline] = useState<boolean>(false)

    useEffect(() => {
        const checkOnline = async () => {
            try {
                const result = await invoke<PingResult>("ping_server", {
                    domain: server.ip_domain,
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
        <a
            href={"#"}
            className="mx-auto block w-4/5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
            <div className="flex items-center gap-4">
                <ComputerDesktopIcon className="h-8 w-8 text-gray-500 dark:text-gray-300" />
                <h5 className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {server.serverName}
                    <span
                        className={`inline-block h-3 w-3 rounded-full ${
                            online ? "bg-green-500" : "bg-red-500"
                        }`}
                    />
                </h5>
            </div>
        </a>
    )
}
