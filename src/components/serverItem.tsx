import { Badge } from "@/components/ui/badge"
import { deleteServer } from "@/lib/db"
import { PingResult, ServerPC } from "@/types/server"
import { invoke } from "@tauri-apps/api/core"
import { error, info } from "@tauri-apps/plugin-log"
import { AlertTriangle, Clock, Server, Wifi, WifiOff } from "lucide-react"
import { useEffect, useState } from "react"

export default function ServerItem({ server }: { server: ServerPC }) {
    const [online, setOnline] = useState(false)
    const [loading, setLoading] = useState(true)
    const [lastChecked, setLastChecked] = useState<Date | null>(null)
    const [responseTime, setResponseTime] = useState<number | null>(null)

    useEffect(() => {
        const checkOnline = async () => {
            try {
                const startTime = Date.now()
                const result = await invoke<PingResult>("ping_server", {
                    domain: server.ip_domain,
                    ip: server.ip_domain,
                    protocol: server.protocol,
                    port: server.port
                })

                const endTime = Date.now()
                setResponseTime(endTime - startTime)
                setOnline(result.success)
                setLastChecked(new Date())
                setLoading(false)

                info(`Ping: ${server.serverName} => ${result.success}`)
            } catch {
                error(`Ping failed: ${server.serverName}`)
                setOnline(false)
                setResponseTime(null)
                setLastChecked(new Date())
                setLoading(false)
            }
        }

        checkOnline()
        const interval = setInterval(checkOnline, server.timeMilliseconds)
        return () => clearInterval(interval)
    }, [server])

    const getStatusIcon = () => {
        if (loading)
            return (
                <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
            )
        if (online) return <Wifi className="h-4 w-4 text-green-600" />
        return <WifiOff className="h-4 w-4 text-red-600" />
    }

    const getProtocolDisplay = () => {
        return `${server.protocol.toUpperCase()}${server.port ? `:${server.port}` : ""}`
    }

    const formatLastChecked = () => {
        if (!lastChecked) return "Never"
        const diff = Date.now() - lastChecked.getTime()
        if (diff < 60000) return "Just now"
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        return lastChecked.toLocaleTimeString()
    }

    return (
        <div className="group p-6 transition-all duration-200 hover:bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    {/* Server Icon */}
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${online ? "bg-green-100 text-green-700" : loading ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-700"} `}
                    >
                        <Server className="h-6 w-6" />
                    </div>

                    {/* Server Details */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                            <h3 className="truncate font-semibold text-gray-900">
                                {server.serverName.slice(0, 20)}
                            </h3>
                            {server.notify && (
                                <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="truncate">{server.ip_domain}</span>
                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                {getProtocolDisplay()}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Last checked: {formatLastChecked()}</span>
                            </div>
                            {responseTime && (
                                <span className="flex items-center gap-1">
                                    <span>Response: {responseTime}ms</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="flex flex-shrink-0 items-center gap-3">
                    {getStatusIcon()}
                    <Badge
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                            loading
                                ? "border-gray-200 bg-gray-100 text-gray-600"
                                : online
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : "border-red-200 bg-red-50 text-red-700"
                        } `}
                    >
                        {loading
                            ? "Checking..."
                            : online
                              ? "Online"
                              : "Offline"}
                    </Badge>
                    <Badge
                        onClick={() => deleteServer(server.serverName)}
                        className="font-mediumborder-red-200 rounded-full border border-gray-200 bg-red-50 px-3 py-1 text-xs text-red-700"
                    >
                        Delete
                    </Badge>
                </div>
            </div>
        </div>
    )
}
