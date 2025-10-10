import ItemPC from "@/components/serverItem"
import { getDB } from "@/lib/db"
import useConnectionStore from "@/stores/connection"
import { ServerPC } from "@/types/server"
import { useEffect, useState } from "react"

function Home() {
    const { isOnline, checkOnline } = useConnectionStore()
    const [serversList, setServersList] = useState<ServerPC[]>([])
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState<string | null>(null)

    useEffect(() => {
        checkOnline()
    }, [checkOnline])

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            try {
                const db = await getDB()

                type Row = {
                    serverName: string
                    ip_domain: string
                    protocol: string
                    port: number
                    timeMilliseconds: number
                    notify: number // 0/1 in DB
                }

                const rows = await db.select<Row[]>(
                    `SELECT serverName, ip_domain, protocol, port, timeMilliseconds, notify FROM servers ORDER BY serverName`
                )
                console.log(rows)
                if (!cancelled) {
                    const data: ServerPC[] = rows.map((r: Row) => ({
                        serverName: r.serverName,
                        ip_domain: r.ip_domain,
                        protocol: r.protocol as ServerPC["protocol"],
                        port: r.port,
                        timeMilliseconds: r.timeMilliseconds,
                        notify: Boolean(r.notify)
                    }))
                    setServersList(data)
                }
            } catch (e) {
                if (!cancelled)
                    setErr(e instanceof Error ? e.message : String(e))
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div className="pt-safe-top pb-safe-bottom flex flex-col gap-4 overflow-y-auto px-4">
            {/* Online/Offline Status */}
            <div className="text-md flex items-center justify-start gap-2 font-bold">
                <span>{isOnline ? "" : "System Offline!"}</span>
            </div>

            {/* Loading/Error */}
            {loading && <div className="text-gray-500">Loading servers…</div>}
            {err && (
                <div className="font-medium text-red-600">
                    Failed to load: {err}
                </div>
            )}

            {/* Servers List */}
            <div className="flex flex-col gap-4">
                {serversList.map((server) => (
                    <ItemPC
                        key={`${server.serverName}-${server.ip_domain}`}
                        server={server}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
