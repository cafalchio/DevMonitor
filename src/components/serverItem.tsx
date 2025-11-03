import { Badge } from "@/components/ui/badge"
import { deleteServer } from "@/lib/db"
import { notify } from "@/lib/utils"
import { PingResult, ServerPC } from "@/types/server"
import { invoke } from "@tauri-apps/api/core"
import { error, info } from "@tauri-apps/plugin-log"
import { Minus, Wifi } from "lucide-react"
import { useEffect, useState } from "react"

interface ServerItemsProps {
    server: ServerPC
    reloaded: boolean
    setReloaded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ServerItem({
    server,
    reloaded,
    setReloaded
}: ServerItemsProps) {
    const [online, setOnline] = useState(false)
    const [loading, setLoading] = useState(true)
    const [notifyOffline, setNotifyOffline] = useState(false)
    const [responseTime, setResponseTime] = useState<number | null>(null)

    useEffect(() => {
        const checkOnline = async () => {
            try {
                const start = Date.now()
                const result = await invoke<PingResult>("ping_server", {
                    domain: server.ip_domain,
                    ip: server.ip_domain,
                    protocol: server.protocol,
                    port: server.port
                })

                setOnline(result.success)
                setResponseTime(Date.now() - start)
                setLoading(false)
                info(`Ping: ${server.serverName} => ${result.success}`)
                setNotifyOffline(true)
            } catch {
                error(`Ping failed: ${server.serverName}`)
                setOnline(false)
                setResponseTime(null)
                setLoading(false)
                if (notifyOffline) {
                    notify(
                        `${server.serverName} Offline`,
                        `${server.serverName} - ${server.ip_domain}`
                    )
                    setNotifyOffline(false)
                }
            }
        }

        checkOnline()
        const interval = setInterval(checkOnline, server.timeMilliseconds)
        return () => clearInterval(interval)
    }, [server])

    return (
        <div className="group flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-2 shadow-sm transition-all duration-200 hover:shadow-md">
            {/* Left Section */}
            <div className="flex min-w-0 items-center gap-4">
                {/* Server Icon */}
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                        online
                            ? "bg-green-50 text-green-600"
                            : loading
                              ? "bg-gray-100 text-gray-400"
                              : "bg-red-50 text-red-600"
                    }`}
                >
                    <Wifi className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium text-gray-900">
                            {server.serverName}
                        </h3>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        {responseTime && <span>{responseTime}ms</span>}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                <Badge
                    className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                        loading
                            ? "border-gray-200 bg-gray-100 text-gray-600"
                            : online
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                    {loading ? "Checking..." : online ? "Online" : "Offline"}
                </Badge>

                <button
                    onClick={() =>
                        deleteServer(server.serverName, setReloaded, reloaded)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-full text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Delete server"
                >
                    <Minus className="h-3.5 w-3.5 stroke-[2]" />
                </button>
            </div>
        </div>
    )
}
